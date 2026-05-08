"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Loader2, FileText, Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are VitalSync AI, a helpful medical assistant embedded in the VitalSync healthcare dashboard.
You help patients, doctors, and admin staff with:
- Understanding medical terms and conditions
- General health and wellness advice
- Navigating the VitalSync platform
- Explaining lab values and metrics
- Appointment and scheduling guidance

SUMMARY & REPORTING:
- You can provide detailed health summaries. 
- If a user asks for a summary, synthesize their recent queries or metrics into a clear, professional overview.
- If asked for a "PDF" or "Downloadable report", provide the text summary and remind them to click the download icon next to your message to save it as a file.

Keep responses concise, empathetic, and professional. Always remind users to consult their healthcare provider for medical decisions.
Format responses with clear paragraphs. Do not use excessive markdown symbols.`;

export default function AIChatbot() {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm VitalSync AI, your personal health assistant. I can help you understand your health metrics, explain medical terms, or provide a summary of your health data. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const hideOn = ["/login", "/signin", "/"];
  if (!mounted || !isAuthenticated || hideOn.includes(pathname)) return null;

  const downloadAsPDF = async (content: string) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 159, 122); // --brand color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("VitalSync Health Summary", 20, 25);
    
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 32);
    
    // Body
    doc.setTextColor(16, 35, 28); // --foreground
    doc.setFontSize(12);
    
    // Split text to fit page width
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 55);
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(93, 115, 104); // --muted
    doc.text("For medical emergencies, call 911. This summary is AI-generated and not a substitute for professional medical advice.", 20, pageHeight - 20, { maxWidth: 170 });
    
    doc.save("VitalSync_Health_Summary.pdf");
    toast.success("PDF report downloaded successfully!");
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here" || !apiKey.startsWith("AIza")) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        { 
          role: "assistant", 
          content: "⚠️ **API Key Required**: Please provide a valid Gemini API key in your `.env.local` file. You can get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey)." 
        }
      ]);
      setInput("");
      return;
    }

    const userMessage: Message = { role: "user", content: text };
    const currentMessages = [...messages, userMessage];
    
    setMessages(currentMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Filter out error messages and skip the initial greeting
      const validHistory = currentMessages
        .slice(1, -1) // exclude the greeting and the newly added user message
        .filter(m => !m.content.includes("❌") && !m.content.includes("⚠️"));

      const history = validHistory.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      // Initialize the open-source Google Generative AI SDK
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: SYSTEM_PROMPT,
      });

      const chatSession = model.startChat({
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
        history: history,
      });

      const result = await chatSession.sendMessage(text);
      const aiText = result.response.text();

      if (!aiText) {
        throw new Error("The AI returned an empty response. This might be due to safety filters.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiText },
      ]);
    } catch (error: any) {
      console.error("Gemini API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ **Assistant Error**: ${error.message || "I encountered an unexpected issue."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI assistant"
        className={`fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? "rotate-90 bg-[var(--danger)] shadow-[var(--danger)]/30"
            : "bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] shadow-[var(--brand)]/40 hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] shadow-2xl transition-all duration-300 sm:right-6 sm:w-96 ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-6 opacity-0 pointer-events-none"
        }`}
        style={{ maxHeight: "min(520px, 75vh)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--line)] bg-gradient-to-r from-[var(--brand)]/10 to-[var(--accent)]/10 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] shadow-lg shadow-[var(--brand)]/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[var(--foreground)]">VitalSync AI</p>
            <p className="text-xs text-[var(--brand)]">● Online · Powered by Gemini</p>
          </div>
          <button 
            onClick={() => downloadAsPDF(messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n"))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] hover:bg-[var(--line)] transition-colors"
            title="Download full conversation as PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4" style={{ maxHeight: "calc(75vh - 160px)" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--accent)]">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div className="group relative max-w-[80%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white"
                      : "rounded-tl-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)]"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "assistant" && (
                  <button 
                    onClick={() => downloadAsPDF(msg.content)}
                    className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-[var(--muted)] hover:text-[var(--brand)]"
                    title="Download this summary as PDF"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--accent)]">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--brand)]" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--brand)]" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--brand)]" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[var(--line)] p-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 transition-all focus-within:border-[var(--brand)]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a health summary..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white transition-all disabled:opacity-40 hover:bg-[var(--brand-strong)] active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--muted)]">
            For emergencies, call 911. AI advice is not a substitute for professional care.
          </p>
        </div>
      </div>
    </>
  );
}
