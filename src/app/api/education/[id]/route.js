import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.degree || !b.institution) return NextResponse.json({error:"Degree and institution are required"},{status:400});
  const education = await prisma.education.update({where:{id:Number(params.id)},data:{
    degree:b.degree,
    institution:b.institution,
    fieldOfStudy:b.fieldOfStudy||null,
    startYear:b.startYear?Number(b.startYear):null,
    endYear:b.endYear?Number(b.endYear):null,
    description:b.description||null
  }});
  return NextResponse.json(education);
}

export async function DELETE(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  await prisma.education.delete({where:{id:Number(params.id)}});
  return NextResponse.json({success:true});
}
