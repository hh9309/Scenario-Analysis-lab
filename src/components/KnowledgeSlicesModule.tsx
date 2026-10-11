import React, { useState } from 'react';
import { KNOWLEDGE_SLICES } from '../data/knowledgeSlices';
import { KnowledgeSlice } from '../types/scenario';
import {
  BookOpen,
  Layers,
  HelpCircle,
  AlertTriangle,
  Compass,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';

export const KnowledgeSlicesModule: React.FC = () => {
  const [activeSliceId, setActiveSliceId] = useState<string>('slice-1');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  const currentSlice = KNOWLEDGE_SLICES.find((s) => s.id === activeSliceId) || KNOWLEDGE_SLICES[0];

  // Interactive Readiness Checklist / Quiz
  const questions = [
    {
      id: 1,
      q: '你的 2x2 矩阵中，两根轴是否存在直接的因果依赖关系（如“GDP繁荣”与“人均收入”）？',
      options: ['是，两轴强相关', '否，两轴正交独立（如技术供给 vs 政策监管）'],
      correct: '否，两轴正交独立（如技术供给 vs 政策监管）',
      explanation: '两轴如果存在因果传递，4个象限就会塌缩为一条对角线，失去情景张力。',
    },
    {
      id: 2,
      q: '在情景分析完成后，管理层是否在讨论“我们要重仓押注哪一个象限”？',
      options: ['是，正在挑选最可能的象限', '否，正在寻找跨越所有象限均能生存的鲁棒性战略'],
      correct: '否，正在寻找跨越所有象限均能生存的鲁棒性战略',
      explanation: '情景规划的本质是鲁棒性对冲，试图押注单一未来是退化为低级伪预测的致命陷阱。',
    },
    {
      id: 3,
      q: '是否为每个象限配备了领先 6~18 个月的客观“早期预警信号 (EWS)”？',
      options: ['已配备可观测客观指标', '尚未配备，仅停留在定性故事描述'],
      correct: '已配备可观测客观指标',
      explanation: '没有早期预警指标的情景规划，无法指导实际战略航向纠偏。',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <BookOpen className="w-3.5 h-3.5" />
            <span>模块 10 · 情景分析机制与未来学知识导引（四大核心切片）</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">未来学底层认识论、空间降维几何学与避坑指南</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            深度解构“预测 vs 情景规划”的哲学分水岭、复杂系统空间表示法则、三大致命演化陷阱及高管心理误区警示。
          </p>
        </div>
      </div>

      {/* 4 Core Slice Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {KNOWLEDGE_SLICES.map((slice, idx) => {
          const isActive = activeSliceId === slice.id;

          return (
            <div
              key={slice.id}
              onClick={() => setActiveSliceId(slice.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                  : 'bg-white/70 border-stone-200 hover:border-stone-300 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1.5">
                  切片 0{idx + 1} · {slice.tag}
                </span>
                <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-tight">
                  {slice.title.split('：')[1] || slice.title}
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 line-clamp-1">{slice.subTitle}</p>
            </div>
          );
        })}
      </div>

      {/* Slice Deep-Dive Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {currentSlice.tag} · 核心论点切片
          </span>
          <h3 className="text-lg font-bold text-stone-900 mt-1">{currentSlice.title}</h3>
          <p className="text-xs text-stone-500 mt-0.5">{currentSlice.subTitle}</p>

          <div className="mt-3 p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs leading-relaxed text-stone-800 font-medium">
            {currentSlice.coreThesis}
          </div>
        </div>

        {/* Comparison Table if present */}
        {currentSlice.comparisonTable && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              【多维结构对比切片】
            </h4>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-bold w-40">对比评估维度</th>
                    <th className="p-3 font-bold">传统单轨范式 (Forecasting)</th>
                    <th className="p-3 font-bold">情景规划战略范式 (Scenario Planning)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {currentSlice.comparisonTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900 bg-stone-50/50">{row.dimension}</td>
                      <td className="p-3 text-stone-600 leading-relaxed">{row.itemA}</td>
                      <td className="p-3 text-emerald-900 font-medium bg-emerald-50/20 leading-relaxed">{row.itemB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Traps and Antidotes if present */}
        {currentSlice.trapsAndAntidotes && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>【致命陷阱识别与解毒剂 (Traps & Antidotes)】</span>
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {currentSlice.trapsAndAntidotes.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950 text-sm">{t.trap}</span>
                    <span className="text-[10px] text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded font-medium">典型高频病灶</span>
                  </div>
                  <p className="text-stone-700">
                    <strong className="text-stone-900">典型表现与症状：</strong>{t.symptom}
                  </p>
                  <p className="text-emerald-900 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/80">
                    <strong className="text-emerald-950">专家解毒剂 (Antidote)：</strong>{t.antidote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Axioms Slices */}
        <div className="p-4 rounded-xl bg-stone-900 text-stone-100 space-y-2 text-xs">
          <span className="font-bold text-emerald-400 uppercase tracking-wider block">
            未来学思维修炼格言 (Foresight Axioms)：
          </span>
          {currentSlice.axioms.map((ax, idx) => (
            <p key={idx} className="text-stone-300 italic leading-relaxed">
              {ax}
            </p>
          ))}
        </div>
      </div>

      {/* Interactive Self-Audit / Readiness Test */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900">战略情景规划“正交与自洽”自查清单 (3道核心检视题)</h3>
          </div>
          <button
            onClick={() => setShowQuizResult(!showQuizResult)}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            {showQuizResult ? '收起自查解析' : '提交并检验得分'}
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {questions.map((q) => (
            <div key={q.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
              <span className="font-bold text-stone-900 block">
                {q.id}. {q.q}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = quizAnswers[q.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt })}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 font-semibold text-emerald-950'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showQuizResult && (
                <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-[11px]">
                  <strong>标准专业做法：</strong>{q.correct}
                  <p className="text-stone-600 mt-0.5">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
