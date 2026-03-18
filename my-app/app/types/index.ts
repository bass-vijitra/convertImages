export type ConvertStatus = "pending" | "converting" | "success" | "error";

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
  status: ConvertStatus;
  targetSizeKB: number; // Target output size in KB (85–300)
  convertedBlob?: Blob;
  errorMessage?: string;
}
