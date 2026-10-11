import React from 'react';
import {
  History,
  Radar,
  Grid,
  Network,
  Briefcase,
  Terminal,
  BotMessageSquare,
  Workflow,
  Download,
  BookOpen,
} from 'lucide-react';

interface ModuleTabsProps {
  activeModule: number;
  setActiveModule: (id: number) => void;
}

export const MODULE_LIST = [
  { id: 1, name: '1. 思想与脉络', en: 'Origins & Schools', icon: History },
  { id: 2, name: '2. 驱动力扫描', en: 'PESTEL Scanner', icon: Radar },
  { id: 3, name: '3. 2x2矩阵演播', en: '2x2 Matrix Lab', icon: Grid },
  { id: 4, name: '4. 交叉影响分析', en: 'CIB Consistency', icon: Network },
  { id: 5, name: '5. 六大案例', en: '6 Benchmark Cases', icon: Briefcase },
  { id: 6, name: '6. 代码引擎', en: 'Python/NetworkX', icon: Terminal },
  { id: 7, name: '7. AI对话窗口', en: 'AI Consultant', icon: BotMessageSquare },
  { id: 8, name: '8. 全流程导引', en: 'End-to-End Workflow', icon: Workflow },
  { id: 9, name: '9. 报告导出', en: 'Export Whitepaper', icon: Download },
  { id: 10, name: '10. 知识导引', en: 'Theory Slices', icon: BookOpen },
];

export const ModuleTabs: React.FC<ModuleTabsProps> = ({ activeModule, setActiveModule }) => {
  return (
    <div className="bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto no-scrollbar py-2 space-x-1 sm:space-x-1.5">
          {MODULE_LIST.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-white text-stone-900 border-stone-300 shadow-xs ring-1 ring-stone-950/5 font-semibold'
                    : 'text-stone-600 bg-transparent border-transparent hover:bg-stone-200/60 hover:text-stone-900'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-emerald-600' : 'text-stone-400'
                  }`}
                />
                <span>{mod.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
