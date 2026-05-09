import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface MailPayload {
  name: string;
  email: string;
  phone?: string;
  surveyType: string;
  location: string;
  area?: string;
  message?: string;
}

function buildEmailBody(payload: MailPayload) {
  const { name, email, phone, surveyType, location, area, message } = payload;
  return `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2 style="color: #1f2937;">New Survey Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Survey Type:</strong> ${surveyType}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Area:</strong> ${area || "N/A"}</p>
      <p><strong>Notes:</strong></p>
      <p style="white-space: pre-wrap;">${message || "No additional notes."}</p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MailPayload;
    const { name, email, surveyType, location } = body;

    if (!name || !email || !surveyType || !location) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, survey type, and location." },
        { status: 400 }
      );
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const to = process.env.EMAIL_TO || process.env.EMAIL_USER;

    const defaultGmail = user?.endsWith("@gmail.com");
    const host = process.env.EMAIL_HOST || (defaultGmail ? "smtp.gmail.com" : undefined);
    const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : defaultGmail ? 465 : undefined;
    const secure = process.env.EMAIL_SECURE
      ? process.env.EMAIL_SECURE === "true"
      : defaultGmail;

    if (!host || !port || !user || !pass || !to) {
      return NextResponse.json(
        {
          error:
            "Email server is not fully configured. Please set EMAIL_USER, EMAIL_PASS, and optionally EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, and EMAIL_TO.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Tetra Tech Survey Request" <${user}>`,
      to,
      replyTo: email,
      subject: `Survey request: ${surveyType} from ${name}`,
      text: `Survey request from ${name} <${email}>\n\nPhone: ${body.phone || "Not provided"}\nSurvey Type: ${surveyType}\nLocation: ${location}\nArea: ${body.area || "N/A"}\n\nNotes:\n${body.message || "No additional notes."}`,
      html: buildEmailBody(body),
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("/api/contact error", error);
    return NextResponse.json(
      { error: "Unable to send your request right now. Please try again later." },
      { status: 500 }
    );
  }
}
