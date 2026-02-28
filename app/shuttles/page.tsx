"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Users, MapPin, Star, CheckCircle, Info, Sparkles, BusFront, PlaneTakeoff } from "lucide-react";

export default function ShuttlesPage() {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            const prefs = JSON.parse(localStorage.getItem('matchy_search_prefs') || 'null');

            try {
                // 1. Try to get AI matches
                if (prefs) {
                    const response = await fetch('/api/shuttles/match', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prefs })
                    });
                    const data = await response.json();

                    if (!data.error) {
                        // We need the full shuttle data for these IDs
                        const allResp = await fetch('/api/shuttles');
                        const all = await allResp.json();

                        const matchedShuttles = data.map((m: any) => ({
                            ...all.find((s: any) => s.id === m.id),
                            similarity: m.similarity,
                            reason: m.reason
                        })).filter((s: any) => s.id !== undefined);

                        setMatches(matchedShuttles);
                    } else {
                        const allResp = await fetch('/api/shuttles');
                        const all = await allResp.json();
                        setMatches(all.slice(0, 3));
                    }
                } else {
                    const allResp = await fetch('/api/shuttles');
                    const all = await allResp.json();
                    setMatches(all);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                // Fallback to all shuttles if API fails
                const allResp = await fetch('/api/shuttles');
                const all = await allResp.json();
                setMatches(all.slice(0, 3));
            }
            setLoading(false);
        };

        fetchMatches();
    }, []);

    const handleJoin = (id: number) => {
        // Points logic would go here
        router.push(`/manage?id=${id}`);
    };

    const handCreateYourOwn = () => {
        // In a real app we'd POST to API, here we just do local creation logic if we want, but for hackathon demo we just redirect
        router.push("/manage?create=true");
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-32">
            <header className="bg-[#001233] text-white px-8 pt-10 pb-20 rounded-b-[40px] relative">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black">Similar Shuttles</h1>
                        <p className="text-xs text-blue-200 mt-1 uppercase font-bold tracking-widest">{matches.length} Matches Found</p>
                    </div>
                </div>
                <div className="absolute top-8 right-10 rotate-12 opacity-30">
                    <Sparkles size={64} className="text-[#f4b400]" />
                </div>
            </header>

            <div className="px-8 -mt-10 space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-bold">AI is connecting travel buddies...</p>
                    </div>
                ) : matches.length > 0 ? (
                    matches.map((shuttle, index) => (
                        <motion.div
                            key={shuttle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="shuttle-card group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <Image src={shuttle.avatar} alt={shuttle.host} width={56} height={56} className="rounded-full shadow-inner" />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-extrabold text-[#001233]">{shuttle.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 leading-none shadow-sm">
                                            <CheckCircle size={10} fill="currentColor" stroke="white" /> {shuttle.badge}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 font-bold text-[#001233] bg-yellow-50 px-3 py-1.5 rounded-2xl border border-yellow-200 shadow-sm">
                                    <Star size={16} fill="#f4b400" stroke="#f4b400" />
                                    <span>4.9</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
                                    <Users size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" /> {shuttle.occupied}/{shuttle.capacity} Seats Occupied
                                </div>
                                <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
                                    <MapPin size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" /> {shuttle.dest} ({shuttle.time})
                                </div>
                                {(shuttle.flight || shuttle.flightStatus) && (
                                    <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
                                        <PlaneTakeoff size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <div className="flex items-center gap-2">
                                            {shuttle.flight || "Flight Info"}
                                            {shuttle.flightStatus && (
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${shuttle.flightStatus === 'Delayed' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                    {shuttle.flightStatus}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm font-black text-[#001233]">
                                    <BusFront size={16} className="text-gray-400" /> {shuttle.similarity || 'High Match'}
                                </div>
                                <div className="bg-blue-50/50 p-4 rounded-2xl mt-4 border border-blue-100 italic text-[11px] text-blue-700 leading-relaxed flex gap-3 shadow-inner">
                                    <Info size={14} className="flex-shrink-0" />
                                    <span>"{shuttle.reason || 'Highly compatible ride for your search.'}"</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleJoin(shuttle.id)}
                                    className="flex-[2] btn-primary py-4 text-sm shadow-xl active:scale-95 transition-all"
                                >
                                    Request to Join
                                </button>
                                <button className="flex-1 bg-white text-[#001233] border-2 border-gray-100 font-bold rounded-full py-4 text-sm hover:border-gray-200 transition-all active:scale-95 shadow-sm">
                                    Chat
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white rounded-[32px] shadow-sm border border-dashed border-blue-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <BusFront size={40} className="text-blue-300" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001233] mb-3">No matches found</h3>
                        <p className="text-gray-500 max-w-[280px] mb-8 leading-relaxed">
                            We couldn't find any shuttles matching your criteria yet. Be the first to start this ride!
                        </p>
                        <button
                            onClick={handCreateYourOwn}
                            className="btn-primary px-10 py-4 shadow-xl flex items-center gap-3 active:scale-95 transition-all"
                        >
                            <Sparkles size={18} /> Start Your Own
                        </button>
                    </div>
                )}

                <div className="pt-8">
                    <p className="text-center text-gray-400 font-medium text-xs mb-4 uppercase tracking-[0.2em]">Not seeing the right one?</p>
                    <button
                        onClick={handCreateYourOwn}
                        className="w-full py-5 rounded-[30px] border-2 border-dashed border-blue-200 text-blue-600 font-black hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Sparkles size={20} /> Create New Shuttle Request
                    </button>
                </div>
            </div>
        </div>
    );
}
