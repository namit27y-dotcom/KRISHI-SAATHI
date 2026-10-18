import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env.js";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool | null = null;
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  
  // Fallback in-memory storage for offline development
  private fallbackData: Record<string, any[]> = {};
  private readonly fallbackFile = path.join(process.cwd(), "data", "db.json");

  private constructor() {
    this.initFallbackData();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<boolean> {
    try {
      this.pool = mysql.createPool({
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        user: ENV.DB_USER,
        password: ENV.DB_PASSWORD,
        database: ENV.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000,
        decimalNumbers: true,
        multipleStatements: true,
      });

      // Race the connection test against a 5-second timeout
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout after 5000ms")), 5000)
      );

      const conn = await Promise.race([this.pool.getConnection(), timeoutPromise]);
      await (conn as mysql.PoolConnection).ping();
      (conn as mysql.PoolConnection).release();

      this.isConnected = true;
      this.connectionError = null;
      console.log(`[MySQL] Connected successfully to ${ENV.DB_USER}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`);
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.connectionError = err.message || "Failed to connect to MySQL";
      // Destroy the pool so it doesn't keep trying in the background
      if (this.pool) {
        try { await this.pool.end(); } catch (_) {}
        this.pool = null;
      }
      console.warn(`[Storage] MySQL connection unavailable (${err.message}). Active mode: Persistent JSON fallback storage (data/db.json).`);
      return false;
    }
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      error: this.connectionError,
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      database: ENV.DB_NAME,
      user: ENV.DB_USER
    };
  }

  public getPool(): Pool | null {
    return this.pool;
  }

  public async query<T extends RowDataPacket[] | RowDataPacket[][] = any>(sql: string, params: any[] = []): Promise<T> {
    if (this.isConnected && this.pool) {
      const [rows] = await this.pool.query<T>(sql, params);
      return rows;
    }
    return this.fallbackQuery(sql, params) as any;
  }

  public async execute(sql: string, params: any[] = []): Promise<ResultSetHeader> {
    if (this.isConnected && this.pool) {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, params);
      return result;
    }
    return this.fallbackExecute(sql, params);
  }

  public async withTransaction<T>(callback: (conn: PoolConnection | null) => Promise<T>): Promise<T> {
    if (this.isConnected && this.pool) {
      const conn = await this.pool.getConnection();
      try {
        await conn.beginTransaction();
        const result = await callback(conn);
        await conn.commit();
        return result;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } else {
      // Fallback in-memory transaction
      return await callback(null);
    }
  }

  // --- Fallback In-Memory / File Storage Helpers ---
  private initFallbackData() {
    try {
      if (fs.existsSync(this.fallbackFile)) {
        const raw = fs.readFileSync(this.fallbackFile, "utf-8");
        const parsed = JSON.parse(raw);
        for (const key of Object.keys(parsed)) {
          if (Array.isArray(parsed[key])) {
            this.fallbackData[key] = parsed[key];
          } else if (typeof parsed[key] === "object" && parsed[key] !== null) {
            this.fallbackData[key] = Object.values(parsed[key]);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load fallback db.json, starting empty", e);
    }
  }

  public saveFallback() {
    try {
      const dir = path.dirname(this.fallbackFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.fallbackFile, JSON.stringify(this.fallbackData, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save fallback data", e);
    }
  }

  public getFallbackTable(tableName: string): any[] {
    if (!this.fallbackData[tableName]) {
      this.fallbackData[tableName] = [];
    }
    return this.fallbackData[tableName];
  }

  private fallbackQuery(sql: string, params: any[] = []): any[] {
    const lower = sql.toLowerCase().trim();
    const fromMatch = lower.match(/from\s+([a-zA-Z0-9_]+)/);
    const tableName = fromMatch ? fromMatch[1] : "";
    let records = [...this.getFallbackTable(tableName)];

    if (lower.includes("where id = ?") && params.length >= 1) {
      const found = records.find(r => r.id === params[0]);
      return found ? [found] : [];
    }
    if (lower.includes("where email = ?") && params.length >= 1) {
      const found = records.find(r => r.email?.toLowerCase() === params[0]?.toLowerCase());
      return found ? [found] : [];
    }
    if (lower.includes("where category_id = ?") && params.length >= 1) {
      records = records.filter(r => (r.category_id === params[0] || r.categoryId === params[0]));
    }
    if (lower.includes("where course_id = ?") && params.length >= 1) {
      records = records.filter(r => (r.course_id === params[0] || r.courseId === params[0]));
    }
    if (lower.includes("where module_id = ?") && params.length >= 1) {
      records = records.filter(r => (r.module_id === params[0] || r.moduleId === params[0]));
    }
    if (lower.includes("where lesson_id = ?") && params.length >= 1) {
      records = records.filter(r => (r.lesson_id === params[0] || r.lessonId === params[0]));
    }
    if (lower.includes("where user_id = ?") && params.length >= 1) {
      records = records.filter(r => (r.user_id === params[0] || r.userId === params[0]));
    }
    if (lower.includes("is_published = true") || lower.includes("is_published = 1")) {
      records = records.filter(r => r.is_published !== false && r.isPublished !== false);
    }
    if (lower.includes("is_active = true") || lower.includes("is_active = 1")) {
      records = records.filter(r => r.is_active !== false && r.isActive !== false);
    }
    return records;
  }

  private fallbackExecute(sql: string, params: any[] = []): ResultSetHeader {
    const lower = sql.toLowerCase().trim();
    const result = {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      info: "",
      serverStatus: 2,
      warningStatus: 0,
      changedRows: 0
    };

    if (lower.startsWith("insert into user_lesson_progress")) {
      const table = this.getFallbackTable("user_lesson_progress");
      const [id, userId, lessonId, isCompleted, lastWatchedSeconds] = params;
      const idx = table.findIndex(r => r.user_id === userId && r.lesson_id === lessonId);
      const record = {
        id: id || `prog-${userId}-${lessonId}`,
        user_id: userId,
        lesson_id: lessonId,
        is_completed: Boolean(isCompleted),
        last_watched_seconds: Number(lastWatchedSeconds || 0),
        updated_at: new Date().toISOString()
      };
      if (idx >= 0) {
        table[idx] = { ...table[idx], ...record };
      } else {
        table.push(record);
      }
    } else if (lower.startsWith("insert into")) {
      const match = lower.match(/insert into\s+([a-zA-Z0-9_]+)/);
      if (match) {
        const table = match[1];
        this.getFallbackTable(table);
      }
    }
    this.saveFallback();
    return result as unknown as ResultSetHeader;
  }
}

export const dbConnection = DatabaseConnection.getInstance();
export default dbConnection;
