import { GoogleGenAI, Type } from '@google/genai';
import { Project, Competitor, MarketingPost, FundingOpportunity, ChatMessage } from '../types';

let aiClient: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

const getAIClient = (apiKey: string) => {
    if (!aiClient || currentApiKey !== apiKey) {
        aiClient = new GoogleGenAI({ apiKey });
        currentApiKey = apiKey;
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
        const prompt = `Act as a top-tier startup consultant. Generate a highly detailed, data-driven market research dashboard for this business idea.
Idea: ${project.idea}
${project.industry ? `Industry: ${project.industry}` : ''}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ''}
${project.location ? `Location: ${project.location}` : ''}

CRITICAL: Return ONLY a valid JSON object. Do not wrap in markdown blocks. Schema:
{
  "marketAnalysis": {
    "tam": { "value": "$XXB", "label": "Total Addressable Market", "description": "Short explanation of this market (e.g. Global Tech)" },
    "sam": { "value": "$XXM", "label": "Serviceable Addressable Market", "description": "Short explanation of SAM (e.g. US B2B Software)" },
    "som": { "value": "$XXM", "label": "Serviceable Obtainable Market", "description": "Short explanation of SOM (e.g. Projected year 3 capture)" },
    "topDownApproach": [
      { "label": "Global/National Market", "value": "$XXB" },
      { "label": "Segment Market", "value": "$XXB" },
      { "label": "Niche Market", "value": "$XXM" },
      { "label": "Direct Addressable", "value": "$XXM" }
    ]
  },
  "positionInMarket": {
    "xAxis": { "left": "Low Quality", "right": "High Quality" },
    "yAxis": { "top": "High Price", "bottom": "Low Price" },
    "pyramid": [
      { "level": "Top Product", "description": "High Value, Convenient" },
      { "level": "Alternatives", "description": "Convenient but Flawed" },
      { "level": "Raw Forms", "description": "Natural but Inconvenient" }
    ],
    "quadrants": {
      "topLeft": { "name": "Cowboy / Overpriced", "competitors": ["Comp A"] },
      "topRight": { "name": "Premium Products", "competitors": ["Our Brand", "Comp B"] },
      "bottomLeft": { "name": "Economy Products", "competitors": ["Comp C"] },
      "bottomRight": { "name": "Bargain / Value", "competitors": ["Comp D"] }
    }
  },
  "competitiveLandscape": [
    { 
      "brand": "Competitor 1", 
      "fundingStatus": "Corporate Backed", 
      "coreFocus": "Frozen Snacks", 
      "consumerFriction": "High (Fry / Heat)", 
      "formatAndStorage": "-18°C" 
    }
  ],
  "keyOpportunities": ["Actionable clear opportunity 1", "Opportunity 2"]
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
        const prompt = `Act as an expert frontend developer and UX designer. Design a highly converting, modern, single-page landing page for this business using HTML5 and Tailwind CSS (via CDN).
Idea: ${project.idea}
${project.industry ? `Industry: ${project.industry}` : ''}
${project.location ? `Location: ${project.location}` : ''}

IMPORTANT INSTRUCTIONS:
1. Return ONLY valid, completely self-contained HTML5 code starting with <!DOCTYPE html>.
2. Include the Tailwind CSS CDN script in the <head>: <script src="https://cdn.tailwindcss.com"></script>
3. Include Google Fonts (e.g., 'Inter') and apply it to the body. Use a modern, premium color palette.
4. Include a full structure: Navigation, Hero section with a strong headline, Features section, How it Works, and a clear Call to Action footer.
5. Use reliable placeholder images (e.g., https://placehold.co/600x400 or generic illustrations) and responsive design (mobile-first).
6. Add subtle hover effects, transitions, and ample whitespace.
7. Return the raw HTML. DO NOT wrap the output in markdown code blocks (\`\`\`html) or anything else. Just the code.`;

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
const prompt = `Act as an expert social media manager. Generate 4 exceptional, premium social media posts (Instagram, LinkedIn, Twitter, Facebook) to launch this business.
Idea: ${project.idea}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ''}
${project.location ? `Location: ${project.location}` : ''}
${project.competitors && project.competitors.length > 0 ? `
Competitor Intelligence Context: 
We are displacing these rivals:
${project.competitors.map(c => `- ${c.name} (Weakness to exploit: ${c.weaknesses?.join(', ') || c.gap || 'unknown'})`).join('\n')}
Design the marketing copy to implicitly highlight how our brand bridges the exact market gaps left by these competitors without naming them natively.` : ''}

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

export const analyzeProfileEngagement = async (apiKey: string, profileLink: string) => {
    try {
        const serpApiKey = import.meta.env.VITE_SERPAPI_KEY;
        const serpRes = await fetch(`/api/serp/search?engine=google&q=${encodeURIComponent(profileLink)}&api_key=${serpApiKey}`);
        const serpData = await serpRes.json();
        
        const serpContext = JSON.stringify(serpData.organic_results?.slice(0, 5) || serpData, null, 2);

        const ai = getAIClient(apiKey);
        const prompt = `I have run a real SerpApi web search on the core URL profile: ${profileLink}
Here is the raw organic search data returned:
${serpContext}

Based on this real-world search engine data, please break down the profile's presence into verified facts. 
Also, sensibly infer specific numerical metrics (likes, comments, shares on top activity) based realistically on their visible footprint size and engagement signals in the text.

Return ONLY a JSON object without markdown formatting. Schema:
{
  "profileName": "Name of the profile",
  "platform": "The platform this link belongs to (e.g., Twitter, LinkedIn)",
  "verifiedBio": "The exact bio or description extracted from the search result.",
  "overallEngagementScore": 85,
  "recentActivity": [
    { 
      "title": "Short title or content snippet", 
      "likes": 500,
      "comments": 45,
      "shares": 10,
      "date": "Exact date if visible, else 'Recent'"
    }
  ]
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        let rawText = response.text || "{}";
        rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

        return JSON.parse(rawText);
    } catch (error) {
        console.error("Profile analysis error", error);
        return null;
    }
};

export const analyzeCompetitorInstagrams = async (apiKey: string, competitors: Competitor[]) => {
    try {
        const serpApiKey = import.meta.env.VITE_SERPAPI_KEY;
        const allContexts = [];
        const topCompetitors = competitors.slice(0, 3);
        
        for (const comp of topCompetitors) {
           const res = await fetch(`/api/serp/search?engine=google&q=${encodeURIComponent('site:instagram.com ' + comp.name)}&api_key=${serpApiKey}`);
           const data = await res.json();
           allContexts.push({
              competitor: comp.name,
              organic_results: data.organic_results?.slice(0, 3) || []
           });
        }

        const ai = getAIClient(apiKey);
        const prompt = `I have run a precision SerpApi web search for the Instagram presence of these competitors:
${JSON.stringify(allContexts, null, 2)}

Analyze their organic footprint. Extrapolate an accurate Instagram engagement report (likes, comments, and an overall 'Engagement Score' out of 100) strictly based on their visible search snippet clout.

Return ONLY a JSON array without markdown formatting. Schema:
[
  {
    "competitorName": "Name",
    "handle": "@handle_found",
    "engagementScore": 85,
    "avgLikes": 1200,
    "avgComments": 150,
    "followersEstimate": "50K+"
  }
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        let rawText = response.text || "[]";
        rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

        return JSON.parse(rawText);
    } catch (error) {
        console.error("Competitor analysis error", error);
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

