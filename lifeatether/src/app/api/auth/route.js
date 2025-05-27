import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/app/data");

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Read users from JSON file
    const filePath = path.join(dataDirectory, "users.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(fileContents);

    // Find user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      // Set HTTP-only cookie
      const response = NextResponse.json(
        { success: true, user: userWithoutPassword },
        { status: 200 }
      );

      // Set cookie with user data
      response.cookies.set("user", JSON.stringify(userWithoutPassword), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Clear the user cookie
  response.cookies.delete("user");

  return response;
}
