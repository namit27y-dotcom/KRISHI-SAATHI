import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { dbConnection } from "../db/connection.js";

export class AuthService {
  public static async register(data: any) {
    const { 
      name, 
      email, 
      password, 
      mobile, 
      role = "farmer", 
      preferredLanguage = "en",
      country = "India", 
      state = "", 
      district = "", 
      village = "", 
      postalCode = "",
      landArea = 0, 
      landUnit = "Acres", 
      soilType = "Loamy",
      cropsGrown = [],
      companyName = "", 
      gstNumber = "", 
      buyerType = "",
      latitude = null,
      longitude = null
    } = data;

    // Check if user already exists
    const existing = await dbConnection.query(`SELECT id FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (existing && existing.length > 0) {
      throw new Error("A user with this email already exists");
    }

    const id = "usr-" + Math.random().toString(36).substring(2, 11);
    const passwordHash = await bcrypt.hash(password, 10);
    const isVerified = role === "admin"; // Admin pre-verified, others pending admin approval

    const cropsJson = Array.isArray(cropsGrown) 
      ? JSON.stringify(cropsGrown) 
      : typeof cropsGrown === "string" 
        ? JSON.stringify(cropsGrown.split(",").map((s: string) => s.trim())) 
        : null;

    const query = `
      INSERT INTO users (
        id, name, email, password_hash, mobile, role, preferred_language,
        country, state, district, village, postal_code, land_area, land_unit,
        soil_type, crops_grown, company_name, gst_number, buyer_type,
        latitude, longitude, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id, name, email.toLowerCase().trim(), passwordHash, mobile || "", role, preferredLanguage,
      country, state, district, village, postalCode, landArea, landUnit,
      soilType, cropsJson, companyName, gstNumber, buyerType,
      latitude, longitude, isVerified
    ];

    await dbConnection.execute(query, params);

    // Create a welcome notification
    await dbConnection.execute(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "notif-" + Math.random().toString(36).substring(2, 11),
        id,
        "Welcome to Krishi Saathi! 🌾",
        role === "admin"
          ? "You are logged in as Platform Administrator. You can now verify users, monitor crop listings, and equipment sellers."
          : `Your ${role} profile has been created successfully. Real-time agricultural intelligence and marketplace are ready.`,
        "success",
        false
      ]
    );

    const fallbackUser = {
      id, name, email: email.toLowerCase().trim(), mobile, role, preferredLanguage,
      country, state, district, village, landArea, landUnit, soilType,
      cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : [],
      companyName, gstNumber, buyerType, isVerified, createdAt: new Date().toISOString()
    };
    dbConnection.getFallbackTable("users").push({ ...fallbackUser, password_hash: passwordHash });
    dbConnection.saveFallback();

    // Generate JWT
    const token = jwt.sign(
      { userId: id, role, email: email.toLowerCase().trim() },
      ENV.JWT_SECRET as jwt.Secret,
      { expiresIn: (ENV.JWT_EXPIRES_IN || "7d") as any }
    );

    return { user: fallbackUser, token };
  }

  public static async login(email: string, password: string) {
    const users = await dbConnection.query(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    let userRecord = users && users.length > 0 ? users[0] : null;

    if (!userRecord) {
      const fallbackList = dbConnection.getFallbackTable("users");
      userRecord = fallbackList.find(u => u.email?.toLowerCase() === email.toLowerCase().trim());
    }

    if (!userRecord) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, userRecord.password_hash || userRecord.passwordHash);
    if (!passwordMatch) {
      if (userRecord.password_hash !== password && userRecord.passwordHash !== password) {
        throw new Error("Invalid email or password");
      }
    }

    const token = jwt.sign(
      { userId: userRecord.id, role: userRecord.role, email: userRecord.email },
      ENV.JWT_SECRET as jwt.Secret,
      { expiresIn: (ENV.JWT_EXPIRES_IN || "7d") as any }
    );

    const { password_hash, passwordHash, ...userClean } = userRecord;

    return {
      user: {
        id: userClean.id,
        name: userClean.name,
        email: userClean.email,
        mobile: userClean.mobile,
        role: userClean.role,
        isVerified: !!userClean.is_verified || !!userClean.isVerified,
        preferredLanguage: userClean.preferred_language || userClean.preferredLanguage || "en",
        country: userClean.country || "India",
        state: userClean.state || "",
        district: userClean.district || "",
        village: userClean.village || "",
        landArea: userClean.land_area !== undefined ? Number(userClean.land_area) : userClean.landArea,
        landUnit: userClean.land_unit || userClean.landUnit || "Acres",
        soilType: userClean.soil_type || userClean.soilType || "Loamy",
        cropsGrown: typeof userClean.crops_grown === "string" ? JSON.parse(userClean.crops_grown) : (userClean.cropsGrown || []),
        companyName: userClean.company_name || userClean.companyName || "",
        gstNumber: userClean.gst_number || userClean.gstNumber || "",
        buyerType: userClean.buyer_type || userClean.buyerType || "",
        createdAt: userClean.created_at || userClean.createdAt || new Date().toISOString()
      },
      token
    };
  }

  public static async getProfile(userId: string) {
    const users = await dbConnection.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    let u = users && users.length > 0 ? users[0] : null;
    if (!u) {
      const fallbackList = dbConnection.getFallbackTable("users");
      u = fallbackList.find(x => x.id === userId);
    }
    if (!u) throw new Error("User not found");

    const { password_hash, passwordHash, ...clean } = u;
    return {
      id: clean.id,
      name: clean.name,
      email: clean.email,
      mobile: clean.mobile,
      role: clean.role,
      isVerified: !!clean.is_verified || !!clean.isVerified,
      preferredLanguage: clean.preferred_language || clean.preferredLanguage || "en",
      country: clean.country || "India",
      state: clean.state || "",
      district: clean.district || "",
      village: clean.village || "",
      landArea: clean.land_area !== undefined ? Number(clean.land_area) : clean.landArea,
      landUnit: clean.land_unit || clean.landUnit || "Acres",
      soilType: clean.soil_type || clean.soilType || "Loamy",
      cropsGrown: typeof clean.crops_grown === "string" ? JSON.parse(clean.crops_grown) : (clean.cropsGrown || []),
      companyName: clean.company_name || clean.companyName || "",
      gstNumber: clean.gst_number || clean.gstNumber || "",
      buyerType: clean.buyer_type || clean.buyerType || "",
      createdAt: clean.created_at || clean.createdAt || new Date().toISOString()
    };
  }
}
