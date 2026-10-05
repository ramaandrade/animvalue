/**
 * macroEvents.js
 * Sistema de Cartas Surpresa e Eventos Macroeconômicos
 * AnimValue: O Preço do Sucesso
 */

export const macroEvents = {
  events: [
    {
      id: 'inflation_shock',
      name: 'O Choque da Inflação & Alta dos Juros',
      tag: 'CRISE MACROECONÔMICA',
      icon: '🔥📈',
      severity: 'high',
      description:
        'Um choque na cadeia global de suprimentos e pressões cambiais fazem a inflação (IPCA) saltar de 4,2% para 9,8% a.a. O Banco Central eleva a taxa básica Selic com vigor, elevando o custo da dívida (Kd) e a taxa livre de risco (Rf). Seus fornecedores já enviaram tabelas com reajuste de dois dígitos!',
      impacts: {
        rfDelta: +0.05, // +5.0 p.p. na taxa livre de risco
        kdDelta: +0.055, // +5.5 p.p. no custo da dívida
        marginPressure: -0.035, // -3.5 p.p. na margem EBITDA sem ação
        inflationRate: 0.098,
      },
      doctorAdvice:
        'Doutor Fluxo alerta: A alta da taxa de desconto (WACC) vai massacrar o Valor Presente do seu Valor Terminal! Você precisa recompor o fluxo de caixa livre para compensar o denominador.',
      madameAdvice:
        'Madame Múltiplo avisa: Múltiplos de mercado comprimem em ciclos de juros altos. Os investidores deixam de pagar por promessas e passam a exigir geração de caixa no presente!',
      captainAdvice:
        'Capitão EVA sentencia: O custo de oportunidade do capital subiu nas alturas. Se o seu ROIC não subir acima do novo WACC, sua empresa passará a destruir riqueza a cada dia trabalhado!',

      decisions: [
        {
          id: 'pricing',
          title: '1. Estratégia de Precificação (Pricing Power)',
          description: 'Como sua empresa reagirá ao aumento brutal dos custos de insumos?',
          options: [
            {
              id: 'full_pass',
              label: 'Repasse Integral aos Clientes',
              description: 'Reajustar preços na mesma proporção dos custos (+9.8%). O volume de vendas cai 3%, mas a Margem EBITDA é totalmente preservada.',
              badge: 'Margem Blindada',
              effects: {
                marginDelta: 0.0,
                growthDelta: -0.03,
                fcfProtection: 0.95,
              },
              comment: 'Você usou poder de marca e precificação. Houve pequena perda de volume, mas as margens se mantiveram intactas!',
            },
            {
              id: 'partial_pass',
              label: 'Repasse Parcial (Absorver Metade)',
              description: 'Repassar apenas +5% para não afugentar clientes e tentar ganhar fatia de mercado dos concorrentes. Margem EBITDA cai 2.0 p.p.',
              badge: 'Foco em Volume',
              effects: {
                marginDelta: -0.02,
                growthDelta: +0.01,
                fcfProtection: 0.75,
              },
              comment: 'Você defendeu market share, mas a compressão da margem EBITDA pesou no fluxo de caixa.',
            },
            {
              id: 'value_added',
              label: 'Reempacotamento & Bundling de Valor',
              description: 'Criar planos de assinatura anual com desconto e benefícios premium, travando fluxo previsível com repasse de 7%.',
              badge: 'Inovação Comercial',
              effects: {
                marginDelta: -0.005,
                growthDelta: +0.02,
                fcfProtection: 0.98,
              },
              comment: 'Brilhante jogada comercial! Melhorou a fidelização de clientes e mitigou 90% do impacto da inflação.',
            },
          ],
        },
        {
          id: 'efficiency',
          title: '2. Eficiência de Custos & Reinvestimento',
          description: 'Qual postura a diretoria financeira adotará em relação a despesas e Capex?',
          options: [
            {
              id: 'austerity',
              label: 'Plano de Austeridade & Foco em Caixa',
              description: 'Congelar novos investimentos não essenciais (Capex cai de 5% para 3% da receita) e renegociar contratos com fornecedores.',
              badge: 'Maximização de FCF',
              effects: {
                capexDelta: -0.02,
                nwcImprovement: 0.015,
                costSavings: +2.5,
              },
              comment: 'Excelente conservação de liquidez. O fluxo de caixa livre cresceu mesmo diante de ventos contrários.',
            },
            {
              id: 'keep_investing',
              label: 'Acelerar Expansão Contracíclica',
              description: 'Manter Capex agressivo para comprar ativos de concorrentes em apuros financeiros com desconto.',
              badge: 'Aposta Arriscada',
              effects: {
                capexDelta: +0.01,
                nwcImprovement: -0.01,
                growthDelta: +0.04,
              },
              comment: 'Uma estratégia ousada. O crescimento futuro aumentou, mas o fluxo de caixa a curto prazo sofreu drenagem.',
            },
          ],
        },
        {
          id: 'capital_structure',
          title: '3. Estrutura de Capital & Dívida',
          description: 'Com os juros bancários explodindo, o que fazer com a dívida da companhia?',
          options: [
            {
              id: 'deleveraging',
              label: 'Amortizar Dívida Cara com Caixa',
              description: 'Usar R$ 10M do caixa para abater empréstimos de juros flutuantes, reduzindo risco financeiro e despesas com juros.',
              badge: 'Desalavancagem Saudável',
              effects: {
                debtRepayment: 10.0,
                kdReduction: -0.015,
              },
              comment: 'Reduziu a dívida bruta e o custo médio da dívida, aliviando o WACC da companhia!',
            },
            {
              id: 'hold_cash',
              label: 'Preservar Caixa como Colchão de Segurança',
              description: 'Manter todo o caixa aplicado em títulos pós-fixados rendendo a nova Selic alta e refinanciar o passivo.',
              badge: 'Liquidez Máxima',
              effects: {
                debtRepayment: 0.0,
                financialIncomeBoost: +1.2,
              },
              comment: 'A empresa mantém grande liquidez para imprevistos, embora continue pagando juros mais pesados na dívida.',
            },
          ],
        },
      ],
    },
    {
      id: 'liquidity_boom',
      name: 'Onda de Liquidez & Boom de M&A',
      tag: 'MERCADO AQUECIDO',
      icon: '🚀💰',
      severity: 'low',
      description:
        'Fundos internacionais de Venture Capital e Private Equity chegam com excesso de capital buscando ativos consolidados no Brasil. As taxas de desconto caem e os múltiplos de mercado disparam.',
      impacts: {
        rfDelta: -0.02,
        kdDelta: -0.02,
        marginPressure: 0.0,
        multipleExpansion: +2.5,
      },
      doctorAdvice: 'Cuidado com a euforia! Valor intrínseco depende de fluxo de caixa sustentável, não de modismos passageiros.',
      madameAdvice: 'Hora de aproveitar o pico! Os múltiplos estão no topo histórico.',
      captainAdvice: 'Mais capital disponível exige ainda mais disciplina para não destruir EVA com aquisições inflacionadas.',
    },
  ],

  /**
   * Retorna o evento de choque de inflação principal
   */
  getInflationShock() {
    return this.events.find((e) => e.id === 'inflation_shock');
  },

  /**
   * Aplica o resultado das decisões tomadas pelo CFO ao estado financeiro
   * @param {Object} baselineParams Premissas antes do choque
   * @param {Object} selectedChoices Escolhas do jogador { pricing, efficiency, capital_structure }
   * @returns {Object} Premissas pós-choque atualizadas e diagnóstico
   */
  applyInflationShockDecisions(baselineParams, selectedChoices) {
    const shock = this.getInflationShock();
    
    // Impacto macro básico no custo de capital
    let newRf = baselineParams.riskFreeRate + shock.impacts.rfDelta;
    let newKd = baselineParams.kdGross + shock.impacts.kdDelta;
    let newMargin = baselineParams.ebitdaMargin + shock.impacts.marginPressure;
    let newGrowth = baselineParams.growthRate;
    let newCapexRate = baselineParams.capexRate;
    let debtReduction = 0;
    let cashChange = 0;

    // Resoluções táticas do jogador
    // 1. Decisão de Pricing
    const pricingOpt = shock.decisions[0].options.find((o) => o.id === selectedChoices.pricing);
    if (pricingOpt) {
      newMargin += (pricingOpt.effects.marginDelta - shock.impacts.marginPressure);
      newGrowth += pricingOpt.effects.growthDelta;
    }

    // 2. Decisão de Eficiência
    const effOpt = shock.decisions[1].options.find((o) => o.id === selectedChoices.efficiency);
    if (effOpt) {
      newCapexRate += effOpt.effects.capexDelta;
      if (effOpt.effects.growthDelta) newGrowth += effOpt.effects.growthDelta;
    }

    // 3. Decisão de Estrutura de Capital
    const capOpt = shock.decisions[2].options.find((o) => o.id === selectedChoices.capital_structure);
    if (capOpt) {
      if (capOpt.effects.debtRepayment) {
        debtReduction = capOpt.effects.debtRepayment;
        cashChange = -debtReduction;
        newKd += capOpt.effects.kdReduction;
      }
    }

    return {
      riskFreeRate: newRf,
      kdGross: Math.max(0.05, newKd),
      ebitdaMargin: Math.max(0.05, newMargin),
      growthRate: Math.max(0.02, newGrowth),
      capexRate: Math.max(0.02, newCapexRate),
      debtReduction,
      cashChange,
      shockDetails: shock,
      selectedChoices,
    };
  },
};
