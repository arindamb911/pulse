import { useListEmergencyContacts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Shield, ShieldAlert, FileWarning, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

export default function Contacts() {
  const { data: contacts, isLoading } = useListEmergencyContacts();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield": return <Shield className="h-6 w-6" />;
      case "shield-alert": return <ShieldAlert className="h-6 w-6" />;
      case "file-warning": return <FileWarning className="h-6 w-6" />;
      case "heart-pulse": return <HeartPulse className="h-6 w-6" />;
      default: return <Phone className="h-6 w-6" />;
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Emergency Contacts</h1>
          <p className="text-muted-foreground text-sm mt-1">Tap to call immediately</p>
        </header>

        <div className="space-y-4">
          <Button 
            className="w-full h-16 text-lg font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md" 
            asChild
          >
            <a href="tel:911">
              <Phone className="mr-2 h-6 w-6" />
              General Emergency (911)
            </a>
          </Button>

          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
            ))
          ) : contacts?.length ? (
            contacts.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-border/50 hover:bg-accent/50 transition-colors group cursor-pointer" onClick={() => window.location.href = `tel:${contact.number}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {getIcon(contact.icon)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                      </div>
                    </div>
                    <div className="text-primary font-bold text-lg bg-primary/5 px-3 py-1 rounded-md border border-primary/10">
                      {contact.number}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No contacts found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}