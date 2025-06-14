import React from "react";
import YouTubeVideo from "./YouTubeVideo";
import { User, Bot } from "lucide-react";

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
    <div
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3 mt-auto">
          <div className="bg-primary text-primary-foreground rounded-full w-9 h-9 flex items-center justify-center shadow">
            <Bot size={22} />
          </div>
        </div>
      )}
      <div
        className={`flex flex-col max-w-2xl ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`
            rounded-2xl px-5 py-3 shadow-md transition text-base leading-relaxed
            ${
              isUser
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border border-primary/40"
                : "bg-muted text-foreground border border-muted-foreground/10"
            }
          `}
        >
          {message.content}
        </div>
        {message.role === "ai" && message.videoId && (
          <YouTubeVideo videoId={message.videoId} />
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-3 mt-auto">
          <div className="bg-muted text-foreground rounded-full w-9 h-9 flex items-center justify-center shadow">
            <User size={22} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
