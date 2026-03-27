import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { LayoutTemplate, AlertCircle, Code, Eye, Download, Zap, Loader2, CheckCircle2 } from 'lucide-react';

export default function WebsiteBuilder() {
    const { activeProject } = useProjects();
    const [view, setView] = useState<'preview' | 'code'>('preview');

    if (!activeProject) return null;

    const [sendingState, setSendingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSendToZapier = async () => {
        if (!activeProject.zapierWebhookUrl) {
            alert('Please configure a Zapier Webhook URL in the Deployments tab first.');
            return;
        }

        setSendingState('loading');

        try {
            const payload = {
                projectName: activeProject.name,
                websiteCode: activeProject.websiteCode,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(activeProject.zapierWebhookUrl, {
                method: 'POST',
                body: JSON.stringify(payload) // Zapier accepts standard JSON payloads or form data
            });

            // Zapier often returns opaque responses (e.g. no-cors) from webhooks depending on setup, but typically ok if no error is thrown
            setSendingState('success');
            setTimeout(() => setSendingState('idle'), 3000);
        } catch (error) {
            console.error('Zapier webhook error:', error);
            setSendingState('error');
            alert('Failed to send to Zapier webhook. Check console for details.');
            setTimeout(() => setSendingState('idle'), 3000);
        }
    };

    const downloadCode = () => {
        if (!activeProject.websiteCode) return;
        const blob = new Blob([activeProject.websiteCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `waymaker-${activeProject.name.replace(/\s+/g, '-').toLowerCase()}-landing.html`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const getSafeHtml = (html: string) => {
        return `
            ${html}
            <script>
                document.addEventListener('click', function(e) {
                    const link = e.target.closest('a');
                    if (link && link.getAttribute('href') === '#') {
                        e.preventDefault();
                    } else if (link) {
                        e.preventDefault();
                    }
                });
                document.addEventListener('submit', function(e) {
                    e.preventDefault();
                });
            </script>
        `;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 h-full flex flex-col pb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/10 rounded-xl neon-border border-secondary/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <LayoutTemplate className="w-6 h-6 text-secondary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Website Builder</h1>
                </div>

                {activeProject.websiteCode && (
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setView('preview')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${view === 'preview' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Eye className="w-4 h-4" /> Preview
                            </button>
                            <button
                                onClick={() => setView('code')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${view === 'code' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Code className="w-4 h-4" /> Code
                            </button>
                            <button
                                onClick={handleSendToZapier}
                                disabled={sendingState === 'loading'}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                                title="Send to Zapier"
                            >
                                {sendingState === 'loading' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : sendingState === 'success' ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                    <Zap className="w-4 h-4" />
                                )}
                                {sendingState === 'success' ? 'Sent' : 'Zapier'}
                            </button>
                        </div>
                        <button
                            onClick={downloadCode}
                            className="p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors border border-primary/30"
                            title="Download HTML"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {!activeProject.websiteCode ? (
                <div className="glass-card p-12 text-center flex flex-col items-center border-dashed border-white/20 mt-8">
                    <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Not Generated Yet</h3>
                    <p className="text-slate-400">Go to the Overview tab to run the AI Orchestrator for this project.</p>
                </div>
            ) : (
                <div className="flex-1 glass-card overflow-hidden border-white/10 flex flex-col mt-4 min-h-[600px] relative">
                    {view === 'preview' ? (
                        <iframe
                            srcDoc={getSafeHtml(activeProject.websiteCode)}
                            className="w-full h-full bg-white flex-1 border-none"
                            title="Website Preview"
                            sandbox="allow-scripts"
                        />
                    ) : (
                        <div className="relative flex-1 bg-[#1e1e1e] overflow-auto">
                            <pre className="p-6 text-sm text-slate-300 leading-relaxed font-mono">
                                <code>{activeProject.websiteCode}</code>
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
