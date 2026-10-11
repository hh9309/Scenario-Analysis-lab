import React, { useState } from 'react';
import { AxisDefinition, DriverFactor } from '../types/scenario';
import {
  Workflow,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  Grid,
  Network,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react';

interface WorkflowWizardProps {
  axisX: AxisDefinition;
  axisY: AxisDefinition;
  drivers: DriverFactor[];
  onNavigateToModule: (moduleId: number) => void;
}

export const WorkflowWizardModule: React.FC<WorkflowWizardProps> = ({
  axisX,
  axisY,
  drivers,
  onNavigateToModule,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: '宏观扫描与驱动筛选',
      desc: '运用 PESTEL 六维框架全面扫描地平线，通过“影响 vs 不确定性”坐标筛选高张力核心因子。',
      targetModule: 2,
      checkCriteria: `已录入 ${drivers.length} 个驱动因子，已识别出高影响+高不确定性的核心候选。`,
      isDone: drivers.length >= 8,
    },
    {
      step: 2,
      title: '两轴正交对立与情景图景构建',
      desc: '提炼出供给侧与环境约束侧两根正交独立轴，构建 2x2 极端世界观相空间并赋予详细叙事。',
      targetModule: 3,
      checkCriteria: `当前绑定：横轴「${axisX.name}」与 纵轴「${axisY.name}」，已生成 4 个象限。`,
      isDone: Boolean(axisX.name && axisY.name),
    },
    {
      step: 3,
      title: 'CIB 交叉影响自洽检验与矛盾剔除',
      desc: '输入系统变量间相互促进/阻尼的代数矩阵，利用一致性算法筛除不可持续的逻辑乌托邦假象。',
      targetModule: 4,
      checkCriteria: '通过纳什均衡算法消除变量相互矛盾，锁定自洽吸引子稳态集合。',
      isDone: true,
    },
    {
      step: 4,
      title: '战略鲁棒性压力测试与白皮书总成',
      desc: '将组织的核心投资战略分别置于异构情景中进行生存压力测试，生成对冲策略与决策白皮书。',
      targetModule: 9,
      checkCriteria: '评估战略在所有象限的跨周期反脆弱性，准备导出一键式战略情景白皮书。',
      isDone: true,
    },
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Workflow className="w-3.5 h-3.5" />
            <span>模块 08 · 全流程向导 (End-to-End Workflow)</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">从宏观扫描到战略鲁棒白皮书的标准工法四步走</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            严格遵循国际前瞻协会(APF)与壳牌企业规划的标准全流程：驱动识别 $\rightarrow$ 矩阵对立 $\rightarrow$ CIB 检验 $\rightarrow$ 战略鲁棒评估。
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-stone-600">
          <span>进度：第 {currentStep} / 4 阶段</span>
        </div>
      </div>

      {/* 4 Steps Timeline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {steps.map((st) => {
          const isActive = currentStep === st.step;
          const isPassed = currentStep > st.step;

          return (
            <div
              key={st.step}
              onClick={() => setCurrentStep(st.step)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                  : isPassed
                  ? 'bg-stone-50 border-stone-300'
                  : 'bg-white/60 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isActive ? 'bg-emerald-600 text-white' : isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}>
                  阶段 0{st.step}
                </span>
                {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <h4 className="text-xs font-bold text-stone-900">{st.title}</h4>
            </div>
          );
        })}
      </div>

      {/* Step Detailed Action Workspace Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-xs font-bold text-emerald-700 uppercase">
            当前处于阶段 0{currentStepData.step} 专项推进
          </span>
          <h3 className="text-lg font-bold text-stone-900 mt-1">{currentStepData.title}</h3>
          <p className="text-xs text-stone-600 mt-1 max-w-3xl">{currentStepData.desc}</p>
        </div>

        {/* Status Verification Slice */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
          <span className="font-bold text-stone-900 block flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>工法准入标准与当前就绪状态：</span>
          </span>
          <p className="text-stone-700">{currentStepData.checkCriteria}</p>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一步骤</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateToModule(currentStepData.targetModule)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors"
            >
              <span>跳转到模块 0{currentStepData.targetModule} 实操</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-colors"
              >
                <span>下一步骤</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigateToModule(9)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>生成并导出战略白皮书</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
