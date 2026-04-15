import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navigation, NavigationOff, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GpsCoordinates } from "../types";

interface GpsTrackerProps {
  onCoords?: (coords: GpsCoordinates) => void;
  autoStart?: boolean;
  compact?: boolean;
  className?: string;
}

type GpsState = "idle" | "acquiring" | "active" | "error";

/**
 * Browser geolocation hook + UI component.
 * Captures GPS coords and optionally streams them to a callback.
 */
export default function GpsTracker({
  onCoords,
  autoStart = false,
  compact = false,
  className,
}: GpsTrackerProps) {
  const [state, setState] = useState<GpsState>("idle");
  const [coords, setCoords] = useState<GpsCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState("idle");
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setState("error");
      return;
    }

    setState("acquiring");
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const gps: GpsCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          capturedAt: BigInt(Date.now()) as unknown as bigint,
        };
        setCoords(gps);
        setState("active");
        onCoords?.(gps);
      },
      (err) => {
        setError(err.message);
        setState("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 5_000,
      },
    );
  }, [onCoords]);

  useEffect(() => {
    if (autoStart) startTracking();
    return () => stopTracking();
  }, [autoStart, startTracking, stopTracking]);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={state === "active" ? stopTracking : startTracking}
          data-ocid="gps_tracker.toggle"
        >
          {state === "active" ? (
            <>
              <NavigationOff className="w-3 h-3" />
              Stop GPS
            </>
          ) : state === "acquiring" ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              Locating…
            </>
          ) : (
            <>
              <Navigation className="w-3 h-3" />
              Start GPS
            </>
          )}
        </Button>
        {coords && state === "active" && (
          <span className="text-xs font-mono text-muted-foreground">
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </span>
        )}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 space-y-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              state === "active" && "bg-primary animate-pulse",
              state === "acquiring" && "bg-accent animate-pulse",
              state === "error" && "bg-destructive",
              state === "idle" && "bg-muted-foreground",
            )}
          />
          <span className="text-sm font-medium text-foreground">
            GPS Tracker
          </span>
        </div>
        <Button
          variant={state === "active" ? "outline" : "default"}
          size="sm"
          className="gap-1.5"
          onClick={state === "active" ? stopTracking : startTracking}
          data-ocid="gps_tracker.toggle"
        >
          {state === "active" ? (
            <>
              <NavigationOff className="w-3.5 h-3.5" />
              Stop
            </>
          ) : state === "acquiring" ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Acquiring…
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              Start Tracking
            </>
          )}
        </Button>
      </div>

      {state === "active" && coords && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted rounded-lg px-3 py-2">
            <p className="text-label text-muted-foreground mb-1">Latitude</p>
            <p className="font-mono text-sm text-foreground">
              {coords.lat.toFixed(6)}
            </p>
          </div>
          <div className="bg-muted rounded-lg px-3 py-2">
            <p className="text-label text-muted-foreground mb-1">Longitude</p>
            <p className="font-mono text-sm text-foreground">
              {coords.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {state === "error" && error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {state === "idle" && (
        <p className="text-xs text-muted-foreground">
          Enable GPS tracking to share your live location.
        </p>
      )}
    </div>
  );
}
