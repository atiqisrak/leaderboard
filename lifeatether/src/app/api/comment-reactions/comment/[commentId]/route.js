import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request, { params }) {
  try {
    const { commentId } = params;
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Fetching reactions for comment:", commentId);
    console.log(
      "API URL:",
      `${API_URL}/comment-reactions/comment/${commentId}`
    );

    const response = await fetch(
      `${API_URL}/comment-reactions/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch reactions",
        },
        { status: response.status }
      );
    }

    // If the backend returns an array directly, wrap it in the expected format
    const reactions = Array.isArray(data) ? data : data.reactions || [];

    return NextResponse.json({
      success: true,
      reactions: reactions,
    });
  } catch (error) {
    console.error("Error fetching comment reactions:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
