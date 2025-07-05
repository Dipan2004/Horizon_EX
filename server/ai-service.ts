import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export interface AIProvider {
  analyzeResume(content: string): Promise<{
    skills: string[];
    experience: string;
    achievements: string[];
  }>;
  
  researchCompany(companyName: string, position: string): Promise<{
    culture: string;
    mission: string;
    recentNews: string;
    requiredSkills: string[];
  }>;
  
  generateInterviewQuestions(companyName: string, position: string, userSkills: string[], experience: string): Promise<{
    questions: Array<{
      id: string;
      text: string;
      type: string;
      difficulty: string;
    }>;
  }>;
  
  evaluateResponse(question: string, response: string): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    suggestion: string;
  }>;
  
  generateSuggestions(context: string, conversation: string, userProfile: any): Promise<{
    keyPoints: string[];
    followUpSuggestions: string[];
    communicationTips: string[];
    relevantAchievements: string[];
  }>;
}

export class GeminiProvider implements AIProvider {
  private genai: GoogleGenerativeAI;
  private model: any;
  
  constructor(apiKey: string) {
    this.genai = new GoogleGenerativeAI(apiKey);
    this.model = this.genai.getGenerativeModel({ model: "gemini-pro" });
  }
  
  async analyzeResume(content: string) {
    try {
      const prompt = `Analyze this resume and extract information in JSON format:
      
Resume: ${content}

Please provide a JSON response with:
- skills: array of technical and soft skills mentioned
- experience: brief summary of work experience  
- achievements: array of key accomplishments

Format: {"skills": ["skill1", "skill2"], "experience": "summary", "achievements": ["achievement1"]}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const analysis = JSON.parse(text);
        return {
          skills: analysis.skills || [],
          experience: analysis.experience || '',
          achievements: analysis.achievements || []
        };
      } catch {
        return {
          skills: this.extractSkillsFromText(content),
          experience: 'Professional with relevant industry experience',
          achievements: this.extractAchievementsFromText(content)
        };
      }
    } catch (error) {
      console.error('Gemini resume analysis error:', error);
      return {
        skills: this.extractSkillsFromText(content),
        experience: 'Professional with relevant industry experience',
        achievements: this.extractAchievementsFromText(content)
      };
    }
  }
  
  async researchCompany(companyName: string, position: string) {
    try {
      const prompt = `Research ${companyName} for the position of ${position}. Provide insights about company culture, mission, recent developments, and key skills required for this role.

Return JSON format: {"culture": "...", "mission": "...", "recentNews": "...", "requiredSkills": ["skill1", "skill2"]}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const research = JSON.parse(text);
        return {
          culture: research.culture || `${companyName} fosters innovation and collaboration`,
          mission: research.mission || `${companyName} is committed to excellence`,
          recentNews: research.recentNews || `${companyName} continues to grow`,
          requiredSkills: research.requiredSkills || this.getDefaultSkillsForPosition(position)
        };
      } catch {
        return {
          culture: `${companyName} values teamwork and innovation`,
          mission: `${companyName} strives for industry leadership`,
          recentNews: `${companyName} continues to grow in the market`,
          requiredSkills: this.getDefaultSkillsForPosition(position)
        };
      }
    } catch (error) {
      console.error('Gemini company research error:', error);
      return {
        culture: `${companyName} values teamwork and innovation`,
        mission: `${companyName} strives for industry leadership`,
        recentNews: `${companyName} continues to grow in the market`,
        requiredSkills: this.getDefaultSkillsForPosition(position)
      };
    }
  }
  
  async generateInterviewQuestions(companyName: string, position: string, userSkills: string[], experience: string) {
    try {
      const prompt = `Generate interview questions for a ${position} position at ${companyName}. 
      
User Skills: ${userSkills.join(', ')}
Experience: ${experience}

Generate 5 varied interview questions with different types and difficulty levels.
Return JSON format: {"questions": [{"id": "q1", "text": "question", "type": "behavioral", "difficulty": "medium"}]}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const data = JSON.parse(text);
        return {
          questions: data.questions || this.getDefaultQuestions(companyName, position, userSkills)
        };
      } catch {
        return {
          questions: this.getDefaultQuestions(companyName, position, userSkills)
        };
      }
    } catch (error) {
      console.error('Gemini question generation error:', error);
      return {
        questions: this.getDefaultQuestions(companyName, position, userSkills)
      };
    }
  }
  
  async evaluateResponse(question: string, response: string) {
    try {
      const prompt = `Evaluate this interview response:
      
Question: ${question}
Response: ${response}

Provide feedback in JSON format: {"score": 85, "strengths": ["point1"], "improvements": ["point1"], "suggestion": "overall advice"}`;

      const result = await this.model.generateContent(prompt);
      const responseText = await result.response.text();

      try {
        const feedback = JSON.parse(responseText);
        return {
          score: feedback.score || 75,
          strengths: feedback.strengths || ['Clear communication'],
          improvements: feedback.improvements || ['Add more specific examples'],
          suggestion: feedback.suggestion || 'Consider providing more detailed examples'
        };
      } catch {
        return this.getBasicFeedback(response);
      }
    } catch (error) {
      console.error('Gemini evaluation error:', error);
      return this.getBasicFeedback(response);
    }
  }
  
  async generateSuggestions(context: string, conversation: string, userProfile: any) {
    try {
      const prompt = `Generate real-time interview assistance based on:
      
Context: ${context}
Conversation: ${conversation}
User Profile: ${JSON.stringify(userProfile)}

Provide suggestions in JSON format: {"keyPoints": [], "followUpSuggestions": [], "communicationTips": [], "relevantAchievements": []}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const suggestions = JSON.parse(text);
        return {
          keyPoints: suggestions.keyPoints || [],
          followUpSuggestions: suggestions.followUpSuggestions || [],
          communicationTips: suggestions.communicationTips || [],
          relevantAchievements: suggestions.relevantAchievements || []
        };
      } catch {
        return this.getBasicSuggestions(userProfile);
      }
    } catch (error) {
      console.error('Gemini suggestions error:', error);
      return this.getBasicSuggestions(userProfile);
    }
  }
  
  private extractSkillsFromText(text: string): string[] {
    const skillKeywords = [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'TypeScript', 'Java', 'C++', 'Git', 'Docker', 'AWS', 'Azure',
      'Leadership', 'Communication', 'Problem Solving', 'Team Work'
    ];
    
    return skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 10);
  }
  
  private extractAchievementsFromText(text: string): string[] {
    const lines = text.split('\n');
    const achievementLines = lines.filter(line => 
      /\b(achieved|improved|increased|reduced|led|managed|delivered|built|created)\b/i.test(line)
    );
    
    return achievementLines.slice(0, 5).map(line => line.trim());
  }
  
  private getDefaultSkillsForPosition(position: string): string[] {
    const positionSkills: { [key: string]: string[] } = {
      'developer': ['Programming', 'Problem Solving', 'Version Control', 'Testing'],
      'manager': ['Leadership', 'Communication', 'Project Management', 'Strategic Planning'],
      'designer': ['Creative Thinking', 'User Experience', 'Visual Design', 'Prototyping'],
      'analyst': ['Data Analysis', 'Critical Thinking', 'Research', 'Reporting'],
      'engineer': ['Technical Skills', 'Problem Solving', 'Systems Thinking', 'Innovation']
    };
    
    const positionLower = position.toLowerCase();
    for (const [key, skills] of Object.entries(positionSkills)) {
      if (positionLower.includes(key)) {
        return skills;
      }
    }
    
    return ['Communication', 'Problem Solving', 'Team Collaboration', 'Adaptability'];
  }
  
  private getDefaultQuestions(companyName: string, position: string, userSkills: string[]) {
    return [
      {
        id: 'q1',
        text: `Why are you interested in working at ${companyName}?`,
        type: 'behavioral',
        difficulty: 'easy'
      },
      {
        id: 'q2',
        text: `Describe your experience with ${userSkills[0] || 'relevant technologies'}.`,
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'q3',
        text: `Tell me about a challenging project you worked on.`,
        type: 'behavioral',
        difficulty: 'medium'
      },
      {
        id: 'q4',
        text: `How do you handle working under pressure?`,
        type: 'behavioral',
        difficulty: 'medium'
      },
      {
        id: 'q5',
        text: `What are your long-term career goals?`,
        type: 'behavioral',
        difficulty: 'easy'
      }
    ];
  }
  
  private getBasicFeedback(response: string) {
    const length = response.length;
    const score = Math.min(Math.max(length / 10, 50), 90);
    
    return {
      score: Math.round(score),
      strengths: ['Clear communication'],
      improvements: ['Add more specific examples'],
      suggestion: 'Consider providing more detailed examples to strengthen your response'
    };
  }
  
  private getBasicSuggestions(userProfile: any) {
    return {
      keyPoints: ['Highlight your experience', 'Show enthusiasm', 'Ask thoughtful questions'],
      followUpSuggestions: ['Can you tell me more about the team?', 'What does success look like in this role?'],
      communicationTips: ['Maintain eye contact', 'Speak clearly', 'Use specific examples'],
      relevantAchievements: userProfile?.achievements || ['Professional growth', 'Team collaboration']
    };
  }
}

export class OpenRouterProvider implements AIProvider {
  private openai: OpenAI;
  
  constructor(apiKey: string, baseURL: string = 'https://openrouter.ai/api/v1') {
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });
  }
  
  async analyzeResume(content: string) {
    try {
      const prompt = `Analyze this resume and extract information in JSON format:
      
Resume: ${content}

Please provide a JSON response with:
- skills: array of technical and soft skills mentioned
- experience: brief summary of work experience  
- achievements: array of key accomplishments

Format: {"skills": ["skill1", "skill2"], "experience": "summary", "achievements": ["achievement1"]}`;

      const completion = await this.openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const text = completion.choices[0].message.content || '';
      
      try {
        const analysis = JSON.parse(text);
        return {
          skills: analysis.skills || [],
          experience: analysis.experience || '',
          achievements: analysis.achievements || []
        };
      } catch {
        return {
          skills: this.extractSkillsFromText(content),
          experience: 'Professional with relevant industry experience',
          achievements: this.extractAchievementsFromText(content)
        };
      }
    } catch (error) {
      console.error('OpenRouter resume analysis error:', error);
      return {
        skills: this.extractSkillsFromText(content),
        experience: 'Professional with relevant industry experience',
        achievements: this.extractAchievementsFromText(content)
      };
    }
  }
  
  async researchCompany(companyName: string, position: string) {
    try {
      const prompt = `Research ${companyName} for the position of ${position}. Provide insights about company culture, mission, recent developments, and key skills required for this role.

Return JSON format: {"culture": "...", "mission": "...", "recentNews": "...", "requiredSkills": ["skill1", "skill2"]}`;

      const completion = await this.openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const text = completion.choices[0].message.content || '';
      
      try {
        const research = JSON.parse(text);
        return {
          culture: research.culture || `${companyName} fosters innovation and collaboration`,
          mission: research.mission || `${companyName} is committed to excellence`,
          recentNews: research.recentNews || `${companyName} continues to grow`,
          requiredSkills: research.requiredSkills || this.getDefaultSkillsForPosition(position)
        };
      } catch {
        return {
          culture: `${companyName} values teamwork and innovation`,
          mission: `${companyName} strives for industry leadership`,
          recentNews: `${companyName} continues to grow in the market`,
          requiredSkills: this.getDefaultSkillsForPosition(position)
        };
      }
    } catch (error) {
      console.error('OpenRouter company research error:', error);
      return {
        culture: `${companyName} values teamwork and innovation`,
        mission: `${companyName} strives for industry leadership`,
        recentNews: `${companyName} continues to grow in the market`,
        requiredSkills: this.getDefaultSkillsForPosition(position)
      };
    }
  }
  
  async generateInterviewQuestions(companyName: string, position: string, userSkills: string[], experience: string) {
    try {
      const prompt = `Generate interview questions for a ${position} position at ${companyName}. 
      
User Skills: ${userSkills.join(', ')}
Experience: ${experience}

Generate 5 varied interview questions with different types and difficulty levels.
Return JSON format: {"questions": [{"id": "q1", "text": "question", "type": "behavioral", "difficulty": "medium"}]}`;

      const completion = await this.openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const text = completion.choices[0].message.content || '';
      
      try {
        const data = JSON.parse(text);
        return {
          questions: data.questions || this.getDefaultQuestions(companyName, position, userSkills)
        };
      } catch {
        return {
          questions: this.getDefaultQuestions(companyName, position, userSkills)
        };
      }
    } catch (error) {
      console.error('OpenRouter question generation error:', error);
      return {
        questions: this.getDefaultQuestions(companyName, position, userSkills)
      };
    }
  }
  
  async evaluateResponse(question: string, response: string) {
    try {
      const prompt = `Evaluate this interview response:
      
Question: ${question}
Response: ${response}

Provide feedback in JSON format: {"score": 85, "strengths": ["point1"], "improvements": ["point1"], "suggestion": "overall advice"}`;

      const completion = await this.openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const text = completion.choices[0].message.content || '';
      
      try {
        const feedback = JSON.parse(text);
        return {
          score: feedback.score || 75,
          strengths: feedback.strengths || ['Clear communication'],
          improvements: feedback.improvements || ['Add more specific examples'],
          suggestion: feedback.suggestion || 'Consider providing more detailed examples'
        };
      } catch {
        return this.getBasicFeedback(response);
      }
    } catch (error) {
      console.error('OpenRouter evaluation error:', error);
      return this.getBasicFeedback(response);
    }
  }
  
  async generateSuggestions(context: string, conversation: string, userProfile: any) {
    try {
      const prompt = `Generate real-time interview assistance based on:
      
Context: ${context}
Conversation: ${conversation}
User Profile: ${JSON.stringify(userProfile)}

Provide suggestions in JSON format: {"keyPoints": [], "followUpSuggestions": [], "communicationTips": [], "relevantAchievements": []}`;

      const completion = await this.openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const text = completion.choices[0].message.content || '';
      
      try {
        const suggestions = JSON.parse(text);
        return {
          keyPoints: suggestions.keyPoints || [],
          followUpSuggestions: suggestions.followUpSuggestions || [],
          communicationTips: suggestions.communicationTips || [],
          relevantAchievements: suggestions.relevantAchievements || []
        };
      } catch {
        return this.getBasicSuggestions(userProfile);
      }
    } catch (error) {
      console.error('OpenRouter suggestions error:', error);
      return this.getBasicSuggestions(userProfile);
    }
  }
  
  private extractSkillsFromText(text: string): string[] {
    const skillKeywords = [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'TypeScript', 'Java', 'C++', 'Git', 'Docker', 'AWS', 'Azure',
      'Leadership', 'Communication', 'Problem Solving', 'Team Work'
    ];
    
    return skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 10);
  }
  
  private extractAchievementsFromText(text: string): string[] {
    const lines = text.split('\n');
    const achievementLines = lines.filter(line => 
      /\b(achieved|improved|increased|reduced|led|managed|delivered|built|created)\b/i.test(line)
    );
    
    return achievementLines.slice(0, 5).map(line => line.trim());
  }
  
  private getDefaultSkillsForPosition(position: string): string[] {
    const positionSkills: { [key: string]: string[] } = {
      'developer': ['Programming', 'Problem Solving', 'Version Control', 'Testing'],
      'manager': ['Leadership', 'Communication', 'Project Management', 'Strategic Planning'],
      'designer': ['Creative Thinking', 'User Experience', 'Visual Design', 'Prototyping'],
      'analyst': ['Data Analysis', 'Critical Thinking', 'Research', 'Reporting'],
      'engineer': ['Technical Skills', 'Problem Solving', 'Systems Thinking', 'Innovation']
    };
    
    const positionLower = position.toLowerCase();
    for (const [key, skills] of Object.entries(positionSkills)) {
      if (positionLower.includes(key)) {
        return skills;
      }
    }
    
    return ['Communication', 'Problem Solving', 'Team Collaboration', 'Adaptability'];
  }
  
  private getDefaultQuestions(companyName: string, position: string, userSkills: string[]) {
    return [
      {
        id: 'q1',
        text: `Why are you interested in working at ${companyName}?`,
        type: 'behavioral',
        difficulty: 'easy'
      },
      {
        id: 'q2',
        text: `Describe your experience with ${userSkills[0] || 'relevant technologies'}.`,
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'q3',
        text: `Tell me about a challenging project you worked on.`,
        type: 'behavioral',
        difficulty: 'medium'
      },
      {
        id: 'q4',
        text: `How do you handle working under pressure?`,
        type: 'behavioral',
        difficulty: 'medium'
      },
      {
        id: 'q5',
        text: `What are your long-term career goals?`,
        type: 'behavioral',
        difficulty: 'easy'
      }
    ];
  }
  
  private getBasicFeedback(response: string) {
    const length = response.length;
    const score = Math.min(Math.max(length / 10, 50), 90);
    
    return {
      score: Math.round(score),
      strengths: ['Clear communication'],
      improvements: ['Add more specific examples'],
      suggestion: 'Consider providing more detailed examples to strengthen your response'
    };
  }
  
  private getBasicSuggestions(userProfile: any) {
    return {
      keyPoints: ['Highlight your experience', 'Show enthusiasm', 'Ask thoughtful questions'],
      followUpSuggestions: ['Can you tell me more about the team?', 'What does success look like in this role?'],
      communicationTips: ['Maintain eye contact', 'Speak clearly', 'Use specific examples'],
      relevantAchievements: userProfile?.achievements || ['Professional growth', 'Team collaboration']
    };
  }
}

// Factory function to create the appropriate AI provider
export function createAIProvider(): AIProvider {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  
  if (geminiKey) {
    console.log('Using Gemini AI provider');
    return new GeminiProvider(geminiKey);
  } else if (openRouterKey) {
    console.log('Using OpenRouter AI provider');
    return new OpenRouterProvider(openRouterKey);
  } else {
    console.log('No AI provider configured, using Gemini with empty key (will use fallback responses)');
    return new GeminiProvider('');
  }
}