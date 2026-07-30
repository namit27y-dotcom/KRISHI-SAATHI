import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Send, RefreshCw, Loader2, ArrowLeft, Shield } from "lucide-react";

interface MarketplaceChatsProps {
  user: any;
  preSelectedPartnerId?: string | null;
  preSelectedPartnerName?: string | null;
  onBack?: () => void;
}

export default function MarketplaceChats({ 
  user, 
  preSelectedPartnerId = null, 
  preSelectedPartnerName = null,
  onBack
}: MarketplaceChatsProps) {
  const [partnerId, setPartnerId] = useState<string | null>(preSelectedPartnerId);
  const [partnerName, setPartnerName] = useState<string | null>(preSelectedPartnerName);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  // Fallback contact list derived from order history to kickstart direct chats
  const [contacts, setContacts] = useState<any[]>([]);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/marketplace/orders", {
        headers: { Authorization: `Bearer mock-jwt-token-${user.id}` }
      });
      const orders = res.data.orders || [];
      const uniques: Record<string, string> = {};

      orders.forEach((o: any) => {
        if (o.buyerId !== user.id) {
          uniques[o.buyerId] = o.buyerName;
        }
        if (o.sellerId !== user.id) {
          uniques[o.sellerId] = o.sellerName;
        }
      });

      // Also add standard admin/test buyer/seller for support
      if (user.role !== "admin") {
        uniques["admin-1"] = "Krishi Saathi Help Desk (Admin)";
      }

      const list = Object.entries(uniques).map(([id, name]) => ({ id, name }));
      setContacts(list);

      // Default select first contact if none preselected
      if (!partnerId && list.length > 0) {
        setPartnerId(list[0].id);
        setPartnerName(list[0].name);
      }
    } catch (err) {
      console.error("Error fetching chat contacts", err);
    }
  };

  const fetchConversation = async () => {
    if (!partnerId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/marketplace/chats?userA=${user.id}&userB=${partnerId}`);
      setMessages(res.data.chats || []);
    } catch (err) {
      console.error("Error retrieving conversation history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    fetchConversation();
    
    // Auto refresh every 5s if active
    const interval = setInterval(() => {
      if (partnerId) {
        axios.get(`/api/marketplace/chats?userA=${user.id}&userB=${partnerId}`)
          .then(res => setMessages(res.data.chats || []))
          .catch(err => console.error("Poll err", err));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [partnerId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerId || !partnerName) return;

    setSending(true);
    try {
      const res = await axios.post("/api/marketplace/chats", {
        senderId: user.id,
        senderName: user.name,
        receiverId: partnerId,
        receiverName: partnerName,
        message: newMessage.trim()
      });

      setNewMessage("");
      // Append local message instantly
      setMessages(prev => [...prev, res.data.chat]);
    } catch (err) {
      console.error("Error dispatching chat", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl p-5 shadow-xs h-[550px] flex flex-col" id="marketplace-chats-component">
      {/* Header bar */}
      <div className="flex justify-between items-center pb-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-xl transition-all mr-1 cursor-pointer">
              <ArrowLeft className="w-4 h-4 text-slate-500" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Direct Trade Messenger
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {partnerName ? `Chatting with: ${partnerName}` : "Select a contact to begin trade discussions"}
            </p>
          </div>
        </div>

        {partnerId && (
          <button
            onClick={fetchConversation}
            disabled={loading}
            className="p-1.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-slate-600"
            title="Refresh Conversation"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Main chat layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        {/* Contact List panel */}
        <div className="hidden md:flex flex-col border-r pr-4 space-y-2 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">My Trade Contacts</span>
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-1">
            {contacts.length === 0 ? (
              <div className="p-3 text-center text-slate-400 italic text-[11px]">
                No active contacts yet. Connect by placing an order!
              </div>
            ) : (
              contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setPartnerId(c.id); setPartnerName(c.name); }}
                  className={`w-full text-left p-3 rounded-2xl font-bold transition-all block ${
                    partnerId === c.id
                      ? "bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 pl-3.5"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="truncate block">{c.name}</span>
                  <span className="text-[9px] font-normal text-slate-400 mt-0.5 block capitalize">ID: #{c.id}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messaging Area */}
        <div className="md:col-span-3 flex flex-col justify-between h-full min-h-0">
          {!partnerId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-xs text-center space-y-1">
              <MessageSquare className="w-10 h-10 text-slate-300 stroke-[1.5]" />
              <span className="font-bold">No Chat Selected</span>
              <p className="max-w-xs text-slate-400 leading-normal">
                Select a crop listing or equipment product, and click "Chat" to open a negotiations thread with them!
              </p>
            </div>
          ) : (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto space-y-3 p-2.5 bg-slate-50/50 rounded-2xl border mb-3 scrollbar-none flex flex-col">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-[11px] italic">
                    This is the beginning of your chat log with {partnerName}. Offer friendly rates and coordinate cargo shipping options here.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isOutgoing = m.senderId === user.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[85%] ${isOutgoing ? "self-end items-end" : "self-start items-start"}`}
                      >
                        <div className="text-[9px] text-slate-400 font-bold mb-0.5 px-1 flex items-center gap-1">
                          <span>{m.senderName}</span>
                          {m.senderId === "admin-1" && <Shield className="w-3 h-3 text-emerald-600" />}
                        </div>
                        <div
                          className={`p-3 rounded-2xl leading-relaxed text-xs shadow-xs font-medium ${
                            isOutgoing
                              ? "bg-emerald-600 text-white rounded-tr-xs"
                              : "bg-white text-slate-800 border rounded-tl-xs"
                          }`}
                        >
                          {m.message}
                        </div>
                        <span className="text-[8px] text-slate-300 font-semibold mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Typing Input bar */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Write a secure message to ${partnerName}...`}
                  required
                  className="flex-1 p-3 bg-slate-50 border rounded-xl text-xs outline-none focus:border-emerald-500 font-medium text-slate-700"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
