import { NextResponse } from "next/server";
export async function POST(){ return NextResponse.json({error:"Static mode - upload disabled. Use external URL in staticData.js"},{status:503}); }