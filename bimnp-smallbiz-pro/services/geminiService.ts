
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCurrencyInfo = async (lat: number, lng: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the geographic coordinates (Lat: ${lat}, Lng: ${lng}), identify the likely local currency. Return only a JSON object with 'symbol' and 'code' keys. Example: {"symbol": "£", "code": "GBP"}.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          code: { type: Type.STRING }
        },
        required: ['symbol', 'code']
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{"symbol": "$", "code": "USD"}');
  } catch (e) {
    return { symbol: "$", code: "USD" };
  }
};

export const getStrategicAudit = async (ledger: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this general ledger data and provide a high-level executive summary, identifying risk vectors and strategic growth opportunities: ${JSON.stringify(ledger)}`,
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text;
};

export const getNetworkSynergyAnalysis = async (partners: any, businessState: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these partner nodes and our current business state to identify high-value trade synergies and collaborative growth opportunities: ${JSON.stringify({partners, self: businessState})}`,
  });
  return response.text;
};

export const getMarketingInsights = async (campaignData: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Review these marketing campaigns and provide a 'Resonance Vector' analysis. Suggest budget reallocation for maximum ROI: ${JSON.stringify(campaignData)}`,
  });
  return response.text;
};

export const getProcurementRiskAudit = async (vendorData: any, inventory: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this procurement landscape. Identify supply chain vulnerabilities based on vendor reliability and current stock intensity: ${JSON.stringify({vendors: vendorData, stock: inventory})}`,
  });
  return response.text;
};

export const getLeadScore = async (leadInfo: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evaluate this lead and provide a score from 0-100 and a 'next recommended move': ${leadInfo}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          nextMove: { type: Type.STRING }
        },
        required: ['score', 'nextMove']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getGlobalBrainResponse = async (query: string, mode: 'search' | 'maps' | 'standard', location?: {lat: number, lng: number}) => {
  const model = mode === 'maps' ? 'gemini-2.5-flash' : 'gemini-3-flash-preview';
  
  const config: any = {
    systemInstruction: "You are the BIMNP Business Brain, a high-level executive AI assistant with full access to organizational intelligence."
  };

  if (mode === 'search') {
    config.tools = [{ googleSearch: {} }];
  } else if (mode === 'maps' && location) {
    config.tools = [{ googleMaps: {} }];
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  const response = await ai.models.generateContent({
    model,
    contents: query,
    config
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getInventoryForensics = async (sales: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Scan this inventory and sales data for anomalies (shrinkage, errors) and suggest reorder strategies: ${JSON.stringify(sales)}`,
  });
  return response.text;
};
