/**
 * dcfEngine.js
 * Motor de Cálculo de Fluxo de Caixa Descontado (FCD / DCF)
 * AnimValue: O Preço do Sucesso
 */

export const dcfEngine = {
  /**
   * Calcula o Custo do Capital Próprio (Ke) via CAPM
   * Ke = Rf + Beta * ERP
   * @param {Object} params
   * @param {number} params.riskFreeRate Taxa livre de risco (ex: 0.065 para 6.5%)
   * @param {number} params.beta Beta alavancado do ativo (ex: 1.15)
   * @param {number} params.marketRiskPremium Prêmio de risco de mercado (ex: 0.055 para 5.5%)
   * @returns {number} Ke decimal
   */
  calculateKeCAPM({ riskFreeRate, beta, marketRiskPremium }) {
    return riskFreeRate + beta * marketRiskPremium;
  },

  /**
   * Calcula o Custo Médio Ponderado de Capital (WACC)
   * WACC = (E/V)*Ke + (D/V)*Kd*(1 - T)
   * @param {Object} params
   * @param {number} params.ke Custo do capital próprio (decimal)
   * @param {number} params.kd Custo bruto da dívida (decimal)
   * @param {number} params.taxRate Alíquota de impostos sobre o lucro (ex: 0.34 para 34%)
   * @param {number} params.equityWeight Participação do capital próprio (E/V, 0 a 1)
   * @param {number} params.debtWeight Participação do capital de terceiros (D/V, 0 a 1)
   * @returns {number} WACC decimal
   */
  calculateWACC({ ke, kd, taxRate, equityWeight, debtWeight }) {
    // Normaliza pesos se não somarem 1
    const total = equityWeight + debtWeight;
    const wE = total > 0 ? equityWeight / total : 1;
    const wD = total > 0 ? debtWeight / total : 0;
    
    const afterTaxKd = kd * (1 - taxRate);
    const wacc = (wE * ke) + (wD * afterTaxKd);
    return Math.max(0.01, wacc);
  },

  /**
   * Projeta as demonstrações e os Fluxos de Caixa Livres da Firma (FCFF) por N anos
   * @param {Object} params
   * @param {number} params.baseRevenue Receita líquida do ano 0 (em R$ milhões)
   * @param {Array<number>} params.growthRates Vetor de taxas de crescimento anual (ex: [0.15, 0.12, 0.10, 0.08, 0.06])
   * @param {Array<number>|number} params.ebitdaMargins Margens EBITDA para cada ano ou margem constante
   * @param {number} params.daRate Depreciação e Amortização como % da receita
   * @param {number} params.taxRate Alíquota tributária (IR + CSLL)
   * @param {number} params.capexRate Capex como % da receita
   * @param {number} params.nwcRate Variação de Capital de Giro Líquido como % do delta de receita
   * @returns {Array<Object>} Lista de projeções ano a ano
   */
  projectCashFlows({
    baseRevenue,
    growthRates,
    ebitdaMargins,
    daRate = 0.045,
    taxRate = 0.34,
    capexRate = 0.05,
    nwcRate = 0.10,
  }) {
    const years = growthRates.length;
    const projections = [];
    let prevRevenue = baseRevenue;

    for (let i = 0; i < years; i++) {
      const year = i + 1;
      const g = growthRates[i];
      const revenue = prevRevenue * (1 + g);
      const deltaRevenue = revenue - prevRevenue;

      // Margem EBITDA (pode ser array ou valor único)
      const margin = Array.isArray(ebitdaMargins) ? ebitdaMargins[i] : ebitdaMargins;
      const ebitda = revenue * margin;

      // Depreciação e Amortização
      const da = revenue * daRate;

      // EBIT (Lucro Operacional)
      const ebit = ebitda - da;

      // Impostos sobre EBIT (Tax Shield operacional)
      const taxes = ebit > 0 ? ebit * taxRate : 0;

      // NOPAT (Net Operating Profit After Taxes)
      const nopat = ebit - taxes;

      // Investimentos em Ativo Fixo (Capex)
      const capex = revenue * capexRate;

      // Variação de Necessidade de Capital de Giro (Delta NWC)
      const deltaNwc = deltaRevenue * nwcRate;

      // FCFF = NOPAT + D&A - Capex - Delta NWC
      const fcff = nopat + da - capex - deltaNwc;

      projections.push({
        year,
        growthRate: g,
        revenue,
        deltaRevenue,
        ebitdaMargin: margin,
        ebitda,
        da,
        ebit,
        taxes,
        nopat,
        capex,
        deltaNwc,
        fcff,
      });

      prevRevenue = revenue;
    }

    return projections;
  },

  /**
   * Calcula o Valor Presente de um fluxo de caixa com base no WACC
   * @param {Array<Object>} projections Projeções anuais do FCFF
   * @param {number} wacc Taxa de desconto anual (decimal)
   * @returns {Object} { discountedFlows, sumPvFCFF }
   */
  calculatePresentValues(projections, wacc) {
    let sumPvFCFF = 0;
    const discountedFlows = projections.map((proj) => {
      const discountFactor = Math.pow(1 + wacc, proj.year);
      const pv = proj.fcff / discountFactor;
      sumPvFCFF += pv;
      return {
        ...proj,
        discountFactor,
        pvFCFF: pv,
      };
    });

    return {
      discountedFlows,
      sumPvFCFF,
    };
  },

  /**
   * Calcula o Valor Terminal pelo Modelo de Crescimento Perpétuo de Gordon
   * VT = FCFF_n * (1 + g_term) / (WACC - g_term)
   * @param {Object} params
   * @param {number} params.lastFCFF Fluxo de caixa do último ano projetado
   * @param {number} params.terminalGrowth Taxa perpétua de crescimento no longo prazo (g)
   * @param {number} params.wacc Taxa de desconto WACC
   * @param {number} params.years Quantidade de anos projetados (n)
   * @returns {Object} { nominalTerminalValue, pvTerminalValue, effectiveG }
   */
  calculateTerminalValueGordon({ lastFCFF, terminalGrowth, wacc, years = 5 }) {
    // Garante que WACC seja maior que g por pelo menos 0.5% para evitar singularidade
    let safeGrowth = terminalGrowth;
    if (safeGrowth >= wacc - 0.005) {
      safeGrowth = Math.max(0, wacc - 0.008);
    }

    // Fluxo normalizado no ano n+1
    const normalizedNextFCFF = Math.max(0.1, lastFCFF) * (1 + safeGrowth);
    const nominalTerminalValue = normalizedNextFCFF / (wacc - safeGrowth);
    const discountFactor = Math.pow(1 + wacc, years);
    const pvTerminalValue = nominalTerminalValue / discountFactor;

    return {
      nominalTerminalValue,
      pvTerminalValue,
      effectiveG: safeGrowth,
      discountFactor,
    };
  },

  /**
   * Consolida o Valuation da Firma (Enterprise Value) e o Valor para o Acionista (Equity Value)
   * @param {Object} params
   * @param {number} params.sumPvFCFF Soma do valor presente dos fluxos projetados
   * @param {number} params.pvTerminalValue Valor presente do valor terminal
   * @param {number} params.cash Caixa e equivalentes da empresa
   * @param {number} params.grossDebt Dívida financeira bruta
   * @returns {Object} Métricas consolidadas
   */
  calculateValuation({ sumPvFCFF, pvTerminalValue, cash = 0, grossDebt = 0 }) {
    const enterpriseValue = sumPvFCFF + pvTerminalValue;
    const netDebt = grossDebt - cash;
    const equityValue = enterpriseValue - netDebt;
    const tvShare = enterpriseValue > 0 ? (pvTerminalValue / enterpriseValue) * 100 : 0;

    return {
      sumPvFCFF,
      pvTerminalValue,
      enterpriseValue,
      cash,
      grossDebt,
      netDebt,
      equityValue,
      terminalValuePercentage: tvShare,
    };
  },

  /**
   * Gera uma matriz de sensibilidade (WACC vs Crescimento Terminal)
   * @param {Object} params
   * @param {Array<Object>} params.projections
   * @param {number} params.baseWacc
   * @param {number} params.baseG
   * @param {number} params.netDebt
   * @returns {Object} Tabela 2D de Enterprise Value
   */
  generateSensitivityMatrix({ projections, baseWacc, baseG, netDebt = 0 }) {
    const waccSteps = [-0.02, -0.01, 0, 0.01, 0.02];
    const gSteps = [-0.01, -0.005, 0, 0.005, 0.01];
    const lastFCFF = projections[projections.length - 1].fcff;
    const years = projections.length;

    const matrix = [];

    for (const wDelta of waccSteps) {
      const curWacc = Math.max(0.04, baseWacc + wDelta);
      const row = {
        wacc: curWacc,
        isBaseWacc: wDelta === 0,
        cells: [],
      };

      // Recalcula PV dos fluxos explícitos
      let pvFlows = 0;
      for (let y = 0; y < years; y++) {
        pvFlows += projections[y].fcff / Math.pow(1 + curWacc, y + 1);
      }

      for (const gDelta of gSteps) {
        const curG = Math.max(0.01, baseG + gDelta);
        const tv = this.calculateTerminalValueGordon({
          lastFCFF,
          terminalGrowth: curG,
          wacc: curWacc,
          years,
        });

        const ev = pvFlows + tv.pvTerminalValue;
        const eqVal = ev - netDebt;

        row.cells.push({
          g: curG,
          isBaseG: gDelta === 0,
          enterpriseValue: ev,
          equityValue: eqVal,
        });
      }

      matrix.push(row);
    }

    return {
      gValues: gSteps.map((d) => Math.max(0.01, baseG + d)),
      matrix,
    };
  },
};
