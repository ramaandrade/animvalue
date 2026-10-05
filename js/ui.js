/**
 * ui.js
 * Controlador de Interface e Visualização de Etapas
 * AnimValue: O Preço do Sucesso
 */

import { characters } from './characters.js';
import { chartRenderer } from './chartRenderer.js';
import { sound } from './audioEffects.js';

export class UIController {
  constructor(gameState) {
    this.state = gameState;
    this.appContainer = document.getElementById('app-container');
    this.state.subscribe(() => this.render());
  }

  init() {
    this.bindGlobalEvents();
    this.render();
  }

  bindGlobalEvents() {
    // Alternador de som
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.title = isMuted ? 'Som Desativado' : 'Som Ativado';
      });
    }

    // Logo / Home
    const homeBtn = document.getElementById('brand-home-btn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        sound.playClick();
        this.state.setStep(1);
      });
    }
  }

  render() {
    const step = this.state.currentStep;
    const comp = this.state.getCompany();
    const computed = this.state.computed;

    // Atualiza barra de progresso no cabeçalho
    this.updateHeaderProgress(step);

    const mainContent = document.getElementById('main-flow-content');
    if (!mainContent) return;

    if (step === 1) {
      this.renderStep1Diagnosis(mainContent, comp, computed);
    } else if (step === 2) {
      this.renderStep2DoctorDCF(mainContent, comp, computed);
    } else if (step === 3) {
      this.renderStep3MadameMultiples(mainContent, comp, computed);
    } else if (step === 4) {
      this.renderStep4InflationShock(mainContent, comp, computed);
    } else if (step === 5) {
      this.renderStep5CaptainEVA(mainContent, comp, computed);
    } else if (step === 6) {
      this.renderStep6ValuationReport(mainContent, comp, computed);
    }
  }

  updateHeaderProgress(currentStep) {
    const steps = [
      { num: 1, label: 'Diagnóstico' },
      { num: 2, label: 'FCD' },
      { num: 3, label: 'Múltiplos' },
      { num: 4, label: 'Inflação' },
      { num: 5, label: 'EVA' },
      { num: 6, label: 'Laudo' },
    ];

    const progressContainer = document.getElementById('journey-stepper');
    if (!progressContainer) return;

    let html = '<div class="stepper-track">';
    steps.forEach((s) => {
      const activeClass = s.num === currentStep ? 'active' : s.num < currentStep ? 'completed' : '';
      html += `
        <button class="step-node ${activeClass}" data-step="${s.num}" title="${s.label}">
          <span class="step-num">${s.num < currentStep ? '✓' : s.num}</span>
          <span class="step-label">${s.label}</span>
        </button>
      `;
    });
    html += '</div>';

    progressContainer.innerHTML = html;

    progressContainer.querySelectorAll('.step-node').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetStep = parseInt(btn.getAttribute('data-step'), 10);
        sound.playClick();
        this.state.setStep(targetStep);
      });
    });
  }

  // ==========================================
  // ETAPA 1: DIAGNÓSTICO INICIAL
  // ==========================================
  renderStep1Diagnosis(container, comp, computed) {
    container.innerHTML = `
      <section class="step-view fade-in">
        <div class="hero-card">
          <div class="hero-badge">CFO SIMULATOR • M&A & VALUATION</div>
          <h2 class="hero-title">AnimValue: O Preço do Sucesso</h2>
          <p class="hero-subtitle">
            Você é o novo CFO da companhia. Um grande investidor estratégico e fundos de Private Equity 
            manifestaram interesse em uma transação de aquisição (M&A). Sua missão é liderar o <strong>Valuation Consultivo</strong>, 
            identificar as alavancas de valor e defender o preço justo do negócio!
          </p>
        </div>

        <!-- Seletor de Companhia -->
        <div class="section-card">
          <h3 class="section-title">🏢 Selecione a Empresa para Avaliação</h3>
          <p class="section-desc">Cada companhia opera em um setor com estruturas de capital, margens e dinâmicas distintas:</p>
          <div class="company-selector-grid">
            <div class="company-card ${this.state.selectedCompanyId === 'techlog' ? 'selected' : ''}" data-id="techlog">
              <div class="comp-icon">🚚💻</div>
              <h4>TechLog Soluções</h4>
              <span class="sector-tag tech">Setor Tecnologia</span>
              <p>Receita R$ 100M • Margem EBITDA 22%</p>
            </div>
            <div class="company-card ${this.state.selectedCompanyId === 'biosaudedigital' ? 'selected' : ''}" data-id="biosaudedigital">
              <div class="comp-icon">🩺🔬</div>
              <h4>BioSaúde Care</h4>
              <span class="sector-tag saude">Setor Saúde</span>
              <p>Receita R$ 120M • Margem EBITDA 25%</p>
            </div>
            <div class="company-card ${this.state.selectedCompanyId === 'omnivarejo' ? 'selected' : ''}" data-id="omnivarejo">
              <div class="comp-icon">🛍️📦</div>
              <h4>Conecta Varejo</h4>
              <span class="sector-tag varejo">Setor Varejo</span>
              <p>Receita R$ 180M • Margem EBITDA 13%</p>
            </div>
          </div>
        </div>

        <!-- DRE e Dados Básicos da Empresa Escolhida -->
        <div class="section-card">
          <div class="card-header-flex">
            <div>
              <h3 class="section-title">${comp.icon} ${comp.name}</h3>
              <p class="section-desc">${comp.tagline}</p>
            </div>
            <span class="badge-status">Diagnóstico Financeiro Base</span>
          </div>

          <div class="metrics-grid-4">
            <div class="metric-card">
              <span class="m-label">Receita Líquida (LTM)</span>
              <span class="m-value">R$ ${comp.baseRevenue.toFixed(1)}M</span>
            </div>
            <div class="metric-card">
              <span class="m-label">EBITDA Atual</span>
              <span class="m-value highlight">R$ ${(comp.baseRevenue * comp.baseEbitdaMargin).toFixed(1)}M</span>
              <span class="m-sub">Margem: ${(comp.baseEbitdaMargin * 100).toFixed(0)}%</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Dívida Líquida</span>
              <span class="m-value">R$ ${(comp.grossDebt - comp.cash).toFixed(1)}M</span>
              <span class="m-sub">Dívida: R$ ${comp.grossDebt}M | Caixa: R$ ${comp.cash}M</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Capital Investido</span>
              <span class="m-value">R$ ${comp.investedCapital.toFixed(1)}M</span>
              <span class="m-sub">Ativo Operacional Líquido</span>
            </div>
          </div>
        </div>

        <!-- Apresentação dos 3 Especialistas -->
        <div class="section-card">
          <h3 class="section-title">👥 O Conselho de Especialistas</h3>
          <p class="section-desc">Você será assessorado e cobrado por 3 conselheiros animados que defendem visões complementares:</p>
          <div class="characters-grid">
            <div class="character-card doctor-theme">
              <div class="char-avatar-mini">${characters.doctor.avatarSvg}</div>
              <div class="char-info">
                <h4>${characters.doctor.name}</h4>
                <span class="char-role">${characters.doctor.role}</span>
                <p>"${characters.doctor.dialogues.intro}"</p>
              </div>
            </div>
            <div class="character-card madame-theme">
              <div class="char-avatar-mini">${characters.madame.avatarSvg}</div>
              <div class="char-info">
                <h4>${characters.madame.name}</h4>
                <span class="char-role">${characters.madame.role}</span>
                <p>"${characters.madame.dialogues.intro}"</p>
              </div>
            </div>
            <div class="character-card captain-theme">
              <div class="char-avatar-mini">${characters.captain.avatarSvg}</div>
              <div class="char-info">
                <h4>${characters.captain.name}</h4>
                <span class="char-role">${characters.captain.role}</span>
                <p>"${characters.captain.dialogues.intro}"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ação de Início -->
        <div class="action-footer">
          <button id="start-journey-btn" class="btn btn-primary btn-large glow">
            Iniciar o Desafio do Doutor Fluxo (FCD) ➔
          </button>
        </div>
      </section>
    `;

    // Eventos
    container.querySelectorAll('.company-card').forEach((card) => {
      card.addEventListener('click', () => {
        sound.playClick();
        const cid = card.getAttribute('data-id');
        this.state.loadCompany(cid);
      });
    });

    const startBtn = container.querySelector('#start-journey-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        sound.playSuccess();
        this.state.setStep(2);
      });
    }
  }

  // ==========================================
  // ETAPA 2: O DESAFIO DO DOUTOR FLUXO (FCD)
  // ==========================================
  renderStep2DoctorDCF(container, comp, computed) {
    const { valuation, wacc, ke, projections, tvResult } = computed;
    const p = this.state.assumptions;

    container.innerHTML = `
      <section class="step-view fade-in">
        <!-- Balão do Doutor Fluxo -->
        <div class="dialogue-card doctor-border">
          <div class="char-avatar-sm">${characters.doctor.avatarSvg}</div>
          <div class="dialogue-body">
            <div class="dialogue-header">
              <span class="char-title">${characters.doctor.name} (${characters.doctor.role})</span>
              <span class="tag-fcd">Fluxo de Caixa Descontado</span>
            </div>
            <p class="speech-text">
              "Bem-vindo ao laboratório da criação de valor intrínseco! Ajuste os sliders de crescimento, margem e taxa de desconto. 
              Veja em tempo real como o <strong>Enterprise Value (EV)</strong> e o <strong>Equity Value</strong> se comportam. 
              Lembre-se: caixa futuro vale menos hoje por causa do WACC!"
            </p>
          </div>
        </div>

        <!-- Cenários Rápidos -->
        <div class="scenarios-bar">
          <span class="scenario-label">Cenários Prontos:</span>
          <button class="chip-btn ${this.state.activeScenario === 'otimista' ? 'active green' : ''}" data-scenario="otimista">
            🚀 Otimista
          </button>
          <button class="chip-btn ${this.state.activeScenario === 'base' ? 'active blue' : ''}" data-scenario="base">
            ⚖️ Caso Base
          </button>
          <button class="chip-btn ${this.state.activeScenario === 'pessimista' ? 'active red' : ''}" data-scenario="pessimista">
            🌧️ Pessimista
          </button>
        </div>

        <!-- Grid de Sliders Táteis -->
        <div class="section-card">
          <h3 class="section-title">🎛️ Alavancas de Projeção & Custo de Capital</h3>
          <div class="sliders-grid">
            <!-- 1. Crescimento de Receita -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-growth">Crescimento Anual da Receita (g)</label>
                <span class="slider-badge" id="val-growth">${(p.growthRate * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-growth" min="0.02" max="0.30" step="0.005" value="${p.growthRate}">
              <div class="slider-bounds"><span>2.0%</span><span>30.0%</span></div>
            </div>

            <!-- 2. Margem EBITDA -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-margin">Margem EBITDA Média</label>
                <span class="slider-badge highlight" id="val-margin">${(p.ebitdaMargin * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-margin" min="0.05" max="0.35" step="0.005" value="${p.ebitdaMargin}">
              <div class="slider-bounds"><span>5.0%</span><span>35.0%</span></div>
            </div>

            <!-- 3. Crescimento Perpétuo Gordon (g terminal) -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-term-growth">Crescimento Perpétuo (Gordon g)</label>
                <span class="slider-badge" id="val-term-growth">${(p.terminalGrowth * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-term-growth" min="0.01" max="0.045" step="0.002" value="${p.terminalGrowth}">
              <div class="slider-bounds"><span>1.0%</span><span>4.5%</span></div>
            </div>

            <!-- 4. Custo da Dívida Bruto (Kd) -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-kd">Custo Bruto da Dívida (Kd)</label>
                <span class="slider-badge" id="val-kd">${(p.kdGross * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-kd" min="0.06" max="0.22" step="0.005" value="${p.kdGross}">
              <div class="slider-bounds"><span>6.0%</span><span>22.0%</span></div>
            </div>

            <!-- 5. Taxa Livre de Risco (Rf / Selic Base) -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-rf">Taxa Livre de Risco (Rf)</label>
                <span class="slider-badge" id="val-rf">${(p.riskFreeRate * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-rf" min="0.04" max="0.16" step="0.005" value="${p.riskFreeRate}">
              <div class="slider-bounds"><span>4.0%</span><span>16.0%</span></div>
            </div>

            <!-- 6. Capex (% da Receita) -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-capex">Reinvestimento em Capex (% Receita)</label>
                <span class="slider-badge" id="val-capex">${(p.capexRate * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-capex" min="0.02" max="0.12" step="0.005" value="${p.capexRate}">
              <div class="slider-bounds"><span>2.0%</span><span>12.0%</span></div>
            </div>
          </div>
        </div>

        <!-- Placar Resumo do Valuation FCD -->
        <div class="valuation-summary-strip">
          <div class="summary-pill">
            <span class="pill-title">WACC Resultante</span>
            <span class="pill-value">${(wacc * 100).toFixed(2)}%</span>
            <span class="pill-sub">Ke: ${(ke * 100).toFixed(1)}% | Kd líquido: ${(p.kdGross * (1 - comp.taxRate) * 100).toFixed(1)}%</span>
          </div>
          <div class="summary-pill highlight-blue">
            <span class="pill-title">Enterprise Value (EV)</span>
            <span class="pill-value">R$ ${valuation.enterpriseValue.toFixed(1)}M</span>
            <span class="pill-sub">Firma Total</span>
          </div>
          <div class="summary-pill highlight-green">
            <span class="pill-title">Equity Value (Acionistas)</span>
            <span class="pill-value">R$ ${valuation.equityValue.toFixed(1)}M</span>
            <span class="pill-sub">EV - Dívida Líq. (R$ ${valuation.netDebt.toFixed(1)}M)</span>
          </div>
          <div class="summary-pill">
            <span class="pill-title">Peso Valor Terminal</span>
            <span class="pill-value">${valuation.terminalValuePercentage.toFixed(1)}%</span>
            <span class="pill-sub">VP VT / EV Total</span>
          </div>
        </div>

        <!-- Visualização Gráfica -->
        <div class="charts-double-grid">
          <div class="section-card">
            <h4 class="card-subtitle">📊 Fluxos Projetados Descontados (Anos 1-5 + VT)</h4>
            <div id="fcff-chart-mount"></div>
          </div>
          <div class="section-card">
            <h4 class="card-subtitle">🌉 Cascata de Valor: EV para Equity Value</h4>
            <div id="waterfall-chart-mount"></div>
          </div>
        </div>

        <!-- Tabela DRE Projetada Completa -->
        <div class="section-card">
          <div class="table-responsive">
            <h4 class="card-subtitle">📋 Projeção Operacional e FCFF Detalhada (R$ Milhões)</h4>
            <table class="financial-table">
              <thead>
                <tr>
                  <th>Métrica</th>
                  <th>Ano 0 (Base)</th>
                  <th>Ano 1</th>
                  <th>Ano 2</th>
                  <th>Ano 3</th>
                  <th>Ano 4</th>
                  <th>Ano 5</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Receita Líquida</td>
                  <td>${comp.baseRevenue.toFixed(1)}</td>
                  ${projections.map((p) => `<td>${p.revenue.toFixed(1)}</td>`).join('')}
                </tr>
                <tr>
                  <td>EBITDA</td>
                  <td>${(comp.baseRevenue * comp.baseEbitdaMargin).toFixed(1)}</td>
                  ${projections.map((p) => `<td>${p.ebitda.toFixed(1)}</td>`).join('')}
                </tr>
                <tr>
                  <td>EBIT (Operacional)</td>
                  <td>${(comp.baseRevenue * (comp.baseEbitdaMargin - comp.baseDaRate)).toFixed(1)}</td>
                  ${projections.map((p) => `<td>${p.ebit.toFixed(1)}</td>`).join('')}
                </tr>
                <tr>
                  <td>NOPAT (Pós-IR)</td>
                  <td>-</td>
                  ${projections.map((p) => `<td>${p.nopat.toFixed(1)}</td>`).join('')}
                </tr>
                <tr class="fcf-row">
                  <td><strong>FCFF (Fluxo Livre)</strong></td>
                  <td>-</td>
                  ${projections.map((p) => `<td><strong>${p.fcff.toFixed(1)}</strong></td>`).join('')}
                </tr>
                <tr class="pv-row">
                  <td>VP FCFF (desc. WACC)</td>
                  <td>-</td>
                  ${computed.pvFlows.discountedFlows.map((p) => `<td>${p.pvFCFF.toFixed(1)}</td>`).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Próxima Etapa -->
        <div class="action-footer">
          <button id="goto-step3-btn" class="btn btn-primary btn-large">
            Avançar para Madame Múltiplo (Múltiplos de Mercado) ➔
          </button>
        </div>
      </section>
    `;

    // Renderiza gráficos
    chartRenderer.renderCashFlowChart('fcff-chart-mount', computed.projections, computed.tvResult);
    chartRenderer.renderValuationWaterfall('waterfall-chart-mount', computed.valuation);

    // Event listeners para sliders com recálculo em tempo real
    const setupSlider = (id, key) => {
      const el = container.querySelector(id);
      if (!el) return;
      el.addEventListener('input', (e) => {
        sound.playSliderTick();
        this.state.updateAssumption(key, e.target.value);
      });
    };

    setupSlider('#sl-growth', 'growthRate');
    setupSlider('#sl-margin', 'ebitdaMargin');
    setupSlider('#sl-term-growth', 'terminalGrowth');
    setupSlider('#sl-kd', 'kdGross');
    setupSlider('#sl-rf', 'riskFreeRate');
    setupSlider('#sl-capex', 'capexRate');

    // Cenários rápidos
    container.querySelectorAll('.chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const sc = btn.getAttribute('data-scenario');
        this.state.applyScenarioPreset(sc);
      });
    });

    const nextBtn = container.querySelector('#goto-step3-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sound.playSuccess();
        this.state.setStep(3);
      });
    }
  }

  // ==========================================
  // ETAPA 3: O TESTE DA MADAME MÚLTIPLO
  // ==========================================
  renderStep3MadameMultiples(container, comp, computed) {
    const { valuation, impliedMultiples, peers, sectorAverages, relativeValuation, discrepancy } = computed;

    container.innerHTML = `
      <section class="step-view fade-in">
        <!-- Balão da Madame Múltiplo -->
        <div class="dialogue-card madame-border">
          <div class="char-avatar-sm">${characters.madame.avatarSvg}</div>
          <div class="dialogue-body">
            <div class="dialogue-header">
              <span class="char-title">${characters.madame.name} (${characters.madame.role})</span>
              <span class="tag-multiples">Avaliação Relativa</span>
            </div>
            <p class="speech-text">
              "Chegou a hora da verdade, queridinho! O Doutor Fluxo adorou as fórmulas dele, mas o que os investidores reais 
              pagam na bolsa e nas mesas de M&A? Vamos comparar seus múltiplos implícitos com as empresas semelhantes do setor!"
            </p>
          </div>
        </div>

        <!-- Parecer do Gap de Valuation -->
        <div class="discrepancy-card" style="border-left-color: ${discrepancy.color};">
          <div class="discrepancy-header">
            <h4>${discrepancy.status}</h4>
            <span class="gap-badge" style="background: ${discrepancy.color}22; color: ${discrepancy.color}; border: 1px solid ${discrepancy.color};">
              Diferença vs Mediana: ${discrepancy.gapPercentage >= 0 ? '+' : ''}${discrepancy.gapPercentage.toFixed(1)}%
            </span>
          </div>
          <p class="discrepancy-feedback">${discrepancy.feedback}</p>
        </div>

        <!-- Comparação de Métricas Implícitas vs Setor -->
        <div class="multiples-comparison-grid">
          <div class="metric-box">
            <span class="m-sub">Múltiplo EV/EBITDA</span>
            <div class="m-compare-values">
              <div>
                <span class="badge-label">Sua Empresa</span>
                <span class="m-large ${discrepancy.gapPercentage > 20 ? 'red' : 'green'}">${impliedMultiples.impliedEvEbitda.toFixed(1)}x</span>
              </div>
              <span class="compare-divider">vs</span>
              <div>
                <span class="badge-label">Mediana Setor</span>
                <span class="m-large">${sectorAverages.medianEvEbitda.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          <div class="metric-box">
            <span class="m-sub">Preço/Lucro (P/L)</span>
            <div class="m-compare-values">
              <div>
                <span class="badge-label">Sua Empresa</span>
                <span class="m-large">${impliedMultiples.impliedPe.toFixed(1)}x</span>
              </div>
              <span class="compare-divider">vs</span>
              <div>
                <span class="badge-label">Mediana Setor</span>
                <span class="m-large">${sectorAverages.medianPe.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          <div class="metric-box">
            <span class="m-sub">EV/Receita</span>
            <div class="m-compare-values">
              <div>
                <span class="badge-label">Sua Empresa</span>
                <span class="m-large">${impliedMultiples.impliedEvRevenue.toFixed(2)}x</span>
              </div>
              <span class="compare-divider">vs</span>
              <div>
                <span class="badge-label">Mediana Setor</span>
                <span class="m-large">${sectorAverages.medianEvRevenue.toFixed(2)}x</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico Comparativo -->
        <div class="section-card">
          <h4 class="card-subtitle">📊 Comparação de EV/EBITDA com Concorrentes Virtuais</h4>
          <div id="multiples-chart-mount"></div>
        </div>

        <!-- Tabela de Comparáveis de Mercado -->
        <div class="section-card">
          <h4 class="card-subtitle">🏢 Painel de Pares do Mercado (${comp.sector.toUpperCase()})</h4>
          <div class="table-responsive">
            <table class="financial-table">
              <thead>
                <tr>
                  <th>Companhia</th>
                  <th>Descrição</th>
                  <th>EV/EBITDA</th>
                  <th>P/L</th>
                  <th>EV/Receita</th>
                  <th>Margem EBITDA</th>
                </tr>
              </thead>
              <tbody>
                <tr class="highlight-user-row">
                  <td><strong>${comp.name} (Sua)</strong></td>
                  <td>Valuation Implícito pelo FCD</td>
                  <td><strong>${impliedMultiples.impliedEvEbitda.toFixed(1)}x</strong></td>
                  <td><strong>${impliedMultiples.impliedPe.toFixed(1)}x</strong></td>
                  <td><strong>${impliedMultiples.impliedEvRevenue.toFixed(2)}x</strong></td>
                  <td>${(this.state.assumptions.ebitdaMargin * 100).toFixed(0)}%</td>
                </tr>
                ${peers
                  .map(
                    (p) => `
                  <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.description}</td>
                    <td>${p.evEbitda.toFixed(1)}x</td>
                    <td>${p.peRatio.toFixed(1)}x</td>
                    <td>${p.evRevenue.toFixed(2)}x</td>
                    <td>${(p.ebitdaMargin * 100).toFixed(0)}%</td>
                  </tr>
                `
                  )
                  .join('')}
                <tr class="median-row">
                  <td><strong>Mediana do Setor</strong></td>
                  <td>Parâmetro de Mercado</td>
                  <td><strong>${sectorAverages.medianEvEbitda.toFixed(1)}x</strong></td>
                  <td><strong>${sectorAverages.medianPe.toFixed(1)}x</strong></td>
                  <td><strong>${sectorAverages.medianEvRevenue.toFixed(2)}x</strong></td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Confronto: FCD vs Valuation Relativo -->
        <div class="section-card">
          <h4 class="card-subtitle">⚖️ O Confronto: FCD Intrínseco vs Valuation por Múltiplos</h4>
          <div class="methods-compare-grid">
            <div class="method-card">
              <span class="m-title">FCD (Doutor Fluxo)</span>
              <span class="m-val">R$ ${valuation.enterpriseValue.toFixed(1)}M</span>
              <span class="m-desc">Baseado no caixa futuro descontado</span>
            </div>
            <div class="method-card">
              <span class="m-title">EV/EBITDA Mediano (Madame Múltiplo)</span>
              <span class="m-val">R$ ${relativeValuation.byEbitda.ev.toFixed(1)}M</span>
              <span class="m-desc">EBITDA × ${sectorAverages.medianEvEbitda}x</span>
            </div>
            <div class="method-card">
              <span class="m-title">Consenso Relativo (Média de Múltiplos)</span>
              <span class="m-val">R$ ${relativeValuation.consensus.ev.toFixed(1)}M</span>
              <span class="m-desc">Média ponderada do mercado</span>
            </div>
          </div>
        </div>

        <!-- Ação para o Choque da Inflação -->
        <div class="action-footer double-actions">
          <button id="back-to-fcd" class="btn btn-secondary">
            ⬅️ Ajustar Premissas no FCD
          </button>
          <button id="goto-step4-btn" class="btn btn-primary btn-large glow-warning">
            🔥 Enfrentar o Choque da Inflação! ➔
          </button>
        </div>
      </section>
    `;

    // Renderiza gráfico de múltiplos
    chartRenderer.renderMultiplesComparison(
      'multiples-chart-mount',
      impliedMultiples.impliedEvEbitda,
      peers,
      sectorAverages.medianEvEbitda
    );

    // Eventos
    container.querySelector('#back-to-fcd')?.addEventListener('click', () => {
      sound.playClick();
      this.state.setStep(2);
    });

    container.querySelector('#goto-step4-btn')?.addEventListener('click', () => {
      sound.playAlert();
      this.state.macroShockState.isTriggered = true;
      this.state.setStep(4);
    });
  }

  // ==========================================
  // ETAPA 4: SOBREVIVENDO À INFLAÇÃO
  // ==========================================
  renderStep4InflationShock(container, comp, computed) {
    const shock = computed.discrepancy ? this.state.macroShockState : null;
    const shockData = this.state.macroShockState;
    const choices = shockData.selectedChoices;

    container.innerHTML = `
      <section class="step-view fade-in">
        <!-- Alerta de Choque Macroeconômico -->
        <div class="macro-crisis-banner">
          <div class="crisis-badge">⚠️ EVENTO MACROECONÔMICO CRÍTICO</div>
          <h2>🔥 Choque da Inflação & Explosão da Taxa de Juros</h2>
          <p>
            A inflação acelerou bruscamente para <strong>9,8% a.a.</strong> O Banco Central elevou a Selic, 
            fazendo a taxa livre de risco saltar <strong>+5,0 p.p.</strong> e os juros bancários <strong>+5,5 p.p.</strong>!
            Fornecedores e custos operacionais estão espremendo sua margem EBITDA em até 3,5 pontos percentuais!
          </p>
        </div>

        <!-- Efeito Teórico da Inflação no Valuation -->
        <div class="lesson-box">
          <h4>💡 A Regra de Ouro do CFO sob Inflação:</h4>
          <p>
            A inflação ataca o valuation por dois lados: <strong>corrói o fluxo de caixa livre (numerador)</strong> 
            e <strong>eleva a taxa de desconto WACC (denominador)</strong>. Para que o valor da empresa não desabe, 
            você precisa fazer a geração de caixa crescer a uma taxa superior ao aumento do custo de capital:
            <span class="formula-highlight">Taxa de Crescimento do Fluxo (g) > ΔWACC</span>!
          </p>
        </div>

        <!-- 3 Decisões Táticas do Jogador -->
        <div class="section-card">
          <h3 class="section-title">🛡️ Suas Decisões Táticas para Salvar a Empresa</h3>

          <!-- Decisão 1: Precificação -->
          <div class="decision-block">
            <h4>1. Poder de Preço (Pricing Power): O que fazer com seus preços de venda?</h4>
            <div class="choice-cards-grid">
              <label class="choice-card ${choices.pricing === 'full_pass' ? 'active' : ''}">
                <input type="radio" name="opt-pricing" value="full_pass" ${choices.pricing === 'full_pass' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge green">Repasse Integral (+9.8%)</span>
                  <p>Repassar toda a inflação. Margem EBITDA preservada intacta, com leve queda de volume (-3%).</p>
                </div>
              </label>
              <label class="choice-card ${choices.pricing === 'partial_pass' ? 'active' : ''}">
                <input type="radio" name="opt-pricing" value="partial_pass" ${choices.pricing === 'partial_pass' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge amber">Repasse Parcial (+5.0%)</span>
                  <p>Absorver metade para defender fatia de mercado. Margem EBITDA comprime 2,0 p.p.</p>
                </div>
              </label>
              <label class="choice-card ${choices.pricing === 'value_added' ? 'active' : ''}">
                <input type="radio" name="opt-pricing" value="value_added" ${choices.pricing === 'value_added' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge blue">Reempacotamento Premium</span>
                  <p>Reajustar 7% agregando serviços adicionais de alto valor percebido. Margem e fidelidade protegidas.</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Decisão 2: Eficiência e Capex -->
          <div class="decision-block">
            <h4>2. Eficiência de Custos e Reinvestimento: Qual a postura operacional?</h4>
            <div class="choice-cards-grid">
              <label class="choice-card ${choices.efficiency === 'austerity' ? 'active' : ''}">
                <input type="radio" name="opt-efficiency" value="austerity" ${choices.efficiency === 'austerity' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge green">Plano de Austeridade & Foco em Caixa</span>
                  <p>Congelar investimentos não essenciais (Capex cai de 5% para 3% da receita) para blindar o FCF.</p>
                </div>
              </label>
              <label class="choice-card ${choices.efficiency === 'keep_investing' ? 'active' : ''}">
                <input type="radio" name="opt-efficiency" value="keep_investing" ${choices.efficiency === 'keep_investing' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge red">Expansão Contracíclica Agressiva</span>
                  <p>Manter Capex acelerado para abocanhar concorrentes enfraquecidos, aceitando drenagem de caixa.</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Decisão 3: Estrutura de Capital -->
          <div class="decision-block">
            <h4>3. Gestão de Dívida: Com juros galopantes, como gerenciar o passivo?</h4>
            <div class="choice-cards-grid">
              <label class="choice-card ${choices.capital_structure === 'deleveraging' ? 'active' : ''}">
                <input type="radio" name="opt-capital" value="deleveraging" ${choices.capital_structure === 'deleveraging' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge green">Desalavancar R$ 10M com Caixa</span>
                  <p>Quitar dívidas bancárias caras de juros flutuantes, diminuindo a alavancagem e o WACC da firma.</p>
                </div>
              </label>
              <label class="choice-card ${choices.capital_structure === 'hold_cash' ? 'active' : ''}">
                <input type="radio" name="opt-capital" value="hold_cash" ${choices.capital_structure === 'hold_cash' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge blue">Preservar Liquidez em Caixa</span>
                  <p>Manter reservas intocadas rendendo a nova Selic pós-fixada como proteção contra crises de crédito.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Impacto Comparativo pós-decisões -->
        <div class="section-card">
          <h4 class="card-subtitle">📈 Impacto das Suas Decisões no Valuation Atual</h4>
          <div class="metrics-grid-3">
            <div class="metric-card">
              <span class="m-label">Novo WACC Inflacionado</span>
              <span class="m-value highlight">${(computed.wacc * 100).toFixed(2)}%</span>
              <span class="m-sub">Taxa de desconto reajustada</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Enterprise Value Resiliente</span>
              <span class="m-value">R$ ${computed.valuation.enterpriseValue.toFixed(1)}M</span>
              <span class="m-sub">Após mitigação de margem e FCF</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Equity Value Protegido</span>
              <span class="m-value highlight-green">R$ ${computed.valuation.equityValue.toFixed(1)}M</span>
              <span class="m-sub">Valor aos acionistas</span>
            </div>
          </div>
        </div>

        <!-- Ação para o Capitão EVA -->
        <div class="action-footer">
          <button id="goto-step5-btn" class="btn btn-primary btn-large">
            O Julgamento do Capitão EVA (Criação de Riqueza) ➔
          </button>
        </div>
      </section>
    `;

    // Radio button handlers
    const setupRadioGroup = (name, category) => {
      container.querySelectorAll(`input[name="${name}"]`).forEach((radio) => {
        radio.addEventListener('change', (e) => {
          sound.playClick();
          this.state.updateMacroChoice(category, e.target.value);
        });
      });
    };

    setupRadioGroup('opt-pricing', 'pricing');
    setupRadioGroup('opt-efficiency', 'efficiency');
    setupRadioGroup('opt-capital', 'capital_structure');

    container.querySelector('#goto-step5-btn')?.addEventListener('click', () => {
      sound.playSuccess();
      this.state.setStep(5);
    });
  }

  // ==========================================
  // ETAPA 5: O JULGAMENTO DO CAPITÃO EVA
  // ==========================================
  renderStep5CaptainEVA(container, comp, computed) {
    const { evaComparison, evaProgression, wacc } = computed;

    container.innerHTML = `
      <section class="step-view fade-in">
        <!-- Balão do Capitão EVA -->
        <div class="dialogue-card captain-border">
          <div class="char-avatar-sm">${characters.captain.avatarSvg}</div>
          <div class="dialogue-body">
            <div class="dialogue-header">
              <span class="char-title">${characters.captain.name} (${characters.captain.role})</span>
              <span class="tag-eva">Valor Econômico Adicionado (EVA)</span>
            </div>
            <p class="speech-text">
              "${characters.captain.dialogues.intro}"
            </p>
          </div>
        </div>

        <!-- Diagnóstico de Criação vs Destruição -->
        <div class="eva-verdict-card ${evaComparison.badgeType}">
          <div class="verdict-header">
            <h4>${evaComparison.statusText}</h4>
            <span class="eva-pill-tag">
              EVA Ano 1: R$ ${evaComparison.eva >= 0 ? '+' : ''}${evaComparison.eva.toFixed(2)}M
            </span>
          </div>
          <p class="verdict-explanation">${evaComparison.explanation}</p>
        </div>

        <!-- Visualização Gráfica do Spread ROIC vs WACC -->
        <div class="section-card">
          <h4 class="card-subtitle">🎯 O Teste da Riqueza: ROIC vs WACC</h4>
          <div id="eva-chart-mount"></div>
        </div>

        <!-- Paradoxo Didático: Lucro Contábil vs Lucro Econômico -->
        <div class="section-card">
          <h4 class="card-subtitle">⚖️ O Paradoxo Contábil vs Econômico</h4>
          <p class="section-desc">Entenda por que empresas lucrativas na DRE podem estar sangrando o patrimônio dos sócios:</p>
          
          <div class="accounting-vs-economic-grid">
            <div class="box-method">
              <div class="box-head">
                <h5>Visão Contábil Tradicional</h5>
                <span class="tag-acc">DRE Clássica</span>
              </div>
              <ul class="method-calc-list">
                <li><span>Lucro Operacional (EBIT):</span> <strong>R$ ${computed.projections[0].ebit.toFixed(1)}M</strong></li>
                <li><span>Despesas Financeiras (Juros):</span> <strong>-R$ ${(computed.valuation.grossDebt * this.state.assumptions.kdGross).toFixed(1)}M</strong></li>
                <li><span>Impostos sobre Lucro:</span> <strong>-R$ ${((computed.projections[0].ebit - (computed.valuation.grossDebt * this.state.assumptions.kdGross)) * comp.taxRate).toFixed(1)}M</strong></li>
                <li class="result-line">
                  <span>Lucro Líquido Contábil:</span> 
                  <strong class="${evaComparison.netAccountingProfit >= 0 ? 'color-green' : 'color-red'}">
                    R$ ${evaComparison.netAccountingProfit.toFixed(2)}M
                  </strong>
                </li>
              </ul>
              <div class="box-footer">
                ${evaComparison.netAccountingProfit >= 0 ? '✅ Contabilmente Positivo' : '❌ Prejuízo Contábil'}
              </div>
            </div>

            <div class="box-method highlight-economic">
              <div class="box-head">
                <h5>Visão Econômica Moderna (EVA)</h5>
                <span class="tag-eco">Custo de Oportunidade</span>
              </div>
              <ul class="method-calc-list">
                <li><span>NOPAT (Lucro Operacional Líquido):</span> <strong>R$ ${evaComparison.nopat.toFixed(1)}M</strong></li>
                <li><span>Capital Total Investido:</span> <strong>R$ ${comp.investedCapital.toFixed(1)}M</strong></li>
                <li><span>Custo do Capital (WACC):</span> <strong>${(wacc * 100).toFixed(1)}%</strong></li>
                <li><span>Capital Charge (CI × WACC):</span> <strong>-R$ ${evaComparison.capitalCharge.toFixed(2)}M</strong></li>
                <li class="result-line">
                  <span>Valor Econômico Adicionado (EVA):</span> 
                  <strong class="${evaComparison.eva >= 0 ? 'color-green' : 'color-red'}">
                    R$ ${evaComparison.eva >= 0 ? '+' : ''}${evaComparison.eva.toFixed(2)}M
                  </strong>
                </li>
              </ul>
              <div class="box-footer">
                ${evaComparison.eva >= 0 ? '🌟 Cria Riqueza Genuína' : '⚠️ Destrói Riqueza Acionária'}
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Evolução do EVA nos 5 Anos -->
        <div class="section-card">
          <h4 class="card-subtitle">📅 Trajetória do EVA Projetado (Anos 1 a 5)</h4>
          <div class="table-responsive">
            <table class="financial-table">
              <thead>
                <tr>
                  <th>Métrica</th>
                  <th>Ano 1</th>
                  <th>Ano 2</th>
                  <th>Ano 3</th>
                  <th>Ano 4</th>
                  <th>Ano 5</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Capital Investido (CI)</td>
                  ${evaProgression.evaHistory.map((h) => `<td>R$ ${h.investedCapital.toFixed(1)}M</td>`).join('')}
                </tr>
                <tr>
                  <td>NOPAT</td>
                  ${evaProgression.evaHistory.map((h) => `<td>R$ ${h.nopat.toFixed(1)}M</td>`).join('')}
                </tr>
                <tr>
                  <td>ROIC (%)</td>
                  ${evaProgression.evaHistory.map((h) => `<td>${(h.roic * 100).toFixed(1)}%</td>`).join('')}
                </tr>
                <tr>
                  <td>Capital Charge (CI × WACC)</td>
                  ${evaProgression.evaHistory.map((h) => `<td>R$ ${h.capitalCharge.toFixed(1)}M</td>`).join('')}
                </tr>
                <tr class="fcf-row">
                  <td><strong>EVA Anual</strong></td>
                  ${evaProgression.evaHistory
                    .map((h) => `<td class="${h.eva >= 0 ? 'color-green' : 'color-red'}"><strong>R$ ${h.eva.toFixed(1)}M</strong></td>`)
                    .join('')}
                </tr>
                <tr class="pv-row">
                  <td>EVA Acumulado</td>
                  ${evaProgression.evaHistory
                    .map((h) => `<td>R$ ${h.cumulativeEVA.toFixed(1)}M</td>`)
                    .join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Botão para Laudo de Avaliação -->
        <div class="action-footer">
          <button id="goto-step6-btn" class="btn btn-primary btn-large glow-gold">
            Emitir Laudo de Avaliação Final (Formalização M&A) ➔
          </button>
        </div>
      </section>
    `;

    // Renderiza gráfico de EVA
    chartRenderer.renderROICvsWACCChart('eva-chart-mount', evaComparison.roic, wacc, evaComparison.eva);

    container.querySelector('#goto-step6-btn')?.addEventListener('click', () => {
      sound.playStamp();
      this.state.setStep(6);
    });
  }

  // ==========================================
  // ETAPA 6: LAUDO DE AVALIAÇÃO FINAL
  // ==========================================
  renderStep6ValuationReport(container, comp, computed) {
    const { valuation, impliedMultiples, discrepancy, evaComparison, wacc } = computed;
    const cfoEval = this.state.evaluateCFOPerformance();
    const today = new Date().toLocaleDateString('pt-BR');

    // Cálculo da proposta de M&A do comprador
    const minOffer = valuation.equityValue * 0.95;
    const maxOffer = valuation.equityValue * 1.10;
    const recommendedOffer = (minOffer + maxOffer) / 2;

    container.innerHTML = `
      <section class="step-view fade-in">
        <!-- Barra de Ações Rápidas (Impressão / PDF) -->
        <div class="report-actions-bar no-print">
          <button id="print-report-btn" class="btn btn-secondary">
            🖨️ Imprimir / Salvar Laudo (PDF)
          </button>
          <button id="new-valuation-btn" class="btn btn-primary">
            🔄 Iniciar Novo Valuation
          </button>
        </div>

        <!-- DOCUMENTO FORMAL DO LAUDO DE AVALIAÇÃO -->
        <div class="valuation-formal-document" id="printable-report">
          <!-- Cabeçalho do Laudo -->
          <div class="doc-header">
            <div class="doc-seal">LAUDO TÉCNICO OFICIAL</div>
            <div class="doc-brand">
              <h2>ANIMVALUE CONSULTING CORP.</h2>
              <span>Comitê de Avaliação Econômica e Fusões & Aquisições (M&A)</span>
            </div>
            <div class="doc-meta">
              <span><strong>Data de Emissão:</strong> ${today}</span>
              <span><strong>Empresa Avaliada:</strong> ${comp.name}</span>
              <span><strong>CFO Responsável:</strong> Aluno / Usuário</span>
            </div>
          </div>

          <hr class="doc-divider"/>

          <!-- Desempenho do CFO -->
          <div class="doc-cfo-score-box">
            <div class="score-circle">
              <span class="score-number">${cfoEval.score}</span>
              <span class="score-label">/ 100 PTS</span>
            </div>
            <div class="score-text">
              <h3>${cfoEval.title}</h3>
              <p>${cfoEval.summary}</p>
            </div>
          </div>

          <!-- Resumo da Transação de M&A -->
          <div class="doc-section">
            <h4 class="doc-section-title">1. PARECER DE TRANSAÇÃO (M&A / RODADA DE INVESTIMENTO)</h4>
            <div class="ma-offer-banner">
              <div class="offer-col">
                <span class="off-label">Faixa Sugerida de Equity Value:</span>
                <span class="off-val">R$ ${minOffer.toFixed(1)}M – R$ ${maxOffer.toFixed(1)}M</span>
              </div>
              <div class="offer-col highlight-deal">
                <span class="off-label">Oferta Central Recomendada:</span>
                <span class="off-val-big">R$ ${recommendedOffer.toFixed(1)}M</span>
              </div>
              <div class="offer-col">
                <span class="off-label">Enterprise Value da Firma:</span>
                <span class="off-val">R$ ${valuation.enterpriseValue.toFixed(1)}M</span>
              </div>
            </div>
          </div>

          <!-- Tabela Resumo dos Métodos de Avaliação -->
          <div class="doc-section">
            <h4 class="doc-section-title">2. SÍNTESE METODOLÓGICA CONSOLIDADA</h4>
            <table class="doc-table">
              <thead>
                <tr>
                  <th>Metodologia</th>
                  <th>Especialista</th>
                  <th>Enterprise Value (EV)</th>
                  <th>Equity Value</th>
                  <th>Diagnóstico Técnico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Fluxo de Caixa Descontado (FCD)</strong></td>
                  <td>Doutor Fluxo</td>
                  <td>R$ ${valuation.enterpriseValue.toFixed(1)}M</td>
                  <td>R$ ${valuation.equityValue.toFixed(1)}M</td>
                  <td>WACC em ${(wacc * 100).toFixed(2)}%, Gordon g em ${(this.state.assumptions.terminalGrowth * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td><strong>Múltiplos de Mercado (EV/EBITDA)</strong></td>
                  <td>Madame Múltiplo</td>
                  <td>R$ ${(computed.relativeValuation.byEbitda.ev).toFixed(1)}M</td>
                  <td>R$ ${(computed.relativeValuation.byEbitda.equity).toFixed(1)}M</td>
                  <td>Mediana do setor em ${computed.sectorAverages.medianEvEbitda}x (Gap: ${discrepancy.gapPercentage.toFixed(1)}%)</td>
                </tr>
                <tr>
                  <td><strong>Valor Econômico Adicionado (EVA)</strong></td>
                  <td>Capitão EVA</td>
                  <td>-</td>
                  <td>Spread: ${(evaComparison.spread * 100).toFixed(1)}%</td>
                  <td>EVA Ano 1: R$ ${evaComparison.eva.toFixed(2)}M (${evaComparison.eva >= 0 ? 'Criação de Valor' : 'Destruição de Capital'})</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pareceres Assinados dos Especialistas -->
          <div class="doc-section">
            <h4 class="doc-section-title">3. PARECER INDIVIDUAL DOS ESPECIALISTAS</h4>
            <div class="doc-signatures-grid">
              <!-- Doutor Fluxo -->
              <div class="signature-box">
                <div class="sig-char">
                  <div class="char-avatar-micro">${characters.doctor.avatarSvg}</div>
                  <strong>${characters.doctor.name}</strong>
                </div>
                <p>
                  "A consistência do fluxo de caixa livre descontado garante que a companhia possui base intrínseca sólida. 
                  O peso do valor terminal foi mantido em ${valuation.terminalValuePercentage.toFixed(0)}% do EV."
                </p>
                <div class="sig-line">Assinado Digitalmente</div>
              </div>

              <!-- Madame Múltiplo -->
              <div class="signature-box">
                <div class="sig-char">
                  <div class="char-avatar-micro">${characters.madame.avatarSvg}</div>
                  <strong>${characters.madame.name}</strong>
                </div>
                <p>
                  "Múltiplo implícito de EV/EBITDA fixado em ${impliedMultiples.impliedEvEbitda.toFixed(1)}x. 
                  ${discrepancy.feedback.substring(0, 110)}..."
                </p>
                <div class="sig-line">Assinado Digitalmente</div>
              </div>

              <!-- Capitão EVA -->
              <div class="signature-box">
                <div class="sig-char">
                  <div class="char-avatar-micro">${characters.captain.avatarSvg}</div>
                  <strong>${characters.captain.name}</strong>
                </div>
                <p>
                  "Com ROIC de ${(evaComparison.roic * 100).toFixed(1)}% e WACC de ${(wacc * 100).toFixed(1)}%, 
                  a alocação de capital da empresa obteve nota ${evaComparison.eva >= 0 ? 'aprovada' : 'com ressalvas'} perante os acionistas."
                </p>
                <div class="sig-line">Assinado Digitalmente</div>
              </div>
            </div>
          </div>

          <!-- Rodapé Formal com Carimbo -->
          <div class="doc-footer">
            <div class="official-stamp">
              <span class="stamp-circle">ANIMVALUE<br/>CERTIFIED<br/>M&A 2026</span>
            </div>
            <div class="footer-legal">
              <p>Este laudo técnico foi gerado pelo simulador AnimValue: O Preço do Sucesso.</p>
              <p>Recomendado para apresentações a comitês de investimentos, bancas acadêmicas e bancos mandatários.</p>
            </div>
          </div>
        </div>
      </section>
    `;

    // Eventos
    container.querySelector('#print-report-btn')?.addEventListener('click', () => {
      window.print();
    });

    container.querySelector('#new-valuation-btn')?.addEventListener('click', () => {
      sound.playClick();
      this.state.loadCompany(this.state.selectedCompanyId);
      this.state.setStep(1);
    });
  }
}
