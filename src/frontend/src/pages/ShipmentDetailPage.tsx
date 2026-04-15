import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  MapPin,
  Package,
  Phone,
  Play,
  Square,
  Truck,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import DeliveredBanner from "../components/DeliveredBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import MockMap from "../components/MockMap";
import { ShipmentStatusBadge } from "../components/StatusBadge";
import StatusUpdatePanel from "../components/StatusUpdatePanel";
import {
  useDrivers,
  useShipment,
  useUpdateGps,
  useVehicles,
} from "../hooks/useBackend";
import { ShipmentStatus } from "../types";

const STATUS_STEPS = [
  ShipmentStatus.pending,
  ShipmentStatus.assigned,
  ShipmentStatus.pickedUp,
  ShipmentStatus.inTransit,
  ShipmentStatus.delivered,
];

// Simulated GPS bounding box (roughly central London area as a demo)
const GPS_BOUNDS = {
  pickup: { lat: 51.505, lng: -0.12 },
  delivery: { lat: 51.52, lng: -0.08 },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function ShipmentDetailPage() {
  const { id } = useParams({ from: "/shipments/$id" });
  const shipmentId = BigInt(id);
  const { data: shipment, isLoading } = useShipment(shipmentId);
  const { data: drivers = [] } = useDrivers();
  const { data: vehicles = [] } = useVehicles();
  const updateGps = useUpdateGps();

  const [simActive, setSimActive] = useState(false);
  const [simT, setSimT] = useState(0);
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tRef = useRef(0);

  const pushSimGps = useCallback(() => {
    tRef.current = Math.min(tRef.current + 0.04, 1);
    setSimT(tRef.current);
    const lat = lerp(
      GPS_BOUNDS.pickup.lat,
      GPS_BOUNDS.delivery.lat,
      tRef.current,
    );
    const lng = lerp(
      GPS_BOUNDS.pickup.lng,
      GPS_BOUNDS.delivery.lng,
      tRef.current,
    );
    updateGps.mutate({
      shipmentId,
      coords: { lat, lng, capturedAt: BigInt(Date.now()) },
    });
    if (tRef.current >= 1) {
      tRef.current = 0; // loop
    }
  }, [shipmentId, updateGps]);

  useEffect(() => {
    if (simActive) {
      simRef.current = setInterval(pushSimGps, 3000);
    } else {
      if (simRef.current) clearInterval(simRef.current);
    }
    return () => {
      if (simRef.current) clearInterval(simRef.current);
    };
  }, [simActive, pushSimGps]);

  if (isLoading) return <LoadingSpinner fullPage label="Loading shipment…" />;

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-10 h-10 text-muted-foreground" />
        <p className="text-foreground font-medium">Shipment not found</p>
        <Link to="/shipments">
          <Button variant="outline" size="sm">
            Back to Shipments
          </Button>
        </Link>
      </div>
    );
  }

  const assignedDriver = drivers.find(
    (d) => d.id === shipment.assignedDriverId,
  );
  const assignedVehicle = vehicles.find(
    (v) => v.id === shipment.assignedVehicleId,
  );
  const currentStepIdx = STATUS_STEPS.indexOf(shipment.currentStatus);
  const isFailed = shipment.currentStatus === ShipmentStatus.failed;
  const isDelivered = shipment.currentStatus === ShipmentStatus.delivered;
  const allHistory = shipment.statusHistory;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back + header */}
      <div>
        <Link
          to="/shipments"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          data-ocid="shipment_detail.back_link"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Shipments
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              {shipment.trackingCode}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {shipment.itemDescription}
            </p>
          </div>
          <ShipmentStatusBadge status={shipment.currentStatus} />
        </div>
      </div>

      {/* Delivered banner */}
      {isDelivered && (
        <DeliveredBanner
          statusHistory={shipment.statusHistory}
          trackingCode={shipment.trackingCode}
        />
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress tracker */}
          {!isFailed && !isDelivered && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Delivery Progress
              </h2>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStepIdx;
                  const active = i === currentStepIdx;
                  return (
                    <div
                      key={step}
                      className="flex items-center flex-1 last:flex-none"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 transition-smooth ${
                          done
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-muted border-border text-muted-foreground"
                        } ${active ? "ring-2 ring-primary/30" : ""}`}
                      >
                        {done ? "✓" : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 transition-smooth ${
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
                    className="text-[10px] text-muted-foreground capitalize"
                  >
                    {step === ShipmentStatus.inTransit ? "Transit" : step}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Customer
              </h3>
              <p className="font-semibold text-foreground">
                {shipment.customerName}
              </p>
              <a
                href={`tel:${shipment.customerPhone}`}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                {shipment.customerPhone}
              </a>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                Package
              </h3>
              <p className="text-sm text-foreground">
                {shipment.itemDescription}
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {shipment.weightKg} kg
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Pickup
              </h3>
              <p className="text-sm text-foreground">
                {shipment.pickupAddress}
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Delivery
              </h3>
              <p className="text-sm text-foreground">
                {shipment.deliveryAddress}
              </p>
            </div>
          </div>

          {/* Full status history (staff) */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Status History
            </h2>
            {allHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground">No updates yet.</p>
            ) : (
              <div className="space-y-2">
                {[...allHistory].reverse().map((event, i) => (
                  <div
                    key={`${event.status}-${i}`}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{
                        background:
                          event.status === "delivered"
                            ? "oklch(0.55 0.18 145)"
                            : "var(--color-primary)",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground capitalize">
                        {event.status}
                      </span>
                      {event.staffOnly && (
                        <span className="ml-1.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          staff
                        </span>
                      )}
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

        {/* Right: map + assignment + status update */}
        <div className="space-y-4">
          {/* GPS Map */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Live Location
            </h2>
            <MockMap
              currentCoords={shipment.lastGps}
              label={shipment.trackingCode}
              height="h-56"
              status={shipment.currentStatus}
              pickupAddress={shipment.pickupAddress}
              deliveryAddress={shipment.deliveryAddress}
            />

            {/* GPS Simulation control */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  GPS Simulation
                </span>
                {simActive && (
                  <span className="flex items-center gap-1 text-[10px] text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Broadcasting
                  </span>
                )}
              </div>
              <Button
                variant={simActive ? "destructive" : "outline"}
                size="sm"
                className="w-full gap-1.5 text-xs"
                onClick={() => setSimActive((v) => !v)}
                data-ocid="shipment_detail.simulate_gps_button"
              >
                {simActive ? (
                  <>
                    <Square className="w-3 h-3" />
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    Simulate GPS
                  </>
                )}
              </Button>
              {simActive && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Pickup</span>
                    <span>{Math.round(simT * 100)}%</span>
                    <span>Delivery</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.round(simT * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Update Panel */}
          <StatusUpdatePanel
            shipmentId={shipmentId}
            currentStatus={shipment.currentStatus}
          />

          {/* Assignment */}
          {(assignedDriver || assignedVehicle) && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                Assignment
              </h2>
              {assignedDriver && (
                <div>
                  <p className="text-label text-muted-foreground mb-1">
                    Driver
                  </p>
                  <p className="font-medium text-foreground">
                    {assignedDriver.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {assignedDriver.phone}
                  </p>
                </div>
              )}
              {assignedVehicle && (
                <div>
                  <p className="text-label text-muted-foreground mb-1">
                    Vehicle
                  </p>
                  <p className="font-medium text-foreground font-mono">
                    {assignedVehicle.licensePlate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {assignedVehicle.capacityKg} kg capacity
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
