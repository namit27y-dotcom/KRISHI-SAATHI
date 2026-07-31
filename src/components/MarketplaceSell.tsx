import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sprout, PlusCircle, AlertCircle, Trash2, CheckCircle2, MessageSquare, Tag, Package, Clock, Loader2, ArrowRight } from "lucide-react";

interface MarketplaceSellProps {
  user: any;
  onChatNavigate: (partnerId: string, partnerName: string) => void;
}

export default function MarketplaceSell({ user, onChatNavigate }: MarketplaceSellProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Listing creation states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [cropName, setCropName] = useState<string>("Wheat (Sarbati)");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState<string>("kg");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [addError, setAddError] = useState<string | null>(null);

  const fetchMyData = async () => {
    setLoading(true);
    try {
      // Fetch all crop listings
      const resListings = await axios.get("/api/marketplace/crops");
      const myListings = (resListings.data.listings || []).filter((l: any) => l.farmerId === user.id);
      setListings(myListings);

      // Fetch orders
      const resOrders = await axios.get("/api/marketplace/orders", {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      // Crop orders where farmer is seller
      const myCropOrders = (resOrders.data.orders || []).filter((o: any) => o.type === "crop" && o.sellerId === user.id);
      setOrders(myCropOrders);
    } catch (err) {
      console.error("Error fetching my sales data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/marketplace/crops", {
        cropName,
        quantity,
        unit,
        pricePerUnit,
        description,
        imageUrl: imageUrl || undefined
      }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      setShowAddForm(false);
      setQuantity("");
      setPricePerUnit("");
      setDescription("");
      setImageUrl("");
      fetchMyData();
    } catch (err: any) {
      setAddError(err.response?.data?.error || err.message || "Failed to submit listing");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this crop listing?")) return;
    try {
      await axios.delete(`/api/marketplace/crops/${id}`);
      fetchMyData();
    } catch (err) {
      console.error("Error deleting listing", err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`/api/marketplace/orders/${orderId}`, { status }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      fetchMyData();
    } catch (err) {
      console.error("Error updating order status", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-800 border-amber-100";
      case "accepted": return "bg-blue-50 text-blue-800 border-blue-100";
      case "shipped": return "bg-purple-50 text-purple-800 border-purple-100";
      case "delivered": return "bg-emerald-50 text-emerald-800 border-emerald-100";
      case "rejected": return "bg-rose-50 text-rose-800 border-rose-100";
      default: return "bg-slate-50 text-slate-800 border-slate-100";
    }
  };

  return (
    <div className="space-y-6" id="marketplace-sell-component">
      {/* Sales Summary Dashboard Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
            Farmer Crop Sales Panel
          </h3>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            List your harvest online, verify crop quality, attract wholesale commodity traders, accept bulk orders, and receive quick digital or cash payments.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-white text-emerald-800 hover:bg-emerald-50 transition-all font-black text-xs py-3 px-5 rounded-xl shadow-md shrink-0 flex items-center gap-1.5 z-10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-700" />
          List New Harvest
        </button>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings Section (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-600" /> My Listed Harvest Crops
            </h4>

            {loading && listings.length === 0 ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              </div>
            ) : listings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                You have not listed any harvests yet. Click "List New Harvest" above to display your crops to buyers.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((item) => (
                  <div key={item.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-white hover:border-emerald-100 transition-all flex flex-col justify-between">
                    <div className="p-3 space-y-3">
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-200">
                        <img src={item.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="font-extrabold text-slate-800 text-xs truncate">{item.cropName}</h5>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {item.isVerified ? "✓ Verified" : "Pending Verify"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{item.description || "Fresh crop ready for sale"}</p>
                      </div>
                    </div>

                    <div className="px-3 pb-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Price Details</span>
                        <span className="text-xs font-black text-emerald-700">₹{item.pricePerUnit}/kg</span>
                        <span className="text-[10px] text-slate-500 ml-1">({item.quantity} {item.unit})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all cursor-pointer"
                        title="Remove Crop Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wholesale Crop Orders Section (Right Column) */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" /> Wholesaler Buy Requests
            </h4>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                No buy orders from traders yet. Verified crops appear higher in buyer feeds!
              </div>
            ) : (
              <div className="space-y-3.5">
                {orders.map((order) => (
                  <div key={order.id} className="p-3.5 border rounded-2xl bg-slate-50/50 space-y-3 text-xs">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">{order.itemTitle}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Buyer: {order.buyerName}</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100/50 py-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Quantity</span>
                        <span className="font-bold text-slate-700">{order.quantity} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Price</span>
                        <span className="font-bold text-emerald-700">₹{order.totalPrice}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block">Shipping Location</span>
                        <span className="font-medium text-slate-600">{order.deliveryAddress || "APMC Yard"}</span>
                      </div>
                    </div>

                    {/* Order Workflow Actions */}
                    <div className="space-y-1.5">
                      {order.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "rejected")}
                            className="py-1.5 text-center bg-rose-50 text-rose-700 font-bold rounded-lg hover:bg-rose-100 transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "accepted")}
                            className="py-1.5 text-center bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-xs cursor-pointer"
                          >
                            Accept Order
                          </button>
                        </div>
                      )}

                      {order.status === "accepted" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                          className="w-full py-2 text-center bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          Dispatch / Ship Crop 🚚
                        </button>
                      )}

                      {order.status === "shipped" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                          className="w-full py-2 text-center bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          Mark as Delivered ✓
                        </button>
                      )}

                      <button
                        onClick={() => onChatNavigate(order.buyerId, order.buyerName)}
                        className="w-full py-1.5 text-center bg-white border text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Chat with Trader
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Crop Listing Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in duration-150 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-black text-slate-800 tracking-tight">List Your Crop For Sale</h4>
                <p className="text-xs text-slate-400 mt-0.5">Your crop listed here will be visible to traders, retailers, and exporters.</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddListing} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">Select Crop Commodity *</label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
                  >
                    <option value="Wheat (Sarbati Premium)">Wheat (Gehun) 🌾</option>
                    <option value="Organic Red Tomatoes">Tomatoes (Tamatar) 🍅</option>
                    <option value="Basmati Rice Grade-A">Paddy / Rice (Chawal) 🌾</option>
                    <option value="White Cotton Fiber">Cotton (Kapas) ☁️</option>
                    <option value="Raw Cane Sugarcane">Sugarcane (Ganna) 🎋</option>
                    <option value="Organic Potatoes">Potatoes (Aloo) 🥔</option>
                    <option value="Red Onions Fresh">Onions (Pyaz) 🧅</option>
                  </select>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">Harvest Quantity *</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1500"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-2/3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-1/3 p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[10px] font-bold"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="quintal">Quintal (100 kg)</option>
                      <option value="ton">Tonnes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">Target Price per kg (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 26"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold text-slate-700"
                  />
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-600">Sample Photo URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="text-xs space-y-1">
                <label className="font-bold text-slate-600">Crop Condition Description</label>
                <textarea
                  rows={2}
                  placeholder="Mention quality, moisture levels, date of harvesting, pesticides used, organic credentials, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              {addError && (
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl font-medium text-center">
                  {addError}
                </div>
              )}

              <div className="pt-3 border-t flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Publish Crop for Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
