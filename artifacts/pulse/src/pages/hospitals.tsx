import { useState } from "react";
import { useLocation as useWouterLocation } from "wouter";
import { useListHospitals, ListHospitalsCategory } from "@workspace/api-client-react";
import { useLocation } from "@/hooks/use-location";
import { Layout } from "@/components/layout";
import { HospitalCard } from "@/components/hospital-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Hospitals() {
  const location = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") as ListHospitalsCategory | undefined;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ListHospitalsCategory | undefined>(initialCategory);

  const { data: hospitals, isLoading } = useListHospitals(
    { 
      lat: location.lat || undefined, 
      lng: location.lng || undefined,
      search: search || undefined,
      category: category || undefined
    },
    { query: { enabled: !location.loading } }
  );

  const categories: {id: ListHospitalsCategory, label: string}[] = [
    { id: "emergency", label: "Emergency" },
    { id: "cardiac", label: "Cardiac" },
    { id: "children", label: "Children" },
    { id: "trauma", label: "Trauma" },
    { id: "general", label: "General" },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <header>
          <h1 className="text-2xl font-bold tracking-tight mb-4">Hospitals</h1>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search hospitals..." 
              className="pl-9 bg-muted/50 border-border/50 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <Button 
              variant={category === undefined ? "default" : "outline"} 
              className="shrink-0 rounded-full h-8 px-3 text-xs"
              onClick={() => setCategory(undefined)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button 
                key={cat.id} 
                variant={category === cat.id ? "default" : "outline"} 
                className="shrink-0 rounded-full h-8 px-3 text-xs"
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </header>

        <div className="space-y-4">
          {isLoading || location.loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
            ))
          ) : hospitals?.length ? (
            hospitals.map((hospital, i) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <HospitalCard hospital={hospital} />
              </motion.div>
            ))
          ) : (
            <div className="text-center p-12 bg-muted/30 rounded-xl border border-dashed border-border/50">
              <Filter className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground font-medium">No hospitals found matching your criteria.</p>
              <Button variant="link" className="mt-2 text-primary" onClick={() => { setSearch(""); setCategory(undefined); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}