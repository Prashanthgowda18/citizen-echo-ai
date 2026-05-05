import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type EmailPayload = {
  department: string;
  recipient: string;
  cc: string[];
  priority: "Critical" | "High" | "Medium";
  subject: string;
  body: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { emails, location } = await req.json() as { emails: EmailPayload[]; location: string };
    if (!Array.isArray(emails) || !emails.length) {
      return new Response(JSON.stringify({ error: "No email notifications provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const EMAIL_FROM = Deno.env.get("EMAIL_FROM") ?? "GovSense <notifications@govsense.gov>";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const results = [] as Array<{ recipient: string; ok: boolean; id?: string; error?: string }>;

    for (const email of emails) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [email.recipient],
          cc: email.cc,
          subject: email.subject,
          text: email.body,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        results.push({ recipient: email.recipient, ok: false, error: errorText });
        continue;
      }

      const payload = await response.json();
      results.push({ recipient: email.recipient, ok: true, id: payload.id });
    }

    return new Response(JSON.stringify({
      location,
      sent: results.filter((item) => item.ok).length,
      failed: results.filter((item) => !item.ok).length,
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-department-emails error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
