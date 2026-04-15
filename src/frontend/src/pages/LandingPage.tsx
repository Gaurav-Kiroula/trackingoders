import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Package,
  Search,
  Shield,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const features = [
  {
    icon: MapPin,
    title: "Live GPS Tracking",
    desc: "Real-time shipment location via driver GPS — customers see exactly where their goods are.",
  },
  {
    icon: Package,
    title: "End-to-End Shipments",
    desc: "From order creation to delivery confirmation, every step is tracked and timestamped.",
  },
  {
    icon: Users,
    title: "Fleet Management",
    desc: "Manage drivers, vehicles, and assignments from a single operations dashboard.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Admins, dispatchers, and drivers each get the right tools for their workflow.",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<2s", label: "GPS update latency" },
  { value: "500+", label: "Routes/day capacity" },
  { value: "24/7", label: "Operations support" },
];

export default function LandingPage() {
  const { login, isAuthenticated, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrack = () => {
    const code = trackingCode.trim().toUpperCase();
    if (code) navigate({ to: "/track/$code", params: { code } });
  };

  const handleStaffAccess = () => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-foreground">
              LogiTrack Pro
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              data-ocid="nav.order_link"
            >
              <Link to="/order">Place Order</Link>
            </Button>
            <Button
              size="sm"
              onClick={handleStaffAccess}
              disabled={isLoggingIn}
              data-ocid="nav.staff_login_button"
            >
              {isLoggingIn
                ? "Connecting…"
                : isAuthenticated
                  ? "Dashboard"
                  : "Staff Login"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-background min-h-[560px]">
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url(/assets/generated/hero-logistics.dim_1200x600.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Enterprise Logistics Platform
            </span>

            <h1 className="text-hero text-foreground mb-4 font-display">
              Transport managed,
              <br />
              <span className="text-primary">shipments tracked.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              A complete operations platform for dispatchers, drivers, and
              customers. Real-time GPS tracking, fleet management, and
              transparent delivery status — all in one place.
            </p>

            {/* Track input */}
            <div className="flex items-center gap-2 max-w-md mx-auto mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking code…"
                  className="pl-9 bg-card"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  data-ocid="hero.tracking_input"
                />
              </div>
              <Button
                onClick={handleTrack}
                disabled={!trackingCode.trim()}
                data-ocid="hero.track_button"
              >
                Track
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                size="lg"
                asChild
                className="gap-2"
                data-ocid="hero.place_order_button"
              >
                <Link to="/order">
                  Place an Order
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleStaffAccess}
                disabled={isLoggingIn}
                data-ocid="hero.staff_access_button"
              >
                {isAuthenticated ? "Go to Dashboard" : "Staff Access"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted/30 border-y border-border py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-2xl font-bold font-display text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-heading font-display text-foreground mb-3">
              Built for enterprise logistics
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Purpose-built for high-volume operations where every delivery
              counts.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-smooth"
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 border-t border-border py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Truck className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-subheading font-display text-foreground mb-3">
            Ready to streamline your deliveries?
          </h2>
          <p className="text-muted-foreground mb-6">
            Dispatchers, drivers, and customers — everyone connected in one
            seamless flow.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button size="lg" asChild data-ocid="cta.place_order_button">
              <Link to="/order">Start an Order</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleStaffAccess}
              data-ocid="cta.staff_button"
            >
              {isAuthenticated ? "Dashboard" : "Staff Login"}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            {[
              "No credit card required",
              "Internet Computer native",
              "99.9% uptime",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-display font-semibold text-foreground">
              LogiTrack Pro
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
