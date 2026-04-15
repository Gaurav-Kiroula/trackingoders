import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullPage?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export default function LoadingSpinner({
  size = "md",
  label,
  fullPage = false,
  className,
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3">
        <Loader2
          className={cn("animate-spin text-primary", sizeMap[size], className)}
        />
        {label && (
          <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

/** Skeleton loader for card-based content */
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3" />
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={`skeleton-${i}-of-${lines}`}
          className={cn(
            "h-3 bg-muted rounded",
            i === lines - 1 ? "w-1/2" : "w-full",
          )}
        />
      ))}
    </div>
  );
}
