import { NextResponse } from "next/server";
export async function PUT(){ return NextResponse.json({error:"Static mode"},{status:503}); }
export async function DELETE(){ return NextResponse.json({error:"Static mode"},{status:503}); }