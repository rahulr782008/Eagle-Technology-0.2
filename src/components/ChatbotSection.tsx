import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Code2, GraduationCap, Lightbulb, Calculator, Volume2, VolumeX, Copy, Check, Trash2, Download, Mic, MicOff, Globe, MapPin, Cpu, Radio } from 'lucide-react';
import { ChatMessage, ChatMode } from '../types';

export const ChatbotSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Welcome to Eagle AI Intelligence 🦅\n\nI am your versatile AI ecosystem on **Eagle Technology**, engineered by **Rahul R** (B.Tech IT, Arunai Engineering College).\n\nNow equipped with:\n- **Advanced Model Selection**: \`gemini-3.1-pro-preview\` (Complex reasoning), \`gemini-3.5-flash\` (Balanced), and \`gemini-3.1-flash-lite\` (Ultra-fast).\n- **Real-Time Grounding**: Live **Google Search** and **Google Maps** data retrieval.\n- **Audio Transcription**: Powered by \`gemini-3.5-transcribe\`.\n\n*Select a model or grounding mode above and ask anything to begin!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'general',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>('general');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [grounding, setGrounding] = useState<'none' | 'search' | 'maps'>('none');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [liveVoiceMode, setLiveVoiceMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const modes: { id: ChatMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'general', label: 'General AI', icon: Bot, desc: 'Omni reasoning & general inquiries' },
    { id: 'coding', label: 'Coding & Arch', icon: Code2, desc: 'Debugging, algorithms & clean code' },
    { id: 'education', label: 'Education & STEM', icon: GraduationCap, desc: 'Concept breakdowns & study companion' },
    { id: 'creative', label: 'Creative Media', icon: Lightbulb, desc: 'Photo/video ideas & visual prompts' },
    { id: 'math', label: 'Math & Logic', icon: Calculator, desc: 'Calculus & step-by-step proofs' },
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: activeMode,
          modelChoice: selectedModel,
          grounding,
        }),
      });

      const data = await response.json();
      let reply = data.reply || data.error || 'Eagle AI received your transmission.';

      // Append search or maps citations if returned
      if (data.groundingSources && data.groundingSources.length > 0) {
        reply += '\n\n**Grounded References:**\n' + data.groundingSources.map((s: any) => `- [${s.title}](${s.uri})`).join('\n');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If Live Voice Mode is active, read the reply out loud
      if (liveVoiceMode) {
        handleToggleSpeech(assistantMessage.id, reply);
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Eagle AI connection error. Please verify network status or server availability.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Real Audio Recording & Transcription via gemini-3.5-transcribe
  const handleToggleAudioRecording = async () => {
    if (isRecordingAudio) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecordingAudio(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            setIsLoading(true);
            try {
              const res = await fetch('/api/transcribe-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' }),
              });
              const data = await res.json();
              if (data.transcript) {
                setInput(data.transcript);
                // In live voice mode, auto-submit
                if (liveVoiceMode) {
                  handleSend(data.transcript);
                }
              }
            } catch (err) {
              console.error('Transcription error:', err);
            } finally {
              setIsLoading(false);
            }
          };

          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecordingAudio(true);
      } catch (err) {
        alert('Microphone access is required to transcribe audio.');
      }
    }
  };

  // Text-To-Speech
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[.*?\]\(.*?\)/g, '').replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setIsSpeakingId(msgId);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-cyan-500/20 bg-[#070b14]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-xs font-mono text-cyan-400 border-b border-cyan-500/15">
              <span>{lang || 'code'}</span>
              <button
                onClick={() => handleCopy(`code-${index}`, code)}
                className="hover:text-white flex items-center gap-1"
              >
                {copiedId === `code-${index}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === `code-${index}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 text-xs sm:text-sm text-cyan-200 overflow-x-auto font-mono">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={index} className="space-y-2 text-sm sm:text-base leading-relaxed">
          {part.split('\n\n').map((paragraph, pIdx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h4 key={pIdx} className="text-base sm:text-lg font-bold text-white mt-2 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {paragraph.replace('### ', '')}
                </h4>
              );
            }
            return (
              <p
                key={pIdx}
                dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline hover:text-cyan-300">$1</a>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="text-cyan-300">$1</em>'),
                }}
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <section id="chatbot" className="py-20 relative bg-[#060912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multimodal Neural Intelligence & Grounding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Eagle AI <span className="text-cyan-400">Chatbot Interface</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Multi-turn conversation engine featuring Gemini Pro, Flash Lite, Google Search & Maps Grounding, and Audio Transcription.
          </p>
        </div>

        {/* Model & Grounding Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl glass-panel border border-cyan-500/20">
          
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-bold">Engine:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="glass-input text-xs py-1.5 px-3 rounded-lg font-mono text-cyan-300"
            >
              <option value="gemini-3.5-flash" className="bg-[#070b14]">gemini-3.5-flash (Balanced & Grounded)</option>
              <option value="gemini-3.1-pro-preview" className="bg-[#070b14]">gemini-3.1-pro-preview (Deep Reasoning & Code)</option>
              <option value="gemini-3.1-flash-lite" className="bg-[#070b14]">gemini-3.1-flash-lite (Ultra Fast)</option>
            </select>
          </div>

          {/* Grounding Tool Toggles */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Grounding:</span>
            <button
              onClick={() => setGrounding(grounding === 'search' ? 'none' : 'search')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                grounding === 'search'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Search</span>
            </button>
            <button
              onClick={() => setGrounding(grounding === 'maps' ? 'none' : 'maps')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                grounding === 'maps'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </button>

            {/* Live Voice Mode Toggle */}
            <button
              onClick={() => setLiveVoiceMode(!liveVoiceMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                liveVoiceMode
                  ? 'bg-rose-500 text-white font-bold animate-pulse'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
              title="Continuous Live Speech Conversation"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live Voice: {liveVoiceMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>

        </div>

        {/* Mode Selector Segmented Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 scale-[1.02]'
                    : 'glass-panel text-slate-300 hover:text-white hover:border-cyan-500/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Window Box */}
        <div className="rounded-2xl glass-panel-glow border border-cyan-500/20 overflow-hidden flex flex-col h-[680px]">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 sm:gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isAssistant ? '' : 'text-right'}`}>
                    <div
                      className={`p-4 rounded-2xl text-left ${
                        isAssistant
                          ? 'glass-panel border-cyan-500/20 text-slate-200 shadow-md'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/10'
                      }`}
                    >
                      {renderMessageContent(message.content)}
                    </div>

                    <div className={`flex items-center gap-3 text-[11px] font-mono text-slate-400 ${isAssistant ? 'justify-start pl-1' : 'justify-end pr-1'}`}>
                      <span>{message.timestamp}</span>
                      {isAssistant && (
                        <>
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            {copiedId === message.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === message.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => handleToggleSpeech(message.id, message.content)}
                            className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            {isSpeakingId === message.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-cyan-400" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-center text-cyan-400 font-mono text-xs pl-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Eagle Neural Engine formulating response ({selectedModel})...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-[#070b14] border-t border-cyan-500/15">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleAudioRecording}
                className={`p-2.5 rounded-xl border transition-all ${
                  isRecordingAudio
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'glass-panel text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                }`}
                title={isRecordingAudio ? 'Stop Recording' : 'Record Audio with gemini-3.5-transcribe'}
              >
                {isRecordingAudio ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecordingAudio ? 'Recording audio for transcription...' : `Ask Eagle AI (${selectedModel})...`}
                className="flex-1 glass-input py-2.5 px-4 rounded-xl text-sm"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <span className="hidden sm:inline text-xs font-semibold">Transmit</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
