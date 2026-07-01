import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/providers/trpc';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  Clock,
  Copy,
  Check,
  Trash2,
  Download,
  Share2,
  Sprout,
  Droplets,
  Building2,
  Sun,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SUGGESTION_ICONS: Record<string, React.ElementType> = {
  'monsoon': Sun,
  'heat': Sprout,
  'rice': Sprout,
  'water': Droplets,
  'urban': Building2,
  'drought': Sun,
};

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export default function AIAssistantPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestionsQuery = trpc.ai.getSuggestions.useQuery();
  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    setSessionId(`session-${Date.now()}`);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content,
      createdAt: new Date(),
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setMessage('');

    try {
      const response = await chatMutation.mutateAsync({
        message: content,
        sessionId,
      });

      const assistantMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        createdAt: new Date(),
      };
      setChatHistory((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        createdAt: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  const copyMessage = (content: string, id: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setChatHistory([]);
    setSessionId(`session-${Date.now()}`);
  };

  const exportChat = () => {
    const text = chatHistory
      .map((m) => `${m.role.toUpperCase()} (${m.createdAt.toLocaleTimeString()}):\n${m.content}`)
      .join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indra-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSuggestionIcon = (text: string) => {
    for (const [key, Icon] of Object.entries(SUGGESTION_ICONS)) {
      if (text.toLowerCase().includes(key)) return Icon;
    }
    return Sparkles;
  };

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 mb-4">
            <Brain size={12} className="mr-1" /> CLIMATE INTELLIGENCE
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-white mb-4">
            Indra AI Assistant
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Converse with India's climate digital twin. Ask about monsoons, crop yields, urban heat, water resources, and receive AI-generated analysis with actionable insights.
          </p>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar */}
            <Card className="lg:col-span-1 bg-white/[0.03] border-white/10 h-fit">
              <CardContent className="p-4">
                <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">Quick Prompts</h3>
                <div className="space-y-2">
                  {suggestionsQuery.data?.map((suggestion: string, i: number) => {
                    const Icon = getSuggestionIcon(suggestion);
                    return (
                      <button
                        key={i}
                        onClick={() => sendMessage(suggestion)}
                        className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-xs text-white/70 hover:text-white flex items-start gap-2"
                      >
                        <Icon size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </button>
                    );
                  }) || (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="my-4 bg-white/10" />

                <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={clearChat}
                    className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-xs text-white/70 hover:text-white flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Clear Chat
                  </button>
                  <button
                    onClick={exportChat}
                    className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-xs text-white/70 hover:text-white flex items-center gap-2"
                  >
                    <Download size={12} /> Export Chat
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3 bg-white/[0.03] border-white/10 flex flex-col" style={{ minHeight: '500px' }}>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                      <Brain size={32} className="text-indigo-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Start a Conversation</h3>
                    <p className="text-white/40 text-sm max-w-md">
                      Ask Indra about India's climate system. Try questions about monsoon forecasts, crop yields, urban heat, or water resources.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <Brain size={16} className="text-indigo-400" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          msg.role === 'user'
                            ? 'bg-indigo-600/30 text-white'
                            : 'bg-white/5 text-white/90'
                        }`}
                      >
                        <div className="text-sm prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-white/30">
                            <Clock size={8} className="inline mr-1" />
                            {msg.createdAt.toLocaleTimeString()}
                          </span>
                          {msg.role === 'assistant' && (
                            <button
                              onClick={() => copyMessage(msg.content, msg.id)}
                              className="text-white/30 hover:text-white/60 transition-colors"
                            >
                              {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                            </button>
                          )}
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">You</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
                {chatMutation.isPending && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Brain size={16} className="text-indigo-400" />
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <Loader2 size={16} className="animate-spin text-indigo-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-white/10 p-4">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about India's climate..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    disabled={chatMutation.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || chatMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    {chatMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
