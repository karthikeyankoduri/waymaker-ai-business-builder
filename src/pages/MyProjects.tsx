import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { Briefcase, Trash2, Calendar, Target, MapPin, Users } from 'lucide-react';

export default function MyProjects() {
    const { projects, setActiveProjectId, deleteProject } = useProjects();
    const navigate = useNavigate();

    const handleOpenProject = (id: string) => {
        setActiveProjectId(id);
        navigate('/dashboard');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl neon-border border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
            </div>

            {projects.length === 0 ? (
                <div className="glass-card p-12 text-center flex flex-col items-center border-dashed border-white/20">
                    <Briefcase className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
                    <p className="text-slate-400 mb-6">Create your first business plan using the AI Orchestrator.</p>
                    <button
                        onClick={() => {
                            setActiveProjectId(null);
                            navigate('/dashboard');
                        }}
                        className="px-6 py-3 rounded-xl bg-primary/20 text-primary font-bold hover:bg-primary/30 transition-colors border border-primary/30"
                    >
                        Start New Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-all border-white/5 hover:border-primary/30 group">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors line-clamp-2">{project.name}</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteProject(project.id);
                                    }}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                                {project.idea}
                            </p>

                            <div className="space-y-2 mb-6 text-xs text-slate-500">
                                {project.industry && (
                                    <div className="flex items-center gap-2">
                                        <Target className="w-3.5 h-3.5" /> <span>{project.industry}</span>
                                    </div>
                                )}
                                {project.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" /> <span>{project.location}</span>
                                    </div>
                                )}
                                {project.targetAudience && (
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5" /> <span>{project.targetAudience}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => handleOpenProject(project.id)}
                                    className="text-sm font-medium text-primary hover:text-secondary transition-colors"
                                >
                                    Open Project &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
