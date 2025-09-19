import { NextRequest, NextResponse } from "next/server";

export type NextHandler = () => Promise<NextResponse> | NextResponse;
export type Middleware = (req: NextRequest, ctx: Record<string, unknown>, next: NextHandler) => Promise<NextResponse> | NextResponse;