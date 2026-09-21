import { NextResponse } from "next/server";
import { staticPortfolio } from "@/lib/staticData";
export async function GET(){ return NextResponse.json(staticPortfolio.resume); }
export async function POST(){ return NextResponse.json({error:"Static mode - editing disabled"},{status:503}); }