
// Impressive, modern desktop webapp for PDF-to-3Blue1Brown-video mock "explanation chat"

import React, { useState } from "react";
import PDFUpload from "@/components/PDFUpload";
import ChatUI from "@/components/ChatUI";

const Index = () => {
  const [uploaded, setUploaded] = useState<File | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-secondary flex flex-col items-center justify-center">
      <div className="w-full flex flex-col gap-8 items-center">
        <h1 className="mt-8 text-4xl font-extrabold text-primary tracking-tight drop-shadow-sm">
          3Blue1Brown Explainer <span className="text-primary/60 font-medium">Mock</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-2 text-center max-w-xl">
          Upload a PDF and chat with our AI to receive clear, visual explanations—inspired by <span className="underline decoration-blue-400">3Blue1Brown</span>.
        </p>
        {!uploaded ? (
          <PDFUpload onUpload={setUploaded} />
        ) : (
          <div className="w-full">
            <ChatUI />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
