import { NextResponse } from "next/server";
import { createToken, setAuthCookie } from "@/lib/auth";

// Static mode - no DB. Hardcoded admin for static demo.
// In production static, you should protect admin or remove it.
export async function POST(request) {
  const {email,password} = await request.json();
  // Static credentials: admin@example.com / admin123 (from previous DB)
  if (email !== "admin@example.com" || password !== "admin123") {
    return NextResponse.json({error:"Invalid credentials (static mode: use admin@example.com / admin123)"},{status:401});
  }
  const token = await createToken({sub:"1",email:"admin@example.com",username:"admin"});
  await setAuthCookie(token);
  return NextResponse.json({success:true});
}
