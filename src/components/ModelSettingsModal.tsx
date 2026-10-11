import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sparkles,
  Check,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Github,
  X,
  Cpu,
} from 'lucide-react';

export type SupportedModel = 'gemini 3 flash' | 'deepseek-v4-pro';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: SupportedModel;
  setSelectedModel: (model: SupportedModel) => void;
  onConfirmModel: (model: SupportedModel, geminiKey: string, deepseekKey: string) => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  setSelectedModel,
  onConfirmModel,
}) => {
  const [tempModel, setTempModel] = useState<SupportedModel>(selectedModel);
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [deepseekKey, setDeepseekKey] = useState<string>('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showDeepseekKey, setShowDeepseekKey] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load persisted keys on open
  useEffect(() => {
    if (isOpen) {
      setTempModel(selectedModel);
      const storedGemini = localStorage.getItem('scenario_lab_gemini_key') || '';
      const storedDeepseek = localStorage.getItem('scenario_lab_deepseek_key') || '';
      setGeminiKey(storedGemini);
      setDeepseekKey(storedDeepseek);
      setValidationError(null);
    }
  }, [isOpen, selectedModel]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const activeKey = tempModel === 'gemini 3 flash' ? geminiKey.trim() : deepseekKey.trim();

    if (!activeKey) {
      setValidationError(`项目部署到 GitHub 浏览器调用规范：当前选择的「${tempModel}」必须先手工输入 API-Key 后方可确认与调用！`);
      return;
    }

    // Persist to local storage for GitHub browser execution
    localStorage.setItem('scenario_lab_model', tempModel);
    localStorage.setItem('scenario_lab_gemini_key', geminiKey.trim());
    localStorage.setItem('scenario_lab_deepseek_key', deepseekKey.trim());

    setSelectedModel(tempModel);
    onConfirmModel(tempModel, geminiKey.trim(), deepseekKey.trim());
    setSavedNotification(true);
    setValidationError(null);

    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
              <Settings className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">战略大模型与 API-Key 密钥配置</h3>
              <p className="text-[11px] text-stone-400">Model Selection & Browser API-Key Specification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GitHub Deployment & Browser Call Requirement Notice */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-amber-900">
            <Github className="w-3.5 h-3.5 text-stone-800" />
            <span>项目 GitHub 部署与浏览器调用规范要求</span>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-relaxed">
            本项目部署到 GitHub 上供纯浏览器调用使用。为防止私有密钥泄漏，系统<strong>不在前端代码中硬编码任何 API-Key</strong>。<strong>所有大模型调用必须在下方手工输入 API-Key 后才能发起调用</strong>。密钥仅存储在您本机的浏览器本地缓存中，保障资产安全。
          </p>
        </div>

        {/* 1. Model Selection (gemini 3 flash vs deepseek-v4-pro) */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>选择调用的大模型 (Select Active Model)：</span>
            <span className="text-[10px] text-stone-400 font-normal">支持双模型切换</span>
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Option 1: gemini 3 flash */}
            <div
              onClick={() => {
                setTempModel('gemini 3 flash');
                setValidationError(null);
              }}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                tempModel === 'gemini 3 flash'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="w-4 h-4 rounded-full border border-stone-300 mt-0.5 flex items-center justify-center bg-white shrink-0">
                {tempModel === 'gemini 3 flash' && (
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </div>
              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
                    <span>gemini 3 flash</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-normal">
                      gemini-3.8-flash
                    </span>
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700">推荐战略叙事</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Google 官方主力低延迟模型，擅长多维宏观扫描、壳牌叙事扩写、轴向正交性检查与先行预警指标设计。
                </p>
              </div>
            </div>

            {/* Option 2: deepseek-v4-pro */}
            <div
              onClick={() => {
                setTempModel('deepseek-v4-pro');
                setValidationError(null);
              }}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                tempModel === 'deepseek-v4-pro'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600/30 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="w-4 h-4 rounded-full border border-stone-300 mt-0.5 flex items-center justify-center bg-white shrink-0">
                {tempModel === 'deepseek-v4-pro' && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </div>
              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
                    <span>deepseek-v4-pro</span>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded font-normal">
                      DeepSeek V4 Pro
                    </span>
                  </span>
                  <span className="text-[10px] font-medium text-indigo-700">深度逻辑推理</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  专注于数理链条与严格因果推演，擅长 CIB 矩阵平衡一致性排查、逻辑矛盾剔除与纳什稳态审计。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Manual API-Key Input Fields */}
        <div className="space-y-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
          <label className="block text-xs font-bold text-stone-800 flex items-center space-x-1.5">
            <KeyRound className="w-3.5 h-3.5 text-stone-600" />
            <span>手工输入 API-Key (Manual API-Key Input)：</span>
          </label>

          {/* Gemini API Key Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-stone-700">
                Google Gemini API Key {tempModel === 'gemini 3 flash' && <span className="text-emerald-600 font-bold">(当前调用需要)</span>}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {geminiKey ? '✔ 已配置' : '未输入'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  setValidationError(null);
                }}
                placeholder="请输入 Gemini API Key (例如：AIzaSy...)"
                className="w-full text-xs font-mono px-3 py-2 pr-9 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* DeepSeek API Key Field */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-stone-700">
                DeepSeek API Key {tempModel === 'deepseek-v4-pro' && <span className="text-indigo-600 font-bold">(当前调用需要)</span>}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {deepseekKey ? '✔ 已配置' : '未输入'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showDeepseekKey ? 'text' : 'password'}
                value={deepseekKey}
                onChange={(e) => {
                  setDeepseekKey(e.target.value);
                  setValidationError(null);
                }}
                placeholder="请输入 DeepSeek API Key (例如：sk-...)"
                className="w-full text-xs font-mono px-3 py-2 pr-9 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowDeepseekKey(!showDeepseekKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showDeepseekKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="text-[11px] text-stone-400">
            选定大模型：<strong className="text-stone-800">{tempModel}</strong>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
            >
              {savedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已确认并生效！</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>确认大模型并保存 API-Key</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
