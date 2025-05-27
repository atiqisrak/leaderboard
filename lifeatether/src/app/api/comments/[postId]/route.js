import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/app/data");

export async function POST(request, { params }) {
  try {
    const { postId } = params;
    const { userId, content } = await request.json();

    // Read posts from JSON file
    const filePath = path.join(dataDirectory, "feed.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const posts = JSON.parse(fileContents);

    // Find the post
    const post = posts.find((p) => p.id === parseInt(postId));
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Add new comment
    const newComment = {
      id: Date.now().toString(),
      content,
      userId,
      createdAt: new Date().toISOString(),
    };

    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push(newComment);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true, comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
