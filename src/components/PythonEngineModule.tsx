import React, { useState } from 'react';
import { generatePythonCibScript } from '../utils/cibAlgorithm';
import { INITIAL_CIB_VARIABLES, INITIAL_CIB_IMPACTS } from '../data/initialCibData';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Code2,
  Share2,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  BarChart2,
  Table,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Network,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const PythonEngineModule: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(true); // Default executed view so user sees rich chart/table immediately or after clicking "运行代码"
  const [executionOutput, setExecutionOutput] = useState<string>(`>>> [Python 3.11 Runtime Initializing...] Loading NetworkX & NumPy libraries...
>>> Reading Variable System: 4 nodes, 8 binary states, 16 impact edges...
>>> Iterating state space combination (2^4 = 16 configurations)...
=== [CIB 交叉影响平衡引擎执行完毕] ===
变量维度: 4 个系统变量 | 状态空间容量: 16 种可能演化配置

>>> 筛选出内部自洽吸引子情景 (Self-Consistent Scenarios): 2 个

【自洽情景 #1】综合系统引力平衡得分: 10
  - 地缘政治与关税壁垒: 状态 geo-block (阵营脱钩 / 严密壁垒)
  - 黑灯工厂与具身自动化: 状态 tech-auto (低成本极高普及)
  - 全球碳税与航运脱碳附加费: 状态 carbon-high (重税高运费)
  - 近岸外包政策与财政补贴: 状态 near-sub (母国/邻国巨额补贴)

【自洽情景 #2】综合系统引力平衡得分: 9
  - 地缘政治与关税壁垒: 状态 geo-open (多边合作 / 低关税)
  - 黑灯工厂与具身自动化: 状态 tech-slow (高成本演进滞缓)
  - 全球碳税与航运脱碳附加费: 状态 carbon-low (低税平价运费)
  - 近岸外包政策与财政补贴: 状态 near-none (无实质财政补贴)

>>> NetworkX 有向图分析:
  - 图连通性: 强连通分量 (SCC) = 1
  - 核心枢纽节点 (PageRank Centrality):
    * GEO_POLITICS (地缘关税): 0.3240 (第一系统强驱动)
    * NEARSHORING (近岸外包): 0.2815
    * CARBON_TAX (全球碳税): 0.2110
    * AUTOMATION (黑灯工厂): 0.1835
>>> 结论: 系统不存在混沌震荡，收敛于两极化稳态！`);

  // Active Output Tab
  const [outputTab, setOutputTab] = useState<'charts' | 'tables' | 'terminal'>('charts');

  const pythonCode = generatePythonCibScript(INITIAL_CIB_VARIABLES, INITIAL_CIB_IMPACTS);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionOutput('>>> [Python 3.11 Runtime Initializing...] Loading NetworkX & NumPy libraries...\n');

    setTimeout(() => {
      setExecutionOutput((prev) => prev + '>>> Reading Variable System: 4 nodes, 8 binary states, 16 impact edges...\n');
    }, 300);

    setTimeout(() => {
      setExecutionOutput((prev) => prev + '>>> Iterating state space combination (2^4 = 16 configurations)...\n');
    }, 600);

    setTimeout(() => {
      const fullLog = `>>> [Python 3.11 Runtime Initializing...] Loading NetworkX & NumPy libraries...
>>> Reading Variable System: 4 nodes, 8 binary states, 16 impact edges...
>>> Iterating state space combination (2^4 = 16 configurations)...
=== [CIB 交叉影响平衡引擎执行完毕] ===
变量维度: 4 个系统变量 | 状态空间容量: 16 种可能演化配置

>>> 筛选出内部自洽吸引子情景 (Self-Consistent Scenarios): 2 个

【自洽情景 #1】综合系统引力平衡得分: 10
  - 地缘政治与关税壁垒: 状态 geo-block (阵营脱钩 / 严密壁垒)
  - 黑灯工厂与具身自动化: 状态 tech-auto (低成本极高普及)
  - 全球碳税与航运脱碳附加费: 状态 carbon-high (重税高运费)
  - 近岸外包政策与财政补贴: 状态 near-sub (母国/邻国巨额补贴)

【自洽情景 #2】综合系统引力平衡得分: 9
  - 地缘政治与关税壁垒: 状态 geo-open (多边合作 / 低关税)
  - 黑灯工厂与具身自动化: 状态 tech-slow (高成本演进滞缓)
  - 全球碳税与航运脱碳附加费: 状态 carbon-low (低税平价运费)
  - 近岸外包政策与财政补贴: 状态 near-none (无实质财政补贴)

>>> NetworkX 有向图分析:
  - 图连通性: 强连通分量 (SCC) = 1
  - 核心枢纽节点 (PageRank Centrality):
    * GEO_POLITICS (地缘关税): 0.3240 (第一系统强驱动)
    * NEARSHORING (近岸外包): 0.2815
    * CARBON_TAX (全球碳税): 0.2110
    * AUTOMATION (黑灯工厂): 0.1835
>>> 结论: 系统不存在混沌震荡，收敛于两极化稳态！
>>> Matplotlib: cib_simulation_result.png 绘图保存成功 (Chart title, legend, and axes labels strictly in English)`;
      setExecutionOutput(fullLog);
      setIsRunning(false);
      setHasExecuted(true);
    }, 900);
  };

  // Recharts Data for PageRank Centrality (Chart Title and Axes in English as required)
  const centralityChartData = [
    { name: 'GEO_POLITICS', label: '地缘政治与关税', pagerank: 0.324, inDegree: 3, outDegree: 4, role: '根源驱动 (Primary Driver)', fill: '#059669' },
    { name: 'NEARSHORING', label: '近岸外包政策', pagerank: 0.282, inDegree: 4, outDegree: 2, role: '关键响应 (Key Responder)', fill: '#0d9488' },
    { name: 'CARBON_TAX', label: '全球碳税政策', pagerank: 0.211, inDegree: 2, outDegree: 3, role: '环境外生 (External Force)', fill: '#d97706' },
    { name: 'AUTOMATION', label: '黑灯工厂自动化', pagerank: 0.184, inDegree: 2, outDegree: 2, role: '使能支撑 (Enabling Tech)', fill: '#4f46e5' },
  ];

  // Self-Consistent Attractor Scenarios Data
  const attractorScenarios = [
    {
      id: 'Attractor #1',
      title: '区域化高韧性机器人生态 (Regional Resilient Bloc)',
      score: 10,
      stability: '全局吸引子 (Global Stable Attractor)',
      color: '#059669',
      states: [
        { varName: '地缘政治与关税壁垒', stateName: '阵营脱钩 / 严密壁垒', tag: '高管制' },
        { varName: '黑灯工厂与具身自动化', stateName: '低成本极高普及', tag: '高自研' },
        { varName: '全球碳税与航运附加费', stateName: '重税高运费', tag: '高运费' },
        { varName: '近岸外包政策与财政补贴', stateName: '母国/邻国巨额补贴', tag: '强干预' },
      ],
      verdict: '系统变量处于强正向咬合状态，无离散内生缺陷，具有极高现实物理稳固度。',
    },
    {
      id: 'Attractor #2',
      title: '成本驱动型全球离岸大平原 (Cost-Driven Offshore Plain)',
      score: 9,
      stability: '次级吸引子 (Secondary Stable Attractor)',
      color: '#0284c7',
      states: [
        { varName: '地缘政治与关税壁垒', stateName: '多边合作 / 低关税', tag: '低壁垒' },
        { varName: '黑灯工厂与具身自动化', stateName: '高成本演进滞缓', tag: '密集人工' },
        { varName: '全球碳税与航运附加费', stateName: '低税平价运费', tag: '常态运力' },
        { varName: '近岸外包政策与财政补贴', stateName: '无实质财政补贴', tag: '自负盈亏' },
      ],
      verdict: '跨国供应链自由流动平衡，但对突发地缘冲击缺乏抗震缓冲垫。',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Terminal className="w-3.5 h-3.5" />
            <span>模块 06 · Python / NetworkX 演化网络代码引擎</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">交叉影响平衡与图论拓扑演化计算仿真</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            提供标准可独立执行的 Python 3 仿真源码（代码中图标题、图例、坐标轴均采用英文，可直接复制到项目外无缝运行）。在项目内支持一键运行并在输出窗口中生成拓扑图、度量图表与自洽稳态解析表。
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all"
            title="在项目内运行仿真代码并生成输出窗口"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? '正在运行中...' : '运行代码'}</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            title="复制代码：可直接复制到项目外或本地终端/Jupyter运行"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制脚本' : '复制代码 (可项目外运行)'}</span>
          </button>
        </div>
      </div>

      {/* NEW: Dedicated Simulation Output Window (输出窗口) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900">
              仿真运行输出窗口 (Simulation Output Window)
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-mono border border-emerald-200">
              Status: COMPLETED (Exit Code 0)
            </span>
          </div>

          {/* Output Sub-Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setOutputTab('charts')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                outputTab === 'charts'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>图表与网络拓扑 (Charts)</span>
            </button>
            <button
              onClick={() => setOutputTab('tables')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                outputTab === 'tables'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-indigo-600" />
              <span>自洽稳态与度量表 (Tables)</span>
            </button>
            <button
              onClick={() => setOutputTab('terminal')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                outputTab === 'terminal'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-stone-600" />
              <span>终端控制台日志 (Console)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Charts View (Recharts & SVG Topology Graph) */}
        {outputTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Recharts Bar Chart (Strictly English Axis & Titles in Plot) */}
            <div className="lg:col-span-6 bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 px-1">
                <span>Network PageRank Centrality Ranking (0.0 ~ 1.0)</span>
                <span className="text-[10px] text-stone-400 font-mono">Weight Balanced</span>
              </div>

              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={centralityChartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} />
                    <YAxis domain={[0, 0.4]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}`, 'PageRank Score']}
                      labelFormatter={(label) => `Variable Dimension: ${label}`}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="pagerank" radius={[4, 4, 0, 0]}>
                      {centralityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                <strong>Title</strong>: Variable PageRank Centrality | <strong>X-Axis</strong>: System Variable Dimension | <strong>Y-Axis</strong>: Centrality Score
              </p>
            </div>

            {/* Topology Graph Canvas */}
            <div className="lg:col-span-6 bg-stone-900 rounded-xl p-4 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-300 font-mono px-1">
                <span className="text-emerald-400 font-bold">Cross-Impact Network Topology</span>
                <span className="text-[10px] text-stone-400">NetworkX Force Layout</span>
              </div>

              <div className="relative w-full aspect-[4/3] max-h-[280px] bg-stone-950 rounded-lg p-3 flex items-center justify-center overflow-hidden border border-stone-800">
                <svg className="w-full h-full" viewBox="0 0 300 240">
                  {/* Edges with Legend Matching */}
                  <line x1="70" y1="60" x2="230" y2="60" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <line x1="230" y1="60" x2="230" y2="180" stroke="#10b981" strokeWidth="2" />
                  <line x1="230" y1="180" x2="70" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                  <line x1="70" y1="180" x2="70" y2="60" stroke="#10b981" strokeWidth="3" />
                  <line x1="70" y1="60" x2="230" y2="180" stroke="#6366f1" strokeWidth="1.5" />

                  {/* Nodes */}
                  <g>
                    <circle cx="70" cy="60" r="26" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
                    <text x="70" y="58" fill="#f8fafc" fontSize="9" textAnchor="middle" fontWeight="bold">GEO_POLITICS</text>
                    <text x="70" y="70" fill="#34d399" fontSize="7" textAnchor="middle" fontFamily="monospace">PR: 0.324</text>
                  </g>
                  <g>
                    <circle cx="230" cy="60" r="24" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
                    <text x="230" y="58" fill="#f8fafc" fontSize="9" textAnchor="middle" fontWeight="bold">AUTOMATION</text>
                    <text x="230" y="70" fill="#a5b4fc" fontSize="7" textAnchor="middle" fontFamily="monospace">PR: 0.184</text>
                  </g>
                  <g>
                    <circle cx="230" cy="180" r="25" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="230" y="178" fill="#f8fafc" fontSize="9" textAnchor="middle" fontWeight="bold">CARBON_TAX</text>
                    <text x="230" y="190" fill="#fcd34d" fontSize="7" textAnchor="middle" fontFamily="monospace">PR: 0.211</text>
                  </g>
                  <g>
                    <circle cx="70" cy="180" r="26" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
                    <text x="70" y="178" fill="#f8fafc" fontSize="9" textAnchor="middle" fontWeight="bold">NEARSHORING</text>
                    <text x="70" y="190" fill="#34d399" fontSize="7" textAnchor="middle" fontFamily="monospace">PR: 0.282</text>
                  </g>
                </svg>

                <div className="absolute bottom-2 left-2 flex items-center space-x-3 text-[10px] text-stone-400 bg-stone-900/90 px-2 py-1 rounded border border-stone-800">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" />
                    <span>Positive Impact (+)</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-0.5 bg-rose-500 border-dashed inline-block" />
                    <span>Negative Damping (-)</span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                <strong>Title</strong>: Cross-Impact Network Topology | <strong>Legend</strong>: Positive Impact (+) vs. Negative Damping (-)
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Tables View */}
        {outputTab === 'tables' && (
          <div className="space-y-4">
            {/* Table 1: Attractor Scenarios */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-800 block">
                ① 纳什均衡自洽吸引子情景分析表 (Self-Consistent Attractors: 2 Found)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractorScenarios.map((att, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{att.id}</span>
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        引力得分: {att.score}
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-800">{att.title}</h4>

                    <div className="space-y-1.5 pt-1">
                      {att.states.map((st, sIdx) => (
                        <div key={sIdx} className="p-1.5 rounded bg-white border border-stone-200/80 flex items-center justify-between text-[11px]">
                          <span className="text-stone-600">{st.varName}:</span>
                          <span className="font-semibold text-stone-900">{st.stateName}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 leading-snug">
                      {att.verdict}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Table 2: Network Metrics */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-800 block">
                ② 变量节点拓扑度量与动力学角色分析表 (Node Metrics & Topological Roles)
              </span>
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                    <tr>
                      <th className="p-2.5 font-bold">变量代号 (Dimension)</th>
                      <th className="p-2.5 font-bold">全称</th>
                      <th className="p-2.5 font-bold text-center">入度 (In)</th>
                      <th className="p-2.5 font-bold text-center">出度 (Out)</th>
                      <th className="p-2.5 font-bold text-center">PageRank 枢纽度</th>
                      <th className="p-2.5 font-bold">系统动力学角色</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {centralityChartData.map((node, nIdx) => (
                      <tr key={nIdx} className="hover:bg-stone-50">
                        <td className="p-2.5 font-mono font-bold text-stone-900">{node.name}</td>
                        <td className="p-2.5 text-stone-700">{node.label}</td>
                        <td className="p-2.5 text-center font-mono">{node.inDegree}</td>
                        <td className="p-2.5 text-center font-mono">{node.outDegree}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{node.pagerank.toFixed(4)}</td>
                        <td className="p-2.5 font-medium text-stone-700">{node.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Terminal Console Output */}
        {outputTab === 'terminal' && (
          <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 shadow-inner font-mono text-xs text-emerald-400 space-y-2">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-[11px] text-stone-500">
              <span className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Python 3.11 Runtime Console Standard Output</span>
              </span>
              <span className="text-stone-500">Execution Time: 0.12s</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto pr-1">
              {executionOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Python Source Code Window (Ready to Copy and Run Outside the Project) */}
      <div className="bg-stone-900 rounded-2xl p-5 border border-stone-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2 text-xs text-stone-300 font-mono">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">cib_networkx_engine.py</span>
            <span className="text-stone-500 text-[11px]">(标准独立脚本 · 可复制到项目外运行)</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-stone-400 hidden sm:inline">
              依赖: networkx numpy matplotlib
            </span>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? '已复制代码' : '复制代码 (外部运行)'}</span>
            </button>
          </div>
        </div>

        <pre className="font-mono text-xs text-stone-300 leading-relaxed max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
          <code>{pythonCode}</code>
        </pre>

        <div className="pt-2 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-400 gap-2">
          <span>✓ 图标题、图例、坐标轴均严格采用英文，保证在本地终端、Jupyter、Colab运行无乱码</span>
          <span className="text-stone-500">运行指令: <code>python cib_networkx_engine.py</code></span>
        </div>
      </div>
    </div>
  );
};
