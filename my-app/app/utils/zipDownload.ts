import JSZip from "jszip";

interface ZipFile {
  name: string;
  blob: Blob;
}

/**
 * Generates a ZIP blob from an array of converted image blobs.
 * Call this BEFORE the user clicks download so the blob is ready.
 * @param files - Array of objects with filename and blob data
 * @returns The ZIP blob ready to be downloaded
 */
export async function generateZipBlob(files: ZipFile[]): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    const webpName = file.name.replace(/\.(png|jpe?g)$/i, ".webp");
    zip.file(webpName, file.blob);
  }

  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/zip",
  });
}

/**
 * Triggers an immediate file download.
 * Uses a Base64 Object URL fallback if Blob URL download is blocked.
 * @param blob - The blob to download
 * @param fileName - The desired filename
 */
export function triggerDownload(blob: Blob, fileName: string): void {
  // Method 1: Standard Blob Approach
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  
  try {
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (err) {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Method 2: Fallback to Base64 (Data URL) if Blob is blocked
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fallbackLink = document.createElement("a");
      fallbackLink.href = dataUrl;
      fallbackLink.download = fileName;
      fallbackLink.style.display = "none";
      document.body.appendChild(fallbackLink);
      
      try {
        fallbackLink.click();
      } catch (e) {
        // Method 3: Absolute fallback (opens in new tab)
        window.open(dataUrl, '_blank');
      } finally {
        setTimeout(() => {
          if (document.body.contains(fallbackLink)) {
            document.body.removeChild(fallbackLink);
          }
        }, 1000);
      }
    };
    reader.readAsDataURL(blob);
  }
}
