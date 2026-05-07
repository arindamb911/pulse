import { Router, type IRouter } from "express";
import { db, emergencyContactsTable, hospitalsTable } from "@workspace/db";
import { count, eq } from "drizzle-orm";
import {
  ListEmergencyContactsResponse,
  GetEmergencySummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/emergency/contacts", async (_req, res): Promise<void> => {
  const contacts = await db.select().from(emergencyContactsTable);
  res.json(ListEmergencyContactsResponse.parse(contacts));
});

router.get("/emergency/summary", async (_req, res): Promise<void> => {
  const [totalResult] = await db.select({ count: count() }).from(hospitalsTable);
  const [emergencyResult] = await db
    .select({ count: count() })
    .from(hospitalsTable)
    .where(eq(hospitalsTable.category, "emergency"));
  const [cardiacResult] = await db
    .select({ count: count() })
    .from(hospitalsTable)
    .where(eq(hospitalsTable.category, "cardiac"));
  const [childrenResult] = await db
    .select({ count: count() })
    .from(hospitalsTable)
    .where(eq(hospitalsTable.category, "children"));
  const [traumaResult] = await db
    .select({ count: count() })
    .from(hospitalsTable)
    .where(eq(hospitalsTable.category, "trauma"));
  const [generalResult] = await db
    .select({ count: count() })
    .from(hospitalsTable)
    .where(eq(hospitalsTable.category, "general"));
  const [open24hResult] = await db
    .select({ count: count() })
    .from(hospitalsTable)
    .where(eq(hospitalsTable.isOpen24h, true));

  const summary = {
    totalHospitals: Number(totalResult?.count ?? 0),
    emergencyCount: Number(emergencyResult?.count ?? 0),
    cardiacCount: Number(cardiacResult?.count ?? 0),
    childrenCount: Number(childrenResult?.count ?? 0),
    traumaCount: Number(traumaResult?.count ?? 0),
    generalCount: Number(generalResult?.count ?? 0),
    open24hCount: Number(open24hResult?.count ?? 0),
  };

  res.json(GetEmergencySummaryResponse.parse(summary));
});

export default router;
