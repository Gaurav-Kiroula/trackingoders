import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "accent" | "success";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/30 bg-primary/5",
  accent: "border-accent/30 bg-accent/5",
  success: "border-[oklch(0.65_0.18_150)]/30 bg-[oklch(0.65_0.18_150)]/5",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  accent: "bg-accent/15 text-accent",
  success: "bg-[oklch(0.65_0.18_150)]/15 text-[oklch(0.65_0.18_150)]",
};

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border p-4 flex items-start gap-3 transition-smooth hover:shadow-elevated",
        variantStyles[variant],
        className,
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          iconStyles[variant],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-label text-muted-foreground mb-0.5">{label}</p>
        <p className="text-2xl font-bold font-display text-foreground leading-none">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              trend.value >= 0
                ? "text-[oklch(0.65_0.18_150)]"
                : "text-destructive",
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
