"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureAllScreens = captureAllScreens;
const electron_1 = require("electron");
async function captureAllScreens() {
    const displays = electron_1.screen.getAllDisplays();
    const sources = await electron_1.desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 },
    });
    const results = [];
    for (let i = 0; i < displays.length; i++) {
        const display = displays[i];
        const source = sources.find((s) => s.display_id === display.id.toString()) || sources[i] || sources[0];
        if (source) {
            results.push({
                displayId: display.id.toString(),
                name: source.name,
                screenIndex: i,
                width: display.bounds.width,
                height: display.bounds.height,
                scaleFactor: display.scaleFactor,
                dataUrl: source.thumbnail.toDataURL(),
            });
        }
    }
    return results;
}
