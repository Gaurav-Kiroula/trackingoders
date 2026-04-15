import type { GpsCoordinates } from "../types";
/**
 * MapDisplay — replaced by MockMap.
 * Kept for backwards-compat; re-exports MockMap with a compatible API.
 */
import MockMap from "./MockMap";

interface MapDisplayProps {
  coords?: GpsCoordinates | null;
  label?: string;
  height?: string;
  zoom?: number;
  className?: string;
  status?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
}

export default function MapDisplay({
  coords,
  label,
  height = "h-64",
  className,
  status,
  pickupAddress,
  deliveryAddress,
}: MapDisplayProps) {
  return (
    <MockMap
      currentCoords={coords}
      label={label}
      height={height}
      className={className}
      status={status}
      pickupAddress={pickupAddress}
      deliveryAddress={deliveryAddress}
    />
  );
}
