import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body = await request.json();
  const skill = await prisma.skill.update({where:{id:Number(params.id)},data:{
    name: body.name, category: body.category || null,
    proficiency: body.proficiency ? Number(body.proficiency) : null,
    icon: body.icon || null
  }});
  return NextResponse.json(skill);
}

export async function DELETE(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  await prisma.skill.delete({where:{id:Number(params.id)}});
  return NextResponse.json({success:true});
}