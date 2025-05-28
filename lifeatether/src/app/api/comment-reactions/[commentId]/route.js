import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request, { params }) {
  try {
    const { commentId } = params;
    const token = request.headers.get("authorization")?.split(" ")[1];
    const { reaction_type } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!reaction_type) {
      return NextResponse.json(
        { success: false, message: "Reaction type is required" },
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
        comment_id: parseInt(commentId),
        reaction_type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to add reaction",
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
    console.error("Error adding comment reaction:", error);
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
    const { commentId } = params;
    const token = request.headers.get("authorization")?.split(" ")[1];
    const { reaction_type } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!reaction_type) {
      return NextResponse.json(
        { success: false, message: "Reaction type is required" },
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

    console.log(`Deleting reaction ${reaction_type} for comment ${commentId}`);
    const response = await fetch(
      `${BASE_URL}/comment-reactions/${commentId}/${reaction_type}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.error("Backend error:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to remove reaction",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reaction removed successfully",
    });
  } catch (error) {
    console.error("Error removing comment reaction:", error);
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

export async function PUT(request, { params }) {
  try {
    const { commentId } = params;
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reaction_type } = body;

    if (!reaction_type) {
      return NextResponse.json(
        { success: false, message: "Reaction type is required" },
        { status: 400 }
      );
    }

    const validTypes = ["like", "love", "haha", "wow", "angry"];
    if (!validTypes.includes(reaction_type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid reaction type. Must be one of: like, love, haha, wow, angry",
        },
        { status: 400 }
      );
    }

    console.log("Updating reaction for comment:", commentId);
    console.log("API URL:", `${BASE_URL}/comment-reactions/${commentId}`);

    const response = await fetch(`${BASE_URL}/comment-reactions/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reaction_type,
      }),
    });

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update reaction",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      reaction: data,
    });
  } catch (error) {
    console.error("Error updating reaction:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
