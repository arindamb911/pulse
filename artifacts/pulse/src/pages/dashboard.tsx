import { useState } from "react";
import { Link } from "wouter";
import { useGetNearbyHospitals, useGetEmergencySummary, ListHospitalsCategory } from "@workspace/api-client-react";
import { useLocation } from "@/hooks/use-location";
import { Layout } from "@/components/layout";
import { HospitalCard } from "@/components/hospital-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { MapPin, AlertCircle, Search, ArrowRight, Heart, Baby, ShieldAlert, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const location = useLocation();
  const { data: summary, isLoading: loadingSummary } = useGetEmergencySummary();
  const { data: nearbyHospitals, isLoading: loadingNearby } = useGetNearbyHospitals(
    { lat: location.lat || 19.0760, lng: location.lng || 72.8777, limit: 3 },
    { query: { enabled: !location.loading } }
  );

  const [search, setSearch] = useState("");

  const categories = [
    { id: "emergency", label: "Emergency", icon: AlertCircle },
    { id: "cardiac", label: "Cardiac", icon: Heart },
    { id: "children", label: "Children", icon: Baby },
    { id: "trauma", label: "Trauma", icon: ShieldAlert },
    { id: "general", label: "General", icon: Activity },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pulse</h1>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {location.loading ? "Locating..." : location.error ? "Using Mock Location" : "Current Location"}
            </p>
          </div>
        </header>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-24 text-2xl font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-xl relative overflow-hidden group" 
            asChild
          >
            <Link href="/emergency">
              <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
              <AlertCircle className="mr-3 h-8 w-8" />
              EMERGENCY MODE
            </Link>
          </Button>
        </motion.div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search hospitals or specialties..." 
            className="pl-9 bg-muted/50 border-border/50 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <Button 
                key={cat.id} 
                variant="outline" 
                className="shrink-0 rounded-full bg-card" 
                asChild
              >
                <Link href={`/hospitals?category=${cat.id}`}>
                  <cat.icon className="h-4 w-4 mr-2 text-primary" />
                  {cat.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Nearest Hospitals</h2>
            <Button variant="link" className="text-primary p-0 h-auto font-semibold" asChild>
              <Link href="/hospitals">See all <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>

          {loadingNearby || location.loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[180px] w-full rounded-xl" />
              <Skeleton className="h-[180px] w-full rounded-xl" />
            </div>
          ) : nearbyHospitals?.length ? (
            <div className="space-y-4">
              {nearbyHospitals.map((hospital, i) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <HospitalCard hospital={hospital} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-xl">
              <p className="text-muted-foreground">No hospitals found nearby.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}