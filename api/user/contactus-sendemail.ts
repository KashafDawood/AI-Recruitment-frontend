"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormState = {
  success: boolean;
  error: string | null;
  errors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
};

export async function sendContactEmail(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    // Extract form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Validate form data
    const result = contactFormSchema.safeParse({
      name,
      email,
      subject,
      message,
    });

    if (!result.success) {
      // Format the validation errors
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });

      return {
        success: false,
        error: "Please fix the errors in the form.",
        errors: formattedErrors,
      };
    }

    // Setup nodemailer transporter
    // For production, use your actual SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "your-email@example.com",
        pass: process.env.SMTP_PASSWORD || "your-password",
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.MAIL_FROM || "contact@airecruitment.com",
      to: process.env.MAIL_TO || "support@airecruitment.com",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Send email
    // In development, you might want to just log the email instead of actually sending it
    if (process.env.NODE_ENV === "development") {
      console.log("Email would be sent:", mailOptions);
    } else {
      await transporter.sendMail(mailOptions);
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return {
      success: false,
      error: "Failed to send your message. Please try again later.",
    };
  }
}
