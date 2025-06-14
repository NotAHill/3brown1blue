import React, { useState } from "react";
import PDFUpload from "@/components/PDFUpload";
import ChatUI from "@/components/ChatUI";
import Sidebar from "@/components/Sidebar";
import { v4 as uuidv4 } from "uuid";

interface Chat {
  id: string;
  pdfName: string;
  code: number;
  messages: any[];
}

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUpload, setShowUpload] = useState(true);

  const handleUpload = (file: File, uploadCode: number) => {
    const newChat: Chat = {
      id: uuidv4(),
      pdfName: file.name,
      code: uploadCode,
      messages: [
        {
          role: "ai",
          content: `Hello! Your document has been processed with code ${uploadCode}. Ask me anything about it — I'll reply with an explanation and a 3Blue1Brown-style video.`,
          videoId: undefined,
        },
      ],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarCollapsed(true); // Collapse sidebar after upload
    setShowUpload(false);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowUpload(false);
  };

  const handleNewChat = () => {
    setShowUpload(true);
    setActiveChatId(null);
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) {
      setActiveChatId(
        chats.length > 1
          ? chats.find((chat) => chat.id !== id)?.id || null
          : null
      );
      setShowUpload(true);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed((c) => !c);
  };

  // Find the active chat
  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  // Handle message sending in ChatUI
  const handleSendMessage = (msg: any) => {
    if (!activeChat) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-secondary">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        collapsed={sidebarCollapsed}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onToggleCollapse={handleToggleSidebar}
      />
      <div className="flex-1 flex flex-col items-center justify-start">
        <button
          onClick={handleNewChat}
          className="hover:opacity-80 transition-opacity mt-4 mb-2 self-center"
        >
          <h1 className="text-4xl font-extrabold text-primary tracking-tight drop-shadow-sm">
            4Blue1Brown
          </h1>
        </button>
        {showUpload ? (
          <>
            <p className="text-lg text-muted-foreground mb-2 text-center max-w-xl">
              Upload a PDF and chat with our AI to receive clear, visual
              explanations—inspired by{" "}
              <span className="underline decoration-blue-400">3Blue1Brown</span>
              .
            </p>
            <PDFUpload onUpload={handleUpload} />
          </>
        ) : (
          activeChat && (
            <div className="w-full flex-1 flex justify-center items-start">
              <ChatUI
                code={activeChat.code}
                messages={activeChat.messages}
                onSendMessage={handleSendMessage}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Index;
