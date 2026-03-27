import React from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Folders, AlertCircle, FileText, Target, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MarketResearchData {
    executiveSummary: string;
    marketInsights: string[];
    industryTrends: string[];
    keyOpportunities: string[];
}

export default function MarketResearch() {
    const { activeProject } = useProjects();

    if (!activeProject) return null;

    let parsedData: MarketResearchData | null = null;
    let isLegacyMarkdown = false;

    if (activeProject.marketResearch) {
        try {
            parsedData = JSON.parse(activeProject.marketResearch);
        } catch (e) {
            isLegacyMarkdown = true;
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl neon-border">
                    <Folders className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Market Research</h1>
            </div>

            {!activeProject.marketResearch ? (
                <div className="glass-card p-12 text-center flex flex-col items-center border-dashed border-white/20">
                    <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Not Generated Yet</h3>
                    <p className="text-slate-400">Go to the Overview tab to run the AI Orchestrator for this project.</p>
                </div>
            ) : isLegacyMarkdown ? (
                <div className="glass-card p-8 md:p-12 relative overflow-hidden text-slate-200">
                    <div className="absolute -top-10 -right-10 p-8 opacity-5 blur-[2px] pointer-events-none rotate-12">
                        <FileText className="w-96 h-96 text-primary" />
                    </div>

                    <div className="relative z-10 prose prose-invert prose-p:leading-relaxed prose-headings:text-primary max-w-none prose-lg">
                        <ReactMarkdown>
                            {activeProject.marketResearch}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : parsedData ? (
                <div className="space-y-6">
                    {/* Executive Summary */}
                    <div className="glass-card p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-teal-400" />
                            <h2 className="text-xl font-bold">Executive Summary</h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            {parsedData.executiveSummary}
                        </p>
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Market Insights */}
                        <div className="glass-card p-6">
                            <div className="flex flex-col gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold">Market Insights</h3>
                                <ul className="space-y-4">
                                    {parsedData.marketInsights?.map((insight, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                            <span className="text-sm text-slate-300 leading-relaxed">
                                                <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>{insight}</ReactMarkdown>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Industry Trends */}
                        <div className="glass-card p-6">
                            <div className="flex flex-col gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold">Industry Trends</h3>
                                <ul className="space-y-4">
                                    {parsedData.industryTrends?.map((trend, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                            <span className="text-sm text-slate-300 leading-relaxed">
                                                <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>{trend}</ReactMarkdown>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Key Opportunities */}
                        <div className="glass-card p-6">
                            <div className="flex flex-col gap-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold">Key Opportunities</h3>
                                <ul className="space-y-4">
                                    {parsedData.keyOpportunities?.map((opp, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                            <span className="text-sm text-slate-300 leading-relaxed">
                                                <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>{opp}</ReactMarkdown>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
