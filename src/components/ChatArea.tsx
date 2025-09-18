import React, { useRef, useEffect } from 'react';
import { Bot, User, Menu } from 'lucide-react';
import { Message } from '../types';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onToggleSidebar: () => void;
  disabled: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onToggleSidebar,
  disabled,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">ChatGPT</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="text-gray-600" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How can I help you today?
              </h2>
              <p className="text-gray-600">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`py-8 px-4 ${
                  message.isUser ? 'bg-gray-50' : 'bg-white'
                } ${index !== messages.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {message.isUser ? (
                      <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                        <User className="text-white" size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-green-600 rounded-sm flex items-center justify-center">
                        <Bot className="text-white" size={18} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="py-8 px-4 bg-white border-b border-gray-100">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-sm flex items-center justify-center">
                      <Bot className="text-white" size={18} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput
            onSendMessage={onSendMessage}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;