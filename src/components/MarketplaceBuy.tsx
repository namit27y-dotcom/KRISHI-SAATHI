import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  ShoppingBag, 
  Search, 
  Tag, 
  MessageSquare, 
  AlertCircle, 
  ShoppingCart, 
  Check, 
  Loader2, 
  Star, 
  ShieldCheck, 
  Info, 
  SlidersHorizontal,
  X,
  Truck,
  CheckCircle2,
  Package,
  ArrowUpDown
} from "lucide-react";
import CheckoutFlow from "./CheckoutFlow";
import { MARKETPLACE_CATEGORIES, AGRICULTURE_FALLBACK_IMAGE } from "../data/marketplaceData";
import { useLanguage, Bi } from "../contexts/LanguageContext.tsx";

interface MarketplaceBuyProps {
  user: any;
  onChatNavigate: (partnerId: string, partnerName: string) => void;
}

export default function MarketplaceBuy({ user, onChatNavigate }: MarketplaceBuyProps) {
  const { t, b, isBilingual } = useLanguage();
  const mp = t.marketplace;

  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Modals state
  const [detailProduct, setDetailProduct] = useState<any | null>(null);
  const [orderingProduct, setOrderingProduct] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrderForPayment, setCreatedOrderForPayment] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/marketplace/products?onlyVerified=true${category ? `&category=${category}` : ""}`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        if (inStockOnly && prod.inventory <= 0) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          prod.name?.toLowerCase().includes(q) ||
          prod.description?.toLowerCase().includes(q) ||
          prod.brand?.toLowerCase().includes(q) ||
          prod.category?.toLowerCase().includes(q) ||
          prod.sellerName?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 4.5) - (a.rating || 4.5);
        return 0; // featured / default
      });
  }, [products, searchQuery, sortBy, inStockOnly]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingProduct) return;
    
    setOrderError(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/marketplace/orders", {
        type: "product",
        listingOrProductId: orderingProduct.id,
        quantity: orderQuantity,
        deliveryAddress: deliveryAddress || `${user?.village || "Farmer Market"}, ${user?.district || "Nashik"}, ${user?.state || "Maharashtra"}`
      }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user?.id || "guest"}` }
      });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      setOrderSuccess(true);
      
      // Directly transition to payment processing after order is saved in db
      if (res.data.order) {
        setCreatedOrderForPayment(res.data.order);
      } else {
        setTimeout(() => {
          setOrderingProduct(null);
          setOrderSuccess(false);
          setOrderQuantity(1);
          setDeliveryAddress("");
          fetchProducts(); // Refresh stock
        }, 2000);
      }

    } catch (err: any) {
      setOrderError(err.response?.data?.error || err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6" id="marketplace-buy-component">
      {/* Marketplace Trust & Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Agricultural Supplies & Machinery
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              <Bi 
                en="Buy Fertilizers & Equipment" 
                sub={mp.buyTitle} 
                variant="heading"
                enClassName="text-2xl sm:text-3xl font-black tracking-tight text-white block"
                subClassName="text-base sm:text-lg font-bold text-emerald-200 block mt-0.5"
              />
            </h2>
            <div className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              <Bi 
                en="Direct from Certified Agricultural Dealers & Equipment Manufacturers with Village Delivery." 
                sub={mp.buySubtitle}
                enClassName="text-xs sm:text-sm text-emerald-100/90 leading-relaxed block"
                subClassName="text-xs text-emerald-200/90 block mt-0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-lg font-black text-white block">100%</span>
              <span className="text-[10px] text-emerald-200 uppercase font-semibold tracking-wider">Certified Inputs</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-lg font-black text-white block">Fast</span>
              <span className="text-[10px] text-emerald-200 uppercase font-semibold tracking-wider">Village Delivery</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <span className="text-lg font-black text-white block">Direct</span>
              <span className="text-[10px] text-emerald-200 uppercase font-semibold tracking-wider">Dealer Rates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Category Cards Carousel / Strip (Real Agricultural Imagery, Zero Emojis) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            {mp.allCategories}
          </h3>
          <span className="text-xs text-slate-400">
            {category ? `Category: ${MARKETPLACE_CATEGORIES.find(c => c.id === category)?.name || category}` : "All agro categories"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
          {/* "All Products" Card */}
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer group ${
              category === ""
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl mb-2 flex items-center justify-center font-bold text-sm ${
              category === "" ? "bg-white/20 text-white" : "bg-slate-100 text-emerald-700 group-hover:bg-emerald-100"
            }`}>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="w-full text-center">
              <Bi 
                en="All Products" 
                sub={mp.allCategories} 
                enClassName={`text-xs font-black truncate block w-full ${category === "" ? "text-white" : "text-slate-800"}`}
                subClassName={`text-[10px] truncate block w-full ${category === "" ? "text-emerald-100" : "text-emerald-700"}`}
              />
            </div>
            <span className={`text-[9px] block mt-0.5 ${category === "" ? "text-emerald-200" : "text-slate-400"}`}>
              Catalog
            </span>
          </button>

          {/* 8 Real-Photo Agriculture Category Cards */}
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            const localizedCatName = 
              cat.id === "seeds" ? (mp.categories?.seeds || cat.name) :
              cat.id === "fertilizers" ? (mp.categories?.fertilizers || cat.name) :
              cat.id === "pesticides" ? (mp.categories?.pesticides || cat.name) :
              cat.id === "tractors" ? (mp.categories?.tractors || cat.name) :
              cat.id === "pumps" ? (mp.categories?.waterPumps || cat.name) :
              cat.id === "sprayers" ? (mp.categories?.sprayers || cat.name) :
              cat.id === "irrigation" ? (mp.categories?.irrigation || cat.name) :
              cat.id === "tools" ? (mp.categories?.farmTools || cat.name) : cat.name;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`relative flex flex-col items-center p-2 rounded-2xl border text-center transition-all cursor-pointer group overflow-hidden ${
                  isSelected
                    ? "bg-white border-emerald-600 ring-2 ring-emerald-600/30 shadow-md"
                    : "bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xs text-slate-700"
                }`}
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 relative bg-slate-100 border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = AGRICULTURE_FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full text-center">
                  <Bi 
                    en={cat.name} 
                    sub={localizedCatName} 
                    enClassName={`text-xs font-black truncate block w-full ${isSelected ? "text-emerald-700" : "text-slate-800"}`}
                    subClassName="text-[10px] text-emerald-700/90 font-medium truncate block w-full"
                  />
                </div>
                <span className="text-[10px] text-slate-400 truncate block w-full mt-0.5">
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={mp.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                aria-label={mp.sortBy}
                className="bg-transparent outline-none cursor-pointer text-slate-700 font-bold"
              >
                <option value="featured">{mp.sortFeatured}</option>
                <option value="price-asc">{mp.sortPriceLow}</option>
                <option value="price-desc">{mp.sortPriceHigh}</option>
                <option value="rating">{mp.sortRating}</option>
              </select>
            </div>

            <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 cursor-pointer select-none hover:bg-slate-100">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 accent-emerald-600"
              />
              {mp.inStockOnly}
            </label>
          </div>
        </div>

        {/* Results indicator & active filters */}
        <div className="flex items-center justify-between border-t border-slate-100 mt-3 pt-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> agricultural items
            {category && (
              <span> in <strong className="text-emerald-700 capitalize">{category.replace("_", " ")}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-slate-800">{searchQuery}</strong>"</span>
            )}
          </div>

          {(category || searchQuery || inStockOnly) && (
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setSearchQuery("");
                setInStockOnly(false);
              }}
              className="text-emerald-700 hover:text-emerald-800 font-bold text-xs underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <span className="text-xs text-slate-500 font-semibold block mt-3">Loading agricultural products...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-500 space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No agricultural products found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, changing the category filter, or toggling off "In Stock Only".
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("");
              setSearchQuery("");
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.inventory === 0;
            const isLowStock = product.inventory > 0 && product.inventory <= 5;
            const displayRating = product.rating || 4.8;
            const displayReviews = product.reviewsCount || 64;

            return (
              <div 
                key={product.id} 
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                {/* Product Image Header (Consistent 16:10 aspect ratio, clean agriculture photo) */}
                <div>
                  <div className="aspect-[16/10] w-full relative bg-slate-100 overflow-hidden">
                    <img
                      src={product.imageUrl || AGRICULTURE_FALLBACK_IMAGE}
                      alt={product.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = AGRICULTURE_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Category Pill (NO EMOJIS) */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-900/80 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-white/10">
                      <span>{product.category?.replace("_", " ")}</span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 right-3">
                      {isOutOfStock ? (
                        <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-xs">
                          <Bi en="Out of Stock" sub={mp.outOfStock} variant="badge" />
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-xs">
                          Only {product.inventory} left
                        </span>
                      ) : (
                        <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-xs">
                          <Bi en="In Stock" sub={mp.inStock} variant="badge" />
                        </span>
                      )}
                    </div>

                    {/* Quick View overlay button */}
                    <button
                      type="button"
                      onClick={() => setDetailProduct(product)}
                      className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all opacity-95 group-hover:opacity-100 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-emerald-700" />
                      <Bi en="View Details" sub={mp.viewDetails} variant="button" />
                    </button>
                  </div>

                  {/* Product Card Content */}
                  <div className="p-5 space-y-3">
                    {/* Brand & Rating row */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider truncate max-w-[60%]">
                        {product.brand || "Certified Agri Input"}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-black text-slate-800">{displayRating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">({displayReviews})</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-1 hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Seller details & Delivery */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <Bi 
                            en="Verified Dealer" 
                            sub={mp.verifiedDealer} 
                            enClassName="text-[11px] font-medium text-slate-600 inline"
                            subClassName="text-[9px] text-emerald-700 block font-normal"
                          />: <strong className="text-slate-800 font-bold">{product.sellerName}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-[10px] shrink-0 ml-2">
                        <Truck className="w-3 h-3" />
                        Available
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price, Stock & Action Buttons */}
                <div className="px-5 pb-5 pt-0 space-y-3 border-t border-slate-100">
                  <div className="flex justify-between items-baseline pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-emerald-700">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          / {product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Inventory</span>
                      <span className={`text-[11px] font-black ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {product.inventory} {product.inventory === 1 ? 'unit' : 'units'} left
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onChatNavigate(product.sellerId, product.sellerName)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <Bi en="Contact Dealer" sub={mp.contactDealer} variant="button" />
                    </button>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => {
                        setOrderingProduct(product);
                        setOrderQuantity(1);
                        setDeliveryAddress(`${user?.village || "Main Village"}, ${user?.district || "Nashik"}, ${user?.state || "Maharashtra"}`);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <Bi en="Buy Now" sub={mp.buyNow} variant="button" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Details Full Specification Modal */}
      {detailProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 animate-in zoom-in duration-150 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 block">
                  {detailProduct.category?.replace("_", " ")}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                  {detailProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img
                src={detailProduct.imageUrl || AGRICULTURE_FALLBACK_IMAGE}
                alt={detailProduct.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = AGRICULTURE_FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                Brand: {detailProduct.brand || "Certified Agro Products"}
              </div>
            </div>

            {/* Pricing and Stock Card */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block">Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-900">
                    {formatCurrency(detailProduct.price)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">/ {detailProduct.unit}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Availability</span>
                  <span className={`text-xs font-black ${detailProduct.inventory > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {detailProduct.inventory > 0 ? `${detailProduct.inventory} units in stock` : mp.outOfStock}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={detailProduct.inventory === 0}
                  onClick={() => {
                    const prodToBuy = detailProduct;
                    setDetailProduct(null);
                    setOrderingProduct(prodToBuy);
                    setOrderQuantity(1);
                    setDeliveryAddress(`${user?.village || "Main Village"}, ${user?.district || "Nashik"}, ${user?.state || "Maharashtra"}`);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {mp.buyNow}
                </button>
              </div>
            </div>

            {/* Description & Technical Specifications */}
            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{mp.productDetails}</h5>
                <p className="text-xs text-slate-700 leading-relaxed">{detailProduct.description}</p>
              </div>

              {detailProduct.specifications && detailProduct.specifications.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Specifications & Features</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {detailProduct.specifications.map((spec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dealer & Warranty info */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Licensed Agri-Dealer: <strong className="text-slate-800">{detailProduct.sellerName}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sid = detailProduct.sellerId;
                    const sname = detailProduct.sellerName;
                    setDetailProduct(null);
                    onChatNavigate(sid, sname);
                  }}
                  className="text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ask Dealer a Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Order Dialog */}
      {orderingProduct && !createdOrderForPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 animate-in zoom-in duration-150 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-black text-slate-800 tracking-tight">Confirm Purchase</h4>
                <p className="text-xs text-slate-400 mt-0.5">Order directly from {orderingProduct.sellerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOrderingProduct(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h5 className="font-bold text-slate-800 text-sm">{mp.orderSuccessTitle}</h5>
                <p className="text-xs text-slate-400">{mp.orderSuccessDesc}</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-slate-200">
                    <img 
                      src={orderingProduct.imageUrl || AGRICULTURE_FALLBACK_IMAGE} 
                      alt={orderingProduct.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = AGRICULTURE_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-xs flex-1 min-w-0 flex flex-col justify-center">
                    <span className="font-bold text-slate-800 truncate block">{orderingProduct.name}</span>
                    <span className="text-[11px] text-emerald-700 mt-0.5 uppercase tracking-wider block font-bold">
                      {formatCurrency(orderingProduct.price)} per {orderingProduct.unit}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">{mp.quantity} ({orderingProduct.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={orderingProduct.inventory}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.min(orderingProduct.inventory, Math.max(1, parseInt(e.target.value) || 1)))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold text-slate-700"
                  />
                  <span className="text-[10px] text-amber-600 block pt-0.5">Max available: {orderingProduct.inventory} units</span>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">{mp.deliveryAddress} *</label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={mp.addressPlaceholder || "Provide full village address, pin, and landmarks..."}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>

                {orderError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-800 text-center font-medium">
                    {orderError}
                  </div>
                )}

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">{mp.totalAmount}</span>
                    <span className="text-lg font-black text-emerald-700">{formatCurrency(orderingProduct.price * orderQuantity)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {mp.placeOrder}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Checkout and Payment Dialog Flow */}
      {createdOrderForPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <CheckoutFlow 
            order={{
              id: createdOrderForPayment.id,
              itemTitle: createdOrderForPayment.itemTitle,
              quantity: createdOrderForPayment.quantity,
              totalPrice: createdOrderForPayment.totalPrice,
              type: createdOrderForPayment.type,
              sellerName: createdOrderForPayment.sellerName,
              deliveryAddress: createdOrderForPayment.deliveryAddress
            }}
            user={user}
            onSuccess={() => {
              setCreatedOrderForPayment(null);
              setOrderingProduct(null);
              setOrderQuantity(1);
              setDeliveryAddress("");
              fetchProducts(); // Refresh stock
            }}
            onCancel={() => {
              setCreatedOrderForPayment(null);
              setOrderingProduct(null);
              setOrderQuantity(1);
              setDeliveryAddress("");
            }}
          />
        </div>
      )}
    </div>
  );
}
