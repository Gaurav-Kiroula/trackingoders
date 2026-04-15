import { CheckCircle2, PartyPopper } from "lucide-react";
import type { StatusEvent } from "../types";

interface DeliveredBannerProps {
  statusHistory: StatusEvent[];
  trackingCode?: string;
}

export default function DeliveredBanner({
  statusHistory,
  trackingCode,
}: DeliveredBannerProps) {
  // Find the delivery event timestamp
  const deliveryEvent = [...statusHistory]
    .reverse()
    .find((e) => e.status === "delivered");
  const deliveredAt = deliveryEvent
    ? new Date(Number(deliveryEvent.timestamp)).toLocaleString()
    : null;

  return (
    <div
      className="relative rounded-2xl overflow-hidden border-2 p-6 text-center space-y-3"
      style={{
        borderColor: "oklch(0.55 0.18 145)",
        background: "oklch(0.55 0.18 145 / 0.08)",
      }}
      data-ocid="delivered.banner"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, oklch(0.55 0.18 145 / 0.12) 0%, transparent 60%), " +
            "radial-gradient(circle at 80% 50%, oklch(0.65 0.18 150 / 0.10) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative space-y-3">
        {/* Icon */}
        <div className="flex items-center justify-center gap-2">
          <PartyPopper
            className="w-6 h-6"
            style={{ color: "oklch(0.55 0.18 145)" }}
          />
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-elevated"
            style={{ background: "oklch(0.55 0.18 145)" }}
          >
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <PartyPopper
            className="w-6 h-6 scale-x-[-1]"
            style={{ color: "oklch(0.55 0.18 145)" }}
          />
        </div>

        {/* Heading */}
        <div>
          <h2
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.55 0.18 145)" }}
          >
            Package Delivered!
          </h2>
          {trackingCode && (
            <p className="text-sm text-muted-foreground mt-0.5 font-mono">
              {trackingCode}
            </p>
          )}
        </div>

        {/* Timestamp */}
        {deliveredAt && (
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
            style={{
              borderColor: "oklch(0.55 0.18 145 / 0.4)",
              background: "oklch(0.55 0.18 145 / 0.12)",
              color: "oklch(0.45 0.18 145)",
            }}
          >
            <CheckCircle2 className="w-3 h-3" />
            Delivered on {deliveredAt}
          </div>
        )}

        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Your shipment has been successfully delivered to its destination.
        </p>
      </div>
    </div>
  );
}
