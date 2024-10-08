import { NextResponse } from "next/server";

export default function GET() {
  return NextResponse.json({ message: "Hello from Next.js!" }, { status: 200 });
}
