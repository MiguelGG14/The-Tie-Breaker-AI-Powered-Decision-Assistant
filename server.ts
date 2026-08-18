import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Brainstorm options endpoint if user has a broad dilemma
  app.post("/api/brainstorm-options", async (req, res) => {
    try {
      const { dilemma, context } = req.body;
      if (!dilemma) {
        return res.status(400).json({ error: "Dilemma is required" });
      }

      const ai = getAiClient();
      const prompt = `You are The Tiebreaker, an expert executive decision analyst.
Analyze this user's decision dilemma and brainstorm 2 to 4 distinct, well-defined options, along with key priorities and decision criteria they should consider.

Dilemma: "${dilemma}"
Context: "${context || "None provided"}"

Provide response in JSON matching schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A crisp, clear title for this decision" },
              refinedContext: { type: Type.STRING, description: "Synthesized background and stakes" },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Clear name of option" },
                    description: { type: Type.STRING, description: "1-2 sentence description of what this choice entails" },
                    tagline: { type: Type.STRING, description: "Catchy 3-5 word summary (e.g., 'High Risk, High Reward')" }
                  },
                  required: ["name", "description"]
                }
              },
              suggestedPriorities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key values or priorities to weigh (e.g., 'Speed of delivery', 'Cost efficiency', 'Mental well-being')"
              }
            },
            required: ["title", "options", "suggestedPriorities"]
          }
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in brainstorm-options:", err);
      res.status(500).json({ error: err.message || "Failed to brainstorm options" });
    }
  });

  // Main Comprehensive Decision Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { title, context, options, priorities, userConstraints } = req.body;

      if (!title && (!options || options.length === 0)) {
        return res.status(400).json({ error: "Decision title or options are required." });
      }

      const ai = getAiClient();

      const optionsList = (options && options.length > 0)
        ? options.map((opt: any, idx: number) => `Option ${idx + 1}: ${typeof opt === 'string' ? opt : opt.name} - ${opt.description || ''}`).join("\n")
        : "Infer 2 best contrasting options for this decision (e.g. Option A vs Option B, or Proceed vs Postpone / Stay with status quo).";

      const prompt = `You are "The Tiebreaker", an unbiased, world-class strategic decision advisor.
Perform a thorough, rigorous, multi-angle decision breakdown for the following situation:

Decision Title: "${title || "Decision Analysis"}"
Background & Context: "${context || "Standard evaluation"}"
User Stated Priorities & Values: "${Array.isArray(priorities) ? priorities.join(", ") : (priorities || "Balance risk and upside")}"
Constraints: "${userConstraints || "None provided"}"

Options to compare:
${optionsList}

You MUST deliver:
1. Normalized Options (each with a unique ID, clear Name, Tagline, and Summary).
2. For EACH option:
   - 3 to 5 nuanced, prioritized PROS (with impact score 1 to 5, category: Financial, Career, Lifestyle, Emotional, Risk, Effort, Health, General, and clear explanation).
   - 3 to 5 candid, realistic CONS (with impact score 1 to 5, category, and clear explanation).
   - A SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) specific to this option.
3. A Side-by-Side Comparison Matrix with 4 to 6 relevant Evaluation Criteria:
   - For each criterion: Name, Description, Weight (1-5), and for every option a Score (1-10) and concise Rationale.
4. Comprehensive "Tiebreaker Verdict":
   - Clear Winner / Recommended Choice
   - Confidence Score (0 to 100%)
   - Executive Summary
   - "The Deciding Factor" (the single crux insight that breaks the tie)
   - "The Critical Tradeoff" (what you give up and must accept)
   - Recommended Action Plan (3-5 concrete chronological next steps)
   - Pivot Triggers ("If X happens or is true, pivot to Option Y")
5. Blindspots & Hidden Risks (2-3 unconsidered second-order consequences with mitigation strategies).

Ensure sharp, honest, highly practical reasoning.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              refinedContext: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    tagline: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["id", "name", "description"]
                }
              },
              optionsAnalysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    optionName: { type: Type.STRING },
                    pros: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          category: {
                            type: Type.STRING,
                            description: "Financial, Career, Lifestyle, Emotional, Risk, Effort, Health, or General"
                          },
                          impact: { type: Type.INTEGER, description: "1 to 5" },
                          explanation: { type: Type.STRING }
                        },
                        required: ["id", "text", "category", "impact"]
                      }
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          category: {
                            type: Type.STRING,
                            description: "Financial, Career, Lifestyle, Emotional, Risk, Effort, Health, or General"
                          },
                          impact: { type: Type.INTEGER, description: "1 to 5" },
                          explanation: { type: Type.STRING }
                        },
                        required: ["id", "text", "category", "impact"]
                      }
                    },
                    swot: {
                      type: Type.OBJECT,
                      properties: {
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["strengths", "weaknesses", "opportunities", "threats"]
                    }
                  },
                  required: ["optionId", "optionName", "pros", "cons", "swot"]
                }
              },
              criteria: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    weight: { type: Type.INTEGER, description: "1 to 5" },
                    scores: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          optionId: { type: Type.STRING },
                          score: { type: Type.INTEGER, description: "1 to 10" },
                          rationale: { type: Type.STRING }
                        },
                        required: ["optionId", "score"]
                      }
                    }
                  },
                  required: ["id", "name", "description", "weight", "scores"]
                }
              },
              verdict: {
                type: Type.OBJECT,
                properties: {
                  winnerId: { type: Type.STRING },
                  winnerName: { type: Type.STRING },
                  confidenceScore: { type: Type.INTEGER, description: "0 to 100" },
                  summary: { type: Type.STRING },
                  theDecidingFactor: { type: Type.STRING },
                  criticalTradeoff: { type: Type.STRING },
                  recommendedActionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pivotTriggers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        condition: { type: Type.STRING },
                        alternativeChoice: { type: Type.STRING }
                      },
                      required: ["condition", "alternativeChoice"]
                    }
                  }
                },
                required: ["winnerId", "winnerName", "confidenceScore", "summary", "theDecidingFactor", "criticalTradeoff", "recommendedActionPlan", "pivotTriggers"]
              },
              blindspots: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    risk: { type: Type.STRING },
                    mitigation: { type: Type.STRING }
                  },
                  required: ["title", "risk", "mitigation"]
                }
              }
            },
            required: ["title", "options", "optionsAnalysis", "criteria", "verdict", "blindspots"]
          }
        }
      });

      const rawJson = response.text || "{}";
      const parsedData = JSON.parse(rawJson);

      // Normalize criteria scores to an object format for easier frontend handling
      const normalizedCriteria = (parsedData.criteria || []).map((c: any) => {
        const scoresObj: Record<string, number> = {};
        const rationalesObj: Record<string, string> = {};
        if (Array.isArray(c.scores)) {
          c.scores.forEach((s: any) => {
            if (s.optionId) {
              scoresObj[s.optionId] = s.score ?? 5;
              rationalesObj[s.optionId] = s.rationale || "";
            }
          });
        } else if (typeof c.scores === "object" && c.scores !== null) {
          Object.assign(scoresObj, c.scores);
        }
        return {
          id: c.id || `crit-${Math.random().toString(36).substring(2, 7)}`,
          name: c.name,
          description: c.description || "",
          weight: c.weight || 3,
          scores: scoresObj,
          rationales: rationalesObj,
        };
      });

      const result = {
        id: `decision-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: parsedData.title || title,
        context: parsedData.refinedContext || context || "",
        priorities: Array.isArray(priorities) ? priorities : (priorities ? [priorities] : []),
        options: parsedData.options || [],
        optionsAnalysis: parsedData.optionsAnalysis || [],
        criteria: normalizedCriteria,
        verdict: parsedData.verdict || {},
        blindspots: parsedData.blindspots || [],
      };

      res.json(result);
    } catch (err: any) {
      console.error("Error in /api/analyze:", err);
      res.status(500).json({ error: err.message || "Failed to analyze decision" });
    }
  });

  // What-If Scenario Tweak endpoint
  app.post("/api/tweak-scenario", async (req, res) => {
    try {
      const { currentAnalysis, scenarioChange } = req.body;
      if (!scenarioChange || !currentAnalysis) {
        return res.status(400).json({ error: "Missing scenario change or current analysis." });
      }

      const ai = getAiClient();
      const prompt = `You are "The Tiebreaker". The user is testing a "What If...?" scenario perturbation on an existing decision.

Current Decision: "${currentAnalysis.title}"
Options: ${JSON.stringify(currentAnalysis.options.map((o: any) => ({ id: o.id, name: o.name })))}
Previous Winner: "${currentAnalysis.verdict?.winnerName}"

SCENARIO SHIFT / HYPOTHETICAL QUESTION:
"${scenarioChange}"

Analyze how this specific change shifts the balance. Does it flip the winner, change confidence, create new pros/cons, or alter key criteria?
Respond with an updated verdict and clear shift analysis.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              shiftSummary: { type: Type.STRING, description: "Summary of how this what-if condition changes the calculus" },
              winnerChanged: { type: Type.BOOLEAN },
              updatedWinnerId: { type: Type.STRING },
              updatedWinnerName: { type: Type.STRING },
              updatedConfidenceScore: { type: Type.INTEGER },
              newDecidingFactor: { type: Type.STRING },
              keyInsight: { type: Type.STRING },
              impactOnOptions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    optionName: { type: Type.STRING },
                    impactNote: { type: Type.STRING },
                    scoreDelta: { type: Type.STRING, description: "e.g. '+2 points (High Benefit)' or '-1 point (New Risk)'" }
                  },
                  required: ["optionId", "optionName", "impactNote"]
                }
              }
            },
            required: ["shiftSummary", "winnerChanged", "updatedWinnerId", "updatedWinnerName", "updatedConfidenceScore", "newDecidingFactor", "keyInsight", "impactOnOptions"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/tweak-scenario:", err);
      res.status(500).json({ error: err.message || "Failed to analyze scenario tweak" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
