import { missions } from "./data/missions/index.js";
import { classifyTranscript, createEmptyFieldValues, formatBlocks } from "./modules/classifier.js";
import { createEmptyFieldChats, createFieldChat } from "./modules/chat-state.js";
import { buildFinalOutput } from "./modules/final-output.js";
import { generateItemAiReply } from "./modules/item-ai.js";

const state = {
  currentMission: "FPB5-05",
  gender: "male",
  fieldFilter: "all",
  fieldValues: {},
  fieldChats: {},
  activeRecorder: null,
  activeRecorderChunks: [],
  activeRecorderFieldId: null,
  activeChatFieldId: null,
  itemChatBusy: false,
  unclassifiedBlocks: [],
  classificationDebug: [],
};

const missionSelect = document.querySelector("#missionSelect");
const fieldList = document.querySelector("#fieldList");
const fieldEditors = document.querySelector("#fieldEditors");
const transcriptInput = document.querySelector("#transcriptInput");
const generateButton = document.querySelector("#generateButton");
const clearButton = document.querySelector("#clearButton");
const finalOutput = document.querySelector("#finalOutput");
const copyButton = document.querySelector("#copyButton");
const copyStatus = document.querySelector("#copyStatus");
const generationStatus = document.querySelector("#generationStatus");
const fieldCount = document.querySelector("#fieldCount");
const unclassifiedPanel = document.querySelector("#unclassifiedPanel");
const unclassifiedOutput = document.querySelector("#unclassifiedOutput");
const filterButtons = document.querySelectorAll("[data-filter]");
const itemChatPanel = document.querySelector("#itemChatPanel");
const itemChatTitle = document.querySelector("#itemChatTitle");
const itemChatMessages = document.querySelector("#itemChatMessages");
const itemChatCurrentVersion = document.querySelector("#itemChatCurrentVersion");
const itemChatVersionCount = document.querySelector("#itemChatVersionCount");
const itemChatCurrentText = document.querySelector("#itemChatCurrentText");
const itemChatInput = document.querySelector("#itemChatInput");
const itemChatStatus = document.querySelector("#itemChatStatus");
const sendItemChatButton = document.querySelector("#sendItemChatButton");
const recordItemChatButton = document.querySelector("#recordItemChatButton");
const stopItemChatButton = document.querySelector("#stopItemChatButton");
const closeItemChatButton = document.querySelector("#closeItemChatButton");
const resetItemChatButton = document.querySelector("#resetItemChatButton");

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

function getFieldById(fieldId) {
  return missions[state.currentMission].fields.find((field) => field.id === fieldId);
}

function getFieldChat(fieldId) {
  if (!state.fieldChats[fieldId]) {
    state.fieldChats[fieldId] = createFieldChat();
  }

  return state.fieldChats[fieldId];
}

function ensureInitialChatVersion(fieldId) {
  const chat = getFieldChat(fieldId);
  if (chat.versions.length) {
    return chat;
  }

  const initialText = getFieldValue(fieldId).suggestion.trim();
  chat.versions.push({
    number: 1,
    text: initialText,
    source: "Coment\u00e1rio inicial",
    applied: true,
  });
  chat.activeVersion = 1;
  return chat;
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function isApplyConfirmation(text) {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return /\b(sim|aplique|aplicar|pode aplicar|pode sim|confirmo|confirmado|perfeito|ok)\b/.test(normalized);
}

function getFieldValue(fieldId) {
  return state.fieldValues[fieldId] ?? { original: "", suggestion: "" };
}

function isFieldFilled(fieldId) {
  return Boolean(getFieldValue(fieldId).suggestion.trim());
}

function shouldShowField(fieldId) {
  if (state.fieldFilter === "filled") {
    return isFieldFilled(fieldId);
  }

  if (state.fieldFilter === "empty") {
    return !isFieldFilled(fieldId);
  }

  return true;
}

function renderMissionFields() {
  const mission = missions[state.currentMission];
  fieldList.innerHTML = "";

  mission.fields.forEach((field) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "field-nav-button";
    button.dataset.fieldId = field.id;
    button.textContent = field.title;
    button.addEventListener("click", () => {
      state.fieldFilter = "all";
      applyFieldFilter();

      const target = document.querySelector(`#field-${field.id}`);
      if (!target) {
        return;
      }

      target.hidden = false;
      target.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    item.appendChild(button);
    fieldList.appendChild(item);
  });

  updateFieldNavigationStatus();
}

function updateFieldNavigationStatus() {
  document.querySelectorAll(".field-nav-button").forEach((button) => {
    const fieldId = button.dataset.fieldId;
    const filled = isFieldFilled(fieldId);
    button.classList.toggle("is-filled", filled);
    button.classList.toggle("is-empty", !filled);
  });
}

function renderUnclassifiedBlocks() {
  if (!unclassifiedPanel || !unclassifiedOutput) {
    return;
  }

  const hasUnclassifiedBlocks = state.unclassifiedBlocks.length > 0;
  unclassifiedPanel.hidden = !hasUnclassifiedBlocks;
  unclassifiedOutput.value = hasUnclassifiedBlocks ? formatBlocks(state.unclassifiedBlocks) : "";
}

function updateFieldCount() {
  if (!fieldCount) {
    return;
  }

  const mission = missions[state.currentMission];
  const filledCount = mission.fields.filter((field) => isFieldFilled(field.id)).length;
  const unclassifiedCount = state.unclassifiedBlocks.length;
  const suffix = unclassifiedCount ? ` | ${unclassifiedCount} sem item` : "";
  fieldCount.textContent = `${filledCount} preenchidos de ${mission.fields.length}${suffix}`;
}

function applyFieldFilter() {
  document.querySelectorAll(".field-editor").forEach((editor) => {
    editor.hidden = !shouldShowField(editor.dataset.fieldId);
  });

  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.fieldFilter);
  });
}

function renderFieldEditors() {
  const mission = missions[state.currentMission];
  fieldEditors.innerHTML = "";

  mission.fields.forEach((field) => {
    const fieldValue = getFieldValue(field.id);
    const isFilled = isFieldFilled(field.id);
    const wrapper = document.createElement("details");
    wrapper.id = `field-${field.id}`;
    wrapper.dataset.fieldId = field.id;
    wrapper.className = "field-editor";
    wrapper.open = isFilled;
    wrapper.classList.toggle("is-filled", isFilled);
    wrapper.classList.toggle("is-empty", !isFilled);

    const header = document.createElement("summary");
    const title = document.createElement("h3");
    title.textContent = field.title;

    const status = document.createElement("span");
    status.className = "field-status";
    status.textContent = isFilled ? "preenchido" : "em branco";

    header.append(title, status);

    const suggestionLabel = document.createElement("label");
    suggestionLabel.setAttribute("for", `${field.id}-suggestion`);
    suggestionLabel.textContent = "Texto final do item";

    const suggestionTextarea = document.createElement("textarea");
    suggestionTextarea.id = `${field.id}-suggestion`;
    suggestionTextarea.value = fieldValue.suggestion;
    suggestionTextarea.placeholder = "Campo n\u00e3o mencionado na transcri\u00e7\u00e3o.";
    suggestionTextarea.addEventListener("input", () => {
      state.fieldValues[field.id] = {
        ...getFieldValue(field.id),
        suggestion: suggestionTextarea.value,
      };

      const hasText = isFieldFilled(field.id);
      status.textContent = hasText ? "preenchido" : "em branco";
      wrapper.classList.toggle("is-filled", hasText);
      wrapper.classList.toggle("is-empty", !hasText);
      updateFieldCount();
      updateFieldNavigationStatus();
      applyFieldFilter();
      updateFinalOutput();
    });

    const chatButton = document.createElement("button");
    chatButton.type = "button";
    chatButton.className = "secondary-button open-item-chat";
    chatButton.textContent = "Conversar sobre este item";
    chatButton.addEventListener("click", () => openItemChat(field.id));

    wrapper.append(header, suggestionLabel, suggestionTextarea, chatButton);
    fieldEditors.appendChild(wrapper);
  });

  updateFieldCount();
  updateFieldNavigationStatus();
  applyFieldFilter();
}

function addChatMessage(fieldId, message) {
  const chat = getFieldChat(fieldId);
  chat.messages.push({
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${chat.messages.length}`,
    time: getCurrentTimeLabel(),
    ...message,
  });
}

function renderItemChatMessages() {
  if (!itemChatMessages || !state.activeChatFieldId) {
    return;
  }

  const chat = getFieldChat(state.activeChatFieldId);
  itemChatMessages.innerHTML = "";

  if (!chat.messages.length) {
    const empty = document.createElement("p");
    empty.className = "chat-empty";
    empty.textContent = "Converse com a IA sobre este item. O contexto deve ficar restrito ao campo selecionado.";
    itemChatMessages.appendChild(empty);
    return;
  }

  chat.messages.forEach((message) => {
    const bubble = document.createElement("article");
    bubble.className = `chat-message ${message.role === "user" ? "is-user" : "is-assistant"}`;

    if (message.role === "assistant") {
      const avatar = document.createElement("span");
      avatar.className = "chat-avatar";
      avatar.textContent = "IA";
      bubble.appendChild(avatar);
    }

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "chat-message-content";

    if (message.type === "audio") {
      const label = document.createElement("p");
      label.textContent = message.label ?? "\u00c1udio enviado pelo IN";
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = message.audioUrl;
      contentWrapper.append(label, audio);
    } else {
      const text = document.createElement("p");
      text.textContent = message.content;
      contentWrapper.appendChild(text);
    }

    const time = document.createElement("span");
    time.className = "chat-time";
    time.textContent = message.role === "user" ? `${message.time ?? ""} \u2713\u2713` : message.time ?? "";
    contentWrapper.appendChild(time);
    bubble.appendChild(contentWrapper);
    itemChatMessages.appendChild(bubble);
  });

  itemChatMessages.scrollTop = itemChatMessages.scrollHeight;
}

function renderItemChatCurrentVersion() {
  if (!state.activeChatFieldId) {
    return;
  }

  const chat = ensureInitialChatVersion(state.activeChatFieldId);
  const activeVersion = chat.versions.find((version) => version.number === chat.activeVersion);
  itemChatCurrentVersion.textContent = `Vers\u00e3o ${chat.activeVersion || 1}`;
  itemChatVersionCount.textContent = `${chat.versions.length} ${chat.versions.length === 1 ? "vers\u00e3o" : "vers\u00f5es"}`;
  itemChatCurrentText.value = activeVersion?.text ?? getFieldValue(state.activeChatFieldId).suggestion;
}

function renderItemChat() {
  renderItemChatCurrentVersion();
  renderItemChatMessages();
  sendItemChatButton.disabled = state.itemChatBusy;
  recordItemChatButton.disabled = state.itemChatBusy || Boolean(state.activeRecorder);
}

function openItemChat(fieldId) {
  const field = getFieldById(fieldId);
  if (!field || !itemChatPanel) {
    return;
  }

  state.activeChatFieldId = fieldId;
  ensureInitialChatVersion(fieldId);
  itemChatPanel.hidden = false;
  itemChatTitle.textContent = field.title;
  itemChatInput.value = "";
  itemChatStatus.textContent = "Conversa restrita ao item selecionado.";
  renderItemChat();
}

function closeItemChat() {
  if (!itemChatPanel) {
    return;
  }

  itemChatPanel.hidden = true;
  state.activeChatFieldId = null;
  itemChatInput.value = "";
  itemChatCurrentText.value = "";
  itemChatStatus.textContent = "Chat do item fechado.";
}

async function sendItemChatText() {
  const fieldId = state.activeChatFieldId;
  const content = itemChatInput.value.trim();
  if (!fieldId || !content || state.itemChatBusy) {
    return;
  }

  const field = getFieldById(fieldId);
  const chat = getFieldChat(fieldId);
  const currentText = getFieldValue(fieldId).suggestion.trim();

  addChatMessage(fieldId, { role: "user", type: "text", content });
  itemChatInput.value = "";

  if (chat.pendingProposal && isApplyConfirmation(content)) {
    const nextVersion = applyNewItemVersion(fieldId, chat.pendingProposal, chat.pendingProposalSource || "IA");
    chat.pendingProposal = "";
    chat.pendingProposalSource = "";
    addChatMessage(fieldId, {
      role: "assistant",
      type: "text",
      content: `Coment\u00e1rio atualizado com sucesso para a vers\u00e3o ${nextVersion}.`,
    });
    itemChatStatus.textContent = `Coment\u00e1rio atualizado para a vers\u00e3o ${nextVersion}.`;
    renderFieldEditors();
    renderItemChat();
    updateFinalOutput();
    return;
  }

  state.itemChatBusy = true;
  itemChatStatus.textContent = "IA analisando somente este item...";
  renderItemChat();

  try {
    const reply = await generateItemAiReply({
      fieldTitle: field?.title ?? "Item",
      currentText,
      userMessage: content,
      messages: chat.messages,
    });

    addChatMessage(fieldId, {
      role: "assistant",
      type: "text",
      content: reply.content,
    });

    const proposedText = reply.proposedText?.trim() ?? "";
    if (proposedText && proposedText !== currentText) {
      chat.pendingProposal = proposedText;
      chat.pendingProposalSource = reply.source === "IA" ? "IA" : "Assistente local";
    }
    itemChatStatus.textContent = reply.source === "IA"
      ? "Proposta recebida. Responda se deseja aplicar."
      : "Assistente local usado. Configure um endpoint para IA real.";
  } catch (error) {
    addChatMessage(fieldId, {
      role: "assistant",
      type: "text",
      content: "Nao foi possivel obter resposta da IA agora. O comentario atual nao foi alterado.",
    });
    itemChatStatus.textContent = "Falha ao chamar a IA.";
  } finally {
    state.itemChatBusy = false;
    renderItemChat();
  }
}

async function startItemChatRecording() {
  const fieldId = state.activeChatFieldId;
  if (!fieldId) {
    return;
  }

  if (state.itemChatBusy) {
    itemChatStatus.textContent = "Aguarde a resposta atual antes de gravar novo audio.";
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    itemChatStatus.textContent = "Grava\u00e7\u00e3o no navegador indispon\u00edvel. Envie a instru\u00e7\u00e3o por texto por enquanto.";
    return;
  }

  if (state.activeRecorder) {
    itemChatStatus.textContent = "J\u00e1 existe uma grava\u00e7\u00e3o em andamento.";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    state.activeRecorder = recorder;
    state.activeRecorderChunks = [];
    state.activeRecorderFieldId = fieldId;

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        state.activeRecorderChunks.push(event.data);
      }
    });

    recorder.addEventListener("stop", () => {
      const audioBlob = new Blob(state.activeRecorderChunks, { type: recorder.mimeType || "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      addChatMessage(fieldId, {
        role: "user",
        type: "audio",
        audioUrl,
        label: "\u00c1udio de corre\u00e7\u00e3o enviado pelo IN",
      });
      addChatMessage(fieldId, {
        role: "assistant",
        type: "text",
        content: "\u00c1udio recebido. Quando a transcri\u00e7\u00e3o automatica estiver integrada, a IA devera responder neste chat e propor nova versao apenas para este item.",
      });

      stream.getTracks().forEach((track) => track.stop());
      state.activeRecorder = null;
      state.activeRecorderChunks = [];
      state.activeRecorderFieldId = null;

      recordItemChatButton.disabled = false;
      stopItemChatButton.disabled = true;
      itemChatStatus.textContent = "\u00c1udio anexado ao chat deste item.";
      renderItemChat();
    });

    recorder.start();
    recordItemChatButton.disabled = true;
    stopItemChatButton.disabled = false;
    itemChatStatus.textContent = "Gravando \u00e1udio para este item...";
  } catch (error) {
    itemChatStatus.textContent = "N\u00e3o foi poss\u00edvel acessar o microfone neste navegador.";
  }
}

function stopItemChatRecording() {
  if (state.activeRecorder && state.activeRecorderFieldId === state.activeChatFieldId) {
    state.activeRecorder.stop();
  }
}

function resetItemChatConversation() {
  const fieldId = state.activeChatFieldId;
  if (!fieldId) {
    return;
  }

  const chat = getFieldChat(fieldId);
  chat.messages = [];
  chat.pendingProposal = "";
  chat.pendingProposalSource = "";
  itemChatStatus.textContent = "Conversa reiniciada. O coment\u00e1rio atual foi mantido.";
  renderItemChat();
}

function applyNewItemVersion(fieldId, text, source) {
  const chat = getFieldChat(fieldId);
  const nextNumber = chat.versions.length + 1;
  chat.versions.push({
    number: nextNumber,
    text,
    source,
    applied: true,
  });
  chat.activeVersion = nextNumber;
  chat.versions.forEach((item) => {
    item.applied = item.number === nextNumber;
  });
  state.fieldValues[fieldId] = {
    ...getFieldValue(fieldId),
    suggestion: text,
  };

  return nextNumber;
}

function updateFinalOutput() {
  const mission = missions[state.currentMission];
  finalOutput.value = buildFinalOutput({
    mission,
    gender: state.gender,
    fieldValues: state.fieldValues,
  });
}

function hasGeneratedContent() {
  return (
    Object.values(state.fieldValues).some((field) => field.suggestion?.trim() || field.original?.trim()) ||
    state.unclassifiedBlocks.length > 0
  );
}

function clearGeneratedFields({ skipConfirmation = false } = {}) {
  if (!skipConfirmation && hasGeneratedContent()) {
    const confirmed = window.confirm("Tem certeza que deseja limpar a ficha gerada?");
    if (!confirmed) {
      return;
    }
  }

  const mission = missions[state.currentMission];
  state.fieldValues = createEmptyFieldValues(mission);
  state.fieldChats = createEmptyFieldChats(mission);
  closeItemChat();
  state.unclassifiedBlocks = [];
  state.classificationDebug = [];
  state.fieldFilter = "all";

  generationStatus.textContent = "Campos limpos";
  renderFieldEditors();
  renderUnclassifiedBlocks();
  updateFinalOutput();
}

function generateInitialSheet() {
  const transcript = transcriptInput.value.trim();

  if (!transcript) {
    generationStatus.textContent = "Cole uma transcri\u00e7\u00e3o";
    clearGeneratedFields({ skipConfirmation: true });
    return;
  }

  const classification = classifyTranscript(missions[state.currentMission], transcript);
  state.fieldValues = classification.fieldValues;
  state.fieldChats = createEmptyFieldChats(missions[state.currentMission]);
  closeItemChat();
  state.unclassifiedBlocks = classification.unclassifiedBlocks;
  state.classificationDebug = classification.debug;
  state.fieldFilter = "filled";
  generationStatus.textContent = "Sugest\u00e3o gerada";
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

missionSelect.addEventListener("change", (event) => {
  const nextMission = event.target.value;

  if (hasGeneratedContent()) {
    const confirmed = window.confirm("Trocar de miss\u00e3o vai limpar a ficha gerada. Deseja continuar?");
    if (!confirmed) {
      missionSelect.value = state.currentMission;
      return;
    }
  }

  state.currentMission = nextMission;
  clearGeneratedFields({ skipConfirmation: true });
  renderMissionFields();
});

document.querySelectorAll("input[name='studentGender']").forEach((input) => {
  input.addEventListener("change", syncGenderFromInput);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.fieldFilter = button.dataset.filter;
    applyFieldFilter();
  });
});

generateButton.addEventListener("click", generateInitialSheet);
clearButton.addEventListener("click", () => clearGeneratedFields());
copyButton.addEventListener("click", copyFinalSheet);
sendItemChatButton.addEventListener("click", sendItemChatText);
recordItemChatButton.addEventListener("click", startItemChatRecording);
stopItemChatButton.addEventListener("click", stopItemChatRecording);
closeItemChatButton.addEventListener("click", closeItemChat);
resetItemChatButton.addEventListener("click", resetItemChatConversation);
itemChatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendItemChatText();
  }
});
renderMissionOptions();
state.fieldValues = createEmptyFieldValues(missions[state.currentMission]);
state.fieldChats = createEmptyFieldChats(missions[state.currentMission]);
renderMissionFields();
renderFieldEditors();
renderUnclassifiedBlocks();
updateFinalOutput();

window.fichaRumbaDebug = {
  getClassificationDebug: () => state.classificationDebug,
};
