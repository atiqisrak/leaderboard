import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const userCookie = cookies().get("user");
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    const user = JSON.parse(userCookie.value);
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
