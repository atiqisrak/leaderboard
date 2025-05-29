"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-[#23262b] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: [
                                Math.random() * window.innerWidth,
                                Math.random() * window.innerWidth,
                            ],
                            y: [
                                Math.random() * window.innerHeight,
                                Math.random() * window.innerHeight,
                            ],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>
            <Image src="/icons/android-icon-192x192.png" alt="Life at Ether" width={192} height={192} />
            {/* Main content */}
            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-3xl font-semibold text-white mb-6">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-[#b0b3b8] mb-8 max-w-md mx-auto">
                        The page you're looking for seems to have vanished into the digital
                        void. Let's get you back on track!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-primary text-secondary rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            animate={{ x: isHovered ? "100%" : "-100%" }}
                            transition={{ duration: 0.5 }}
                        />
                        <span className="relative z-10">Return Home</span>
                    </Link>
                </motion.div>
            </div>

            {/* Interactive cursor effect */}
            <motion.div
                className="fixed w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-50"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 200,
                    mass: 0.5,
                }}
            />
        </div>
    );
} 