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

// Settings
export interface UserSettings {
  geminiApiKey: string;
  geminiModelVoice: 'gemini-2.5-flash' | 'gemini-3.0-flash' | 'gemini-flash-thinking' | string;
  geminiModelPro: 'gemini-2.5-pro' | 'gemini-3.0-pro' | string;
  cursorSkin: CursorSkin;
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
  cursorSkin: 'classic',
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
  theme: 'dark',
  volume: 0.8,
  chimesEnabled: true,
  uiLanguage: 'en',
};
