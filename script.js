import { missions } from "./data/missions/index.js";
import { styleExamplesByMission } from "./data/style-examples/index.js";

const state = {
  currentMission: "FPB5-05",
  gender: "male",
  fieldValues: {},
  fieldNotes: {},
  unclassifiedBlocks: [],
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
const unclassifiedOutput = document.querySelector("#unclassifiedOutput");

function renderMissionOptions() {
  missionSelect.innerHTML = "";

  Object.values(missions).forEach((mission) => {
    const option = document.createElement("option");
    option.value = mission.id;
    option.textContent = mission.name ?? mission.id;
    missionSelect.appendChild(option);
  });

  missionSelect.value = state.currentMission;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function splitIntoBlocks(text) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const paragraphBlocks = normalized
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphBlocks.length > 1) {
    return paragraphBlocks;
  }

  const sentenceBlocks = normalized.match(/[^.!?]+[.!?]?/g) ?? [];
  return sentenceBlocks.map((block) => block.trim()).filter(Boolean);
}

function formatBlocks(blocks) {
  return blocks.join("\n\n");
}

function trimLooseQuotes(text) {
  return text
    .replace(/^[\s"'“”‘’]+/, "")
    .replace(/[\s"'“”‘’]+$/, "");
}

function formatSuggestionBlocks(blocks) {
  return formatBlocks(blocks.map((block) => trimLooseQuotes(block)));
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function markerMatches(normalizedBlock, normalizedMarker) {
  if (normalizedMarker.includes(" ")) {
    return normalizedBlock.includes(normalizedMarker);
  }

  const wordPattern = new RegExp(`\\b${escapeRegExp(normalizedMarker)}\\b`);
  return wordPattern.test(normalizedBlock);
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

function detectFieldMarker(block) {
  const mission = missions[state.currentMission];
  const normalizedBlock = normalizeText(block);
  const matches = mission.fields
    .map((field) => {
      const matchedMarkers = (field.markers ?? [])
        .map((marker) => normalizeText(marker))
        .filter((marker) => markerMatches(normalizedBlock, marker));

      const score = matchedMarkers.reduce((longest, marker) => Math.max(longest, marker.length), 0);
      return { field, score };
    })
    .filter((match) => match.score > 0);

  if (!matches.length) {
    return null;
  }

  const bestScore = Math.max(...matches.map((match) => match.score));
  const bestMatches = matches.filter((match) => match.score === bestScore);
  return bestMatches.length === 1 ? bestMatches[0].field : null;
}

function classifyTranscript(transcript) {
  const result = createEmptyFieldValues();
  const blocks = splitIntoBlocks(transcript);
  const buckets = {};
  const unclassifiedBlocks = [];
  let activeFieldId = null;

  missions[state.currentMission].fields.forEach((field) => {
    buckets[field.id] = [];
  });

  blocks.forEach((block) => {
    const detectedField = detectFieldMarker(block);

    if (detectedField) {
      activeFieldId = detectedField.id;
    }

    if (activeFieldId) {
      buckets[activeFieldId].push(block);
      return;
    }

    unclassifiedBlocks.push(block);
  });

  Object.entries(buckets).forEach(([fieldId, matchedBlocks]) => {
    result[fieldId] = {
      original: formatBlocks(matchedBlocks),
      suggestion: formatSuggestionBlocks(matchedBlocks),
    };
  });

  return {
    fieldValues: result,
    unclassifiedBlocks,
  };
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
  const styleReference = styleExamplesByMission[state.currentMission];

  if (!styleReference) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = "Nenhuma referencia de estilo cadastrada para esta missao.";
    styleExamples.appendChild(empty);
    return;
  }

  styleReference.examples.forEach((example) => {
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

function renderUnclassifiedBlocks() {
  if (!unclassifiedOutput) {
    return;
  }

  unclassifiedOutput.value = state.unclassifiedBlocks.length
    ? formatBlocks(state.unclassifiedBlocks)
    : "Nenhum trecho fora de contexto foi detectado.";
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
    `Missao: ${mission.label ?? mission.id}`,
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
  state.unclassifiedBlocks = [];

  mission.fields.forEach((field) => {
    state.fieldNotes[field.id] = "";
  });

  generationStatus.textContent = "Campos limpos";
  renderFieldEditors();
  renderUnclassifiedBlocks();
  updateFinalOutput();
}

function generateInitialSheet() {
  const transcript = transcriptInput.value.trim();

  if (!transcript) {
    generationStatus.textContent = "Cole uma transcricao";
    clearGeneratedFields();
    return;
  }

  const classification = classifyTranscript(transcript);
  state.fieldValues = classification.fieldValues;
  state.unclassifiedBlocks = classification.unclassifiedBlocks;
  generationStatus.textContent = "Sugestao gerada";
  renderFieldEditors();
  renderUnclassifiedBlocks();
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

  renderFieldEditors();
  updateFinalOutput();
}

missionSelect.addEventListener("change", () => {
  state.currentMission = missionSelect.value;
  clearGeneratedFields();
  renderMissionFields();
  renderStyleExamples();
});

document.querySelectorAll("input[name='studentGender']").forEach((input) => {
  input.addEventListener("change", syncGenderFromInput);
});

generateButton.addEventListener("click", generateInitialSheet);
clearButton.addEventListener("click", clearGeneratedFields);
copyButton.addEventListener("click", copyFinalSheet);

renderMissionOptions();
state.fieldValues = createEmptyFieldValues();
renderMissionFields();
renderStyleExamples();
renderFieldEditors();
renderUnclassifiedBlocks();
updateFinalOutput();
