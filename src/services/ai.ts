import { GoogleGenAI, Type } from '@google/genai';
import { Project, Competitor, MarketingPost, FundingOpportunity, ChatMessage } from '../types';

let aiClient: GoogleGenAI | null = null;

const getAIClient = (apiKey: string) => {
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
};

const handleAIError = (error: any) => {
    console.error("AI Generation Error: ", error);
    throw new Error(error.message || "Failed to generate AI data.");
};

export const generateMarketResearch = async (apiKey: string, project: Project) => {
    try {
        const ai = getAIClient(apiKey);
        const prompt = `Act as an expert business consultant. Generate a market research report for a new business idea.
Idea: ${project.idea}
${project.industry ? `Industry: ${project.industry}` : ''}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ''}
${project.location ? `Location: ${project.location}` : ''}

Return ONLY a JSON object. DO NOT wrap with markdown code blocks. Schema:
{
  "executiveSummary": "A brief overall summary of the business idea and market.",
  "marketInsights": ["insight point 1 (can include basic markdown formatting like bold)", "insight point 2"],
  "industryTrends": ["trend point 1", "trend point 2"],
  "keyOpportunities": ["opportunity 1", "opportunity 2"]
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return response.text;
    } catch (error) {
        return handleAIError(error);
    }
};

export const generateCompetitors = async (apiKey: string, project: Project): Promise<Competitor[]> => {
    try {
        const ai = getAIClient(apiKey);
        const prompt = `Act as an expert business consultant. Identify 5 potential competitors (real or hypothetical if highly niche) for this business idea.
Idea: ${project.idea}
${project.industry ? `Industry: ${project.industry}` : ''}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ''}
${project.location ? `Location: ${project.location}` : ''}

Return ONLY a JSON array of objects. DO NOT wrap with markdown code blocks. Schema:
[
  { "name": "Competitor Name", "strengths": ["s1", "s2"], "weaknesses": ["w1", "w2"], "gap": "Market gap we can exploit" }
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        return JSON.parse(response.text || "[]");
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const generateWebsiteCode = async (apiKey: string, project: Project) => {
    try {
        const ai = getAIClient(apiKey);
        const prompt = `Act as an expert frontend developer and UX designer. Design a highly converting, modern, single-page landing page for this business using HTML and Tailwind CSS CDN.
Idea: ${project.idea}
${project.industry ? `Industry: ${project.industry}` : ''}
${project.location ? `Location: ${project.location}` : ''}

Return ONLY valid HTML code. Include a Hero section with a strong headline, a Features section, How it works, and a Call to Action. Use a modern, premium color palette.
DO NOT wrap with markdown backticks natively. Return the raw HTML.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let code = response.text || "";
        if (code.startsWith("\`\`\`html")) code = code.replace("\`\`\`html\\n", "");
        if (code.startsWith("\`\`\`")) code = code.replace("\`\`\`\\n", "");
        if (code.endsWith("\`\`\`")) code = code.substring(0, code.length - 3);

        return code.trim();
    } catch (error) {
        return handleAIError(error);
    }
};

export const generateMarketingKit = async (apiKey: string, project: Project): Promise<MarketingPost[]> => {
    try {
        const ai = getAIClient(apiKey);
        const prompt = `Act as an expert social media manager. Generate 4 social media posts (Instagram, LinkedIn, Twitter, Facebook) to launch this business.
Idea: ${project.idea}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ''}
${project.location ? `Location: ${project.location}` : ''}

Return ONLY a JSON array without markdown formatting. Schema:
[
  { "platform": "Instagram", "content": "post text", "hashtags": ["#tag1"], "imagePrompt": "an image prompt for midjourney/dalle of the post" }
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const generateFundingOpportunities = async (apiKey: string, project: Project): Promise<FundingOpportunity[]> => {
    try {
        const ai = getAIClient(apiKey);
        const prompt = `Act as an expert startup advisor. Use real-time web search to find 3 to 5 realistic, current funding opportunities (grants, specific VC firm types, accelerators, local events/competitions, or prominent angel investors) for this business idea. Provide links and profiles.
Idea: ${project.idea}
${project.industry ? `Industry: ${project.industry}` : ''}
${project.location ? `Location: ${project.location}` : ''}

Return ONLY a JSON array without formatting. Schema:
[
  { "type": "Grant / Seed / Accelerator / Event", "name": "Name of fund or type", "amount": "$50k - $250k", "description": "Details about it. Mention the profile details.", "matchReason": "Why we are a good fit", "link": "https://..." }
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        let rawText = response.text || "[]";
        // Clean up markdown formatting if present
        rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

        return JSON.parse(rawText);
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const generateChatResponse = async (apiKey: string, project: Project, messageText: string): Promise<{ message: ChatMessage, updates?: Partial<Project> }> => {
    try {
        const ai = getAIClient(apiKey);

        const projectDataDump = JSON.stringify({
            name: project.name,
            idea: project.idea,
            industry: project.industry,
            targetAudience: project.targetAudience,
            location: project.location,
            marketResearch: project.marketResearch,
            competitors: project.competitors,
            websiteCode: project.websiteCode,
            marketingKit: project.marketingKit,
            fundingOpportunities: project.fundingOpportunities
        }, null, 2);

        const systemInstruction = `You are Waymaker AI, an expert business consultant agent for this project.
Your goal is to help the user build out this project.
You have access to the FULL STATE of the user's project below:
---
${projectDataDump}
---

CRITICAL INSTRUCTION:
If the user asks you to modify, rewrite, design, or customize ANY project data (like changing the website code, rewriting the market research, finding more competitors, etc.), you MUST use the "update_project" tool to apply the actual data changes. Do NOT just output HTML or JSON into the chat block unless you are explaining it. You must actually call the tool to modify their system configuration.

After or while calling the tool, respond concisely and professionally in Markdown letting the user know the change was applied.`;

        // Map history to the required format
        const history: any[] = project.chatHistory.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const contents = [
            { role: 'user', parts: [{ text: systemInstruction }] },
            { role: 'model', parts: [{ text: 'Understood. I have access to the project state and the update_project tool.' }] },
            ...history,
            { role: 'user', parts: [{ text: messageText }] }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                tools: [{
                    functionDeclarations: [
                        {
                            name: "update_project",
                            description: "Updates the project data. Use this tool whenever the user asks to modify the website, market research, competitors, etc.",
                            parameters: {
                                type: Type.OBJECT,
                                properties: {
                                    websiteCode: { type: Type.STRING, description: "The full raw HTML website code" },
                                    marketResearch: { type: Type.STRING, description: "The market research text" },
                                    competitors: {
                                        type: Type.ARRAY,
                                        description: "List of competitors",
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING },
                                                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                                                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                                                gap: { type: Type.STRING }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }]
            }
        });

        let updates: Partial<Project> | undefined;
        let finalResponseText = response.text || "";

        // Check if the AI decided to call the update_project tool
        if (response.functionCalls && response.functionCalls.length > 0) {
            const call = response.functionCalls[0];
            if (call.name === "update_project") {
                updates = call.args as Partial<Project>;

                // Once the tool is called, we immediately supply a fake "success" response 
                // so the AI can generate its final text message to the user.
                const followUpResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        ...contents,
                        { role: 'model', parts: [{ functionCall: call }] },
                        { role: 'user', parts: [{ functionResponse: { name: "update_project", response: { success: true } } }] }
                    ]
                });

                finalResponseText = followUpResponse.text || "I have applied the updates to the project!";
            }
        }

        return {
            message: {
                id: crypto.randomUUID(),
                role: 'model',
                content: finalResponseText,
                timestamp: new Date().toISOString()
            },
            updates
        };
    } catch (error) {
        console.error(error);
        return {
            message: {
                id: crypto.randomUUID(),
                role: 'model',
                content: "Error: Could not process request or update project.",
                timestamp: new Date().toISOString()
            }
        };
    }
};

