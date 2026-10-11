import React, { useState, useMemo } from 'react';
import { CibVariable, CibImpact } from '../types/scenario';
import { runCibAlgorithm } from '../utils/cibAlgorithm';
import { INITIAL_CIB_VARIABLES, INITIAL_CIB_IMPACTS } from '../data/initialCibData';
import {
  Network,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const CibModule: React.FC = () => {
  const [variables, setVariables] = useState<CibVariable[]>(INITIAL_CIB_VARIABLES);
  const [impacts, setImpacts] = useState<CibImpact[]>(INITIAL_CIB_IMPACTS);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');

  // Run CIB calculation
  const cibResult = useMemo(() => {
    return runCibAlgorithm(variables, impacts);
  }, [variables, impacts]);

  // Update weight of an impact
  const handleWeightChange = (
    srcId: string,
    srcState: string,
    tgtId: string,
    tgtState: string,
    weight: number
  ) => {
    setImpacts((prev) => {
      const existingIdx = prev.findIndex(
        (imp) =>
          imp.sourceVarId === srcId &&
          imp.sourceStateId === srcState &&
          imp.targetVarId === tgtId &&
          imp.targetStateId === tgtState
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], weight };
        return copy;
      } else {
        return [
          ...prev,
          {
            sourceVarId: srcId,
            sourceStateId: srcState,
            targetVarId: tgtId,
            targetStateId: tgtState,
            weight,
          },
        ];
      }
    });
  };

  const getWeight = (srcId: string, srcState: string, tgtId: string, tgtState: string) => {
    const match = impacts.find(
      (imp) =>
        imp.sourceVarId === srcId &&
        imp.sourceStateId === srcState &&
        imp.targetVarId === tgtId &&
        imp.targetStateId === tgtState
    );
    return match ? match.weight : 0;
  };

  const selectedConfig =
    cibResult.allConfigurations.find((c) => c.id === selectedConfigId) ||
    cibResult.consistentConfigurations[0] ||
    cibResult.allConfigurations[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Network className="w-3.5 h-3.5" />
            <span>模块 04 · 交叉影响分析 (CIB) 与自洽性检验</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">Cross-Impact Balances 纳什稳态与逻辑矛盾剔除</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            应用德国斯图加特大学 Wolfgang Weimer-Jehle 开创的 CIB 交叉影响平衡算法。动态推演系统变量间的相互强化与抑制矩阵，通过数学一致性准则，从组合爆炸空间中严格锁定<strong>内部自洽吸引子 (Self-Consistent Attractors)</strong>。
          </p>
        </div>

        {/* Statistical Badges */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-stone-400 block">全状态空间容量</span>
            <span className="text-sm font-bold text-stone-900">{cibResult.allConfigurations.length} 种可能</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-emerald-700 block font-semibold">自洽稳态情景</span>
            <span className="text-sm font-bold text-emerald-800">{cibResult.consistentConfigurations.length} 个吸引子</span>
          </div>
        </div>
      </div>

      {/* Slices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Matrix Editor */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-1.5">
              <span>变量状态交叉影响权重矩阵 (Cross-Impact Matrix: -3 ~ +3)</span>
            </h3>
            <span className="text-[11px] text-stone-400">正数=促进，负数=抑制阻尼</span>
          </div>

          <p className="text-xs text-stone-500">
            设置源变量处于状态 A 时，对目标变量处于状态 B 产生的直接因果赋分。系统将基于马尔可夫平衡算法实时校验每个全态组合的动力学收敛。
          </p>

          {/* Matrix Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <th className="p-2.5 font-bold">源驱动力 (Source State)</th>
                  <th className="p-2.5 font-bold">影响目标 (Target State)</th>
                  <th className="p-2.5 font-bold text-center w-36">相互作用权重 (-3 ~ +3)</th>
                  <th className="p-2.5 font-bold text-right">定性动力学解释</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {variables.flatMap((srcVar) =>
                  srcVar.states.flatMap((srcSt) =>
                    variables
                      .filter((tgtVar) => tgtVar.id !== srcVar.id)
                      .slice(0, 1) // sample connections for clean table
                      .map((tgtVar) => {
                        const tgtSt = tgtVar.states[0];
                        const w = getWeight(srcVar.id, srcSt.id, tgtVar.id, tgtSt.id);

                        return (
                          <tr key={`${srcVar.id}-${srcSt.id}-${tgtVar.id}-${tgtSt.id}`} className="hover:bg-stone-50">
                            <td className="p-2.5 font-medium text-stone-900">
                              <span className="text-[10px] text-stone-400 block">{srcVar.name}</span>
                              {srcSt.label}
                            </td>
                            <td className="p-2.5 text-stone-700">
                              <span className="text-[10px] text-stone-400 block">{tgtVar.name}</span>
                              {tgtSt.label}
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <span className={`font-mono font-bold w-6 text-center ${
                                  w > 0 ? 'text-emerald-600' : w < 0 ? 'text-rose-600' : 'text-stone-400'
                                }`}>
                                  {w > 0 ? `+${w}` : w}
                                </span>
                                <input
                                  type="range"
                                  min="-3"
                                  max="3"
                                  step="1"
                                  value={w}
                                  onChange={(e) =>
                                    handleWeightChange(
                                      srcVar.id,
                                      srcSt.id,
                                      tgtVar.id,
                                      tgtSt.id,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  className="w-20 accent-emerald-600 h-1 bg-stone-200 rounded-lg cursor-pointer"
                                />
                              </div>
                            </td>
                            <td className="p-2.5 text-right text-[11px] text-stone-500">
                              {w > 0 ? '产生强共振正促进' : w < 0 ? '形成结构性排斥阻尼' : '相互独立弱影响'}
                            </td>
                          </tr>
                        );
                      })
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-stone-400 italic">
            算法判定准则：情景向量 $S$ 是自洽的，当且仅当每一变量在其被指派的状态下的系统净支持得分，不小于其另一状态。
          </div>
        </div>

        {/* Right: State Space Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Consistency Overview Cards */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center justify-between">
              <span>全态空间检验流水线 ({cibResult.allConfigurations.length} 个配置)</span>
              <span className="text-xs text-stone-400">点击列表项查看细节</span>
            </h3>

            {/* List of Scenarios */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {cibResult.allConfigurations.map((cfg, idx) => {
                const isSelected = selectedConfig.id === cfg.id;

                return (
                  <div
                    key={cfg.id}
                    onClick={() => setSelectedConfigId(cfg.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {cfg.isConsistent ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                          <AlertOctagon className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-stone-800">
                          演化组合 #{idx + 1}
                        </span>
                        <div className="text-[11px] text-stone-400">
                          系统引力得分: {cfg.totalScore}
                        </div>
                      </div>
                    </div>

                    <div>
                      {cfg.isConsistent ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✔ 自洽稳态吸引子
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          ✘ 存在逻辑矛盾 ({cfg.unresolvedContradictions.length})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Config Detailed Inspector */}
            <div className="pt-3 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">选中配置变量解构：</span>
                <span className={`font-semibold ${selectedConfig.isConsistent ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {selectedConfig.isConsistent ? '【纳什稳定态】' : '【非稳态伪情景】'}
                </span>
              </div>

              {/* State assignments breakdown */}
              <div className="space-y-1.5 text-xs">
                {variables.map((v) => {
                  const stateId = selectedConfig.stateAssignments[v.id];
                  const stateObj = v.states.find((s) => s.id === stateId);

                  return (
                    <div key={v.id} className="p-2 rounded bg-stone-50 border border-stone-100 flex justify-between items-center">
                      <span className="text-stone-600">{v.name}:</span>
                      <span className="font-semibold text-stone-900">{stateObj?.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Contradiction Alert if contradictory */}
              {!selectedConfig.isConsistent && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <span className="font-bold block flex items-center space-x-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                    <span>CIB 算法发现内部动力学矛盾：</span>
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700">
                    {selectedConfig.unresolvedContradictions.map((contra, idx) => (
                      <li key={idx}>{contra}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-rose-600 pt-1">
                    解释：此类情景虽然能被人脑想象，但在真实系统动力学演化中会因为内在推力自发坍缩解体，不能作为长期基石。
                  </p>
                </div>
              )}

              {selectedConfig.isConsistent && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <span className="font-bold block flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>通过严格一致性自洽检验：</span>
                  </span>
                  <p className="text-[11px] text-emerald-700">
                    该情景中所有变量处于互相锁定的平衡纳什态，没有单方面发生突变离散的内生压力，属于高可信度的核心战略情景！
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
