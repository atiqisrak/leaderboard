import { NextResponse } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
    try {
        const response = await fetch(`${BASE_URL}/users/all-names`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const users = await response.json();

        return NextResponse.json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch users",
            },
            { status: 500 }
        );
    }
} 