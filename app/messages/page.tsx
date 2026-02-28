"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, MoreVertical, Send, Check,
    CheckCheck, Image as ImageIcon, Smile,
    MapPin, Phone, ArrowLeft, Info
} from "lucide-react";

export default function MessagesPage() {
    const [activeChat, setActiveChat] = useState<number | null>(null);

    const chats = [
        {
            id: 1,
            name: "Sophie R.",
            lastMsg: "I'll be at the terminal 1 exit, see you there!",
            time: "2:45 PM",
            unread: 0,
            online: true,
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            messages: [
                { id: 1, text: "Hey! Are you still joining the shuttle?", sent: false, time: "2:30 PM" },
                { id: 2, text: "Yes, I just landed! Just waiting for my bag.", sent: true, time: "2:35 PM" },
                { id: 3, text: "Perfect. I'll be at the terminal 1 exit, see you there!", sent: false, time: "2:45 PM" },
                { id: 4, text: "Flight LH2024 Update: Your arrival will be at 16:00. You have a 15-minute delay.", sent: false, time: "2:46 PM", isSystem: true },
            ]
        },
        {
            id: 2,
            name: "Liam K.",
            lastMsg: "Can we wait 5 mins? My flight was delayed.",
            time: "1:20 PM",
            unread: 2,
            online: false,
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            messages: [
                { id: 1, text: "Can we wait 5 mins? My flight was delayed.", sent: false, time: "1:20 PM" },
            ]
        },
        {
            id: 3,
            name: "Aisha B.",
            lastMsg: "Thanks for the ride earlier!",
            time: "Yesterday",
            unread: 0,
            online: false,
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            messages: [
                { id: 1, text: "Thanks for the ride earlier!", sent: false, time: "Yesterday" },
            ]
        },
    ];

    const currentChat = activeChat ? chats.find(c => c.id === activeChat) : null;

    return (
        <div className="flex h-[calc(100vh-80px)] bg-[#f8f9fa] overflow-hidden">
            {/* Sidebar - Chat List */}
            <div className={`w-full md:w-[400px] bg-white border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 pb-4">
                    <h1 className="text-3xl font-black text-[#001233] mb-6">Messages</h1>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all font-semibold"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-4 py-4 space-y-2">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-[28px] transition-all group ${activeChat === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                            <div className="relative">
                                <Image src={chat.avatar} alt={chat.name} width={56} height={56} className="rounded-2xl" />
                                {chat.online && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                )}
                            </div>
                            <div className="flex-grow text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`font-black tracking-tight ${activeChat === chat.id ? 'text-blue-600' : 'text-[#001233]'}`}>{chat.name}</h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{chat.time}</span>
                                </div>
                                <p className={`text-sm line-clamp-1 ${chat.unread > 0 ? 'font-bold text-[#001233]' : 'text-gray-500'}`}>
                                    {chat.lastMsg}
                                </p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-blue-200">
                                    {chat.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-grow flex flex-col bg-white relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                <AnimatePresence mode="wait">
                    {activeChat && currentChat ? (
                        <motion.div
                            key={activeChat}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full flex flex-col"
                        >
                            {/* Chat Header */}
                            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setActiveChat(null)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="relative">
                                        <Image src={currentChat.avatar} alt={currentChat.name} width={48} height={48} className="rounded-2xl" />
                                        {currentChat.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                                    </div>
                                    <div>
                                        <h2 className="font-black text-[#001233] leading-none mb-1">{currentChat.name}</h2>
                                        <p className="text-xs text-green-500 font-bold uppercase tracking-widest">{currentChat.online ? 'Online' : 'Offline'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                                        <Phone size={20} />
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Content */}
                            <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-[#fcfdfe]">
                                {currentChat.messages.map((msg: any) => (
                                    msg.isSystem ? (
                                        <div key={msg.id} className="flex justify-center my-6">
                                            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 flex flex-col items-center text-center shadow-sm w-[90%] md:w-[80%] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -z-10 -mr-10 -mt-10 opacity-60" />
                                                <Image src="/logo.svg" alt="Matchy" width={40} height={40} className="mb-3" />
                                                <p className="text-sm font-black text-[#001233] leading-relaxed">{msg.text}</p>
                                                <span className="text-[10px] items-center gap-1 font-bold text-blue-500 uppercase mt-3 tracking-widest flex"><Info size={12} /> Matchy Assistant • {msg.time}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] ${msg.sent ? 'order-2' : ''}`}>
                                                <div className={`p-5 rounded-[28px] text-sm font-semibold shadow-sm ${msg.sent
                                                    ? 'bg-[#001233] text-white rounded-tr-none'
                                                    : 'bg-white text-[#001233] border border-gray-100 rounded-tl-none'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <div className={`flex items-center gap-2 mt-2 px-2 ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{msg.time}</span>
                                                    {msg.sent && <CheckCheck size={14} className="text-blue-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div className="p-8 pt-4">
                                <div className="bg-gray-50 p-3 rounded-[32px] flex items-center gap-2 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
                                    <button className="p-3 text-gray-400 hover:text-blue-500 transition-colors">
                                        <Smile size={20} />
                                    </button>
                                    <button className="p-3 text-gray-400 hover:text-blue-500 transition-colors">
                                        <ImageIcon size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-grow bg-transparent outline-none font-semibold text-sm px-2"
                                    />
                                    <button className="bg-[#001233] text-white p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                                        <Send size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#fcfdfe]">
                            <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center mb-8 shadow-inner">
                                <MessageCircle size={40} className="text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black text-[#001233] mb-3">Your Conversations</h2>
                            <p className="text-gray-500 max-w-[300px] leading-relaxed font-medium">
                                Select a chat to coordinate with your travel buddies and plan your ride together.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function MessageCircle({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
}
