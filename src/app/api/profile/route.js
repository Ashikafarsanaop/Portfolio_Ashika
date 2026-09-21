import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await prisma.profile.findFirst());
}

export async function PUT(request) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.fullName) return NextResponse.json({error:"Full name is required"},{status:400});
  const data = {
    fullName:b.fullName,
    professionalTitle:b.professionalTitle||null,
    bio:b.bio||null,
    email:b.email||null,
    phone:b.phone||null,
    location:b.location||null,
    profileImage:b.profileImage||null,
    githubUrl:b.githubUrl||null,
    linkedinUrl:b.linkedinUrl||null,
    portfolioUrl:b.portfolioUrl||null
  };
  const existing = await prisma.profile.findFirst();
  if (existing) {
    return NextResponse.json(await prisma.profile.update({where:{id:existing.id},data}));
  }
  return NextResponse.json(await prisma.profile.create({data}),{status:201});
}
