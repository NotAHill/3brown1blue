import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFUploadProps {
  onUpload: (file: File, code: number) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUpload(file, data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    uploadFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-colors w-full max-w-xl mx-auto
        ${dragActive ? "border-primary bg-secondary" : "border-muted"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={handleDrop}
      tabIndex={0}
    >
      {isLoading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary mb-4 animate-spin" />
          <p className="text-lg font-semibold mb-2">Uploading...</p>
          <p className="text-muted-foreground">
            Please wait while we process your file
          </p>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 text-primary mb-4" />
          <p className="text-lg font-semibold mb-2">Upload your PDF</p>
          <p className="text-muted-foreground mb-6">
            Drag and drop or click to select a file
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleChange}
            aria-label="Upload PDF"
          />
          <Button
            className="px-6 py-2"
            onClick={() => inputRef.current?.click()}
            variant="default"
          >
            Choose PDF
          </Button>
        </>
      )}
      {error && <p className="text-red-500 mt-2 animate-fade-in">{error}</p>}
    </div>
  );
};

export default PDFUpload;
