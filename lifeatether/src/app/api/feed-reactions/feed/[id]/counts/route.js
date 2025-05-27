import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request, { params }) {
  try {
    const response = await fetch(
      `${BASE_URL}/feed-reactions/feed/${params.id}/counts`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch reaction counts",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      counts: data,
    });
  } catch (error) {
    console.error("Fetch reaction counts error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
