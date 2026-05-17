const officialFieldsFPB505 = [
  {
    id: "relatorioVoo",
    title: "RELATÓRIO DE VOO",
    keywords: ["relatorio de voo", "relatorio", "preenchimento", "registro do voo"],
  },
  {
    id: "inspecoesCheques",
    title: "INSPEÇÕES E CHEQUES",
    keywords: ["inspecao", "inspecoes", "cheque", "cheques", "checklist", "lista de verificacao"],
  },
  {
    id: "briefingDecolagem",
    title: "BRIEFING DE DECOLAGEM",
    keywords: ["briefing de decolagem", "briefing", "decolagem abortada", "pane na decolagem"],
  },
  {
    id: "partida",
    title: "PARTIDA",
    keywords: ["partida", "acionamento", "motor acionado", "acionou"],
  },
  {
    id: "taxi",
    title: "TÁXI",
    keywords: ["taxi", "taxiar", "taxiamento", "freio", "direcional no solo"],
  },
  {
    id: "decolagemCurta",
    title: "DECOLAGEM CURTA",
    keywords: ["decolagem curta", "pista curta", "decolou curto"],
  },
  {
    id: "nivelamento",
    title: "NIVELAMENTO",
    keywords: ["nivelamento", "nivelou", "nivelar", "manteve altitude", "altitude"],
  },
  {
    id: "trafegoNormal",
    title: "TRÁFEGO NORMAL",
    keywords: ["trafego normal", "perna do vento", "perna base", "final normal", "circuito normal"],
  },
  {
    id: "trafegoSemFlapes",
    title: "TRÁFEGO SEM FLAPES",
    keywords: ["trafego sem flap", "trafego sem flape", "sem flapes", "sem flap"],
  },
  {
    id: "trafegoMonomotorSimulado",
    title: "TRÁFEGO MONOMOTOR SIMULADO",
    keywords: ["trafego monomotor", "monomotor simulado", "monomotor", "motor critico", "motor inoperante"],
  },
  {
    id: "enquadramentoPista",
    title: "ENQUADRAMENTO DE PISTA",
    keywords: ["enquadramento", "enquadrou", "eixo da pista", "alinhamento da pista", "rampa"],
  },
  {
    id: "julgamentoFlapes",
    title: "JULGAMENTO DE FLAPES",
    keywords: ["julgamento de flapes", "julgamento de flap", "flapes", "flape"],
  },
  {
    id: "arremetidaArBimotor",
    title: "ARREMETIDA NO AR BIMOTOR",
    keywords: ["arremetida no ar bimotor", "arremeteu no ar bimotor", "arremetida bimotor"],
  },
  {
    id: "arremetidaArMonomotor",
    title: "ARREMETIDA NO AR MONOMOTOR",
    keywords: ["arremetida no ar monomotor", "arremeteu no ar monomotor", "arremetida monomotor"],
  },
  {
    id: "arremetidaSolo",
    title: "ARREMETIDA NO SOLO",
    keywords: ["arremetida no solo", "arremeteu no solo", "rejeicao de pouso"],
  },
  {
    id: "pousoNormal",
    title: "POUSO NORMAL",
    keywords: ["pouso normal", "pousou normal", "toque normal"],
  },
  {
    id: "pousoSemFlapes",
    title: "POUSO SEM FLAPES",
    keywords: ["pouso sem flap", "pouso sem flape", "pouso sem flapes"],
  },
  {
    id: "pousoMonomotorSimulado",
    title: "POUSO MONOMOTOR SIMULADO",
    keywords: ["pouso monomotor", "pouso monomotor simulado"],
  },
  {
    id: "pousoCurto",
    title: "POUSO CURTO",
    keywords: ["pouso curto", "pista curta no pouso"],
  },
  {
    id: "usoReverso",
    title: "USO DO REVERSO",
    keywords: ["reverso", "uso do reverso", "aplicou reverso"],
  },
  {
    id: "usoMotores",
    title: "USO DOS MOTORES",
    keywords: ["uso dos motores", "motores", "motor", "potencia", "manete"],
  },
  {
    id: "usoComandos",
    title: "USO DOS COMANDOS",
    keywords: ["uso dos comandos", "comandos", "profundor", "aileron", "leme", "comando"],
  },
  {
    id: "usoCompensadores",
    title: "USO DOS COMPENSADORES",
    keywords: ["compensador", "compensadores", "compensou", "trim"],
  },
  {
    id: "estacionamento",
    title: "ESTACIONAMENTO",
    keywords: ["estacionamento", "estacionou", "corte dos motores", "corte do motor", "parada final"],
  },
];

const confirmationField = {
  id: "necessitaConfirmacao",
  title: "NECESSITA CONFIRMAÇÃO DO IN",
  keywords: [],
  isConfirmation: true,
};

const missions = {
  "FPB5-05": {
    label: "FPB5-05",
    note: "Campos oficiais informados para a OI da FPB5-05.",
    fields: [...officialFieldsFPB505, confirmationField],
  },
};

// Esta base e somente exibida na interface. Ela nao entra no gerador da ficha.
const styleExamplesFPB505 = [
  {
    item: "Registro objetivo",
    text: "Procedimento bem realizado, mantendo a sequencia prevista.",
    note: "Frase curta, tecnica e limitada ao item observado.",
  },
  {
    item: "Orientacao do IN",
    text: "Orientado quanto ao ajuste de velocidade durante a execucao.",
    note: "Registra a orientacao sem acrescentar parametro nao citado.",
  },
  {
    item: "Correcao autonoma",
    text: "Corrigiu sozinho a tendencia observada apos orientacao.",
    note: "Usar somente se a transcricao indicar correcao autonoma.",
  },
  {
    item: "Quantidade citada",
    text: "Realizados dois procedimentos conforme orientacao.",
    note: "Numeros e parametros so devem aparecer quando citados no audio.",
  },
];

const state = {
  currentMission: "FPB5-05",
  gender: "male",
  fieldValues: {},
  fieldNotes: {},
};

const missionSelect = document.querySelector("#missionSelect");
const fieldList = document.querySelector("#fieldList");
const fieldEditors = document.querySelector("#fieldEditors");
const styleExamples = document.querySelector("#styleExamples");
const transcriptInput = document.querySelector("#transcriptInput");
const generateButton = document.querySelector("#generateButton");
const clearButton = document.querySelector("#clearButton");
const finalOutput = document.querySelector("#finalOutput");
const copyButton = document.querySelector("#copyButton");
const copyStatus = document.querySelector("#copyStatus");
const generationStatus = document.querySelector("#generationStatus");

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function splitSentences(text) {
  const normalizedBreaks = text.replace(/\n+/g, ". ");
  const matches = normalizedBreaks.match(/[^.!?]+[.!?]?/g) ?? [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function getGenderedWord(base) {
  const dictionary = {
    aluno: { male: "aluno", female: "aluna" },
    orientado: { male: "orientado", female: "orientada" },
    corrigido: { male: "corrigido", female: "corrigida" },
    adequado: { male: "adequado", female: "adequada" },
    sozinho: { male: "sozinho", female: "sozinha" },
  };

  return dictionary[base]?.[state.gender] ?? base;
}

function matchCase(base) {
  const replacement = getGenderedWord(base);
  return (match) => {
    if (match === match.toUpperCase()) {
      return replacement.toUpperCase();
    }
    if (match[0] === match[0].toUpperCase()) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
  };
}

function applyGenderAgreement(text) {
  if (!text) {
    return "";
  }

  let adjusted = text;
  adjusted = adjusted.replace(/\baluno\b/gi, matchCase("aluno"));
  adjusted = adjusted.replace(/\baluna\b/gi, matchCase("aluno"));
  adjusted = adjusted.replace(/\borientado\b/gi, matchCase("orientado"));
  adjusted = adjusted.replace(/\borientada\b/gi, matchCase("orientado"));
  adjusted = adjusted.replace(/\bcorrigido\b/gi, matchCase("corrigido"));
  adjusted = adjusted.replace(/\bcorrigida\b/gi, matchCase("corrigido"));
  adjusted = adjusted.replace(/\badequado\b/gi, matchCase("adequado"));
  adjusted = adjusted.replace(/\badequada\b/gi, matchCase("adequado"));
  adjusted = adjusted.replace(/\bsozinho\b/gi, matchCase("sozinho"));
  adjusted = adjusted.replace(/\bsozinha\b/gi, matchCase("sozinho"));
  return adjusted;
}

function formatLines(sentences, options = {}) {
  const uniqueSentences = [...new Set(sentences)];
  const lines = uniqueSentences.map((sentence) => {
    const text = options.applyGender ? applyGenderAgreement(sentence) : sentence;
    return `- ${text}`;
  });

  return lines.join("\n");
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordMatches(normalizedSentence, normalizedKeyword) {
  if (normalizedKeyword.includes(" ")) {
    return normalizedSentence.includes(normalizedKeyword);
  }

  const wordPattern = new RegExp(`\\b${escapeRegExp(normalizedKeyword)}\\b`);
  return wordPattern.test(normalizedSentence);
}

function createEmptyFieldValues() {
  const mission = missions[state.currentMission];
  const values = {};

  mission.fields.forEach((field) => {
    values[field.id] = {
      original: "",
      suggestion: "",
    };
  });

  return values;
}

function findMatchingFields(normalizedSentence) {
  const mission = missions[state.currentMission];
  const matches = mission.fields
    .filter((field) => !field.isConfirmation)
    .map((field) => {
      const matchedKeywords = field.keywords
        .map((keyword) => normalizeText(keyword))
        .filter((keyword) => keywordMatches(normalizedSentence, keyword));

      const score = matchedKeywords.reduce((longest, keyword) => Math.max(longest, keyword.length), 0);
      return { field, score };
    })
    .filter((match) => match.score > 0);

  if (matches.length <= 1) {
    return matches.map((match) => match.field);
  }

  const bestScore = Math.max(...matches.map((match) => match.score));
  return matches
    .filter((match) => match.score === bestScore)
    .map((match) => match.field);
}

function classifyTranscript(transcript) {
  const result = createEmptyFieldValues();
  const sentences = splitSentences(transcript);
  const buckets = {};

  missions[state.currentMission].fields.forEach((field) => {
    buckets[field.id] = [];
  });

  sentences.forEach((sentence) => {
    const normalizedSentence = normalizeText(sentence);
    const matches = findMatchingFields(normalizedSentence);

    if (matches.length === 1) {
      buckets[matches[0].id].push(sentence);
      return;
    }

    buckets[confirmationField.id].push(sentence);
  });

  Object.entries(buckets).forEach(([fieldId, matchedSentences]) => {
    result[fieldId] = {
      original: formatLines(matchedSentences),
      suggestion: formatLines(matchedSentences, { applyGender: true }),
    };
  });

  return result;
}

function getFieldValue(fieldId) {
  return state.fieldValues[fieldId] ?? { original: "", suggestion: "" };
}

function renderMissionFields() {
  const mission = missions[state.currentMission];
  fieldList.innerHTML = "";

  mission.fields.forEach((field) => {
    const item = document.createElement("li");
    item.textContent = field.title;
    fieldList.appendChild(item);
  });
}

function renderStyleExamples() {
  styleExamples.innerHTML = "";

  styleExamplesFPB505.forEach((example) => {
    const article = document.createElement("article");
    article.className = "style-example";

    const title = document.createElement("h3");
    title.textContent = example.item;

    const text = document.createElement("p");
    text.className = "example-text";
    text.textContent = example.text;

    const note = document.createElement("p");
    note.textContent = example.note;

    article.append(title, text, note);
    styleExamples.appendChild(article);
  });
}

function renderFieldEditors() {
  const mission = missions[state.currentMission];
  fieldEditors.innerHTML = "";

  mission.fields.forEach((field) => {
    const fieldValue = getFieldValue(field.id);
    const wrapper = document.createElement("article");
    wrapper.className = "field-editor";

    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = field.title;

    const status = document.createElement("span");
    status.className = "field-status";
    status.textContent = fieldValue.suggestion.trim() ? "preenchido" : "em branco";

    header.append(title, status);

    const originalLabel = document.createElement("label");
    originalLabel.setAttribute("for", `${field.id}-original`);
    originalLabel.textContent = "Trecho original detectado";

    const originalTextarea = document.createElement("textarea");
    originalTextarea.id = `${field.id}-original`;
    originalTextarea.className = "original-textarea";
    originalTextarea.value = fieldValue.original;
    originalTextarea.placeholder = "Nenhum trecho detectado para este campo.";
    originalTextarea.readOnly = true;

    const suggestionLabel = document.createElement("label");
    suggestionLabel.setAttribute("for", `${field.id}-suggestion`);
    suggestionLabel.textContent = "Sugestao editavel para a ficha";

    const suggestionTextarea = document.createElement("textarea");
    suggestionTextarea.id = `${field.id}-suggestion`;
    suggestionTextarea.value = fieldValue.suggestion;
    suggestionTextarea.placeholder = "Campo nao mencionado na transcricao.";
    suggestionTextarea.addEventListener("input", () => {
      state.fieldValues[field.id] = {
        ...getFieldValue(field.id),
        suggestion: suggestionTextarea.value,
      };
      updateFinalOutput();
      status.textContent = suggestionTextarea.value.trim() ? "preenchido" : "em branco";
    });

    const conversation = document.createElement("div");
    conversation.className = "conversation-box";

    const noteLabel = document.createElement("label");
    noteLabel.setAttribute("for", `${field.id}-note`);
    noteLabel.textContent = "Correcao/conversa deste item";

    const noteTextarea = document.createElement("textarea");
    noteTextarea.id = `${field.id}-note`;
    noteTextarea.value = state.fieldNotes[field.id] ?? "";
    noteTextarea.placeholder = "Anote aqui ajustes ou duvidas do IN para este item. Esta area nao altera outros campos.";
    noteTextarea.addEventListener("input", () => {
      state.fieldNotes[field.id] = noteTextarea.value;
    });

    conversation.append(noteLabel, noteTextarea);
    wrapper.append(header, originalLabel, originalTextarea, suggestionLabel, suggestionTextarea, conversation);
    fieldEditors.appendChild(wrapper);
  });
}

function updateFinalOutput() {
  const mission = missions[state.currentMission];
  const genderLabel = state.gender === "male" ? "Aluno" : "Aluna";
  const lines = [
    `Missao: ${mission.label}`,
    `Aluno/aluna: ${genderLabel}`,
    "",
    "Ficha inicial - revisar pelo IN",
  ];

  mission.fields.forEach((field) => {
    const value = getFieldValue(field.id).suggestion.trim();
    if (!value) {
      return;
    }

    lines.push("", field.title, value);
  });

  finalOutput.value = lines.join("\n");
}

function clearGeneratedFields() {
  const mission = missions[state.currentMission];
  state.fieldValues = createEmptyFieldValues();

  mission.fields.forEach((field) => {
    state.fieldNotes[field.id] = "";
  });

  generationStatus.textContent = "Campos limpos";
  renderFieldEditors();
  updateFinalOutput();
}

function generateInitialSheet() {
  const transcript = transcriptInput.value.trim();

  if (!transcript) {
    generationStatus.textContent = "Cole uma transcricao";
    clearGeneratedFields();
    return;
  }

  state.fieldValues = classifyTranscript(transcript);
  generationStatus.textContent = "Sugestao gerada";
  renderFieldEditors();
  updateFinalOutput();
}

async function copyFinalSheet() {
  copyStatus.textContent = "";

  try {
    await navigator.clipboard.writeText(finalOutput.value);
    copyStatus.textContent = "Ficha final copiada.";
  } catch (error) {
    finalOutput.select();
    document.execCommand("copy");
    copyStatus.textContent = "Ficha final copiada.";
  }
}

function syncGenderFromInput() {
  const checked = document.querySelector("input[name='studentGender']:checked");
  state.gender = checked?.value ?? "male";

  missions[state.currentMission].fields.forEach((field) => {
    const fieldValue = getFieldValue(field.id);
    state.fieldValues[field.id] = {
      original: fieldValue.original,
      suggestion: applyGenderAgreement(fieldValue.suggestion),
    };
  });

  renderFieldEditors();
  updateFinalOutput();
}

missionSelect.addEventListener("change", () => {
  state.currentMission = missionSelect.value;
  clearGeneratedFields();
  renderMissionFields();
});

document.querySelectorAll("input[name='studentGender']").forEach((input) => {
  input.addEventListener("change", syncGenderFromInput);
});

generateButton.addEventListener("click", generateInitialSheet);
clearButton.addEventListener("click", clearGeneratedFields);
copyButton.addEventListener("click", copyFinalSheet);

state.fieldValues = createEmptyFieldValues();
renderMissionFields();
renderStyleExamples();
renderFieldEditors();
updateFinalOutput();
