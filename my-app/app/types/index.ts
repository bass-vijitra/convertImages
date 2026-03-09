export type ConvertStatus = "pending" | "converting" | "success" | "error";

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
  status: ConvertStatus;
  convertedBlob?: Blob;
  errorMessage?: string;
}
