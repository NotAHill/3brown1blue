
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ChatMessage, { ChatMessageData } from "./ChatMessage";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const threeBlueOneBrownVideos = [
  // Just a few well-known 3Blue1Brown video IDs for example purposes
  "sULa9Lc4pck",
  "QYg3VQh3tDs",
  "aircAruvnKk",
  "fNk_zzaMoSs",
  "spUNpyF58BY",
  "bBC-nXj3Ng4",
  "zwAD6dRSVyI",
  "k7RM-ot2NWY"
];

const initialAIResponse = (prompt: string): ChatMessageData => {
  // For demo, just return some sample text and a random 3Blue1Brown video
  const videoId = threeBlueOneBrownVideos[Math.floor(Math.random() * threeBlueOneBrownVideos.length)];
  return {
    role: "ai",
    content: `Here's an explanation inspired by 3Blue1Brown (mocked):\n\n${prompt ? "Let's explore your topic!" : "What would you like explained?"}`,
    videoId
  };
};

interface ChatUIProps {
  initialPrompt?: string;
}

const ChatUI: React.FC<ChatUIProps> = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      role: "ai",
      content: "Hello! Upload your PDF and ask me anything — I'll reply with an explanation and a 3Blue1Brown-style video.",
      videoId: undefined
    }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessageData = {
      role: "user",
      content: input.trim()
    };
    const aiMsg: ChatMessageData = initialAIResponse(input.trim());

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-[70vh] bg-card border border-muted rounded-xl shadow-xl overflow-hidden animate-fade-in">
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.map((msg, i) => (
          <ChatMessage message={msg} key={i} />
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="border-t border-muted px-6 py-4 bg-background flex gap-4 items-center">
        <Input
          className="flex-1 resize-none rounded-lg outline-none"
          placeholder="Ask a question about your PDF..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Type your message"
        />
        <Button
          variant="default"
          className="ml-2 flex gap-2"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <MessageCircle size={20} />
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatUI;
