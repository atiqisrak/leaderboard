import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/app/data");

// Ensure data directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

export async function GET() {
  try {
    const filePath = path.join(dataDirectory, "feed.json");

    // Create file if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    // sort by createdAt
    const sortedPosts = JSON.parse(fileContents).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error("Error reading feed:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const post = await request.json();
    const filePath = path.join(dataDirectory, "feed.json");

    // Create file if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const posts = JSON.parse(fileContents);

    const newPost = {
      id: Date.now().toString(),
      ...post,
      createdAt: new Date().toISOString(),
      reactions: [],
      comments: [],
    };

    posts.unshift(newPost);
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const filePath = path.join(dataDirectory, "feed.json");
    const body = await request.json();
    const { id, ...update } = body;

    const fileContents = fs.readFileSync(filePath, "utf8");
    let data = JSON.parse(fileContents);

    data = data.map((post) => (post.id === id ? { ...post, ...update } : post));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const filePath = path.join(dataDirectory, "feed.json");
    const { id } = await request.json();

    const fileContents = fs.readFileSync(filePath, "utf8");
    let data = JSON.parse(fileContents);

    data = data.filter((post) => post.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
