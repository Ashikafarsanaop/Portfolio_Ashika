import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("all")) {
    if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
    return NextResponse.json(await prisma.resume.findMany({orderBy:{uploadedAt:"desc"}}));
  }
  return NextResponse.json(await prisma.resume.findFirst({where:{isActive:true},orderBy:{uploadedAt:"desc"}}));
}

export async function POST(request) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.fileUrl) return NextResponse.json({error:"File URL is required"},{status:400});
  const isActive = Boolean(b.isActive);
  if (isActive) await prisma.resume.updateMany({data:{isActive:false}});
  const resume = await prisma.resume.create({data:{
    fileName:b.fileName||null,
    fileUrl:b.fileUrl,
    isActive
  }});
  return NextResponse.json(resume,{status:201});
}
