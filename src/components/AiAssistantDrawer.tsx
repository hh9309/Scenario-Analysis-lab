import React, { useState, useRef, useEffect } from 'react';
import { AxisDefinition, DriverFactor } from '../types/scenario';
import {
  BotMessageSquare,
  Sparkles,
  Send,
  X,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  CheckCircle2,
  RefreshCw,
  Settings,
  Cpu,
} from 'lucide-react';
import { SupportedModel, ModelSettingsModal } from './ModelSettingsModal';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  axisX: AxisDefinition;
  axisY: AxisDefinition;
  drivers: DriverFactor[];
  selectedModel: SupportedModel;
  setSelectedModel: (model: SupportedModel) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  axisX,
  axisY,
  drivers,
  selectedModel,
  setSelectedModel,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `您好！我是您的**战略前瞻与情景规划 AI 随诊顾问**。\n\n当前已载入大模型引擎：**${selectedModel}**。\n我能实时诊断您的 2x2 轴向是否正交独立、是否存在“好/坏”线性塌缩、情景自洽性以及黑天鹅风险盲区。您可以随时向我提问关于情景分析法、CIB 算法或企业战略对冲的任何问题。`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Trigger Instant Axis & Scenario Diagnosis
  const handleRunDiagnosis = async () => {
    // Verification per requirement: all model calls require entering API-Key first for GitHub deployment
    const storedGemini = localStorage.getItem('scenario_lab_gemini_key') || '';
    const storedDeepseek = localStorage.getItem('scenario_lab_deepseek_key') || '';
    const activeApiKey = selectedModel === 'gemini 3 flash' ? storedGemini.trim() : storedDeepseek.trim();

    if (!activeApiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: '请对当前实验室的轴向配置开展战略体检。',
        },
        {
          role: 'assistant',
          content: `⚠️ **【调用受限 · 必须先手工输入 API-Key】**\n\n项目部署至 GitHub 浏览器调用规范：当前生效模型为 **${selectedModel}**，所有大模型调用必须输入有效 API-Key 后才能发起调用！\n\n请点击右上角**小齿轮设置图标** ⚙️，在弹出框中手工输入并确认您的 API-Key。`,
        },
      ]);
      setIsSettingsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: `请对当前实验室的轴向配置开展战略体检 [引擎: ${selectedModel}]：\n横轴：${axisX.name}\n纵轴：${axisY.name}\n包含 ${drivers.length} 个 PESTEL 驱动力因子。`,
      },
    ]);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-api-key': activeApiKey,
        },
        body: JSON.stringify({
          axisX,
          axisY,
          drivers: drivers.slice(0, 10),
          selectedMethod: '经典 2x2 矩阵与 CIB 自洽检验',
          model: selectedModel,
          apiKey: activeApiKey,
        }),
      });

      const data = await res.json();
      if (data.diagnosis) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.diagnosis },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `诊断返回提示：${data.error}` },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `诊断请求出现异常：${err.message || '请检查服务器连接'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Verification per requirement: all model calls require entering API-Key first for GitHub deployment
    const storedGemini = localStorage.getItem('scenario_lab_gemini_key') || '';
    const storedDeepseek = localStorage.getItem('scenario_lab_deepseek_key') || '';
    const activeApiKey = selectedModel === 'gemini 3 flash' ? storedGemini.trim() : storedDeepseek.trim();

    const userText = input.trim();
    setInput('');

    if (!activeApiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userText },
        {
          role: 'assistant',
          content: `⚠️ **【调用受限 · 必须先手工输入 API-Key】**\n\n项目部署至 GitHub 浏览器调用规范：当前生效模型为 **${selectedModel}**，所有大模型调用必须输入有效 API-Key 后才能发起调用！\n\n请点击右上角**小齿轮设置图标** ⚙️，手工输入并确认您的 API-Key。`,
        },
      ]);
      setIsSettingsModalOpen(true);
      return;
    }

    const newMsgList: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMsgList);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-api-key': activeApiKey,
        },
        body: JSON.stringify({
          messages: newMsgList,
          model: selectedModel,
          apiKey: activeApiKey,
          context: {
            axisX: axisX.name,
            axisY: axisY.name,
            driversCount: drivers.length,
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `顾问服务提示：${data.error}` },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `顾问服务暂时不可用：${err.message || '请稍后再试'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-stone-200 shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-stone-900 text-sm">AI 战略诊断与 Q&A 随诊室</h3>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px]">
                <span className="text-emerald-700 font-medium font-mono">[{selectedModel}]</span>
                <span className="text-stone-400">· 全栈代理守护</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Gear Icon to Open Model Settings */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
              title="设置大模型与 API 配置"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg"
              title="关闭随诊面板"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="px-4 py-2 bg-stone-100/60 border-b border-stone-200/80 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <button
            onClick={handleRunDiagnosis}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-700 font-semibold hover:border-emerald-400 hover:text-emerald-700 whitespace-nowrap shadow-2xs"
          >
            ⚡ 一键发起轴向正交性全面体检
          </button>
          <button
            onClick={() => {
              setInput('请为我解释为什么 2x2 矩阵绝不能出现好 vs 坏的线性轴？');
            }}
            className="px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-600 hover:text-stone-900 whitespace-nowrap shadow-2xs"
          >
            正交原则释义
          </button>
          <button
            onClick={() => {
              setInput('如何为情景设计具有先行指引力的早期预警指标 (Early Warning Signals)？');
            }}
            className="px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-600 hover:text-stone-900 whitespace-nowrap shadow-2xs"
          >
            预警指标设计
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';

            return (
              <div
                key={idx}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                    isUser
                      ? 'bg-stone-900 text-stone-100 rounded-br-xs'
                      : 'bg-stone-100 text-stone-800 rounded-bl-xs border border-stone-200/60'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 bg-stone-100 text-stone-500 rounded-2xl rounded-bl-xs text-xs animate-pulse flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>[{selectedModel}] 顾问专家正在深入推演与形式化诊断...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 bg-white flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`向顾问咨询 (${selectedModel})...`}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Model Settings Modal */}
      <ModelSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onConfirmModel={(newModel, gemKey, dsKey) => {
          const keyLabel = newModel === 'gemini 3 flash' ? (gemKey ? '已配置密钥' : '未配置') : (dsKey ? '已配置密钥' : '未配置');
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `大模型已切换并确认生效：**${newModel}** [${keyLabel}]。所有随诊诊断与 Q&A 将以此模型为引擎执行。` },
          ]);
        }}
      />
    </>
  );
};
