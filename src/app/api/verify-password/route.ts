import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { password } = await req.json();
    const valid = process.env.DASHBOARD_PASSWORD;
    if (password === valid) {
        return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
}
