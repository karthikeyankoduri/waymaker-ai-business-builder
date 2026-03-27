import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Megaphone, AlertCircle, Hash, Instagram, Linkedin, Twitter, Sparkles, Facebook, Webhook, CheckCircle2, Loader2, Send } from 'lucide-react';

export default function MarketingKit() {
    const { activeProject } = useProjects();

    if (!activeProject) return null;

    const [sendingState, setSendingState] = useState<{ id: string | number, status: 'idle' | 'loading' | 'success' | 'error' }>({ id: '', status: 'idle' });

    const handleSendToWebhook = async (postIndex?: number) => {
        if (!activeProject.webhookUrl) {
            alert('Please configure a Webhook URL in the Deployments tab first.');
            return;
        }

        const id = postIndex !== undefined ? postIndex : 'bulk';
        setSendingState({ id, status: 'loading' });

        try {
            const payload = postIndex !== undefined
                ? { type: 'individual', payload: activeProject.marketingKit![postIndex] }
                : { type: 'bulk', payload: activeProject.marketingKit };

            const response = await fetch(activeProject.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to send to webhook');

            setSendingState({ id, status: 'success' });
            setTimeout(() => setSendingState({ id: '', status: 'idle' }), 3000);
        } catch (error) {
            console.error('Webhook error:', error);
            setSendingState({ id, status: 'error' });
            alert('Failed to send to webhook. Check console for details.');
            setTimeout(() => setSendingState({ id: '', status: 'idle' }), 3000);
        }
    };

    const platforms = {
        Instagram: { icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
        LinkedIn: { icon: Linkedin, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
        Twitter: { icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' },
        Facebook: { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'border-blue-600/30' }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/10 rounded-xl neon-border shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        <Megaphone className="w-6 h-6 text-pink-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Marketing Kit</h1>
                </div>

                {activeProject.marketingKit && activeProject.marketingKit.length > 0 && (
                    <button
                        onClick={() => handleSendToWebhook()}
                        disabled={sendingState.status === 'loading'}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all font-medium text-sm"
                    >
                        {sendingState.id === 'bulk' && sendingState.status === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : sendingState.id === 'bulk' && sendingState.status === 'success' ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Webhook className="w-4 h-4" />
                        )}
                        {sendingState.id === 'bulk' && sendingState.status === 'success' ? 'Sent All' : 'Send All to Webhook'}
                    </button>
                )}
            </div>

            {(!activeProject.marketingKit || activeProject.marketingKit.length === 0) ? (
                <div className="glass-card p-12 text-center flex flex-col items-center border-dashed border-white/20">
                    <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Not Generated Yet</h3>
                    <p className="text-slate-400">Go to the Overview tab to run the AI Orchestrator for this project.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {activeProject.marketingKit.map((post, i) => {
                        const style = platforms[post.platform as keyof typeof platforms] || platforms.Twitter;
                        const Icon = style.icon;

                        return (
                            <div key={i} className={`glass-card p-6 flex flex-col ${style.border} hover:-translate-y-1 transition-transform relative overflow-hidden group`}>
                                <div className={`absolute top-0 right-0 p-4 ${style.bg} rounded-bl-3xl`}>
                                    <Icon className={`w-8 h-8 ${style.color} opacity-80`} />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-6 pr-12">{post.platform} Post</h3>

                                <div className="flex-1 bg-slate-900/50 p-4 rounded-xl border border-white/5 mb-6 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {post.content}
                                </div>

                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {post.hashtags.map((tag, idx) => (
                                            <span key={idx} className="flex items-center text-xs font-medium px-2 py-1 rounded bg-white/5 text-slate-300 border border-white/10 hover:border-primary/50 transition-colors">
                                                <Hash className="w-3 h-3 text-primary mr-0.5" />{tag.replace('#', '')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto p-4 bg-primary/5 rounded-xl border border-primary/20 relative mb-4">
                                    <Sparkles className="w-4 h-4 text-primary mb-2 absolute top-4 right-4 animate-pulse" />
                                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">AI Image Prompt</h4>
                                    <p className="text-xs text-slate-400 italic pr-6 leading-relaxed">"{post.imagePrompt}"</p>
                                </div>

                                <button
                                    onClick={() => handleSendToWebhook(i)}
                                    disabled={sendingState.status === 'loading'}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-slate-300 hover:text-white"
                                >
                                    {sendingState.id === i && sendingState.status === 'loading' ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                                    ) : sendingState.id === i && sendingState.status === 'success' ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {sendingState.id === i && sendingState.status === 'success' ? 'Sent' : 'Send Post'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
