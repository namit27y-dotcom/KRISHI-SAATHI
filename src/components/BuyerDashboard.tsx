import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ShoppingBasket, MessageSquare, MapPin, Truck, AlertCircle, ShoppingCart, Check, Loader2, FileText } from "lucide-react";
import CheckoutFlow from "./CheckoutFlow";

interface BuyerDashboardProps {
  user: any;
  onChatNavigate: (partnerId: string, partnerName: string) => void;
}

export default function BuyerDashboard({ user, onChatNavigate }: BuyerDashboardProps) {
  const [crops, setCrops] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Filters
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [cropName, setCropName] = useState<string>("");

  // Purchase Form
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrderForPayment, setCreatedOrderForPayment] = useState<any | null>(null);

  const fetchBuyerData = async () => {
    setLoading(true);
    try {
      // Fetch verified crop listings
      let cropUrl = `/api/marketplace/crops?onlyVerified=true`;
      if (country) cropUrl += `&country=${country}`;
      if (state) cropUrl += `&state=${state}`;
      if (district) cropUrl += `&district=${district}`;
      if (cropName) cropUrl += `&cropName=${cropName}`;

      const resCrops = await axios.get(cropUrl);
      setCrops(resCrops.data.listings || []);

      // Fetch my purchase orders
      const resOrders = await axios.get("/api/marketplace/orders", {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      const myCropPurchases = (resOrders.data.orders || []).filter((o: any) => o.type === "crop" && o.buyerId === user.id);
      setOrders(myCropPurchases);
    } catch (err) {
      console.error("Error fetching buyer feeds", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerData();
  }, [country, state, district, cropName]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop) return;

    setOrderError(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/marketplace/orders", {
        type: "crop",
        listingOrProductId: selectedCrop.id,
        quantity: orderQuantity,
        deliveryAddress: deliveryAddress || "APMC Yard Main Gate, Warehouse #12"
      }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      setOrderSuccess(true);
      
      // Transition immediately to payment portal
      if (res.data.order) {
        setCreatedOrderForPayment(res.data.order);
      } else {
        setTimeout(() => {
          setSelectedCrop(null);
          setOrderSuccess(false);
          setOrderQuantity(100);
          setDeliveryAddress("");
          fetchBuyerData(); // Refresh list and orders
        }, 2000);
      }

    } catch (err: any) {
      setOrderError(err.response?.data?.error || err.message || "Failed to place crop buy order");
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = (orderId: string) => {
    const matchingOrder = orders.find(o => o.id === orderId);
    if (matchingOrder) {
      setCreatedOrderForPayment(matchingOrder);
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
    <div className="space-y-6" id="buyer-dashboard-component">
      {/* Search Filter Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBasket className="w-5 h-5 text-emerald-600" />
            Wholesale Crop Commodity Procurement
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Exporters & Wholesalers can locate genuine harvests direct from farms. Filter by country, state, district, or crop commodity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="text-xs space-y-1">
            <label className="font-bold text-slate-500 block">Country</label>
            <input
              type="text"
              placeholder="e.g. India"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
            />
          </div>
          <div className="text-xs space-y-1">
            <label className="font-bold text-slate-500 block">State</label>
            <input
              type="text"
              placeholder="e.g. Maharashtra"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
            />
          </div>
          <div className="text-xs space-y-1">
            <label className="font-bold text-slate-500 block">District</label>
            <input
              type="text"
              placeholder="e.g. Pune"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
            />
          </div>
          <div className="text-xs space-y-1">
            <label className="font-bold text-slate-500 block">Crop Commodity</label>
            <input
              type="text"
              placeholder="e.g. Wheat, Tomato"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full p-2 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Feed (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-5">
          {loading && crops.length === 0 ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              <span className="text-xs text-slate-400 block mt-2">Locating agricultural listings...</span>
            </div>
          ) : crops.length === 0 ? (
            <div className="bg-white border rounded-3xl p-12 text-center text-slate-400 text-xs">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No verified farmer listings found matching your location filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {crops.map((crop) => (
                <div key={crop.id} className="bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="aspect-video w-full relative bg-slate-100">
                      <img src={crop.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        ✓ Quality Verified
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{crop.cropName}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-300" />
                          <span>{crop.village}, {crop.district}, {crop.state}, {crop.country}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{crop.description || "Freshly harvested premium grade crop."}</p>
                      
                      <div className="text-[10px] text-slate-400">
                        Farmer Seller: <span className="font-bold text-slate-600">{crop.farmerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-50 bg-slate-50/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Unit Cost</span>
                        <span className="text-base font-black text-emerald-700">₹{crop.pricePerUnit} <span className="text-xs font-semibold text-slate-400">/ kg</span></span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Harvest Size</span>
                        <span className="font-extrabold text-slate-700 text-xs">{crop.quantity} {crop.unit || 'kg'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onChatNavigate(crop.farmerId, crop.farmerName)}
                        className="flex items-center justify-center gap-1 py-2 px-3 bg-white border text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Message
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCrop(crop);
                          setOrderQuantity(Math.min(5000, crop.quantity));
                          setDeliveryAddress("Mandi APMC gate, Sector-3 Warehouse");
                        }}
                        className="flex items-center justify-center gap-1 py-2 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-xs cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Place Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Procurement Order Log (Right column) */}
        <div className="space-y-5">
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" /> My Purchases & Invoices
            </h4>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                No crops purchased yet. Find premium harvests and click "Place Order".
              </div>
            ) : (
              <div className="space-y-3.5">
                {orders.map((order) => (
                  <div key={order.id} className="p-3.5 border rounded-2xl bg-slate-50/50 space-y-2.5 text-xs">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="font-bold text-slate-800 leading-tight block">{order.itemTitle}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Farmer: {order.sellerName}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 border rounded-xl space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Procured quantity:</span>
                        <span className="font-bold text-slate-700">{order.quantity} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Invoice Total:</span>
                        <span className="font-black text-emerald-700">₹{order.totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Invoice Payment:</span>
                        <span className={`font-bold uppercase text-[9px] px-1 rounded ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1.5">
                      {order.paymentStatus !== "paid" && order.status !== "rejected" && (
                        <button
                          onClick={() => handlePayOrder(order.id)}
                          className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all cursor-pointer text-center"
                        >
                          💸 Secure UPI Checkout
                        </button>
                      )}

                      {order.paymentStatus === "paid" && (
                        <button
                          onClick={() => window.open(`/api/payments/receipt/${order.id}`, "_blank")}
                          className="w-full py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg hover:bg-emerald-100/80 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 text-[11px]"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600" /> Download Tax Invoice (PDF)
                        </button>
                      )}

                      <button
                        onClick={() => onChatNavigate(order.sellerId, order.sellerName)}
                        className="w-full py-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Negotitate / Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Place Order Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in zoom-in duration-150">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-black text-slate-800 tracking-tight">Bulk Purchase Request</h4>
                <p className="text-xs text-slate-400 mt-0.5">Procuring direct from farmer {selectedCrop.farmerName}</p>
              </div>
              <button onClick={() => setSelectedCrop(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            {orderSuccess ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h5 className="font-bold text-slate-800 text-sm">Request Sent!</h5>
                <p className="text-xs text-slate-400">Total offer: ₹{selectedCrop.pricePerUnit * orderQuantity}. Farmer notified.</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-slate-200">
                    <img src={selectedCrop.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs flex-1 min-w-0 flex flex-col justify-center">
                    <span className="font-bold text-slate-800 truncate block">{selectedCrop.cropName}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 uppercase block font-extrabold text-emerald-700">₹{selectedCrop.pricePerUnit} per kg</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Location: {selectedCrop.district}, {selectedCrop.state}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Select Procurement Size (kg)</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedCrop.quantity}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.min(selectedCrop.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold text-slate-700"
                  />
                  <span className="text-[10px] text-amber-600 block">Total crop pool size: {selectedCrop.quantity} kg</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">APMC Mandi / Receiving Delivery Address *</label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Provide warehouse address or Mandi storage yard details..."
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>

                {orderError && (
                  <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-center font-medium">
                    {orderError}
                  </div>
                )}

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Estimated Total</span>
                    <span className="text-lg font-black text-emerald-700">₹{selectedCrop.pricePerUnit * orderQuantity}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Send Procurement Request
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
              setSelectedCrop(null);
              setOrderQuantity(100);
              setDeliveryAddress("");
              fetchBuyerData(); // Refresh list and orders
            }}
            onCancel={() => {
              setCreatedOrderForPayment(null);
              setSelectedCrop(null);
              setOrderQuantity(100);
              setDeliveryAddress("");
            }}
          />
        </div>
      )}
    </div>
  );
}
