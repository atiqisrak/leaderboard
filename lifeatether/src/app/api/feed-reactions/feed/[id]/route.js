import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request, { params }) {
  try {
    const response = await fetch(
      `${BASE_URL}/feed-reactions/feed/${params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch reactions",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        reactions: data,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Fetch reactions error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
