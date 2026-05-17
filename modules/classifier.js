export function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function splitIntoBlocks(text) {
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

export function formatBlocks(blocks) {
  return blocks.join("\n\n");
}

function trimLooseQuotes(text) {
  return text
    .replace(/^[\s"'\u201c\u201d\u2018\u2019]+/, "")
    .replace(/[\s"'\u201c\u201d\u2018\u2019]+$/, "");
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

function getFieldMarkers(field) {
  return field.markersStrong ?? field.markers ?? [];
}

export function createEmptyFieldValues(mission) {
  const values = {};

  mission.fields.forEach((field) => {
    values[field.id] = {
      original: "",
      suggestion: "",
    };
  });

  return values;
}

function detectFieldMarker(mission, block) {
  const normalizedBlock = normalizeText(block);
  const matches = mission.fields
    .map((field) => {
      const matchedMarkers = getFieldMarkers(field)
        .map((marker) => normalizeText(marker))
        .filter((marker) => markerMatches(normalizedBlock, marker));

      const score = matchedMarkers.reduce((longest, marker) => Math.max(longest, marker.length), 0);
      return {
        field,
        marker: matchedMarkers.find((marker) => marker.length === score) ?? "",
        score,
      };
    })
    .filter((match) => match.score > 0);

  if (!matches.length) {
    return null;
  }

  const bestScore = Math.max(...matches.map((match) => match.score));
  const bestMatches = matches.filter((match) => match.score === bestScore);
  return bestMatches.length === 1 ? bestMatches[0] : null;
}

export function classifyTranscript(mission, transcript) {
  const result = createEmptyFieldValues(mission);
  const blocks = splitIntoBlocks(transcript);
  const buckets = {};
  const unclassifiedBlocks = [];
  const debug = [];
  let activeFieldId = null;

  mission.fields.forEach((field) => {
    buckets[field.id] = [];
  });

  blocks.forEach((block, index) => {
    const detected = detectFieldMarker(mission, block);

    if (detected) {
      activeFieldId = detected.field.id;
    }

    if (activeFieldId) {
      buckets[activeFieldId].push(block);
      debug.push({
        index,
        fieldId: activeFieldId,
        marker: detected?.marker ?? "",
        detectedByMarker: Boolean(detected),
        block,
      });
      return;
    }

    unclassifiedBlocks.push(block);
    debug.push({
      index,
      fieldId: "",
      marker: "",
      detectedByMarker: false,
      block,
    });
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
    debug,
  };
}
