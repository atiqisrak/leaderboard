import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request, { params }) {
  try {
    const response = await fetch(`${BASE_URL}/feeds/${params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch feed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      feed: data,
    });
  } catch (error) {
    console.error("Fetch feed error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { title, content } = await request.json();

    const response = await fetch(`${BASE_URL}/feeds/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update feed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      feed: data,
    });
  } catch (error) {
    console.error("Update feed error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
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

    const response = await fetch(`${BASE_URL}/feeds/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete feed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete feed error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
