import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { convertToWebP } from '@/app/utils/imageConverter';

describe('imageConverter utility', () => {
  beforeEach(() => {
    // Mock Image object deeply
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src: string = '';

      naturalWidth = 800;
      naturalHeight = 600;

      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }

      set src(value: string) {
        this._src = value;
      }
      get src() {
        return this._src;
      }
    }

    vi.stubGlobal('Image', MockImage);

    // Mock HTMLCanvasElement
    const mockContext = {
      drawImage: vi.fn(),
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          getContext: vi.fn(() => mockContext),
          toBlob: vi.fn((callback) => {
            callback(new Blob(['mock-webp-data'], { type: 'image/webp' }));
          }),
        } as unknown as HTMLCanvasElement;
      }
      return document.createElement(tagName); // Error fallback but shouldn't hit
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('converts a valid image file to a WebP blob', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    const blob = await convertToWebP(file);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/webp');
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('handles canvas context failures', async () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      return {
        getContext: vi.fn(() => null), // Mock failure
      } as unknown as HTMLCanvasElement;
    });

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    await expect(convertToWebP(file)).rejects.toThrow('Failed to get canvas 2D context');
  });
});
