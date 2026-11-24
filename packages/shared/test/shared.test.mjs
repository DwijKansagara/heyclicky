import test from 'node:test';
import assert from 'node:assert';
import {
  parsePointTags,
  parseDrawTags,
  parseScene3DTags,
  calculateBezierFlightPoint,
  sanitizeTerminalText,
  CURSOR_SKINS,
  DEFAULT_SETTINGS,
} from '../dist/index.js';

test('parsePointTags parses single and multiple point tags with monitor indices', () => {
  const input = "Click here [POINT:0.45,0.72:save button:screen0] to proceed. Next [POINT:120,400:menu:screen1] open settings.";
  const { cleanText, targets } = parsePointTags(input);

  assert.strictEqual(cleanText, "Click here to proceed. Next open settings.");
  assert.strictEqual(targets.length, 2);
  assert.strictEqual(targets[0].x, 0.45);
  assert.strictEqual(targets[0].y, 0.72);
  assert.strictEqual(targets[0].label, "save button");
  assert.strictEqual(targets[0].screenIndex, 0);

  assert.strictEqual(targets[1].x, 120);
  assert.strictEqual(targets[1].y, 400);
  assert.strictEqual(targets[1].label, "menu");
  assert.strictEqual(targets[1].screenIndex, 1);
});

test('parseDrawTags extracts 2D circle and highlight drawings', () => {
  const input = 'Look at this [DRAW:circle:{"centerX":300,"centerY":200,"radius":50,"color":"#3b82f6"}] area.';
  const { cleanText, drawings } = parseDrawTags(input);

  assert.strictEqual(cleanText, "Look at this area.");
  assert.strictEqual(drawings.length, 1);
  assert.strictEqual(drawings[0].type, 'circle');
  assert.strictEqual(drawings[0].centerX, 300);
  assert.strictEqual(drawings[0].radius, 50);
});

test('parseScene3DTags extracts 3D model definitions', () => {
  const input = 'Here is a heart model: [SCENE3D:{"title":"Heart","modelType":"heart","parts":[{"id":"p1","name":"Left Ventricle","geometry":"sphere","position":[0,0,0],"color":"#ef4444","info":"Ventricle"}]}] explore it!';
  const { cleanText, scenes } = parseScene3DTags(input);

  assert.strictEqual(cleanText, "Here is a heart model: explore it!");
  assert.strictEqual(scenes.length, 1);
  assert.strictEqual(scenes[0].title, "Heart");
  assert.strictEqual(scenes[0].modelType, "heart");
  assert.strictEqual(scenes[0].parts.length, 1);
});

test('calculateBezierFlightPoint computes quadratic arc and midpoint scale peak', () => {
  const start = { x: 0, y: 0 };
  const end = { x: 100, y: 0 };

  const startPoint = calculateBezierFlightPoint(start, end, 0.0);
  assert.strictEqual(startPoint.x, 0);
  assert.strictEqual(startPoint.y, 0);
  assert.strictEqual(startPoint.scale, 1.0);

  const midPoint = calculateBezierFlightPoint(start, end, 0.5, 50);
  assert.strictEqual(midPoint.x, 50);
  assert.strictEqual(midPoint.y, -25); // Midpoint curves upwards
  assert.ok(midPoint.scale > 1.25, 'Midpoint scale should peak at ~1.3');

  const endPoint = calculateBezierFlightPoint(start, end, 1.0);
  assert.strictEqual(endPoint.x, 100);
  assert.strictEqual(endPoint.y, 0);
  assert.ok(Math.abs(endPoint.scale - 1.0) < 0.001);
});

test('sanitizeTerminalText collapses dangerous newlines in terminals', () => {
  const multiline = "rm -rf /\nls -la\r\ncat file.txt";
  const safeText = sanitizeTerminalText(multiline, true);
  assert.strictEqual(safeText, "rm -rf / ls -la cat file.txt");

  const normalEditor = sanitizeTerminalText(multiline, false);
  assert.strictEqual(normalEditor, multiline);
});

test('Cursor skins and defaults check', () => {
  assert.strictEqual(CURSOR_SKINS.length, 5);
  assert.strictEqual(DEFAULT_SETTINGS.drivePermissionMode, 'always_allow');
});
