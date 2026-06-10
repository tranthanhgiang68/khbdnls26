import React, { useEffect, useRef } from 'react';
import { AIResult, FullLessonPlan, IntegrationResult } from '../types';
import { Download, Share2, BookOpen, ShieldCheck, Cpu, MessageSquare, FileText, Search, Printer, FileType } from 'lucide-react';

declare global {
  interface Window {
    katex: any;
  }
  interface Navigator {
    msSaveOrOpenBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

interface ResultDisplayProps {
  result: AIResult | null;
}

// Helper component to render text with Latex
const LatexText: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      // Very simple parser: Find $...$ and render
      const parts = text.split(/(\$[^$]+\$)/g);
      containerRef.current.innerHTML = '';
      
      parts.forEach(part => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          const span = document.createElement('span');
          try {
            window.katex.render(math, span, { throwOnError: false, output: 'html' });
          } catch (e) {
            span.textContent = part;
          }
          containerRef.current?.appendChild(span);
        } else {
          containerRef.current?.appendChild(document.createTextNode(part));
        }
      });
    }
  }, [text]);

  if (!text) return null;
  
  // Fallback if KaTeX isn't loaded yet
  if (typeof window === 'undefined' || !window.katex) {
      return <span>{text}</span>;
  }

  return <span ref={containerRef} />;
};

const getDomainIcon = (domainName: string) => {
  if (domainName.includes("thông tin")) return <Search className="w-5 h-5 text-blue-600" />;
  if (domainName.includes("Giao tiếp")) return <MessageSquare className="w-5 h-5 text-green-600" />;
  if (domainName.includes("Sáng tạo")) return <FileText className="w-5 h-5 text-purple-600" />;
  if (domainName.includes("An toàn")) return <ShieldCheck className="w-5 h-5 text-red-600" />;
  if (domainName.includes("trí tuệ")) return <Cpu className="w-5 h-5 text-indigo-600" />;
  return <BookOpen className="w-5 h-5 text-slate-600" />;
};

const FullPlanView: React.FC<{ plan: FullLessonPlan }> = ({ plan }) => {
  return (
    <div className="bg-white p-8 space-y-8 font-serif print-content">
      <div className="text-center border-b-2 border-slate-100 pb-6">
        <h2 className="text-3xl font-bold text-slate-900 uppercase mb-2">Kế hoạch bài dạy</h2>
        <h3 className="text-xl font-semibold text-primary-700"><LatexText text={plan.title} /></h3>
      </div>

      <section>
        <h4 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3 pb-1">I. Mục tiêu bài dạy</h4>
        <div className="space-y-4 pl-4">
          <div>
            <span className="font-bold text-slate-800">1. Về kiến thức:</span>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
              {plan.objectives.knowledge.map((item, idx) => <li key={idx}><LatexText text={item} /></li>)}
            </ul>
          </div>
          <div>
            <span className="font-bold text-slate-800">2. Về năng lực (gồm Năng lực số):</span>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
              {plan.objectives.competencies.map((item, idx) => <li key={idx}><LatexText text={item} /></li>)}
            </ul>
          </div>
          <div>
            <span className="font-bold text-slate-800">3. Về phẩm chất:</span>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
              {plan.objectives.qualities.map((item, idx) => <li key={idx}><LatexText text={item} /></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h4 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3 pb-1">II. Thiết bị dạy học và học liệu</h4>
        <ul className="list-disc pl-9 text-slate-700">
          {plan.equipment.map((item, idx) => <li key={idx}><LatexText text={item} /></li>)}
        </ul>
      </section>

      <section>
        <h4 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-4 pb-1">III. Tiến trình dạy học</h4>
        <div className="space-y-6">
          {plan.procedures.map((proc, index) => (
            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden break-inside-avoid">
               <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
                  <span>Hoạt động {index + 1}: {proc.stage} - <LatexText text={proc.activityName} /></span>
               </div>
               <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <strong className="block text-sm text-slate-500 uppercase mb-1">Hoạt động của GV & HS</strong>
                    <div className="space-y-3">
                       <p className="text-sm text-slate-700"><span className="font-semibold">GV:</span> <LatexText text={proc.teacherActivity} /></p>
                       <p className="text-sm text-slate-700"><span className="font-semibold">HS:</span> <LatexText text={proc.studentActivity} /></p>
                    </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                       <strong className="block text-sm text-slate-500 uppercase mb-1">Sản phẩm</strong>
                       <p className="text-sm text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100"><LatexText text={proc.product} /></p>
                     </div>
                     <div className="bg-blue-50 p-3 rounded border border-blue-100">
                        <strong className="block text-xs font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> Ứng dụng Năng lực số
                        </strong>
                        <p className="text-sm text-blue-900"><LatexText text={proc.digitalApplication} /></p>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h4 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3 pb-1">IV. Rút kinh nghiệm</h4>
        <p className="text-slate-700 italic pl-4"><LatexText text={plan.reflection} /></p>
      </section>

      {plan.interactiveSection && (
        <section className="border-t-2 border-slate-100 pt-6 break-inside-avoid class-interactive-section">
          <h4 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-4 pb-1">V. Nội dung bài học tương tác & Bài tập rèn luyện phân hóa</h4>
          
          <div className="space-y-6">
            {/* Tóm tắt */}
            <div className="bg-primary-50/50 p-4 rounded-lg border border-primary-100">
              <strong className="block text-slate-800 text-sm font-bold uppercase mb-1">1. Tóm tắt nội dung chính</strong>
              <p className="text-slate-700 pl-2 leading-relaxed"><LatexText text={plan.interactiveSection.summary} /></p>
            </div>
            
            {/* Tình huống và bài (Hook) */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <strong className="block text-amber-900 text-sm font-bold uppercase mb-1">2. Tình huống dẫn nhập / Khởi động (Hook gợi sự tò mò)</strong>
              <p className="text-amber-800 pl-2 italic"><LatexText text={plan.interactiveSection.hook} /></p>
            </div>

            {/* Định nghĩa, định lý, công thức trọng tâm */}
            <div>
              <strong className="block text-slate-800 text-sm font-bold uppercase mb-2">3. Nội dung cốt lõi (Kiến thức trọng tâm, Định lý & Công thức)</strong>
              <ul className="list-disc pl-9 space-y-2 text-slate-700">
                {plan.interactiveSection.keyDefinitions.map((def, idx) => (
                  <li key={idx}><LatexText text={def} /></li>
                ))}
              </ul>
            </div>

            {/* Câu hỏi ôn tập nhanh */}
            {plan.interactiveSection.quickQuestions && plan.interactiveSection.quickQuestions.length > 0 && (
              <div>
                <strong className="block text-slate-800 text-sm font-bold uppercase mb-3">4. Câu hỏi tương tác nhanh kiểm tra độ hiểu lý thuyết</strong>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.interactiveSection.quickQuestions.map((q, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-sm text-slate-800 flex items-start gap-1">
                        <span className="text-primary-600 font-bold">Q{idx + 1}:</span> 
                        <LatexText text={q.question} />
                      </p>
                      <p className="text-sm text-slate-600 mt-2 pl-4 border-l-2 border-primary-500 italic bg-white p-2 rounded">
                        <span className="font-bold text-slate-700">Đáp án gợi ý: </span>
                        <LatexText text={q.suggestedAnswer} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bài tập rèn luyện phân hóa từ Kết nối tri thức */}
            {plan.interactiveSection.gradedExercises && plan.interactiveSection.gradedExercises.length > 0 && (
              <div>
                <strong className="block text-slate-800 text-sm font-bold uppercase mb-3 text-emerald-800">5. Hệ thống bài tập rèn luyện (Có tính phân hóa cao, đáp án & lời giải chi tiết)</strong>
                <div className="space-y-4">
                  {plan.interactiveSection.gradedExercises.map((ex, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-emerald-200 transition shadow-sm break-inside-avoid">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          Bài tập rèn luyện {idx + 1}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                          ${ex.level.includes("Vận dụng") ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            ex.level.includes("Thông hiểu") ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'}
                        `}>
                          {ex.level}
                        </span>
                      </div>
                      <div className="text-slate-800 text-sm mb-3 font-semibold bg-slate-50/50 p-2 rounded border border-slate-150">
                        <LatexText text={ex.question} />
                      </div>
                      <div className="space-y-2 mt-2 bg-emerald-50/30 p-3 rounded border border-emerald-100/50">
                        <p className="text-sm text-slate-700"><span className="font-bold text-emerald-800">Đáp án / Kết quả:</span> <LatexText text={ex.answer} /></p>
                        <div className="text-xs text-slate-600 mt-1.5 pl-3 border-l-2 border-emerald-400">
                          <strong className="text-slate-700 block mb-1">Hướng dẫn giải chi tiết từng bước:</strong>
                          <p className="leading-relaxed whitespace-pre-wrap"><LatexText text={ex.explanation} /></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

const IntegrationView: React.FC<{ result: IntegrationResult }> = ({ result }) => {
  return (
    <div className="p-6 space-y-8 print-content">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
         <h2 className="text-lg font-bold text-blue-900 mb-1">Tổng quan tích hợp</h2>
         <p className="text-blue-800"><LatexText text={result.overview} /></p>
      </div>

      <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-primary-100 p-1 rounded">📚</span> Các hoạt động đề xuất
          </h3>
          
          <div className="space-y-6">
            {result.activities.map((act, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition bg-slate-50/50 break-inside-avoid">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                      {getDomainIcon(act.nlsDomain)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900"><LatexText text={act.activityName} /></h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {act.nlsDomain}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {act.nlsComponent}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-slate-700 mb-4 bg-white p-4 rounded border border-slate-100">
                  <p className="whitespace-pre-wrap"><LatexText text={act.description} /></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Công cụ / Phần mềm</span>
                    <div className="flex flex-wrap gap-2">
                      {act.tools.map((tool, i) => (
                        <span key={i} className="text-sm bg-white px-2 py-1 rounded shadow-sm border border-indigo-100 text-indigo-700">
                          <LatexText text={tool} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Đánh giá</span>
                    <p className="text-sm text-emerald-800"><LatexText text={act.assessment} /></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
          <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
            💡 Khuyến nghị sư phạm
          </h3>
          <p className="text-amber-800 whitespace-pre-wrap"><LatexText text={result.recommendations} /></p>
        </div>
    </div>
  )
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = () => {
    if (!contentRef.current) return;

    // Minimal HTML for Word
    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const postHtml = "</body></html>";
    
    // Get content from the view, but we need to handle the math text for Word specifically if possible, 
    // or just rely on the text content. Word handles UTF-8 reasonably well.
    // NOTE: This simple export won't render LaTeX perfectly in Word, but it captures the text content.
    // For perfect LaTeX in Word, complex server-side processing is usually required.
    // We will export the innerHTML which contains the rendered KaTeX spans (HTML math).
    const html = preHtml + contentRef.current.innerHTML + postHtml;

    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    // Create download link
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, 'ke-hoach-bai-day.doc');
    } else {
        downloadLink.href = url;
        downloadLink.download = 'ke-hoach-bai-day.doc';
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
      <div ref={contentRef}>
        {result.type === 'full' ? (
          <FullPlanView plan={result} />
        ) : (
          <IntegrationView result={result} />
        )}
      </div>

      <div className="flex justify-end gap-3 p-6 pt-0 border-t border-slate-100 bg-slate-50/50 mt-6 pt-6 no-print">
            <button 
              onClick={handleExportDocx}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
                <FileType className="w-4 h-4" /> Xuất Word (.doc)
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
            >
                <Printer className="w-4 h-4" /> Xuất PDF
            </button>
      </div>
    </div>
  );
};

export default ResultDisplay;