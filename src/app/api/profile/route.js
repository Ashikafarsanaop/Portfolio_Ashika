import { NextResponse } from "next/server";
import { staticPortfolio } from "@/lib/staticData";
export async function GET(){ return NextResponse.json(staticPortfolio.profile); }
export async function POST(){ return NextResponse.json({error:"Static mode - editing disabled"},{status:503}); }
export async function PUT(){ return NextResponse.json({error:"Static mode - editing disabled"},{status:503}); }