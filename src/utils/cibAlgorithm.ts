import { CibVariable, CibImpact, CibConfiguration } from '../types/scenario';

export interface CibAnalysisResult {
  allConfigurations: CibConfiguration[];
  consistentConfigurations: CibConfiguration[];
  impactMatrixSummary: {
    source: string;
    target: string;
    weight: number;
  }[];
}

/**
 * Computes all state combinations and checks for self-consistency using the CIB algorithm
 */
export function runCibAlgorithm(
  variables: CibVariable[],
  impacts: CibImpact[]
): CibAnalysisResult {
  const n = variables.length;
  // If variables length is <= 6, compute all 2^N combinations
  const totalCombinations = Math.pow(2, n);
  const configs: CibConfiguration[] = [];

  for (let c = 0; c < totalCombinations; c++) {
    const stateAssignments: Record<string, string> = {};
    for (let i = 0; i < n; i++) {
      const bit = (c >> i) & 1;
      const v = variables[i];
      stateAssignments[v.id] = v.states[bit].id;
    }

    // Now evaluate consistency for this configuration
    let isConsistent = true;
    let totalScore = 0;
    const contradictions: string[] = [];

    for (let i = 0; i < n; i++) {
      const targetVar = variables[i];
      const assignedStateId = stateAssignments[targetVar.id];

      // Calculate score for each state of targetVar
      const stateScores: Record<string, number> = {};
      for (const st of targetVar.states) {
        stateScores[st.id] = 0;
      }

      // Sum impacts from other variables in their current assigned state
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const srcVar = variables[j];
        const srcAssignedState = stateAssignments[srcVar.id];

        for (const targetState of targetVar.states) {
          const match = impacts.find(
            (imp) =>
              imp.sourceVarId === srcVar.id &&
              imp.sourceStateId === srcAssignedState &&
              imp.targetVarId === targetVar.id &&
              imp.targetStateId === targetState.id
          );
          if (match) {
            stateScores[targetState.id] += match.weight;
          }
        }
      }

      // Check max score
      let maxScore = -Infinity;
      let bestStateId = '';
      for (const [stId, sc] of Object.entries(stateScores)) {
        if (sc > maxScore) {
          maxScore = sc;
          bestStateId = stId;
        }
      }

      const currentScore = stateScores[assignedStateId] || 0;
      totalScore += currentScore;

      // If current score is strictly less than maxScore, it is contradictory
      if (currentScore < maxScore) {
        isConsistent = false;
        const targetStateName = targetVar.states.find((s) => s.id === assignedStateId)?.label || assignedStateId;
        const bestStateName = targetVar.states.find((s) => s.id === bestStateId)?.label || bestStateId;
        contradictions.push(
          `变量【${targetVar.name}】设定为「${targetStateName}」(得分${currentScore})，但系统动力学倾向于「${bestStateName}」(得分${maxScore})`
        );
      }
    }

    configs.push({
      id: `cfg-${c}`,
      stateAssignments,
      isConsistent,
      totalScore,
      unresolvedContradictions: contradictions,
    });
  }

  const consistentConfigurations = configs.filter((c) => c.isConsistent);

  const impactMatrixSummary = impacts.map((imp) => {
    const src = variables.find((v) => v.id === imp.sourceVarId)?.name || imp.sourceVarId;
    const tgt = variables.find((v) => v.id === imp.targetVarId)?.name || imp.targetVarId;
    return {
      source: src,
      target: tgt,
      weight: imp.weight,
    };
  });

  return {
    allConfigurations: configs,
    consistentConfigurations,
    impactMatrixSummary,
  };
}

/**
 * Generate Python NetworkX & NumPy source code for Cross-Impact Balances
 */
export function generatePythonCibScript(variables: CibVariable[], impacts: CibImpact[]): string {
  const varsJson = JSON.stringify(
    variables.map((v) => ({
      id: v.id,
      name: v.name,
      states: v.states.map((s) => ({ id: s.id, label: s.label })),
    })),
    null,
    2
  );

  const impactsJson = JSON.stringify(impacts, null, 2);

  return `#!/usr/bin/env python3
"""
情景分析法与多维未来演化实验室 (Scenario Analysis & Future Evolution Lab)
交叉影响平衡算法 (Cross-Impact Balances, CIB) 与 NetworkX 网络拓扑仿真引擎
Author: Scenario Lab Engine (Based on Wolfgang Weimer-Jehle CIB Theory)
"""

import itertools
import networkx as nx
import numpy as np
import matplotlib.pyplot as plt

# 1. 变量与离散状态定义
VARIABLES = ${varsJson}

# 2. 交叉影响矩阵数据 (权重范围: -3 到 +3)
IMPACTS = ${impactsJson}

class CrossImpactBalances:
    def __init__(self, variables, impacts):
        self.variables = variables
        self.impacts = impacts
        self.var_map = {v['id']: v for v in variables}
        self.n = len(variables)
        
    def get_impact_weight(self, src_id, src_state, tgt_id, tgt_state):
        for imp in self.impacts:
            if (imp['sourceVarId'] == src_id and 
                imp['sourceStateId'] == src_state and 
                imp['targetVarId'] == tgt_id and 
                imp['targetStateId'] == tgt_state):
                return imp['weight']
        return 0

    def evaluate_configuration(self, config):
        """
        验证一个给定状态组合是否为自洽吸引子 (Self-Consistent Attractor)
        """
        is_consistent = True
        contradictions = []
        total_balance_score = 0
        
        for i, tgt_var in enumerate(self.variables):
            tgt_id = tgt_var['id']
            assigned_state = config[tgt_id]
            
            # 计算各候选状态的总吸收分
            scores = {}
            for st in tgt_var['states']:
                st_id = st['id']
                score = 0
                for src_id, src_state in config.items():
                    if src_id == tgt_id:
                        continue
                    score += self.get_impact_weight(src_id, src_state, tgt_id, st_id)
                scores[st_id] = score
                
            max_score = max(scores.values())
            current_score = scores[assigned_state]
            total_balance_score += current_score
            
            # 若当前设定状态的得分未达最大值，存在动力学排斥矛盾
            if current_score < max_score:
                is_consistent = False
                contradictions.append({
                    'var': tgt_var['name'],
                    'current': assigned_state,
                    'preferred': [k for k, v in scores.items() if v == max_score],
                    'gap': max_score - current_score
                })
                
        return is_consistent, total_balance_score, contradictions

    def solve_attractors(self):
        """遍历全状态空间，寻找纳什均衡自洽情景"""
        state_options = [[st['id'] for st in v['states']] for v in self.variables]
        all_combinations = list(itertools.product(*state_options))
        
        attractors = []
        for combo in all_combinations:
            config = {self.variables[i]['id']: combo[i] for i in range(self.n)}
            consistent, score, contra = self.evaluate_configuration(config)
            if consistent:
                attractors.append({
                    'config': config,
                    'score': score
                })
        return attractors

    def build_network_graph(self):
        """构建 NetworkX 有向加权影响网络（聚合多状态关联并记录净权重与非负绝对影响强度）"""
        G = nx.DiGraph()
        for v in self.variables:
            G.add_node(v['id'], label=v['name'])
            
        for imp in self.impacts:
            w = imp['weight']
            if w != 0:
                u = imp['sourceVarId']
                v = imp['targetVarId']
                abs_w = abs(w)
                if G.has_edge(u, v):
                    # 累加变量间的多状态净影响与绝对交互强度
                    G[u][v]['weight'] += w
                    G[u][v]['abs_weight'] += abs_w
                else:
                    G.add_edge(
                        u, 
                        v, 
                        weight=w,
                        abs_weight=abs_w,
                        source_state=imp['sourceStateId'],
                        target_state=imp['targetStateId']
                    )
        return G

if __name__ == '__main__':
    cib = CrossImpactBalances(VARIABLES, IMPACTS)
    print("=== [CIB 交叉影响平衡引擎启动] ===")
    print(f"变量维度: {cib.n} 个系统变量 | 状态空间容量: {2**cib.n} 种可能演化配置")
    
    attractors = cib.solve_attractors()
    print(f"\\n>>> 筛选出内部自洽吸引子情景 (Self-Consistent Scenarios): {len(attractors)} 个")
    for idx, att in enumerate(attractors, 1):
        print(f"\\n【自洽情景 #{idx}】综合系统引力得分: {att['score']}")
        for vid, sid in att['config'].items():
            var_name = cib.var_map[vid]['name']
            print(f"  - {var_name}: 状态 {sid}")
            
    # 构建图论拓扑与英文可视化绘图
    G = cib.build_network_graph()
    print(f"\\n>>> NetworkX Graph Construction: {G.number_of_nodes()} nodes, {G.number_of_edges()} directed edges")
    
    # PageRank 计算：PageRank转移概率基于非负绝对影响强度 (abs_weight) 计算，避免负权重导致马尔可夫链发散
    # 增加 max_iter=500 并附带健壮性 fallback，确保在任何 Python/NetworkX 环境（如 Spyder、Jupyter 等）100% 稳定运行
    try:
        centrality = nx.pagerank(G, alpha=0.85, weight='abs_weight', max_iter=500, tol=1e-5)
    except (nx.PowerIterationFailedConvergence, Exception):
        try:
            # 备选方案 1：纯拓扑结构 PageRank (不依赖权重)
            centrality = nx.pagerank(G, alpha=0.85, weight=None, max_iter=500)
        except Exception:
            # 备选方案 2：度中心度度量 (保证绝对不中断)
            centrality = nx.degree_centrality(G)

    print(">>> PageRank Centrality Ranking:")
    for node, rank in sorted(centrality.items(), key=lambda x: x[1], reverse=True):
        print(f"  * {node} ({cib.var_map[node]['name']}): {rank:.4f}")

    # Generate Visualization Figure (All titles, legends, axis labels strictly in English)
    plt.figure(figsize=(10, 6))
    
    # Subplot 1: PageRank Centrality Bar Chart
    plt.subplot(1, 2, 1)
    nodes = list(centrality.keys())
    scores = [centrality[n] for n in nodes]
    labels = [n.replace('var-', '').upper() for n in nodes]
    plt.bar(labels, scores, color='#059669', edgecolor='#065f46', alpha=0.85)
    plt.title("Variable PageRank Centrality", fontsize=11, fontweight='bold')
    plt.xlabel("System Variable Dimension", fontsize=10)
    plt.ylabel("Centrality Score (0.0 - 1.0)", fontsize=10)
    plt.grid(axis='y', linestyle='--', alpha=0.5)

    # Subplot 2: Network Topology
    plt.subplot(1, 2, 2)
    pos = nx.spring_layout(G, seed=42)
    pos_edges = [(u, v) for u, v, d in G.edges(data=True) if d.get('weight', 0) > 0]
    neg_edges = [(u, v) for u, v, d in G.edges(data=True) if d.get('weight', 0) < 0]
    
    nx.draw_networkx_nodes(G, pos, node_color='#1e293b', node_size=850)
    node_labels = {n: n.replace('var-', '').upper() for n in G.nodes()}
    nx.draw_networkx_labels(G, pos, labels=node_labels, font_color='#ffffff', font_size=8, font_weight='bold')
    
    nx.draw_networkx_edges(G, pos, edgelist=pos_edges, edge_color='#10b981', width=2, arrows=True, arrowsize=14, label='Positive Impact (+)')
    nx.draw_networkx_edges(G, pos, edgelist=neg_edges, edge_color='#ef4444', width=2, arrows=True, arrowsize=14, style='dashed', label='Negative Damping (-)')
    
    plt.title("Cross-Impact Network Topology", fontsize=11, fontweight='bold')
    plt.axis('off')
    plt.legend(loc='lower center', bbox_to_anchor=(0.5, -0.15), ncol=2, fontsize=8)

    plt.tight_layout()
    output_filename = "cib_simulation_result.png"
    plt.savefig(output_filename, dpi=200)
    print(f"\\n>>> Simulation figure successfully generated and saved to: {output_filename}")
`;
}
