import React, { useState, useEffect } from "react";
import axios from "axios";
import { Store, Plus, Package, ClipboardList, TrendingUp, AlertTriangle, MessageSquare, Trash, RefreshCw, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { UNSPLASH_PRODUCT_IMAGES, getProductImageUrl } from "../data/unsplashImages";

interface SellerDashboardProps {
  user: any;
  onChatNavigate: (partnerId: string, partnerName: string) => void;
}

export default function SellerDashboard({ user, onChatNavigate }: SellerDashboardProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Stats
  const [revenue, setRevenue] = useState<number>(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);

  // Product Add states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("fertilizers");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [unit, setUnit] = useState<string>("bag");
  const [inventory, setInventory] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [addError, setAddError] = useState<string | null>(null);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      // Products
      const resProds = await axios.get("/api/marketplace/products");
      const myProds = (resProds.data.products || []).filter((p: any) => p.sellerId === user.id);
      setProducts(myProds);

      // Orders
      const resOrders = await axios.get("/api/marketplace/orders", {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      const myOrders = (resOrders.data.orders || []).filter((o: any) => o.type === "product" && o.sellerId === user.id);
      setOrders(myOrders);

      // Calc Stats
      const totalRev = myOrders
        .filter((o: any) => o.status === "delivered" || o.paymentStatus === "paid")
        .reduce((sum: number, o: any) => sum + o.totalPrice, 0);
      setRevenue(totalRev);

      const pendingCount = myOrders.filter((o: any) => o.status === "pending").length;
      setPendingOrdersCount(pendingCount);

    } catch (err) {
      console.error("Error fetching seller details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/marketplace/products", {
        name,
        category,
        description,
        price,
        unit,
        inventory,
        imageUrl: imageUrl || undefined
      }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      setShowAddForm(false);
      setName("");
      setDescription("");
      setPrice("");
      setInventory("");
      setImageUrl("");
      fetchSellerData();
    } catch (err: any) {
      setAddError(err.response?.data?.error || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this product from inventory?")) return;
    try {
      await axios.delete(`/api/marketplace/products/${id}`);
      fetchSellerData();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const payload: any = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      await axios.put(`/api/marketplace/orders/${orderId}`, payload, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      fetchSellerData();
    } catch (err) {
      console.error("Error updating order status", err);
    }
  };

  return (
    <div className="space-y-6" id="seller-dashboard-component">
      {/* Upper Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Gross Sales</span>
            <span className="text-base font-black text-slate-800">₹{revenue}</span>
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ClipboardList className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Orders</span>
            <span className="text-base font-black text-slate-800">{orders.length}</span>
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Package className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">My Products</span>
            <span className="text-base font-black text-slate-800">{products.length} Items</span>
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><AlertTriangle className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Out of Stock</span>
            <span className="text-base font-black text-slate-800">{products.filter(p => p.inventory === 0).length} items</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products and Inventory Control */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-600" /> Seller Product Inventory
                </h4>
                <p className="text-[10px] text-slate-400">Newly added items require quick verification before they are shown to farmers.</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-2 px-3 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                You have not listed any items. Add seeds, fertilizers, or tools to begin sales.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold border-b border-slate-50">
                      <th className="pb-3 w-12">Photo</th>
                      <th className="pb-3 pl-2">Product Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3 text-right">Price (₹)</th>
                      <th className="pb-3 text-center">Stock</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right w-12">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2.5">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border bg-slate-100">
                            <img src={p.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </td>
                        <td className="py-2.5 pl-2 font-bold text-slate-800">{p.name}</td>
                        <td className="py-2.5 text-slate-500 capitalize">{p.category.replace("_", " ")}</td>
                        <td className="py-2.5 text-right font-black text-slate-800">₹{p.price}</td>
                        <td className="py-2.5 text-center">
                          <span className={`font-bold px-1.5 py-0.5 rounded-md ${p.inventory > 10 ? 'bg-emerald-50 text-emerald-800' : p.inventory > 0 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'}`}>
                            {p.inventory}
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`text-[10px] font-bold ${p.isVerified ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {p.isVerified ? "✓ Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Orders dispatch control */}
        <div className="space-y-5">
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-emerald-600" /> Farmer Buy Orders
            </h4>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                No purchases logged yet. Complete orders display in Gross Sales.
              </div>
            ) : (
              <div className="space-y-3.5">
                {orders.map((order) => (
                  <div key={order.id} className="p-3.5 border rounded-2xl bg-slate-50/50 space-y-2.5 text-xs">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="font-bold text-slate-800 leading-tight block">{order.itemTitle}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Farmer Client: {order.buyerName}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                        order.status === 'shipped' ? 'bg-purple-50 text-purple-800 border-purple-100' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-white p-2 border rounded-xl space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Quantity Ordered:</span>
                        <span className="font-bold text-slate-700">{order.quantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gross Price:</span>
                        <span className="font-black text-emerald-700">₹{order.totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Confirmed:</span>
                        <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t mt-1 text-[10px] text-slate-500">
                        <span className="font-bold block text-slate-600">Shipment Location:</span>
                        {order.deliveryAddress}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-1.5">
                      {order.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "rejected")}
                            className="py-1 text-center bg-rose-50 text-rose-700 font-bold rounded-lg cursor-pointer hover:bg-rose-100"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "accepted")}
                            className="py-1 text-center bg-emerald-600 text-white font-bold rounded-lg cursor-pointer hover:bg-emerald-700"
                          >
                            Accept
                          </button>
                        </div>
                      )}

                      {order.status === "accepted" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                          className="w-full py-1.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all cursor-pointer"
                        >
                          Ship / Dispatch order 📦
                        </button>
                      )}

                      {order.status === "shipped" && (
                        <div className="space-y-1">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                            className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all cursor-pointer"
                          >
                            Delivered ✓
                          </button>
                        </div>
                      )}

                      {order.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "", "paid")}
                          className="w-full py-1 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          Confirm Payment Received
                        </button>
                      )}

                      <button
                        onClick={() => onChatNavigate(order.buyerId, order.buyerName)}
                        className="w-full py-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Client Support Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Inventory Product Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in zoom-in duration-150 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-black text-slate-800 tracking-tight">Upload Agricultural Product</h4>
                <p className="text-xs text-slate-400 mt-0.5">List products for instant visibility in farmer marketplace feeds.</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urea Fertiliser (Super Grade)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="seeds">Seeds</option>
                    <option value="fertilizers">Fertilizers</option>
                    <option value="pesticides">Pesticides</option>
                    <option value="tractors">Tractors</option>
                    <option value="pumps">Water Pumps</option>
                    <option value="sprayers">Sprayers</option>
                    <option value="irrigation_equipment">Irrigation Equipment</option>
                    <option value="farm_tools">Farm Tools</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Selling Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. bag (25 kg), piece, Liter"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Inventory Stock Qty *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Image Asset URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              {/* Curated Unsplash Product Photos */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Curated Product Catalog Photos (Unsplash)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Click to assign</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {UNSPLASH_PRODUCT_IMAGES.map((prod) => (
                    <button
                      type="button"
                      key={prod.id}
                      onClick={() => setImageUrl(prod.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        (imageUrl || getProductImageUrl(name, category)) === prod.url
                          ? "border-emerald-600 ring-2 ring-emerald-300"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                      title={prod.name}
                    >
                      <img src={prod.url} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold text-white text-center py-0.5 truncate px-1">
                        {prod.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Detailed Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Specify crop chemical formula, brand warranty, instructions for dilution, guidelines for spreading..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              {addError && (
                <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-center font-medium">
                  {addError}
                </div>
              )}

              <div className="pt-3 border-t flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-1"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Publish To Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
