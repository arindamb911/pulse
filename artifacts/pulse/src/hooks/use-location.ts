import { useState, useEffect } from "react";

interface LocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

const FALLBACK_LAT = 19.0760;
const FALLBACK_LNG = 72.8777;

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: FALLBACK_LAT,
    lng: FALLBACK_LNG,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      () => {
        setLocation({
          lat: FALLBACK_LAT,
          lng: FALLBACK_LNG,
          loading: false,
          error: "Location permission denied. Showing Mumbai area hospitals.",
        });
      },
      { timeout: 8000 }
    );
  }, []);

  return location;
}
