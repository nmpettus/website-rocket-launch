import { useState, useRef, useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMaggieChat } from "@/hooks/useMaggieChat";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

// Function to parse markdown links and render them as clickable
const renderMessageWithLinks = (content: string): ReactNode => {
  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    
    // Add the link as a clickable element
    const [, linkText, url] = match;
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sage-dark underline hover:text-sage font-medium"
      >
        {linkText}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};

const AskMaggie = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, clearChat } = useMaggieChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useSEO({
    title: "Ask Maggie a Bible Question | Maggie's Bible Adventures",
    description: "Chat with Maggie the Yorkie Poo about Bible stories, characters, and lessons. Get child-friendly answers to your Bible questions!",
    keywords: ["Bible questions for kids", "children's Bible chat", "Maggie chatbot", "Bible stories", "faith-based learning"],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream/50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="text-sage-dark hover:text-sage hover:bg-sage/10 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <img
              src="/illustrations/mSmile1.jpg"
              alt="Maggie"
              className="w-10 h-10 rounded-full object-cover border-2 border-rose/30 shadow-sm"
            />
            <div className="hidden sm:block">
              <h1 className="font-heading text-lg font-semibold text-charcoal">
                Ask Maggie
              </h1>
              <p className="text-xs text-muted-foreground">
                Your Bible friend
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Clear</span>
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-3xl overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="relative mb-6">
                <img
                  src="/illustrations/mSmile1.jpg"
                  alt="Maggie"
                  className="w-32 h-32 rounded-full object-cover border-4 border-rose/30 shadow-lg"
                />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-gold animate-pulse" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">
                Hi there! I'm Maggie! 🐕
              </h2>
              <p className="text-muted-foreground max-w-md mb-6">
                I love telling Bible stories to children! Ask me anything about the Bible, 
                God's love, or any of my favorite stories like Noah's Ark or Creation!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Tell me about Creation",
                  "Who was Noah?",
                  "What's the story of Jonah?",
                  "Tell me about Jesus",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="border-sage/30 hover:bg-sage/10 hover:border-sage text-charcoal"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <img
                      src="/illustrations/mSmile1.jpg"
                      alt="Maggie"
                      className="w-8 h-8 rounded-full object-cover border border-rose/30 flex-shrink-0 mt-1"
                    />
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%] shadow-sm",
                      msg.role === "user"
                        ? "bg-sage text-white rounded-br-md"
                        : "bg-white border border-sage/20 text-charcoal rounded-bl-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.role === "assistant" ? renderMessageWithLinks(msg.content) : msg.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                  <img
                    src="/illustrations/mSmile1.jpg"
                    alt="Maggie"
                    className="w-8 h-8 rounded-full object-cover border border-rose/30 flex-shrink-0 mt-1"
                  />
                  <div className="bg-white border border-sage/20 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Maggie is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-sage/10">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Maggie a Bible question..."
            disabled={isLoading}
            className="flex-1 border-sage/30 focus-visible:ring-sage bg-white"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gold hover:bg-gold-dark text-charcoal px-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AskMaggie;
