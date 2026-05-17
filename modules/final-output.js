export function buildFinalOutput({ mission, gender, fieldValues }) {
  const genderLabel = gender === "male" ? "Aluno" : "Aluna";
  const lines = [
    `Miss\u00e3o: ${mission.label ?? mission.id}`,
    `Aluno/aluna: ${genderLabel}`,
    "",
    "Ficha inicial - revisar pelo IN",
  ];

  mission.fields.forEach((field) => {
    const value = fieldValues[field.id]?.suggestion?.trim() ?? "";
    if (!value) {
      return;
    }

    lines.push("", field.title, value);
  });

  return lines.join("\n");
}
