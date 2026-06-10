import React, { useState } from 'react';
import { NLSDomain, LessonInput, Textbook } from '../types';
import { DOMAIN_DESCRIPTIONS } from '../types';
import { FileText, Layers, Book } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: LessonInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LessonInput>({
    subject: '',
    grade: '',
    topic: '',
    textbook: Textbook.KetNoiTriThuc, // Set 'Kết nối tri thức với cuộc sống' as default textbook initially
    objectives: '',
    selectedDomains: [],
    mode: 'full_lesson_plan'
  });

  const handleDomainToggle = (domain: NLSDomain) => {
    setFormData(prev => {
      const exists = prev.selectedDomains.includes(domain);
      if (exists) {
        return { ...prev, selectedDomains: prev.selectedDomains.filter(d => d !== domain) };
      } else {
        return { ...prev, selectedDomains: [...prev.selectedDomains, domain] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      
      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Loại kế hoạch muốn tạo</label>
        <div className="flex flex-col gap-3">
           {/* Option 1: Full NLS Plan */}
           <div 
             onClick={() => setFormData({...formData, mode: 'full_lesson_plan'})}
             className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${formData.mode === 'full_lesson_plan' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
           >
              <div className={`p-2 rounded-md ${formData.mode === 'full_lesson_plan' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-semibold text-sm ${formData.mode === 'full_lesson_plan' ? 'text-primary-900' : 'text-slate-700'}`}>Kế hoạch bài dạy (Tích hợp NLS)</h4>
                <p className="text-xs text-slate-500 mt-1">Giáo án 5512/2345 tích hợp đầy đủ các hoạt động theo Khung năng lực số 02/2025.</p>
              </div>
           </div>

           {/* Option 2: Standard 5512 Plan */}
           <div 
             onClick={() => setFormData({...formData, mode: 'standard_5512'})}
             className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${formData.mode === 'standard_5512' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
           >
              <div className={`p-2 rounded-md ${formData.mode === 'standard_5512' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <Book className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-semibold text-sm ${formData.mode === 'standard_5512' ? 'text-indigo-900' : 'text-slate-700'}`}>Kế hoạch bài dạy (Chuẩn 5512)</h4>
                <p className="text-xs text-slate-500 mt-1">Giáo án truyền thống tập trung vào chuyên môn, chưa tích hợp chuyên sâu năng lực số.</p>
              </div>
           </div>

           {/* Option 3: Integration Only */}
           <div 
             onClick={() => setFormData({...formData, mode: 'integration_only'})}
             className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${formData.mode === 'integration_only' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
           >
              <div className={`p-2 rounded-md ${formData.mode === 'integration_only' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-semibold text-sm ${formData.mode === 'integration_only' ? 'text-primary-900' : 'text-slate-700'}`}>Gợi ý Hoạt động NLS riêng lẻ</h4>
                <p className="text-xs text-slate-500 mt-1">Chỉ đề xuất các hoạt động công nghệ để bổ sung vào giáo án có sẵn.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Môn học</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            placeholder="Ví dụ: Ngữ Văn, Toán, Tin học..."
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Khối lớp</label>
          <select
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
            value={formData.grade}
            onChange={e => setFormData({ ...formData, grade: e.target.value })}
          >
            <option value="">Chọn khối lớp</option>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
              <option key={g} value={g}>Lớp {g}</option>
            ))}
            <option value="GDTX">Giáo dục thường xuyên</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Bộ sách giáo khoa</label>
        <select
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
          value={formData.textbook}
          onChange={e => setFormData({ ...formData, textbook: e.target.value })}
        >
          <option value="">Chọn bộ sách</option>
          {Object.values(Textbook).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tên bài dạy / Chủ đề</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="Ví dụ: Văn bản thuyết minh, Hàm số bậc hai..."
          value={formData.topic}
          onChange={e => setFormData({ ...formData, topic: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Mục tiêu / Nội dung chính (Tóm tắt)</label>
        <textarea
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="Mô tả ngắn gọn mục tiêu kiến thức của bài học..."
          value={formData.objectives}
          onChange={e => setFormData({ ...formData, objectives: e.target.value })}
        />
      </div>

      {formData.mode !== 'standard_5512' && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Miền năng lực số trọng tâm (Thông tư 02/2025)
            <span className="block text-xs font-normal text-slate-500 mt-1">Chọn các miền bạn muốn tập trung (hoặc để trống để AI tự chọn)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(NLSDomain).map((domain) => (
              <div
                key={domain}
                onClick={() => handleDomainToggle(domain)}
                className={`
                  cursor-pointer p-3 rounded-lg border transition-all duration-200 relative
                  ${formData.selectedDomains.includes(domain) 
                    ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' 
                    : 'bg-white border-slate-200 hover:border-primary-300'}
                `}
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center
                    ${formData.selectedDomains.includes(domain) ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}
                  `}>
                    {formData.selectedDomains.includes(domain) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{domain}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-tight">{DOMAIN_DESCRIPTIONS[domain]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-all
          ${isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5'}
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
        ) : (
          `Tạo Nội Dung`
        )}
      </button>
    </form>
  );
};

export default InputForm;