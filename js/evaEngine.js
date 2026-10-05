/**
 * evaEngine.js
 * Motor de Valor Econômico Adicionado (EVA - Economic Value Added)
 * Capitão EVA: O Guardião da Riqueza
 * AnimValue: O Preço do Sucesso
 */

export const evaEngine = {
  /**
   * Calcula o NOPAT (Lucro Operacional Líquido após Impostos)
   * NOPAT = EBIT * (1 - TaxRate)
   */
  calculateNOPAT(ebit, taxRate = 0.34) {
    return ebit > 0 ? ebit * (1 - taxRate) : ebit;
  },

  /**
   * Calcula o Retorno sobre o Capital Investido (ROIC)
   * ROIC = NOPAT / Capital Investido
   */
  calculateROIC(nopat, investedCapital) {
    if (investedCapital <= 0) return 0;
    return nopat / investedCapital;
  },

  /**
   * Calcula o Custo de Oportunidade do Capital em R$ (Capital Charge)
   * Capital Charge = Capital Investido * WACC
   */
  calculateCapitalCharge(investedCapital, wacc) {
    return investedCapital * wacc;
  },

  /**
   * Calcula o EVA (Valor Econômico Adicionado)
   * Fórmula 1: EVA = NOPAT - (Capital Investido * WACC)
   * Fórmula 2: EVA = Capital Investido * (ROIC - WACC)
   */
  calculateEVA({ nopat, investedCapital, wacc }) {
    const capitalCharge = this.calculateCapitalCharge(investedCapital, wacc);
    const eva = nopat - capitalCharge;
    const roic = this.calculateROIC(nopat, investedCapital);
    const spread = roic - wacc;

    return {
      nopat,
      investedCapital,
      wacc,
      capitalCharge,
      eva,
      roic,
      spread,
      isCreatingValue: eva > 0,
    };
  },

  /**
   * Compara o Lucro Líquido Contábil com o EVA
   * Demonstra o paradoxo clássico: "Lucro Contábil Positivo com Destruição de Riqueza"
   * @param {Object} params
   * @param {number} params.ebit Lucro operacional
   * @param {number} params.financialExpenses Despesas financeiras de juros
   * @param {number} params.taxRate Alíquota de impostos (ex: 0.34)
   * @param {number} params.investedCapital Capital total investido na operação
   * @param {number} params.wacc Custo médio ponderado de capital
   */
  compareAccountingVsEconomic({ ebit, financialExpenses, taxRate, investedCapital, wacc }) {
    // 1. Lucro Contábil Tradicional (DRE)
    const ebt = ebit - financialExpenses;
    const taxes = ebt > 0 ? ebt * taxRate : 0;
    const netAccountingProfit = ebt - taxes;

    // 2. Lucro Econômico (EVA)
    const nopat = this.calculateNOPAT(ebit, taxRate);
    const capitalCharge = this.calculateCapitalCharge(investedCapital, wacc);
    const eva = nopat - capitalCharge;
    const roic = this.calculateROIC(nopat, investedCapital);
    const spread = roic - wacc;

    // Diagnóstico didático do Capitão EVA
    let paradoxCase = false;
    let statusText = '';
    let explanation = '';
    let badgeType = 'neutral';

    if (netAccountingProfit > 0 && eva < 0) {
      paradoxCase = true;
      statusText = 'Ilusão de Lucro: Destruição Econômica Ativa!';
      badgeType = 'danger';
      explanation =
        `Atenção CFO! A DRE aponta Lucro Contábil positivo de R$ ${netAccountingProfit.toFixed(2)}M, ` +
        `mas seu ROIC (${(roic * 100).toFixed(1)}%) é MENOR que o custo de oportunidade do capital (WACC de ${(wacc * 100).toFixed(1)}%). ` +
        `O negócio não paga o custo do capital empatado (R$ ${capitalCharge.toFixed(2)}M), destruindo R$ ${Math.abs(eva).toFixed(2)}M de riqueza real dos acionistas!`;
    } else if (eva > 0) {
      statusText = 'Superávit Econômico: Criação Real de Riqueza!';
      badgeType = 'success';
      explanation =
        `Excelente comando! O retorno sobre o capital (${(roic * 100).toFixed(1)}%) supera o WACC (${(wacc * 100).toFixed(1)}%) ` +
        `com um spread positivo de +${(spread * 100).toFixed(1)}%. Cada real investido gera riqueza genuína após cobrir todos os custos!`;
    } else {
      statusText = 'Prejuízo Duplo: Operacional e Econômico';
      badgeType = 'warning';
      explanation =
        `Alerta Máximo! Tanto a contabilidade quanto o modelo econômico acusam prejuízo. A empresa precisa urgentemente rever sua estrutura de custos ou redimensionar ativos.`;
    }

    return {
      netAccountingProfit,
      nopat,
      capitalCharge,
      eva,
      roic,
      wacc,
      spread,
      paradoxCase,
      statusText,
      explanation,
      badgeType,
    };
  },

  /**
   * Projeta a evolução do EVA para cada um dos 5 anos do FCD
   * @param {Array<Object>} projections Projeções do FCD
   * @param {number} initialInvestedCapital Capital investido no ano 0
   * @param {number} wacc Custo de capital
   */
  projectEVAProgression(projections, initialInvestedCapital, wacc) {
    let currentCapital = initialInvestedCapital;
    const evaHistory = [];
    let cumulativeEVA = 0;

    for (const proj of projections) {
      // Capital investido cresce com reinvestimento líquido (Capex - D&A + Delta NWC)
      const netReinvestment = proj.capex - proj.da + proj.deltaNwc;
      currentCapital += Math.max(0, netReinvestment);

      const evaResult = this.calculateEVA({
        nopat: proj.nopat,
        investedCapital: currentCapital,
        wacc,
      });

      cumulativeEVA += evaResult.eva;

      evaHistory.push({
        year: proj.year,
        investedCapital: currentCapital,
        nopat: proj.nopat,
        capitalCharge: evaResult.capitalCharge,
        eva: evaResult.eva,
        cumulativeEVA,
        roic: evaResult.roic,
        wacc,
        spread: evaResult.spread,
      });
    }

    return {
      evaHistory,
      totalCumulativeEVA: cumulativeEVA,
      isNetValueCreator: cumulativeEVA > 0,
    };
  },
};
