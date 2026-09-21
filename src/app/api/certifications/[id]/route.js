import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.name) return NextResponse.json({error:"Name is required"},{status:400});
  const certification = await prisma.certification.update({where:{id:Number(params.id)},data:{
    name:b.name,
    issuingOrganization:b.issuingOrganization||null,
    issueDate:b.issueDate?new Date(b.issueDate):null,
    credentialId:b.credentialId||null,
    credentialUrl:b.credentialUrl||null,
    certificateImage:b.certificateImage||null
  }});
  return NextResponse.json(certification);
}

export async function DELETE(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  await prisma.certification.delete({where:{id:Number(params.id)}});
  return NextResponse.json({success:true});
}
