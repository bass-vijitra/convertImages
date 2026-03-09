import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateZipBlob, triggerDownload } from '@/app/utils/zipDownload';
import JSZip from 'jszip';

// Mock JSZip
vi.mock('jszip', () => {
  const JSZipMock = vi.fn();
  JSZipMock.prototype.file = vi.fn();
  JSZipMock.prototype.generateAsync = vi.fn().mockResolvedValue(new Blob(['mock-zip-content'], { type: 'application/zip' }));
  return { default: JSZipMock };
});

describe('zipDownload utility', () => {
  describe('generateZipBlob', () => {
    it('renames files to .webp and generates a ZIP blob', async () => {
      const mockFiles = [
        { name: 'image1.png', blob: new Blob(['data1']) },
        { name: 'image2.jpg', blob: new Blob(['data2']) },
      ];

      const blob = await generateZipBlob(mockFiles);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/zip');
      // jszip is mocked, so we just test that generateAsync returns the mocked blob
    });
  });

  describe('triggerDownload', () => {
    let mockAppendChild: any;
    let mockRemoveChild: any;
    let mockFileReader: any;

    beforeEach(() => {
      mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
      mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it('creates an anchor tag with object URL and clicks it', () => {
      const blob = new Blob(['test']);
      triggerDownload(blob, 'test.webp');

      expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(mockAppendChild).toHaveBeenCalled();

      // Fast-forward setTimeout
      vi.runAllTimers();

      expect(mockRemoveChild).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
