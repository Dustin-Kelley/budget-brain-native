import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, householdName, inviterName } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Skip actual email send in local dev
    if (!RESEND_API_KEY) {
      console.log(
        `[DEV] Would send invite email to ${email} for household "${householdName}" from ${inviterName}`
      );
      return new Response(JSON.stringify({ success: true, dev: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Budget Brain <noreply@budgetbrain.app>",
        to: [email],
        subject: `You've been invited to join ${householdName ?? "a household"} on Budget Brain`,
        html: `
          <h2>You've been invited!</h2>
          <p>${inviterName ?? "Someone"} has invited you to join <strong>${householdName ?? "their household"}</strong> on Budget Brain.</p>
          <p><a href="budgetbrainnative://invite">Open Budget Brain</a> to accept the invitation.</p>
          <p>If you don't have the app yet, download it first, then open this link.</p>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", body);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-invite-email error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
