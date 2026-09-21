import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.fileUrl) return NextResponse.json({error:"File URL is required"},{status:400});
  const id = Number(params.id);
  const isActive = Boolean(b.isActive);
  if (isActive) await prisma.resume.updateMany({where:{id:{not:id}},data:{isActive:false}});
  const resume = await prisma.resume.update({where:{id},data:{
    fileName:b.fileName||null,
    fileUrl:b.fileUrl,
    isActive
  }});
  return NextResponse.json(resume);
}

export async function DELETE(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  await prisma.resume.delete({where:{id:Number(params.id)}});
  return NextResponse.json({success:true});
}
