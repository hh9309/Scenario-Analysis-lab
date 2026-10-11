import React, { useState } from 'react';
import { HISTORY_MILESTONES, SCENARIO_SCHOOLS } from '../data/historyMilestones';
import { Clock, ShieldCheck, Milestone, Compass, BookMarked, UserCheck, ChevronRight } from 'lucide-react';

export const HistoryModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'schools' | 'thinkers'>('timeline');
  const [selectedMilestone, setSelectedMilestone] = useState(HISTORY_MILESTONES[2]); // Default Shell

  const keyThinkers = [
    {
      name: '赫尔曼·卡恩 (Herman Kahn)',
      title: '兰德智库 / 哈德逊研究所创始人',
      quote: '“如果你拒绝去思考不可思议之事，当它真正降临时，你将被其完全吞噬。”',
      contribution: '把军事兵棋运筹学改造为民用与地缘政治战略推演，系统化定义了情景分析阶梯。',
      works: '《论热核战争》(1960)、《思考不可思议之事》(1962)',
    },
    {
      name: '皮埃尔·瓦克 (Pierre Wack)',
      title: '皇家荷兰壳牌集团战略规划总监',
      quote: '“情景规划绝非制造一幅精确的未来蓝图，而是重构管理层根深蒂固的心理地图 (Mental Models)。”',
      contribution: '开创商业直觉逻辑法，1973年壳牌成功穿越中东石油危机，奠定情景规划的商业神话。',
      works: '《情景：未经开拓的水域》(1985, HBR)',
    },
    {
      name: '米歇尔·戈德 (Michel Godet)',
      title: '法国远景科学院院士 / CNAM 讲座教授',
      quote: '“未来不是用来被动等待或猜测的，而是通过我们今天的结构化选择被主动建构的。”',
      contribution: '建立欧洲远景形态学派 (French Prospective)，开发 MICMAC 结构影响矩阵与形态学箱。',
      works: '《从预见到行动》(1993)、《战略远景手册》',
    },
    {
      name: '彼得·施瓦茨 (Peter Schwartz)',
      title: '全球商业网络 (GBN) 联合创始人',
      quote: '“真正的风险不是看不见黑天鹅，而是你的组织结构只能在单一预设晴天下运转。”',
      contribution: '将情景规划通俗化、故事化，总结 2x2 经典八步法，指导了新加坡全国推演与好莱坞电影构想。',
      works: '《原见：情景规划的艺术与科学》(The Art of the Long View, 1991)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Banner / Breadcrumb */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Compass className="w-3.5 h-3.5" />
            <span>模块 01 · 思想溯源与流派演化</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">从军事兵棋推演到现代深度不确定性决策</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            系统性梳理情景分析法自 19 世纪普鲁士参谋部兵棋、冷战兰德核威慑推演，至壳牌石油危机认知革命与现代 CIB 计算科学的百年演变脉络。
          </p>
        </div>

        {/* Slice Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            历史演进谱系 (6大节点)
          </button>
          <button
            onClick={() => setActiveTab('schools')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'schools'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            三大流派比较矩阵
          </button>
          <button
            onClick={() => setActiveTab('thinkers')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'thinkers'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            宗师思想录
          </button>
        </div>
      </div>

      {/* Tab 1: Timeline */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-stone-400 tracking-wider uppercase px-1">演进历史节点</div>
            {HISTORY_MILESTONES.map((m, idx) => {
              const isSelected = selectedMilestone.title === m.title;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedMilestone(m)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                      : 'bg-white/70 border-stone-200 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {m.era}
                    </span>
                    <span className="font-mono text-stone-400">{m.yearRange}</span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">{m.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">{m.coreContribution}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm sticky top-24 space-y-5">
              <div className="border-b border-stone-100 pb-4">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 mb-1">
                  <Milestone className="w-4 h-4" />
                  <span>{selectedMilestone.era} · {selectedMilestone.yearRange}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{selectedMilestone.title}</h3>
                <div className="flex items-center space-x-3 text-xs text-stone-500 mt-1.5">
                  <span><strong>关键人物：</strong>{selectedMilestone.keyFigure}</span>
                  <span>•</span>
                  <span><strong>发源机构：</strong>{selectedMilestone.institution}</span>
                </div>
              </div>

              {/* Core Contribution Slices */}
              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <span className="font-bold text-stone-900 block mb-1">核心理论贡献：</span>
                  <p className="text-stone-700 leading-relaxed">{selectedMilestone.coreContribution}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                  <span className="font-bold text-emerald-900 block mb-1">方法学突破：</span>
                  <p className="text-emerald-800 leading-relaxed">{selectedMilestone.breakthrough}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60">
                  <span className="font-bold text-amber-900 block mb-1">历史经典实战验证：</span>
                  <p className="text-amber-800 leading-relaxed">{selectedMilestone.caseStudy}</p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-400 italic">
                提示：情景规划的方法论演化历程表明，每一次重大跃迁均源于对传统单线预测在外部现实危机面前失灵的反思。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scenario Schools Comparison */}
      {activeTab === 'schools' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIO_SCHOOLS.map((school, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    流派 0{i + 1}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-1.5">{school.name}</h3>
                  <div className="text-[11px] text-stone-500 font-mono">{school.enName}</div>
                  <div className="text-xs text-stone-400 mt-1">发源：{school.origin} | 代表人物：{school.representative}</div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800 block mb-0.5">认识论哲学：</span>
                    <p className="text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      {school.coreEpistemology}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-800 block mb-0.5">推演工法步骤：</span>
                    <p className="text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      {school.methodLogic}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 text-[11px]">
                      <span className="font-bold text-emerald-900 block mb-0.5">显著优势：</span>
                      <span className="text-emerald-800">{school.pros}</span>
                    </div>
                    <div className="bg-rose-50/70 p-2 rounded-lg border border-rose-100 text-[11px]">
                      <span className="font-bold text-rose-900 block mb-0.5">固有局限：</span>
                      <span className="text-rose-800">{school.cons}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                <strong>典型适用场景：</strong>{school.typicalUse}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Thinkers */}
      {activeTab === 'thinkers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keyThinkers.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 font-bold border border-stone-200">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{t.name}</h3>
                    <p className="text-xs text-stone-500">{t.title}</p>
                  </div>
                </div>

                <blockquote className="my-3 p-3 bg-stone-50 rounded-xl border-l-4 border-emerald-500 text-xs italic text-stone-700 leading-relaxed">
                  {t.quote}
                </blockquote>

                <div className="space-y-2 text-xs mt-3">
                  <p className="text-stone-700">
                    <strong>划时代贡献：</strong>{t.contribution}
                  </p>
                  <p className="text-stone-500">
                    <strong>奠基著述：</strong>{t.works}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
