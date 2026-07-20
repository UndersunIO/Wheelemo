import { emotionById } from "../data/emotions";
import type { EmotionEntry, EmotionFamily, LearningMode } from "../types";

const HISTORY_KEY = "feelflow.history.v2";
const LEGACY_HISTORY_KEY = "emotionHistory";
const MODE_KEY = "feelflow.learningMode";
const XP_KEY = "emotionBoardScore";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const normalizeLegacyEntry = (entry: Record<string, unknown>, index: number): EmotionEntry => {
  const rawName = String(entry.name ?? "Émotion");
  const matched = emotionById(
    rawName
      .replace(/[^\p{L}\s]/gu, "")
      .trim()
      .toLocaleLowerCase("fr-FR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
  );

  return {
    id: `legacy-${index}-${String(entry.timestamp ?? Date.now())}`,
    emotionId: matched?.id ?? "inconnue",
    emotion: matched?.name ?? rawName.replace(/^[^\p{L}]+/u, ""),
    emoji: matched?.emoji ?? rawName.match(/^[^\p{L}]+/u)?.[0]?.trim() ?? "•",
    color: matched?.color ?? String(entry.color ?? "#718096"),
    family: matched?.family ?? ("mixte" as EmotionFamily),
    intensity: 5,
    context: "",
    body: "",
    need: "",
    request: "",
    expression: "",
    createdAt: String(entry.timestamp ?? new Date().toISOString()),
  };
};

export function readHistory(): EmotionEntry[] {
  const storedCurrent = localStorage.getItem(HISTORY_KEY);
  if (storedCurrent !== null) {
    const current = safeParse<EmotionEntry[]>(storedCurrent, []);
    return Array.isArray(current)
      ? current.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      : [];
  }

  const legacy = safeParse<Record<string, unknown>[]>(localStorage.getItem(LEGACY_HISTORY_KEY), []);
  if (!Array.isArray(legacy) || legacy.length === 0) return [];

  const migrated = legacy.map(normalizeLegacyEntry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(migrated));
  return migrated.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function saveEntry(entry: EmotionEntry) {
  const history = readHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history]));
}

export function deleteEntry(id: string) {
  const next = readHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function readLearningMode(): LearningMode {
  return localStorage.getItem(MODE_KEY) === "direct" ? "direct" : "guide";
}

export function saveLearningMode(mode: LearningMode) {
  localStorage.setItem(MODE_KEY, mode);
}

export function readXP() {
  const value = Number.parseInt(localStorage.getItem(XP_KEY) ?? "0", 10);
  return Number.isFinite(value) ? value : 0;
}

export function saveXP(value: number) {
  localStorage.setItem(XP_KEY, String(Math.max(0, value)));
}

export function getFrequentEmotionIds(history: EmotionEntry[], limit = 3) {
  const scores = history.reduce<Record<string, number>>((acc, entry, index) => {
    if (entry.emotionId === "inconnue") return acc;
    const recencyWeight = Math.max(1, 5 - Math.floor(index / 5));
    acc[entry.emotionId] = (acc[entry.emotionId] ?? 0) + recencyWeight;
    return acc;
  }, {});

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id]) => id);
}
