"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft, Edit, Share2, MapPin, PlaneTakeoff,
    Calendar, Users, Info, CheckCircle
} from "lucide-react";

function ManageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [shuttle, setShuttle] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        const id = searchParams.get('id');
        const create = searchParams.get('create');
        const all = JSON.parse(localStorage.getItem('matchy_shuttles_v1') || '[]');

        let target = null;
        if (id) {
            target = all.find((s: any) => s.id == id);
        } else if (create) {
            // Mock creation logic for demo
            const prefs = JSON.parse(localStorage.getItem('matchy_search_prefs') || '{}');
            target = {
                id: all.length + 1,
                host: "You",
                title: prefs.flight ? `Flight ${prefs.flight} Shuttle` : "Your New Shuttle",
                capacity: parseInt(prefs.capacity || 4),
                occupied: 1,
                dest: prefs.dest || "Alexanderplatz",
                time: "Now",
                lang: prefs.lang || "English",
                transport: prefs.transport || "Taxi",
                badge: "New Request",
                avatar: "https://randomuser.me/api/portraits/lego/1.jpg"
            };
            // Save it
            const nextAll = [...all, target];
            localStorage.setItem('matchy_shuttles_v1', JSON.stringify(nextAll));
        } else {
            target = all.find((s: any) => s.host === 'You');
        }

        if (target) {
            setShuttle(target);
            setMembers([
                { name: "You", role: "Host", avatar: target.avatar },
                { name: "Sarah M.", role: "Joiner", status: "Requested", avatar: "https://randomuser.me/api/portraits/women/40.jpg" }
            ]);
        }
    }, [searchParams]);

    const handleEdit = () => {
        // Navigate home with edit flag
        router.push("/?edit=true");
    };

    if (!shuttle) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center h-full">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <MapPin size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-[#001233] mb-2">No active rides found</h2>
                <p className="text-gray-500 mb-8">You haven't joined or created a shuttle yet.</p>
                <Link href="/" className="btn-primary px-8 py-3 shadow-lg">Find a Ride</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <header className="bg-white px-8 pt-8 pb-6 border-b border-gray-100 sticky top-0 z-20">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <ArrowLeft size={20} className="text-[#001233]" />
                    </Link>
                    <div className="flex gap-2">
                        <button onClick={handleEdit} className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm">
                            <Edit size={18} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
                <h1 className="text-2xl font-black text-[#001233]">Manage My Ride</h1>
            </header>

            <div className="p-8 space-y-8 pb-32">
                {/* Main Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 overflow-hidden relative"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-3 inline-block tracking-wider">Confirmed</span>
                            <h2 className="text-2xl font-black text-[#001233]">{shuttle.title}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Fare Est.</p>
                            <p className="text-xl font-black text-[#001233]">$12.50</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-gray-50 pt-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Destination</p>
                                <p className="text-sm font-bold text-[#001233]">{shuttle.dest}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Departure</p>
                                <p className="text-sm font-bold text-[#001233]">{shuttle.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <PlaneTakeoff size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Flight Ref</p>
                                <p className="text-sm font-bold text-[#001233]">{shuttle.flight || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                <Users size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Capacity</p>
                                <p className="text-sm font-bold text-[#001233]">{shuttle.occupied}/{shuttle.capacity} Seats</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Users size={120} />
                    </div>
                </motion.div>

                {/* Members List */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[#001233]">Who's in?</h3>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{members.length} people</span>
                    </div>
                    <div className="space-y-4">
                        {members.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="bg-white p-5 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="relative">
                                    <Image src={member.avatar} alt={member.name} width={48} height={48} className="rounded-2xl" />
                                    {member.role === 'Host' && (
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-full shadow-sm">
                                            <CheckCircle size={10} fill="currentColor" stroke="white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-[#001233]">{member.name}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{member.role}</p>
                                </div>
                                {member.status && (
                                    <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">{member.status}</span>
                                )}
                                <button className="text-blue-500 font-bold text-sm px-4">Chat</button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Eco Impact Banner */}
                <div className="bg-[#001233] rounded-[32px] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">Sustainable Choice! 🌱</h3>
                        <p className="text-sm text-blue-200 leading-relaxed max-w-[200px]">By sharing this ride, you're saving <span className="text-white font-black">4.2kg of CO2</span> emissions.</p>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
                        <Info size={120} strokeWidth={1} />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[1200px] mx-auto p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 z-30">
                <button className="flex-1 btn-primary py-5 text-lg shadow-xl active:scale-[0.98] transition-all">Mark as Arrived</button>
                <button className="flex-grow btn-secondary py-5 text-lg border-2 border-gray-100" onClick={() => router.push("/")}>Return Home</button>
            </div>
        </div>
    );
}

export default function ManagePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ManageContent />
        </Suspense>
    );
}
