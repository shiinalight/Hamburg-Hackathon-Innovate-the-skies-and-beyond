"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shuttle, Users, MessageCircle, User, Star, Bell } from "lucide-react";
import PointsDisplay from "./PointsDisplay";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", path: "/", icon: <Shuttle size={20} /> },
        { name: "Shuttles", path: "/shuttles", icon: <Users size={20} /> },
        { name: "My Ride", path: "/manage", icon: <Shuttle size={20} className="rotate-90" /> },
        { name: "Messages", path: "/messages", icon: <MessageCircle size={20} />, badge: 2 },
        { name: "Profile", path: "/profile", icon: <User size={20} /> },
    ];

    const hideLogoOn = ["/shuttles", "/manage"];
    const shouldHideLogo = hideLogoOn.includes(pathname);

    return (
        <nav className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-200 z-20 sticky top-0 w-full shadow-sm">
            <div className={`flex items-center gap-2 font-bold text-2xl text-[#001233] transition-opacity duration-300 ${shouldHideLogo ? "opacity-0 invisible" : "opacity-100"}`}>
                <Shuttle className="text-blue-500 fill-current" />
                <span>Matchy</span>
            </div>

            <div className="flex gap-8 items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center gap-2 font-semibold text-base transition-colors relative ${isActive ? "text-[#001233]" : "text-gray-500 hover:text-[#001233]"
                                }`}
                        >
                            {item.icon}
                            <span className="hidden sm:inline">{item.name}</span>
                            {item.badge && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-1 -right-4">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                <PointsDisplay />
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
                    <Bell size={22} className="text-gray-600" />
                </button>
            </div>
        </nav>
    );
}
