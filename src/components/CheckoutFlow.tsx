import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  AlertTriangle, 
  RefreshCw,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  Mail,
  Bell,
  Send
} from "lucide-react";
import { motion } from "motion/react";

interface CheckoutFlowProps {
  order: {
    id: string;
    itemTitle: string;
    quantity: number;
    totalPrice: number;
    type: "crop" | "product";
    sellerName: string;
    deliveryAddress?: string;
  };
  user: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CheckoutFlow({ order, user, onSuccess, onCancel }: CheckoutFlowProps) {
  // Checkout stages: "summary" | "gateway" | "processing" | "success" | "failed"
  const [stage, setStage] = useState<"summary" | "gateway" | "processing" | "success" | "failed">("summary");
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "phonepe" | "cashfree">("razorpay");
  const [selectedMethod, setSelectedMethod] = useState<"qr" | "id" | "intent">("qr");
  
  // UPI parameters
  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<
    "initiated" | "processing" | "pending_verification" | "successful" | "failed" | "cancelled" | "expired"
  >("initiated");
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const [countdown, setCountdown] = useState(180); // 3 minutes expiration timer
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time Notification Simulation Service State
  const [notifServiceStatus, setNotifServiceStatus] = useState<any>({
    inApp: { status: "pending", timestamp: "" },
    sms: { status: "pending", timestamp: "" },
    email: { status: "pending", timestamp: "" }
  });
  const [activePreview, setActivePreview] = useState<"sms" | "email" | "inApp" | null>(null);
  const [toastNotification, setToastNotification] = useState<{ show: boolean; title: string; message: string; type: string } | null>(null);

  // Price Breakdown Calculations
  const basePrice = order.totalPrice;
  const taxAmount = Math.round(basePrice * 0.05); // 5% GST
  const deliveryCharge = order.type === "crop" ? 450 : 120; // Freight
  const discountAmount = basePrice > 2000 ? Math.round(basePrice * 0.1) : 0; // 10% loyalty discount
  const grandTotal = basePrice + taxAmount + deliveryCharge - discountAmount;

  // Countdown Timer
  useEffect(() => {
    if (stage !== "processing") return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handlePaymentResult("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  // Verification simulation timer
  useEffect(() => {
    if (paymentStatus !== "pending_verification") return;

    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [paymentStatus]);

  // Real-time Notification Dispatch Simulation Hook
  useEffect(() => {
    if (stage !== "success") return;

    // Reset status first
    setNotifServiceStatus({
      inApp: { status: "sending", timestamp: "" },
      sms: { status: "pending", timestamp: "" },
      email: { status: "pending", timestamp: "" }
    });
    setActivePreview(null);
    setToastNotification(null);

    // 1. Deliver In-App Alert (1000ms)
    const t1 = setTimeout(() => {
      setNotifServiceStatus((prev: any) => ({
        ...prev,
        inApp: { status: "delivered", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
      }));
      setToastNotification({
        show: true,
        title: "In-App Notification Triggered! 🔔",
        message: `Your payment of ₹${grandTotal} for Order #${order.id} was successfully verified on Krishi Saathi node.`,
        type: "success"
      });
    }, 1000);

    // 2. Deliver SMS Confirmation (3000ms)
    const t2 = setTimeout(() => {
      setNotifServiceStatus((prev: any) => ({
        ...prev,
        sms: { status: "sending", timestamp: "" }
      }));
      
      const t2_inner = setTimeout(() => {
        setNotifServiceStatus((prev: any) => ({
          ...prev,
          sms: { status: "delivered", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        }));
        setToastNotification({
          show: true,
          title: "SMS Confirmation Delivered! 💬",
          message: `SMS notification dispatched successfully via cellular gateway to +91 ${user?.mobile || "98765 43210"}.`,
          type: "sms"
        });
      }, 1000);

      return () => clearTimeout(t2_inner);
    }, 2500);

    // 3. Deliver Email Confirmation (5000ms)
    const t3 = setTimeout(() => {
      setNotifServiceStatus((prev: any) => ({
        ...prev,
        email: { status: "sending", timestamp: "" }
      }));

      const t3_inner = setTimeout(() => {
        setNotifServiceStatus((prev: any) => ({
          ...prev,
          email: { status: "delivered", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        }));
        setToastNotification({
          show: true,
          title: "Email Receipt Dispatched! ✉️",
          message: `Official tax invoice & bill of lading sent to ${user?.email || "namit27y@gmail.com"}.`,
          type: "email"
        });
      }, 1000);

      return () => clearTimeout(t3_inner);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [stage, user, order, grandTotal]);

  // Toast auto-dismiss hook
  useEffect(() => {
    if (!toastNotification) return;
    const t = setTimeout(() => {
      setToastNotification(null);
    }, 4000);
    return () => clearTimeout(t);
  }, [toastNotification]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Initiate Payment Request on Backend
  const handleInitiatePayment = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const upiDetails = selectedMethod === "id" ? upiId : `${selectedMethod}_simulation@krishipay`;
      const res = await axios.post("/api/payments/initiate", {
        orderId: order.id,
        gateway: selectedGateway,
        upiId: upiDetails
      }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });

      setPaymentData(res.data.payment);
      setPaymentStatus("initiated");
      setCountdown(180); // Reset countdown
      setStage("processing");
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message || "Failed to initiate secure UPI payment");
    } finally {
      setLoading(false);
    }
  };

  // Verify and Finalize Payment Status on Backend
  const handlePaymentResult = async (resultStatus: "successful" | "failed" | "cancelled" | "expired") => {
    if (!paymentData) return;
    
    setPaymentStatus("pending_verification");
    setVerificationProgress(0);

    // Wait briefly for verification progress animation to look incredibly professional
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const res = await axios.post("/api/payments/verify", {
        paymentId: paymentData.id,
        status: resultStatus,
        signature: `sig-${paymentData.id}-${order.id}-verified`
      }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });

      if (res.data.success) {
        setPaymentStatus("successful");
        setStage("success");
      } else {
        setPaymentStatus(resultStatus === "expired" ? "expired" : resultStatus === "cancelled" ? "cancelled" : "failed");
        setStage("failed");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message || "Payment verification failed");
      setPaymentStatus("failed");
      setStage("failed");
    }
  };

  const handleDownloadReceipt = () => {
    if (!order.id) return;
    window.open(`/api/payments/receipt/${order.id}`, "_blank");
  };

  const handleRetry = () => {
    setStage("summary");
    setCountdown(180);
    setPaymentStatus("initiated");
    setErrorMessage(null);
  };

  const paymentApps = [
    { name: "Google Pay", id: "gpay", logo: "🟢", color: "border-blue-200 hover:bg-blue-50/50" },
    { name: "PhonePe", id: "phonepe", logo: "🟣", color: "border-purple-200 hover:bg-purple-50/50" },
    { name: "Paytm", id: "paytm", logo: "🔵", color: "border-sky-200 hover:bg-sky-50/50" },
    { name: "BHIM UPI", id: "bhim", logo: "🇮🇳", color: "border-emerald-200 hover:bg-emerald-50/50" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md border border-slate-100 rounded-3xl shadow-xl overflow-hidden relative" id="checkout-flow-container">
      {/* Real-time Toast Notifications Overlay */}
      {toastNotification && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute top-16 left-4 right-4 z-50 bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-start gap-3.5"
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            toastNotification.type === "success" 
              ? "bg-emerald-500/20 text-emerald-400 font-bold" 
              : toastNotification.type === "sms"
              ? "bg-blue-500/20 text-blue-400 font-bold"
              : "bg-purple-500/20 text-purple-400 font-bold"
          }`}>
            {toastNotification.type === "success" ? (
              <Bell className="w-5 h-5 animate-bounce text-emerald-400" />
            ) : toastNotification.type === "sms" ? (
              <Smartphone className="w-5 h-5 text-sky-400" />
            ) : (
              <Mail className="w-5 h-5 text-purple-400" />
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <span className="text-xs font-black tracking-tight block text-white">{toastNotification.title}</span>
            <p className="text-[11px] text-slate-300 leading-normal mt-0.5">{toastNotification.message}</p>
          </div>
          <button 
            onClick={() => setToastNotification(null)}
            className="text-slate-500 hover:text-white transition-all text-xs shrink-0 p-1"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Absolute brand header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-200" />
          <div>
            <h3 className="font-extrabold text-sm tracking-tight">Secured UPI Gateway</h3>
            <p className="text-[10px] text-emerald-100 font-medium">PCI-DSS Compliant • Bank-grade Encryption</p>
          </div>
        </div>
        <div className="bg-white/15 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10">
          INR ₹{grandTotal}
        </div>
      </div>

      {/* Main Container Content */}
      <div className="p-6">
        
        {/* STEP 1: SUMMARY */}
        {stage === "summary" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Order Brief Info */}
            <div className="bg-slate-50/70 p-4 border border-slate-100 rounded-2xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Order Target Specimen</span>
              <div className="flex justify-between items-center mt-1">
                <span className="font-bold text-slate-800 text-sm">{order.itemTitle}</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-lg">
                  Qty: {order.quantity}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Partner: {order.sellerName} • Delivery to APMC registered depot</p>
            </div>

            {/* Price Breakdowns */}
            <div className="space-y-2.5 px-1">
              <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">Checkout Breakdown</h4>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Base Transaction Price:</span>
                <span className="font-bold text-slate-800">₹{basePrice}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>GST / Taxes (5%):</span>
                <span className="font-bold text-slate-800">₹{taxAmount}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Delivery / Freight Charges:</span>
                <span className="font-bold text-slate-800">₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Promotional Discount:</span>
                <span className="font-bold text-rose-600">-₹{discountAmount}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="font-black text-slate-800 text-sm">Grand Total Amount:</span>
                <span className="font-black text-xl text-emerald-700">₹{grandTotal}</span>
              </div>
            </div>

            {/* Select Gateway */}
            <div className="space-y-2.5 pt-1">
              <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">Select UPI Processing Bank</h4>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setSelectedGateway("razorpay")}
                  className={`p-3.5 border text-center rounded-2xl cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                    selectedGateway === "razorpay" 
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-xs" 
                      : "border-slate-100 hover:bg-slate-50/80 text-slate-500"
                  }`}
                >
                  <span className="text-base font-black tracking-tight text-indigo-700">Razorpay</span>
                  <span className="text-[9px] text-slate-400 font-medium">⚡ Instant Speed</span>
                </button>
                <button 
                  onClick={() => setSelectedGateway("phonepe")}
                  className={`p-3.5 border text-center rounded-2xl cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                    selectedGateway === "phonepe" 
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-xs" 
                      : "border-slate-100 hover:bg-slate-50/80 text-slate-500"
                  }`}
                >
                  <span className="text-base font-black tracking-tight text-purple-700">PhonePe</span>
                  <span className="text-[9px] text-slate-400 font-medium">🔒 Bank Grade</span>
                </button>
                <button 
                  onClick={() => setSelectedGateway("cashfree")}
                  className={`p-3.5 border text-center rounded-2xl cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                    selectedGateway === "cashfree" 
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-xs" 
                      : "border-slate-100 hover:bg-slate-50/80 text-slate-500"
                  }`}
                >
                  <span className="text-base font-black tracking-tight text-blue-700">Cashfree</span>
                  <span className="text-[9px] text-slate-400 font-medium">🛡️ High Success</span>
                </button>
              </div>
            </div>

            {/* Select UPI Payment Option */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">Select Payment Type</h4>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setSelectedMethod("qr")}
                  className={`p-3 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMethod === "qr" 
                      ? "border-emerald-600 bg-emerald-50/30 text-emerald-800 font-bold" 
                      : "border-slate-100 hover:bg-slate-50/50 text-slate-500"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px]">Dynamic QR</span>
                </button>
                <button 
                  onClick={() => setSelectedMethod("id")}
                  className={`p-3 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMethod === "id" 
                      ? "border-emerald-600 bg-emerald-50/30 text-emerald-800 font-bold" 
                      : "border-slate-100 hover:bg-slate-50/50 text-slate-500"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px]">Enter UPI ID</span>
                </button>
                <button 
                  onClick={() => setSelectedMethod("intent")}
                  className={`p-3 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMethod === "intent" 
                      ? "border-emerald-600 bg-emerald-50/30 text-emerald-800 font-bold" 
                      : "border-slate-100 hover:bg-slate-50/50 text-slate-500"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px]">Mobile Intent</span>
                </button>
              </div>

              {selectedMethod === "id" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-1">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">UPI ID (e.g., username@okhdfcbank)</label>
                  <input 
                    type="text" 
                    placeholder="namit27y@okaxis" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
                  />
                  <span className="text-[10px] text-slate-400">Provide a valid UPI virtual payment address.</span>
                </motion.div>
              )}

              {selectedMethod === "intent" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-4 gap-2 pt-1">
                  {paymentApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id)}
                      className={`p-2 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedApp === app.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-black scale-105"
                          : `border-slate-100 hover:bg-slate-50 text-slate-600 ${app.color}`
                      }`}
                    >
                      <span className="text-xl mb-1">{app.logo}</span>
                      <span className="text-[9px] text-center font-bold">{app.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] text-rose-700 font-medium text-center">
                {errorMessage}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button 
                onClick={onCancel}
                className="w-1/3 py-2.5 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer text-center text-xs"
              >
                Go Back
              </button>
              <button 
                onClick={handleInitiatePayment}
                disabled={loading || (selectedMethod === "id" && !upiId)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs shadow-md disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Pay Securely ₹{grandTotal}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ACTIVE PROCESSING / SCREEN */}
        {stage === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center py-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Active Gateway Transaction</span>
                <span className="font-extrabold text-sm text-slate-800">
                  {selectedGateway.toUpperCase()} • {selectedMethod.toUpperCase()} Flow
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full text-amber-800 font-black text-xs">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>{formatTime(countdown)}</span>
              </div>
            </div>

            {/* QR Code view */}
            {selectedMethod === "qr" && paymentStatus !== "pending_verification" && (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm inline-block relative">
                  {/* Styled simulated QR code vector blocks */}
                  <div className="w-44 h-44 bg-slate-900 rounded-lg p-2.5 flex flex-wrap gap-1 items-center justify-center">
                    {/* Visual QR grids */}
                    <div className="w-12 h-12 border-4 border-white shrink-0" />
                    <div className="w-12 h-12 bg-white rounded-xs shrink-0" />
                    <div className="w-12 h-12 border-4 border-white shrink-0" />
                    <div className="w-12 h-12 bg-white shrink-0" />
                    <div className="w-12 h-12 bg-white shrink-0" />
                    <div className="w-12 h-12 border-4 border-white shrink-0" />
                    {/* Micro green scan bar */}
                    <div className="absolute left-0 right-0 h-1.5 bg-emerald-500 shadow-md animate-bounce top-1/2 opacity-80" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-700">Scan QR using GPay, PhonePe, or any UPI App</p>
                  <p className="text-[10px] text-slate-400 mt-1">Merchant Reference: UPI-REF-{paymentData?.transactionId}</p>
                </div>
              </div>
            )}

            {/* UPI ID / Intent Processing */}
            {selectedMethod !== "qr" && paymentStatus !== "pending_verification" && (
              <div className="py-6 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl animate-pulse">
                    📲
                  </div>
                  <Loader2 className="w-24 h-24 text-emerald-600 animate-spin absolute -top-2 -left-2" />
                </div>
                <div className="text-center">
                  <h4 className="font-extrabold text-sm text-slate-700">Awaiting App Confirmation</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Please open your UPI application to approve the payment request for <strong className="text-slate-800">₹{grandTotal}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* PENDING VERIFICATION STATE */}
            {paymentStatus === "pending_verification" && (
              <div className="py-8 space-y-5 text-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-slate-800 uppercase tracking-wider">Verifying Payment Signature</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Retrieving transaction response, confirming dual-layered hash integrity. Do not refresh or exit.
                  </p>
                </div>
                <div className="max-w-xs mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${verificationProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{verificationProgress}% Verified</span>
              </div>
            )}

            {/* DEVELOPER SIMULATION CONTROLS */}
            {paymentStatus !== "pending_verification" && (
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-left space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    Sandbox Simulator Panel
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">To easily test all requested flows in the preview</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Select payment response to test how the order management, inventory reduction, and transaction log audits behave on backend:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    onClick={() => handlePaymentResult("successful")}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer text-center"
                  >
                    Simulate Success ✅
                  </button>
                  <button 
                    onClick={() => handlePaymentResult("failed")}
                    className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] cursor-pointer text-center"
                  >
                    Simulate Fail ❌
                  </button>
                  <button 
                    onClick={() => handlePaymentResult("cancelled")}
                    className="p-1.5 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-[10px] cursor-pointer text-center"
                  >
                    Simulate Cancel
                  </button>
                  <button 
                    onClick={() => handlePaymentResult("expired")}
                    className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] cursor-pointer text-center"
                  >
                    Simulate Expire
                  </button>
                </div>
              </div>
            )}
            
            {/* Disclaimer */}
            <p className="text-[9px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Secure payments. Stored in compliance with RBI Tokenization mandates.
            </p>
          </motion.div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {stage === "success" && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100/80 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700 text-4xl shadow-md">
              ✓
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Order Confirmed Automatically!
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight pt-1">Payment Successfully Verified! 🎉</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Invoice generated securely. The seller has been notified for dispatch and the inventory was automatically adjusted.
              </p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl text-left space-y-2.5 text-xs max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-extrabold text-slate-800">#{order.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-slate-600">{paymentData?.transactionId || "txn-938201a39"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="font-bold text-slate-800 uppercase">{selectedGateway}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Method:</span>
                <span className="font-bold text-emerald-700">UPI Payments</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Total Settled:</span>
                <span className="font-black text-slate-800 text-sm">₹{grandTotal}</span>
              </div>
            </div>

            {/* Simulated Notification Service Hub */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Real-Time Notification Gateways
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                  Simulated Active
                </span>
              </div>

              <div className="space-y-2.5">
                {/* 1. In-App Notification */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      notifServiceStatus.inApp.status === "delivered" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">In-App Workspace Alert</span>
                      <span className="text-[9px] text-slate-400">
                        {notifServiceStatus.inApp.status === "delivered" ? `Delivered at ${notifServiceStatus.inApp.timestamp}` : "Sending workspace push alert..."}
                      </span>
                    </div>
                  </div>
                  <div>
                    {notifServiceStatus.inApp.status === "delivered" ? (
                      <button 
                        onClick={() => setActivePreview(activePreview === "inApp" ? null : "inApp")}
                        className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        {activePreview === "inApp" ? "Hide Alert" : "View Alert"}
                      </button>
                    ) : (
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    )}
                  </div>
                </div>

                {/* 2. SMS Notification */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      notifServiceStatus.sms.status === "delivered" 
                        ? "bg-blue-50 text-blue-600" 
                        : notifServiceStatus.sms.status === "sending"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">SMS Gateway Confirmation</span>
                      <span className="text-[9px] text-slate-400">
                        {notifServiceStatus.sms.status === "delivered" 
                          ? `Sent to +91 ${user?.mobile || "98765 43210"} at ${notifServiceStatus.sms.timestamp}` 
                          : notifServiceStatus.sms.status === "sending"
                          ? "Connecting to GSM gateway..."
                          : "Queued behind Payment Node..."}
                      </span>
                    </div>
                  </div>
                  <div>
                    {notifServiceStatus.sms.status === "delivered" ? (
                      <button 
                        onClick={() => setActivePreview(activePreview === "sms" ? null : "sms")}
                        className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded hover:bg-blue-100 transition-all cursor-pointer"
                      >
                        {activePreview === "sms" ? "Hide SMS" : "View SMS"}
                      </button>
                    ) : notifServiceStatus.sms.status === "sending" ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">Pending</span>
                    )}
                  </div>
                </div>

                {/* 3. Email Notification */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      notifServiceStatus.email.status === "delivered" 
                        ? "bg-purple-50 text-purple-600" 
                        : notifServiceStatus.email.status === "sending"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">SMTP Email Invoice</span>
                      <span className="text-[9px] text-slate-400">
                        {notifServiceStatus.email.status === "delivered" 
                          ? `Dispatched to ${user?.email || "namit27y@gmail.com"} at ${notifServiceStatus.email.timestamp}` 
                          : notifServiceStatus.email.status === "sending"
                          ? "Assembling invoice PDF & SMTP handshakes..."
                          : "Queued behind SMS Node..."}
                      </span>
                    </div>
                  </div>
                  <div>
                    {notifServiceStatus.email.status === "delivered" ? (
                      <button 
                        onClick={() => setActivePreview(activePreview === "email" ? null : "email")}
                        className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded hover:bg-purple-100 transition-all cursor-pointer"
                      >
                        {activePreview === "email" ? "Hide Email" : "View Email"}
                      </button>
                    ) : notifServiceStatus.email.status === "sending" ? (
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible Active Preview Panel */}
              {activePreview && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-white border border-slate-100 rounded-xl p-3 mt-3 text-xs"
                >
                  {activePreview === "inApp" && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center border-b pb-1">
                        <span className="font-bold text-slate-700">In-App Workspace Notification</span>
                        <span className="text-[9px] text-slate-400">🔔 Push Banner</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 leading-normal">
                        <span className="font-black text-slate-800 block text-[11px]">Payment Successful! 🎉</span>
                        Your payment of ₹{grandTotal} was verified. Invoice #{paymentData?.transactionId || "txn-938201a39"} has been generated successfully. Your order is confirmed.
                      </div>
                    </div>
                  )}

                  {activePreview === "sms" && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center border-b pb-1">
                        <span className="font-bold text-slate-700">Simulated Cellular SMS Preview</span>
                        <span className="text-[9px] font-mono text-slate-400">Sender: KR-KRISHISAATHI</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 text-slate-100 font-mono rounded-lg relative overflow-hidden text-left">
                        <div className="absolute right-2 top-2 text-[10px] opacity-20">💬</div>
                        <p className="text-[10px] leading-relaxed">
                          ALERT: Dear {user?.name || "Trader"}, payment of INR {grandTotal} is verified for Order #{order.id} ({order.quantity}x {order.itemTitle}). Seller {order.sellerName} is preparing cargo. Thank you for using Krishi Saathi Secure Trade platform.
                        </p>
                      </div>
                    </div>
                  )}

                  {activePreview === "email" && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center border-b pb-1">
                        <span className="font-bold text-slate-700">SMTP Email Client HTML Preview</span>
                        <span className="text-[9px] text-slate-400">Subject: Tax Invoice & Order Confirmation</span>
                      </div>
                      <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50 text-left">
                        <div className="bg-slate-800 text-white p-2 text-[10px] flex justify-between">
                          <span>From: support@krishisaathi.in</span>
                          <span>To: {user?.email || "namit27y@gmail.com"}</span>
                        </div>
                        <div className="p-3 text-[10px] text-slate-600 space-y-2 bg-white">
                          <h4 className="font-bold text-slate-800 border-b pb-1 text-xs">Krishi Saathi Agri Trade</h4>
                          <p>Hi {user?.name || "Customer"},</p>
                          <p>Thank you for your business. We have successfully received your payment of <strong>₹{grandTotal}</strong> via digital UPI secure network.</p>
                          <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[9px] space-y-1 font-mono">
                            <div><strong>Order Specimen:</strong> {order.itemTitle}</div>
                            <div><strong>Quantity Order:</strong> {order.quantity}</div>
                            <div><strong>Receipt Reference:</strong> {paymentData?.transactionId || "txn-938201a39"}</div>
                            <div><strong>Dispatch Center:</strong> APMC Depot Terminal</div>
                          </div>
                          <p className="text-[9px] text-slate-400 italic">This is an automated delivery confirmation. You can download the physical signature-stamped tax invoice PDF from your portal anytime.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Receipt Download Action */}
            <div className="flex gap-3 max-w-md mx-auto pt-2">
              <button 
                onClick={handleDownloadReceipt}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs shadow-md"
              >
                <Download className="w-4 h-4" />
                Download Tax Invoice
              </button>
              <button 
                onClick={onSuccess}
                className="w-1/3 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-2xl transition-all cursor-pointer text-xs"
              >
                Close Portal
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: FAILURE STATE */}
        {stage === "failed" && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-700 text-4xl shadow-sm">
              ⚠
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {paymentStatus === "cancelled" ? "Cancelled by User" : paymentStatus === "expired" ? "Session Expired" : "Transaction Failed"}
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight pt-1">
                {paymentStatus === "cancelled" ? "Payment Was Cancelled" : paymentStatus === "expired" ? "Payment Session Expired" : "Payment Verification Failed"}
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {paymentStatus === "cancelled" 
                  ? "The UPI application request was cancelled by the user. Feel free to retry the same invoice." 
                  : paymentStatus === "expired" 
                    ? "The 3-minute payment gateway token has expired. A fresh session is required." 
                    : "The UPI transaction was declined or timed out at bank node. No funds have been deducted."}
              </p>
            </div>

            {/* Suggestion alert */}
            <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-2xl text-left text-[11px] text-amber-800 font-medium max-w-sm mx-auto flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                <strong>Safe to retry:</strong> This order remains in <span className="underline">Pending Payment</span>. Retrying will not result in duplicate billing or double-placed inventory.
              </div>
            </div>

            <div className="flex gap-3 max-w-md mx-auto pt-2 justify-center">
              <button 
                onClick={handleRetry}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Retry UPI Payment
              </button>
              <button 
                onClick={onCancel}
                className="w-1/3 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-2xl transition-all cursor-pointer text-xs"
              >
                Cancel Order
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
