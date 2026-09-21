import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await prisma.skill.findMany({orderBy:{name:"asc"}}));
}

export async function POST(request) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body = await request.json();
  if (!body.name) return NextResponse.json({error:"Name is required"},{status:400});
  const skill = await prisma.skill.create({data:{
    name: body.name,
    category: body.category || null,
    proficiency: body.proficiency ? Number(body.proficiency) : null,
    icon: body.icon || null
  }});
  return NextResponse.json(skill,{status:201});
}