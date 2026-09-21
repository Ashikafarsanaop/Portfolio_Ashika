import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await prisma.education.findMany({orderBy:[{endYear:"desc"},{startYear:"desc"}]}));
}

export async function POST(request) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.degree || !b.institution) return NextResponse.json({error:"Degree and institution are required"},{status:400});
  const education = await prisma.education.create({data:{
    degree:b.degree,
    institution:b.institution,
    fieldOfStudy:b.fieldOfStudy||null,
    startYear:b.startYear?Number(b.startYear):null,
    endYear:b.endYear?Number(b.endYear):null,
    description:b.description||null
  }});
  return NextResponse.json(education,{status:201});
}
