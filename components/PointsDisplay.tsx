"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function PointsDisplay() {
    const [points, setPoints] = useState(150);

    useEffect(() => {
        // Initial check
        const storedUser = localStorage.getItem('matchy_user_v1');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData.points !== undefined) setPoints(userData.points);
            } catch (e) { console.error(e); }
        }

        // Listen for custom event for points update (if we add logic to script)
        const handlePointsUpdate = (event: any) => {
            setPoints(event.detail?.points || 150);
        };

        window.addEventListener('points-updated', handlePointsUpdate);
        return () => window.removeEventListener('points-updated', handlePointsUpdate);
    }, []);

    return (
        <div className="flex items-center gap-2 bg-[#f0f4f8] px-4 py-1.5 rounded-full font-bold text-[#001233] text-sm border border-[#001233] shadow-inner">
            <Star size={16} className="text-[#f4b400] fill-current" />
            <span>{points} pts</span>
        </div>
    );
}
