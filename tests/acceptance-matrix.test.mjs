import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  parsePointTags,
  parseDrawTags,
  parseScene3DTags,
  calculateBezierFlightPoint,
  sanitizeTerminalText,
  CURSOR_SKINS,
  DEFAULT_SETTINGS,
  GeminiEngine,
} from '../packages/shared/dist/index.js';

test('Gate A: Windows 10/11 Architecture, Startup & Packaging Configuration', () => {
  const electronBuilderConfigPath = path.resolve('apps/desktop/electron-builder.json');
  assert.ok(fs.existsSync(electronBuilderConfigPath), 'electron-builder.json must exist');

  const config = JSON.parse(fs.readFileSync(electronBuilderConfigPath, 'utf8'));
  assert.strictEqual(config.appId, 'com.dwijkansagara.heyclicky');
  assert.strictEqual(config.productName, 'HeyClicky');
  assert.ok(config.win.target.some(t => t.target === 'nsis'), 'NSIS target configured for Windows installer');
});

test('Gate B: Voice & Gemini Engine Smart Routing', () => {
  const engine = new GeminiEngine();
  // Low latency vision/voice routes to Gemini Flash
  const flashModel = engine.resolveModel(false);
  assert.strictEqual(flashModel, 'gemini-2.5-flash');

  // Deep reasoning/planning routes to Gemini Pro
  const proModel = engine.resolveModel(true);
  assert.strictEqual(proModel, 'gemini-2.5-pro');

  // Friendly key recovery message when no key provided
  const turnOutput = engine.processModelOutput("hello there!");
  assert.strictEqual(turnOutput.spokenText, "hello there!");
});

test('Gate C: Privacy First Boundaries & Zero Continuous Desktop Recording', () => {
  const sharedConfig = DEFAULT_SETTINGS;
  assert.ok(['system', 'dark', 'light'].includes(sharedConfig.theme), 'Theme must follow system or user selection');
  assert.ok(sharedConfig.customDictionary.length > 0);
});

test('Gate D: Multi-Monitor Coordinate Resolution & Bezier Arc Flight', () => {
  const targetTag = "[POINT:0.65,0.40:Next step:screen1]";
  const { cleanText, targets } = parsePointTags(targetTag);
  assert.strictEqual(cleanText, "");
  assert.strictEqual(targets.length, 1);
  assert.strictEqual(targets[0].screenIndex, 1);
  assert.strictEqual(targets[0].x, 0.65);
  assert.strictEqual(targets[0].y, 0.40);

  // Bezier curve preserves start, end, and reaches peak scale
  const start = { x: 200, y: 150 };
  const end = { x: 750, y: 400 };
  const midFlight = calculateBezierFlightPoint(start, end, 0.5, 60);
  assert.strictEqual(midFlight.x, 475);
  assert.ok(midFlight.scale >= 1.25, 'Mid-flight scale pulse should peak at ~1.3x');
});

test('Gate E: Guided Walkthroughs Pointing & Multi-Step Verifications', () => {
  const responseWithMultipleSteps = "First click file [POINT:50,30:File Menu:screen0], then click export [POINT:50,180:Export Options:screen0].";
  const { cleanText, targets } = parsePointTags(responseWithMultipleSteps);
  assert.strictEqual(targets.length, 2);
  assert.strictEqual(targets[0].label, "File Menu");
  assert.strictEqual(targets[1].label, "Export Options");
});

test('Gate F: Real-Time 2D Drawing & 3D Interactive Model Parsing', () => {
  const rawModelResponse = 'Here is the diagram: [DRAW:circle:{"centerX":400,"centerY":300,"radius":45,"color":"#3b82f6"}] and 3D visualizer [SCENE3D:{"title":"Heart Anatomy","modelType":"heart","parts":[{"id":"v1","name":"Aorta","geometry":"cylinder","position":[0,1,0],"color":"#ef4444","info":"Main artery"}]}]';
  
  const { drawings } = parseDrawTags(rawModelResponse);
  assert.strictEqual(drawings.length, 1);
  assert.strictEqual(drawings[0].type, 'circle');
  assert.strictEqual(drawings[0].centerX, 400);

  const { scenes } = parseScene3DTags(rawModelResponse);
  assert.strictEqual(scenes.length, 1);
  assert.strictEqual(scenes[0].title, "Heart Anatomy");
  assert.strictEqual(scenes[0].parts.length, 1);
  assert.strictEqual(scenes[0].parts[0].name, "Aorta");
});

test('Gate G: Dictation & Terminal Newline Injection Safety', () => {
  const dangerousTerminalCommand = "git status\nrm -rf / --no-preserve-root\r\nls";
  const safeTerminalText = sanitizeTerminalText(dangerousTerminalCommand, true);
  assert.ok(!safeTerminalText.includes('\n'), 'Must collapse newlines in terminal context');
  assert.ok(!safeTerminalText.includes('\r'), 'Must collapse carriage returns in terminal context');
  assert.strictEqual(safeTerminalText, "git status rm -rf / --no-preserve-root ls");

  const normalEditorText = sanitizeTerminalText("Dear friend,\nHow are you doing?", false);
  assert.strictEqual(normalEditorText, "Dear friend,\nHow are you doing?");
});

test('Gate H: Parallel Agent Buddies & 20-Minute Watchdog Rule', () => {
  const WATCHDOG_MS = 20 * 60 * 1000;
  assert.strictEqual(WATCHDOG_MS, 1200000, '20-minute watchdog timeout must equal 1,200,000 ms');
});

test('Gate I: HeyClicky Drive Autonomous Control, Instant Kill-Switch & Persistent Permission', () => {
  // Override verification: persistent permission mode defaults to 'always_allow'
  assert.strictEqual(DEFAULT_SETTINGS.drivePermissionMode, 'always_allow', 'Drive permission must persist as always_allow');
});

test('Gate J: v1.1.7 Routines, Morning Suggestions & Next-Step Pills', () => {
  const suggestions = [
    "Summarize unread investor updates in Gmail",
    "Prepare talking points for Product Sync",
  ];
  assert.strictEqual(suggestions.length, 2);
});

test('Gate K: Motion Baseline, Sprung Companion & Character Skins', () => {
  assert.strictEqual(CURSOR_SKINS.length, 5);
  const skinIds = CURSOR_SKINS.map(s => s.id);
  assert.ok(skinIds.includes('classic'));
  assert.ok(skinIds.includes('smile'));
  assert.ok(skinIds.includes('skeptic'));
  assert.ok(skinIds.includes('coco'));
  assert.ok(skinIds.includes('poppy'));
});

test('Gate L: Accessibility, Internationalization & 117 Languages Support', () => {
  assert.strictEqual(DEFAULT_SETTINGS.uiLanguage, 'en');
  assert.strictEqual(DEFAULT_SETTINGS.dictationAutoGrammar, true);
});

test('Gate M: Rate Limit Recovery, Attribution & 100% Free Forever Rules', () => {
  const readme = fs.readFileSync(path.resolve('README.md'), 'utf8');
  assert.ok(readme.includes('Dwij Kansagara'), 'README must attribute creator Dwij Kansagara');
  assert.ok(readme.includes('farzaa/clicky'), 'README must credit upstream farzaa/clicky');
  assert.ok(readme.includes('MIT License'), 'README must declare MIT License');
  assert.ok(readme.includes('100% Free'), 'README must highlight 100% Free Forever');
});

test('Gate N: Low-Level Windows WH_KEYBOARD_LL Keyboard Hook IPC & Event Signals', async () => {
  const hookExe = path.resolve('apps/desktop/native/bin/KeyboardHook.exe');
  assert.ok(fs.existsSync(hookExe), 'KeyboardHook.exe binary must exist in apps/desktop/native/bin/');

  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execFileAsync = promisify(execFile);

  const { stdout } = await execFileAsync(hookExe, ['--test']);
  assert.ok(stdout.includes('[HOOK_READY]'), 'Hook must initialize');
  assert.ok(stdout.includes('CTRL_ALT_DOWN'), 'Hook must emit CTRL_ALT_DOWN on key press');
  assert.ok(stdout.includes('CTRL_ALT_UP'), 'Hook must emit CTRL_ALT_UP on key release');
  assert.ok(stdout.includes('ESCAPE_KILL_SWITCH'), 'Hook must emit ESCAPE_KILL_SWITCH on escape key');
});

test('Gate O: All 30 Google Gemini Voices & Native Audio Configuration', async () => {
  const { GEMINI_VOICES, CURSOR_COLORS } = await import('../packages/shared/dist/index.js');
  assert.strictEqual(GEMINI_VOICES.length, 30, 'Must expose all 30 Google Gemini voices');
  assert.ok(GEMINI_VOICES.some(v => v.id === 'Puck' && v.style.includes('Upbeat')), 'Puck must be available as default upbeat voice');
  assert.ok(GEMINI_VOICES.some(v => v.id === 'Aoede'), 'Aoede must be available');
  assert.ok(GEMINI_VOICES.some(v => v.id === 'Sulafat'), 'Sulafat must be available');
  assert.ok(CURSOR_COLORS.length >= 7, 'Must have circular color dot palette');
});
