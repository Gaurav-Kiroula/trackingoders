import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ShipmentStatus } from "../types";

interface MockMapProps {
  currentCoords?: { lat: number; lng: number } | null;
  label?: string;
  height?: string;
  className?: string;
  status?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
}

const MAP_W = 400;
const MAP_H = 260;

const PICKUP_PX = { x: 72, y: 180 };
const DELIVERY_PX = { x: 330, y: 72 };

const PATH_PTS = [
  PICKUP_PX,
  { x: 100, y: 160 },
  { x: 140, y: 140 },
  { x: 180, y: 140 },
  { x: 220, y: 100 },
  { x: 270, y: 88 },
  DELIVERY_PX,
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getPathPoint(t: number): { x: number; y: number } {
  const segments = PATH_PTS.length - 1;
  const segT = t * segments;
  const seg = Math.min(Math.floor(segT), segments - 1);
  const localT = segT - seg;
  const a = PATH_PTS[seg];
  const b = PATH_PTS[seg + 1];
  return { x: lerp(a.x, b.x, localT), y: lerp(a.y, b.y, localT) };
}

const ROAD_H = [
  "M 0 50 H 400",
  "M 0 110 H 400",
  "M 0 170 H 400",
  "M 0 220 H 400",
];
const ROAD_V = [
  "M 60 0 V 260",
  "M 130 0 V 260",
  "M 200 0 V 260",
  "M 270 0 V 260",
  "M 340 0 V 260",
];
const ROAD_D = ["M 60 170 L 200 110", "M 200 110 L 330 50"];
const ALL_ROADS = [...ROAD_H, ...ROAD_V, ...ROAD_D];
const ROAD_LABELS = ALL_ROADS.map((_, i) => `road-${i}`);
const CENTER_ROADS = [...ROAD_H, ...ROAD_V];
const CENTER_LABELS = CENTER_ROADS.map((_, i) => `cl-${i}`);

const BLOCKS = [
  { x: 62, y: 52, w: 66, h: 56, id: "bl-0" },
  { x: 132, y: 52, w: 66, h: 56, id: "bl-1" },
  { x: 202, y: 52, w: 66, h: 56, id: "bl-2" },
  { x: 62, y: 112, w: 66, h: 56, id: "bl-3" },
  { x: 132, y: 112, w: 66, h: 56, id: "bl-4" },
  { x: 202, y: 112, w: 66, h: 56, id: "bl-5" },
  { x: 272, y: 112, w: 66, h: 56, id: "bl-6" },
  { x: 62, y: 172, w: 66, h: 46, id: "bl-7" },
  { x: 202, y: 172, w: 66, h: 46, id: "bl-8" },
  { x: 272, y: 172, w: 66, h: 46, id: "bl-9" },
  { x: 342, y: 112, w: 56, h: 56, id: "bl-10" },
  { x: 342, y: 52, w: 56, h: 56, id: "bl-11" },
];

export default function MockMap({
  label,
  height = "h-64",
  className,
  status,
  pickupAddress,
  deliveryAddress,
}: MockMapProps) {
  const [zoom, setZoom] = useState(1.0);
  const [truckT, setTruckT] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isInTransit = status === ShipmentStatus.inTransit;
  const isDelivered = status === ShipmentStatus.delivered;
  const showTruck = isInTransit || isDelivered;

  useEffect(() => {
    if (isInTransit) {
      animRef.current = setInterval(() => {
        setTruckT((prev) => {
          const next = prev + 0.004;
          return next >= 1 ? 0 : next;
        });
      }, 50);
    } else if (isDelivered) {
      setTruckT(1);
    } else {
      setTruckT(0);
    }
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isInTransit, isDelivered]);

  const truckPos = getPathPoint(truckT);

  const routeD = PATH_PTS.map((p, i) =>
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`,
  ).join(" ");

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden border border-border bg-muted/30 select-none",
        height,
        className,
      )}
      role="img"
      aria-label={
        label ? `Route map for shipment ${label}` : "Shipment route map"
      }
    >
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        aria-hidden="true"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          transition: "transform 0.3s ease",
        }}
      >
        <rect
          width={MAP_W}
          height={MAP_H}
          fill="var(--color-muted)"
          opacity="0.6"
        />

        {BLOCKS.map((b) => (
          <rect
            key={b.id}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={3}
            fill="var(--color-card)"
            opacity="0.7"
            stroke="var(--color-border)"
            strokeWidth="0.5"
          />
        ))}

        {ALL_ROADS.map((d, i) => (
          <path
            key={ROAD_LABELS[i]}
            d={d}
            stroke="var(--color-background)"
            strokeWidth={i < 4 ? 8 : i < 9 ? 7 : 5}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {CENTER_ROADS.map((d, i) => (
          <path
            key={CENTER_LABELS[i]}
            d={d}
            stroke="var(--color-border)"
            strokeWidth={1}
            fill="none"
            strokeDasharray="8 6"
            opacity="0.6"
          />
        ))}

        {showTruck && (
          <>
            <path
              d={routeD}
              stroke="var(--color-primary)"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
              strokeDasharray="6 4"
            />
            <path
              d={routeD}
              stroke="var(--color-primary)"
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
          </>
        )}

        {/* Pickup pin */}
        <g transform={`translate(${PICKUP_PX.x}, ${PICKUP_PX.y})`}>
          <circle
            cx={0}
            cy={0}
            r={10}
            fill="var(--color-accent)"
            opacity="0.2"
          />
          <circle cx={0} cy={0} r={6} fill="var(--color-accent)" />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontSize="7"
            fill="white"
            fontWeight="bold"
          >
            A
          </text>
          <rect
            x={-22}
            y={-26}
            width={44}
            height={14}
            rx={3}
            fill="var(--color-card)"
            opacity="0.9"
          />
          <text
            x={0}
            y={-16}
            textAnchor="middle"
            fontSize="7"
            fill="var(--color-foreground)"
            fontWeight="600"
          >
            PICKUP
          </text>
        </g>

        {/* Delivery pin */}
        <g transform={`translate(${DELIVERY_PX.x}, ${DELIVERY_PX.y})`}>
          <circle
            cx={0}
            cy={0}
            r={10}
            fill="var(--color-primary)"
            opacity="0.2"
          />
          <circle cx={0} cy={0} r={6} fill="var(--color-primary)" />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontSize="7"
            fill="white"
            fontWeight="bold"
          >
            B
          </text>
          <rect
            x={-28}
            y={12}
            width={56}
            height={14}
            rx={3}
            fill="var(--color-card)"
            opacity="0.9"
          />
          <text
            x={0}
            y={22}
            textAnchor="middle"
            fontSize="7"
            fill="var(--color-foreground)"
            fontWeight="600"
          >
            DELIVERY
          </text>
        </g>

        {/* Truck marker */}
        {showTruck && (
          <g transform={`translate(${truckPos.x}, ${truckPos.y})`}>
            <circle
              cx={0}
              cy={0}
              r={12}
              fill={
                isDelivered ? "oklch(0.55 0.18 145)" : "var(--color-primary)"
              }
              opacity="0.9"
            />
            <circle
              cx={0}
              cy={0}
              r={12}
              fill="none"
              stroke="white"
              strokeWidth={1.5}
              opacity="0.6"
            />
            {isDelivered ? (
              <text x={0} y={5} textAnchor="middle" fontSize="12" fill="white">
                ✓
              </text>
            ) : (
              <text x={0} y={5} textAnchor="middle" fontSize="11" fill="white">
                ⊳
              </text>
            )}
            {isInTransit && (
              <circle
                cx={0}
                cy={0}
                r={16}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={1.5}
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values="12;20;12"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0;0.4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )}
      </svg>

      {/* Zoom controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="w-6 h-6 rounded bg-card/90 border border-border flex items-center justify-center hover:bg-card transition-colors shadow-subtle"
          aria-label="Zoom in"
        >
          <Plus className="w-3 h-3 text-foreground" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
          className="w-6 h-6 rounded bg-card/90 border border-border flex items-center justify-center hover:bg-card transition-colors shadow-subtle"
          aria-label="Zoom out"
        >
          <Minus className="w-3 h-3 text-foreground" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 bg-card/90 border border-border rounded px-2 py-1">
          <MapPin className="w-2.5 h-2.5 text-accent" />
          <span className="text-[9px] text-foreground font-medium truncate max-w-[80px]">
            {pickupAddress ? pickupAddress.split(",")[0] : "Pickup"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-card/90 border border-border rounded px-2 py-1">
          <Navigation className="w-2.5 h-2.5 text-primary" />
          <span className="text-[9px] text-foreground font-medium truncate max-w-[80px]">
            {deliveryAddress ? deliveryAddress.split(",")[0] : "Delivery"}
          </span>
        </div>
        {isInTransit && (
          <div className="flex items-center gap-1.5 bg-card/90 border border-border rounded px-2 py-1">
            <Truck className="w-2.5 h-2.5 text-primary" />
            <span className="text-[9px] text-primary font-semibold">
              In Transit
            </span>
          </div>
        )}
        {isDelivered && (
          <div className="flex items-center gap-1.5 bg-card/90 border border-border rounded px-2 py-1">
            <CheckCircle2
              className="w-2.5 h-2.5"
              style={{ color: "oklch(0.55 0.18 145)" }}
            />
            <span
              className="text-[9px] font-semibold"
              style={{ color: "oklch(0.55 0.18 145)" }}
            >
              Delivered
            </span>
          </div>
        )}
      </div>

      {/* Tracking code badge */}
      {label && (
        <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-mono px-2 py-0.5 rounded-md">
          {label}
        </div>
      )}
    </div>
  );
}
