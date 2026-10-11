import React, { useState, useMemo } from 'react';
import { DriverFactor, PestelCategory, AxisDefinition } from '../types/scenario';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Sparkles,
  Info,
  Maximize2,
  Layers,
  Compass,
} from 'lucide-react';

interface PestelScannerProps {
  drivers: DriverFactor[];
  setDrivers: React.Dispatch<React.SetStateAction<DriverFactor[]>>;
  axisX: AxisDefinition;
  setAxisX: (axis: AxisDefinition) => void;
  axisY: AxisDefinition;
  setAxisY: (axis: AxisDefinition) => void;
  onNavigateToMatrix: () => void;
}

const CATEGORY_COLORS: Record<PestelCategory, { bg: string; text: string; border: string; dotColor: string }> = {
  P: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dotColor: '#e11d48' },
  E: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dotColor: '#d97706' },
  S: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dotColor: '#2563eb' },
  T: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dotColor: '#9333ea' },
  En: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dotColor: '#059669' },
  L: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300', dotColor: '#52525b' },
};

export const PestelScannerModule: React.FC<PestelScannerProps> = ({
  drivers,
  setDrivers,
  axisX,
  setAxisX,
  axisY,
  setAxisY,
  onNavigateToMatrix,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [quadrantFilter, setQuadrantFilter] = useState<'ALL' | 'DUAL_HIGH' | 'GRAVITY' | 'SECONDARY' | 'NOISE'>('ALL');
  const [editingDriver, setEditingDriver] = useState<DriverFactor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Smart Dispersal & Anti-Collision Settings
  const [enableSmartDispersal, setEnableSmartDispersal] = useState(true);
  const [dispersalIntensity, setDispersalIntensity] = useState(1.4); // Enhanced spread multiplier
  const [showPointLabels, setShowPointLabels] = useState(true); // Direct clean factor name tags
  const [hoveredDriverId, setHoveredDriverId] = useState<string | null>(null);

  // New Driver Form State
  const [newDriver, setNewDriver] = useState<Partial<DriverFactor>>({
    name: '',
    category: 'T',
    impact: 8.0,
    uncertainty: 8.0,
    description: '',
    currentStatus: '',
    sourceOrTrend: '',
  });

  // Filtered by category and quadrant lens
  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchCat = selectedCategory === 'ALL' || d.category === selectedCategory;
      if (!matchCat) return false;

      if (quadrantFilter === 'DUAL_HIGH') {
        return d.impact >= 7 && d.uncertainty >= 6;
      }
      if (quadrantFilter === 'GRAVITY') {
        return d.impact >= 7 && d.uncertainty < 6;
      }
      if (quadrantFilter === 'SECONDARY') {
        return d.impact < 7 && d.uncertainty < 6;
      }
      if (quadrantFilter === 'NOISE') {
        return d.impact < 7 && d.uncertainty >= 6;
      }
      return true;
    });
  }, [drivers, selectedCategory, quadrantFilter]);

  // High Impact (>7) and High Uncertainty (>=6) = Key Axis Candidates
  const keyAxisCandidates = drivers.filter((d) => d.impact >= 7 && d.uncertainty >= 6);
  // High Impact (>7) and Low Uncertainty (<6) = Predetermined Trends (Gravity Cornerstone)
  const predeterminedTrends = drivers.filter((d) => d.impact >= 7 && d.uncertainty < 6);

  // Smart Anti-Collision Layout Calculation
  const positionedPoints = useMemo(() => {
    // 1. Initial coordinates mapped from (0..10) to percentage (8%..92%)
    let pts = drivers.map((d) => {
      // Apply center-anchored expansion if intensity > 1
      let u = d.uncertainty;
      let imp = d.impact;

      if (enableSmartDispersal) {
        // Expand outward from center (5.0, 5.0)
        u = 5.0 + (u - 5.0) * dispersalIntensity;
        imp = 5.0 + (imp - 5.0) * dispersalIntensity;
        // Clamp to 0.5 .. 9.8
        u = Math.max(0.6, Math.min(9.6, u));
        imp = Math.max(0.6, Math.min(9.6, imp));
      }

      const x = (u / 10) * 82 + 9;
      const y = 100 - ((imp / 10) * 82 + 9);

      return {
        id: d.id,
        driver: d,
        x,
        y,
      };
    });

    // 2. Multi-pass Force Relaxation to push overlapping circles apart evenly
    if (enableSmartDispersal) {
      const minDistance = Math.max(9.5, 7.5 * dispersalIntensity); // Dynamically scaled minimum separation (up to ~13%)
      const iterations = 40;

      for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[j].x - pts[i].x;
            const dy = pts[j].y - pts[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDistance && dist > 0.001) {
              const overlap = (minDistance - dist) / 2;
              const nx = dx / dist;
              const ny = dy / dist;

              // Smoothly separate points outward while staying well within frame boundaries
              pts[i].x = Math.max(8, Math.min(92, pts[i].x - nx * overlap));
              pts[i].y = Math.max(8, Math.min(92, pts[i].y - ny * overlap));
              pts[j].x = Math.max(8, Math.min(92, pts[j].x + nx * overlap));
              pts[j].y = Math.max(8, Math.min(92, pts[j].y + ny * overlap));
            }
          }
        }
      }
    }

    return pts;
  }, [drivers, enableSmartDispersal, dispersalIntensity]);

  const handleUpdateScore = (id: string, field: 'impact' | 'uncertainty', val: number) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = { ...d, [field]: val };
          updated.isKeyAxisCandidate = updated.impact >= 7 && updated.uncertainty >= 6;
          updated.predeterminedTrend = updated.impact >= 7 && updated.uncertainty < 6;
          return updated;
        }
        return d;
      })
    );
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name) return;

    const id = `driver-custom-${Date.now()}`;
    const categoryLabelMap: Record<PestelCategory, string> = {
      P: '政治 (Political)',
      E: '经济 (Economic)',
      S: '社会 (Social)',
      T: '技术 (Technological)',
      En: '环境 (Environmental)',
      L: '法律 (Legal)',
    };

    const category = (newDriver.category as PestelCategory) || 'T';
    const impact = newDriver.impact || 7;
    const uncertainty = newDriver.uncertainty || 7;

    const item: DriverFactor = {
      id,
      name: newDriver.name,
      category,
      categoryLabel: categoryLabelMap[category],
      impact,
      uncertainty,
      description: newDriver.description || '用户自建驱动力因子',
      currentStatus: newDriver.currentStatus || '持续监测演化中',
      sourceOrTrend: newDriver.sourceOrTrend || '战略工作坊识别',
      isKeyAxisCandidate: impact >= 7 && uncertainty >= 6,
      predeterminedTrend: impact >= 7 && uncertainty < 6,
    };

    setDrivers((prev) => [item, ...prev]);
    setIsAddModalOpen(false);
    setNewDriver({
      name: '',
      category: 'T',
      impact: 8.0,
      uncertainty: 8.0,
      description: '',
      currentStatus: '',
      sourceOrTrend: '',
    });
  };

  const handleSetAsAxis = (driver: DriverFactor, target: 'X' | 'Y') => {
    const axisObj: AxisDefinition = {
      id: `axis-${driver.id}`,
      name: driver.name,
      negativeLabel: `低/逆向: 滞缓收缩`,
      positiveLabel: `高/正向: 爆发渗透`,
      negativeDescription: `该驱动力处于阻滞低谷或被替代状态`,
      positiveDescription: `该驱动力以最高烈度主导外部环境变革`,
      category: driver.category,
    };

    if (target === 'X') {
      setAxisX(axisObj);
    } else {
      setAxisY(axisObj);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>模块 02 · PESTEL 驱动力扫描与不确定性筛选</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">影响程度 (Impact) vs. 不确定性 (Uncertainty) 决策筛选矩阵</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            对政治、经济、社会、技术、环境与法律六大领域开展宏观地平线扫描。集成<strong>防重叠智能力导向分散算法</strong>，将因子全景解耦为双高区候选、既定重力基石、次要惯性与战术杂音。
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>添加自定义驱动因子</span>
          </button>
        </div>
      </div>

      {/* Top Statistical Slices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-medium">总扫描驱动力库</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{drivers.length} <span className="text-xs font-normal text-stone-400">个因子</span></div>
          <p className="text-[11px] text-stone-400 mt-1">分布于全相空间 4 个象限</p>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs text-emerald-800 font-semibold flex items-center justify-between">
            <span>核心情景轴候选 (双高区)</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </span>
          <div className="text-2xl font-bold text-emerald-950 mt-1">{keyAxisCandidates.length} <span className="text-xs font-normal text-emerald-700">个候选</span></div>
          <p className="text-[11px] text-emerald-700 mt-1">影响≥7 且 不确定性≥6</p>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 shadow-sm">
          <span className="text-xs text-amber-800 font-semibold flex items-center justify-between">
            <span>既定重力基石 (Predetermined)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
          </span>
          <div className="text-2xl font-bold text-amber-950 mt-1">{predeterminedTrends.length} <span className="text-xs font-normal text-amber-700">项趋势</span></div>
          <p className="text-[11px] text-amber-700 mt-1">高影响·低不确定性硬约束</p>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-stone-600 font-medium">当前绑定 2x2 轴向</span>
            <div className="text-xs text-stone-800 font-semibold mt-1 truncate">X: {axisX.name}</div>
            <div className="text-xs text-stone-800 font-semibold truncate">Y: {axisY.name}</div>
          </div>
          <button
            onClick={onNavigateToMatrix}
            className="inline-flex items-center space-x-1 text-xs text-emerald-700 font-semibold hover:underline mt-2"
          >
            <span>前往 2x2 演播室</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive 2D Scatter Matrix & Factor Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2D Scatter Plane Visualizer */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                <span>驱动力评估空间 (Impact vs Uncertainty Matrix)</span>
              </h3>
              <span className="text-[11px] text-stone-400">已启用防重叠平滑分散，点击圆点查看详情</span>
            </div>

            {/* Smart Dispersal Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs self-start sm:self-auto bg-stone-100/90 px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={enableSmartDispersal}
                  onChange={(e) => setEnableSmartDispersal(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>防聚拢智能分散</span>
              </label>

              {enableSmartDispersal && (
                <>
                  <div className="flex items-center space-x-1 pl-2 border-l border-stone-300">
                    <span className="text-[10px] text-stone-500">离散度:</span>
                    <input
                      type="range"
                      min="1.0"
                      max="2.0"
                      step="0.05"
                      value={dispersalIntensity}
                      onChange={(e) => setDispersalIntensity(parseFloat(e.target.value))}
                      className="w-20 h-1.5 accent-emerald-600 cursor-pointer"
                      title={`分散扩展倍率: ${dispersalIntensity}x (越大点距越开阔)`}
                    />
                    <span className="text-[10px] font-mono text-emerald-700 font-bold w-7 text-right">{dispersalIntensity.toFixed(2)}x</span>
                  </div>

                  <button
                    onClick={() => setDispersalIntensity(1.55)}
                    className="px-2 py-0.5 text-[10px] bg-white border border-stone-300 text-stone-700 rounded hover:bg-stone-50 font-medium transition-colors"
                    title="一键应用黄金防重叠开阔度"
                  >
                    黄金间距
                  </button>
                </>
              )}

              <label className="flex items-center space-x-1 pl-2 border-l border-stone-300 cursor-pointer font-normal text-stone-600 text-[11px]">
                <input
                  type="checkbox"
                  checked={showPointLabels}
                  onChange={(e) => setShowPointLabels(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>因子名称</span>
              </label>
            </div>
          </div>

          {/* Quadrant Quick Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] pb-1">
            <span className="text-stone-400 font-medium mr-1">象限视窗：</span>
            {[
              { id: 'ALL', label: '全相空间 (全部15项)' },
              { id: 'DUAL_HIGH', label: '① 双高核心轴候选' },
              { id: 'GRAVITY', label: '② 既定重力基石' },
              { id: 'SECONDARY', label: '③ 次要渐进惯性' },
              { id: 'NOISE', label: '④ 战术随机杂音' },
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setQuadrantFilter(q.id as any)}
                className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                  quadrantFilter === q.id
                    ? 'bg-stone-900 text-white font-medium shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Scatter Chart Canvas (High Resolution & Clean Grids) */}
          <div className="relative w-full aspect-square max-h-[480px] bg-stone-50/90 rounded-2xl border border-stone-200 overflow-hidden p-6 sm:p-8 select-none">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-r border-b border-stone-200/60" />
              <div className="border-b border-stone-200/60" />
              <div className="border-r border-stone-200/60" />
              <div className="border-r border-stone-200/60" />
              <div className="border-r border-stone-200/60" />
              <div />
            </div>

            {/* Central Primary Quadrant Dividers */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-300 pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-300 pointer-events-none" />

            {/* Quadrant Watermark Badges */}
            <div className="absolute top-2.5 right-2.5 text-right pointer-events-none">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded shadow-2xs">
                【核心情景轴候选区】双高区
              </span>
              <p className="text-[9px] text-stone-400 mt-0.5">高影响 · 高不确定性 (Critical Uncertainties)</p>
            </div>

            <div className="absolute top-2.5 left-2.5 text-left pointer-events-none">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded shadow-2xs">
                【既定重力基石】
              </span>
              <p className="text-[9px] text-stone-400 mt-0.5">高影响 · 低不确定性 (Predetermined)</p>
            </div>

            <div className="absolute bottom-3 left-2.5 text-left pointer-events-none">
              <span className="text-[10px] font-medium text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded">
                【次要渐进惯性区】
              </span>
              <p className="text-[9px] text-stone-400 mt-0.5">低影响 · 低不确定性 (Secondary Trends)</p>
            </div>

            <div className="absolute bottom-3 right-2.5 text-right pointer-events-none">
              <span className="text-[10px] font-medium text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                【战术随机杂音区】
              </span>
              <p className="text-[9px] text-stone-400 mt-0.5">低影响 · 高不确定性 (Tactical Noise)</p>
            </div>

            {/* Axes Labels */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-bold text-stone-500 pointer-events-none">
              不确定性 (Uncertainty: 0 → 10) →
            </div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-bold text-stone-500 pointer-events-none">
              影响程度 (Impact: 0 → 10) →
            </div>

            {/* Driver Points with Anti-Collision Dispersed Coordinates */}
            {positionedPoints.map((pt) => {
              const d = pt.driver;
              // Check if visible under current filters
              const isVisible = filteredDrivers.some((fd) => fd.id === d.id);
              if (!isVisible) return null;

              const isSelected = editingDriver?.id === d.id;
              const isHovered = hoveredDriverId === d.id;
              const isAxis = axisX.name === d.name || axisY.name === d.name;
              const cStyle = CATEGORY_COLORS[d.category] || CATEGORY_COLORS.T;

              return (
                <div
                  key={d.id}
                  onClick={() => setEditingDriver(d)}
                  onMouseEnter={() => setHoveredDriverId(d.id)}
                  onMouseLeave={() => setHoveredDriverId(null)}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    isSelected || isHovered ? 'z-40 scale-125' : 'z-20 hover:scale-115'
                  }`}
                  title={`${d.name} (影响:${d.impact}, 不确定性:${d.uncertainty})`}
                >
                  {/* Point Ring with Category Label */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm transition-all border ${
                      d.isKeyAxisCandidate
                        ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-300'
                        : d.predeterminedTrend
                        ? 'bg-amber-500 text-white border-white ring-2 ring-amber-200'
                        : 'bg-white text-stone-700 border-stone-300 ring-1 ring-stone-200'
                    } ${isAxis ? 'ring-4 ring-indigo-500 shadow-indigo-300 animate-pulse' : ''}`}
                    style={{
                      backgroundColor: isSelected ? '#18181b' : undefined,
                      color: isSelected ? '#ffffff' : undefined,
                    }}
                  >
                    {d.category}
                  </div>

                  {/* Optional Permanent Mini Label Tag for Dispersed Readability */}
                  {showPointLabels && !isHovered && !isSelected && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 pointer-events-none whitespace-nowrap">
                      <span className="text-[9px] font-medium text-stone-600 bg-white/90 px-1 py-0.2 rounded border border-stone-200 shadow-2xs">
                        {d.name.length > 5 ? d.name.slice(0, 5) + '…' : d.name}
                      </span>
                    </div>
                  )}

                  {/* Clean Dynamic Tooltip Tag */}
                  {(isHovered || isSelected) && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50 bg-stone-900/95 text-white text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl border border-stone-700 pointer-events-none space-y-0.5">
                      <div className="font-bold flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cStyle.dotColor }} />
                        <span>{d.name}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        影响: <strong className="text-white">{d.impact}</strong> / 不确定性: <strong className="text-white">{d.uncertainty}</strong> [{d.categoryLabel.split(' ')[0]}]
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver List & Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Category Filter Slices */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span className="flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <span>分类切片筛选</span>
              </span>
              <span className="text-stone-400 font-normal">显示 {filteredDrivers.length} / {drivers.length}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { key: 'ALL', label: '全部' },
                { key: 'P', label: '政治 (P)' },
                { key: 'E', label: '经济 (E)' },
                { key: 'S', label: '社会 (S)' },
                { key: 'T', label: '技术 (T)' },
                { key: 'En', label: '环境 (En)' },
                { key: 'L', label: '法律 (L)' },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === c.key
                      ? 'bg-stone-900 text-white shadow-sm font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Driver List (Scrollable) */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 max-h-[460px] overflow-y-auto space-y-3">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>驱动力列表清单</span>
              <span className="text-[10px] text-stone-400 font-normal">点击任意项可联动高亮及微调</span>
            </div>
            {filteredDrivers.map((d) => {
              const isSelected = editingDriver?.id === d.id;
              const cStyle = CATEGORY_COLORS[d.category] || CATEGORY_COLORS.T;

              return (
                <div
                  key={d.id}
                  onClick={() => setEditingDriver(d)}
                  onMouseEnter={() => setHoveredDriverId(d.id)}
                  onMouseLeave={() => setHoveredDriverId(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cStyle.bg} ${cStyle.text} ${cStyle.border}`}>
                      {d.categoryLabel}
                    </span>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-mono text-stone-500">影响: <strong>{d.impact}</strong></span>
                      <span className="font-mono text-stone-500">不确定: <strong>{d.uncertainty}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDriver(d.id);
                        }}
                        className="text-stone-300 hover:text-rose-500 p-0.5"
                        title="删除该驱动力"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 leading-snug">{d.name}</h4>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{d.description}</p>

                  {/* Sliders for inline adjustment */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-stone-200/80 space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>调整影响程度 (Impact)</span>
                          <span className="font-mono font-bold text-stone-800">{d.impact}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.1"
                          value={d.impact}
                          onChange={(e) => handleUpdateScore(d.id, 'impact', parseFloat(e.target.value))}
                          className="w-full accent-emerald-600 h-1 bg-stone-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>调整不确定性 (Uncertainty)</span>
                          <span className="font-mono font-bold text-stone-800">{d.uncertainty}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.1"
                          value={d.uncertainty}
                          onChange={(e) => handleUpdateScore(d.id, 'uncertainty', parseFloat(e.target.value))}
                          className="w-full accent-emerald-600 h-1 bg-stone-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Set as 2x2 Axis Buttons */}
                      <div className="flex items-center space-x-2 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsAxis(d, 'X');
                          }}
                          className="flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                        >
                          设为 2x2 横轴 (X轴)
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsAxis(d, 'Y');
                          }}
                          className="flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                        >
                          设为 2x2 纵轴 (Y轴)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Custom Driver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">新增战略驱动力因子 (PESTEL)</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">因子名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：全球量子加密商业化成熟速度"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">所属分类</label>
                  <select
                    value={newDriver.category}
                    onChange={(e) => setNewDriver({ ...newDriver, category: e.target.value as PestelCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="P">政治 (Political)</option>
                    <option value="E">经济 (Economic)</option>
                    <option value="S">社会 (Social)</option>
                    <option value="T">技术 (Technological)</option>
                    <option value="En">环境 (Environmental)</option>
                    <option value="L">法律 (Legal)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">信息来源 / 趋势支撑</label>
                  <input
                    type="text"
                    placeholder="如：行业智库前瞻报告"
                    value={newDriver.sourceOrTrend}
                    onChange={(e) => setNewDriver({ ...newDriver, sourceOrTrend: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-700 font-medium">影响程度 (Impact)</span>
                    <span className="font-bold font-mono">{newDriver.impact}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={newDriver.impact}
                    onChange={(e) => setNewDriver({ ...newDriver, impact: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-700 font-medium">不确定性 (Uncertainty)</span>
                    <span className="font-bold font-mono">{newDriver.uncertainty}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={newDriver.uncertainty}
                    onChange={(e) => setNewDriver({ ...newDriver, uncertainty: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">详细描述与逻辑研判</label>
                <textarea
                  rows={2}
                  placeholder="该因子如何演化？可能引发怎样的结构性连锁冲击？"
                  value={newDriver.description}
                  onChange={(e) => setNewDriver({ ...newDriver, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium shadow-sm"
                >
                  确认录入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
