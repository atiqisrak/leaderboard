import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/app/data");

export async function GET() {
  try {
    const filePath = path.join(dataDirectory, "reaction.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const filePath = path.join(dataDirectory, "reaction.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    const newReaction = await request.json();
    newReaction.id = data.length + 1;

    data.push(newReaction);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    return NextResponse.json(newReaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create reaction" },
      { status: 500 }
    );
  }
}
