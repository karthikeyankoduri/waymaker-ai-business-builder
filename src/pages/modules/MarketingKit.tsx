import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { analyzeProfileEngagement } from '../../services/ai';
import { Megaphone, AlertCircle, Hash, Instagram, Linkedin, Twitter, Sparkles, Facebook, Webhook, CheckCircle2, Loader2, Send, Save, Rocket, Activity, X, BarChart3 } from 'lucide-react';

export default function MarketingKit() {
    const { activeProject, updateProject, apiKey } = useProjects();

    if (!activeProject) return null;

    const [sendingState, setSendingState] = useState<{ id: string | number, status: 'idle' | 'loading' | 'success' | 'error' }>({ id: '', status: 'idle' });
    const [webhookInput, setWebhookInput] = useState(activeProject.webhookUrl || '');
    const [isSavingWebhook, setIsSavingWebhook] = useState(false);

    const handleSaveWebhook = () => {
        setIsSavingWebhook(true);
        updateProject(activeProject.id, { webhookUrl: webhookInput });
        setTimeout(() => setIsSavingWebhook(false), 1500);
    };

    const [profileUrl, setProfileUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyticsData, setAnalyticsData] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!profileUrl) {
            alert('Please enter a profile link first.');
            return;
        }
        if (!apiKey) {
            alert('No API key found in context.');
            return;
        }
        setIsAnalyzing(true);
        try {
            const data = await analyzeProfileEngagement(apiKey, profileUrl);
            if (data) setAnalyticsData(data);
            else alert("Could not fetch analytics. Please check console.");
        } catch (error) {
            console.error(error);
            alert("Failed to analyze. Check console.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendToWebhook = async (postIndex?: number) => {
        const urlToUse = webhookInput || activeProject.webhookUrl;
        if (!urlToUse) {
            alert('Please configure a Webhook URL first.');
            return;
        }

        const id = postIndex !== undefined ? postIndex : 'bulk';
        setSendingState({ id, status: 'loading' });

        try {
            const payload = postIndex !== undefined
                ? { type: 'individual', payload: activeProject.marketingKit![postIndex] }
                : { type: 'bulk', payload: activeProject.marketingKit };

            const response = await fetch(urlToUse, {
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
                            <Rocket className="w-4 h-4" />
                        )}
                        {sendingState.id === 'bulk' && sendingState.status === 'success' ? 'Deployed All' : 'Deploy All'}
                    </button>
                )}
            </div>

            <div className="mb-8 glass-card p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-400">
                    <Webhook className="w-5 h-5" />
                    <span className="font-semibold whitespace-nowrap">Webhook URL</span>
                </div>
                <input 
                    type="url" 
                    placeholder="Enter your n8n or Make webhook URL..." 
                    value={webhookInput}
                    onChange={(e) => setWebhookInput(e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors text-white"
                />
                <button
                    onClick={handleSaveWebhook}
                    disabled={isSavingWebhook}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                >
                    {isSavingWebhook ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSavingWebhook ? 'Saved!' : 'Save Webhook'}
                </button>
            </div>

            <div className="mb-8 glass-card p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-white/70">
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-semibold whitespace-nowrap">Profile Analytics</span>
                </div>
                <input 
                    type="url" 
                    placeholder="Enter competitor or own profile link (e.g. twitter.com/username)" 
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white/50 transition-colors text-white"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="px-4 py-2 rounded-xl bg-white text-black hover:bg-slate-200 transition-all font-medium text-sm flex items-center gap-2 whitespace-nowrap shadow-xl"
                >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>

            {/* Analytics Modal */}
            {analyticsData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-card max-w-2xl w-full p-8 relative animate-in zoom-in-95 duration-200 border border-white/20">
                        <button 
                            onClick={() => setAnalyticsData(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-serif text-white mb-2">{analyticsData.profileName || "Profile"} Analytics</h2>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-sm text-slate-400">Search Extrapolated Score</span>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-sm border border-white/10 flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-400" />
                                {analyticsData.overallEngagementScore || 0}/100
                            </span>
                        </div>

                        {analyticsData.verifiedBio && (
                            <div className="mb-6 bg-white/5 border border-white/10 p-4 rounded-xl text-sm italic text-slate-300 font-serif leading-relaxed line-clamp-3">
                                "{analyticsData.verifiedBio}"
                            </div>
                        )}

                        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 pointer-events-auto custom-scrollbar">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Visual Activity Breakdown</h3>
                            
                            {analyticsData.recentActivity?.map((post: any, idx: number) => {
                                const total = (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
                                const likeWidth = total > 0 ? (post.likes / total) * 100 : 0;
                                const commentWidth = total > 0 ? (post.comments / total) * 100 : 0;
                                const shareWidth = total > 0 ? (post.shares / total) * 100 : 0;

                                return (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                                    <div className="flex flex-col mb-4">
                                        <span className="text-white text-sm mb-2">{post.title || "Activity content..."}</span>
                                        <span className="text-xs text-emerald-400 font-mono tracking-wider">{post.date}</span>
                                    </div>
                                    
                                    <div className="h-2.5 w-full bg-black/50 rounded-full flex overflow-hidden mb-3">
                                        <div style={{ width: `${likeWidth}%` }} className="bg-white" title={`Likes: ${post.likes}`} />
                                        <div style={{ width: `${commentWidth}%` }} className="bg-white/50" title={`Comments: ${post.comments}`} />
                                        <div style={{ width: `${shareWidth}%` }} className="bg-white/20" title={`Shares: ${post.shares}`} />
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-xs font-mono">
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white" /> <span className="text-white font-semibold">{post.likes}</span> <span className="text-slate-500 lowercase">Likes</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white/50" /> <span className="text-white font-semibold">{post.comments}</span> <span className="text-slate-500 lowercase">Comments</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /> <span className="text-white font-semibold">{post.shares}</span> <span className="text-slate-500 lowercase">Shares</span></div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>
            )}

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
                                        <Rocket className="w-4 h-4" />
                                    )}
                                    {sendingState.id === i && sendingState.status === 'success' ? 'Deployed' : 'Deploy Post'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
