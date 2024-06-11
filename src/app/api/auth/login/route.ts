import db from "@/lib/pocketbase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    const result = await db.login(email, password);

    const { record, token } = result;
    record.token = token;

    const authCookie = db.client.authStore.exportToCookie();

    const response = NextResponse.json(record);
    response.cookies.set("pb_auth", authCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
