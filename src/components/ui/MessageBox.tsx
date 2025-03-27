"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type MessageTypes = "success" | "error" | "info";

export interface MessageProps {
  type: MessageTypes;
  message: string;
  duration?: number;
}

let showMessageCallback:
  | ((message: MessageProps & { id: number }) => void)
  | null = null;

export const showMessage = (message: MessageProps) => {
  if (showMessageCallback) {
    showMessageCallback({ ...message, id: Math.random() });
  }
};

const MessageBox = () => {
  const [messages, setMessages] = useState<(MessageProps & { id: number })[]>(
    []
  );

  useEffect(() => {
    showMessageCallback = (props: MessageProps & { id: number }) => {
      setMessages((prev) => [...prev, { ...props }]);

      if (props.duration !== 0) {
        setTimeout(() => {
          setMessages((prev) => prev.filter((m) => m.id !== props.id));
        }, props.duration || 5000);
      }
    };

    return () => {
      showMessageCallback = null;
    };
  }, []);

  const getBackgroundColor = (type: MessageTypes) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-500 text-green-700";
      case "error":
        return "bg-rose-50 border-rose-500 text-rose-700";
      case "info":
        return "bg-purple-50 border-purple-500 text-purple-700";
      default:
        return "bg-gray-50 border-gray-500 text-gray-700";
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`mb-2 p-2 rounded-md border-2 border-dashed shadow-md flex items-center ${getBackgroundColor(
              msg.type
            )}`}
          >
            <div className="flex-1">{msg.message}</div>
            <button
              onClick={() =>
                setMessages((prev) => prev.filter((m) => m.id !== msg.id))
              }
              className="ml-2 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageBox;
