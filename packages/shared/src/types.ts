/**
 * HeyClicky Core Type Definitions
 * Shared across Desktop, Web, and Companion Extension
 */

export type VoiceState = 'idle' | 'listening' | 'processing' | 'responding';

export type CursorSkin = 'classic' | 'smile' | 'skeptic' | 'coco' | 'poppy';

export interface CursorSkinMeta {
  id: CursorSkin;
  name: string;
  face: string;
  color: string;
  glowColor: string;
}

export const CURSOR_SKINS: CursorSkinMeta[] = [
  { id: 'classic', name: 'Clicky Classic', face: '^ ω ^', color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { id: 'smile', name: 'Happy Buddy', face: '{ ^-^ }', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' },
  { id: 'skeptic', name: 'Skeptical Poppy', face: '(¬_¬)', color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { id: 'coco', name: 'Coco Bear', face: 'ʕ•ᴥ•ʔ', color: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.4)' },
  { id: 'poppy', name: 'Shrugger', face: '¯\\_(ツ)_/¯', color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' },
];

export interface PointingTarget {
  x: number; // 0 to 1 normalized, or screen pixel X
  y: number; // 0 to 1 normalized, or screen pixel Y
  label: string;
  screenIndex: number;
}

export type DrawingType = 'circle' | 'ring' | 'highlight' | 'arrow' | 'line' | 'ink' | 'photo_card' | 'scene_3d';

export interface BaseDrawing {
  id: string;
  type: DrawingType;
  color: string;
  strokeWidth: number;
  screenIndex: number;
  // Spatial anchor for scroll tracking
  anchor?: {
    windowTitle?: string;
    targetSelector?: string;
    viewportScrollX: number;
    viewportScrollY: number;
    elementBoundingRect?: { x: number; y: number; width: number; height: number };
  };
  createdAt: number;
}

export interface CircleDrawing extends BaseDrawing {
  type: 'circle' | 'ring';
  centerX: number;
  centerY: number;
  radius: number;
}

export interface HighlightDrawing extends BaseDrawing {
  type: 'highlight';
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}

export interface ArrowDrawing extends BaseDrawing {
  type: 'arrow' | 'line';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label?: string;
}

export interface InkStrokeDrawing extends BaseDrawing {
  type: 'ink';
  points: { x: number; y: number }[];
}

export interface PhotoCardDrawing extends BaseDrawing {
  type: 'photo_card';
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
  title: string;
  caption: string;
  sourceAttribution: string;
}

export interface ThreeSceneDefinition extends BaseDrawing {
  type: 'scene_3d';
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  modelType: 'cube' | 'sphere' | 'cylinder' | 'torus' | 'heart' | 'solar_system' | 'custom';
  parts: {
    id: string;
    name: string;
    color: string;
    geometry: string;
    position: [number, number, number];
    scale?: [number, number, number];
    info: string;
  }[];
  autoRotate?: boolean;
}

export type ScreenDrawing =
  | CircleDrawing
  | HighlightDrawing
  | ArrowDrawing
  | InkStrokeDrawing
  | PhotoCardDrawing
  | ThreeSceneDefinition;

export interface WalkthroughStep {
  stepNumber: number;
  instruction: string;
  spokenCue: string;
  target?: PointingTarget;
  actionRequired: 'click' | 'type' | 'scroll' | 'observe' | 'custom';
  verificationCriterion?: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
}

export interface GuidedWalkthrough {
  id: string;
  title: string;
  appTarget: string;
  steps: WalkthroughStep[];
  currentStepIndex: number;
  isPaused: boolean;
}

// Dictation types
export interface DictationConfig {
  language: string; // 117 supported languages
  autoGrammar: boolean;
  terminalNewlineSafety: boolean; // Collapse dangerous newlines in terminals
  customWords: string[];
}

// Agent Buddies types
export type AgentBuddyStatus =
  | 'queued'
  | 'planning'
  | 'running'
  | 'waiting_on_user'
  | 'completed'
  | 'stopped'
  | 'failed';

export interface AgentBuddyCheckpoint {
  id: string;
  stepIndex: number;
  description: string;
  timestamp: number;
  stateSnapshot: Record<string, unknown>;
}

export interface AgentBuddyFileArtifact {
  id: string;
  name: string;
  path: string;
  sizeBytes: number;
  createdAt: number;
  isNew: boolean;
}

export interface AgentBuddyJob {
  id: string;
  name: string;
  taskGoal: string;
  status: AgentBuddyStatus;
  progressPercent: number;
  livePlan: string[];
  currentActionDescription: string;
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
  checkpoints: AgentBuddyCheckpoint[];
  artifacts: AgentBuddyFileArtifact[];
  chatMessages: { role: 'user' | 'assistant' | 'system'; text: string; timestamp: number }[];
  failureReason?: string;
}

// HeyClicky Drive types
export type DrivePermissionMode = 'allow_once' | 'always_allow' | 'denied';

export interface DriveAction {
  type: 'mouse_move' | 'click' | 'double_click' | 'right_click' | 'scroll' | 'type_text' | 'key_press';
  x?: number;
  y?: number;
  deltaX?: number;
  deltaY?: number;
  text?: string;
  key?: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
}

export interface DriveState {
  isActive: boolean;
  permissionMode: DrivePermissionMode;
  targetWindow?: string;
  currentAction?: string;
  killSwitchTriggered: boolean;
}

// Connector & MCP types
export interface ConnectorAccount {
  id: string;
  service: 'gmail' | 'gcalendar' | 'gsheets' | 'notion' | 'local_files' | string;
  label: 'Personal' | 'Work' | string;
  userEmail?: string;
  status: 'ready' | 'connecting' | 'needs_sign_in' | 'error';
  lastSyncedAt?: number;
}

export interface MCPServerConfig {
  id: string;
  name: string;
  type: 'stdio' | 'sse';
  command?: string;
  args?: string[];
  url?: string;
  enabled: boolean;
}

// Routines & Skills
export interface RoutineWorkflow {
  id: string;
  title: string;
  cronOrSchedule: string;
  description: string;
  enabled: boolean;
  lastRunAt?: number;
  nextRunAt?: number;
  notifyInChat: boolean;
}

export interface ReusableSkill {
  id: string;
  name: string;
  description: string;
  systemInstructions: string;
  enabled: boolean;
}

export interface GeminiVoiceMeta {
  id: string;
  name: string;
  style: string;
  tone: string;
  sampleText: string;
}

export const GEMINI_VOICES: GeminiVoiceMeta[] = [
  { id: 'Puck', name: 'Puck', style: 'Upbeat (Default)', tone: 'Enthusiastic and clear', sampleText: "Hey! I'm Puck. Ready to help you with your screen." },
  { id: 'Aoede', name: 'Aoede', style: 'Breezy', tone: 'Light, melodic and effortless', sampleText: "Hello there! Let's explore what's on your display." },
  { id: 'Zephyr', name: 'Zephyr', style: 'Bright', tone: 'Energetic and crisp', sampleText: "Hey! I'm Zephyr, let's fly through your tasks." },
  { id: 'Kore', name: 'Kore', style: 'Firm', tone: 'Confident and composed', sampleText: "Hello. I'm Kore, ready to assist your workflow." },
  { id: 'Charon', name: 'Charon', style: 'Informative', tone: 'Deep, steady and educational', sampleText: "Greetings. I'm Charon, here to guide your steps." },
  { id: 'Fenrir', name: 'Fenrir', style: 'Excitable', tone: 'Dynamic and fast-paced', sampleText: "Whoa, that looks cool! Let me point that out for you." },
  { id: 'Leda', name: 'Leda', style: 'Youthful', tone: 'Warm, friendly and modern', sampleText: "Hi! I'm Leda. Need a hand with this window?" },
  { id: 'Orus', name: 'Orus', style: 'Firm', tone: 'Direct and authoritative', sampleText: "Action confirmed. I'll take care of this immediately." },
  { id: 'Callirrhoe', name: 'Callirrhoe', style: 'Easy-going', tone: 'Relaxed and conversational', sampleText: "Hey, no worries. Let's take it step by step." },
  { id: 'Autonoe', name: 'Autonoe', style: 'Bright', tone: 'Vibrant and clear-toned', sampleText: "Good morning! Ready for today's suggestions." },
  { id: 'Enceladus', name: 'Enceladus', style: 'Breathy', tone: 'Soft and intimate', sampleText: "I'm right beside your cursor whenever you need me." },
  { id: 'Iapetus', name: 'Iapetus', style: 'Clear', tone: 'Crisp articulation and neutral', sampleText: "Analyzing your screen elements now." },
  { id: 'Umbriel', name: 'Umbriel', style: 'Easy-going', tone: 'Gentle, calm and reassuring', sampleText: "Take your time. I'll highlight the next button for you." },
  { id: 'Algieba', name: 'Algieba', style: 'Smooth', tone: 'Velvety and professional', sampleText: "Here are the key takeaways from your document." },
  { id: 'Despina', name: 'Despina', style: 'Smooth', tone: 'Polished and welcoming', sampleText: "Walkthrough step completed successfully." },
  { id: 'Erinome', name: 'Erinome', style: 'Clear', tone: 'Precise and attentive', sampleText: "Dictation is active with safe terminal punctuation." },
  { id: 'Algenib', name: 'Algenib', style: 'Gravelly', tone: 'Rich, textured and warm', sampleText: "All right, let's get down to business." },
  { id: 'Rasalgethi', name: 'Rasalgethi', style: 'Informative', tone: 'Analytical and measured', sampleText: "I've structured the 3D model according to your specs." },
  { id: 'Laomedeia', name: 'Laomedeia', style: 'Upbeat', tone: 'Cheerful and optimistic', sampleText: "Yay! That routine just finished running." },
  { id: 'Achernar', name: 'Achernar', style: 'Soft', tone: 'Quiet and thoughtful', sampleText: "I'll keep this note pinned right here for you." },
  { id: 'Alnilam', name: 'Alnilam', style: 'Firm', tone: 'Solid and grounded', sampleText: "Drive permissions confirmed. Starting automation." },
  { id: 'Schedar', name: 'Schedar', style: 'Even', tone: 'Balanced and focused', sampleText: "All systems running smoothly across displays." },
  { id: 'Gacrux', name: 'Gacrux', style: 'Mature', tone: 'Seasoned and deliberate', sampleText: "Here is the summary of your open tabs." },
  { id: 'Pulcherrima', name: 'Pulcherrima', style: 'Forward', tone: 'Direct and prompt', sampleText: "Next step: click on the export button in the top bar." },
  { id: 'Achird', name: 'Achird', style: 'Friendly', tone: 'Approachable and helpful', sampleText: "I'm your assistant, happy to help anytime." },
  { id: 'Zubenelgenubi', name: 'Zubenelgenubi', style: 'Casual', tone: 'Laid-back and relatable', sampleText: "Looks like you have a few unread emails to check." },
  { id: 'Vindemiatrix', name: 'Vindemiatrix', style: 'Gentle', tone: 'Tender and polite', sampleText: "May I show you where to find that setting?" },
  { id: 'Sadachbia', name: 'Sadachbia', style: 'Lively', tone: 'Spirited and playful', sampleText: "Let's draw some diagrams directly on screen!" },
  { id: 'Sadaltager', name: 'Sadaltager', style: 'Knowledgeable', tone: 'Scholarly and articulate', sampleText: "Based on your codebase, here is the recommended fix." },
  { id: 'Sulafat', name: 'Sulafat', style: 'Warm', tone: 'Kind and encouraging', sampleText: "You did great work today. Have a restful evening." },
];

export const CURSOR_COLORS = [
  { id: 'blue', name: 'Clicky Blue', hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.45)' },
  { id: 'emerald', name: 'Mint Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.45)' },
  { id: 'amber', name: 'Warm Amber', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' },
  { id: 'rose', name: 'Soft Rose', hex: '#f43f5e', glow: 'rgba(244, 63, 94, 0.45)' },
  { id: 'purple', name: 'Deep Violet', hex: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.45)' },
  { id: 'cyan', name: 'Aqua Glass', hex: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)' },
  { id: 'coral', name: 'Coral Punch', hex: '#ff6b4a', glow: 'rgba(255, 107, 74, 0.45)' },
];

// Settings
export interface UserSettings {
  geminiApiKey: string;
  geminiModelVoice: 'gemini-2.5-flash' | 'gemini-3.0-flash' | 'gemini-flash-thinking' | string;
  geminiModelPro: 'gemini-2.5-pro' | 'gemini-3.0-pro' | string;
  ttsModel: 'gemini-2.5-flash-preview-tts' | 'gemini-2.5-pro-preview-tts' | string;
  geminiVoice: string; // One of 30 voices in GEMINI_VOICES
  speechRate: number; // 0.5 to 1.5
  showCaptions: boolean; // Bottom-of-screen subtitles
  cursorSkin: CursorSkin;
  cursorColor: string; // Hex color for cursor buddy
  cursorFollowSpeed: number; // 0.1 to 1.0
  hideFloatingCursor: boolean;
  voiceLanguage: string;
  dictationLanguage: string;
  dictationAutoGrammar: boolean;
  terminalNewlineSafety: boolean;
  customDictionary: string[];
  shortcutTalk: string; // e.g. "Ctrl+Alt"
  shortcutDictate: string; // e.g. "Ctrl+Shift+D"
  drivePermissionMode: DrivePermissionMode;
  driveKillSwitchEnabled: boolean;
  proactiveSuggestionsEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  volume: number; // 0.0 to 1.0
  chimesEnabled: boolean;
  uiLanguage: string; // 18 languages
}

export const DEFAULT_SETTINGS: UserSettings = {
  geminiApiKey: '',
  geminiModelVoice: 'gemini-2.5-flash',
  geminiModelPro: 'gemini-2.5-pro',
  ttsModel: 'gemini-2.5-flash-preview-tts',
  geminiVoice: 'Puck',
  speechRate: 1.0,
  showCaptions: true,
  cursorSkin: 'classic',
  cursorColor: '#3b82f6',
  cursorFollowSpeed: 0.6,
  hideFloatingCursor: false,
  voiceLanguage: 'en-US',
  dictationLanguage: 'en-US',
  dictationAutoGrammar: true,
  terminalNewlineSafety: true,
  customDictionary: ['HeyClicky', 'Gemini', 'Dwij', 'Antideploy'],
  shortcutTalk: 'Ctrl+Alt',
  shortcutDictate: 'Ctrl+Shift+D',
  drivePermissionMode: 'always_allow', // Persistent permission override
  driveKillSwitchEnabled: true,
  proactiveSuggestionsEnabled: true,
  theme: 'system',
  volume: 0.85,
  chimesEnabled: true,
  uiLanguage: 'en',
};
