/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ModuleTabs } from './components/ModuleTabs';
import { HistoryModule } from './components/HistoryModule';
import { PestelScannerModule } from './components/PestelScannerModule';
import { Matrix2x2Module } from './components/Matrix2x2Module';
import { CibModule } from './components/CibModule';
import { CasesModule } from './components/CasesModule';
import { PythonEngineModule } from './components/PythonEngineModule';
import { WorkflowWizardModule } from './components/WorkflowWizardModule';
import { ReportExportModule } from './components/ReportExportModule';
import { KnowledgeSlicesModule } from './components/KnowledgeSlicesModule';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { SupportedModel, ModelSettingsModal } from './components/ModelSettingsModal';
import { Settings } from 'lucide-react';

import { INITIAL_PESTEL_DRIVERS } from './data/pestelDrivers';
import { AxisDefinition, DriverFactor, BenchmarkCase } from './types/scenario';

export default function App() {
  const [activeModule, setActiveModule] = useState<number>(3); // Default to Module 3 (2x2 Matrix)
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<SupportedModel>('gemini 3 flash');
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState<boolean>(false);

  // Global Scenario State
  const [drivers, setDrivers] = useState<DriverFactor[]>(INITIAL_PESTEL_DRIVERS);

  // Default axes based on Shell 2x2 Case
  const [axisX, setAxisX] = useState<AxisDefinition>({
    id: 'shell-x',
    name: '全球气候政策与碳定价强制力度',
    negativeLabel: '碳价虚化 / 补贴撤退 (低监管阻力)',
    positiveLabel: '全球统一高额碳税 / 严格配额 (强政策驱动)',
    negativeDescription: '化石能源平价优势仍在，各经济体推迟净零承诺，绿色溢价居高不下。',
    positiveDescription: '全球每吨碳定价突破 150 美元，高碳资产承受巨额惩罚，资本逃离化石。',
    category: 'En',
  });

  const [axisY, setAxisY] = useState<AxisDefinition>({
    id: 'shell-y',
    name: '地缘政治与国际贸易格局',
    negativeLabel: '地缘割裂 / 阵营脱钩 (去全球化)',
    positiveLabel: '多边协同 / 开放互信 (全球化常态)',
    negativeDescription: '关键矿产与能源管线武器化，重商主义盛行，区域自保与以邻为壑。',
    positiveDescription: '跨国绿色技术扩散无壁垒，碳核算互认，多边气候基金运转高效。',
    category: 'P',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Callback to load benchmark case into workbench
  const handleLoadCaseToWorkbench = (benchmark: BenchmarkCase) => {
    if (benchmark.axisX && benchmark.axisY) {
      setAxisX(benchmark.axisX);
      setAxisY(benchmark.axisY);
      setActiveModule(3); // Jump to 2x2 Matrix Lab
      showToast(`已成功将「${benchmark.title}」的轴向配置载入 2x2 演播室！`);
    } else if (benchmark.id === 'case-cib-supply') {
      setActiveModule(4); // Jump to CIB module
      showToast(`已成功将「${benchmark.title}」载入 CIB 交叉影响分析模块！`);
    } else {
      setActiveModule(3);
      showToast(`已成功载入「${benchmark.title}」实战数据！`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation Bar */}
      <Header
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isAiDrawerOpen={isAiDrawerOpen}
        setIsAiDrawerOpen={setIsAiDrawerOpen}
      />

      {/* Module Navigation Tabs (10 Core Modules) */}
      <ModuleTabs activeModule={activeModule} setActiveModule={setActiveModule} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-stone-800 flex items-center space-x-2 animate-bounce">
          <span className="text-emerald-400 font-bold">✔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Module 1: 思想溯源与流派演化 */}
        {activeModule === 1 && <HistoryModule />}

        {/* Module 2: PESTEL 驱动力扫描与不确定性筛选 */}
        {activeModule === 2 && (
          <PestelScannerModule
            drivers={drivers}
            setDrivers={setDrivers}
            axisX={axisX}
            setAxisX={setAxisX}
            axisY={axisY}
            setAxisY={setAxisY}
            onNavigateToMatrix={() => setActiveModule(3)}
          />
        )}

        {/* Module 3: 经典 2x2 矩阵与情景变体演播 */}
        {activeModule === 3 && (
          <Matrix2x2Module
            axisX={axisX}
            setAxisX={setAxisX}
            axisY={axisY}
            setAxisY={setAxisY}
            drivers={drivers}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
          />
        )}

        {/* Module 4: 交叉影响分析 (CIB) 与自洽性检验 */}
        {activeModule === 4 && <CibModule />}

        {/* Module 5: 六大案例实战库 */}
        {activeModule === 5 && (
          <CasesModule onLoadCaseToWorkbench={handleLoadCaseToWorkbench} />
        )}

        {/* Module 6: Python / NetworkX 演化网络代码引擎 */}
        {activeModule === 6 && <PythonEngineModule />}

        {/* Module 7: AI 对话随诊 (Also directly available as main view if clicked) */}
        {activeModule === 7 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase">
                    模块 07 · AI 诊断与大模型 Q&A 随诊
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    当前生效模型: {selectedModel}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 mt-1">战略前瞻 AI 智能随诊专区</h2>
                <p className="text-xs text-stone-500 mt-1">
                  右侧已为您展开实时随诊抽屉。点击标题最右侧小齿轮图标可切换 gemini 3 flash / deepseek-v4-pro 大模型并查看 GitHub 部署密钥规范。
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                {/* 小齿轮设置大模型图标 */}
                <button
                  onClick={() => setIsModelSettingsOpen(true)}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 shadow-2xs transition-colors"
                  title="设置大模型与 API 配置 (小齿轮设置)"
                >
                  <Settings className="w-4 h-4 text-stone-700" />
                </button>
                <button
                  onClick={() => setIsAiDrawerOpen(true)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-sm"
                >
                  唤醒对话窗口
                </button>
              </div>
            </div>
            {/* Embedded view */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm text-xs text-stone-600 space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">💡 AI 随诊核心功能：</h3>
              <ul className="list-disc list-inside space-y-1.5 text-stone-700">
                <li><strong>正交性检验 (Orthogonality)</strong>：严防 X 轴与 Y 轴强相关导致的四象限塌缩；</li>
                <li><strong>自洽性审计 (Internal Consistency)</strong>：排查各象限因果链中的内生冲突；</li>
                <li><strong>黑天鹅预警 (Wild Card Blindspots)</strong>：扫描被既有变量遗漏的非线性突发变数；</li>
                <li><strong>先行预警信号 (EWS) 推荐</strong>：为每个情景提供可量化追踪的客观领先指标。</li>
              </ul>
            </div>
          </div>
        )}

        {/* Module 8: 全流程向导 */}
        {activeModule === 8 && (
          <WorkflowWizardModule
            axisX={axisX}
            axisY={axisY}
            drivers={drivers}
            onNavigateToModule={setActiveModule}
          />
        )}

        {/* Module 9: 报告导出引擎 */}
        {activeModule === 9 && (
          <ReportExportModule
            axisX={axisX}
            axisY={axisY}
            drivers={drivers}
          />
        )}

        {/* Module 10: 知识导引四大切片 */}
        {activeModule === 10 && <KnowledgeSlicesModule />}
      </main>

      {/* Floating AI Consultant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        axisX={axisX}
        axisY={axisY}
        drivers={drivers}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Model Settings Modal */}
      <ModelSettingsModal
        isOpen={isModelSettingsOpen}
        onClose={() => setIsModelSettingsOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onConfirmModel={(model, gemKey, dsKey) => {
          const keyStatus = model === 'gemini 3 flash' ? (gemKey ? '已绑定 API-Key' : '未提供密钥') : (dsKey ? '已绑定 API-Key' : '未提供密钥');
          showToast(`已确认大模型生效：${model} [${keyStatus}]`);
        }}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <span>情景分析法与多维未来演化实验室 (Scenario Analysis & Future Evolution Lab)</span>
          <div className="flex items-center space-x-4">
            <span>PESTEL 扫描</span>
            <span>•</span>
            <span>2x2 极端正交矩阵</span>
            <span>•</span>
            <span>CIB 交叉影响平衡</span>
            <span>•</span>
            <span>NetworkX 图论拓扑</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
