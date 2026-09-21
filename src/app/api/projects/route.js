import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const projects = await prisma.project.findMany({
    include:{technologies:{include:{technology:true}}},
    orderBy:{createdAt:"desc"}
  });
  return NextResponse.json(projects);
}

export async function POST(request) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.title) return NextResponse.json({error:"Title is required"},{status:400});
  const ids = Array.isArray(b.technologyIds) ? b.technologyIds.map(Number).filter(n=>!isNaN(n)) : [];
  const project = await prisma.project.create({data:{
    title:b.title, shortDescription:b.shortDescription||null,
    description:b.description||null, imageUrl:b.imageUrl||null,
    githubUrl:b.githubUrl||null, liveUrl:b.liveUrl||null,
    category:b.category||null, featured:Boolean(b.featured),
    technologies:{create:ids.map(id=>({technologyId:id}))}
  }});
  return NextResponse.json(project,{status:201});
}