import { desktopCapturer, screen } from 'electron';

export interface ScreenCaptureResult {
  displayId: string;
  name: string;
  screenIndex: number;
  width: number;
  height: number;
  scaleFactor: number;
  dataUrl: string;
}

export async function captureAllScreens(): Promise<ScreenCaptureResult[]> {
  const displays = screen.getAllDisplays();
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: 1920, height: 1080 },
  });

  const results: ScreenCaptureResult[] = [];

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
