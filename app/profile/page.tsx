"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Globe, Shield,
    Settings, Camera, Check, X, LogOut,
    Star, Award, Leaf
} from "lucide-react";

const USER_KEY = 'matchy_user_v1';

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>({
        name: "Alex Johnson",
        email: "alex.j@example.com",
        phone: "+49 123 456 789",
        bio: "Frequent traveler. Loves sustainability and meeting new people.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        points: 1250,
        ridesShared: 12,
        co2Saved: "45.2kg",
        level: "Platinum Explorer"
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<any>({});
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem(USER_KEY);
        if (stored) {
            setUserData(JSON.parse(stored));
        } else {
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
        }
    }, []);

    const handleEdit = () => {
        setEditedData({ ...userData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        setUserData(editedData);
        localStorage.setItem(USER_KEY, JSON.stringify(editedData));
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-32">
            <header className="bg-[#001233] text-white px-8 pt-12 pb-32 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black mb-2">My Profile</h1>
                        <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">{userData.level}</p>
                    </div>
                    <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                    <User size={200} />
                </div>
            </header>

            <div className="px-8 -mt-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-2xl p-8 border border-gray-100"
                >
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl">
                                <Image
                                    src={userData.avatar}
                                    alt={userData.name}
                                    width={128}
                                    height={128}
                                    className="object-cover"
                                />
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-[-10px] right-[-10px] w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                                    <Camera size={18} />
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="text-center w-full">
                                <h2 className="text-2xl font-black text-[#001233] mb-2">{userData.name}</h2>
                                <p className="text-gray-500 text-sm mb-6 px-4">{userData.bio}</p>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-50 text-center">
                                        <Star className="text-yellow-500 mx-auto mb-1" size={18} fill="currentColor" />
                                        <p className="text-lg font-black text-[#001233]">{userData.points}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Points</p>
                                    </div>
                                    <div className="bg-green-50/50 p-4 rounded-3xl border border-green-50 text-center">
                                        <Award className="text-blue-500 mx-auto mb-1" size={18} />
                                        <p className="text-lg font-black text-[#001233]">{userData.ridesShared}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Rides</p>
                                    </div>
                                    <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-50 text-center">
                                        <Leaf className="text-green-500 mx-auto mb-1" size={18} />
                                        <p className="text-lg font-black text-[#001233] leading-none">{userData.co2Saved}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Saved</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left border-t border-gray-100 pt-8">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                                            <p className="font-bold text-[#001233]">{userData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                                            <p className="font-bold text-[#001233]">{userData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verification</p>
                                            <p className="font-bold text-green-600 flex items-center gap-1">Verified User <Check size={14} strokeWidth={3} /></p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleEdit}
                                    className="btn-primary w-full py-5 text-lg mt-10 shadow-xl active:scale-95 transition-all"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <div className="w-full space-y-6">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedData.name}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={editedData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-bold resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedData.email}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editedData.phone}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-bold"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-5 rounded-[25px] flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        <X size={20} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-[2] btn-primary py-5 text-lg shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                                    >
                                        <Check size={20} /> Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                <section className="mt-12 space-y-6">
                    <h3 className="text-xl font-black text-[#001233] px-2 flex items-center justify-between">
                        Account Settings
                        <Settings size={20} className="text-gray-400" />
                    </h3>
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
                        {[
                            { label: "Language", value: "English (US)", icon: <Globe size={20} /> },
                            { label: "Privacy Policy", value: "", icon: <Shield size={20} /> },
                            { label: "Log Out", value: "", icon: <LogOut size={20} />, danger: true }
                        ].map((item, i) => (
                            <button
                                key={item.label}
                                className={`w-full flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${item.danger ? 'text-red-500' : 'text-[#001233]'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`${item.danger ? 'bg-red-50' : 'bg-gray-50'} w-10 h-10 rounded-2xl flex items-center justify-center text-gray-500`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-bold">{item.label}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-400">{item.value}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
