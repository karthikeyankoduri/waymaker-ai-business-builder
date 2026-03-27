import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import {
    Rocket, Lightbulb, Target, Users, Zap, Folders, LayoutTemplate, MapPin, Megaphone, DollarSign, Settings
} from 'lucide-react';
import {
    generateMarketResearch,
    generateCompetitors,
    generateWebsiteCode,
    generateMarketingKit,
    generateFundingOpportunities
} from '../services/ai';

export default function Dashboard() {
    const { activeProject, addProject, updateProject, apiKey } = useProjects();
    const navigate = useNavigate();

    const [idea, setIdea] = useState("");
    const [industry, setIndustry] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [location, setLocation] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState("");

    const handleStartProject = async (e: React.FormEvent) => {
        e.preventDefault();


        // Create new project
        const project = addProject({
            name: idea.split(' ').slice(0, 4).join(' ') || 'New Project',
            idea,
            industry,
            targetAudience,
            location
        });

        await runOrchestrator(project.id, {
            ...project,
            id: project.id,
            createdAt: project.createdAt,
            chatHistory: []
        });
    };

    const runOrchestrator = async (projectId: string, projectData: any) => {
        if (!apiKey) return;
        setIsGenerating(true);

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        // 1. Market Research
        try {
            setGenerationStep("Analyzing Market & Trends...");
            const research = await generateMarketResearch(apiKey, projectData);
            updateProject(projectId, { marketResearch: research || "Market research generation failed." });
        } catch (error) {
            console.error("Market Research Error:", error);
            updateProject(projectId, { marketResearch: "# Generation Error\nCould not generate market research due to API constraints. Try again later." });
        }

        await delay(3000); // 3-second delay to prevent 15 RPM burst limit on Gemini free tier

        // 2. Competitors
        try {
            setGenerationStep("Identifying Competitors & Gaps...");
            const competitors = await generateCompetitors(apiKey, projectData);
            updateProject(projectId, { competitors });
        } catch (error) {
            console.error(error);
        }

        await delay(3000);

        // 3. Website Code
        try {
            setGenerationStep("Building Tailwind Website Code...");
            const websiteCode = await generateWebsiteCode(apiKey, projectData);
            updateProject(projectId, { websiteCode: websiteCode || "<!-- Generation failed -->" });
        } catch (error) {
            console.error(error);
            updateProject(projectId, { websiteCode: "<div class='p-8 text-center text-red-500'>Failed to generate website code.</div>" });
        }

        await delay(3000);

        // 4. Marketing Kit
        try {
            setGenerationStep("Drafting Marketing Kit...");
            const marketingKit = await generateMarketingKit(apiKey, projectData);
            updateProject(projectId, { marketingKit });
        } catch (error) {
            console.error(error);
        }

        await delay(3000);

        // 5. Funding Opportunities
        try {
            setGenerationStep("Finding Funding Matches...");
            const fundingOpportunities = await generateFundingOpportunities(apiKey, projectData);
            updateProject(projectId, { fundingOpportunities });
        } catch (error) {
            console.error(error);
        }

        setGenerationStep("Complete!");
        setTimeout(() => setGenerationStep(""), 2000);
        setIsGenerating(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">


            {activeProject ? (
                <div className="space-y-6">
                    <div className="glass-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2 text-gradient tracking-tight">{activeProject.name}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6 font-medium">
                                {activeProject.industry && <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><Target className="w-4 h-4 text-secondary" /> {activeProject.industry}</span>}
                                {activeProject.targetAudience && <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><Users className="w-4 h-4 text-primary" /> {activeProject.targetAudience}</span>}
                                {activeProject.location && <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><MapPin className="w-4 h-4 text-slate-300" /> {activeProject.location}</span>}
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                <p className="text-slate-300 leading-relaxed">{activeProject.idea}</p>
                            </div>
                        </div>
                    </div>

                    {!activeProject.marketResearch && !isGenerating && (
                        <button
                            onClick={() => runOrchestrator(activeProject.id, activeProject)}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary/80 to-secondary/80 text-white font-bold hover:from-primary hover:to-secondary transition-all shadow-lg shadow-primary/20"
                        >
                            <Zap className="w-5 h-5" /> Generate Complete Business Plan
                        </button>
                    )}

                    {isGenerating && (
                        <div className="glass-card p-8 text-center border-primary/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50 animate-pulse" />
                            <div className="relative z-10">
                                <div className="animate-spin w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary mx-auto mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                                <h3 className="text-xl font-bold text-slate-100 mb-2">AI Orchestrator Running</h3>
                                <p className="text-primary font-medium tracking-wide animate-pulse">{generationStep}</p>
                                <div className="w-full h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-full origin-left animate-[scaleX_10s_ease-in-out_infinite]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeProject.marketResearch && !isGenerating) && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <button onClick={() => navigate('/dashboard/research')} className="group glass-card p-6 hover:-translate-y-1 transition-all text-left">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Folders className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Market Research</h3>
                                <p className="text-slate-400 text-sm">View comprehensive market deep-dive.</p>
                            </button>
                            <button onClick={() => navigate('/dashboard/competitors')} className="group glass-card p-6 hover:-translate-y-1 transition-all text-left">
                                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                                    <Target className="w-5 h-5 text-secondary" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Competitors</h3>
                                <p className="text-slate-400 text-sm">Analyze market gaps & rivals.</p>
                            </button>
                            <button onClick={() => navigate('/dashboard/website')} className="group glass-card p-6 hover:-translate-y-1 transition-all text-left">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <LayoutTemplate className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Landing Page</h3>
                                <p className="text-slate-400 text-sm">Preview generated code.</p>
                            </button>
                            <button onClick={() => navigate('/dashboard/marketing')} className="group glass-card p-6 hover:-translate-y-1 transition-all text-left">
                                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                                    <Megaphone className="w-5 h-5 text-secondary" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Marketing Kit</h3>
                                <p className="text-slate-400 text-sm">Get ready-to-post socials.</p>
                            </button>
                            <button onClick={() => navigate('/dashboard/funding')} className="group glass-card p-6 hover:-translate-y-1 transition-all text-left">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Funding Matcher</h3>
                                <p className="text-slate-400 text-sm">Find capital opportunities.</p>
                            </button>
                            <button onClick={() => navigate('/dashboard/deployments')} className="group glass-card p-6 hover:-translate-y-1 transition-all text-left">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                    <Settings className="w-5 h-5 text-emerald-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Deployments</h3>
                                <p className="text-slate-400 text-sm">Configure webhooks & integrations.</p>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass-card p-8 lg:p-12 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                    <h2 className="text-3xl font-bold mb-3 relative z-10">Ignite a New Project</h2>
                    <p className="text-slate-400 mb-8 max-w-xl relative z-10">Tell us about your next big idea, and the autonomous AI team will handle the market research, competitors, website, and marketing.</p>

                    <form onSubmit={handleStartProject} className="space-y-6 relative z-10">
                        <div>
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
                                <Lightbulb className="w-4 h-4 text-primary" /> The Business Idea
                            </label>
                            <textarea
                                required
                                value={idea}
                                onChange={e => setIdea(e.target.value)}
                                placeholder="e.g. A marketplace for freelance astrophotographers to sell raw space image data to researchers and hobbyists."
                                className="w-full h-32 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-100 placeholder-slate-500 resize-none transition-shadow hover:bg-slate-900/80"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
                                    <Target className="w-4 h-4 text-secondary" /> Industry Focus (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={e => setIndustry(e.target.value)}
                                    placeholder="e.g. SpaceTech"
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-100 placeholder-slate-500 transition-shadow hover:bg-slate-900/80"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
                                    <Users className="w-4 h-4 text-primary" /> Target Audience (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={targetAudience}
                                    onChange={e => setTargetAudience(e.target.value)}
                                    placeholder="e.g. Researchers"
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-100 placeholder-slate-500 transition-shadow hover:bg-slate-900/80"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-slate-300" /> Location (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="e.g. San Francisco or Global"
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-100 placeholder-slate-500 transition-shadow hover:bg-slate-900/80"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!idea}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-100 text-slate-950 font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                <Rocket className="w-5 h-5" /> Launch Project
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
