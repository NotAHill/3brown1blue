import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ChatMessage, { ChatMessageData } from "./ChatMessage";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatUIProps {
  code: number | null;
  messages: ChatMessageData[];
  onSendMessage: (msg: ChatMessageData) => void;
}

const threeBlueOneBrownVideos = [
  // Just a few well-known 3Blue1Brown video IDs for example purposes
  "sULa9Lc4pck",
  "QYg3VQh3tDs",
  "aircAruvnKk",
  "fNk_zzaMoSs",
  "spUNpyF58BY",
  "bBC-nXj3Ng4",
  "zwAD6dRSVyI",
  "k7RM-ot2NWY",
];

// Demo messages to cycle through
const DEMO_MESSAGES = [
  "A vector is a mathematical quantity that has both magnitude (how much) and direction (which way). It's often represented as an arrow, where the length shows the magnitude and the arrowhead shows the direction. Vectors are used to represent things like force, velocity, or displacement in physics and engineering.",

  "Vector addition combines two or more vectors to produce a single resultant vector. This is done by placing the vectors tip to tail and drawing a new vector from the start of the first to the end of the last. It follows the triangle or parallelogram rule and is both commutative and associative.",

  "Vector Multiplication:\nThere are two main types of vector multiplication: the dot product and the cross product.\n\nThe dot product gives a scalar and measures how much two vectors point in the same direction.\n\nThe cross product gives a vector that is perpendicular to both original vectors and is used in 3D space.",
];

// Keep track of the current message index
let currentMessageIndex = 0;

const initialAIResponse = (prompt: string): ChatMessageData => {
  // For demo, just return some sample text and a random 3Blue1Brown video
  const videoId =
    threeBlueOneBrownVideos[
      Math.floor(Math.random() * threeBlueOneBrownVideos.length)
    ];
  return {
    role: "ai",
    content: `Here's an explanation inspired by 3Blue1Brown (mocked):\n\n${
      prompt ? "Let's explore your topic!" : "What would you like explained?"
    }`,
    videoId,
  };
};

const ChatUI: React.FC<ChatUIProps> = ({ code, messages, onSendMessage }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Slower progress at the start, faster in the middle, slower at the end
          const increment = prev < 30 ? 1 : prev < 70 ? 2 : 1;
          return Math.min(prev + increment, 100);
        });
      }, 80); // Update every 80ms
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleSend = async () => {
    if (!input.trim() || !code) return;
    const prompt = input.trim();
    const userMsg: ChatMessageData = {
      role: "user",
      content: prompt,
    };
    onSendMessage(userMsg);
    setInput("");
    setLoading(true);
    setPendingPrompt(prompt);
    try {
      // Add an 8-second delay
      await new Promise((resolve) => setTimeout(resolve, 8000));
      const res = await fetch("http://127.0.0.1:5000/generate_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, prompt }),
      });
      const data = await res.json();
      const aiMsg: ChatMessageData = {
        role: "ai",
        content: DEMO_MESSAGES[currentMessageIndex],
        videoId: data.video_id,
      };
      currentMessageIndex = (currentMessageIndex + 1) % DEMO_MESSAGES.length;
      onSendMessage(aiMsg);
    } catch (err) {
      const aiMsg: ChatMessageData = {
        role: "ai",
        content: "Sorry, there was an error generating the video.",
      };
      onSendMessage(aiMsg);
    } finally {
      setLoading(false);
      setProgress(0);
      setPendingPrompt(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto overflow-hidden animate-fade-in">
      <div
        className="flex-1 overflow-y-auto px-4 py-8 bg-gradient-to-b from-background to-secondary/60"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg, i) => (
          <ChatMessage message={msg} key={i} />
        ))}
        {loading && (
          <div className="flex w-full mb-6 justify-start">
            <div className="flex flex-col max-w-2xl items-start w-full">
              <div className="rounded-2xl px-5 py-3 shadow-md transition text-base leading-relaxed bg-muted text-foreground border border-muted-foreground/10 flex items-center gap-3 min-w-[180px]">
                <span className="font-semibold">cooking...</span>
                <div className="w-24 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
      <div
        className="border-t border-muted px-4 py-4 bg-background flex gap-4 items-center"
        style={{ boxShadow: "0 -2px 8px 0 rgba(0,0,0,0.03)" }}
      >
        <Input
          className="flex-1 resize-none rounded-lg outline-none bg-muted/60"
          placeholder="Ask a question about your PDF..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Type your message"
          disabled={loading}
        />
        <Button
          variant="default"
          className="ml-2 flex gap-2"
          onClick={handleSend}
          disabled={!input.trim() || loading}
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
