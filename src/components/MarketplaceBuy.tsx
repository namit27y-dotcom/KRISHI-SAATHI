import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingBag, Search, Tag, MessageSquare, AlertCircle, ShoppingCart, Check, Loader2 } from "lucide-react";
import CheckoutFlow from "./CheckoutFlow";

interface MarketplaceBuyProps {
  user: any;
  onChatNavigate: (partnerId: string, partnerName: string) => void;
}

export default function MarketplaceBuy({ user, onChatNavigate }: MarketplaceBuyProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderingProduct, setOrderingProduct] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrderForPayment, setCreatedOrderForPayment] = useState<any | null>(null);

  const categories = [
    { value: "", label: "All Items" },
    { value: "seeds", label: "Seeds 🌱" },
    { value: "fertilizers", label: "Fertilizers 🧪" },
    { value: "pesticides", label: "Pesticides 🦠" },
    { value: "tractors", label: "Tractors 🚜" },
    { value: "pumps", label: "Water Pumps 💧" },
    { value: "sprayers", label: "Sprayers 💨" },
    { value: "irrigation_equipment", label: "Irrigation 💧" },
    { value: "farm_tools", label: "Farm Tools 🛠️" }
  ];

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
        deliveryAddress: deliveryAddress || `${user.village}, ${user.district}, ${user.state}`
      }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
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

  return (
    <div className="space-y-6" id="marketplace-buy-component">
      {/* Search Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Agriculture Marketplace
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Buy premium fertilizers, hybrid seeds, crop sprayers, and farm tools directly from verified suppliers.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  category === cat.value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <span className="text-xs text-slate-400 block mt-2">Loading agro products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border p-12 text-center text-slate-400 text-xs">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          No verified products are listed in this category right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
              <div className="aspect-video w-full relative bg-slate-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/65 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  {product.category.replace("_", " ")}
                </span>
                {product.inventory === 0 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-xl">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-sm leading-tight line-clamp-1">{product.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Price</span>
                      <span className="text-base font-black text-emerald-700">
                        ₹{product.price} <span className="text-xs font-semibold text-slate-400">/ {product.unit}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Stock</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg ${product.inventory > 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                        {product.inventory} {product.inventory === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 italic">
                    Seller: <span className="font-bold text-slate-600">{product.sellerName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <button
                      onClick={() => onChatNavigate(product.sellerId, product.sellerName)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-slate-100 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </button>
                    <button
                      disabled={product.inventory === 0}
                      onClick={() => {
                        setOrderingProduct(product);
                        setDeliveryAddress(`${user.village}, ${user.district}, ${user.state}`);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Order Dialog */}
      {orderingProduct && !createdOrderForPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 animate-in zoom-in duration-150">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-black text-slate-800 tracking-tight">Confirm Purchase</h4>
                <p className="text-xs text-slate-400 mt-0.5">Place an order with {orderingProduct.sellerName}</p>
              </div>
              <button
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
                <h5 className="font-bold text-slate-800 text-sm">Order Placed Successfully!</h5>
                <p className="text-xs text-slate-400">Total charge: ₹{orderingProduct.price * orderQuantity}. Supplier has been notified.</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-slate-200">
                    <img src={orderingProduct.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs flex-1 min-w-0 flex flex-col justify-center">
                    <span className="font-bold text-slate-800 truncate block">{orderingProduct.name}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider block font-bold text-emerald-700">₹{orderingProduct.price} per {orderingProduct.unit}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">Select Order Quantity ({orderingProduct.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={orderingProduct.inventory}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.min(orderingProduct.inventory, Math.max(1, parseInt(e.target.value) || 1)))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold text-slate-700"
                  />
                  <span className="text-[10px] text-amber-600 block pt-0.5">Max available: {orderingProduct.inventory} bags/units</span>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">Delivery Shipping Address *</label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Provide full village address, pin, and landmarks..."
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
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Price</span>
                    <span className="text-lg font-black text-emerald-700">₹{orderingProduct.price * orderQuantity}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Confirm & Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
