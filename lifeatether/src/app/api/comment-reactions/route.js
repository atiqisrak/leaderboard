import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const { comment_id, reaction_type } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!comment_id || !reaction_type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate reaction type
    const validReactionTypes = ["like", "love", "haha", "wow", "angry"];
    if (!validReactionTypes.includes(reaction_type)) {
      return NextResponse.json(
        { success: false, message: "Invalid reaction type" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/comment-reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comment_id: parseInt(comment_id),
        reaction_type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to create reaction",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating comment reaction:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
