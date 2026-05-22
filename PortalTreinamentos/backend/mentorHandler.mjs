export const handleMentorRequest = async ({ req, res, parseBody, sendJson }) => {
  try {
    const body = await parseBody(req) ?? {};
    const question = String(body?.question ?? '').trim();
    const lessonContent = String(body?.lessonContent ?? '').trim();
    const history = Array.isArray(body?.history) ? body.history : [];
    const apiKey = process.env.GROQ_API_KEY;

    if (!question) {
      sendJson(res, 400, {
        ok: false,
        error: 'Informe uma pergunta para o mentor.',
      });
      return;
    }

    if (!apiKey) {
      sendJson(res, 200, {
        ok: true,
        response: "Olá! Sou o seu mentor de estudos da BBDI. Atualmente a chave de API do Groq não está configurada no servidor, então estou respondendo de forma simulada. Que excelente dúvida você tem! O conteúdo desta aula detalha processos fundamentais e de alto valor prático para o seu departamento. Lembre-se de revisar os pontos principais e realizar o quiz ao final!",
      });
      return;
    }

    const apiUrl = process.env.GROQ_CHAT_URL ?? 'https://api.groq.com/openai/v1/chat/completions';
    const model = process.env.GROQ_TRAINING_MODEL ?? 'llama-3.3-70b-versatile';

    const messages = [
      {
        role: 'system',
        content: `Você é um mentor e assistente de estudos altamente didático para um portal de treinamentos corporativos da BBDI.
O aluno está lendo a seguinte aula:
---
${lessonContent || 'Sem conteúdo disponível no momento.'}
---
Responda de forma extremamente clara, amigável, incentivadora e profissional às dúvidas do aluno sobre esta aula ou tópicos técnicos relacionados. Responda em português de forma concisa e direta, usando formatação Markdown amigável.`,
      },
    ];

    messages.push(
      ...history.slice(-6).map((message) => ({
        role: message?.role === 'assistant' ? 'assistant' : 'user',
        content: String(message?.content ?? '').trim(),
      })).filter((message) => message.content),
    );
    messages.push({ role: 'user', content: question });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const payloadText = await response.text();
    let payload = {};
    try {
      payload = payloadText ? JSON.parse(payloadText) : {};
    } catch {
      payload = {};
    }

    if (!response.ok) {
      const apiError = payload?.error?.message || payload?.error || payloadText || 'Falha ao consultar o modelo de IA.';
      throw new Error(apiError);
    }

    const text = payload?.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua dúvida agora.';
    sendJson(res, 200, { ok: true, response: text });
  } catch (err) {
    sendJson(res, 500, { ok: false, error: err.message });
  }
};
