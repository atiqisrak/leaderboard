import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/app/data");

export async function POST(request, { params }) {
  try {
    const { postId } = params;
    const { type, userId } = await request.json();

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

    // Check if user already reacted
    const existingReactionIndex = post.reactions.findIndex(
      (r) => r.userId === userId
    );

    if (existingReactionIndex !== -1) {
      // If same reaction type, remove it (toggle)
      if (post.reactions[existingReactionIndex].type === type) {
        post.reactions.splice(existingReactionIndex, 1);
      } else {
        // If different reaction type, update it
        post.reactions[existingReactionIndex].type = type;
      }
    } else {
      // Add new reaction
      post.reactions.push({
        id: Date.now().toString(),
        type,
        userId,
        createdAt: new Date().toISOString(),
      });
    }

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true, reactions: post.reactions });
  } catch (error) {
    console.error("Error adding reaction:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
