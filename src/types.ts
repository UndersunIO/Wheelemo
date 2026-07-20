export type EmotionFamily = "agréable" | "difficile" | "mixte";

export interface EmotionDefinition {
  id: string;
  name: string;
  emoji: string;
  family: EmotionFamily;
  energy: "basse" | "moyenne" | "haute";
  color: string;
  description: string;
  signal: string;
  bodyCues: string[];
  needs: string[];
}

export interface EmotionEntry {
  id: string;
  emotionId: string;
  emotion: string;
  emoji: string;
  color: string;
  family: EmotionFamily;
  intensity: number;
  context: string;
  body: string;
  need: string;
  request: string;
  expression: string;
  createdAt: string;
}

export type LearningMode = "guide" | "direct";
