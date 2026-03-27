import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Settings, Save, Webhook, CheckCircle2, Zap } from 'lucide-react';

export default function Deployments() {
    const { activeProject, updateProject } = useProjects();
    const [webhookUrl, setWebhookUrl] = useState('');
    const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load from project first, otherwise fallback to localStorage defaults
        if (activeProject?.webhookUrl) {
            setWebhookUrl(activeProject.webhookUrl);
        } else {
            const savedN8nUrl = localStorage.getItem('waymaker_default_n8n_webhook_url');
            setWebhookUrl(savedN8nUrl || '');
        }

        if (activeProject?.zapierWebhookUrl) {
            setZapierWebhookUrl(activeProject.zapierWebhookUrl);
        } else {
            const savedZapierUrl = localStorage.getItem('waymaker_default_zapier_webhook_url');
            setZapierWebhookUrl(savedZapierUrl || '');
        }
    }, [activeProject]);

    if (!activeProject) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaved(false);

        // Simulate save delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Save to active project
        updateProject(activeProject.id, { webhookUrl, zapierWebhookUrl });

        // Persist to localStorage for future new projects
        if (webhookUrl) localStorage.setItem('waymaker_default_n8n_webhook_url', webhookUrl);
        if (zapierWebhookUrl) localStorage.setItem('waymaker_default_zapier_webhook_url', zapierWebhookUrl);

        setIsSaving(false);
        setSaved(true);

        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-slate-500/10 rounded-xl neon-border shadow-[0_0_15px_rgba(148,163,184,0.3)]">
                    <Settings className="w-6 h-6 text-slate-400" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Deployments & Integrations</h1>
            </div>

            <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Webhook className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">n8n Webhook Configuration</h2>
                        <p className="text-sm text-slate-400">Set the target webhook URL for this project's generated content.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Webhook URL
                        </label>
                        <input
                            type="url"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            placeholder="https://your-n8n-instance.com/webhook-test/..."
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-100 placeholder-slate-500 transition-shadow"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            The Marketing Kit will send individual or bulk social posts to this URL.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Zapier Webhook Configuration</h2>
                                <p className="text-sm text-slate-400">Set the target webhook URL for the Website Builder output.</p>
                            </div>
                        </div>

                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Zapier Webhook URL
                        </label>
                        <input
                            type="url"
                            value={zapierWebhookUrl}
                            onChange={(e) => setZapierWebhookUrl(e.target.value)}
                            placeholder="https://hooks.zapier.com/hooks/catch/..."
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100 placeholder-slate-500 transition-shadow"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            The Website Builder will send the generated HTML code to this URL for automation.
                        </p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                            ) : saved ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" /> Saved
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" /> Save Configuration
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
