import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    console.log("Registration request:", { name, email, role });

    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();
    console.log("Registration response:", data);

    if (!response.ok) {
      console.error("Registration failed:", data);
      return NextResponse.json(
        { success: false, message: data.message || "Registration failed" },
        { status: response.status }
      );
    }

    // After successful registration, get the token by logging in
    console.log("Attempting login after registration");
    const loginResponse = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();
    console.log("Login response:", loginData);

    if (!loginResponse.ok) {
      console.error("Login after registration failed:", loginData);
      return NextResponse.json(
        { success: false, message: "Registration successful but login failed" },
        { status: 500 }
      );
    }

    // Combine user data with token
    const userData = {
      ...data.user,
      access_token: loginData.token,
    };

    console.log("Final user data:", { ...userData, password: "[REDACTED]" });

    // Store user data in a cookie
    cookies().set("user", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Registration error details:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
