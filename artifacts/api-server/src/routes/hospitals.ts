import { Router, type IRouter } from "express";
import { asc, eq, ilike, or, sql } from "drizzle-orm";
import { db, hospitalsTable } from "@workspace/db";
import {
  ListHospitalsQueryParams,
  GetHospitalParams,
  GetHospitalResponse,
  ListHospitalsResponse,
  GetNearbyHospitalsQueryParams,
  GetNearbyHospitalsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function estimateTravelTime(distanceKm: number): string {
  const minutes = Math.round((distanceKm / 40) * 60);
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}min` : `${hours}h`;
}

function buildGoogleMapsUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${lat},${lng}`;
}

router.get("/hospitals/nearby", async (req, res): Promise<void> => {
  const parsed = GetNearbyHospitalsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { lat, lng, limit = 5 } = parsed.data;

  const hospitals = await db.select().from(hospitalsTable).where(eq(hospitalsTable.emergencyCapable, true));

  const withDistance = hospitals
    .map((h) => {
      const distance = haversineDistance(lat, lng, h.lat, h.lng);
      return {
        ...h,
        distance: Math.round(distance * 10) / 10,
        travelTime: estimateTravelTime(distance),
        googleMapsUrl: h.googleMapsUrl ?? buildGoogleMapsUrl(h.lat, h.lng, h.name),
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  res.json(GetNearbyHospitalsResponse.parse(withDistance));
});

router.get("/hospitals", async (req, res): Promise<void> => {
  const parsed = ListHospitalsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, search, lat, lng } = parsed.data;

  let query = db.select().from(hospitalsTable).$dynamic();

  if (category) {
    query = query.where(eq(hospitalsTable.category, category));
  }

  if (search) {
    const searchCondition = or(
      ilike(hospitalsTable.name, `%${search}%`),
      ilike(hospitalsTable.address, `%${search}%`)
    );
    if (category) {
      query = query.where(
        sql`${hospitalsTable.category} = ${category} AND (${hospitalsTable.name} ILIKE ${"%" + search + "%"} OR ${hospitalsTable.address} ILIKE ${"%" + search + "%"})`
      );
    } else {
      query = query.where(searchCondition);
    }
  }

  const hospitals = await query.orderBy(asc(hospitalsTable.name));

  const withDistance = hospitals.map((h) => {
    let distance: number | undefined;
    let travelTime: string | undefined;
    if (lat != null && lng != null) {
      const d = haversineDistance(lat, lng, h.lat, h.lng);
      distance = Math.round(d * 10) / 10;
      travelTime = estimateTravelTime(d);
    }
    return {
      ...h,
      distance,
      travelTime,
      googleMapsUrl: h.googleMapsUrl ?? buildGoogleMapsUrl(h.lat, h.lng, h.name),
    };
  });

  if (lat != null && lng != null) {
    withDistance.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }

  res.json(ListHospitalsResponse.parse(withDistance));
});

router.get("/hospitals/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetHospitalParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [hospital] = await db
    .select()
    .from(hospitalsTable)
    .where(eq(hospitalsTable.id, parsed.data.id));

  if (!hospital) {
    res.status(404).json({ error: "Hospital not found" });
    return;
  }

  res.json(
    GetHospitalResponse.parse({
      ...hospital,
      googleMapsUrl: hospital.googleMapsUrl ?? buildGoogleMapsUrl(hospital.lat, hospital.lng, hospital.name),
    })
  );
});

export default router;
