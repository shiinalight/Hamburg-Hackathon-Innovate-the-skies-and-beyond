"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ArrowLeft, MapPin,
  PlaneTakeoff, Globe, Car, Users, User
} from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"home" | "setup">("home");
  const router = useRouter();

  const handleStartSetup = () => {
    setView("setup");
  };

  const handleGoHome = () => {
    setView("home");
  };

  const handleFindMatches = () => {
    // Collect prefs and store in local storage (sync with current db)
    const prefs = {
      dest: (document.getElementById('input-destination') as HTMLInputElement)?.value || 'Alexanderplatz',
      flight: (document.getElementById('input-flight') as HTMLInputElement)?.value || '',
      lang: (document.getElementById('select-language') as HTMLSelectElement)?.value || 'English',
      transport: (document.getElementById('select-transport') as HTMLSelectElement)?.value || 'Taxi',
      age: (document.getElementById('select-age') as HTMLSelectElement)?.value || '25-35',
      capacity: (document.getElementById('select-capacity') as HTMLSelectElement)?.value || '4'
    };

    localStorage.setItem('matchy_search_prefs', JSON.stringify(prefs));
    router.push("/shuttles");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full"
          >
            <div className="hero-section bg-white rounded-b-[40px] px-8 py-10 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-4xl leading-tight font-extrabold text-[#001233] mb-6 tracking-tight">
                  Hop on.<br />
                  <span className="text-blue-600">Roll together.</span>
                </h1>
                <div className="w-48 h-auto mx-auto relative group">
                  <Image
                    src="/logo.svg"
                    alt="Matchy Logo"
                    width={160}
                    height={160}
                    className="mx-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 -mr-20 -mt-20 opacity-60" />
            </div>

            <div className="px-8 py-10 flex flex-col flex-grow">
              <h2 className="text-xl font-bold mb-6 text-[#001233]">Why Shuttle?</h2>
              <div className="grid grid-cols-3 gap-4 flex-grow mb-12">
                {[
                  { title: "Save Money", desc: "Split fares up to 50%", icon: <Users className="text-blue-500" /> },
                  { title: "Eco-Friendly", desc: "Fewer cars, cleaner air", icon: <Globe size={20} className="text-green-500" /> },
                  { title: "Meet People", desc: "Make new buddies", icon: <User className="text-yellow-500" /> }
                ].map((f) => (
                  <div key={f.title} className="bg-white p-5 rounded-2xl text-center shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                      {f.icon}
                    </div>
                    <h3 className="text-sm font-bold mb-1 truncate">{f.title}</h3>
                    <p className="text-[10px] text-gray-500 leading-tight">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleStartSetup}
                  className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
                >
                  Create Shuttle Request <ChevronRight size={22} strokeWidth={3} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-white"
          >
            <div className="flex items-center px-6 py-8 border-b border-gray-100 bg-white sticky top-0 z-20">
              <button
                onClick={handleGoHome}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={24} className="text-[#001233]" />
              </button>
              <div className="flex-grow ml-4">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Step 1 of 2</span>
                  <span className="text-xs font-extrabold text-[#001233]">50%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-1/2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto px-8 py-8 space-y-10 pb-32">
              <section>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin size={12} className="text-blue-500" /> Origin: Hamburg Airport (HAM)
                </p>
                <h2 className="text-2xl font-black text-[#001233] mb-6">Where to?</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="text"
                      id="input-destination"
                      placeholder="Destination"
                      defaultValue="Alexanderplatz"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                    />
                  </div>
                  <div className="relative group">
                    <PlaneTakeoff className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="text"
                      id="input-flight"
                      placeholder="Flight No."
                      defaultValue="LH2024"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black text-[#001233] mb-6">Matching Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Language</label>
                    <div className="relative">
                      <select id="select-language" className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-white appearance-none outline-none focus:border-blue-500 font-semibold cursor-pointer">
                        <option>English</option>
                        <option>German</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Transport</label>
                    <div className="relative">
                      <select id="select-transport" className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-white appearance-none outline-none focus:border-blue-500 font-semibold cursor-pointer">
                        <option>Taxi</option>
                        <option>Ride-share</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Min. Seats</label>
                    <div className="relative">
                      <select id="select-capacity" defaultValue="4" className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-white appearance-none outline-none focus:border-blue-500 font-semibold cursor-pointer">
                        <option value="2">2 People</option>
                        <option value="4">4 People</option>
                        <option value="6">6 People</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Age Preference</label>
                    <div className="relative">
                      <select id="select-age" defaultValue="25-35" className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-white appearance-none outline-none focus:border-blue-500 font-semibold cursor-pointer">
                        <option>No Pref</option>
                        <option>25-35</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              </section>

            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-[1200px] mx-auto p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-30">
              <button
                onClick={handleFindMatches}
                className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Find Matching Shuttles Now
              </button>
              <p className="text-[10px] text-center text-gray-400 font-medium mt-3 uppercase tracking-widest">Powered by Gemini AI Engine</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
