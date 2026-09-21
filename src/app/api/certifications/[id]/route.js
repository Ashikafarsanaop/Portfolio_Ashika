import { NextResponse } from "next/server";
export async function PUT(){ return NextResponse.json({error:"Static mode - editing disabled"},{status:503}); }
export async function DELETE(){ return NextResponse.json({error:"Static mode - editing disabled"},{status:503}); }
export async function GET(){ return NextResponse.json({error:"Not found in static mode"},{status:404}); }