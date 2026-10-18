import { dbConnection } from "../db/connection.js";

export class UserService {
  public static async updateProfile(userId: string, data: any) {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.name !== undefined) { fields.push("name = ?"); params.push(data.name); }
    if (data.mobile !== undefined) { fields.push("mobile = ?"); params.push(data.mobile); }
    if (data.preferredLanguage !== undefined) { fields.push("preferred_language = ?"); params.push(data.preferredLanguage); }
    if (data.country !== undefined) { fields.push("country = ?"); params.push(data.country); }
    if (data.state !== undefined) { fields.push("state = ?"); params.push(data.state); }
    if (data.district !== undefined) { fields.push("district = ?"); params.push(data.district); }
    if (data.village !== undefined) { fields.push("village = ?"); params.push(data.village); }
    if (data.postalCode !== undefined) { fields.push("postal_code = ?"); params.push(data.postalCode); }
    if (data.landArea !== undefined) { fields.push("land_area = ?"); params.push(data.landArea); }
    if (data.landUnit !== undefined) { fields.push("land_unit = ?"); params.push(data.landUnit); }
    if (data.soilType !== undefined) { fields.push("soil_type = ?"); params.push(data.soilType); }
    if (data.cropsGrown !== undefined) {
      fields.push("crops_grown = ?");
      params.push(Array.isArray(data.cropsGrown) ? JSON.stringify(data.cropsGrown) : data.cropsGrown);
    }
    if (data.companyName !== undefined) { fields.push("company_name = ?"); params.push(data.companyName); }
    if (data.gstNumber !== undefined) { fields.push("gst_number = ?"); params.push(data.gstNumber); }
    if (data.buyerType !== undefined) { fields.push("buyer_type = ?"); params.push(data.buyerType); }
    if (data.latitude !== undefined) { fields.push("latitude = ?"); params.push(data.latitude); }
    if (data.longitude !== undefined) { fields.push("longitude = ?"); params.push(data.longitude); }
    if (data.isVerified !== undefined) { fields.push("is_verified = ?"); params.push(data.isVerified); }

    if (fields.length > 0) {
      params.push(userId);
      await dbConnection.execute(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, params);
    }

    // Update in fallback table
    const fallbackList = dbConnection.getFallbackTable("users");
    const idx = fallbackList.findIndex(x => x.id === userId);
    if (idx >= 0) {
      fallbackList[idx] = { ...fallbackList[idx], ...data };
      dbConnection.saveFallback();
    }

    const updated = await dbConnection.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    const u = updated && updated.length > 0 ? updated[0] : (fallbackList[idx] || {});
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

  public static async getAllUsers() {
    const rows = await dbConnection.query(`SELECT id, name, email, mobile, role, preferred_language, country, state, district, village, land_area, land_unit, soil_type, company_name, gst_number, buyer_type, is_verified, created_at FROM users ORDER BY created_at DESC`);
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        mobile: r.mobile,
        role: r.role,
        isVerified: !!r.is_verified,
        preferredLanguage: r.preferred_language || "en",
        country: r.country || "India",
        state: r.state || "",
        district: r.district || "",
        village: r.village || "",
        landArea: r.land_area ? Number(r.land_area) : 0,
        landUnit: r.land_unit || "Acres",
        soilType: r.soil_type || "Loamy",
        companyName: r.company_name || "",
        gstNumber: r.gst_number || "",
        buyerType: r.buyer_type || "",
        createdAt: r.created_at
      }));
    }
    const fallbackList = dbConnection.getFallbackTable("users");
    return fallbackList.map(({ password_hash, passwordHash, ...clean }) => clean);
  }

  public static async verifyUser(userId: string, isVerified: boolean) {
    await dbConnection.execute(`UPDATE users SET is_verified = ? WHERE id = ?`, [isVerified, userId]);
    
    // Add notification
    await dbConnection.execute(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "notif-" + Math.random().toString(36).substring(2, 11),
        userId,
        isVerified ? "Account Verified! 🛡️" : "Verification Revoked",
        isVerified 
          ? "A Platform Administrator has verified your credentials. You can now engage in trade and view full services."
          : "Your account is currently unverified. Please upload genuine details or contact administration.",
        isVerified ? "success" : "warning",
        false
      ]
    );

    const fallbackList = dbConnection.getFallbackTable("users");
    const found = fallbackList.find(x => x.id === userId);
    if (found) {
      found.is_verified = isVerified;
      found.isVerified = isVerified;
      dbConnection.saveFallback();
    }
    return true;
  }

  public static async deleteUser(userId: string) {
    await dbConnection.execute(`DELETE FROM users WHERE id = ?`, [userId]);
    const fallbackList = dbConnection.getFallbackTable("users");
    const idx = fallbackList.findIndex(x => x.id === userId);
    if (idx >= 0) {
      fallbackList.splice(idx, 1);
      dbConnection.saveFallback();
    }
    return true;
  }
}
