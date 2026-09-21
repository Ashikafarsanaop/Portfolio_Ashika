import { NextResponse } from "next/server";
import { staticPortfolio } from "@/lib/staticData";
export async function GET(){ return NextResponse.json(staticPortfolio.certifications); }
export async function POST(){ return NextResponse.json({error:"Static mode - editing disabled. Update src/lib/staticData.js directly."},{status:503}); }