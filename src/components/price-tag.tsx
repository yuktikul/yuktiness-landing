import { pricing } from "@content/landing";

/** "₹499 ₹51": the regular price struck through, then the masterclass price. */
export function PriceTag({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-baseline gap-3 ${className}`}>
      {pricing.regularPrice && (
        <span className="text-xl font-medium text-mist line-through decoration-2">
          <span className="sr-only">{pricing.regularPriceLabel} </span>
          {pricing.regularPrice}
        </span>
      )}
      <span className="font-sans text-4xl font-bold text-amber">
        {pricing.regularPrice && <span className="sr-only">now </span>}
        {pricing.price}
      </span>
    </p>
  );
}
