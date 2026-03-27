import { supabase } from '../lib/supabase';
import { Project } from '../types';

export const projectService = {
    async saveProject(project: Project): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .upsert({
                id: project.id,
                name: project.name,
                idea: project.idea,
                industry: project.industry || null,
                targetAudience: project.targetAudience || null,
                location: project.location || null,
                createdAt: project.createdAt, // Needs to be a valid timestamp string
                marketResearch: project.marketResearch || null,
                competitors: project.competitors || null,
                websiteCode: project.websiteCode || null,
                marketingKit: project.marketingKit || null,
                fundingOpportunities: project.fundingOpportunities || null,
                chatHistory: project.chatHistory || [],
            });

        if (error) {
            console.error('Error saving project:', error);
            throw error;
        }
    },

    async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', projectId);

        if (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    },

    async getProjects(): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }

        return data as Project[];
    },

    async getProjectById(id: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Note row found
            }
            console.error('Error fetching project:', error);
            throw error;
        }

        return data as Project;
    },

    async deleteProject(id: string): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
};
