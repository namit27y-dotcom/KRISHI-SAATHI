import { Request, Response, NextFunction } from "express";
import { MarketplaceService } from "../services/marketplaceService.js";
import { cropListingSchema, productSchema } from "../validators/marketplaceValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export class MarketplaceController {
  // Crops
  public static async getCrops(req: Request, res: Response, next: NextFunction) {
    try {
      const { country, state, district, cropName, onlyVerified } = req.query;
      const listings = await MarketplaceService.getCropListings({
        country: country as string,
        state: state as string,
        district: district as string,
        cropName: cropName as string,
        onlyVerified: onlyVerified === "true"
      });
      res.json({ success: true, listings });
    } catch (err) {
      next(err);
    }
  }

  public static async createCrop(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const validated = cropListingSchema.parse(req.body);
      const listing = await MarketplaceService.createCropListing(req.user, validated);
      res.status(201).json({ success: true, listing });
    } catch (err) {
      next(err);
    }
  }

  public static async updateCrop(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const { id } = req.params;
      const updated = await MarketplaceService.updateCropListing(id, req.user, req.body);
      res.json({ success: true, listing: updated });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteCrop(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const { id } = req.params;
      const success = await MarketplaceService.deleteCropListing(id, req.user);
      res.json({ success });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyCrop(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;
      await MarketplaceService.verifyCropListing(id, !!isVerified);
      res.json({ success: true, message: `Crop verification set to ${!!isVerified}` });
    } catch (err) {
      next(err);
    }
  }

  // Products
  public static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, onlyVerified } = req.query;
      const products = await MarketplaceService.getProducts({
        category: category as string,
        onlyVerified: onlyVerified === "true"
      });
      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  }

  public static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const validated = productSchema.parse(req.body);
      const product = await MarketplaceService.createProduct(req.user, validated);
      res.status(201).json({ success: true, product });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const { id } = req.params;
      const updated = await MarketplaceService.updateProduct(id, req.user, req.body);
      res.json({ success: true, product: updated });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const { id } = req.params;
      const success = await MarketplaceService.deleteProduct(id, req.user);
      res.json({ success });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;
      await MarketplaceService.verifyProduct(id, !!isVerified);
      res.json({ success: true, message: `Product verification set to ${!!isVerified}` });
    } catch (err) {
      next(err);
    }
  }
}
