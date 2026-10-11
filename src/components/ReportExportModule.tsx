import React, { useState, useMemo } from 'react';
import { AxisDefinition, DriverFactor, BenchmarkCase } from '../types/scenario';
import { SIX_BENCHMARK_CASES } from '../data/sixCases';
import {
  Download,
  Copy,
  Printer,
  FileText,
  Check,
  Share2,
  FileCode,
  Sparkles,
  Eye,
  Layers,
  Table,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  Database,
  FileSpreadsheet,
} from 'lucide-react';

interface ReportExportProps {
  axisX: AxisDefinition;
  axisY: AxisDefinition;
  drivers: DriverFactor[];
}

export const ReportExportModule: React.FC<ReportExportProps> = ({
  axisX,
  axisY,
  drivers,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [downloadSuccessCase, setDownloadSuccessCase] = useState<string | null>(null);

  // Preview Mode: 'full_preview' | 'markdown_source' | 'case_datasets'
  const [activeTab, setActiveTab] = useState<'full_preview' | 'markdown_source' | 'case_datasets'>('full_preview');

  // Currently inspected report target: 'current' or any of case-shell, case-autonomous, etc.
  const [selectedReportTarget, setSelectedReportTarget] = useState<string>('current');

  // Get active case data if inspecting a benchmark case
  const activeCase = SIX_BENCHMARK_CASES.find((c) => c.id === selectedReportTarget);

  // Active Axis and Quadrants depending on selection
  const effectiveAxisX = activeCase?.axisX || axisX;
  const effectiveAxisY = activeCase?.axisY || axisY;
  const effectiveCaseTitle = activeCase ? activeCase.title : '多维未来演化与战略情景规划白皮书';
  const effectiveOrg = activeCase ? activeCase.organization : '情景分析法与多维未来演化实验室 (Scenario Lab Engine)';

  // Helper to trigger JSON download for a benchmark case
  const handleDownloadCaseJson = (bCase: BenchmarkCase) => {
    const blob = new Blob([JSON.stringify(bCase, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bCase.id}-raw-dataset.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccessCase(`${bCase.numberTag} JSON`);
    setTimeout(() => setDownloadSuccessCase(null), 2500);
  };

  // Helper to trigger CSV download for a benchmark case
  const handleDownloadCaseCsv = (bCase: BenchmarkCase) => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += `Case ID,Number,Title,Method,Organization\n`;
    csvContent += `"${bCase.id}","${bCase.numberTag}","${bCase.title}","${bCase.methodTag}","${bCase.organization}"\n\n`;

    if (bCase.quadrants) {
      csvContent += `Quadrant ID,Title,X State,Y State,Tagline,World Narrative\n`;
      bCase.quadrants.forEach((q) => {
        csvContent += `"${q.id}","${q.title}","${q.xState}","${q.yState}","${q.tagline}","${q.worldNarrative.replace(/"/g, '""')}"\n`;
      });
    } else if (bCase.morphologyTable) {
      csvContent += `Dimension,Selected Route Index,Options List\n`;
      bCase.morphologyTable.forEach((m) => {
        csvContent += `"${m.dimension}","${m.selectedRoute}","${m.options.join(' | ')}"\n`;
      });
    } else if (bCase.cibVariables) {
      csvContent += `Variable ID,Variable Name,Category,State 1,State 2\n`;
      bCase.cibVariables.forEach((v) => {
        csvContent += `"${v.id}","${v.name}","${v.category}","${v.states[0].label}","${v.states[1].label}"\n`;
      });
    } else if (bCase.tiaEvents) {
      csvContent += `Event Description,Year,Probability,Impact Delta\n`;
      bCase.tiaEvents.forEach((ev) => {
        csvContent += `"${ev.event}","${ev.year}","${ev.probability}","${ev.impactDelta}"\n`;
      });
    } else if (bCase.robustnessStrategy) {
      csvContent += `Strategy Name,Hedging Cost,Q1 Score,Q2 Score,Q3 Score,Q4 Score,Action\n`;
      bCase.robustnessStrategy.forEach((st) => {
        csvContent += `"${st.strategyName}","${st.hedgingCost}","${st.scoresInScenarios[0]}","${st.scoresInScenarios[1]}","${st.scoresInScenarios[2]}","${st.scoresInScenarios[3]}","${st.recommendedAction}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${bCase.id}-data-table.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccessCase(`${bCase.numberTag} CSV`);
    setTimeout(() => setDownloadSuccessCase(null), 2500);
  };

  // Structured Markdown generation with 6 workflow sections
  const generateMarkdownReport = () => {
    return `# 《${effectiveCaseTitle}》
**评估机构**：${effectiveOrg}  
**编制时间**：2026年10月  
**方法架构**：严格按照情景分析法全流程导引标准六步走编制 (PESTEL $\\rightarrow$ 正交对立 $\\rightarrow$ 象限推演 $\\rightarrow$ CIB检验 $\\rightarrow$ 鲁棒测试 $\\rightarrow$ 预警总成)

---

## 第一部分：宏观地平线扫描与关键驱动力识别 (PESTEL Scanning)
通过对政治 (P)、经济 (E)、社会 (S)、技术 (T)、环境 (En) 与法律 (L) 六维度的扫描，共识别系统级关键因子如下：
${drivers
  .slice(0, 8)
  .map(
    (d, i) =>
      `${i + 1}. **${d.name}** [${d.categoryLabel}] - 影响度: ${d.impact}/10 | 不确定性: ${d.uncertainty}/10\n   - *驱动研判*：${d.currentStatus}`
  )
  .join('\n')}

---

## 第二部分：不确定性评估与正交对立轴确立 (Axes Orthogonality Selection)
经坐标降维与正交独立性检验，剔除“好 vs 坏”的线性塌缩陷阱，提取出两大核心张力轴：
- **横轴 (X 轴 · 供给技术侧)**：${effectiveAxisX.name}
  - 负极 [-X]：${effectiveAxisX.negativeLabel}
  - 正极 [+X]：${effectiveAxisX.positiveLabel}
- **纵轴 (Y 轴 · 制度环境侧)**：${effectiveAxisY.name}
  - 负极 [-Y]：${effectiveAxisY.negativeLabel}
  - 正极 [+Y]：${effectiveAxisY.positiveLabel}

---

## 第三部分：2x2 极端四象限未来图景与情景叙事 (2x2 Scenario Worlds & Narratives)

### 象限 I：范式跃迁 (Paradigm Leap)
- **坐标状态**：[+X] ${effectiveAxisX.positiveLabel} × [+Y] ${effectiveAxisY.positiveLabel}
- **世界观全景**：双重正向驱动共振，技术渗透与合规红利推动产业进入全新扩张周期，行业向头部集约。
- **生态赢家**：底层专利掌控者、跨国合规龙头平台、高弹性清洁资本。
- **淘汰画像**：沉没成本高昂的守成型传统巨头、无法承受合规改造成本的长尾作坊。

### 象限 II：围城博弈 (The Walled Garden)
- **坐标状态**：[-X] ${effectiveAxisX.negativeLabel} × [+Y] ${effectiveAxisY.positiveLabel}
- **世界观全景**：外部强监管与高门槛施压，但底层供给侧陷入技术瓶颈，全球链条分裂为排他性本土自给圈。
- **生态赢家**：本土关键要素垄断供应商、具备特许经营权的国资龙头。

### 象限 III：极寒重力 (The Deep Frost)
- **坐标状态**：[-X] ${effectiveAxisX.negativeLabel} × [-Y] ${effectiveAxisY.negativeLabel}
- **世界观全景**：技术与政策预期双重收缩，全行业转向存量价格战与去库存，颠覆性长期投资全面冻结。
- **生存底牌**：果断去杠杆，储备充沛现金资产，低位收纳优质核心专利。

### 象限 IV：野生丛林 (The Wild Frontier)
- **坐标状态**：[+X] ${effectiveAxisX.positiveLabel} × [-Y] ${effectiveAxisY.negativeLabel}
- **世界观全景**：技术单边狂飙突进，但社会制度与伦理治理严重缺位，野蛮试错与次生伦理风险激增。
- **应对战略**：设立边缘特战小分队敏捷切入，同时设立严格法务合规防火墙。

---

## 第四部分：交叉影响平衡 (CIB) 与逻辑自洽性检验 (Cross-Impact Balances)
- 经 $N \\times N$ 变量状态作用矩阵扫描，消除“既享受全球零关税，又获得高额近岸搬迁补贴且海运费暴涨”的逻辑伪情景；
- 最终数学锁定两大自洽吸引子稳态：
  1. **自洽稳态 A（区域化高韧性生态）**：地缘壁垒 + 普及机器人 + 高碳税 + 强补贴；
  2. **自洽稳态 B（成本驱动型离岸平原）**：多边开放 + 传统人工 + 廉价海运 + 无补贴。

---

## 第五部分：跨情景战略鲁棒性压力测试与成熟度评估 (Robustness Testing & Maturity)
- **六维能力成熟度模型**：
  - 研发技术储备：88 分（行业基准: 65）
  - 战略敏捷弹性：90 分（行业基准: 60）
  - 政策合规穿透力：86 分（行业基准: 58）
  - 供应链韧性冗余：78 分（行业基准: 62）
  - 资本缓冲安全垫：82 分（行业基准: 70）
  - 生态掌控定价权：85 分（行业基准: 55）
- **鲁棒性结论**：拒绝寻找在单一象限拿 100 分而在其他象限拿 0 分的脆性战略；确立在全部 4 个象限均稳定保持 75~85 分的模块化对冲策略。

---

## 第六部分：先行早期预警雷达 (EWS) 与行动对冲总成 (Early Warning Radar & Strategic Action Plan)
1. **建立先行客观预警指标 (EWS)**：
   - 指标 1：国际碳关税与跨境数据法规落地频次（领先期 12 个月）；
   - 指标 2：头部企业研发资本开支向替代赛道的转折斜率（领先期 6~18 个月）。
2. **决策层行动纲领**：
   - 立即建立跨部门情景演练室；
   - 对核心生产端与采购端实施模块化解耦，保留跨象限双向战略期权。
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadCurrentJson = () => {
    const data = {
      project: '情景分析法与多维未来演化实验室',
      target: selectedReportTarget,
      generatedAt: new Date().toISOString(),
      axisX: effectiveAxisX,
      axisY: effectiveAxisY,
      drivers,
      benchmarkCase: activeCase || null,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario-whitepaper-${selectedReportTarget}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Download className="w-3.5 h-3.5" />
            <span>模块 09 · 报告导出切片与六大案例数据集下载中心</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">《战略情景白皮书》全流程预览与案例原始数据集</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            严格遵循全流程导引的六大核心步骤组织；提供六大经典标杆案例的原始数据 JSON / CSV 下载选项，支持实时报告全景预览与打印导出。
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? '已复制 Markdown' : '复制 Markdown'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印 / 导出 PDF</span>
          </button>

          <button
            onClick={handleDownloadCurrentJson}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>{copiedJson ? '已下载数据' : '下载当前 JSON'}</span>
          </button>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccessCase && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
          <span className="flex items-center space-x-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>已成功下载案例原始数据包：{downloadSuccessCase}</span>
          </span>
          <span className="text-[10px] text-emerald-600">可直接导入 Python / Excel / R 开展独立推演</span>
        </div>
      )}

      {/* Main View Selector & Target Switcher Slices */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Report Preview Mode Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveTab('full_preview')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'full_preview'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>白皮书全景预览 (6大阶段)</span>
          </button>

          <button
            onClick={() => setActiveTab('case_datasets')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'case_datasets'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>六大案例原始数据下载中心</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown_source')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'markdown_source'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Markdown 源码预览</span>
          </button>
        </div>

        {/* Case Target Picker */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-stone-500 font-medium whitespace-nowrap">预览报告对象：</span>
          <select
            value={selectedReportTarget}
            onChange={(e) => setSelectedReportTarget(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
          >
            <option value="current">当前实验室沙盘推演成果</option>
            {SIX_BENCHMARK_CASES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.numberTag} · {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 1: Six Benchmark Cases Raw Datasets Download Hub */}
      {activeTab === 'case_datasets' && (
        <div className="space-y-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>
                <strong>六大实战案例原始数据下载专区</strong>：包含壳牌、自动驾驶形态学、全球供应链 CIB、电力规划 TIA、新消费直觉叙事与鲁棒压力测试的标准数据集。
              </span>
            </span>
            <span className="text-stone-400">支持 JSON / CSV 格式</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SIX_BENCHMARK_CASES.map((bCase) => (
              <div
                key={bCase.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-stone-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {bCase.numberTag}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">{bCase.organization}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 leading-tight">{bCase.title}</h4>
                  <div className="text-[11px] font-medium text-stone-500 bg-stone-100/70 p-1.5 rounded">
                    方法：{bCase.methodTag}
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {bCase.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDownloadCaseJson(bCase)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-2.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-2xs"
                    title="下载该案例的完整 JSON 数据包"
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>JSON 数据</span>
                  </button>

                  <button
                    onClick={() => handleDownloadCaseCsv(bCase)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-2.5 text-xs font-semibold rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-colors"
                    title="下载该案例的结构化 CSV 表格"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                    <span>CSV 表格</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedReportTarget(bCase.id);
                      setActiveTab('full_preview');
                    }}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                    title="在白皮书中预览该案例"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Full Preview (Strictly 6 Sections following Workflow Wizard) */}
      {activeTab === 'full_preview' && (
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-4xl mx-auto space-y-8 font-sans print:shadow-none print:border-none print:p-0">
          {/* Header of Whitepaper */}
          <div className="border-b border-stone-200 pb-6 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Strategic Foresight Whitepaper · 标准全流程导引六部曲
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 pt-2 tracking-tight">
              {effectiveCaseTitle}
            </h1>
            <p className="text-xs text-stone-500">
              {effectiveOrg} · 面向 2035 年的深度不确定性与跨周期鲁棒性战略成果
            </p>
          </div>

          {/* SECTION 1: 宏观地平线扫描与关键驱动力识别 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                第一部分：宏观地平线扫描与关键驱动力识别 (PESTEL Horizon Scanning)
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              基于战略前瞻方法论，本研讨对政治 (P)、经济 (E)、社会 (S)、技术 (T)、环境 (En) 与法律 (L) 六大宏观领域的长周期演化动力开展全面扫描，共提炼 {drivers.length} 个基础驱动因子：
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {drivers.slice(0, 6).map((d, idx) => (
                <div key={d.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">{idx + 1}. {d.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">[{d.category}]</span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{d.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: 不确定性评估与正交对立轴确立 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                第二部分：不确定性评估与正交对立轴确立 (Axes Orthogonality Selection)
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              通过“影响程度 vs. 不确定性”坐标筛选，排除了因果重合的共线伪轴，确立代表系统根本张力的正交两极：
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-indigo-900 block mb-1">【横轴 X · 供给技术侧】：{effectiveAxisX.name}</span>
                <div className="space-y-1 text-[11px] text-stone-600">
                  <p>• 负向极值 [-X]：{effectiveAxisX.negativeLabel}</p>
                  <p>• 正向极值 [+X]：{effectiveAxisX.positiveLabel}</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-emerald-900 block mb-1">【纵轴 Y · 制度环境侧】：{effectiveAxisY.name}</span>
                <div className="space-y-1 text-[11px] text-stone-600">
                  <p>• 负向极值 [-Y]：{effectiveAxisY.negativeLabel}</p>
                  <p>• 正向极值 [+Y]：{effectiveAxisY.positiveLabel}</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: 2x2 极端四象限未来图景与情景叙事 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                第三部分：2x2 极端四象限未来图景与情景叙事 (2x2 Quadrant Futures & Evocative Narratives)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                <div className="flex justify-between font-bold text-emerald-950">
                  <span>象限 I：范式跃迁 (Paradigm Leap)</span>
                  <span className="font-mono text-[10px] text-emerald-700">[+X, +Y]</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  技术突破与强制制度双轮共振，系统迎来黄金爆发期。单位交易成本归零，行业加速向掌握标准的巨头垄断集约。
                </p>
                <div className="text-[10px] text-emerald-800 font-medium pt-1">
                  跃迁赢家：底层标准制定者、跨国合规龙头
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
                <div className="flex justify-between font-bold text-amber-950">
                  <span>象限 II：围城博弈 (The Walled Garden)</span>
                  <span className="font-mono text-[10px] text-amber-700">[-X, +Y]</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  外部强监管与高门槛施压，但底层供给受制于封锁瓶颈。全球产业链分裂为排他性本土自给闭环圈，摩擦成本激增。
                </p>
                <div className="text-[10px] text-amber-800 font-medium pt-1">
                  跃迁赢家：本土关键资源垄断者、特许经营巨头
                </div>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5">
                <div className="flex justify-between font-bold text-rose-950">
                  <span>象限 III：极寒重力 (The Deep Frost)</span>
                  <span className="font-mono text-[10px] text-rose-700">[-X, -Y]</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  技术与政策双重冰冻收缩，全行业转向存量价格战与防御求存，颠覆性长期科研与重资产 CapEx 全面冻结。
                </p>
                <div className="text-[10px] text-rose-800 font-medium pt-1">
                  生存底牌：现金为王，深潜模式以极低估值收纳专利
                </div>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1.5">
                <div className="flex justify-between font-bold text-indigo-950">
                  <span>象限 IV：野生丛林 (The Wild Frontier)</span>
                  <span className="font-mono text-[10px] text-indigo-700">[+X, -Y]</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  技术单边野蛮爆发，但监管治理严重缺位。市场群雄割据，草莽试错伴生巨大的偶发性系统道德与安全次生危机。
                </p>
                <div className="text-[10px] text-indigo-800 font-medium pt-1">
                  对冲行动：特战小分队轻量突击，设立穿透式防火墙
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: 交叉影响平衡 (CIB) 与逻辑自洽性检验 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                第四部分：交叉影响平衡 (CIB) 与逻辑自洽性检验 (CIB Consistency)
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <span className="font-bold text-stone-900 block">
                CIB 代数一致性准则与伪情景剔除结论：
              </span>
              <p className="text-stone-600 leading-relaxed">
                运用德国斯图加特大学 Wolfgang Weimer-Jehle 开创的交叉影响平衡算法，对系统变量间相互强化与阻尼矩阵进行 $2^N$ 状态空间遍历求解。
                成功剔除“既要全球零关税，又要本国巨额近岸搬迁补贴，同时海运费高昂”的矛盾伪情景，精准收敛出两大自洽吸引子稳态：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-white rounded border border-stone-200 text-emerald-800">
                  ✔ 稳态 A：【区域化高韧性机器人生态】(引力得分: 10)
                </div>
                <div className="p-2 bg-white rounded border border-stone-200 text-indigo-800">
                  ✔ 稳态 B：【成本驱动型全球离岸大平原】(引力得分: 9)
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: 跨情景战略鲁棒性压力测试与成熟度评估 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                5
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                第五部分：跨情景战略鲁棒性压力测试与成熟度评估 (Robustness & Maturity)
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              将组织候选战略置于异构世界观中实施压力测试。六维战略成熟度评估结论表明：
            </p>
            <div className="overflow-x-auto border border-stone-200 rounded-xl text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <tr>
                    <th className="p-2.5 font-bold">能力维度</th>
                    <th className="p-2.5 font-bold text-center">综合均分</th>
                    <th className="p-2.5 font-bold text-center">行业基准</th>
                    <th className="p-2.5 font-bold">跨周期战略对冲要点</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr className="hover:bg-stone-50">
                    <td className="p-2.5 font-bold text-stone-900">研发技术储备</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">88分</td>
                    <td className="p-2.5 text-center font-mono text-stone-400">65分</td>
                    <td className="p-2.5 text-stone-600 text-[11px]">保留底层原生替代与跨技术路线期权</td>
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="p-2.5 font-bold text-stone-900">战略敏捷弹性</td>
                    <td className="p-2.5 text-center font-mono font-bold text-indigo-700">90分</td>
                    <td className="p-2.5 text-center font-mono text-stone-400">60分</td>
                    <td className="p-2.5 text-stone-600 text-[11px]">组织模块化解耦，允许数周内重置战术航向</td>
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="p-2.5 font-bold text-stone-900">政策合规穿透力</td>
                    <td className="p-2.5 text-center font-mono font-bold text-amber-700">86分</td>
                    <td className="p-2.5 text-center font-mono text-stone-400">58分</td>
                    <td className="p-2.5 text-stone-600 text-[11px]">具备属地化法务与反规避游说防御护城河</td>
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="p-2.5 font-bold text-stone-900">资本缓冲安全垫</td>
                    <td className="p-2.5 text-center font-mono font-bold text-rose-700">82分</td>
                    <td className="p-2.5 text-center font-mono text-stone-400">70分</td>
                    <td className="p-2.5 text-stone-600 text-[11px]">保持极度稳健的自由现金流绝对安全储备</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 6: 先行早期预警雷达 (EWS) 与对冲行动白皮书纲领 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                6
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                第六部分：先行早期预警雷达 (EWS) 与行动对冲总成 (Early Warning & Action Plan)
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs space-y-2.5 leading-relaxed">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                高管决策层核心行动对冲纲领：
              </span>
              <p>
                1. <strong>部署早期预警监测室 (EWS Control Room)</strong>：重点监控领先 6~18 个月的两项先行客观指标——国际惩罚性关税/审计判例落地频次、行业龙头资本开支(CapEx)向替代赛道的转折斜率；
              </p>
              <p>
                2. <strong>拒绝押注单一未来</strong>：坚决抵制挑选“单一心仪象限”的偷懒倾向，确保核心资产在任何象限均具备不至于猝死的生存冗余；
              </p>
              <p>
                3. <strong>实施模块化插件式重构</strong>：将采购端与销售渠道进行可插拔解耦，在外部世界向象限 II 或象限 III 偏转时，以最低沉没成本完成平滑切换。
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Tab 3: Markdown Source Preview */}
      {activeTab === 'markdown_source' && (
        <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center space-x-2 text-xs text-stone-300 font-mono">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">scenario_whitepaper_report.md</span>
            </div>
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? '已复制' : '复制 Markdown 源码'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs text-stone-300 leading-relaxed max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
            <code>{generateMarkdownReport()}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
