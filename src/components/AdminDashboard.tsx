import React, { useState, useEffect } from "react";
import axios from "axios";
import { Shield, Users, Sprout, ShoppingBag, CheckCircle, XCircle, Trash2, ShieldAlert, Loader2 } from "lucide-react";

interface AdminDashboardProps {
  user: any;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterRole, setFilterRole] = useState<string>("");

  const fetchAdminData = async () => {
    if (!user || user.role !== "admin") {
      return;
    }
    setLoading(true);
    try {
      // Users list
      const resUsers = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      setUsersList(resUsers.data.users || []);

      // Crops
      const resCrops = await axios.get("/api/marketplace/crops");
      setCropsList(resCrops.data.listings || []);

      // Products
      const resProds = await axios.get("/api/marketplace/products");
      setProductsList(resProds.data.products || []);
    } catch (err) {
      console.error("Error fetching admin feeds", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserVerify = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/admin/users/${userId}/verify`, { isVerified: !currentStatus }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error("Error toggling user verification", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Warning: Deleting this user will completely purge their account. Proceed?")) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleToggleCropVerify = async (cropId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/marketplace/crops/${cropId}/verify`, { isVerified: !currentStatus }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error("Error verifying crop", err);
    }
  };

  const handleToggleProductVerify = async (prodId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/marketplace/products/${prodId}/verify`, { isVerified: !currentStatus }, {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error("Error verifying product", err);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center space-y-4 max-w-md mx-auto my-12" id="admin-access-denied">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="font-black text-slate-800 text-lg">Access Denied</h3>
        <p className="text-xs text-slate-500 leading-normal">
          You must be logged in with an Administrator profile to access the admin verification console.
        </p>
      </div>
    );
  }

  const filteredUsers = filterRole ? usersList.filter(u => u.role === filterRole) : usersList;

  return (
    <div className="space-y-6" id="admin-dashboard-component">
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Users className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Members</span>
            <span className="text-base font-black text-slate-800">{usersList.length}</span>
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><ShieldAlert className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Unverified Profiles</span>
            <span className="text-base font-black text-slate-800">
              {usersList.filter(u => !u.isVerified && u.role !== "admin").length} Accounts
            </span>
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Sprout className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Pending Crops</span>
            <span className="text-base font-black text-slate-800">
              {cropsList.filter(c => !c.isVerified).length} Listings
            </span>
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-4.5 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl"><ShoppingBag className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Pending Products</span>
            <span className="text-base font-black text-slate-800">
              {productsList.filter(p => !p.isVerified).length} Items
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profiles verification (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" /> Member Directory Verification
                </h4>
                <p className="text-[10px] text-slate-400">Validate registrations for farmers, wholesalers, and equipment companies.</p>
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="text-xs bg-slate-50 border p-1.5 rounded-xl outline-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="farmer">Farmers 👨‍🌾</option>
                <option value="seller">Sellers 🏪</option>
                <option value="buyer">Buyers 🌾</option>
                <option value="admin">Admins 👨‍💻</option>
              </select>
            </div>

            {loading && usersList.length === 0 ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No registered accounts match your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold border-b border-slate-50">
                      <th className="pb-3 pl-1">Name / Company</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Location (Village, District, State)</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2.5 pl-1 font-bold text-slate-800">
                          <div>
                            <span>{u.name}</span>
                            {u.companyName && (
                              <span className="block text-[10px] text-slate-400 font-semibold">{u.companyName} (GST: {u.gstNumber || 'N/A'})</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            u.role === 'farmer' ? 'bg-emerald-50 text-emerald-800' :
                            u.role === 'seller' ? 'bg-amber-50 text-amber-800' :
                            u.role === 'buyer' ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500">
                          {u.village ? `${u.village}, ` : ""}{u.district}, {u.state} ({u.country || 'India'})
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`font-bold text-[10px] ${u.isVerified ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {u.isVerified ? "Verified 🛡️" : "Unverified"}
                          </span>
                        </td>
                        <td className="py-2.5 text-right space-x-1.5 whitespace-nowrap">
                          {u.role !== "admin" && (
                            <>
                              <button
                                onClick={() => handleToggleUserVerify(u.id, u.isVerified)}
                                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                                  u.isVerified ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {u.isVerified ? "Revoke" : "Verify"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer inline-flex items-center"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Listings and products verify queue (Right column) */}
        <div className="space-y-6">
          {/* Crops pending queue */}
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" /> Crop Listings Queue
            </h4>

            {cropsList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No crops listed on the system.
              </div>
            ) : (
              <div className="space-y-3">
                {cropsList.map((c) => (
                  <div key={c.id} className="p-3 border rounded-2xl bg-slate-50/50 flex justify-between items-center text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 truncate block leading-tight">{c.cropName}</span>
                        <span className={`text-[8px] font-bold uppercase px-1 rounded ${c.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {c.isVerified ? 'Live' : 'Pending'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Farmer: {c.farmerName}</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold mt-0.5 block">₹{c.pricePerUnit}/kg ({c.quantity} {c.unit || 'kg'})</span>
                    </div>

                    <button
                      onClick={() => handleToggleCropVerify(c.id, c.isVerified)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        c.isVerified ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {c.isVerified ? 'Suspend' : 'Approve'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seller products queue */}
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-600" /> Seller Products Queue
            </h4>

            {productsList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No dealer products listed on the system.
              </div>
            ) : (
              <div className="space-y-3">
                {productsList.map((p) => (
                  <div key={p.id} className="p-3 border rounded-2xl bg-slate-50/50 flex justify-between items-center text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 truncate block leading-tight">{p.name}</span>
                        <span className={`text-[8px] font-bold uppercase px-1 rounded ${p.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {p.isVerified ? 'Live' : 'Pending'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Company: {p.sellerName}</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold mt-0.5 block">₹{p.price} per {p.unit} (Stock: {p.inventory})</span>
                    </div>

                    <button
                      onClick={() => handleToggleProductVerify(p.id, p.isVerified)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        p.isVerified ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {p.isVerified ? 'Suspend' : 'Approve'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
