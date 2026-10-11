import React, { useState, useMemo } from 'react';
import { AxisDefinition, ScenarioQuadrant, DriverFactor, StrategicMaturityMetric } from '../types/scenario';
import {
  Grid,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpDown,
  ArrowLeftRight,
  TrendingUp,
  AlertCircle,
  Eye,
  Check,
  Award,
  Shield,
  BookOpen,
  Radar as RadarIcon,
  BarChart3,
  Sliders,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

interface Matrix2x2Props {
  axisX: AxisDefinition;
  setAxisX: (axis: AxisDefinition) => void;
  axisY: AxisDefinition;
  setAxisY: (axis: AxisDefinition) => void;
  drivers: DriverFactor[];
  onOpenAiDrawer: () => void;
}

export const Matrix2x2Module: React.FC<Matrix2x2Props> = ({
  axisX,
  setAxisX,
  axisY,
  setAxisY,
  drivers,
  onOpenAiDrawer,
}) => {
  const [selectedQuadrantId, setSelectedQuadrantId] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [isNarrativeLoading, setIsNarrativeLoading] = useState(false);
  const [generatedNarratives, setGeneratedNarratives] = useState<Record<string, string>>({});
  const [chartView, setChartView] = useState<'focused_radar' | 'overlay_radar' | 'bar_matrix'>('focused_radar');

  // Custom user offsets for maturity scores (allowing interactive tuning)
  const [customScoreAdjustments, setCustomScoreAdjustments] = useState<Record<string, number>>({});

  // Dynamic Quadrants with Strategic Maturity Metrics based on current axisX and axisY
  const quadrants: ScenarioQuadrant[] = useMemo(() => [
    {
      id: 'Q1',
      title: '高维共振 · 范式跃迁 (Paradigm Leap)',
      subTitle: `[+X] ${axisX.positiveLabel} × [+Y] ${axisY.positiveLabel}`,
      xState: 'pos',
      yState: 'pos',
      tagline: '供给技术与制度红利双轮共振，系统迎来黄金爆发期',
      worldNarrative: `在该未来图景中，横轴「${axisX.name}」的突破性渗透与纵轴「${axisY.name}」的强制推进形成强正向循环。产业旧体系被全面迭代，资本加速流向高技术与合规领航者。市场集中度大幅提升，但各方普遍享受系统扩张带来的增量红利。`,
      characteristics: [
        `横轴正向状态极度活跃：${axisX.positiveDescription}`,
        `纵轴正向要求全面落地：${axisY.positiveDescription}`,
        '全行业单位交易成本大幅降低，生态网络协同效应登峰造极',
      ],
      winners: ['技术专利掌控者', '合规与标准化龙头平台', '高弹性跨国资本开发商'],
      losers: ['守成型传统线性生产企业', '无法承受合规改造成本的长尾小作坊'],
      earlyWarningSignals: [
        '行业首份全球统一标准规范出台并获主流经济体互认',
        '头部企业该赛道研发与资本开支(CapEx)连续三年占比超 60%',
      ],
      strategicImperatives: [
        '倾斜 70% 资源实施进取型创新，提前占领行业核心技术生态位',
        '建立跨界战略联盟，主导下一代国际通用标准制定',
      ],
      color: '#059669', // Emerald
      accentBg: '#ecfdf5',
      maturityScores: [
        { dimension: '研发技术储备', score: 94, benchmark: 65, description: '前瞻专利覆盖度极高，拥有自主原生替代能力' },
        { dimension: '战略敏捷弹性', score: 88, benchmark: 60, description: '组织扁平，能够高频响应前沿范式跃迁' },
        { dimension: '生态掌控定价权', score: 90, benchmark: 55, description: '主导行业标准接口，具备显著技术溢价' },
        { dimension: '合规制度穿透力', score: 86, benchmark: 58, description: '全面满足跨国多边监管与碳足迹穿透审查' },
        { dimension: '供应链韧性冗余', score: 78, benchmark: 62, description: '全球化多源采购顺畅，但长链依赖仍存' },
        { dimension: '资本缓冲安全垫', score: 76, benchmark: 70, description: '高研发CapEx带来资金消耗，需持续股权融资' },
      ],
    },
    {
      id: 'Q2',
      title: '围城博弈 · 结构滞胀 (The Walled Garden)',
      subTitle: `[-X] ${axisX.negativeLabel} × [+Y] ${axisY.positiveLabel}`,
      xState: 'neg',
      yState: 'pos',
      tagline: '强制度约束下的供给侧枯竭，阵营壁垒与存量争夺',
      worldNarrative: `纵轴「${axisY.name}」带来极其严苛的外部管制与高门槛，但横轴「${axisX.name}」的技术或供给未达预期。企业面临合规成本激增但生产力未能同步飞跃的夹板困局，全球产业链逐步演化为排他性的自给自足闭环小圈子。`,
      characteristics: [
        `横轴陷入瓶颈阻力：${axisX.negativeDescription}`,
        `纵轴施加极强压制：${axisY.positiveDescription}`,
        '替代品成本居高不下，合规摩擦成为企业最大的隐性损耗',
      ],
      winners: ['本土化关键要素垄断供应商', '具有政策游说与特许经营权的国资巨头', '合规咨询与本地化供应链解决方案商'],
      losers: ['单纯依靠成本优势的跨国贸易中间商', '严重依赖外部进口核心材料的组装厂'],
      earlyWarningSignals: [
        '多国陆续实施排他性进口配额制与准入审查清单',
        '行业合规法务审计开支首次反超技术研发开支',
      ],
      strategicImperatives: [
        '实施“双轨制”安全冗余供应链，锁定本土原材料长期协议',
        '剥离非核心跨国重资产，聚焦高防御性现金流业务',
      ],
      color: '#d97706', // Amber
      accentBg: '#fffbeb',
      maturityScores: [
        { dimension: '研发技术储备', score: 58, benchmark: 65, description: '受限于外部关键技术封锁，自研替代尚在攻坚' },
        { dimension: '战略敏捷弹性', score: 64, benchmark: 60, description: '受制于重度合规审查，决策链路被动延长' },
        { dimension: '生态掌控定价权', score: 72, benchmark: 55, description: '在本土排他性准入市场享有较高特许定价' },
        { dimension: '合规制度穿透力', score: 92, benchmark: 58, description: '具备极强法律游说、反规避合规与属地化认证壁垒' },
        { dimension: '供应链韧性冗余', score: 86, benchmark: 62, description: '实施双备份与近岸外包，抗断供生存力优异' },
        { dimension: '资本缓冲安全垫', score: 82, benchmark: 70, description: '保守财务杠杆，充沛现金储备以应对摩擦' },
      ],
    },
    {
      id: 'Q3',
      title: '极寒重力 · 存量回退 (The Deep Frost)',
      subTitle: `[-X] ${axisX.negativeLabel} × [-Y] ${axisY.negativeLabel}`,
      xState: 'neg',
      yState: 'neg',
      tagline: '预期全面收缩，旧秩序的防御性固守与生存内卷',
      worldNarrative: `在此象限中，横轴「${axisX.name}」与纵轴「${axisY.name}」均陷入低潮与退潮。不仅没有颠覆性技术带来增量，而且政策治理与社会共识陷入分裂与冷漠。全社会转向极致防御与务实求存，颠覆性长期投资全面叫停。`,
      characteristics: [
        `横轴退守存量防御：${axisX.negativeDescription}`,
        `纵轴缺乏制度牵引：${axisY.negativeDescription}`,
        '全行业以价格战和去库存为核心特征，创新容错率降至冰点',
      ],
      winners: ['手握天量自由现金流的低负债传统老牌企业', '硬核极致低成本的源头制造工厂'],
      losers: ['重资产高负债的早期风险投资导向型企业', '依赖宏大叙事上市的无盈利科技新贵'],
      earlyWarningSignals: [
        '主要金融机构全面收紧对长期颠覆性项目的信贷审批',
        '行业内发生数起标杆性新兴独角兽资金链断裂重组事件',
      ],
      strategicImperatives: [
        '果断去杠杆，保留充裕的流动性现金资产储备',
        '实施“深潜模式”，通过战术性兼并收购以极低估值收纳优质核心专利',
      ],
      color: '#dc2626', // Red
      accentBg: '#fef2f2',
      maturityScores: [
        { dimension: '研发技术储备', score: 42, benchmark: 65, description: '颠覆性科研CapEx全面叫停，仅维持基础维护' },
        { dimension: '战略敏捷弹性', score: 56, benchmark: 60, description: '组织收缩求存，战略以规避错误与控本为先' },
        { dimension: '生态掌控定价权', score: 50, benchmark: 55, description: '存量红海价格战惨烈，行业毛利空间被严重击穿' },
        { dimension: '合规制度穿透力', score: 52, benchmark: 58, description: '政策监管虚化，合规溢价无法在市场上变现' },
        { dimension: '供应链韧性冗余', score: 70, benchmark: 62, description: '极致压缩供应链安全库存以减少流动资金占用' },
        { dimension: '资本缓冲安全垫', score: 95, benchmark: 70, description: '现金为王！保持近乎苛刻的自由现金流绝对安全' },
      ],
    },
    {
      id: 'Q4',
      title: '野生丛林 · 激进试错 (The Wild Frontier)',
      subTitle: `[+X] ${axisX.positiveLabel} × [-Y] ${axisY.negativeLabel}`,
      xState: 'pos',
      yState: 'neg',
      tagline: '缺乏规则锚定的技术蛮荒爆发，混乱中的草莽机会',
      worldNarrative: `横轴「${axisX.name}」以惊人速度狂飙突进，然而纵轴「${axisY.name}」的监管、法律与伦理治理严重脱节缺位。市场呈现群雄割据的野蛮生长态势，技术被高频试错与无序滥用，暴利与系统性道德/安全危机相伴相生。`,
      characteristics: [
        `横轴野蛮爆发狂飙：${axisX.positiveDescription}`,
        `纵轴管制滞后甚至失效：${axisY.negativeDescription}`,
        '由于缺乏统一护栏，颠覆性创新伴随巨大的次生公害与偶发性灾难',
      ],
      winners: ['打法灵活敏捷的草莽游击型创业战队', '投机性高杠杆黑天鹅套利者', '边缘去中心化创新平台'],
      losers: ['受制于繁琐内部合规审查流程的跨国老牌巨头', '缺乏黑天鹅抗打击能力的单点企业'],
      earlyWarningSignals: [
        '黑市与灰色交易规模激增，官方声明“仍在调研监管范畴”',
        '低代码/开源技术导致行业准入门槛归零，玩家数量井喷 500%',
      ],
      strategicImperatives: [
        '设立“特战小分队”敏捷切入前沿战场，不与传统主营业务流程绑定',
        '建立严密防火墙，随时防范突如其来的穿透式监管强震',
      ],
      color: '#4f46e5', // Indigo
      accentBg: '#eef2ff',
      maturityScores: [
        { dimension: '研发技术储备', score: 88, benchmark: 65, description: '快速应用开源与生成式工具，原型试错周期极短' },
        { dimension: '战略敏捷弹性', score: 95, benchmark: 60, description: '极致轻量化与模块化，数周内可完成航向重置' },
        { dimension: '生态掌控定价权', score: 76, benchmark: 55, description: '靠先发流量红利掠夺市场，但护城河稳定性欠缺' },
        { dimension: '合规制度穿透力', score: 38, benchmark: 58, description: '严重欠缺合规风控基础设施，存在被叫停清算的系统性风险' },
        { dimension: '供应链韧性冗余', score: 55, benchmark: 62, description: '以高周转现货为准，抗上游长周期断链能力薄弱' },
        { dimension: '资本缓冲安全垫', score: 62, benchmark: 70, description: '高贝塔高杠杆激进下注，容错空间逼仄' },
      ],
    },
  ], [axisX, axisY]);

  const currentQuadrant = quadrants.find((q) => q.id === selectedQuadrantId) || quadrants[0];

  // Dynamic scores for current quadrant with custom tuning
  const currentMaturityData = useMemo(() => {
    return (currentQuadrant.maturityScores || []).map((m) => {
      const delta = customScoreAdjustments[`${currentQuadrant.id}-${m.dimension}`] || 0;
      const effectiveScore = Math.min(100, Math.max(10, m.score + delta));
      return {
        dimension: m.dimension,
        score: effectiveScore,
        benchmark: m.benchmark,
        description: m.description,
        fullMark: 100,
      };
    });
  }, [currentQuadrant, customScoreAdjustments]);

  // Overall Maturity Index (Average score)
  const overallMaturityIndex = useMemo(() => {
    if (!currentMaturityData.length) return 75;
    const sum = currentMaturityData.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / currentMaturityData.length);
  }, [currentMaturityData]);

  // Overlay Radar Data (all 4 quadrants together)
  const overlayRadarData = useMemo(() => {
    const dimensions = ['研发技术储备', '战略敏捷弹性', '生态掌控定价权', '合规制度穿透力', '供应链韧性冗余', '资本缓冲安全垫'];
    return dimensions.map((dim) => {
      const q1Score = quadrants[0].maturityScores?.find((m) => m.dimension === dim)?.score || 50;
      const q2Score = quadrants[1].maturityScores?.find((m) => m.dimension === dim)?.score || 50;
      const q3Score = quadrants[2].maturityScores?.find((m) => m.dimension === dim)?.score || 50;
      const q4Score = quadrants[3].maturityScores?.find((m) => m.dimension === dim)?.score || 50;
      return {
        dimension: dim,
        '象限I (范式跃迁)': q1Score,
        '象限II (围城博弈)': q2Score,
        '象限III (极寒重力)': q3Score,
        '象限IV (野生丛林)': q4Score,
        fullMark: 100,
      };
    });
  }, [quadrants]);

  // Bar Matrix Comparison Data (by Quadrant)
  const barMatrixData = useMemo(() => {
    return quadrants.map((q) => {
      const scores = q.maturityScores || [];
      const avg = Math.round(scores.reduce((a, b) => a + b.score, 0) / (scores.length || 1));
      return {
        name: `${q.id} ${q.title.split(' ')[0]}`,
        avgScore: avg,
        rd: scores.find((s) => s.dimension === '研发技术储备')?.score || 0,
        agility: scores.find((s) => s.dimension === '战略敏捷弹性')?.score || 0,
        compliance: scores.find((s) => s.dimension === '合规制度穿透力')?.score || 0,
        capital: scores.find((s) => s.dimension === '资本缓冲安全垫')?.score || 0,
        color: q.color,
      };
    });
  }, [quadrants]);

  // Flip X Axis Polarity
  const handleFlipX = () => {
    setAxisX({
      ...axisX,
      negativeLabel: axisX.positiveLabel,
      positiveLabel: axisX.negativeLabel,
      negativeDescription: axisX.positiveDescription,
      positiveDescription: axisX.negativeDescription,
    });
  };

  // Flip Y Axis Polarity
  const handleFlipY = () => {
    setAxisY({
      ...axisY,
      negativeLabel: axisY.positiveLabel,
      positiveLabel: axisY.negativeLabel,
      negativeDescription: axisY.positiveDescription,
      positiveDescription: axisY.negativeDescription,
    });
  };

  // AI Narrate Call
  const handleGenerateNarrative = async () => {
    setIsNarrativeLoading(true);
    try {
      const res = await fetch('/api/ai/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: currentQuadrant.title,
          quadrant: currentQuadrant.id,
          axisX: { name: axisX.name, state: currentQuadrant.xState === 'pos' ? axisX.positiveLabel : axisX.negativeLabel },
          axisY: { name: axisY.name, state: currentQuadrant.yState === 'pos' ? axisY.positiveLabel : axisY.negativeLabel },
          drivers: drivers.slice(0, 5).map((d) => d.name),
        }),
      });
      const data = await res.json();
      if (data.narrative) {
        setGeneratedNarratives((prev) => ({
          ...prev,
          [currentQuadrant.id]: data.narrative,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsNarrativeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Grid className="w-3.5 h-3.5" />
            <span>模块 03 · 经典 2x2 矩阵与情景变体演播</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">正交两极对立驱动的四象限世界全景演播</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            基于 Intuitive Logics（直觉逻辑法）核心八步法，将选定的两个最具张力的关键驱动力正交化，推演 4 种互斥、自洽且极具战略启发性的未来世界图景，并集成 Recharts 多维战略成熟度雷达与评分矩阵。
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={handleFlipX}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            title="翻转 X 轴正负极性"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-stone-500" />
            <span>翻转X轴极性</span>
          </button>
          <button
            onClick={handleFlipY}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            title="翻转 Y 轴正负极性"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span>翻转Y轴极性</span>
          </button>
          <button
            onClick={onOpenAiDrawer}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI 轴向正交性诊断</span>
          </button>
        </div>
      </div>

      {/* Axis Configuration Slices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Axis X Card */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              <span>横轴 (X轴) 设定：</span>
            </span>
            <span className="text-stone-400 font-mono text-[11px]">因果驱动侧</span>
          </div>
          <div className="text-sm font-semibold text-stone-800">{axisX.name}</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-stone-50 border border-stone-100">
              <span className="font-bold text-stone-600 block mb-0.5">负极 [-X]：</span>
              <span className="text-stone-700">{axisX.negativeLabel}</span>
            </div>
            <div className="p-2 rounded bg-indigo-50/50 border border-indigo-100">
              <span className="font-bold text-indigo-700 block mb-0.5">正极 [+X]：</span>
              <span className="text-indigo-800">{axisX.positiveLabel}</span>
            </div>
          </div>
        </div>

        {/* Axis Y Card */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>纵轴 (Y轴) 设定：</span>
            </span>
            <span className="text-stone-400 font-mono text-[11px]">制度/环境约束侧</span>
          </div>
          <div className="text-sm font-semibold text-stone-800">{axisY.name}</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-stone-50 border border-stone-100">
              <span className="font-bold text-stone-600 block mb-0.5">负极 [-Y]：</span>
              <span className="text-stone-700">{axisY.negativeLabel}</span>
            </div>
            <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-700 block mb-0.5">正极 [+Y]：</span>
              <span className="text-emerald-800">{axisY.positiveLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2D Matrix Studio & Quadrant Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive 2x2 Grid Viewport */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900">2x2 四象限演播沙盘 (点击切换聚焦)</h3>
              <span className="text-xs text-stone-400">聚焦象限：<strong>{currentQuadrant.id}</strong></span>
            </div>

            {/* 4 Quadrants Visual Grid */}
            <div className="relative aspect-square max-h-[440px] w-full grid grid-cols-2 grid-rows-2 gap-3 p-3 bg-stone-50/80 rounded-xl border border-stone-200">
              {/* Central Axes Lines */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-300 pointer-events-none -translate-x-1/2 z-10" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-300 pointer-events-none -translate-y-1/2 z-10" />

              {/* Axis Label Badges */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 bg-white/95 px-2.5 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-700 shadow-xs">
                ▲ {axisY.positiveLabel}
              </div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 bg-white/95 px-2.5 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-700 shadow-xs">
                ▼ {axisY.negativeLabel}
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/95 px-2.5 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-700 shadow-xs">
                {axisX.positiveLabel} ►
              </div>
              <div className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/95 px-2.5 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-700 shadow-xs">
                ◄ {axisX.negativeLabel}
              </div>

              {/* Quadrant Cells */}
              {/* Q2 (Top-Left) */}
              <div
                onClick={() => setSelectedQuadrantId('Q2')}
                className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedQuadrantId === 'Q2'
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-300'
                    : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                    <span>象限 II</span>
                    <span className="font-mono">[-X, +Y]</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{quadrants[1].title}</h4>
                  <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{quadrants[1].tagline}</p>
                </div>
                <div className="text-[9px] font-medium text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded self-start">
                  围城博弈
                </div>
              </div>

              {/* Q1 (Top-Right) */}
              <div
                onClick={() => setSelectedQuadrantId('Q1')}
                className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedQuadrantId === 'Q1'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-300'
                    : 'bg-white border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                    <span>象限 I</span>
                    <span className="font-mono">[+X, +Y]</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{quadrants[0].title}</h4>
                  <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{quadrants[0].tagline}</p>
                </div>
                <div className="text-[9px] font-medium text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded self-start">
                  黄金跃迁
                </div>
              </div>

              {/* Q3 (Bottom-Left) */}
              <div
                onClick={() => setSelectedQuadrantId('Q3')}
                className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedQuadrantId === 'Q3'
                    ? 'border-rose-500 bg-rose-50/60 shadow-md ring-2 ring-rose-300'
                    : 'bg-white border-stone-200 hover:border-rose-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-rose-800">
                    <span>象限 III</span>
                    <span className="font-mono">[-X, -Y]</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{quadrants[2].title}</h4>
                  <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{quadrants[2].tagline}</p>
                </div>
                <div className="text-[9px] font-medium text-rose-700 bg-rose-100/60 px-1.5 py-0.5 rounded self-start">
                  极寒重力
                </div>
              </div>

              {/* Q4 (Bottom-Right) */}
              <div
                onClick={() => setSelectedQuadrantId('Q4')}
                className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedQuadrantId === 'Q4'
                    ? 'border-indigo-500 bg-indigo-50/60 shadow-md ring-2 ring-indigo-300'
                    : 'bg-white border-stone-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-800">
                    <span>象限 IV</span>
                    <span className="font-mono">[+X, -Y]</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{quadrants[3].title}</h4>
                  <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{quadrants[3].tagline}</p>
                </div>
                <div className="text-[9px] font-medium text-indigo-700 bg-indigo-100/60 px-1.5 py-0.5 rounded self-start">
                  野生丛林
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-400 flex items-center justify-between">
            <span>正交原则：两轴因果独立，不成立“好中好 vs 坏中坏”低级偏见</span>
            <span className="text-emerald-700 font-medium">4 个异构世界观</span>
          </div>
        </div>

        {/* Quadrant In-depth Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
            {/* Header of Inspector */}
            <div className="border-b border-stone-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">
                  当前象限：{currentQuadrant.id} ({currentQuadrant.subTitle})
                </span>
                <button
                  onClick={handleGenerateNarrative}
                  disabled={isNarrativeLoading}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isNarrativeLoading ? 'AI 撰写中...' : 'AI 扩写宏观叙事'}</span>
                </button>
              </div>

              <h3 className="text-lg font-bold text-stone-900 mt-1">{currentQuadrant.title}</h3>
              <p className="text-xs text-stone-600 italic mt-0.5">{currentQuadrant.tagline}</p>
            </div>

            {/* Narrative Overview */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs leading-relaxed text-stone-700">
              <span className="font-bold text-stone-900 block mb-1">世界观全景叙事：</span>
              {currentQuadrant.worldNarrative}
            </div>

            {/* AI Generated Expansion (if available) */}
            {generatedNarratives[currentQuadrant.id] && (
              <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs leading-relaxed text-stone-800 space-y-2">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>AI 壳牌风深度叙事纪要：</span>
                </div>
                <div className="whitespace-pre-line text-stone-700">
                  {generatedNarratives[currentQuadrant.id]}
                </div>
              </div>
            )}

            {/* Winners & Losers Profiling Slices */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                <span className="font-bold text-emerald-950 flex items-center space-x-1 mb-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>生态跃迁赢家：</span>
                </span>
                <ul className="space-y-1 text-emerald-800">
                  {currentQuadrant.winners.map((w, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-500">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60">
                <span className="font-bold text-rose-950 flex items-center space-x-1 mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-600" />
                  <span>承压淘汰者：</span>
                </span>
                <ul className="space-y-1 text-rose-800">
                  {currentQuadrant.losers.map((l, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-rose-500">•</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Early Warning Signals */}
            <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/70 text-xs">
              <span className="font-bold text-amber-950 flex items-center space-x-1 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>先行客观预警指标 (Early Warning Signals, EWS)：</span>
              </span>
              <ul className="space-y-1 text-amber-800">
                {currentQuadrant.earlyWarningSignals.map((ews, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="font-mono font-bold text-amber-600">[{idx + 1}]</span>
                    <span>{ews}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Imperatives */}
            <div className="p-3.5 rounded-xl bg-stone-900 text-stone-100 text-xs space-y-1.5">
              <span className="font-bold text-stone-200 block">该情景下的战略应对底牌 (Strategic Imperatives)：</span>
              <ul className="space-y-1 text-stone-300">
                {currentQuadrant.strategicImperatives.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">✔</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Recharts Strategic Maturity Visualization Lab */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
        {/* Section Header with View Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <RadarIcon className="w-3.5 h-3.5" />
              <span>情景叙事结构化度量 · 战略成熟度可视化实验室 (Recharts)</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mt-1">
              各情景下的六维能力成熟度模型与跨世界观压力对比
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              将定性情景叙事转化为六维战略成熟度指标（研发储备、敏捷弹性、生态定价权、合规穿透力、供应链冗余、资本缓冲），以雷达图和评分矩阵量化呈现。
            </p>
          </div>

          {/* View Slices */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setChartView('focused_radar')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                chartView === 'focused_radar'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <RadarIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>当前象限单模雷达</span>
            </button>
            <button
              onClick={() => setChartView('overlay_radar')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                chartView === 'overlay_radar'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>四象限全景叠加雷达</span>
            </button>
            <button
              onClick={() => setChartView('bar_matrix')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                chartView === 'bar_matrix'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>能力矩阵柱状对比</span>
            </button>
          </div>
        </div>

        {/* View Content 1: Focused Quadrant Radar Chart & Gap Analysis */}
        {chartView === 'focused_radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Radar Viewport */}
            <div className="lg:col-span-7 bg-stone-50/60 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-bold text-stone-800">
                  【{currentQuadrant.id} {currentQuadrant.title.split(' ')[0]}】战略成熟度雷达 (0 ~ 100)
                </span>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    <span>该情景所需成熟度</span>
                  </span>
                  <span className="flex items-center space-x-1 text-stone-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block" />
                    <span>行业基准线</span>
                  </span>
                </div>
              </div>

              <div className="w-full h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={currentMaturityData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 9 }} />
                    <Radar
                      name="该情景所需成熟度"
                      dataKey="score"
                      stroke={currentQuadrant.color}
                      fill={currentQuadrant.color}
                      fillOpacity={0.35}
                    />
                    <Radar
                      name="行业基准线"
                      dataKey="benchmark"
                      stroke="#9ca3af"
                      fill="#9ca3af"
                      fillOpacity={0.15}
                      strokeDasharray="4 4"
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#e4e4e7' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-stone-400 text-center mt-1">
                数据源：基于情景因果链与要素张力解构生成的六维战略能力矩阵
              </div>
            </div>

            {/* Gap Analysis & Maturity Scorecard */}
            <div className="lg:col-span-5 space-y-4">
              {/* Scorecard Header */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">综合战略成熟度指数 (SMI)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    overallMaturityIndex >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : overallMaturityIndex >= 70
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {overallMaturityIndex >= 80 ? '卓越高韧性 (Tier A)' : overallMaturityIndex >= 70 ? '适应性良好 (Tier B)' : '极度承压 (Tier C)'}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-stone-900 font-mono">{overallMaturityIndex}</span>
                  <span className="text-xs text-stone-400">/ 100 分</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  在「{currentQuadrant.title.split(' ')[0]}」情景下，组织需具备不对称的核心能力倾斜，以应对该世界观的主导矛盾。
                </p>
              </div>

              {/* Dimension Metrics List */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {currentMaturityData.map((item, idx) => {
                  const isAdvantage = item.score >= item.benchmark + 15;
                  const isRisk = item.score < 50;

                  return (
                    <div key={idx} className="p-2.5 rounded-lg border border-stone-200 bg-stone-50/50 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800">{item.dimension}</span>
                        <div className="flex items-center space-x-2 font-mono">
                          <span className="font-bold text-stone-900">{item.score}分</span>
                          <span className="text-[10px] text-stone-400">(基准:{item.benchmark})</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500">{item.description}</p>
                      {isAdvantage && (
                        <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          ★ 战略护城河支撑点
                        </span>
                      )}
                      {isRisk && (
                        <span className="inline-block text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          ⚠ 结构性脆弱薄弱环
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* View Content 2: Multi-Quadrant Overlay Radar */}
        {chartView === 'overlay_radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-stone-50/60 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-bold text-stone-800">
                  四象限战略成熟度全景重叠雷达 (Multi-Scenario Capability Footprint)
                </span>
                <span className="text-[11px] text-stone-500">对比 4 种世界观下的能力重心偏转</span>
              </div>

              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={overlayRadarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 9 }} />
                    <Radar
                      name="象限I (范式跃迁)"
                      dataKey="象限I (范式跃迁)"
                      stroke="#059669"
                      fill="#059669"
                      fillOpacity={0.18}
                    />
                    <Radar
                      name="象限II (围城博弈)"
                      dataKey="象限II (围城博弈)"
                      stroke="#d97706"
                      fill="#d97706"
                      fillOpacity={0.18}
                    />
                    <Radar
                      name="象限III (极寒重力)"
                      dataKey="象限III (极寒重力)"
                      stroke="#dc2626"
                      fill="#dc2626"
                      fillOpacity={0.18}
                    />
                    <Radar
                      name="象限IV (野生丛林)"
                      dataKey="象限IV (野生丛林)"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.18}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insight Column */}
            <div className="lg:col-span-4 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
                <span className="font-bold text-stone-900 block flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                  <span>雷达图重叠解读启示：</span>
                </span>
                <p className="text-stone-600 leading-relaxed">
                  观察四象限雷达的多边形重叠区域——**没有任何一个象限的足迹能够完全包裹其他象限**！这在数学上证明了：
                </p>
                <ul className="space-y-1.5 text-stone-700">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>象限 I 重点</strong>：拉满研发与生态定价权；</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong>象限 II 重点</strong>：偏向制度合规与本土供应链冗余；</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span><strong>象限 III 重点</strong>：极致资本安全垫与现金流防御；</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>象限 IV 重点</strong>：追求敏捷响应与草莽野蛮突破。</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-[11px] leading-relaxed italic">
                “企业战略的鲁棒性，不是在所有象限均做顶格配置，而是构建模块化期权，使组织能以最低沉没成本在多边形之间快速位移。”
              </div>
            </div>
          </div>
        )}

        {/* View Content 3: Comparative Bar Matrix */}
        {chartView === 'bar_matrix' && (
          <div className="space-y-4">
            <div className="bg-stone-50/60 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-xs font-bold text-stone-800">
                  四象限战略成熟度核心能力横向对比柱状图 (Strategic Readiness by Dimension)
                </span>
                <span className="text-[11px] text-stone-400">满分 100</span>
              </div>

              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barMatrixData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="rd" name="研发技术储备" fill="#059669" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="agility" name="战略敏捷弹性" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="compliance" name="合规制度穿透力" fill="#d97706" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="capital" name="资本缓冲安全垫" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-bold">象限情景世界</th>
                    <th className="p-3 font-bold text-center">综合成熟度均分</th>
                    <th className="p-3 font-bold text-center">研发储备</th>
                    <th className="p-3 font-bold text-center">敏捷弹性</th>
                    <th className="p-3 font-bold text-center">合规穿透力</th>
                    <th className="p-3 font-bold text-center">资本安全垫</th>
                    <th className="p-3 font-bold">组织战略成熟度评估结论</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {barMatrixData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900 flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </td>
                      <td className="p-3 text-center font-mono font-black text-stone-900 text-sm">
                        {item.avgScore}分
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-700">{item.rd}</td>
                      <td className="p-3 text-center font-mono font-bold text-indigo-700">{item.agility}</td>
                      <td className="p-3 text-center font-mono font-bold text-amber-700">{item.compliance}</td>
                      <td className="p-3 text-center font-mono font-bold text-rose-700">{item.capital}</td>
                      <td className="p-3 text-stone-600 text-[11px]">
                        {idx === 0 && '创新领航型：重在突破性成果转化与全球标准锁定'}
                        {idx === 1 && '阵营守成型：需极高合规壁垒与本土化供应链冗余护体'}
                        {idx === 2 && '极限冬眠型：保留超量流动性现金，静候周期拐点'}
                        {idx === 3 && '轻骑突围型：以快打慢抢占生态位，但防范次生法律风险'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
