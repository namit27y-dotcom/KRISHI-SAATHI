import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
import { Notification } from "../types.ts";

interface NotificationPanelProps {
  userId: string;
  onClose?: () => void;
}

export default function NotificationPanel({ userId, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/notifications?userId=${userId}`);
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.post(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
      case "reminder":
        return <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden text-xs max-h-[380px] flex flex-col" id="notification-panel-layout">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-gray-100 flex justify-between items-center shrink-0">
        <span className="font-bold text-slate-800 flex items-center gap-1">
          <Bell className="w-4 h-4 text-emerald-600" /> Notifications 
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {unreadCount} New
            </span>
          )}
        </span>
        <button 
          onClick={fetchNotifications}
          className="text-[10px] text-emerald-600 hover:underline font-bold"
        >
          Refresh
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No active schedules or warnings.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && markAsRead(notif.id)}
              className={`p-3.5 flex items-start gap-3 transition-all cursor-pointer ${
                notif.isRead ? "bg-white hover:bg-slate-50/50" : "bg-emerald-50/20 hover:bg-emerald-50/40 font-semibold text-slate-900"
              }`}
              id={`notif-row-${notif.id}`}
            >
              {getIcon(notif.type)}
              <div className="flex-1 space-y-0.5">
                <span className="block font-bold text-slate-800">{notif.title}</span>
                <p className="text-[11px] text-slate-500 leading-normal">{notif.message}</p>
                <span className="block text-[9px] text-slate-400 pt-1 font-mono">
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
