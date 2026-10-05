/**
 * gameState.js
 * Gerenciamento de Estado Central Reativo e Empresas Disponíveis
 * AnimValue: O Preço do Sucesso
 */

import { dcfEngine } from './dcfEngine.js';
import { multiplesEngine } from './multiplesEngine.js';
import { evaEngine } from './evaEngine.js';
import { macroEvents } from './macroEvents.js';

export const COMPANIES = {
  techlog: {
    id: 'techlog',
    name: 'TechLog Soluções Inteligentes',
    tagline: 'Logística B2B orientada por Inteligência Artificial',
    sector: 'tech',
    icon: '🚚💻',
    baseRevenue: 100.0, // R$ Milhões
    baseEbitdaMargin: 0.22,
    baseDaRate: 0.045,
    baseCapexRate: 0.05,
    baseNwcRate: 0.08,
    taxRate: 0.34,
    cash: 15.0,
    grossDebt: 35.0,
    investedCapital: 85.0,
    // Estrutura e taxas
    riskFreeRate: 0.065,
    beta: 1.15,
    erp: 0.055,
    kdGross: 0.105,
    equityWeight: 0.60,
    debtWeight: 0.40,
    terminalGrowth: 0.025,
    defaultGrowth: 0.12,
    description:
      'Empresa fundada há 6 anos que otimiza malhas de transporte rodoviário. Recebeu sondagem para aquisição por um fundo de Private Equity internacional.',
  },
  biosaudedigital: {
    id: 'biosaudedigital',
    name: 'BioSaúde Care',
    tagline: 'Telemedicina corporativa e inteligência diagnóstica',
    sector: 'saude',
    icon: '🩺🔬',
    baseRevenue: 120.0,
    baseEbitdaMargin: 0.25,
    baseDaRate: 0.04,
    baseCapexRate: 0.045,
    baseNwcRate: 0.06,
    taxRate: 0.34,
    cash: 25.0,
    grossDebt: 30.0,
    investedCapital: 95.0,
    riskFreeRate: 0.065,
    beta: 1.05,
    erp: 0.055,
    kdGross: 0.095,
    equityWeight: 0.70,
    debtWeight: 0.30,
    terminalGrowth: 0.03,
    defaultGrowth: 0.15,
    description:
      'Plataforma de saúde com retenção de 94% de clientes e contratos anuais recorrentes, preparando-se para rodada Série B / M&A.',
  },
  omnivarejo: {
    id: 'omnivarejo',
    name: 'Conecta Varejo',
    tagline: 'Rede omnichannel de produtos duráveis com integração digital',
    sector: 'varejo',
    icon: '🛍️📦',
    baseRevenue: 180.0,
    baseEbitdaMargin: 0.13,
    baseDaRate: 0.035,
    baseCapexRate: 0.04,
    baseNwcRate: 0.12,
    taxRate: 0.34,
    cash: 18.0,
    grossDebt: 58.0,
    investedCapital: 130.0,
    riskFreeRate: 0.065,
    beta: 1.25,
    erp: 0.055,
    kdGross: 0.115,
    equityWeight: 0.50,
    debtWeight: 0.50,
    terminalGrowth: 0.02,
    defaultGrowth: 0.08,
    description:
      'Varejista consolidada com forte volume físico e presença digital em expansão, com necessidade de reprecificar ativos e negociar com credores.',
  },
};

export class GameState {
  constructor() {
    this.currentStep = 1; // 1: Diagnóstico, 2: FCD, 3: Múltiplos, 4: Inflação, 5: EVA, 6: Laudo
    this.selectedCompanyId = 'techlog';
    this.activeScenario = 'base'; // 'otimista', 'base', 'pessimista', 'custom'
    this.soundEnabled = true;

    // Estado operacional editável pelos sliders
    this.assumptions = {
      growthRate: 0.12,
      ebitdaMargin: 0.22,
      terminalGrowth: 0.025,
      capexRate: 0.05,
      nwcRate: 0.08,
      riskFreeRate: 0.065,
      beta: 1.15,
      erp: 0.055,
      kdGross: 0.105,
      equityWeight: 0.60,
      debtWeight: 0.40,
    };

    // Estado do Choque Macroeconômico
    this.macroShockState = {
      isTriggered: false,
      selectedChoices: {
        pricing: 'full_pass',
        efficiency: 'austerity',
        capital_structure: 'deleveraging',
      },
      preShockValuation: null,
      postShockValuation: null,
    };

    // Histórico de resultados calculados
    this.computed = null;
    this.listeners = [];

    // Inicialização
    this.loadCompany(this.selectedCompanyId);
  }

  /**
   * Registra um listener para reações de mudança de estado
   */
  subscribe(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.calculateAll();
    this.listeners.forEach((fn) => fn(this));
  }

  /**
   * Carrega uma empresa selecionada
   */
  loadCompany(companyId) {
    const comp = COMPANIES[companyId] || COMPANIES.techlog;
    this.selectedCompanyId = comp.id;
    this.activeScenario = 'base';

    this.assumptions = {
      growthRate: comp.defaultGrowth,
      ebitdaMargin: comp.baseEbitdaMargin,
      terminalGrowth: comp.terminalGrowth,
      capexRate: comp.baseCapexRate,
      nwcRate: comp.baseNwcRate,
      riskFreeRate: comp.riskFreeRate,
      beta: comp.beta,
      erp: comp.erp,
      kdGross: comp.kdGross,
      equityWeight: comp.equityWeight,
      debtWeight: comp.debtWeight,
    };

    this.macroShockState.isTriggered = false;
    this.notify();
  }

  getCompany() {
    return COMPANIES[this.selectedCompanyId];
  }

  /**
   * Aplica presets de cenários (Otimista, Base, Pessimista)
   */
  applyScenarioPreset(scenarioName) {
    const comp = this.getCompany();
    this.activeScenario = scenarioName;

    if (scenarioName === 'otimista') {
      this.assumptions.growthRate = comp.defaultGrowth + 0.06;
      this.assumptions.ebitdaMargin = comp.baseEbitdaMargin + 0.04;
      this.assumptions.terminalGrowth = Math.min(0.04, comp.terminalGrowth + 0.01);
      this.assumptions.riskFreeRate = Math.max(0.045, comp.riskFreeRate - 0.015);
      this.assumptions.kdGross = Math.max(0.07, comp.kdGross - 0.02);
    } else if (scenarioName === 'pessimista') {
      this.assumptions.growthRate = Math.max(0.02, comp.defaultGrowth - 0.06);
      this.assumptions.ebitdaMargin = Math.max(0.08, comp.baseEbitdaMargin - 0.05);
      this.assumptions.terminalGrowth = Math.max(0.01, comp.terminalGrowth - 0.01);
      this.assumptions.riskFreeRate = comp.riskFreeRate + 0.025;
      this.assumptions.kdGross = comp.kdGross + 0.035;
    } else if (scenarioName === 'base') {
      this.assumptions.growthRate = comp.defaultGrowth;
      this.assumptions.ebitdaMargin = comp.baseEbitdaMargin;
      this.assumptions.terminalGrowth = comp.terminalGrowth;
      this.assumptions.riskFreeRate = comp.riskFreeRate;
      this.assumptions.kdGross = comp.kdGross;
    }

    this.notify();
  }

  /**
   * Atualiza uma premissa individual e recalcula instantaneamente
   */
  updateAssumption(key, value) {
    if (this.assumptions[key] !== undefined) {
      this.assumptions[key] = parseFloat(value);
      this.activeScenario = 'custom';
      this.notify();
    }
  }

  /**
   * Atualiza escolha da decisão macroeconômica
   */
  updateMacroChoice(decisionCategory, choiceId) {
    this.macroShockState.selectedChoices[decisionCategory] = choiceId;
    this.notify();
  }

  /**
   * Navega para um passo da jornada
   */
  setStep(stepNumber) {
    this.currentStep = Math.max(1, Math.min(6, stepNumber));
    this.notify();
  }

  /**
   * Central de Recálculo em tempo real (FCD, WACC, Múltiplos, EVA)
   */
  calculateAll() {
    const comp = this.getCompany();
    const p = this.assumptions;

    // 1. Custo de Capital WACC
    const ke = dcfEngine.calculateKeCAPM({
      riskFreeRate: p.riskFreeRate,
      beta: p.beta,
      marketRiskPremium: p.erp,
    });

    const wacc = dcfEngine.calculateWACC({
      ke,
      kd: p.kdGross,
      taxRate: comp.taxRate,
      equityWeight: p.equityWeight,
      debtWeight: p.debtWeight,
    });

    // 2. Projeção dos Fluxos de Caixa (5 anos)
    const growthRates = [
      p.growthRate,
      p.growthRate * 0.95,
      p.growthRate * 0.90,
      p.growthRate * 0.85,
      p.growthRate * 0.80,
    ];

    const projections = dcfEngine.projectCashFlows({
      baseRevenue: comp.baseRevenue,
      growthRates,
      ebitdaMargins: p.ebitdaMargin,
      daRate: comp.baseDaRate,
      taxRate: comp.taxRate,
      capexRate: p.capexRate,
      nwcRate: p.nwcRate,
    });

    // 3. Valor Presente dos Fluxos Explícitos
    const pvFlows = dcfEngine.calculatePresentValues(projections, wacc);

    // 4. Valor Terminal (Gordon)
    const tvResult = dcfEngine.calculateTerminalValueGordon({
      lastFCFF: projections[4].fcff,
      terminalGrowth: p.terminalGrowth,
      wacc,
      years: 5,
    });

    // 5. Valuation da Firma e do Patrimônio Líquido
    let effectiveCash = comp.cash;
    let effectiveGrossDebt = comp.grossDebt;

    // Se o choque da inflação estiver ativo com desalavancagem
    if (this.macroShockState.isTriggered && this.macroShockState.selectedChoices.capital_structure === 'deleveraging') {
      const debtRepay = 10.0;
      effectiveGrossDebt = Math.max(0, effectiveGrossDebt - debtRepay);
      effectiveCash = Math.max(0, effectiveCash - debtRepay);
    }

    const valuation = dcfEngine.calculateValuation({
      sumPvFCFF: pvFlows.sumPvFCFF,
      pvTerminalValue: tvResult.pvTerminalValue,
      cash: effectiveCash,
      grossDebt: effectiveGrossDebt,
    });

    // 6. Múltiplos de Mercado & Relativo
    const peers = multiplesEngine.getSectorPeers(comp.sector);
    const sectorAverages = multiplesEngine.calculateSectorAverages(peers);

    const year1 = projections[0];
    const estimatedNetIncome = Math.max(0.1, (year1.ebit - (effectiveGrossDebt * p.kdGross)) * (1 - comp.taxRate));

    const impliedMultiples = multiplesEngine.calculateCompanyImpliedMultiples({
      enterpriseValue: valuation.enterpriseValue,
      equityValue: valuation.equityValue,
      revenue: year1.revenue,
      ebitda: year1.ebitda,
      netIncome: estimatedNetIncome,
    });

    const relativeValuation = multiplesEngine.calculateRelativeValuation({
      averages: sectorAverages,
      revenue: year1.revenue,
      ebitda: year1.ebitda,
      netIncome: estimatedNetIncome,
      netDebt: valuation.netDebt,
    });

    const discrepancy = multiplesEngine.evaluateValuationDiscrepancy(
      valuation.enterpriseValue,
      relativeValuation.byEbitda.ev
    );

    // 7. Motor de EVA (Capitão EVA)
    const estimatedFinancialExpenses = effectiveGrossDebt * p.kdGross;
    const evaComparison = evaEngine.compareAccountingVsEconomic({
      ebit: year1.ebit,
      financialExpenses: estimatedFinancialExpenses,
      taxRate: comp.taxRate,
      investedCapital: comp.investedCapital,
      wacc,
    });

    const evaProgression = evaEngine.projectEVAProgression(projections, comp.investedCapital, wacc);

    // Salva estado computado
    this.computed = {
      ke,
      wacc,
      projections,
      pvFlows,
      tvResult,
      valuation,
      peers,
      sectorAverages,
      impliedMultiples,
      relativeValuation,
      discrepancy,
      evaComparison,
      evaProgression,
    };
  }

  /**
   * Calcula a pontuação e avaliação final do CFO (para o Laudo de Avaliação)
   */
  evaluateCFOPerformance() {
    if (!this.computed) this.calculateAll();
    const { valuation, discrepancy, evaComparison, wacc } = this.computed;

    let score = 50;

    // 1. Criação de EVA (+20 ou -15)
    if (evaComparison.eva > 0) {
      score += 20;
    } else {
      score -= 15;
    }

    // 2. Alinhamento com o mercado (+15 ou penalidade por ágio desmedido)
    if (discrepancy.verdict === 'ideal') {
      score += 20;
    } else if (discrepancy.verdict === 'otimista') {
      score += 10;
    } else if (discrepancy.verdict === 'desafiador') {
      score -= 15;
    }

    // 3. Robustez do WACC (+10 se WACC realista entre 9% e 15%)
    if (wacc >= 0.09 && wacc <= 0.15) {
      score += 10;
    }

    score = Math.max(10, Math.min(100, score));

    let title = 'CFO Aprendiz';
    let summary = '';

    if (score >= 85) {
      title = 'CFO Estrategista Lendário 🏆';
      summary =
        'Transação de M&A recomendada com louvor! Você conciliou fluxo de caixa real, prudência de múltiplos e criação vigorosa de EVA econômico.';
    } else if (score >= 70) {
      title = 'CFO Sênior Consistente ⭐';
      summary =
        'Belo trabalho! A empresa possui tese defensável perante investidores, com bom equilíbrio entre crescimento e custo de oportunidade.';
    } else if (score >= 50) {
      title = 'CFO em Desenvolvimento 💼';
      summary =
        'Valuation negociável, mas com pontos de vulnerabilidade. Algumas premissas precisam de sustentação contra questionamentos de diligência.';
    } else {
      title = 'Destruidor Involuntário de Valor ⚠️';
      summary =
        'Atenção urgente! A companhia corre sério risco de queimar capital investido e ser rejeitada em rodadas de M&A por premissas desconectadas da realidade.';
    }

    return {
      score,
      title,
      summary,
    };
  }
}
