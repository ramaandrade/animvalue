/**
 * multiplesEngine.js
 * Motor de Avaliação Relativa por Múltiplos de Mercado (Madame Múltiplo)
 * AnimValue: O Preço do Sucesso
 */

export const multiplesEngine = {
  /**
   * Conjunto de pares comparáveis do setor para benchmarking
   */
  getSectorPeers(sector = 'tech') {
    const peerDatabase = {
      tech: [
        {
          name: 'NuvemPrime S.A.',
          description: 'Líder de mercado consolidada com forte escala',
          evEbitda: 14.5,
          peRatio: 22.0,
          evRevenue: 3.2,
          ebitdaMargin: 0.28,
          marketCap: 450.0,
        },
        {
          name: 'LogiData Tech',
          description: 'Concorrente direto com expansão acelerada',
          evEbitda: 12.0,
          peRatio: 18.5,
          evRevenue: 2.6,
          ebitdaMargin: 0.22,
          marketCap: 280.0,
        },
        {
          name: 'Sistemas Antigos & Cia',
          description: 'Player tradicional com baixa taxa de inovação',
          evEbitda: 8.5,
          peRatio: 12.0,
          evRevenue: 1.5,
          ebitdaMargin: 0.18,
          marketCap: 160.0,
        },
        {
          name: 'ScaleUp HyperLog',
          description: 'Startup unicórnio recente com múltiplos aquecidos',
          evEbitda: 16.0,
          peRatio: 26.0,
          evRevenue: 4.0,
          ebitdaMargin: 0.25,
          marketCap: 390.0,
        },
      ],
      varejo: [
        {
          name: 'OmniVarejo Brasil',
          description: 'Gigante nacional do varejo com e-commerce integrado',
          evEbitda: 9.5,
          peRatio: 15.0,
          evRevenue: 1.1,
          ebitdaMargin: 0.12,
          marketCap: 520.0,
        },
        {
          name: 'Boutique Express',
          description: 'Rede especializada com margens superiores',
          evEbitda: 11.2,
          peRatio: 17.8,
          evRevenue: 1.6,
          ebitdaMargin: 0.16,
          marketCap: 210.0,
        },
        {
          name: 'SuperDistribuidora',
          description: 'Atacadista focado em volume e giro rápido',
          evEbitda: 7.2,
          peRatio: 11.0,
          evRevenue: 0.6,
          ebitdaMargin: 0.08,
          marketCap: 340.0,
        },
      ],
      saude: [
        {
          name: 'Rede Vida Med',
          description: 'Rede de clínicas e telemedicina em consolidação',
          evEbitda: 13.0,
          peRatio: 20.0,
          evRevenue: 2.8,
          ebitdaMargin: 0.24,
          marketCap: 600.0,
        },
        {
          name: 'BioDiagnósticos',
          description: 'Laboratórios de precisão e exames moleculares',
          evEbitda: 11.5,
          peRatio: 18.0,
          evRevenue: 2.2,
          ebitdaMargin: 0.21,
          marketCap: 320.0,
        },
        {
          name: 'FarmaCare Digital',
          description: 'Marketplace de medicamentos e planos corporativos',
          evEbitda: 15.0,
          peRatio: 24.5,
          evRevenue: 3.5,
          ebitdaMargin: 0.26,
          marketCap: 410.0,
        },
      ],
    };

    return peerDatabase[sector] || peerDatabase.tech;
  },

  /**
   * Calcula medianas e médias estatísticas do setor
   * @param {Array<Object>} peers Lista de pares
   */
  calculateSectorAverages(peers) {
    const calcMedian = (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const calcMean = (arr) => arr.reduce((acc, v) => acc + v, 0) / arr.length;

    const evEbitdaList = peers.map((p) => p.evEbitda);
    const peRatioList = peers.map((p) => p.peRatio);
    const evRevenueList = peers.map((p) => p.evRevenue);

    return {
      medianEvEbitda: calcMedian(evEbitdaList),
      meanEvEbitda: calcMean(evEbitdaList),
      medianPe: calcMedian(peRatioList),
      meanPe: calcMean(peRatioList),
      medianEvRevenue: calcMedian(evRevenueList),
      meanEvRevenue: calcMean(evRevenueList),
    };
  },

  /**
   * Calcula os múltiplos implícitos da empresa do jogador com base no FCD e nas demonstrações
   * @param {Object} params
   * @param {number} params.enterpriseValue EV apurado pelo FCD
   * @param {number} params.equityValue Valor do patrimônio líquido apurado pelo FCD
   * @param {number} params.revenue Receita líquida anual (Ano 1 ou LTM)
   * @param {number} params.ebitda EBITDA anual (Ano 1 ou LTM)
   * @param {number} params.netIncome Lucro líquido estimado
   * @returns {Object} Múltiplos implícitos
   */
  calculateCompanyImpliedMultiples({ enterpriseValue, equityValue, revenue, ebitda, netIncome }) {
    const impliedEvEbitda = ebitda > 0 ? enterpriseValue / ebitda : 0;
    const impliedPe = netIncome > 0 ? equityValue / netIncome : 0;
    const impliedEvRevenue = revenue > 0 ? enterpriseValue / revenue : 0;

    return {
      impliedEvEbitda,
      impliedPe,
      impliedEvRevenue,
    };
  },

  /**
   * Calcula o Valuation Relativo Implícito aplicando os múltiplos do setor às métricas da empresa
   * @param {Object} params
   * @param {Object} params.averages Médias/medianas do setor
   * @param {number} params.revenue Receita da empresa
   * @param {number} params.ebitda EBITDA da empresa
   * @param {number} params.netIncome Lucro líquido da empresa
   * @param {number} params.netDebt Dívida líquida (Dívida - Caixa)
   * @returns {Object}
   */
  calculateRelativeValuation({ averages, revenue, ebitda, netIncome, netDebt }) {
    // Valuation por EV/EBITDA
    const evByEbitda = ebitda * averages.medianEvEbitda;
    const equityByEbitda = evByEbitda - netDebt;

    // Valuation por EV/Receita
    const evByRevenue = revenue * averages.medianEvRevenue;
    const equityByRevenue = evByRevenue - netDebt;

    // Valuation por P/L (vai direto para Equity Value)
    const equityByPe = netIncome * averages.medianPe;
    const evByPe = equityByPe + netDebt;

    // Média dos 3 métodos relativos
    const consensusEV = (evByEbitda + evByRevenue + evByPe) / 3;
    const consensusEquity = consensusEV - netDebt;

    return {
      byEbitda: { ev: evByEbitda, equity: equityByEbitda, multiple: averages.medianEvEbitda },
      byRevenue: { ev: evByRevenue, equity: equityByRevenue, multiple: averages.medianEvRevenue },
      byPe: { ev: evByPe, equity: equityByPe, multiple: averages.medianPe },
      consensus: { ev: consensusEV, equity: consensusEquity },
    };
  },

  /**
   * Compara o Valuation FCD com o Valuation Relativo e gera parecer da Madame Múltiplo
   * @param {number} dcfEV Enterprise Value pelo FCD
   * @param {number} relativeEV Enterprise Value pelos Múltiplos (ex: por EV/EBITDA mediano)
   * @returns {Object} { gapPercentage, status, feedback, color }
   */
  evaluateValuationDiscrepancy(dcfEV, relativeEV) {
    if (relativeEV <= 0) {
      return {
        gapPercentage: 0,
        status: 'Indefinido',
        feedback: 'Métricas de comparáveis insuficientes para aferição.',
        color: '#94a3b8',
      };
    }

    const gap = ((dcfEV - relativeEV) / relativeEV) * 100;

    if (gap > 35) {
      return {
        gapPercentage: gap,
        status: 'Ágio Acentuado (Overvalued vs Mercado)',
        feedback:
          'Seu FCD encontrou um valor mais de 35% superior aos concorrentes! O mercado vai exigir provas cabais de que sua empresa crescerá muito mais rápido ou que possui um fosso competitivo (moat) inatacável. Cuidado com o risco de rejeição em rodadas de M&A!',
        color: '#ef4444', // Vermelho
        verdict: 'desafiador',
      };
    } else if (gap > 10) {
      return {
        gapPercentage: gap,
        status: 'Prêmio Moderado',
        feedback:
          'Seu valuation está com um prêmio saudável de cerca de 10-30% sobre os múltiplos medianos. É defensável se você justificar que sua margem operacional e governança são superiores à média.',
        color: '#f59e0b', // Âmbar
        verdict: 'otimista',
      };
    } else if (gap >= -15 && gap <= 10) {
      return {
        gapPercentage: gap,
        status: 'Equilíbrio Ideal (Fair Value)',
        feedback:
          'Excelente! O FCD intrínseco e os múltiplos de mercado estão em perfeita sintonia. Essa convergência é a que mais gera credibilidade diante de fundos de Private Equity e bancos de investimento.',
        color: '#10b981', // Verde esmeralda
        verdict: 'ideal',
      };
    } else {
      return {
        gapPercentage: gap,
        status: 'Desconto Significativo (Undervalued vs Mercado)',
        feedback:
          'Seu FCD está abaixo da mediana do mercado. Ou você foi ultra conservador nas projeções de fluxo, ou sua empresa está precificada com desconto excessivo. Isso pode atrair investidores em busca de barganhas, mas você pode estar deixando dinheiro na mesa!',
        color: '#38bdf8', // Azul celeste
        verdict: 'conservador',
      };
    }
  },
};
