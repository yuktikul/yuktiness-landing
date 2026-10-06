import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/** Where signups go when the CRM can't take them. Replay with `npm run queue:replay`. */
export const queueFile = () => path.resolve(process.env.SIGNUP_QUEUE_FILE || ".data/signup-queue.jsonl");

export type QueuedSignup = {
  at: string;
  kind: "partial" | "complete";
  reason: string;
  /** Exact CRM request bodies, in order (step 1 and/or step 2). */
  payload: Record<string, unknown>;
};

/**
 * Never lose a lead: always write to the server log (visible on any host), and also append
 * to a local JSON-lines file when the filesystem is writable.
 */
export async function enqueueFailedSignup(entry: Omit<QueuedSignup, "at">) {
  const line: QueuedSignup = { at: new Date().toISOString(), ...entry };
  console.error("[signup-queue] CRM unavailable, lead queued:", JSON.stringify(line));
  try {
    const file = queueFile();
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, JSON.stringify(line) + "\n", "utf8");
  } catch (err) {
    console.error("[signup-queue] could not write queue file (the log line above has the full lead):", err);
  }
}
