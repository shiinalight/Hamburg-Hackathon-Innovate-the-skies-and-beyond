"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Users, LocationDot, Star, CheckCircle, Info, Sparkles } from "lucide-react";

export default function ShuttlesPage() {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            const prefs = JSON.parse(localStorage.getItem('matchy_search_prefs') || 'null');

            // Get all local shuttles
            const allShuttles = JSON.parse(localStorage.getItem('matchy_shuttles_v1') || '[]');
            if (allShuttles.length === 0) {
                // Initialize mock if empty
                const mockShuttles = [
                    { id: 1, host: "Sophie R.", title: "Sophie's Shuttle", capacity: 4, occupied: 3, dest: "Alexanderplatz", time: "15:45", lang: "English", transport: "Taxi", badge: "Standard Host", avatar: "https://randomuser.me/api/portraits/women/44.jpg", budget: "$15" },
                    { id: 2, host: "Liam K.", title: "Liam's XL Shuttle", capacity: 6, occupied: 2, dest: "Potsdamer Platz", time: "16:00", lang: "English", transport: "Ride-share", badge: "Pro Host", avatar: "https://randomuser.me/api/portraits/men/32.jpg", budget: "$22" },
                    { id: 3, host: "Aisha B.", title: "Aisha's Green Shuttle", capacity: 4, occupied: 1, dest: "Alexanderplatz", time: "15:30", lang: "German", transport: "Public Transit", badge: "Eco-Friendly", avatar: "https://randomuser.me/api/portraits/women/68.jpg", budget: "$8" },
                    { id: 4, host: "Mark J.", title: "Mark's Relaxed Ride", capacity: 4, occupied: 2, dest: "Alexanderplatz", time: "16:30", lang: "English", transport: "Taxi", badge: "Friendly", avatar: "https://randomuser.me/api/portraits/men/12.jpg", budget: "$18" },
                    { id: 5, host: "Elena S.", title: "Elena's Airport Express", capacity: 4, occupied: 3, dest: "Potsdamer Platz", time: "15:15", lang: "Spanish", transport: "Ride-share", badge: "Verified", avatar: "https://randomuser.me/api/portraits/women/33.jpg", budget: "$20" }
                ];
                localStorage.setItem('matchy_shuttles_v1', JSON.stringify(mockShuttles));
            }

            if (prefs) {
                try {
                    const response = await fetch('/api/shuttles/match', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prefs, shuttles: JSON.parse(localStorage.getItem('matchy_shuttles_v1') || '[]') })
                    });
                    const data = await response.json();

                    if (!data.error) {
                        const all = JSON.parse(localStorage.getItem('matchy_shuttles_v1') || '[]');
                        const matchedShuttles = data.map((m: any) => ({
                            ...all.find((s: any) => s.id === m.id),
                            similarity: m.similarity,
                            reason: m.reason
                        })).filter((s: any) => s.id !== undefined);
                        setMatches(matchedShuttles);
                    } else {
                        setMatches(allShuttles.slice(0, 3));
                    }
                } catch (error) {
                    console.error(error);
                    setMatches(allShuttles.slice(0, 3));
                }
            } else {
                setMatches(allShuttles);
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
                                    <LocationDot size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" /> {shuttle.dest} ({shuttle.time})
                                </div>
                                <div className="flex items-center gap-4 text-sm font-black text-[#001233]">
                                    <Users size={16} className="text-gray-400" /> {shuttle.similarity || 'High Match'}
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
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold mb-2">No matches found.</h3>
                        <p className="text-gray-500">Try adjusting your preferences or starting your own shuttle.</p>
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
