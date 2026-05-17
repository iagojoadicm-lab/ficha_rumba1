const DEFAULT_RULES = [
  "Responder somente sobre o item selecionado.",
  "Nao inventar fatos que nao estejam no comentario atual ou no pedido do IN.",
  "Nao alterar outros campos da ficha.",
  "Gerar proposta curta, tecnica e objetiva quando houver instrucao suficiente.",
];

function ensureFinalPeriod(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function removeSnippet(text, snippet) {
  const cleanedSnippet = snippet.trim().replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, "");
  if (!cleanedSnippet) {
    return text;
  }

  return text.replace(cleanedSnippet, "").replace(/\s{2,}/g, " ").trim();
}

function applyLocalInstruction(currentText, userMessage) {
  const message = userMessage.trim();
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("mais objetivo") || normalized.includes("mais objetiva") || normalized.includes("resuma")) {
    return currentText
      .replace(/\bcorretamente\s+/gi, "")
      .replace(/\bmuito\s+/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  const replaceMatch = message.match(/(?:substitua|troque)\s+["\u201c]?(.+?)["\u201d]?\s+(?:por|para)\s+["\u201c]?(.+?)["\u201d]?\.?$/i);
  if (replaceMatch) {
    return currentText.replace(replaceMatch[1].trim(), replaceMatch[2].trim());
  }

  const removeMatch = message.match(/(?:remova|retire)\s+["\u201c]?(.+?)["\u201d]?\.?$/i);
  if (removeMatch) {
    return removeSnippet(currentText, removeMatch[1]);
  }

  const addMatch = message.match(/(?:adicione|acrescente|inclua)\s+["\u201c]?(.+?)["\u201d]?\.?$/i);
  if (addMatch) {
    const addition = ensureFinalPeriod(addMatch[1]);
    return [currentText.trim(), addition].filter(Boolean).join(" ");
  }

  return currentText;
}

async function callConfiguredEndpoint(payload) {
  const endpoint = window.FICHA_RUMBA_AI_ENDPOINT;
  if (!endpoint) {
    return null;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Falha na IA: ${response.status}`);
  }

  return response.json();
}

export async function generateItemAiReply({ fieldTitle, currentText, userMessage, messages }) {
  const payload = {
    fieldTitle,
    currentText,
    userMessage,
    messages,
    rules: DEFAULT_RULES,
  };

  const configuredReply = await callConfiguredEndpoint(payload);
  if (configuredReply) {
    return {
      content: configuredReply.reply ?? configuredReply.content ?? "Proposta recebida da IA.",
      proposedText: configuredReply.proposedText ?? configuredReply.proposal ?? currentText,
      source: "IA",
    };
  }

  const proposedText = applyLocalInstruction(currentText, userMessage);
  const changed = proposedText.trim() !== currentText.trim();

  return {
    content: changed
      ? `Claro. Sugestao:\n\n"${proposedText}"\n\nDeseja aplicar essa versao ao comentario atual?`
      : "Nao consegui gerar uma alteracao automatica com seguranca. Especifique algo como: substitua X por Y, remova X ou acrescente X.",
    proposedText,
    source: "Assistente local",
  };
}
