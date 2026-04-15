import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import DeliveredBanner from "../components/DeliveredBanner";
import MockMap from "../components/MockMap";
import { ShipmentStatusBadge } from "../components/StatusBadge";
import { useTrackShipment } from "../hooks/useBackend";
import { ShipmentStatus } from "../types";

const STATUS_STEPS = [
  ShipmentStatus.pending,
  ShipmentStatus.assigned,
  ShipmentStatus.pickedUp,
  ShipmentStatus.inTransit,
  ShipmentStatus.delivered,
];

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.pending]: "Order Placed",
  [ShipmentStatus.assigned]: "Driver Assigned",
  [ShipmentStatus.pickedUp]: "Picked Up",
  [ShipmentStatus.inTransit]: "In Transit",
  [ShipmentStatus.delivered]: "Delivered",
  [ShipmentStatus.failed]: "Failed",
};

function TrackResult({ code }: { code: string }) {
  const { data: shipment, isLoading, isError } = useTrackShipment(code);

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3"
        data-ocid="track.loading_state"
      >
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">
          Looking up your shipment…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3"
        data-ocid="track.error_state"
      >
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-foreground font-medium">Something went wrong</p>
        <p className="text-sm text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3"
        data-ocid="track.empty_state"
      >
        <Package className="w-12 h-12 text-muted-foreground" />
        <p className="text-foreground font-semibold">No shipment found</p>
        <p className="text-sm text-muted-foreground">
          Check your tracking code and try again.
        </p>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(shipment.currentStatus);
  const isFailed = shipment.currentStatus === ShipmentStatus.failed;
  const isDelivered = shipment.currentStatus === ShipmentStatus.delivered;
  const publicHistory = shipment.statusHistory.filter((e) => !e.staffOnly);

  return (
    <div className="space-y-5" data-ocid="track.result_card">
      {/* Delivered banner — prominent, top of results */}
      {isDelivered && (
        <DeliveredBanner
          statusHistory={shipment.statusHistory}
          trackingCode={shipment.trackingCode}
        />
      )}

      {/* Header */}
      {!isDelivered && (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-0.5">
              Tracking Code
            </p>
            <h2 className="text-xl font-bold font-display text-foreground tracking-wide">
              {shipment.trackingCode}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {shipment.itemDescription}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <ShipmentStatusBadge status={shipment.currentStatus} />
            {isDelivered && (
              <span
                className="inline-flex items-center gap-1 text-xs"
                style={{ color: "oklch(0.55 0.18 145)" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Delivered successfully
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress steps */}
      {!isFailed && !isDelivered && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-primary" />
            Delivery Progress
          </h3>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStepIdx;
              const active = i === currentStepIdx;
              return (
                <div
                  key={step}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 transition-colors ${
                      done
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-muted border-border text-muted-foreground"
                    } ${active ? "ring-2 ring-primary/30" : ""}`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 transition-colors ${
                        i < currentStepIdx ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {STATUS_STEPS.map((step) => (
              <span
                key={step}
                className="text-[10px] text-muted-foreground text-center"
                style={{ flex: 1 }}
              >
                {STATUS_LABELS[step]}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: details + timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Addresses */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-4 space-y-1.5">
              <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Pickup Address
              </h4>
              <p className="text-sm text-foreground leading-snug">
                {shipment.pickupAddress}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 space-y-1.5">
              <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Delivery Address
              </h4>
              <p className="text-sm text-foreground leading-snug">
                {shipment.deliveryAddress}
              </p>
            </div>
          </div>

          {/* Package info */}
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {shipment.itemDescription}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Weight: {shipment.weightKg} kg
              </p>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {shipment.customerName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {shipment.customerPhone}
              </p>
            </div>
          </div>

          {/* Status timeline */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Status Timeline
            </h3>
            {publicHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No updates yet. Check back soon.
              </p>
            ) : (
              <div className="space-y-3">
                {[...publicHistory].reverse().map((event, i) => (
                  <div
                    key={`${event.status}-${i}`}
                    className="flex items-start gap-3 text-sm"
                    data-ocid={`track.timeline.item.${i + 1}`}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{
                        background:
                          event.status === "delivered"
                            ? "oklch(0.55 0.18 145)"
                            : "var(--color-primary)",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground capitalize">
                        {STATUS_LABELS[event.status as ShipmentStatus] ??
                          event.status}
                      </span>
                      {event.note && (
                        <span className="text-muted-foreground ml-2">
                          — {event.note}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(Number(event.timestamp)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Mock map */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Live Location
            </h3>
            <MockMap
              currentCoords={shipment.lastGps}
              label={shipment.trackingCode}
              height="h-64"
              status={shipment.currentStatus}
              pickupAddress={shipment.pickupAddress}
              deliveryAddress={shipment.deliveryAddress}
            />
            {shipment.currentStatus === ShipmentStatus.inTransit && (
              <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                Live — updates every 20 seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  const { code } = useParams({ from: "/track/$code" });
  const [inputCode, setInputCode] = useState(code ?? "");
  const [activeCode, setActiveCode] = useState(code ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputCode.trim().toUpperCase();
    if (trimmed) setActiveCode(trimmed);
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="track.page"
    >
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            data-ocid="track.home_link"
          >
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Truck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display">FreightFlow</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="track.back_link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </header>

      {/* Hero search area */}
      <section className="bg-card border-b border-border py-10">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-3xl font-bold font-display text-foreground">
            Track Your Shipment
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your tracking code to see real-time status and location.
          </p>
          <form
            onSubmit={handleSearch}
            className="flex gap-2"
            data-ocid="track.search_form"
          >
            <Input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. FF-2024-001"
              className="font-mono uppercase"
              aria-label="Tracking code"
              data-ocid="track.search_input"
            />
            <Button
              type="submit"
              disabled={!inputCode.trim()}
              data-ocid="track.search_button"
            >
              <Search className="w-4 h-4 mr-1.5" />
              Track
            </Button>
          </form>
        </div>
      </section>

      {/* Result area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {activeCode ? (
          <TrackResult code={activeCode} />
        ) : (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
            data-ocid="track.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              No tracking code entered
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Enter the tracking code from your shipment confirmation email
              above.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
