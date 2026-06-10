import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LessonInput, AIResult } from "../types";
import { NLS_CONTEXT, INTEGRATION_PROMPT, FULL_PLAN_PROMPT, STANDARD_5512_PROMPT } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Vui lòng cấu hình API Key trong biến môi trường.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLessonPlanIntegration = async (input: LessonInput): Promise<AIResult> => {
  const ai = getClient();
  const isStandard5512 = input.mode === 'standard_5512';
  
  const basePrompt = `
    Thông tin bài dạy:
    - Môn học: ${input.subject}
    - Bộ sách giáo khoa: ${input.textbook}
    - Khối lớp: ${input.grade}
    - Tên bài dạy: ${input.topic}
    - Mục tiêu bài học gốc: ${input.objectives}
    ${!isStandard5512 ? `- Các miền năng lực số trọng tâm: ${input.selectedDomains.length > 0 ? input.selectedDomains.join(", ") : "Tự động chọn phù hợp"}` : ''}
    
    Lưu ý: Nếu có nội dung toán học, hãy viết biểu thức dạng LaTeX nằm trong dấu $ (ví dụ $a^2+b^2$).
  `;

  let systemInstruction = "";
  let prompt = "";
  let responseSchema: Schema;

  // Schema for both Full Plan modes (Integrated & Standard)
  const fullPlanSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, enum: ["full"] },
      title: { type: Type.STRING },
      objectives: {
        type: Type.OBJECT,
        properties: {
          knowledge: { type: Type.ARRAY, items: { type: Type.STRING } },
          competencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          qualities: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["knowledge", "competencies", "qualities"]
      },
      equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
      procedures: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            stage: { type: Type.STRING, enum: ["Mở đầu", "Hình thành kiến thức", "Luyện tập", "Vận dụng"] },
            activityName: { type: Type.STRING },
            teacherActivity: { type: Type.STRING },
            studentActivity: { type: Type.STRING },
            digitalApplication: { type: Type.STRING, description: "Nếu không có ứng dụng công nghệ, để trống hoặc ghi 'Không'." },
            product: { type: Type.STRING }
          },
          required: ["stage", "activityName", "teacherActivity", "studentActivity", "digitalApplication", "product"]
        }
      },
      reflection: { type: Type.STRING },
      interactiveSection: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Tóm tắt ngắn gọn và súc tích nội dung chính bằng tiếng Việt." },
          keyDefinitions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "Các định nghĩa, định lý, công thức trọng tâm. Sử dụng ký tự $ để bọc công thức toán học dạng LaTeX." 
          },
          hook: { type: Type.STRING, description: "Tình huống dẫn dắt thực tế (năng lượng, môi trường, đời sống) hoặc câu đố tò mò kích thích tư duy." },
          quickQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "Câu hỏi nhanh về lý thuyết cốt lõi vừa học." },
                suggestedAnswer: { type: Type.STRING, description: "Đáp án gợi ý ngắn gọn, rõ ý." }
              },
              required: ["question", "suggestedAnswer"]
            },
            description: "1-2 câu hỏi tương tác ngắn ôn tập nhanh ngay sau lý thuyết."
          },
          gradedExercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING, description: "Nhận biết | Thông hiểu | Vận dụng" },
                question: { type: Type.STRING, description: "Đề bài chi tiết. Biểu thức toán học bọc trong dấu $" },
                answer: { type: Type.STRING, description: "Đáp án hoặc kết quả ngắn." },
                explanation: { type: Type.STRING, description: "Giải thích chi tiết từng bước bằng LaTeX bọc trong dấu $." }
              },
              required: ["level", "question", "answer", "explanation"]
            },
            description: "Mục bài tập tự luyện gồm ÍT NHẤT 5 câu có độ phân hóa từ nhận biết đến vận dụng, bám sát Kết nối tri thức."
          }
        },
        required: ["summary", "keyDefinitions", "hook", "quickQuestions", "gradedExercises"]
      }
    },
    required: ["type", "title", "objectives", "equipment", "procedures", "reflection", "interactiveSection"]
  };

  // Schema for Integration Only
  const integrationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, enum: ["integration"] },
      overview: {
        type: Type.STRING,
        description: "Nhận xét tổng quan về cơ hội tích hợp trong bài này.",
      },
      activities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            activityName: { type: Type.STRING },
            nlsDomain: { type: Type.STRING },
            nlsComponent: { type: Type.STRING },
            description: { type: Type.STRING },
            tools: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            assessment: { type: Type.STRING },
          },
          required: ["activityName", "nlsDomain", "nlsComponent", "description", "tools", "assessment"],
        },
      },
      recommendations: {
        type: Type.STRING,
        description: "Lời khuyên sư phạm cho giáo viên.",
      },
    },
    required: ["type", "overview", "activities", "recommendations"],
  };


  if (input.mode === 'standard_5512') {
    systemInstruction = "Bạn là giáo viên giỏi, chuyên soạn giáo án theo Công văn 5512/2345.\n" + STANDARD_5512_PROMPT;
    prompt = basePrompt + "\n\nHãy soạn Kế hoạch bài dạy chi tiết (Giáo án) theo chuẩn 5512, bám sát nội dung bộ sách giáo khoa đã chọn.";
    responseSchema = fullPlanSchema;
  } else if (input.mode === 'full_lesson_plan') {
    systemInstruction = NLS_CONTEXT + "\n" + FULL_PLAN_PROMPT;
    prompt = basePrompt + "\n\nHãy soạn Kế hoạch bài dạy chi tiết (Giáo án) có tích hợp sâu Năng lực số, bám sát nội dung bộ sách giáo khoa đã chọn.";
    responseSchema = fullPlanSchema;
  } else {
    // Integration Only
    systemInstruction = NLS_CONTEXT + "\n" + INTEGRATION_PROMPT;
    prompt = basePrompt + "\n\nHãy đề xuất các hoạt động tích hợp Năng lực số cụ thể.";
    responseSchema = integrationSchema;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemInstruction + "\n" + prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.75,
        maxOutputTokens: 8192, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("Không nhận được phản hồi từ Gemini.");

    return JSON.parse(text) as AIResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};