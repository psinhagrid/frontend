import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end space-x-3 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-gray-400 focus-within:shadow-md transition-all">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message ChatGPT..."
          disabled={disabled}
          rows={1}
          className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none resize-none disabled:cursor-not-allowed placeholder-gray-500 text-gray-900"
          style={{ 
            maxHeight: '200px',
            minHeight: '24px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 200) + 'px';
          }}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="m-2 p-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <Send size={16} className={message.trim() && !disabled ? 'text-gray-700' : 'text-gray-400'} />
        </button>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        ChatGPT can make mistakes. Consider checking important information.
      </div>
    </form>
  );
};

export default ChatInput;