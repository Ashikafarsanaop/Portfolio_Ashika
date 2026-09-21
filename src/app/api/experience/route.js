import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await prisma.experience.findMany({orderBy:{startDate:"desc"}}));
}

export async function POST(request) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.jobTitle) return NextResponse.json({error:"Job title is required"},{status:400});
  const experience = await prisma.experience.create({data:{
    jobTitle:b.jobTitle,
    company:b.company||null,
    employmentType:b.employmentType||null,
    startDate:b.startDate?new Date(b.startDate):null,
    endDate:b.currentlyWorking||!b.endDate?null:new Date(b.endDate),
    currentlyWorking:Boolean(b.currentlyWorking),
    description:b.description||null,
    imageUrl:b.imageUrl||null
  }});
  return NextResponse.json(experience,{status:201});
}
