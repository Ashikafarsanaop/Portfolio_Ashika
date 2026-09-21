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
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `Portfolio <${process.env.SMTP_USER}>`,
        to: TO_EMAIL,
        replyTo: `${name} <${email}>`,
        subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company||"-"}\nSubject: ${subject||"-"}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Company:</strong> ${company||"-"}</p><p><strong>Subject:</strong> ${subject||"-"}</p><hr/><p>${String(message).replace(/\n/g,"<br/>")}</p>`
      });
      return NextResponse.json({success:true, message:"Message sent to "+TO_EMAIL});
    }catch(err){
      console.error("SMTP send failed:", err.message);
      // fallback to success with mailto hint
      return NextResponse.json({success:true, message:"Message received (email failed, check SMTP). Please email directly to "+TO_EMAIL, fallbackMailto: `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject||`Portfolio message from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`});
    }
  }

  // No SMTP configured - client will try FormSubmit.co via browser (has Origin). Server fallback is mailto.
  // We skip server-side FormSubmit here (it lacks Origin and fails on localhost). Client-side ContactForm.jsx handles it.
  const mailto = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject||`Portfolio message from ${name}`)}&body=${encodeURIComponent(`Hi, I am ${name} (${email})${company?` from ${company}`:""}.\n\n${message}`)}`;
  return NextResponse.json({success:true, message:"Message sent to ashikafarsanaop@gmail.com — if this is the first message, check inbox for FormSubmit activation email and click Activate", mailto});
}
export async function GET(){ return NextResponse.json([]); }
