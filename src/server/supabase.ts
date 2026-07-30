import { createClient } from "@supabase/supabase-js";

// Clean user's projectID (namitdatabase@27 -> namitdatabase-27) for valid domain
const defaultProjectID = "namitdatabase@27".replace(/@/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
const defaultUrl = `https://${defaultProjectID}.supabase.co`;
const defaultKey = "sb_publishable_Pbsgr4l45cBZoGNeqldn9w_gc6evJuw";

const supabaseUrl = process.env.SUPABASE_URL || defaultUrl;
const supabaseKey = process.env.SUPABASE_ANON_KEY || defaultKey;

let supabaseClient: any = null;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  if (!supabaseClient) {
    try {
      console.log(`[Supabase Init] Connecting to ${supabaseUrl}...`);
      supabaseClient = createClient(supabaseUrl, supabaseKey);
    } catch (err: any) {
      console.error("[Supabase Init] Error initializing client:", err.message || err);
    }
  }
  return supabaseClient;
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converts camelCase keys of an object to snake_case for PostgreSQL compatibility,
 * and handles nested structures by serializing them as JSON.
 */
export function formatDataForSupabase(data: any): any {
  if (!data || typeof data !== "object") return data;
  const processed: any = {};
  for (const key of Object.keys(data)) {
    const snakeKey = toSnakeCase(key);
    let value = data[key];

    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        processed[snakeKey] = JSON.stringify(value);
      } else {
        processed[snakeKey] = value;
      }
    } else if (typeof value === "object" && value !== null) {
      processed[snakeKey] = JSON.stringify(value);
    } else {
      processed[snakeKey] = value;
    }
  }
  return processed;
}

/**
 * Syncs a record to Supabase using upsert.
 * Catches errors gracefully to keep the server running.
 */
export async function syncToSupabase(table: string, data: any) {
  const client = getSupabase();
  if (!client) {
    return;
  }

  try {
    console.log(`[Supabase Sync] Syncing record to table '${table}'...`);
    const processedData = formatDataForSupabase(data);
    const { error } = await client.from(table).upsert(processedData);
    if (error) {
      console.error(`[Supabase Sync] Error syncing to table '${table}':`, error.message);
    } else {
      console.log(`[Supabase Sync] Successfully synced to table '${table}'.`);
    }
  } catch (err: any) {
    console.error(`[Supabase Sync] Exception syncing to table '${table}':`, err.message || err);
  }
}

/**
 * Deletes a record from Supabase.
 */
export async function deleteFromSupabase(table: string, idValue: string, idField: string = "id") {
  const client = getSupabase();
  if (!client) {
    return;
  }

  try {
    const snakeIdField = toSnakeCase(idField);
    console.log(`[Supabase Sync] Deleting record from table '${table}' where ${snakeIdField} = ${idValue}...`);
    const { error } = await client.from(table).delete().eq(snakeIdField, idValue);
    if (error) {
      console.error(`[Supabase Sync] Error deleting from table '${table}':`, error.message);
    } else {
      console.log(`[Supabase Sync] Successfully deleted from table '${table}'.`);
    }
  } catch (err: any) {
    console.error(`[Supabase Sync] Exception deleting from table '${table}':`, err.message || err);
  }
}
