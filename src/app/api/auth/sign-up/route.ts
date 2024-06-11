import db from "@/lib/pocketbase";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    const result = await db.register(email, password);

    return NextResponse.json(result);
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
