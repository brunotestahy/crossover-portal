export interface ApplicationFileUploadResponse {
  id: number;
  internal: boolean;
  label: string;
  name: string;
  notResume: boolean;
  resume: boolean;
  signedUrl: string;
}
