import React from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Folders, AlertCircle, FileText, Target, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MarketResearchData {
    // Legacy support
    executiveSummary?: string;
    marketInsights?: string[];
    industryTrends?: string[];
    // New Dashboard Schema
    marketAnalysis?: {
        tam: { value: string, label: string, description?: string };
        sam: { value: string, label: string, description?: string };
        som: { value: string, label: string, description?: string };
        topDownApproach: { label: string, value: string }[];
    };
    positionInMarket?: {
        xAxis: { left: string, right: string };
        yAxis: { top: string, bottom: string };
        pyramid: { level: string, description: string }[];
        quadrants?: {
            topLeft: { name: string, competitors: string[] };
            topRight: { name: string, competitors: string[] };
            bottomLeft: { name: string, competitors: string[] };
            bottomRight: { name: string, competitors: string[] };
            [key: string]: any;
        };
        competitors?: { name: string, x: number, y: number }[];
    };
    competitiveLandscape?: {
        brand: string;
        fundingStatus: string;
        coreFocus: string;
        consumerFriction: string;
        formatAndStorage: string;
    }[];
    keyOpportunities?: string[];
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

    const renderCircles = (tam: any, sam: any, som: any) => {
        return (
            <div className="flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center mb-8">
                    {/* TAM */}
                    <div className="absolute inset-0 rounded-full border border-slate-700 bg-slate-800/20 flex flex-col items-start justify-center pl-8 transition-transform hover:scale-105 duration-300">
                        <span className="text-3xl font-serif text-white">{tam?.value}</span>
                        <span className="text-xs font-mono text-slate-400 tracking-widest mt-1">TAM</span>
                    </div>
                    {/* SAM */}
                    <div className="absolute w-[70%] h-[70%] right-0 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex flex-col items-start justify-center pl-8 transition-transform hover:scale-105 duration-300">
                        <span className="text-2xl font-serif text-emerald-400">{sam?.value}</span>
                        <span className="text-xs font-mono text-emerald-500/70 tracking-widest mt-1">SAM</span>
                    </div>
                    {/* SOM */}
                    <div className="absolute w-[45%] h-[45%] right-0 rounded-full border border-emerald-400 bg-emerald-400/20 flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300 shadow-[0_0_40px_rgba(52,211,153,0.15)] bg-gradient-to-br from-emerald-500/30 to-transparent">
                        <span className="text-xl font-serif text-emerald-300">{som?.value}</span>
                        <span className="text-[10px] font-mono text-emerald-300/80 tracking-widest mt-1">SOM</span>
                    </div>
                </div>
                
                {/* Descriptors */}
                <div className="w-full text-left bg-black/40 border border-white/5 rounded-xl p-6  space-y-4">
                    <div className="flex flex-col"><span className="text-xs font-mono text-slate-500 uppercase">TAM • {tam?.label}</span><span className="text-sm text-slate-300">{tam?.description || "Total global market demand."}</span></div>
                    <div className="flex flex-col"><span className="text-xs font-mono text-emerald-500/70 uppercase">SAM • {sam?.label}</span><span className="text-sm text-slate-300">{sam?.description || "Segment targeted by these services."}</span></div>
                    <div className="flex flex-col"><span className="text-xs font-mono text-emerald-400 uppercase">SOM • {som?.label}</span><span className="text-sm text-white">{som?.description || "Sub-segment actually obtainable."}</span></div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-xl">
                    <Folders className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-serif tracking-tight">Market Dashboard</h1>
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
                        <FileText className="w-96 h-96 text-white" />
                    </div>
                    <div className="relative z-10 prose prose-invert prose-p:leading-relaxed prose-headings:text-white max-w-none prose-lg">
                        <ReactMarkdown>
                            {activeProject.marketResearch}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : parsedData ? (
                <div className="space-y-6">
                    {/* New Advanced Format if present, fallback if legacy json */}
                    {parsedData.marketAnalysis ? (
                        <>
                            {/* SECTION 1: TAM SAM SOM & Top Down Approach */}
                            <div className="glass-card p-6 md:p-10 border border-white/10 relative overflow-hidden">
                                <h2 className="text-2xl font-serif text-white mb-8">Market Analysis</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div className="flex justify-center">
                                        {renderCircles(parsedData.marketAnalysis.tam, parsedData.marketAnalysis.sam, parsedData.marketAnalysis.som)}
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="px-6 py-2 border border-emerald-500/20 rounded-full bg-emerald-500/10 mb-6 font-serif text-emerald-400 tracking-wide text-center">
                                            Top-Down Approach Downscaling
                                        </div>
                                        {/* Inverted Pyramid Hierarchy */}
                                        {parsedData.marketAnalysis.topDownApproach?.map((item, i, arr) => {
                                            const widthPerc = 100 - (i * (60 / arr.length));
                                            return (
                                                <div key={i} className="flex flex-col items-center w-full">
                                                    <div 
                                                        className="bg-white/[0.03] border-t border-b border-white/10 p-3 flex flex-col items-center justify-center text-center transition-all hover:bg-white/[0.05]"
                                                        style={{ width: `${widthPerc}%`, borderLeft: '4px solid rgba(52,211,153, 0.5)', borderRight: '4px solid rgba(52,211,153, 0.5)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}
                                                    >
                                                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{item.label}</span>
                                                        <span className="text-white font-serif font-bold text-lg">{item.value}</span>
                                                    </div>
                                                    {i !== arr.length - 1 && <div className="h-4 w-px bg-emerald-500/30"></div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Position in Market */}
                            {parsedData.positionInMarket && (
                                <div className="glass-card p-6 md:p-10 border border-white/10">
                                    <h2 className="text-2xl font-serif text-white mb-8">Positioned At Premium</h2>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        {/* Simple Box Quadrant Matrix */}
                                        <div className="relative w-full aspect-square border-4 border-slate-800 rounded-2xl flex flex-col bg-slate-900/40 p-12">
                                            {/* Stark Black Axes */}
                                            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1.5 bg-slate-800 rounded-full" />
                                            <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-1.5 bg-slate-800 rounded-full" />
                                            
                                            {/* Axis Labels representing the lines */}
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-400">{parsedData.positionInMarket.yAxis?.top || 'High Price'}</div>
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-400">{parsedData.positionInMarket.yAxis?.bottom || 'Low Price'}</div>
                                            <div className="absolute top-1/2 -left-20 -translate-y-1/2 -rotate-90 text-xs font-mono text-slate-400">{parsedData.positionInMarket.xAxis?.left || 'Low Quality'}</div>
                                            <div className="absolute top-1/2 -right-20 -translate-y-1/2 rotate-90 text-xs font-mono text-slate-400">{parsedData.positionInMarket.xAxis?.right || 'High Quality'}</div>

                                            {/* 4 Quadrants Container */}
                                            <div className="absolute inset-8 grid grid-cols-2 grid-rows-2 gap-4 pointer-events-none">
                                                
                                                {/* Top Left */}
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    {parsedData.positionInMarket.quadrants?.topLeft && (
                                                        <div className="bg-amber-400/90 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded px-4 py-2 text-center transform hover:scale-105 transition-all text-black border border-amber-300 font-serif">
                                                            <div className="font-bold whitespace-nowrap">{parsedData.positionInMarket.quadrants.topLeft.name}</div>
                                                            <div className="text-[10px] opacity-80 uppercase tracking-widest leading-tight mt-1">
                                                                {parsedData.positionInMarket.quadrants.topLeft.competitors.join(', ')}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Top Right */}
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    {parsedData.positionInMarket.quadrants?.topRight && (
                                                        <div className="bg-amber-400/90 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded px-4 py-2 text-center transform hover:scale-105 transition-all text-black border border-amber-300 font-serif">
                                                            <div className="font-bold whitespace-nowrap">{parsedData.positionInMarket.quadrants.topRight.name}</div>
                                                            <div className="text-[10px] opacity-80 uppercase tracking-widest leading-tight mt-1">
                                                                {parsedData.positionInMarket.quadrants.topRight.competitors.join(', ')}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bottom Left */}
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    {parsedData.positionInMarket.quadrants?.bottomLeft && (
                                                        <div className="bg-amber-400/90 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded px-4 py-2 text-center transform hover:scale-105 transition-all text-black border border-amber-300 font-serif">
                                                            <div className="font-bold whitespace-nowrap">{parsedData.positionInMarket.quadrants.bottomLeft.name}</div>
                                                            <div className="text-[10px] opacity-80 uppercase tracking-widest leading-tight mt-1">
                                                                {parsedData.positionInMarket.quadrants.bottomLeft.competitors.join(', ')}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bottom Right */}
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    {parsedData.positionInMarket.quadrants?.bottomRight && (
                                                        <div className="bg-amber-400/90 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded px-4 py-2 text-center transform hover:scale-105 transition-all text-black border border-amber-300 font-serif">
                                                            <div className="font-bold whitespace-nowrap">{parsedData.positionInMarket.quadrants.bottomRight.name}</div>
                                                            <div className="text-[10px] opacity-80 uppercase tracking-widest leading-tight mt-1">
                                                                {parsedData.positionInMarket.quadrants.bottomRight.competitors.join(', ')}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>

                                        {/* Dynamic Embellished Pyramid */}
                                        <div className="flex flex-col items-center justify-end h-full gap-5 pb-12 pt-12 relative px-8">
                                            {/* Ambient Background Glow for Pyramid */}
                                            <div className="absolute bottom-10 w-full h-1/2 bg-emerald-500/10 blur-[50px] pointer-events-none rounded-full" />
                                            
                                            {parsedData.positionInMarket.pyramid?.map((level, i) => {
                                                const sizes = ['w-[30%]', 'w-[65%]', 'w-[100%]'];
                                                const colors = [
                                                    'bg-gradient-to-b from-emerald-400 to-emerald-500 text-black border-2 border-emerald-300 shadow-[0_10px_30px_rgba(52,211,153,0.4)] z-30 scale-105', 
                                                    'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white border-2 border-emerald-500 shadow-[0_10px_30px_rgba(5,150,105,0.3)] z-20', 
                                                    'bg-gradient-to-b from-emerald-900 to-slate-900 text-emerald-100 border-2 border-emerald-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-10'
                                                ];
                                                
                                                return (
                                                    <div key={i} className={`${sizes[i] || 'w-full'} ${colors[i] || 'bg-white/10 text-white'} rounded-xl transition-all flex flex-col items-center justify-center p-6 text-center h-full min-h-[120px] transform hover:-translate-y-2`}>
                                                        <h3 className="font-serif font-black text-xl mb-2 drop-shadow-md">{level.level}</h3>
                                                        <p className="text-xs font-mono opacity-90 uppercase tracking-widest">{level.description}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 3: Competitive Landscape Table */}
                            {parsedData.competitiveLandscape && (
                                <div className="glass-card p-6 md:p-10 border border-white/10 overflow-x-auto">
                                    <h2 className="text-2xl font-serif text-white mb-8">Competitive Landscape</h2>
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr>
                                                <th className="font-mono text-xs uppercase tracking-widest text-slate-500 pb-4 border-b border-white/10 w-1/5">Brands</th>
                                                <th className="font-mono text-xs uppercase tracking-widest text-slate-500 pb-4 border-b border-white/10 w-1/5 text-center">Funding Status</th>
                                                <th className="font-mono text-xs uppercase tracking-widest text-slate-500 pb-4 border-b border-white/10 w-1/5 text-center">Core Focus</th>
                                                <th className="font-mono text-xs uppercase tracking-widest text-slate-500 pb-4 border-b border-white/10 w-1/5 text-center">Consumer Friction</th>
                                                <th className="font-mono text-xs uppercase tracking-widest text-slate-500 pb-4 border-b border-white/10 w-1/5 text-center">Format & Storage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsedData.competitiveLandscape.map((comp, idx) => (
                                                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-4 border-b border-white/5 font-serif font-bold text-lg text-white">
                                                        {comp.brand}
                                                    </td>
                                                    <td className="py-4 border-b border-white/5 text-center">
                                                        <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300">
                                                            {comp.fundingStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 border-b border-white/5 text-center text-sm text-slate-400">
                                                        {comp.coreFocus}
                                                    </td>
                                                    <td className="py-4 border-b border-white/5 text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-sm text-xs font-bold ${comp.consumerFriction.toLowerCase().includes('high') || comp.consumerFriction.toLowerCase().includes('extreme') ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                                                            {comp.consumerFriction}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 border-b border-white/5 text-center font-mono text-xs text-slate-400">
                                                        {comp.formatAndStorage}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={5} className="pt-6 text-center">
                                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-6 py-4 inline-block text-emerald-400 font-bold font-serif shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                                                        {parsedData.keyOpportunities && parsedData.keyOpportunities.length > 0 ? parsedData.keyOpportunities[0] : "Clear market gap established for category creation."}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        // LEGACY JSON FALLBACK
                        <>
                            <div className="glass-card p-6 md:p-8">
                                <h2 className="text-xl font-bold mb-4">Executive Summary</h2>
                                <p className="text-slate-300 leading-relaxed text-lg">{parsedData.executiveSummary}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-card p-6"><h3 className="text-xl font-bold mb-4">Insights</h3><ul className="space-y-4">{parsedData.marketInsights?.map((item, i) => <li key={i} className="text-sm text-slate-300">{item}</li>)}</ul></div>
                                <div className="glass-card p-6"><h3 className="text-xl font-bold mb-4">Trends</h3><ul className="space-y-4">{parsedData.industryTrends?.map((item, i) => <li key={i} className="text-sm text-slate-300">{item}</li>)}</ul></div>
                                <div className="glass-card p-6"><h3 className="text-xl font-bold mb-4">Opportunities</h3><ul className="space-y-4">{parsedData.keyOpportunities?.map((item, i) => <li key={i} className="text-sm text-slate-300">{item}</li>)}</ul></div>
                            </div>
                        </>
                    )}
                </div>
            ) : null}
        </div>
    );
}
