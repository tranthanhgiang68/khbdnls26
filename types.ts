export enum NLSDomain {
  Information = "Khai thác dữ liệu và thông tin",
  Communication = "Giao tiếp và hợp tác",
  Creation = "Sáng tạo nội dung số",
  Safety = "An toàn",
  ProblemSolving = "Giải quyết vấn đề",
  AI = "Ứng dụng trí tuệ nhân tạo"
}

export type GenerationMode = 'integration_only' | 'full_lesson_plan' | 'standard_5512';

export enum Textbook {
  CanhDieu = "Cánh Diều",
  KetNoiTriThuc = "Kết nối tri thức với cuộc sống",
  ChanTroiSangTao = "Chân trời sáng tạo",
  CungKhamPha = "Cùng khám phá",
  Other = "Khác"
}

export interface LessonInput {
  subject: string;
  grade: string;
  topic: string;
  textbook: string;
  objectives: string;
  selectedDomains: NLSDomain[];
  mode: GenerationMode;
}

export interface IntegratedActivity {
  activityName: string;
  nlsDomain: string; // Maps to NLSDomain values
  nlsComponent: string; // Specific component competency (e.g., 1.1, 6.2)
  description: string;
  tools: string[]; // Suggested software/hardware
  assessment: string; // How to assess this skill
}

export interface LessonProcedure {
  stage: string; // Mở đầu, Hình thành kiến thức, Luyện tập, Vận dụng
  activityName: string;
  teacherActivity: string;
  studentActivity: string;
  digitalApplication: string; // How digital tools/NLS are used here
  product: string;
}

export interface GradedExercise {
  level: string; // "Nhận biết" | "Thông hiểu" | "Vận dụng"
  question: string;
  answer: string;
  explanation: string;
}

export interface QuickQuestion {
  question: string;
  suggestedAnswer: string;
}

export interface InteractiveSection {
  summary: string; // Tóm tắt nội dung chính ngắn gọn, súc tích
  keyDefinitions: string[]; // Các định nghĩa, định lý, công thức trọng tâm
  hook: string; // Tình huống vào bài mang tính thực tế hoặc câu đố kích thích tư duy
  quickQuestions: QuickQuestion[]; // 1-2 câu hỏi tương tác nhanh kiểm tra lý thuyết
  gradedExercises: GradedExercise[]; // Ít nhất 5 câu hỏi có phân hóa, đáp án, giải thích chi tiết
}

export interface FullLessonPlan {
  type: 'full';
  title: string;
  objectives: {
    knowledge: string[];
    competencies: string[]; // Including NLS
    qualities: string[];
  };
  equipment: string[];
  procedures: LessonProcedure[];
  reflection: string;
  interactiveSection?: InteractiveSection; // Thêm phần nội dung tương tác & bài tập phân hóa cao cấp
}

export interface IntegrationResult {
  type: 'integration';
  overview: string;
  activities: IntegratedActivity[];
  recommendations: string;
}

export type AIResult = IntegrationResult | FullLessonPlan;

export const DOMAIN_DESCRIPTIONS: Record<NLSDomain, string> = {
  [NLSDomain.Information]: "Tìm kiếm, lọc, đánh giá, quản lý dữ liệu và thông tin.",
  [NLSDomain.Communication]: "Tương tác, chia sẻ, thực hiện trách nhiệm công dân qua công nghệ số.",
  [NLSDomain.Creation]: "Phát triển, tích hợp, chỉnh sửa nội dung số, lập trình, bản quyền.",
  [NLSDomain.Safety]: "Bảo vệ thiết bị, dữ liệu cá nhân, sức khỏe, môi trường.",
  [NLSDomain.ProblemSolving]: "Giải quyết vấn đề kỹ thuật, xác định nhu cầu công nghệ, sáng tạo.",
  [NLSDomain.AI]: "Hiểu biết về AI, sử dụng AI có đạo đức, đánh giá kết quả AI."
};