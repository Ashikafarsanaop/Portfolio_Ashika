import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  const {email,password} = await request.json();
  const admin = await prisma.adminUser.findUnique({where:{email}});
  if (!admin || !(await bcrypt.compare(password,admin.passwordHash))) {
    return NextResponse.json({error:"Invalid credentials"},{status:401});
  }
  const token = await createToken({sub:String(admin.id),email:admin.email,username:admin.username});
  await setAuthCookie(token);
  return NextResponse.json({success:true});
}