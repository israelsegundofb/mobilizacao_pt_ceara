import nodemailer from "nodemailer";

/**
 * Interface simples para envio de e-mails da mobilização
 */
export async function sendNewsletterPostNotification(post: { title: string; excerpt: string; slug: string }, subscribers: string[]) {
  if (subscribers.length === 0) return;

  console.log(`[Newsletter] Iniciando disparo de e-mail para ${subscribers.length} contatos: "${post.title}"`);

  try {
    // Configuração SMTP - O usuário deve configurar estas variáveis no .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    const mailOptions = {
      from: `"Mobilização PT-CE" <${process.env.SMTP_FROM || "no-reply@mobilizacao.org"}>`,
      bcc: subscribers.join(", "),
      subject: `Nova Atualização: ${post.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #e11d48;">${post.title}</h2>
          <p>${post.excerpt}</p>
          <div style="margin: 20px 0;">
            <a href="${siteUrl}/noticia/${post.slug}" style="background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Leia a notícia completa</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Você recebeu este e-mail porque se inscreveu na newsletter de mobilização.</p>
        </div>
      `,
    };

    // Apenas envia se as credenciais estiverem configuradas
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("[Newsletter] E-mails enviados com sucesso!");
    } else {
      console.warn("[Newsletter] SMTP não configurado. E-mail simulado no log.");
      console.log("[Mock Email Content]:", mailOptions.subject);
    }
  } catch (error) {
    console.error("[Newsletter] Erro ao enviar e-mails:", error);
  }
}
