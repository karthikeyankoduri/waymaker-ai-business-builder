import React from 'react';
import { useProjects } from '../../context/ProjectContext';
import { DollarSign, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function FundingMatcher() {
    const { activeProject } = useProjects();

    if (!activeProject) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-xl neon-border shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Funding Matcher</h1>
            </div>

            {(!activeProject.fundingOpportunities || activeProject.fundingOpportunities.length === 0) ? (
                <div className="glass-card p-12 text-center flex flex-col items-center border-dashed border-white/20">
                    <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Not Generated Yet</h3>
                    <p className="text-slate-400">Go to the Overview tab to run the AI Orchestrator for this project.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeProject.fundingOpportunities.map((fund, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col border-emerald-500/20 hover:-translate-y-1 transition-transform relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 bg-emerald-500/10 rounded-bl-3xl aspect-square">
                                <TrendingUp className="w-6 h-6 text-emerald-500 opacity-80" />
                            </div>

                            <div className="mb-4 pr-12">
                                <span className="inline-block px-3 py-1 bg-white/5 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg mb-3 border border-emerald-500/20">{fund.type}</span>
                                <h3 className="text-xl font-bold text-white mb-1">{fund.name}</h3>
                                <p className="text-2xl font-bold text-slate-200 font-mono tracking-tight">{fund.amount}</p>
                            </div>

                            <div className="flex-1 text-sm text-slate-400 mb-6 leading-relaxed">
                                {fund.description}
                                {fund.link && (
                                    <div className="mt-4">
                                        <a href={fund.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 font-medium text-sm transition-colors">
                                            View Opportunity
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5">
                                <h4 className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                                    <CheckCircle2 className="w-4 h-4" /> Why it's a match
                                </h4>
                                <p className="text-sm text-slate-200">{fund.matchReason}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
