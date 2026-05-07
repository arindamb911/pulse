import { Link } from "wouter";
import { useGetNearbyHospitals, useListEmergencyContacts } from "@workspace/api-client-react";
import { useLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ArrowLeft, AlertTriangle, ShieldAlert } from "lucide-react";

export default function Emergency() {
  const location = useLocation();
  const { data: nearbyHospitals, isLoading: loadingHospitals } = useGetNearbyHospitals(
    { lat: location.lat || 40.7128, lng: location.lng || -74.0060, limit: 3 },
    { query: { enabled: !location.loading } }
  );
  const { data: contacts, isLoading: loadingContacts } = useListEmergencyContacts();

  // Filter emergency capable hospitals
  const emergencyHospitals = nearbyHospitals?.filter(h => h.emergencyCapable).slice(0, 3) || [];

  return (
    <div className="min-h-[100dvh] bg-red-950 flex justify-center w-full relative overflow-hidden">
      {/* Pulsing background effect */}
      <div className="absolute inset-0 bg-destructive/20 animate-pulse pointer-events-none" style={{ animationDuration: '2s' }}></div>
      
      <div className="w-full max-w-[430px] bg-background/95 min-h-[100dvh] shadow-xl relative backdrop-blur-md border-x-4 border-destructive/50">
        
        <header className="p-4 flex items-center bg-destructive text-destructive-foreground sticky top-0 z-10 shadow-md">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 mr-2" asChild>
            <Link href="/">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 animate-bounce" />
            <h1 className="text-xl font-bold tracking-widest uppercase">Emergency</h1>
          </div>
        </header>

        <div className="p-4 space-y-6 pb-8">
          <Button 
            className="w-full h-20 text-xl font-bold bg-white text-destructive border-4 border-destructive hover:bg-red-50 shadow-lg" 
            asChild
          >
            <a href="tel:911">
              <Phone className="mr-3 h-8 w-8 animate-pulse" />
              CALL 911 NOW
            </a>
          </Button>

          <div>
            <h2 className="text-lg font-bold text-destructive mb-3 flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Nearest ERs
            </h2>
            
            {loadingHospitals ? (
              <div className="space-y-3">
                <Card className="bg-white/50 border-destructive/20 animate-pulse h-[140px]"></Card>
                <Card className="bg-white/50 border-destructive/20 animate-pulse h-[140px]"></Card>
              </div>
            ) : emergencyHospitals.length ? (
              <div className="space-y-3">
                {emergencyHospitals.map(hospital => (
                  <Card key={hospital.id} className="border-destructive/30 border-2 bg-red-50/50 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg leading-tight text-red-950">{hospital.name}</h3>
                          <p className="text-sm font-medium text-red-800/80 mt-1">
                            {hospital.distance?.toFixed(1)} km • {hospital.travelTime}
                          </p>
                        </div>
                      </div>
                      <Button className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold h-12" asChild>
                        <a href={`tel:${hospital.phone}`}>
                          <Phone className="mr-2 h-5 w-5" />
                          Call ER: {hospital.phone}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center font-medium border border-red-200">
                No emergency hospitals found nearby.
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Quick Contacts</h2>
            {loadingContacts ? (
              <div className="space-y-2">
                <div className="h-16 bg-muted/50 rounded-lg animate-pulse"></div>
                <div className="h-16 bg-muted/50 rounded-lg animate-pulse"></div>
              </div>
            ) : contacts?.length ? (
              <div className="space-y-2">
                {contacts.map(contact => (
                  <Button 
                    key={contact.id} 
                    variant="outline" 
                    className="w-full h-auto py-3 justify-between border-border/50 hover:bg-accent" 
                    asChild
                  >
                    <a href={`tel:${contact.number}`}>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-base">{contact.name}</span>
                        <span className="text-xs text-muted-foreground">{contact.description}</span>
                      </div>
                      <div className="flex items-center text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full">
                        <Phone className="h-4 w-4 mr-2" />
                        {contact.number}
                      </div>
                    </a>
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}