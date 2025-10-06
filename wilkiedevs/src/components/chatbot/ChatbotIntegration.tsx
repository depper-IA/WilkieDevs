'use client';

import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import ChatProvider from './ChatProvider';

interface ChatbotIntegrationProps {
  className?: string;
}

export default function ChatbotIntegration({ className }: ChatbotIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ChatProvider>
      <ChatWidget
        isOpen={isOpen}
        onToggle={handleToggle}
        className={className}
      />
    </ChatProvider>
  );
}