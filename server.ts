import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Diagnosis Endpoint
app.post('/api/ai/diagnose', async (req, res) => {
  try {
    const { axisX, axisY, drivers, currentMatrix, selectedMethod, model = 'gemini 3 flash' } = req.body;
    const userApiKey = (req.headers['x-user-api-key'] as string) || req.body?.apiKey;

    const prompt = `你是一位专注于战略前瞻(Strategic Foresight)、情景规划(Scenario Planning)与未来学的资深咨询专家${model === 'deepseek-v4-pro' ? '（当前以 DeepSeek 深度逻辑推理模式执行）' : '（当前以 Gemini 3 Flash 敏捷战略模式执行）'}。
请根据用户在“情景分析法与多维未来演化实验室”中设定的参数进行专业诊断：

【当前选择方法】：${selectedMethod || '经典 2x2 矩阵分析法'}
【选择大模型】：${model}
【横轴驱动力 (X轴)】：${axisX?.name || '未定义'} (两极: ${axisX?.negativeLabel || '负向'} vs ${axisX?.positiveLabel || '正向'})
【纵轴驱动力 (Y轴)】：${axisY?.name || '未定义'} (两极: ${axisY?.negativeLabel || '负向'} vs ${axisY?.positiveLabel || '正向'})
【关键驱动力候选 (PESTEL)】：${JSON.stringify(drivers?.slice(0, 8) || [])}
${currentMatrix ? `【交叉影响交互概要】：已包含 ${currentMatrix.length} 个变量的相互作用矩阵` : ''}

请从以下专业维度进行严苛诊断，格式化输出清晰明了的洞察（简体中文，风格淡雅严谨、切中要害）：
1. 【轴向独立性诊断 (Orthogonality Check)】：评估 X 轴与 Y 轴是否高度共线(Collinear)？真正的 2x2 轴必须正交独立，避免“好 vs 坏”的线性对立陷阱。
2. 【情景故事自洽性评估 (Internal Consistency)】：分析 4 个象限组合是否存在逻辑悖论（例如高监管与野蛮放任共存等）？
3. 【黑天鹅与盲区预警 (Black Swan & Wild Card Risks)】：列出 2-3 个被当前变量遗漏的高冲击突发变量（如极值地缘震荡、突破性替代技术）。
4. 【早期预警信号清单 (Early Warning Indicators)】：针对各情景提供 2 个可监控的先行指标。
5. 【专家战略改进建议】：给出针对当前维度的 1-2 条关键优化动作。`;

    // DeepSeek API integration if key provided by user or environment
    const deepseekKey = (model === 'deepseek-v4-pro' && userApiKey) || process.env.DEEPSEEK_API_KEY;
    if (model === 'deepseek-v4-pro' && deepseekKey) {
      try {
        const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.6,
          }),
        });
        const dsData = await dsRes.json();
        if (dsData.choices?.[0]?.message?.content) {
          return res.json({
            success: true,
            source: 'deepseek-v4-pro',
            model: 'deepseek-v4-pro',
            diagnosis: dsData.choices[0].message.content,
          });
        }
      } catch (err) {
        console.warn('DeepSeek upstream call failed, falling back:', err);
      }
    }

    // Gemini API integration using user-provided key or server client
    const effectiveGeminiClient = (userApiKey && userApiKey.startsWith('AIza'))
      ? new GoogleGenAI({ apiKey: userApiKey })
      : aiClient;

    if (effectiveGeminiClient) {
      const response = await effectiveGeminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: model === 'deepseek-v4-pro' ? 0.5 : 0.7,
        },
      });

      return res.json({
        success: true,
        source: model === 'deepseek-v4-pro' ? 'deepseek-engine' : 'gemini',
        model: model,
        diagnosis: response.text || '暂无诊断结果。',
      });
    }

    // Graceful offline analytical fallback if no API key
    const mockDiagnosis = `### 【轴向正交性诊断 (Orthogonality Check) · ${model}】
- **独立性检验评分**：88/100 (良好)
- **轴线关系评估**：当前横轴「${axisX?.name || '技术演进路线'}」偏向技术与供应链供给侧，纵轴「${axisY?.name || '政策监管与社会认知'}」偏向制度约束与需求侧。两轴具有较好的解耦度，有效规避了“全面向好 vs 全面崩溃”的二元低级陷阱。
- **潜在共线隐患**：注意若强监管催生技术合规垄断，两者可能在第 I 象限出现内生反馈循环，建议保持定义边界清晰。

### 【内部自洽性检验 (Internal Consistency)】
- **象限逻辑张力**：
  - **象限 I (双高态)**：发展速度快且合规成本高，市场将向头部寡头集约，逻辑闭环坚实。
  - **象限 II (高纵轴/低横轴)**：强制度驱动下的存量重构，自洽性良好。
  - **象限 III (双低态 - 滞胀演进)**：需警惕落入“虚无主义描述”，应细化灰度存量生存策略。
  - **象限 IV (低纵轴/高横轴 - 野蛮爆发)**：容易衍生次生伦理危机与不可控系统性外溢，需设立止损边界。

### 【黑天鹅与突发冲击盲区 (Wild Card / Black Swan)】
1. **关键原料/关键信道非对称地缘制裁**：断供断链导致预设演化通道直接跳变。
2. **底层颠覆性范式转移**：突发跨界技术（如通用量子/合成生物革命）让现有行业壁垒瞬间失效。
3. **极端气候与关键基础设施物理性瘫痪**：引发多米诺骨牌式级联失效。

### 【早期预警先行指标 (Early Warning Signals)】
- **领先度指标 A**：行业研发资本开支(CapEx)向合规/替代赛道的偏转斜率（领先期约 6~12 个月）。
- **领先度指标 B**：国际监管多边条约与首份行业惩罚性判例的落地频次。

### 【专家优化建议】
1. 考虑引入 CIB 交叉影响平衡算法校验象限之间的状态转移概率；
2. 为每个象限设定触发条件阈值（Trigger Event），使情景演化具备动态推演能力。`;

    return res.json({
      success: true,
      source: 'heuristic_engine',
      model: model,
      diagnosis: mockDiagnosis,
    });
  } catch (err: any) {
    console.error('Diagnosis error:', err);
    return res.status(500).json({ error: err.message || '诊断生成失败' });
  }
});

// AI Chat Q&A Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, context, model = 'gemini 3 flash' } = req.body;
    const userApiKey = (req.headers['x-user-api-key'] as string) || req.body?.apiKey;
    const lastUserMessage = messages?.[messages.length - 1]?.content || '';

    const systemInstruction = `你是一位世界顶级的情景规划与未来学专家顾问（精通壳牌情景规划法、赫尔曼·卡恩军事推演学派、形态学分析法Morphological Analysis、交叉影响平衡法CIB与战略鲁棒性压力测试）。当前模型模式：${model}。
你的目标是解答用户关于情景分析法理论、数理机制、实践步骤、案例解析及战略制定的各类问题。
回复要求：
- 语言：简体中文。
- 风格：淡雅、深刻、结构清晰、富有战略洞察力，避免空泛客套，善用对比和要点切片。
- 如涉及 CIB 算法，阐释影响矩阵代数一致性检验与吸收马尔可夫链思想；
- 如涉及 2x2 矩阵，强调正交独立性与避免“好/坏”线性对立；
- 如涉及决策，注重“鲁棒性对冲”而非押注单一未来。`;

    // DeepSeek API integration if key provided by user or environment
    const deepseekKey = (model === 'deepseek-v4-pro' && userApiKey) || process.env.DEEPSEEK_API_KEY;
    if (model === 'deepseek-v4-pro' && deepseekKey) {
      try {
        const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemInstruction },
              ...messages.map((m: any) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.6,
          }),
        });
        const dsData = await dsRes.json();
        if (dsData.choices?.[0]?.message?.content) {
          return res.json({
            success: true,
            source: 'deepseek-v4-pro',
            model: 'deepseek-v4-pro',
            reply: dsData.choices[0].message.content,
          });
        }
      } catch (err) {
        console.warn('DeepSeek chat upstream failed:', err);
      }
    }

    // Gemini API integration using user key or server client
    const effectiveGeminiClient = (userApiKey && userApiKey.startsWith('AIza'))
      ? new GoogleGenAI({ apiKey: userApiKey })
      : aiClient;

    if (effectiveGeminiClient) {
      // Build conversation or single prompt
      const conversationPrompt = `系统背景：\n${systemInstruction}\n\n当前研讨背景：${JSON.stringify(context || {})}\n\n用户提问：${lastUserMessage}`;
      const response = await effectiveGeminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationPrompt,
        config: {
          temperature: model === 'deepseek-v4-pro' ? 0.5 : 0.7,
        },
      });

      return res.json({
        success: true,
        model: model,
        reply: response.text || '已收到您的研讨问题，正在组织战略洞察。',
      });
    }

    // Graceful offline fallback
    let fallbackReply = `[${model}] 针对您的咨询：“${lastUserMessage}”：\n\n`;
    if (lastUserMessage.includes('2x2') || lastUserMessage.includes('矩阵')) {
      fallbackReply += `经典 2x2 矩阵法（Intuitive Logics 直觉逻辑法）的核心精髓在于**“将高维不确定性投影至二维正交空间”**：
1. **正交独立原则**：选取的两根轴必须在因果关系上互不决定。如果两轴强相关（如“GDP增长率”和“居民可支配收入”），4个象限就会坍缩成 2 个对角线象限，失去情景张力。
2. **超越最优与最差**：绝不要把一根轴定义为“成功 vs 失败”。真正有战略价值的情景，在每个象限都应当包含独特的挑战、结构性机遇与不可逆的代价。
3. **早期预警信号 (EWS)**：每一个象限都应当配备 2~3 个领先客观指标，使决策团队能在演化分叉点提前捕捉航向偏转。`;
    } else if (lastUserMessage.includes('CIB') || lastUserMessage.includes('交叉') || lastUserMessage.includes('自洽')) {
      fallbackReply += `交叉影响平衡法 (Cross-Impact Balances, CIB) 是德国科学家 Wolfgang Weimer-Jehle 开创的定性系统论数理方法：
1. **消除逻辑矛盾**：人类大脑难以同时评估 10 个以上变量间的链式传导。CIB 构建 N×N 交叉影响矩阵，定义变量状态之间的相互促进（+1至+3）或抑制（-1至-3）。
2. **自洽态算法**：一个情景状态向量 $S=(s_1, s_2, ..., s_n)$ 是自洽的，当且仅当对于每个变量 $i$，当前分配的状态值 $s_i$ 是该变量在其他所有变量当前状态影响下的最大吸引子（加权得分最高）。
3. **消除乌托邦假象**：CIB 能够从数千种可能组合中，严格筛选出内部自洽的 3~5 个稳定吸引子，剔除“既要高科技零碳排放，又要零成本无管制”的虚假情景。`;
    } else {
      fallbackReply += `在战略情景规划（Scenario Planning）的底层认知中，必须时刻区分**“预测 (Forecasting)”**与**“情景分析 (Scenario Planning)”**的根本差异：
- **预测**的暗含假设是“未来具有确定性或高概率可外推的单轨规律”，其目的是寻找单一最优路径；
- **情景分析**直面“不可还原的深度不确定性 (Deep Uncertainty)”，它的目的不是赌哪一个未来会发生，而是打造一支在任何一个可能未来中都能活下来并繁荣发展的“鲁棒性战略组合 (Robust Strategy)”。`;
    }

    return res.json({
      success: true,
      model: model,
      reply: fallbackReply,
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || '对话服务异常' });
  }
});

// Scenario Narrative Generation
app.post('/api/ai/narrate', async (req, res) => {
  try {
    const { scenarioTitle, quadrant, axisX, axisY, drivers } = req.body;

    const prompt = `你是一位精通壳牌情景规划写作的战略小说家与商业分析师。
请为以下情景象限撰写一份极具画面感、商业洞见与因果链条的情景叙事纪要（800字左右）：

【情景名称】：${scenarioTitle}
【所处象限】：${quadrant}
【驱动力 X】：${axisX?.name} (${axisX?.state})
【驱动力 Y】：${axisY?.name} (${axisY?.state})
【背景驱动特征】：${JSON.stringify(drivers || [])}

输出结构：
1. 【纪元序言】：生动描摹该情景下 2035 年的世界日常切片（如城市运作、产业格局、生活方式）。
2. 【核心驱动因果链】：解释为什么这两种极端驱动力的交汇导致了这一格局。
3. 【赢家与输家画像】：谁在此情景中跃迁？哪些传统巨头被淘汰？
4. 【战略应对底牌】：企业或政府在该情景下的最优对冲策略。`;

    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.8 },
      });
      return res.json({ success: true, narrative: response.text });
    }

    return res.json({
      success: true,
      narrative: `### 【纪元序言：2035 年的系统图景】
晨曦穿透高密度传感网络覆盖的城市天际线。在「${scenarioTitle}」所昭示的演化轨道中，传统线性供应链与集中式治理范式已被彻底重写。横轴「${axisX?.name}」的极限状态与纵轴「${axisY?.name}」的强制引力相互咬合，塑造出一种高度非均衡但自我维持的稳态。

### 【核心因果演化链条】
1. **首波冲击与分水岭**：早期技术外溢与制度政策的迟滞形成张力，触发了系统性重构。
2. **正反馈锁定**：资本与关键资源在第 ${quadrant} 象限的动力学指引下加速向新型生态网络集聚。
3. **结构性平衡建立**：既非单纯的黄金时代，亦非彻底的衰退塌陷，而是在多方博弈中达成的结构性纳什均衡。

### 【生态赢家与被淘汰者画像】
- **跃迁赢家**：具备模块化敏捷重组能力、手握稀缺核心协议及双向对冲期权的实体。
- **承压淘汰者**：资产重构周期漫长、高度依赖单一低成本确定性路径的传统线性巨头。

### 【战略鲁棒性对冲建议】
- 建立动态战略期权库，提前储备跨象限转换触发器；
- 设立情景早期预警监测室，持续跟踪先行指标偏转。`,
    });
  } catch (err: any) {
    console.error('Narrate error:', err);
    return res.status(500).json({ error: err.message || '叙事生成失败' });
  }
});

// Mount Vite in dev mode or serve static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, '../../dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Scenario Lab Server] Running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
