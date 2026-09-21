import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PATCH(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!["read","unread"].includes(b.status)) return NextResponse.json({error:"Invalid status"},{status:400});
  const message = await prisma.contactMessage.update({where:{id:Number(params.id)},data:{status:b.status}});
  return NextResponse.json(message);
}

export async function DELETE(request,{params}) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  await prisma.contactMessage.delete({where:{id:Number(params.id)}});
  return NextResponse.json({success:true});
}
