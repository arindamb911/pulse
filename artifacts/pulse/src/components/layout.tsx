import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Activity, Phone, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-muted/20 flex justify-center w-full">
      <div className="w-full max-w-[430px] bg-background min-h-[100dvh] shadow-xl relative pb-20 overflow-x-hidden">
        {children}

        {!hideNav && (
          <nav className="fixed bottom-0 w-full max-w-[430px] bg-background border-t border-border flex items-center justify-around px-2 py-3 z-50 pb-safe">
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link
              href="/hospitals"
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                location.startsWith("/hospitals") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Activity className="h-5 w-5" />
              <span>Hospitals</span>
            </Link>

            <Link
              href="/emergency"
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                location === "/emergency" ? "text-destructive" : "text-destructive/70 hover:text-destructive"
              )}
            >
              <div className="bg-destructive text-destructive-foreground p-3 rounded-full -mt-8 shadow-lg ring-4 ring-background animate-pulse">
                <PhoneCall className="h-6 w-6" />
              </div>
              <span className="font-bold">SOS</span>
            </Link>

            <Link
              href="/contacts"
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                location === "/contacts" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Phone className="h-5 w-5" />
              <span>Contacts</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
