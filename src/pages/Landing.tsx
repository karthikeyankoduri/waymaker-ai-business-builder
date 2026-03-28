import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MoveRight, CornerRightDown } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden">
            {/* Background glowing mesh representation (Ascend style) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 opacity-50 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 opacity-70 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10 opacity-90 pointer-events-none" style={{ boxShadow: 'inset 0 0 100px rgba(255,255,255,0.05)' }} />

            {/* Glowing spotlight coming from top like Ascend */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white opacity-[0.03] blur-[150px] pointer-events-none rounded-[100%]" />

            <div className="w-full max-w-7xl mx-auto flex flex-col flex-1 relative z-10">
                
                {/* Navigation Menu */}
                <nav className="flex items-center justify-between w-full py-4 relative z-20">
                    {/* Logo */}
                    <div className="flex-1">
                        <span className="text-xl md:text-2xl font-serif text-white tracking-tight">Waymaker.</span>
                    </div>

                    {/* Center Pill */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex items-center gap-6 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-sm font-medium text-slate-300">
                            <button className="hover:text-white transition-colors">About</button>
                            <button className="hover:text-white transition-colors">Features</button>
                            <button className="hover:text-white transition-colors">Contact</button>
                        </div>
                    </div>

                    {/* Right Button */}
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white text-black px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors"
                        >
                            Go to App 
                            <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center">
                                <ArrowRight className="w-3 h-3" />
                            </span>
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center justify-center text-center mt-12 md:mt-24 mb-32 z-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="font-serif text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] leading-[1.05] tracking-tight max-w-[85rem] text-white"
                        style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}
                    >
                        Powering the <em className="italic font-light opacity-90">next generation</em> of autonomous businesses.
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        className="mt-12 flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white text-black px-6 py-3.5 rounded-full text-[15px] font-medium flex items-center gap-3 hover:bg-slate-200 transition-colors shadow-xl"
                        >
                            Start Building
                            <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </button>

                        <button
                            className="bg-black/40 backdrop-blur-md border border-white/10 text-white px-6 py-3.5 rounded-full text-[15px] font-medium hover:bg-white/10 transition-colors shadow-xl"
                        >
                            Learn More
                        </button>
                    </motion.div>
                </main>

                {/* Footer Section equivalent holding bottom text alignments */}
                <div className="w-full flex flex-col md:flex-row items-end justify-between mt-auto pt-8 pb-4 relative z-20">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex items-center gap-2 text-slate-400 text-sm md:mb-0 mb-6 font-medium"
                    >
                        <span className="text-slate-500">/</span> Scroll down
                        <CornerRightDown className="w-3.5 h-3.5 ml-1 opacity-50" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-right text-slate-300 md:max-w-md text-sm md:text-[15px] leading-relaxed font-sans font-normal"
                    >
                        We help entrepreneurs, creators, and visionaries grow through autonomous market research, reactive web design, and algorithmic marketing strategy.
                    </motion.p>
                </div>
            </div>
            
            {/* The rest of the page gets very minimalistic if they scroll down */}
            <div className="w-full max-w-7xl mx-auto py-32 z-20 hidden md:block border-t border-white/5 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     {/* Simplified elegant features */}
                     <div className="border-t border-white/20 pt-6">
                         <span className="text-xs text-slate-500 block mb-4 uppercase tracking-wider font-semibold">01 / Research</span>
                         <h3 className="font-serif text-2xl mb-4 text-white">Intelligent Market Analysis</h3>
                         <p className="text-sm text-slate-400 leading-relaxed">Understand audiences and locate highly profitable niches without lifting a finger.</p>
                     </div>
                     <div className="border-t border-white/20 pt-6">
                         <span className="text-xs text-slate-500 block mb-4 uppercase tracking-wider font-semibold">02 / Design</span>
                         <h3 className="font-serif text-2xl mb-4 text-white">Generative CSS Architecture</h3>
                         <p className="text-sm text-slate-400 leading-relaxed">Turn high level prompts into fully functional, accessible, and responsive websites.</p>
                     </div>
                     <div className="border-t border-white/20 pt-6">
                         <span className="text-xs text-slate-500 block mb-4 uppercase tracking-wider font-semibold">03 / Market</span>
                         <h3 className="font-serif text-2xl mb-4 text-white">Hyper-targeted Campaigns</h3>
                         <p className="text-sm text-slate-400 leading-relaxed">Automatically write, structure, and deploy social media packages tailored to your brand.</p>
                     </div>
                     <div className="border-t border-white/20 pt-6">
                         <span className="text-xs text-slate-500 block mb-4 uppercase tracking-wider font-semibold">04 / Capital</span>
                         <h3 className="font-serif text-2xl mb-4 text-white">Funding Synchronization</h3>
                         <p className="text-sm text-slate-400 leading-relaxed">Cross-index your idea against active grants, investors, and startup accelerators.</p>
                     </div>
                </div>
            </div>
        </div>
    );
}
