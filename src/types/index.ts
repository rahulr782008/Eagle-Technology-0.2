export type ChatMode = 'general' | 'coding' | 'education' | 'creative' | 'math';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: ChatMode;
}

export interface PhotoFilterSettings {
  brightness: number;   // 50 - 150 (default 100)
  contrast: number;     // 50 - 200 (default 100)
  saturation: number;   // 0 - 200 (default 100)
  exposure: number;     // -50 - 50 (default 0)
  blur: number;         // 0 - 20 (default 0)
  vignette: number;     // 0 - 100 (default 0)
  hueRotate: number;    // 0 - 360 (default 0)
  sharpness: number;    // 0 - 100 (default 0)
  sepia: number;        // 0 - 100 (default 0)
  invert: number;       // 0 - 100 (default 0)
  cyberGlow: number;    // 0 - 100 (default 0)
}

export interface VideoFilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hudOverlay: boolean;
  scanlines: boolean;
  glitchVfx: boolean;
  nightVision: boolean;
  cinematicBars: boolean;
  anamorphicGlow: boolean;
}

export interface VideoCaption {
  start: number;
  end: number;
  text: string;
}

export interface PublishedWork {
  id: string;
  type: 'photo' | 'video' | 'design';
  title: string;
  creator: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  timestamp: string;
  likes: number;
  tags: string[];
  filterDetails?: string;
}
