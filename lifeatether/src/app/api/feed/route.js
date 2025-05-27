import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/app/data");

export async function GET() {
  try {
    const filePath = path.join(dataDirectory, "feed.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    // Sort posts by createdAt in descending order (newest first)
    const sortedData = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return NextResponse.json(sortedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const filePath = path.join(dataDirectory, "feed.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    const newPost = await request.json();
    newPost.id = data.length + 1;
    newPost.createdAt = new Date().toISOString();
    newPost.reactions = [];
    newPost.comments = [];

    data.push(newPost);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
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
