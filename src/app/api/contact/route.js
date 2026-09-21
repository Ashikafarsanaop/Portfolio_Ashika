import { NextResponse } from "next/server";
export async function POST(request){
  const body=await request.json().catch(()=>({}));
  console.log("Static contact message (not saved to DB):", body);
  return NextResponse.json({success:true, message:"Message received (static mode - not saved to DB)"});
}
export async function GET(){ return NextResponse.json([]); }