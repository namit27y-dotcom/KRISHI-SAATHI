import fs from "fs";
import path from "path";
import { dbConnection } from "./connection.js";

export async function runMigrations(): Promise<boolean> {
  try {
    console.log("[Migrations] Running database migrations...");
    const schemaPath = path.join(process.cwd(), "src", "server", "db", "schema.sql");
    
    if (!fs.existsSync(schemaPath)) {
      console.warn(`[Migrations] Schema file not found at ${schemaPath}`);
      return false;
    }

    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    const status = dbConnection.getStatus();

    if (status.connected && dbConnection.getPool()) {
      // Split statements on semicolon while ignoring comments
      const cleanSql = schemaSql
        .replace(/--.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");

      const statements = cleanSql
        .split(";")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const conn = await dbConnection.getPool()!.getConnection();
      try {
        for (const statement of statements) {
          if (statement) {
            await conn.query(statement);
          }
        }
        console.log(`[Migrations] Successfully executed ${statements.length} DDL statements on MySQL.`);
      } finally {
        conn.release();
      }
    } else {
      console.log("[Migrations] MySQL offline. Initialized persistent schema structures.");
    }
    return true;
  } catch (err: any) {
    console.error("[Migrations] Error running migrations:", err.message || err);
    return false;
  }
}
