import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const TO_EMAIL = "ashikafarsanaop@gmail.com";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  if (!user || !pass || String(pass).includes("replace_with")) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(request){
  const body = await request.json().catch(()=>({}));
  const { name, email, company, subject, message } = body;
  if(!name || !email || !message){
    return NextResponse.json({error:"Name, email and message are required"},{status:400});
  }
  console.log("Contact message to", TO_EMAIL, ":", body);

  const transporter = getTransporter();
  if(transporter){
    try{
      const humanText = `Hi Ashika,\n\nYou received a new portfolio inquiry:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company||"Not provided"}\nSubject: ${subject||"No subject"}\n\nMessage:\n${message}\n\n---\nReply directly to ${email} to respond.`;
      const humanHtml = `<div style="font-family:Geist,Arial,sans-serif; color:#1f2937; line-height:1.6; max-width:600px;"><h2 style="margin:0 0 12px; color:#111827;">New Portfolio Message</h2><p>Hi Ashika,</p><p>You received a new inquiry via your portfolio:</p><table style="border-collapse:collapse; width:100%; margin:12px 0;"><tr><td style="padding:6px 10px; font-weight:600; background:#f3f4f6; width:90px;">Name</td><td style="padding:6px 10px; border:1px solid #e5e7eb;">${name}</td></tr><tr><td style="padding:6px 10px; font-weight:600; background:#f3f4f6;">Email</td><td style="padding:6px 10px; border:1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td></tr><tr><td style="padding:6px 10px; font-weight:600; background:#f3f4f6;">Company</td><td style="padding:6px 10px; border:1px solid #e5e7eb;">${company||"Not provided"}</td></tr><tr><td style="padding:6px 10px; font-weight:600; background:#f3f4f6;">Subject</td><td style="padding:6px 10px; border:1px solid #e5e7eb;">${subject||"No subject"}</td></tr></table><div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:14px; white-space:pre-wrap; margin:12px 0;">${String(message).replace(/\n/g,"<br/>")}</div><p style="color:#6b7280; font-size:.88rem;">Reply directly to <a href="mailto:${email}">${email}</a></p></div>`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `Portfolio <${process.env.SMTP_USER}>`,
        to: TO_EMAIL,
        replyTo: `${name} <${email}>`,
        subject: subject ? `[Portfolio] ${subject} — from ${name}` : `[Portfolio] New message from ${name}`,
        text: humanText,
        html: humanHtml
      });
      return NextResponse.json({success:true, message:"Message sent to "+TO_EMAIL});
    }catch(err){
      console.error("SMTP send failed:", err.message);
      return NextResponse.json({success:true, message:"Message received (email failed, check SMTP). Please email directly to "+TO_EMAIL, fallbackMailto: `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject||`Portfolio message from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`});
    }
  }

  // No SMTP configured - client will try FormSubmit.co via browser (has Origin). Server fallback is mailto.
  // We skip server-side FormSubmit here (it lacks Origin and fails on localhost). Client-side ContactForm.jsx handles it.
  const mailto = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject||`Portfolio message from ${name}`)}&body=${encodeURIComponent(`Hi, I am ${name} (${email})${company?` from ${company}`:""}.\n\n${message}`)}`;
  return NextResponse.json({success:true, message:"Message sent to ashikafarsanaop@gmail.com — if this is the first message, check inbox for FormSubmit activation email and click Activate", mailto});
}
export async function GET(){ return NextResponse.json([]); }
