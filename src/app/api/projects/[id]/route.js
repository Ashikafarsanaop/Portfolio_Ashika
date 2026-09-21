import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b=await request.json();
  if (!b.title) return NextResponse.json({error:"Title is required"},{status:400});
  const ids = Array.isArray(b.technologyIds) ? b.technologyIds.map(Number).filter(n=>!isNaN(n)) : null;
  const data={
    title:b.title, shortDescription:b.shortDescription||null, description:b.description||null,
    imageUrl:b.imageUrl||null, githubUrl:b.githubUrl||null, liveUrl:b.liveUrl||null,
    category:b.category||null, featured:Boolean(b.featured)
  };
  if (ids) data.technologies={deleteMany:{},create:ids.map(id=>({technologyId:id}))};
  const project=await prisma.project.update({where:{id:Number(params.id)},data});
  return NextResponse.json(project);
}

export async function DELETE(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  await prisma.project.delete({where:{id:Number(params.id)}});
  return NextResponse.json({success:true});
}
