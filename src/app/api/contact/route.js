import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let b;
    if (contentType.includes("application/json")) b = await request.json();
    else {
      const form = await request.formData();
      b = Object.fromEntries(form.entries());
    }

    const name = String(b.name || "").trim();
    const email = String(b.email || "").trim();
    const messageText = String(b.message || "").trim();
    const company = b.company ? String(b.company).trim() : "";
    const subject = b.subject ? String(b.subject).trim() : "";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !messageText) {
      return NextResponse.json({error:"Name, email and message are required"},{status:400});
    }
    if (name.length < 2) return NextResponse.json({error:"Name must be at least 2 characters"},{status:400});
    if (name.length > 80) return NextResponse.json({error:"Name must be under 80 characters"},{status:400});
    if (!emailRe.test(email)) return NextResponse.json({error:"Enter a valid email address"},{status:400});
    if (email.length > 120) return NextResponse.json({error:"Email is too long"},{status:400});
    if (messageText.length < 10) return NextResponse.json({error:"Message must be at least 10 characters"},{status:400});
    if (messageText.length > 2000) return NextResponse.json({error:"Message must be under 2000 characters"},{status:400});
    if (company.length > 100) return NextResponse.json({error:"Company must be under 100 characters"},{status:400});
    if (subject.length > 150) return NextResponse.json({error:"Subject must be under 150 characters"},{status:400});

    const message = await prisma.contactMessage.create({
      data:{
        name,
        email,
        company: company || null,
        subject: subject || null,
        message: messageText
      }
    });

    if (!contentType.includes("application/json")) {
      return new Response(
        "<h1>Message sent successfully</h1><p><a href='/'>Back to portfolio</a></p>",
        {headers:{"Content-Type":"text/html"}}
      );
    }
    return NextResponse.json(message,{status:201});
  } catch (error) {
    console.error("POST /api/contact failed:", error);
    return NextResponse.json(
      { error: "Failed to save message. Please try again later." },
      { status: 500 }
    );
  }
}