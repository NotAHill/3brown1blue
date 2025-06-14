
import React, { useState } from "react";
import PDFUpload from "@/components/PDFUpload";
import ChatUI from "@/components/ChatUI";

const Index = () => {
  const [uploaded, setUploaded] = useState<File | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-secondary flex flex-col items-center justify-start">
      <div className="w-full flex flex-col gap-8 items-center pt-4">
        <h1 className="mt-2 text-4xl font-extrabold text-primary tracking-tight drop-shadow-sm">
          4Blue1Brown
        </h1>
        {!uploaded && (
          <p className="text-lg text-muted-foreground mb-2 text-center max-w-xl">
            Upload a PDF and chat with our AI to receive clear, visual explanations—inspired by <span className="underline decoration-blue-400">3Blue1Brown</span>.
          </p>
        )}
        {!uploaded ? (
          <PDFUpload onUpload={setUploaded} />
        ) : (
          <div className="w-full flex-1 flex justify-center items-start">
            <ChatUI />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
