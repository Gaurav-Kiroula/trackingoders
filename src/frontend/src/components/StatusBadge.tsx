import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Navigation,
  Package,
  Truck,
} from "lucide-react";
import { ShipmentStatus, VehicleStatus } from "../types";

const shipmentStatusConfig: Record<
  ShipmentStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  [ShipmentStatus.pending]: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
  [ShipmentStatus.assigned]: {
    label: "Assigned",
    icon: Package,
    className: "bg-primary/10 text-primary border-primary/30",
  },
  [ShipmentStatus.pickedUp]: {
    label: "Picked Up",
    icon: Package,
    className: "bg-accent/10 text-accent border-accent/30",
  },
  [ShipmentStatus.inTransit]: {
    label: "In Transit",
    icon: Truck,
    className: "bg-primary/15 text-primary border-primary/40",
  },
  [ShipmentStatus.delivered]: {
    label: "Delivered",
    icon: CheckCircle2,
    className:
      "bg-[oklch(0.65_0.18_150)]/10 text-[oklch(0.65_0.18_150)] border-[oklch(0.65_0.18_150)]/30",
  },
  [ShipmentStatus.failed]: {
    label: "Failed",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

const vehicleStatusConfig: Record<
  VehicleStatus,
  { label: string; className: string }
> = {
  [VehicleStatus.available]: {
    label: "Available",
    className:
      "bg-[oklch(0.65_0.18_150)]/10 text-[oklch(0.65_0.18_150)] border-[oklch(0.65_0.18_150)]/30",
  },
  [VehicleStatus.inUse]: {
    label: "In Use",
    className: "bg-primary/10 text-primary border-primary/30",
  },
  [VehicleStatus.maintenance]: {
    label: "Maintenance",
    className: "bg-accent/10 text-accent border-accent/30",
  },
};

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function ShipmentStatusBadge({
  status,
  size = "md",
  showIcon = true,
}: ShipmentStatusBadgeProps) {
  const config = shipmentStatusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  size?: "sm" | "md";
}

export function VehicleStatusBadge({
  status,
  size = "md",
}: VehicleStatusBadgeProps) {
  const config = vehicleStatusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
      )}
    >
      <Navigation className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Driver active badge
interface DriverStatusBadgeProps {
  isActive: boolean;
}

export function DriverStatusBadge({ isActive }: DriverStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        isActive
          ? "bg-[oklch(0.65_0.18_150)]/10 text-[oklch(0.65_0.18_150)] border-[oklch(0.65_0.18_150)]/30"
          : "bg-muted text-muted-foreground border-border",
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isActive ? "bg-[oklch(0.65_0.18_150)]" : "bg-muted-foreground",
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
