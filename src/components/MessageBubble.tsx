import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex items-end space-x-3 animate-fade-in ${
        message.isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!message.isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
          <Bot className="text-white" size={16} />
        </div>
      )}
      
      <div
        className={`max-w-xs lg:max-w-md px-5 py-3 shadow-lg ${
          message.isUser
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl rounded-br-lg'
            : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-3xl rounded-bl-lg border border-indigo-100'
        }`}
      >
        <div className="break-words whitespace-pre-wrap leading-relaxed">{message.content}</div>
        <div
          className={`text-xs mt-2 ${
            message.isUser ? 'text-indigo-100' : 'text-gray-400'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {message.isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
          <User className="text-white" size={16} />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;