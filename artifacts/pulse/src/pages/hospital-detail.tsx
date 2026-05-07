import { useParams, Link } from "wouter";
import { useGetHospital } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Phone, Navigation, Activity, CheckCircle2, AlertCircle } from "lucide-react";

export default function HospitalDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);

  const { data: hospital, isLoading } = useGetHospital(id, { query: { enabled: !!id } });

  const getBedDotColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-green-500";
      case "limited": return "bg-yellow-500";
      case "full": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Layout hideNav>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!hospital) {
    return (
      <Layout>
        <div className="p-4 text-center mt-20">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold">Hospital Not Found</h2>
          <Button asChild className="mt-6">
            <Link href="/hospitals">Back to Hospitals</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideNav>
      <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 z-10 px-4 py-3 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" asChild>
          <Link href="/hospitals">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-bold text-lg truncate pr-4">{hospital.name}</h1>
      </header>

      <div className="p-4 space-y-6 pb-24">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {hospital.emergencyCapable && (
              <Badge variant="destructive" className="uppercase font-bold tracking-wider text-[10px]">
                ER Available
              </Badge>
            )}
            {hospital.isOpen24h && (
              <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 uppercase font-bold tracking-wider text-[10px]">
                Open 24/7
              </Badge>
            )}
            <Badge variant="secondary" className="uppercase font-bold tracking-wider text-[10px]">
              {hospital.category}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-2">{hospital.name}</h1>
          
          <div className="flex items-start text-muted-foreground mt-2 text-sm font-medium">
            <MapPin className="h-4 w-4 mr-1.5 shrink-0 mt-0.5 text-primary" />
            <span>{hospital.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border/50 bg-muted/20">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold text-primary">{hospital.distance?.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">km</span></div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Distance</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-muted/20">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold text-primary">{hospital.travelTime || "--"}</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Est. Travel Time</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center font-semibold">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Bed Availability
              </div>
              <Badge variant="outline" className="text-sm font-bold border-border/50 capitalize px-3 py-1">
                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${getBedDotColor(hospital.bedAvailability)}`} />
                {hospital.bedAvailability}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {hospital.specialties && hospital.specialties.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.map(spec => (
                <div key={spec} className="flex items-center bg-muted/50 px-3 py-1.5 rounded-md text-sm font-medium text-foreground border border-border/50">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                  {spec}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] bg-background border-t border-border p-4 pb-safe flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Button variant="outline" className="flex-1 h-14 border-primary/20 hover:bg-primary/5 text-primary font-bold text-base" asChild>
          <a href={hospital.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-5 w-5 mr-2" />
            Directions
          </a>
        </Button>
        <Button className="flex-1 h-14 font-bold text-base shadow-lg" asChild>
          <a href={`tel:${hospital.phone}`}>
            <Phone className="h-5 w-5 mr-2" />
            Call Now
          </a>
        </Button>
      </div>
    </Layout>
  );
}