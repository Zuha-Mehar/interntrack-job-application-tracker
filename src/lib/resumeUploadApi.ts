type UploadResumeResponse = {
  success: boolean;
  message: string;
  data: {
    resumeFileName: string;
    resumeUrl: string;
  };
  error?: string;
};

export async function uploadResumePdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-resume", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as UploadResumeResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.error || result.message || "Failed to upload resume");
  }

  return result.data;
}