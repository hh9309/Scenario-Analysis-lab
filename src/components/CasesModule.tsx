import React, { useState } from 'react';
import { SIX_BENCHMARK_CASES } from '../data/sixCases';
import { BenchmarkCase, AxisDefinition } from '../types/scenario';
import {
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle,
  FileCheck,
  TrendingUp,
  Cpu,
  ShieldAlert,
} from 'lucide-react';

interface CasesModuleProps {
  onLoadCaseToWorkbench: (benchmark: BenchmarkCase) => void;
}

export const CasesModule: React.FC<CasesModuleProps> = ({ onLoadCaseToWorkbench }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-shell');

  const currentCase = SIX_BENCHMARK_CASES.find((c) => c.id === selectedCaseId) || SIX_BENCHMARK_CASES[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Briefcase className="w-3.5 h-3.5" />
            <span>模块 05 · 六大情景分析实战案例库</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">行业顶级智库与跨国先锋标杆实战推演</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            严密映射现代情景分析法的六大核心方法流派：壳牌2x2经典轴、自动驾驶形态学、全球供应链CIB、电力规划TIA趋势冲击、消费叙事直觉逻辑及颠覆技术鲁棒压力测试。
          </p>
        </div>

        <button
          onClick={() => onLoadCaseToWorkbench(currentCase)}
          className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all self-start md:self-auto"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>一键载入该案例至推演实验室</span>
        </button>
      </div>

      {/* Case Selector Slices */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SIX_BENCHMARK_CASES.map((c) => {
          const isSelected = selectedCaseId === c.id;

          return (
            <div
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                  : 'bg-white/70 border-stone-200 hover:border-stone-300 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-400 block mb-1">
                  {c.numberTag}
                </span>
                <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-tight">{c.title}</h4>
              </div>
              <div className="mt-2.5">
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium block truncate">
                  {c.methodTag.split('(')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Case Deep-Dive Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {currentCase.numberTag}
              </span>
              <span className="text-stone-400">•</span>
              <span className="font-semibold text-stone-700">{currentCase.organization}</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-500 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium">{currentCase.methodTag}</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mt-2">{currentCase.title}</h3>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl">{currentCase.summary}</p>
          </div>

          <button
            onClick={() => onLoadCaseToWorkbench(currentCase)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors self-start md:self-auto"
          >
            <span>加载参数到沙盘</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

        {/* Case Specific Representations */}
        {/* If Case 1 or Case 5: 2x2 Matrix */}
        {currentCase.quadrants && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              【推演产物：2x2 正交四象限全景世界观】
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCase.quadrants.map((q) => (
                <div key={q.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{q.title}</span>
                    <span className="font-mono text-[10px] text-stone-400">{q.subTitle}</span>
                  </div>
                  <p className="text-stone-600 italic text-[11px]">{q.tagline}</p>
                  <p className="text-stone-700 leading-relaxed">{q.worldNarrative}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/60 text-[11px]">
                    <div>
                      <span className="font-semibold text-emerald-800 block">典型赢家：</span>
                      <span className="text-emerald-700">{q.winners.join('、')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-rose-800 block">承压淘汰：</span>
                      <span className="text-rose-700">{q.losers.join('、')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If Case 2: Morphology Box */}
        {currentCase.morphologyTable && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              【推演产物：5维形态学分析箱 (Morphological Box)】
            </h4>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-bold w-44">分析维度 (Dimension)</th>
                    <th className="p-3 font-bold">离散技术/机制路线选项 (Options 1 ~ 4)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {currentCase.morphologyTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900 bg-stone-50/60">{row.dimension}</td>
                      <td className="p-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {row.options.map((opt, oIdx) => {
                            const isChosen = row.selectedRoute === oIdx;
                            return (
                              <div
                                key={oIdx}
                                className={`p-2 rounded-lg border text-[11px] ${
                                  isChosen
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                                    : 'bg-white border-stone-200 text-stone-600'
                                }`}
                              >
                                {opt}
                                {isChosen && <span className="text-[9px] text-emerald-600 block mt-0.5">✔ 选定示范路径</span>}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* If Case 4: TIA Events */}
        {currentCase.tiaEvents && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              【推演产物：趋势影响分析 (TIA) 突发事件冲击清单】
            </h4>
            <div className="space-y-2 text-xs">
              {currentCase.tiaEvents.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                        预期年份: {ev.year}
                      </span>
                      <span className="font-bold text-stone-900">{ev.event}</span>
                    </div>
                    <p className="text-stone-600 text-[11px]">冲击偏移量：{ev.impactDelta}</p>
                  </div>
                  <div className="text-right pl-4">
                    <span className="text-stone-400 text-[10px] block">专家共识概率</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{(ev.probability * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If Case 6: Robustness Testing */}
        {currentCase.robustnessStrategy && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              【推演产物：跨情景战略鲁棒性压力测试评分表 (1-10分)】
            </h4>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-bold">候选战略选项</th>
                    <th className="p-3 font-bold text-center">情景I 得分</th>
                    <th className="p-3 font-bold text-center">情景II 得分</th>
                    <th className="p-3 font-bold text-center">情景III 得分</th>
                    <th className="p-3 font-bold text-center">情景IV 得分</th>
                    <th className="p-3 font-bold text-center">综合均分</th>
                    <th className="p-3 font-bold">战略对冲建议</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {currentCase.robustnessStrategy.map((strat, idx) => {
                    const avg = (strat.scoresInScenarios.reduce((a, b) => a + b, 0) / 4).toFixed(1);
                    const isBest = parseFloat(avg) >= 7.5;

                    return (
                      <tr key={idx} className={isBest ? 'bg-emerald-50/40' : 'hover:bg-stone-50'}>
                        <td className="p-3 font-bold text-stone-900">
                          {strat.strategyName}
                          <span className="text-[10px] text-stone-400 block font-normal">对冲成本: {strat.hedgingCost}</span>
                        </td>
                        {strat.scoresInScenarios.map((sc, sIdx) => (
                          <td key={sIdx} className="p-3 text-center font-mono font-bold text-stone-700">
                            {sc}
                          </td>
                        ))}
                        <td className="p-3 text-center font-mono font-bold text-emerald-800 text-sm">
                          {avg}
                        </td>
                        <td className="p-3 text-stone-600 text-[11px]">
                          {strat.recommendedAction}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Case Takeaways */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
          <span className="font-bold text-stone-900 block">专家决策启示 (Key Takeaways)：</span>
          <ul className="space-y-1 text-stone-700">
            {currentCase.takeaways.map((t, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">💡</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
