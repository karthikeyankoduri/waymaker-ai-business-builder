import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, Zap, BrainCircuit, ArrowRight, CheckCircle2, Layers, LineChart, Target, LayoutTemplate, Megaphone, Coins } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Nav */}
                <nav className="flex items-center justify-between py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 neon-border">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Waymaker</span>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 rounded-full glass-panel hover:bg-white/10 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                </nav>

                {/* Hero */}
                <main className="mt-20 lg:mt-32 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-primary/30 text-primary"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold tracking-wide uppercase">Powered by Google Gemini 2.5 Flash</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl leading-tight"
                    >
                        Turn raw ideas into <br />
                        <span className="text-gradient">Ready-to-Launch</span> Businesses
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
                    >
                        Instantly generate market research, competitor analysis, landing pages, and marketing campaigns—autonomously.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="group relative px-8 py-4 rounded-full bg-slate-100 text-slate-950 font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex items-center gap-2 relative z-10 group-hover:text-white transition-colors duration-300">
                            Start Building <Rocket className="w-5 h-5 ml-2" />
                        </div>
                    </motion.button>
                </main>

                {/* Features */}
                <section className="mt-40 pb-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4">An Autonomous AI Team</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Waymaker orchestrates multiple AI models to handle every aspect of your launch.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: LineChart,
                                title: "Market Research",
                                desc: "Deep dive into market size, target audience demographics, and industry trends."
                            },
                            {
                                icon: Target,
                                title: "Competitor Analysis",
                                desc: "Identify key players, analyze their strengths, and find tactical gaps where your business can win."
                            },
                            {
                                icon: LayoutTemplate,
                                title: "Website Builder",
                                desc: "Get a fully-coded, high-converting Tailwind CSS website generated and previewed in seconds."
                            },
                            {
                                icon: Megaphone,
                                title: "Marketing Kit",
                                desc: "Automate social media copy, content calendars, and brand messaging strategies instantly."
                            },
                            {
                                icon: Coins,
                                title: "Funding Matcher",
                                desc: "Find live grants, investors, pitch competitions, and events tailored exactly to your industry."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Flowchart Section */}
                <section className="py-20 border-t border-white/5 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 relative z-10"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How Waymaker Works</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">From a single sentence to a fully deployed business in 4 simple steps.</p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-secondary/50 to-primary/20 -z-10" />

                            {[
                                { step: "1", title: "Share Idea", icon: BrainCircuit, desc: "Tell us your business concept or industry." },
                                { step: "2", title: "AI Analysis", icon: Zap, desc: "Deep market, competitor & audience research." },
                                { step: "3", title: "Generate Assets", icon: Layers, desc: "Auto-build landing pages & marketing kits." },
                                { step: "4", title: "Launch & Fund", icon: Rocket, desc: "Deploy to web and match with investors." }
                            ].map((item, i) => (
                                <React.Fragment key={i}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 }}
                                        className="flex flex-col items-center text-center w-full md:w-1/4 relative group"
                                    >
                                        <div className="w-16 h-16 rounded-full glass-panel border border-primary/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] bg-slate-900 group-hover:bg-primary/20 group-hover:border-primary/50">
                                            <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center shadow-lg">{item.step}</span>
                                            <item.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                    </motion.div>
                                    {/* Mobile connector */}
                                    {i < 3 && (
                                        <div className="md:hidden h-8 w-0.5 bg-gradient-to-b from-primary/50 to-transparent my-2" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-20 mb-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Choose the plan that fits your ambition.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                name: "Starter",
                                price: "Free",
                                duration: "forever",
                                desc: "Perfect for exploring ideas.",
                                features: ["3 Projects per month", "Basic Market Research", "Standard Website Generation", "Community Support"],
                                highlight: false
                            },
                            {
                                name: "Pro",
                                price: "$29",
                                duration: "per month",
                                desc: "For serious entrepreneurs.",
                                features: ["Unlimited Projects", "Deep Competitor Analysis", "Premium Landing Pages", "Funding Matcher", "Priority Support"],
                                highlight: true
                            },
                            {
                                name: "Enterprise",
                                price: "$99",
                                duration: "per month",
                                desc: "Full agency capabilities.",
                                features: ["Everything in Pro", "Custom AI Workflows", "White-label Exports", "API Access", "Dedicated Account Manager"],
                                highlight: false
                            }
                        ].map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className={`glass-card p-8 rounded-xl border relative overflow-hidden transition-all duration-300 ${plan.highlight ? 'border-primary/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] md:-translate-y-4' : 'border-white/5 hover:border-white/20 hover:-translate-y-1'}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                                )}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-sm text-slate-400 mb-6">{plan.desc}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold">{plan.price}</span>
                                        {plan.price !== 'Free' && <span className="text-slate-400">/{plan.duration}</span>}
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3">
                                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-primary' : 'text-slate-500'}`} />
                                            <span className="text-sm text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${plan.highlight ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg' : 'glass-panel hover:bg-white/10'}`}>
                                    {plan.price === 'Free' ? 'Get Started' : 'Upgrade Plan'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
