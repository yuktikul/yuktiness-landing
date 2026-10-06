/**
 * Re-send signups that were queued while the CRM was unreachable.
 *   npm run queue:replay
 * Successful entries are moved to <queue>.done; failures stay in the queue.
 */
import { appendFile, readFile, writeFile } from "node:fs/promises";
import { postLeadToCrm } from "../src/lib/server/crm";
import { queueFile, type QueuedSignup } from "../src/lib/server/queue";

type Payload = { step1?: Record<string, unknown>; step2?: Record<string, unknown>; leadId?: string | null };

async function replay(entry: QueuedSignup): Promise<boolean> {
  const p = entry.payload as Payload;
  let leadId = p.leadId ?? null;

  // Create (or re-find, via the CRM's phone/email dedupe) the lead when we don't have an id.
  if (p.step1 && !leadId) {
    const r = await postLeadToCrm(p.step1);
    if (!r.ok) return false;
    leadId = r.data.leadId ?? null;
  }
  if (!p.step2) return true;
  if (!leadId) return false;

  const r = await postLeadToCrm({ ...p.step2, leadId });
  if (r.ok) return true;
  if (r.status === 404 && p.step1) {
    const c = await postLeadToCrm(p.step1);
    if (!c.ok || !c.data.leadId) return false;
    return (await postLeadToCrm({ ...p.step2, leadId: c.data.leadId })).ok;
  }
  return false;
}

async function main() {
  const file = queueFile();
  const text = await readFile(file, "utf8").catch(() => "");
  const entries = text
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as QueuedSignup);
  if (!entries.length) {
    console.log(`Nothing queued in ${file}`);
    return;
  }
  const failed: QueuedSignup[] = [];
  for (const e of entries) {
    if (await replay(e)) await appendFile(`${file}.done`, JSON.stringify({ ...e, replayedAt: new Date().toISOString() }) + "\n");
    else failed.push(e);
  }
  await writeFile(file, failed.map((e) => JSON.stringify(e)).join("\n") + (failed.length ? "\n" : ""));
  console.log(`Replayed ${entries.length - failed.length} of ${entries.length}; ${failed.length} still queued.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
