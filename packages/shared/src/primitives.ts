import { PointingTarget, ScreenDrawing, ThreeSceneDefinition } from './types.js';

/**
 * Parses [POINT:x,y:label:screenN] tags from LLM response text
 * Matching the specification from farzaa/clicky OverlayWindow.swift
 */
export function parsePointTags(text: string): { cleanText: string; targets: PointingTarget[] } {
  const pointRegex = /\[POINT:([0-9.]+),([0-9.]+):([^:]+)(?::screen([0-9]+))?\]/g;
  const targets: PointingTarget[] = [];

  let match;
  while ((match = pointRegex.exec(text)) !== null) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    const label = match[3].trim();
    const screenIndex = match[4] ? parseInt(match[4], 10) : 0;
    targets.push({ x, y, label, screenIndex });
  }

  const cleanText = text.replace(pointRegex, '').replace(/\s{2,}/g, ' ').trim();
  return { cleanText, targets };
}

/**
 * Extracts balanced JSON substrings starting from a prefix tag like `[DRAW:type:` or `[SCENE3D:`
 */
function extractTaggedJson(text: string, tagPrefix: string): { cleanText: string; items: { tag: string; json: any; raw: string }[] } {
  const items: { tag: string; json: any; raw: string }[] = [];
  let resultText = '';
  let i = 0;

  while (i < text.length) {
    const tagIndex = text.indexOf(tagPrefix, i);
    if (tagIndex === -1) {
      resultText += text.slice(i);
      break;
    }

    resultText += text.slice(i, tagIndex);
    const afterPrefix = tagIndex + tagPrefix.length;

    // Find the opening brace of JSON
    const jsonStart = text.indexOf('{', afterPrefix);
    if (jsonStart === -1) {
      resultText += text.slice(tagIndex, afterPrefix);
      i = afterPrefix;
      continue;
    }

    // Extract subtag if any (e.g. "circle:" in "[DRAW:circle:{")
    const subTag = text.slice(afterPrefix, jsonStart).replace(/:$/, '').trim();

    // Balance braces
    let depth = 0;
    let jsonEnd = -1;
    for (let j = jsonStart; j < text.length; j++) {
      if (text[j] === '{') depth++;
      else if (text[j] === '}') {
        depth--;
        if (depth === 0) {
          jsonEnd = j;
          break;
        }
      }
    }

    if (jsonEnd === -1) {
      resultText += text.slice(tagIndex, jsonStart);
      i = jsonStart;
      continue;
    }

    // Expect ']' right after '}' or with spaces
    const closeBracket = text.indexOf(']', jsonEnd);
    if (closeBracket === -1 || closeBracket > jsonEnd + 5) {
      resultText += text.slice(tagIndex, jsonEnd + 1);
      i = jsonEnd + 1;
      continue;
    }

    const rawJson = text.slice(jsonStart, jsonEnd + 1);
    const fullTag = text.slice(tagIndex, closeBracket + 1);

    try {
      const parsed = JSON.parse(rawJson);
      items.push({ tag: subTag, json: parsed, raw: fullTag });
    } catch {
      // Ignored malformed
    }

    i = closeBracket + 1;
  }

  return { cleanText: resultText.replace(/\s{2,}/g, ' ').trim(), items };
}

/**
 * Parses [DRAW:type:{...}] tags from LLM response text
 */
export function parseDrawTags(text: string): { cleanText: string; drawings: ScreenDrawing[] } {
  const { cleanText, items } = extractTaggedJson(text, '[DRAW:');
  const drawings: ScreenDrawing[] = items.map((item, idx) => ({
    id: `draw_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
    type: (item.tag || item.json.type || 'circle') as any,
    createdAt: Date.now(),
    screenIndex: item.json.screenIndex ?? 0,
    color: item.json.color ?? '#3b82f6',
    strokeWidth: item.json.strokeWidth ?? 3,
    ...item.json,
  }));

  return { cleanText, drawings };
}

/**
 * Parses [SCENE3D:{...}] tags from LLM response text for real-time 3D models
 */
export function parseScene3DTags(text: string): { cleanText: string; scenes: ThreeSceneDefinition[] } {
  const { cleanText, items } = extractTaggedJson(text, '[SCENE3D:');
  const scenes: ThreeSceneDefinition[] = items.map((item, idx) => ({
    id: `scene_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
    type: 'scene_3d',
    createdAt: Date.now(),
    color: '#60a5fa',
    strokeWidth: 1,
    screenIndex: item.json.screenIndex ?? 0,
    x: item.json.x ?? 100,
    y: item.json.y ?? 100,
    width: item.json.width ?? 320,
    height: item.json.height ?? 320,
    title: item.json.title ?? 'Interactive 3D Visualizer',
    modelType: item.json.modelType ?? 'cube',
    parts: item.json.parts ?? [],
    autoRotate: item.json.autoRotate ?? true,
    ...item.json,
  }));

  return { cleanText, scenes };
}

/**
 * Quadratic Bezier Curve position calculator for smooth cursor flight
 * Directly matching math from leanring-buddy/OverlayWindow.swift:
 * B(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
 */
export function calculateBezierFlightPoint(
  start: { x: number; y: number },
  end: { x: number; y: number },
  t: number, // 0.0 to 1.0
  arcHeight: number = 60
): { x: number; y: number; scale: number; rotationDeg: number } {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const controlPoint = { x: midX, y: midY - arcHeight };

  const oneMinusT = 1 - t;
  const x = oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * controlPoint.x + t * t * end.x;
  const y = oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * controlPoint.y + t * t * end.y;

  // Tangent for rotation
  const tangentX = 2 * oneMinusT * (controlPoint.x - start.x) + 2 * t * (end.x - controlPoint.x);
  const tangentY = 2 * oneMinusT * (controlPoint.y - start.y) + 2 * t * (end.y - controlPoint.y);
  const rotationDeg = Math.atan2(tangentY, tangentX) * (180 / Math.PI) + 90;

  // Scale pulse: reaches ~1.3x at flight midpoint
  const scale = 1.0 + Math.sin(t * Math.PI) * 0.3;

  return { x, y, scale, rotationDeg };
}

/**
 * Screen-Aware Dictation Terminal Safety:
 * Collapses dangerous newlines in terminals so dictation never executes commands accidentally
 */
export function sanitizeTerminalText(input: string, isTerminalContext: boolean): string {
  if (!isTerminalContext) {
    return input;
  }
  return input.replace(/[\r\n]+/g, ' ').trim();
}
