
import React from "react";
import YouTubeVideo from "./YouTubeVideo";

type Role = "user" | "ai";

export interface ChatMessageData {
  role: Role;
  content: string;
  videoId?: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full mb-6`}>
      <div className={`flex flex-col max-w-2xl ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`
            rounded-lg px-5 py-3 shadow-md transition
            ${isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}
            animate-fade-in
          `}
        >
          {message.content}
        </div>
        {message.role === "ai" && message.videoId && (
          <YouTubeVideo videoId={message.videoId} />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
