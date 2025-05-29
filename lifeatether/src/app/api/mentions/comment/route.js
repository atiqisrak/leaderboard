import { NextResponse } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request) {
    try {
        const { comment_id, mentioned_user_id } = await request.json();
        const token = request.headers.get("authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(`${BASE_URL}/comment-mentions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ comment_id, mentioned_user_id }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { success: false, message: error.error || "Failed to create mention" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ success: true, mention: data });
    } catch (error) {
        console.error("Error creating comment mention:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create mention" },
            { status: 500 }
        );
    }
} 