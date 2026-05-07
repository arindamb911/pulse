import { Hospital } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Activity, AlertCircle, Baby, Heart, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

export function HospitalCard({ hospital }: { hospital: Hospital }) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency": return <AlertCircle className="h-3 w-3 mr-1" />;
      case "cardiac": return <Heart className="h-3 w-3 mr-1" />;
      case "children": return <Baby className="h-3 w-3 mr-1" />;
      case "trauma": return <ShieldAlert className="h-3 w-3 mr-1" />;
      default: return <Activity className="h-3 w-3 mr-1" />;
    }
  };

  const getBedDotColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-green-500";
      case "limited": return "bg-yellow-500";
      case "full": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="mb-4 overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">{hospital.name}</h3>
            <p className="text-muted-foreground text-sm flex items-center mt-1 line-clamp-1">
              <MapPin className="h-3 w-3 mr-1 shrink-0" />
              {hospital.address}
            </p>
          </div>
          {hospital.distance && (
            <div className="text-right shrink-0 ml-2">
              <div className="text-xl font-bold tracking-tighter text-primary">
                {hospital.distance.toFixed(1)}<span className="text-sm text-muted-foreground font-normal">km</span>
              </div>
              {hospital.travelTime && (
                <div className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full inline-flex mt-1">
                  {hospital.travelTime}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="capitalize text-xs font-medium">
            {getCategoryIcon(hospital.category)}
            {hospital.category}
          </Badge>
          {hospital.isOpen24h && (
            <Badge variant="outline" className="text-xs font-medium border-green-200 text-green-700 bg-green-50">
              <Clock className="h-3 w-3 mr-1" />
              24/7
            </Badge>
          )}
          <Badge variant="outline" className="text-xs font-medium border-border/50">
            <div className={`w-2 h-2 rounded-full mr-1.5 ${getBedDotColor(hospital.bedAvailability)}`} />
            Beds {hospital.bedAvailability}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="outline" className="w-full font-semibold border-primary/20 hover:bg-primary/5 text-primary" asChild>
            <a href={`tel:${hospital.phone}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </a>
          </Button>
          <Button className="w-full font-semibold" asChild>
            <Link href={`/hospitals/${hospital.id}`}>
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
