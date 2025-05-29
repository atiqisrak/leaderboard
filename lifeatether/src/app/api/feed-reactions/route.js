import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request) {
  try {
    const userCookie = cookies().get("user");
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);
    const { feed_id, reaction_type } = await request.json();

    if (!feed_id || !reaction_type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate reaction type
    const validReactionTypes = ["like", "love", "haha", "wow", "angry", "sad"];
    if (!validReactionTypes.includes(reaction_type)) {
      return NextResponse.json(
        { success: false, message: "Invalid reaction type" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/feed-reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
      body: JSON.stringify({
        feed_id: parseInt(feed_id),
        reaction_type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to handle reaction",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      reaction: data,
    });
  } catch (error) {
    console.error("Handle reaction error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
