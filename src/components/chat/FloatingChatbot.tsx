import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../context/ProjectContext';
import { generateChatResponse } from '../../services/ai';
import { MessageSquare, X, Send, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../../types';

export default function FloatingChatbot() {
    const { activeProject, updateProject, apiKey } = useProjects();
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeProject?.chatHistory, isOpen, isTyping]);

    if (!activeProject || !apiKey) return null;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: inputText,
            timestamp: new Date().toISOString()
        };

        const updatedHistory = [...activeProject.chatHistory, userMessage];
        updateProject(activeProject.id, { chatHistory: updatedHistory });
        setInputText("");
        setIsTyping(true);

        const tempProject = { ...activeProject, chatHistory: updatedHistory };
        const result = await generateChatResponse(apiKey, tempProject, userMessage.content);

        const projectUpdates: any = {
            chatHistory: [...updatedHistory, result.message]
        };

        if (result.updates) {
            Object.assign(projectUpdates, result.updates);
        }

        updateProject(activeProject.id, projectUpdates);
        setIsTyping(false);
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        >
            {isOpen ? (
                <div className="glass-card w-[380px] h-[600px] flex flex-col border border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="p-4 bg-slate-900/80 rounded-t-2xl border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-white">Waymaker AI</h3>
                                <p className="text-xs text-slate-400">Project Consultant</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeProject.chatHistory.length === 0 && (
                            <div className="text-center text-slate-400 mt-10 text-sm">
                                Ask me anything about <span className="text-primary">{activeProject.name}</span>. I can analyze competitors, brainstorm ideas, or rewrite headlines!
                            </div>
                        )}
                        {activeProject.chatHistory.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-primary text-slate-900'}`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-slate-900/50 border border-white/5 text-slate-200 rounded-tl-sm'}`}>
                                    <div className="prose prose-invert prose-sm prose-p:my-1 prose-headings:my-2 prose-a:text-primary max-w-none">
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3 max-w-[90%]">
                                <div className="w-8 h-8 rounded-full bg-primary text-slate-900 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="p-3 bg-slate-900/50 border border-white/5 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-slate-900/80 rounded-b-2xl border-t border-white/10">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="Ask Waymaker AI..."
                                className="w-full bg-slate-800/80 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder-slate-500"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                className="absolute right-2 top-2 p-1.5 bg-primary text-slate-900 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform duration-300"
                >
                    <MessageSquare className="w-6 h-6 text-slate-900" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-950 flex items-center justify-center animate-pulse" />
                </button>
            )}
        </motion.div>
    );
}
