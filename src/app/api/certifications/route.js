import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

function parseCertification(b) {
  return {
    name: b.name,
    issuingOrganization: b.issuingOrganization || null,
    issueDate: b.issueDate ? new Date(b.issueDate) : null,
    credentialId: b.credentialId || null,
    credentialUrl: b.credentialUrl || null,
    certificateImage: b.certificateImage || null
  };
}

export async function GET() {
  return NextResponse.json(await prisma.certification.findMany({orderBy:{issueDate:"desc"}}));
}

export async function POST(request) {
  if (!await getCurrentAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await request.json();
  if (!b.name) return NextResponse.json({error:"Name is required"},{status:400});
  const certification = await prisma.certification.create({data:parseCertification(b)});
  return NextResponse.json(certification,{status:201});
}
