import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/feeds`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch feeds" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      feeds: data,
    });
  } catch (error) {
    console.error("Fetch feeds error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { title, content } = await request.json();

    const response = await fetch(`${BASE_URL}/feeds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create feed" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        feed: {
          id: data.id,
          title: data.title,
          content: data.content,
          authorId: data.author_id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          author: data.author,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create feed error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
