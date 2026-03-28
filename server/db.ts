import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Petition signatures queries
import { InsertPetitionSignature, petitionSignatures, siteContent, InsertSiteContent } from "../drizzle/schema";

export async function addPetitionSignature(signature: InsertPetitionSignature) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add signature: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(petitionSignatures).values(signature);
    return result;
  } catch (error) {
    console.error("[Database] Failed to add signature:", error);
    throw error;
  }
}

export async function getPetitionSignatures() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get signatures: database not available");
    return [];
  }

  try {
    const result = await db.select().from(petitionSignatures);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get signatures:", error);
    return [];
  }
}

export async function getPetitionSignatureCount() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get signature count: database not available");
    return 0;
  }

  try {
    const result = await db.select().from(petitionSignatures);
    return result.length;
  } catch (error) {
    console.error("[Database] Failed to get signature count:", error);
    return 0;
  }
}

// Site Content Management
export async function getSiteContent() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get site content: database not available");
    return [];
  }

  try {
    const result = await db.select().from(siteContent);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get site content:", error);
    throw error;
  }
}

export async function getSiteContentByKey(key: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get site content: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get site content by key:", error);
    throw error;
  }
}

export async function getSiteContentBySection(section: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get site content: database not available");
    return [];
  }

  try {
    const result = await db.select().from(siteContent).where(eq(siteContent.section, section));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get site content by section:", error);
    throw error;
  }
}

export async function updateSiteContent(key: string, content: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update site content: database not available");
    return;
  }

  try {
    await db.update(siteContent).set({ content, updatedAt: new Date() }).where(eq(siteContent.key, key));
  } catch (error) {
    console.error("[Database] Failed to update site content:", error);
    throw error;
  }
}
