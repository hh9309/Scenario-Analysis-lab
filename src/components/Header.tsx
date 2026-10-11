import React from 'react';
import { Compass, Sparkles, FileText, Share2, Layers } from 'lucide-react';

interface HeaderProps {
  activeModule: number;
  setActiveModule: (id: number) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  setActiveModule,
  isAiDrawerOpen,
  setIsAiDrawerOpen,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-stone-900 text-base tracking-tight">情景分析法与多维未来演化实验室</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Foresight Lab v2.5
              </span>
            </div>
            <p className="text-xs text-stone-500 font-normal">Scenario Planning & Multi-dimensional Future Evolution Engine</p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveModule(8)}
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>全流程导引</span>
          </button>

          <button
            onClick={() => setActiveModule(9)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>导出白皮书</span>
          </button>

          <button
            onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isAiDrawerOpen
                ? 'bg-stone-900 text-stone-100 shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI 随诊与诊断</span>
          </button>
        </div>
      </div>
    </header>
  );
};
