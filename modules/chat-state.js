export function createEmptyFieldChats(mission) {
  const values = {};

  mission.fields.forEach((field) => {
    values[field.id] = createFieldChat();
  });

  return values;
}

export function createFieldChat() {
  return {
    messages: [],
    pendingProposal: "",
    pendingProposalSource: "",
    versions: [],
    activeVersion: 0,
  };
}
