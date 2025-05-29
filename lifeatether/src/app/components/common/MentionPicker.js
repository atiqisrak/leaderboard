"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function MentionPicker({ onSelect, onClose }) {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const pickerRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetch("/api/users/all-names", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || "Failed to fetch users");
                }

                // Transform the data to include default avatar
                const usersWithAvatar = data.users.map(user => ({
                    ...user,
                    avatar: null // We'll use default avatar since server doesn't provide it
                }));
                setUsers(usersWithAvatar);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error.message || "Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            ref={pickerRef}
            className="absolute z-50 bg-[#23262b] border border-primary/20 rounded-lg shadow-lg w-64 max-h-64 overflow-y-auto"
        >
            <div className="p-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-3 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                />
            </div>
            {loading ? (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="px-4 py-2 text-red-500">{error}</div>
            ) : (
                <div className="py-1">
                    {filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => onSelect(user)}
                            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-primary/10 text-left"
                        >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src="/default-avatar.png"
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-white">{user.name}</span>
                        </button>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="px-4 py-2 text-[#b0b3b8]">No users found</div>
                    )}
                </div>
            )}
        </div>
    );
} 