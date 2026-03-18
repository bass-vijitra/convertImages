/**
 * Converts an image file (PNG/JPG) to WebP format using the Canvas API.
 * Supports optional dimension scaling for aggressive size reduction.
 *
 * @param file - The source image file
 * @param quality - WebP quality from 0 to 1 (default: 0.8)
 * @param scale - Scale factor for dimensions, 1.0 = original size (default: 1.0)
 * @returns A Promise that resolves to the WebP Blob
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.8,
  scale: number = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to get canvas 2D context"));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert image to WebP"));
            }
          },
          "image/webp",
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/**
 * Converts an image to WebP with a target file size.
 *
 * Strategy:
 * 1. Start by finding the lowest quality that the browser can produce at full resolution.
 * 2. If even quality=0.01 at full resolution is too large, progressively
 *    scale down the image dimensions (e.g. 80%, 60%, 40%, ...) while also
 *    adjusting quality via binary search at each scale level.
 * 3. Within each scale level, use binary search on quality (max 8 iterations)
 *    to find the best quality that fits under the target size.
 *
 * This two-level approach (scale × quality) can compress multi-MB images
 * down to 85 KB or less, which quality-only adjustment cannot achieve.
 *
 * @param file - The source image file
 * @param targetSizeKB - Desired maximum output size in KB (85–300)
 * @returns A Promise that resolves to the WebP Blob closest to the target size
 */
export async function convertToWebPWithTargetSize(
  file: File,
  targetSizeKB: number
): Promise<Blob> {
  const targetBytes = targetSizeKB * 1024;

  // Phase 1: Try full resolution with quality binary search
  const fullResResult = await binarySearchQuality(file, targetBytes, 1.0);
  if (fullResResult.size <= targetBytes) {
    return fullResResult;
  }

  // Phase 2: Scale down progressively and binary search quality at each level
  const scales = [0.75, 0.5, 0.35, 0.25, 0.15, 0.1];
  let bestBlob = fullResResult;

  for (const scale of scales) {
    const result = await binarySearchQuality(file, targetBytes, scale);

    if (result.size <= targetBytes) {
      return result; // Found a fit — return immediately
    }

    // Keep the smallest result we've found so far
    if (result.size < bestBlob.size) {
      bestBlob = result;
    }
  }

  // Return the best we could find (smallest blob)
  return bestBlob;
}

/**
 * Binary search on quality parameter at a given scale to find the highest
 * quality that produces output ≤ targetBytes.
 */
async function binarySearchQuality(
  file: File,
  targetBytes: number,
  scale: number
): Promise<Blob> {
  const MAX_ITERATIONS = 8;

  // First check: does lowest quality fit?
  let bestBlob = await convertToWebP(file, 0.01, scale);
  if (bestBlob.size <= targetBytes) {
    // We can fit — now find the highest quality that still fits
    let low = 0.01;
    let high = 1.0;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const mid = (low + high) / 2;
      const blob = await convertToWebP(file, mid, scale);

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        low = mid; // Try higher quality
      } else {
        high = mid; // Try lower quality
      }

      // Close enough (within 5% of target)
      if (blob.size <= targetBytes && (targetBytes - blob.size) / targetBytes < 0.05) {
        bestBlob = blob;
        break;
      }
    }
  }

  return bestBlob;
}
