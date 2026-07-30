import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FileText, 
  CreditCard, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Download, 
  Calendar, 
  Tag, 
  TrendingUp, 
  ShoppingBag, 
  Eye, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Database,
  Truck,
  ArrowRight,
  PackageCheck,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CheckoutFlow from "./CheckoutFlow";

interface OrderHistoryProps {
  user: any;
  onChatNavigate?: (partnerId: string, partnerName: string) => void;
}

export default function OrderHistory({ user, onChatNavigate }: OrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid" | "failed">("all");
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any | null>(null);
  
  // Expanded card tracking for logs & payment auditing details
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user's orders
      const ordersRes = await axios.get("/api/marketplace/orders", {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      setOrders(ordersRes.data.orders || []);

      // Fetch user's payment records / gateway logs
      try {
        const paymentsRes = await axios.get("/api/payments/history", {
          headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
        });
        setPayments(paymentsRes.data.payments || []);
      } catch (e) {
        console.warn("Could not fetch payment history logs:", e);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to load order transaction logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Helper to get status color badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "accepted":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100 animate-pulse";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-150";
    }
  };

  // Helper to get payment status color badge
  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold";
      case "pending_payment":
      case "unpaid":
        return "bg-amber-100 text-amber-800 border-amber-200 font-semibold";
      case "failed":
        return "bg-rose-100 text-rose-800 border-rose-200 font-semibold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.buyerName && order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "paid" && order.paymentStatus === "paid") ||
      (statusFilter === "unpaid" && (order.paymentStatus === "unpaid" || order.paymentStatus === "pending_payment")) ||
      (statusFilter === "failed" && order.paymentStatus === "failed");

    return matchesSearch && matchesStatus;
  });

  const getOrderPaymentRecord = (orderId: string) => {
    return payments.find((p) => p.orderId === orderId);
  };

  return (
    <div className="space-y-6" id="order-history-component">
      
      {/* Search and stats bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Order & Transaction History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely track your agri-trades, download verified tax invoices, audit gateway handshakes, or retry payments.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={fetchData}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Crop Title, Seller or Buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs outline-none focus:border-emerald-500 font-semibold text-slate-700 transition-all"
            />
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
            {(["all", "paid", "unpaid", "failed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === filter 
                    ? "bg-white text-slate-800 shadow-xs" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {filter === "unpaid" ? "Pending" : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main lists */}
      {loading ? (
        <div className="bg-white rounded-3xl border p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          Synchronizing secure banking ledgers & agricultural invoices...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border p-12 text-center text-slate-400 text-xs">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          No transactions found matching the specified parameters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const paymentLog = getOrderPaymentRecord(order.id);
            const isExpanded = !!expandedOrders[order.id];
            
            // Recompute values if missing
            const tax = order.taxAmount !== undefined ? order.taxAmount : Math.round(order.totalPrice * 0.05);
            const delivery = order.deliveryCharge !== undefined ? order.deliveryCharge : (order.type === "crop" ? 450 : 120);
            const discount = order.discountAmount !== undefined ? order.discountAmount : (order.totalPrice > 2000 ? Math.round(order.totalPrice * 0.1) : 0);
            const grandTotal = order.grandTotal !== undefined ? order.grandTotal : (order.totalPrice + tax + delivery - discount);

            return (
              <motion.div 
                key={order.id} 
                layout
                className="bg-white border border-gray-100 rounded-3xl shadow-xs overflow-hidden transition-all hover:border-slate-200"
              >
                {/* Main Card Header */}
                <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-lg border border-slate-200/50">
                        #{order.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${getStatusBadge(order.status)}`}>
                        Order: {order.status}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${getPaymentBadge(order.paymentStatus)}`}>
                        Payment: {order.paymentStatus}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-800 tracking-tight pt-1 flex items-center gap-1.5">
                      {order.type === "crop" ? "🌾" : "📦"} {order.itemTitle}
                      <span className="text-xs text-slate-400 font-medium">({order.quantity} {order.type === "crop" ? "kg" : "units"})</span>
                    </h4>

                    <div className="text-xs text-slate-500">
                      {user.id === order.buyerId ? (
                        <span>Bought from: <strong className="text-slate-700 font-bold">{order.sellerName}</strong></span>
                      ) : (
                        <span>Sold to: <strong className="text-slate-700 font-bold">{order.buyerName || "Mandi Buyer"}</strong></span>
                      )}
                      {order.deliveryAddress && (
                        <span className="block mt-0.5 text-slate-400 font-medium text-[11px] truncate max-w-lg">📍 Delivery: {order.deliveryAddress}</span>
                      )}
                    </div>
                  </div>

                  {/* Payment Info & Primary actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0 w-full sm:w-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Transaction Value</span>
                      <span className="text-xl font-black text-slate-800">₹{grandTotal}</span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => toggleExpand(order.id)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 rounded-xl transition-all cursor-pointer"
                        title="Audit transaction ledgers"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {order.paymentStatus === "paid" && (
                        <button 
                          onClick={() => window.open(`/api/payments/receipt/${order.id}`, "_blank")}
                          className="flex-1 sm:flex-none py-2 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Tax Invoice
                        </button>
                      )}

                      {(order.paymentStatus === "unpaid" || order.paymentStatus === "failed" || order.paymentStatus === "pending_payment") && order.status !== "rejected" && user.id === order.buyerId && (
                        <button 
                          onClick={() => setSelectedOrderForPayment(order)}
                          className="flex-1 sm:flex-none py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-200"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Retry UPI Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Auditing panel / Price Breakdown expandable */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-600">
                        {/* Price Breakdown */}
                        <div className="space-y-2">
                          <h5 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5 text-slate-400" />
                            Secure Bill Summary
                          </h5>
                          <div className="space-y-1.5 bg-white p-3 border border-slate-100 rounded-xl">
                            <div className="flex justify-between text-slate-500">
                              <span>Subtotal Price:</span>
                              <span className="font-bold text-slate-800">₹{order.totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>GST Tax (5%):</span>
                              <span className="font-bold text-slate-800">₹{tax}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>Logistics / Heavy Freight:</span>
                              <span className="font-bold text-slate-800">₹{delivery}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>Loyalty Reward Discount:</span>
                              <span className="font-bold text-rose-600">-₹{discount}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-1.5 flex justify-between font-extrabold text-slate-800">
                              <span>Grand Total settled:</span>
                              <span className="text-emerald-700">₹{grandTotal}</span>
                            </div>
                          </div>
                        </div>

                        {/* Audit Details */}
                        <div className="space-y-2">
                          <h5 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                            <Database className="w-3.5 h-3.5 text-slate-400" />
                            PCI-DSS Gateway Audit Logs
                          </h5>
                          <div className="bg-white p-3 border border-slate-100 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-500">
                            <div>
                              <strong className="text-slate-400">Merchant UPI Account:</strong>
                              <span className="block font-bold text-slate-700">krishisaathi@yesbank</span>
                            </div>
                            <div>
                              <strong className="text-slate-400">Active Handshake Engine:</strong>
                              <span className="block font-bold text-slate-700 capitalize">{paymentLog?.gateway || order.paymentMethod || "Razorpay Sim"}</span>
                            </div>
                            <div>
                              <strong className="text-slate-400">Signature Hash:</strong>
                              <span className="block font-bold text-slate-600 text-[9px] break-all">
                                {paymentLog?.signature || `sig-pay-${order.id}-verified-sha256`}
                              </span>
                            </div>
                            <div>
                              <strong className="text-slate-400">Transaction ID:</strong>
                              <span className="block font-bold text-slate-700">{paymentLog?.transactionId || order.paymentId || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Visual Progress bar */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Real-Time Trade & Fulfillment Pipeline
                          </span>
                          <span className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-500">
                            Status: <strong className="text-slate-700 capitalize font-bold">{order.status}</strong>
                          </span>
                        </div>

                        {order.status === "rejected" ? (
                          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-800 text-xs font-medium">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            <div>
                              <strong className="block font-bold">Consignment Rejected / Canceled</strong>
                              This trade was canceled or could not be verified by the seller. Any initial funds paid are queued for reversal.
                            </div>
                          </div>
                        ) : (
                          <div className="relative pt-2 pb-1">
                            {/* Connector line background */}
                            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-1 bg-slate-100 -z-0" />
                            
                            {/* Animated active green line */}
                            <div 
                              className="absolute top-8 left-[12.5%] h-1 bg-emerald-500 -z-0 transition-all duration-700"
                              style={{
                                width: order.status === "delivered" 
                                  ? "75%" 
                                  : order.status === "shipped" 
                                  ? "50%" 
                                  : order.status === "accepted" 
                                  ? "25%" 
                                  : "0%"
                              }}
                            />

                            <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                              
                              {/* Step 1: Confirmed */}
                              <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 rounded-full border-2 bg-emerald-50 text-emerald-600 border-emerald-500 flex items-center justify-center transition-all shadow-xs">
                                  <PackageCheck className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-800 block">Confirmed</span>
                                  <span className="text-[9px] font-medium text-slate-400 block">Order Placed</span>
                                </div>
                              </div>

                              {/* Step 2: Processing */}
                              {(() => {
                                const isActive = order.status === "accepted" || order.status === "shipped" || order.status === "delivered";
                                const isCurrent = order.status === "accepted";
                                return (
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isActive 
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-500 shadow-xs" 
                                        : "bg-slate-50 text-slate-300 border-slate-200"
                                    }`}>
                                      {isCurrent ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                                      ) : isActive ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                      ) : (
                                        <RefreshCw className="w-4 h-4 text-slate-300" />
                                      )}
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className={`text-xs font-bold block ${isActive ? "text-slate-800" : "text-slate-400"}`}>Processing</span>
                                      <span className="text-[9px] font-medium text-slate-400 block">
                                        {isCurrent ? "Preparing Cargo" : isActive ? "Cargo Prepared" : "Awaiting Seller"}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Step 3: Shipped */}
                              {(() => {
                                const isActive = order.status === "shipped" || order.status === "delivered";
                                const isCurrent = order.status === "shipped";
                                return (
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isActive 
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-500 shadow-xs" 
                                        : "bg-slate-50 text-slate-300 border-slate-200"
                                    }`}>
                                      {isCurrent ? (
                                        <Truck className="w-5 h-5 text-emerald-600 animate-bounce" />
                                      ) : isActive ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                      ) : (
                                        <Truck className="w-5 h-5 text-slate-300" />
                                      )}
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className={`text-xs font-bold block ${isActive ? "text-slate-800" : "text-slate-400"}`}>Shipped</span>
                                      <span className="text-[9px] font-medium text-slate-400 block">
                                        {isCurrent ? "In Transit" : isActive ? "Dispatched" : "Awaiting Pickup"}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Step 4: Delivered */}
                              {(() => {
                                const isActive = order.status === "delivered";
                                return (
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isActive 
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-500 shadow-sm shadow-emerald-100" 
                                        : "bg-slate-50 text-slate-300 border-slate-200"
                                    }`}>
                                      <ShieldCheck className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-300"}`} />
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className={`text-xs font-bold block ${isActive ? "text-slate-800" : "text-slate-400"}`}>Delivered</span>
                                      <span className="text-[9px] font-medium text-slate-400 block">
                                        {isActive ? "Delivered & Signed" : "Pending Arrival"}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}

                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Payment retry Portal popup */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <CheckoutFlow 
            order={{
              id: selectedOrderForPayment.id,
              itemTitle: selectedOrderForPayment.itemTitle,
              quantity: selectedOrderForPayment.quantity,
              totalPrice: selectedOrderForPayment.totalPrice,
              type: selectedOrderForPayment.type,
              sellerName: selectedOrderForPayment.sellerName,
              deliveryAddress: selectedOrderForPayment.deliveryAddress
            }}
            user={user}
            onSuccess={() => {
              setSelectedOrderForPayment(null);
              fetchData();
            }}
            onCancel={() => {
              setSelectedOrderForPayment(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
