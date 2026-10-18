import { dbConnection } from "../db/connection.js";

export class MarketplaceService {
  // --- CROP LISTINGS ---
  public static async getCropListings(filters: { country?: string; state?: string; district?: string; cropName?: string; onlyVerified?: boolean }) {
    let sql = `SELECT * FROM crop_listings WHERE 1=1`;
    const params: any[] = [];

    if (filters.country) {
      sql += ` AND LOWER(country) = LOWER(?)`;
      params.push(filters.country);
    }
    if (filters.state) {
      sql += ` AND LOWER(state) = LOWER(?)`;
      params.push(filters.state);
    }
    if (filters.district) {
      sql += ` AND LOWER(district) = LOWER(?)`;
      params.push(filters.district);
    }
    if (filters.cropName) {
      sql += ` AND LOWER(crop_name) LIKE LOWER(?)`;
      params.push(`%${filters.cropName}%`);
    }
    if (filters.onlyVerified) {
      sql += ` AND is_verified = TRUE`;
    }

    sql += ` ORDER BY created_at DESC`;

    const rows = await dbConnection.query(sql, params);
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        farmerId: r.farmer_id,
        farmerName: r.farmer_name,
        cropName: r.crop_name,
        cropCategory: r.crop_category,
        quantity: Number(r.quantity),
        unit: r.unit,
        pricePerUnit: Number(r.price_per_unit),
        country: r.country,
        state: r.state,
        district: r.district,
        village: r.village,
        harvestDate: r.harvest_date,
        description: r.description,
        imageUrl: r.image_url,
        isVerified: !!r.is_verified,
        createdAt: r.created_at
      }));
    }

    // Fallback filter
    let list = dbConnection.getFallbackTable("crop_listings");
    if (filters.country) list = list.filter(l => l.country?.toLowerCase() === filters.country!.toLowerCase());
    if (filters.state) list = list.filter(l => l.state?.toLowerCase() === filters.state!.toLowerCase());
    if (filters.district) list = list.filter(l => l.district?.toLowerCase() === filters.district!.toLowerCase());
    if (filters.cropName) list = list.filter(l => (l.crop_name || l.cropName)?.toLowerCase().includes(filters.cropName!.toLowerCase()));
    if (filters.onlyVerified) list = list.filter(l => l.is_verified || l.isVerified);
    return list.map(l => ({
      id: l.id,
      farmerId: l.farmer_id || l.farmerId,
      farmerName: l.farmer_name || l.farmerName,
      cropName: l.crop_name || l.cropName,
      cropCategory: l.crop_category || l.cropCategory || "Grain",
      quantity: Number(l.quantity),
      unit: l.unit,
      pricePerUnit: Number(l.price_per_unit || l.pricePerUnit),
      country: l.country || "India",
      state: l.state,
      district: l.district,
      village: l.village || "",
      description: l.description || "",
      imageUrl: l.image_url || l.imageUrl,
      isVerified: !!(l.is_verified || l.isVerified),
      createdAt: l.created_at || l.createdAt || new Date().toISOString()
    }));
  }

  public static async createCropListing(user: any, data: any) {
    const id = "crop-" + Math.random().toString(36).substring(2, 11);
    const { cropName, cropCategory = "Grain", quantity, unit, pricePerUnit, harvestDate, description, imageUrl } = data;

    const sql = `
      INSERT INTO crop_listings (
        id, farmer_id, farmer_name, crop_name, crop_category, quantity, unit,
        price_per_unit, country, state, district, village, harvest_date,
        description, image_url, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const defaultImg = imageUrl || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600";
    const params = [
      id, user.id, user.name, cropName, cropCategory, parseFloat(quantity), unit,
      parseFloat(pricePerUnit), user.country || "India", user.state, user.district,
      user.village || "", harvestDate || null, description || "", defaultImg, false
    ];

    await dbConnection.execute(sql, params);

    // Notification
    await dbConnection.execute(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "notif-" + Math.random().toString(36).substring(2, 11),
        user.id,
        "Crop Listing Submitted 🌾",
        `Your listing for ${cropName} has been submitted and is pending admin verification.`,
        "success",
        false
      ]
    );

    const newListing = {
      id,
      farmerId: user.id,
      farmerName: user.name,
      cropName,
      cropCategory,
      quantity: parseFloat(quantity),
      unit,
      pricePerUnit: parseFloat(pricePerUnit),
      country: user.country || "India",
      state: user.state,
      district: user.district,
      village: user.village || "",
      description: description || "",
      imageUrl: defaultImg,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    dbConnection.getFallbackTable("crop_listings").push(newListing);
    dbConnection.saveFallback();

    return newListing;
  }

  public static async updateCropListing(id: string, user: any, updates: any) {
    // Ownership check
    const existing = await dbConnection.query(`SELECT * FROM crop_listings WHERE id = ?`, [id]);
    const listing = existing && existing.length > 0 ? existing[0] : dbConnection.getFallbackTable("crop_listings").find(x => x.id === id);
    if (!listing) throw new Error("Crop listing not found");

    const ownerId = listing.farmer_id || listing.farmerId;
    if (user.role !== "admin" && user.id !== ownerId) {
      throw new Error("Forbidden: You can only modify your own crop listings.");
    }

    const fields: string[] = [];
    const params: any[] = [];
    if (updates.cropName !== undefined) { fields.push("crop_name = ?"); params.push(updates.cropName); }
    if (updates.cropCategory !== undefined) { fields.push("crop_category = ?"); params.push(updates.cropCategory); }
    if (updates.quantity !== undefined) { fields.push("quantity = ?"); params.push(parseFloat(updates.quantity)); }
    if (updates.unit !== undefined) { fields.push("unit = ?"); params.push(updates.unit); }
    if (updates.pricePerUnit !== undefined) { fields.push("price_per_unit = ?"); params.push(parseFloat(updates.pricePerUnit)); }
    if (updates.description !== undefined) { fields.push("description = ?"); params.push(updates.description); }
    if (updates.imageUrl !== undefined) { fields.push("image_url = ?"); params.push(updates.imageUrl); }
    if (updates.isVerified !== undefined && user.role === "admin") { fields.push("is_verified = ?"); params.push(updates.isVerified); }

    if (fields.length > 0) {
      params.push(id);
      await dbConnection.execute(`UPDATE crop_listings SET ${fields.join(", ")} WHERE id = ?`, params);
    }

    const fallbackList = dbConnection.getFallbackTable("crop_listings");
    const idx = fallbackList.findIndex(x => x.id === id);
    if (idx >= 0) {
      fallbackList[idx] = { ...fallbackList[idx], ...updates };
      dbConnection.saveFallback();
    }

    return { ...listing, ...updates };
  }

  public static async deleteCropListing(id: string, user: any) {
    const existing = await dbConnection.query(`SELECT * FROM crop_listings WHERE id = ?`, [id]);
    const listing = existing && existing.length > 0 ? existing[0] : dbConnection.getFallbackTable("crop_listings").find(x => x.id === id);
    if (!listing) throw new Error("Crop listing not found");

    const ownerId = listing.farmer_id || listing.farmerId;
    if (user.role !== "admin" && user.id !== ownerId) {
      throw new Error("Forbidden: You can only delete your own crop listings.");
    }

    await dbConnection.execute(`DELETE FROM crop_listings WHERE id = ?`, [id]);
    const fallbackList = dbConnection.getFallbackTable("crop_listings");
    const idx = fallbackList.findIndex(x => x.id === id);
    if (idx >= 0) {
      fallbackList.splice(idx, 1);
      dbConnection.saveFallback();
    }
    return true;
  }

  public static async verifyCropListing(id: string, isVerified: boolean) {
    await dbConnection.execute(`UPDATE crop_listings SET is_verified = ? WHERE id = ?`, [isVerified, id]);
    
    const existing = await dbConnection.query(`SELECT * FROM crop_listings WHERE id = ?`, [id]);
    const listing = existing && existing.length > 0 ? existing[0] : dbConnection.getFallbackTable("crop_listings").find(x => x.id === id);
    if (listing) {
      const farmerId = listing.farmer_id || listing.farmerId;
      const cropName = listing.crop_name || listing.cropName;
      await dbConnection.execute(
        `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "notif-" + Math.random().toString(36).substring(2, 11),
          farmerId,
          isVerified ? "Crop Listing Approved! 💚" : "Crop Listing Disapproved",
          isVerified 
            ? `Your crop listing for ${cropName} was verified by Admin and is now live.`
            : `Your crop listing for ${cropName} is under verification hold.`,
          isVerified ? "success" : "warning",
          false
        ]
      );
    }
    return true;
  }

  // --- AGRICULTURAL PRODUCTS ---
  public static async getProducts(filters: { category?: string; onlyVerified?: boolean }) {
    let sql = `SELECT * FROM agricultural_products WHERE 1=1`;
    const params: any[] = [];

    if (filters.category) {
      sql += ` AND LOWER(category) = LOWER(?)`;
      params.push(filters.category);
    }
    if (filters.onlyVerified) {
      sql += ` AND is_verified = TRUE`;
    }

    sql += ` ORDER BY created_at DESC`;

    const rows = await dbConnection.query(sql, params);
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        sellerId: r.seller_id,
        sellerName: r.seller_name,
        name: r.name,
        category: r.category,
        description: r.description,
        price: Number(r.price),
        unit: r.unit,
        inventory: Number(r.inventory),
        imageUrl: r.image_url,
        isVerified: !!r.is_verified,
        createdAt: r.created_at
      }));
    }

    let list = dbConnection.getFallbackTable("agricultural_products");
    if (filters.category) list = list.filter(p => p.category?.toLowerCase() === filters.category!.toLowerCase());
    if (filters.onlyVerified) list = list.filter(p => p.is_verified || p.isVerified);
    return list.map(p => ({
      id: p.id,
      sellerId: p.seller_id || p.sellerId,
      sellerName: p.seller_name || p.sellerName,
      name: p.name,
      category: p.category,
      description: p.description,
      price: Number(p.price),
      unit: p.unit,
      inventory: Number(p.inventory),
      imageUrl: p.image_url || p.imageUrl,
      isVerified: !!(p.is_verified || p.isVerified),
      createdAt: p.created_at || p.createdAt || new Date().toISOString()
    }));
  }

  public static async createProduct(user: any, data: any) {
    const id = "prod-" + Math.random().toString(36).substring(2, 11);
    const { name, category, description, price, unit, inventory, imageUrl } = data;

    const sql = `
      INSERT INTO agricultural_products (
        id, seller_id, seller_name, name, category, description,
        price, unit, inventory, image_url, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const defaultImg = imageUrl || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600";
    const params = [
      id, user.id, user.companyName || user.name, name, category, description,
      parseFloat(price), unit, parseInt(inventory, 10), defaultImg, false
    ];

    await dbConnection.execute(sql, params);

    const newProd = {
      id,
      sellerId: user.id,
      sellerName: user.companyName || user.name,
      name,
      category,
      description,
      price: parseFloat(price),
      unit,
      inventory: parseInt(inventory, 10),
      imageUrl: defaultImg,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    dbConnection.getFallbackTable("agricultural_products").push(newProd);
    dbConnection.saveFallback();

    return newProd;
  }

  public static async updateProduct(id: string, user: any, updates: any) {
    const existing = await dbConnection.query(`SELECT * FROM agricultural_products WHERE id = ?`, [id]);
    const prod = existing && existing.length > 0 ? existing[0] : dbConnection.getFallbackTable("agricultural_products").find(x => x.id === id);
    if (!prod) throw new Error("Product not found");

    const ownerId = prod.seller_id || prod.sellerId;
    if (user.role !== "admin" && user.id !== ownerId) {
      throw new Error("Forbidden: You can only modify your own products.");
    }

    const fields: string[] = [];
    const params: any[] = [];
    if (updates.name !== undefined) { fields.push("name = ?"); params.push(updates.name); }
    if (updates.category !== undefined) { fields.push("category = ?"); params.push(updates.category); }
    if (updates.description !== undefined) { fields.push("description = ?"); params.push(updates.description); }
    if (updates.price !== undefined) { fields.push("price = ?"); params.push(parseFloat(updates.price)); }
    if (updates.unit !== undefined) { fields.push("unit = ?"); params.push(updates.unit); }
    if (updates.inventory !== undefined) { fields.push("inventory = ?"); params.push(parseInt(updates.inventory, 10)); }
    if (updates.imageUrl !== undefined) { fields.push("image_url = ?"); params.push(updates.imageUrl); }
    if (updates.isVerified !== undefined && user.role === "admin") { fields.push("is_verified = ?"); params.push(updates.isVerified); }

    if (fields.length > 0) {
      params.push(id);
      await dbConnection.execute(`UPDATE agricultural_products SET ${fields.join(", ")} WHERE id = ?`, params);
    }

    const fallbackList = dbConnection.getFallbackTable("agricultural_products");
    const idx = fallbackList.findIndex(x => x.id === id);
    if (idx >= 0) {
      fallbackList[idx] = { ...fallbackList[idx], ...updates };
      dbConnection.saveFallback();
    }

    return { ...prod, ...updates };
  }

  public static async deleteProduct(id: string, user: any) {
    const existing = await dbConnection.query(`SELECT * FROM agricultural_products WHERE id = ?`, [id]);
    const prod = existing && existing.length > 0 ? existing[0] : dbConnection.getFallbackTable("agricultural_products").find(x => x.id === id);
    if (!prod) throw new Error("Product not found");

    const ownerId = prod.seller_id || prod.sellerId;
    if (user.role !== "admin" && user.id !== ownerId) {
      throw new Error("Forbidden: You can only delete your own products.");
    }

    await dbConnection.execute(`DELETE FROM agricultural_products WHERE id = ?`, [id]);
    const fallbackList = dbConnection.getFallbackTable("agricultural_products");
    const idx = fallbackList.findIndex(x => x.id === id);
    if (idx >= 0) {
      fallbackList.splice(idx, 1);
      dbConnection.saveFallback();
    }
    return true;
  }

  public static async verifyProduct(id: string, isVerified: boolean) {
    await dbConnection.execute(`UPDATE agricultural_products SET is_verified = ? WHERE id = ?`, [isVerified, id]);
    
    const existing = await dbConnection.query(`SELECT * FROM agricultural_products WHERE id = ?`, [id]);
    const prod = existing && existing.length > 0 ? existing[0] : dbConnection.getFallbackTable("agricultural_products").find(x => x.id === id);
    if (prod) {
      const sellerId = prod.seller_id || prod.sellerId;
      const prodName = prod.name;
      await dbConnection.execute(
        `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "notif-" + Math.random().toString(36).substring(2, 11),
          sellerId,
          isVerified ? "Product Approved 🏪" : "Product Under Review",
          isVerified 
            ? `Your product ${prodName} has been approved and is now visible to Farmers.`
            : `Your product ${prodName} has been placed under review by Admin.`,
          isVerified ? "success" : "warning",
          false
        ]
      );
    }
    return true;
  }
}
