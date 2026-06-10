import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { LessonInput, AIResult } from './types';
import { generateLessonPlanIntegration } from './services/geminiService';
import { Cpu, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: LessonInput) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateLessonPlanIntegration(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra khi kết nối với Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">NLS Integrator</h1>
              <p className="text-xs text-slate-500 mt-0.5">Tích hợp Khung Năng Lực Số (Thông tư 02/2025)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
             <div className="hidden md:flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium">Model: Gemini 2.5 Flash</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h3 className="font-bold text-blue-900">Hướng dẫn</h3>
              <p className="text-sm text-blue-800 mt-1">
                Nhập thông tin bài dạy và chọn chế độ phù hợp.
                Hệ thống hỗ trợ cả giáo án tích hợp Năng lực số và giáo án 5512 truyền thống.
              </p>
            </div>
            <InputForm onSubmit={handleGenerate} isLoading={loading} />
            
            {!process.env.API_KEY && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <strong>Lưu ý:</strong> Chưa tìm thấy API Key. Vui lòng cấu hình <code>process.env.API_KEY</code> để ứng dụng hoạt động.
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Cpu className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Kết quả sẽ hiển thị tại đây</p>
                <p className="text-sm mt-2">Vui lòng điền thông tin và nhấn "Tạo Nội Dung"</p>
              </div>
            )}

            {result && <ResultDisplay result={result} />}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Ứng dụng hỗ trợ giáo dục tuân thủ Thông tư 02/2025/TT-BGDĐT.</p>
          <p className="mt-2">Powered by Google Gemini 2.5 Flash.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;