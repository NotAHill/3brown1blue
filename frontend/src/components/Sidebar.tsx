import React from "react";
import { Trash2, Plus, Menu } from "lucide-react";

interface Chat {
  id: string;
  pdfName: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  collapsed: boolean;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  collapsed,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onToggleCollapse,
}) => {
  return (
    <div
      className={`h-screen bg-background border-r border-muted flex flex-col transition-all duration-300 z-20 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-muted">
        <button onClick={onToggleCollapse} aria-label="Toggle sidebar">
          <Menu size={24} />
        </button>
        {!collapsed && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-secondary"
            aria-label="New chat"
          >
            <Plus size={18} />
            <span className="font-semibold">New Chat</span>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <ul className="mt-2">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-lg mb-1 transition-colors ${
                  activeChatId === chat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary"
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <span className="truncate max-w-[120px]">{chat.pdfName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="ml-2 text-muted-foreground hover:text-destructive"
                  aria-label="Delete chat"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
