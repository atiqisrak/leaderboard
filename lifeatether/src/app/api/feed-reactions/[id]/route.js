import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function PUT(request, { params }) {
  try {
    const userCookie = cookies().get("user");
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);
    const { id } = params;
    const { reaction_type } = await request.json();

    if (!reaction_type) {
      return NextResponse.json(
        { success: false, message: "Reaction type is required" },
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

    const response = await fetch(`${BASE_URL}/feed-reactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
      body: JSON.stringify({
        feed_id: parseInt(id),
        reaction_type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update reaction",
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
    console.error("Update reaction error:", error);
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

export async function DELETE(request, { params }) {
  try {
    const userCookie = cookies().get("user");
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);
    const { id } = params;

    const response = await fetch(`${BASE_URL}/feed-reactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to remove reaction",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove reaction error:", error);
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
