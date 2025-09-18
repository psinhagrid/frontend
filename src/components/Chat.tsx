import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Message, Conversation } from '../types';
import { createSession, sendQuery } from '../services/api';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const generateTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  const createNewConversation = async (): Promise<string> => {
    try {
      const sessionId = await createSession();
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: 'New chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        sessionId,
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      return newConversation.id;
    } catch (err) {
      throw new Error('Failed to create new conversation');
    }
  };

  const handleNewChat = async () => {
    try {
      setError(null);
      await createNewConversation();
      setSidebarOpen(false);
    } catch (err) {
      setError('Failed to create new chat. Please try again.');
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setSidebarOpen(false);
    setError(null);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRenameConversation = (conversationId: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, title: newTitle, updatedAt: new Date() }
          : c
      )
    );
  };

  const handleSendMessage = async (messageContent: string) => {
    if (isLoading) return;

    let conversationId = currentConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      try {
        conversationId = await createNewConversation();
      } catch (err) {
        setError('Failed to create conversation. Please try again.');
        return;
      }
    }

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date(),
    };

    // Update conversation with user message
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              title: c.messages.length === 0 ? generateTitle(messageContent) : c.title,
              updatedAt: new Date(),
            }
          : c
      )
    );

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendQuery(messageContent, conversation.sessionId);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      // Update conversation with AI response
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages.filter(m => m.id !== userMessage.id), userMessage, aiMessage],
                updatedAt: new Date(),
              }
            : c
        )
      );
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Query error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Create initial conversation
        await createNewConversation();
        setError(null);
      } catch (err) {
        setError('Failed to initialize chat. Please refresh the page.');
        console.error('Initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing ChatGPT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatArea
          messages={currentConversation?.messages || []}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          disabled={isLoading || !currentConversationId}
        />
        
        {error && (
          <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 text-red-700 shadow-lg z-50">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;