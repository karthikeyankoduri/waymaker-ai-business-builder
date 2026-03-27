import React from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Target, AlertCircle, ChevronsUp, ChevronsDown, Zap } from 'lucide-react';

export default function Competitors() {
    const { activeProject } = useProjects();

    if (!activeProject) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary/10 rounded-xl neon-border border-secondary/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Target className="w-6 h-6 text-secondary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Competitor Analysis</h1>
            </div>

            {(!activeProject.competitors || activeProject.competitors.length === 0) ? (
                <div className="glass-card p-12 text-center flex flex-col items-center border-dashed border-white/20">
                    <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Not Generated Yet</h3>
                    <p className="text-slate-400">Go to the Overview tab to run the AI Orchestrator.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {activeProject.competitors.map((comp, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform border border-white/10 group">
                            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4 flex items-center justify-between">
                                {comp.name}
                                <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/10">#{i + 1}</span>
                            </h3>

                            <div className="mb-4">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-secondary mb-2 uppercase tracking-wider"><ChevronsUp className="w-4 h-4" /> Strengths</h4>
                                <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                                    {comp.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                                </ul>
                            </div>

                            <div className="mb-6 flex-1">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-2 uppercase tracking-wider"><ChevronsDown className="w-4 h-4" /> Weaknesses</h4>
                                <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                                    {comp.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                                </ul>
                            </div>

                            <div className="mt-auto p-4 bg-primary/10 rounded-xl border border-primary/20 relative overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
                                <Zap className="w-24 h-24 text-primary opacity-5 absolute -bottom-4 -right-4 rotate-12" />
                                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Market Gap to Exploit</h4>
                                <p className="text-sm text-slate-200 relative z-10">{comp.gap}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
