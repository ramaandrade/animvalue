/**
 * ui.js
 * Controlador de Interface Mobile-First (Otimizado para Smartphone)
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

    // Barra de Navegação Inferior (Bottom Nav para Polegar)
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      bottomNav.querySelectorAll('.nav-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetStep = parseInt(btn.getAttribute('data-tab-step'), 10);
          sound.playClick();
          this.state.setStep(targetStep);
        });
      });
    }
  }

  render() {
    const step = this.state.currentStep;
    const comp = this.state.getCompany();
    const computed = this.state.computed;

    // Atualiza barra de progresso e métricas rápidas superiores no mobile
    this.updateHeaderProgress(step, computed);
    this.updateBottomNav(step);

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

  updateHeaderProgress(currentStep, computed) {
    // Atualiza a faixa superior de métricas rápidas (EV, Equity, WACC)
    if (computed && computed.valuation) {
      const evEl = document.getElementById('strip-ev');
      const eqEl = document.getElementById('strip-equity');
      const waccEl = document.getElementById('strip-wacc');
      if (evEl) evEl.textContent = `R$ ${computed.valuation.enterpriseValue.toFixed(1)}M`;
      if (eqEl) eqEl.textContent = `R$ ${computed.valuation.equityValue.toFixed(1)}M`;
      if (waccEl) waccEl.textContent = `${(computed.wacc * 100).toFixed(1)}%`;
    }

    const stepTitles = [
      'Diagnóstico Inicial',
      'Desafio FCD (Dr. Fluxo)',
      'Madame Múltiplo',
      'Choque da Inflação',
      'Capitão EVA',
      'Laudo M&A Final',
    ];

    const progressContainer = document.getElementById('journey-stepper');
    if (!progressContainer) return;

    const currentTitle = stepTitles[currentStep - 1] || 'Valuation';
    const progressPct = ((currentStep / 6) * 100).toFixed(0);

    let dotsHtml = '';
    for (let i = 1; i <= 6; i++) {
      const activeClass = i === currentStep ? 'active' : i < currentStep ? 'completed' : '';
      dotsHtml += `
        <button class="step-dot-btn ${activeClass}" data-step="${i}" title="${stepTitles[i - 1]}">
          ${i < currentStep ? '✓' : i}
        </button>
      `;
    }

    progressContainer.innerHTML = `
      <div class="stepper-header-info">
        <span class="stepper-title">${currentTitle}</span>
        <span class="stepper-step-count">Passo ${currentStep}/6</span>
      </div>
      <div class="stepper-progress-bar-bg">
        <div class="stepper-progress-fill" style="width: ${progressPct}%"></div>
      </div>
      <div class="stepper-track-mobile">
        ${dotsHtml}
      </div>
    `;

    progressContainer.querySelectorAll('.step-dot-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.getAttribute('data-step'), 10);
        sound.playClick();
        this.state.setStep(targetStep);
      });
    });
  }

  updateBottomNav(currentStep) {
    const bottomNav = document.getElementById('bottom-nav');
    if (!bottomNav) return;

    bottomNav.querySelectorAll('.nav-tab-btn').forEach((btn) => {
      const tabStep = parseInt(btn.getAttribute('data-tab-step'), 10);
      if (tabStep === currentStep) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // ==========================================
  // ETAPA 1: DIAGNÓSTICO INICIAL (MOBILE)
  // ==========================================
  renderStep1Diagnosis(container, comp, computed) {
    container.innerHTML = `
      <section class="step-view fade-in">
        <div class="hero-card">
          <div class="hero-badge">CFO SIMULATOR • MOBILE EDITION</div>
          <h2 class="hero-title">AnimValue: O Preço do Sucesso</h2>
          <p class="hero-subtitle">
            Você é o novo CFO da empresa. Um fundo internacional de Private Equity quer fazer uma 
            oferta de aquisição (M&A). Lidere o <strong>Valuation Consultivo</strong> e defenda o valor econômico do negócio!
          </p>
        </div>

        <!-- Seletor de Companhia -->
        <div class="section-card">
          <h3 class="section-title">🏢 Selecione a Empresa:</h3>
          <div class="company-selector-grid">
            <div class="company-card ${this.state.selectedCompanyId === 'techlog' ? 'selected' : ''}" data-id="techlog">
              <span class="comp-icon">🚚💻</span>
              <div class="company-card-info">
                <h4>TechLog Soluções</h4>
                <span class="sector-tag tech">Tech B2B</span>
                <p>Receita R$ 100M • Margem EBITDA 22%</p>
              </div>
            </div>
            <div class="company-card ${this.state.selectedCompanyId === 'biosaudedigital' ? 'selected' : ''}" data-id="biosaudedigital">
              <span class="comp-icon">🩺🔬</span>
              <div class="company-card-info">
                <h4>BioSaúde Care</h4>
                <span class="sector-tag saude">Saúde Digital</span>
                <p>Receita R$ 120M • Margem EBITDA 25%</p>
              </div>
            </div>
            <div class="company-card ${this.state.selectedCompanyId === 'omnivarejo' ? 'selected' : ''}" data-id="omnivarejo">
              <span class="comp-icon">🛍️📦</span>
              <div class="company-card-info">
                <h4>Conecta Varejo</h4>
                <span class="sector-tag varejo">Varejo Omni</span>
                <p>Receita R$ 180M • Margem EBITDA 13%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Dados Básicos da Empresa Escolhida -->
        <div class="section-card">
          <div class="card-header-flex">
            <div>
              <h3 class="section-title">${comp.icon} ${comp.name}</h3>
              <p class="section-desc">${comp.tagline}</p>
            </div>
            <span class="badge-status">Diagnóstico Base</span>
          </div>

          <div class="metrics-grid-4">
            <div class="metric-card">
              <span class="m-label">Receita LTM</span>
              <span class="m-value">R$ ${comp.baseRevenue.toFixed(0)}M</span>
            </div>
            <div class="metric-card">
              <span class="m-label">EBITDA Atual</span>
              <span class="m-value highlight">R$ ${(comp.baseRevenue * comp.baseEbitdaMargin).toFixed(1)}M</span>
              <span class="m-sub">Margem: ${(comp.baseEbitdaMargin * 100).toFixed(0)}%</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Dívida Líquida</span>
              <span class="m-value">R$ ${(comp.grossDebt - comp.cash).toFixed(0)}M</span>
              <span class="m-sub">Dív R$ ${comp.grossDebt}M / Cx R$ ${comp.cash}M</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Capital Investido</span>
              <span class="m-value">R$ ${comp.investedCapital.toFixed(0)}M</span>
              <span class="m-sub">Ativo Operacional</span>
            </div>
          </div>
        </div>

        <!-- Apresentação dos 3 Especialistas -->
        <div class="section-card">
          <h3 class="section-title">👥 Conselho Consultivo:</h3>
          <div class="characters-grid">
            <div class="character-card">
              <div class="char-avatar-mini">${characters.doctor.avatarSvg}</div>
              <div class="char-info">
                <h4>${characters.doctor.name}</h4>
                <span class="char-role">${characters.doctor.role}</span>
                <p>"Fluxo de caixa livre futuro trazido a valor presente é a única verdade intrínseca!"</p>
              </div>
            </div>
            <div class="character-card">
              <div class="char-avatar-mini">${characters.madame.avatarSvg}</div>
              <div class="char-info">
                <h4>${characters.madame.name}</h4>
                <span class="char-role">${characters.madame.role}</span>
                <p>"O mercado tem sempre uma opinião rápida. Olhe os múltiplos dos concorrentes!"</p>
              </div>
            </div>
            <div class="character-card">
              <div class="char-avatar-mini">${characters.captain.avatarSvg}</div>
              <div class="char-info">
                <h4>${characters.captain.name}</h4>
                <span class="char-role">${characters.captain.role}</span>
                <p>"Lucro contábil é ilusão se não pagar o custo de capital. Exija ROIC > WACC!"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ação Principal para Polegar -->
        <div class="action-footer">
          <button id="start-journey-btn" class="btn btn-primary btn-large glow">
            Iniciar o Desafio FCD ➔
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
              <span class="char-title">${characters.doctor.name}</span>
              <span class="tag-fcd">Fluxo de Caixa Descontado</span>
            </div>
            <p class="speech-text">
              "Toque e deslize para ajustar crescimento, margens e taxas. 
              Veja o <strong>Enterprise Value</strong> e o <strong>WACC</strong> mudando instantaneamente!"
            </p>
          </div>
        </div>

        <!-- Cenários Rápidos -->
        <div class="scenarios-bar">
          <span class="scenario-label">Cenários:</span>
          <button class="chip-btn ${this.state.activeScenario === 'otimista' ? 'active green' : ''}" data-scenario="otimista">
            🚀 Otimista
          </button>
          <button class="chip-btn ${this.state.activeScenario === 'base' ? 'active blue' : ''}" data-scenario="base">
            ⚖️ Base
          </button>
          <button class="chip-btn ${this.state.activeScenario === 'pessimista' ? 'active red' : ''}" data-scenario="pessimista">
            🌧️ Pessimista
          </button>
        </div>

        <!-- Sliders Táteis -->
        <div class="section-card">
          <h3 class="section-title">🎛️ Alavancas de Projeção:</h3>
          <div class="sliders-grid">
            <!-- 1. Crescimento de Receita -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-growth">Crescimento Anual (g)</label>
                <span class="slider-badge" id="val-growth">${(p.growthRate * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-growth" min="0.02" max="0.30" step="0.005" value="${p.growthRate}">
              <div class="slider-bounds"><span>2.0%</span><span>30.0%</span></div>
            </div>

            <!-- 2. Margem EBITDA -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-margin">Margem EBITDA</label>
                <span class="slider-badge highlight" id="val-margin">${(p.ebitdaMargin * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-margin" min="0.05" max="0.35" step="0.005" value="${p.ebitdaMargin}">
              <div class="slider-bounds"><span>5.0%</span><span>35.0%</span></div>
            </div>

            <!-- 3. Crescimento Perpétuo Gordon (g terminal) -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-term-growth">Crescimento Perpétuo (g)</label>
                <span class="slider-badge" id="val-term-growth">${(p.terminalGrowth * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-term-growth" min="0.01" max="0.045" step="0.002" value="${p.terminalGrowth}">
              <div class="slider-bounds"><span>1.0%</span><span>4.5%</span></div>
            </div>

            <!-- 4. Custo da Dívida Bruto (Kd) -->
            <div class="slider-control">
              <div class="slider-header">
                <label for="sl-kd">Custo da Dívida (Kd)</label>
                <span class="slider-badge" id="val-kd">${(p.kdGross * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-kd" min="0.06" max="0.22" step="0.005" value="${p.kdGross}">
              <div class="slider-bounds"><span>6.0%</span><span>22.0%</span></div>
            </div>

            <!-- 5. Taxa Livre de Risco (Rf) -->
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
                <label for="sl-capex">Capex (% Receita)</label>
                <span class="slider-badge" id="val-capex">${(p.capexRate * 100).toFixed(1)}%</span>
              </div>
              <input type="range" id="sl-capex" min="0.02" max="0.12" step="0.005" value="${p.capexRate}">
              <div class="slider-bounds"><span>2.0%</span><span>12.0%</span></div>
            </div>
          </div>
        </div>

        <!-- Placar Resumo do Valuation FCD -->
        <div class="valuation-summary-strip">
          <div class="summary-pill highlight-blue">
            <span class="pill-title">Enterprise Value</span>
            <span class="pill-value">R$ ${valuation.enterpriseValue.toFixed(1)}M</span>
            <span class="pill-sub">Firma Total</span>
          </div>
          <div class="summary-pill highlight-green">
            <span class="pill-title">Equity Value</span>
            <span class="pill-value">R$ ${valuation.equityValue.toFixed(1)}M</span>
            <span class="pill-sub">Sócios (EV - Dív. Líq)</span>
          </div>
          <div class="summary-pill">
            <span class="pill-title">WACC</span>
            <span class="pill-value">${(wacc * 100).toFixed(2)}%</span>
            <span class="pill-sub">Ke ${(ke * 100).toFixed(1)}% | Kd líq ${(p.kdGross * (1 - comp.taxRate) * 100).toFixed(1)}%</span>
          </div>
          <div class="summary-pill">
            <span class="pill-title">Valor Terminal</span>
            <span class="pill-value">${valuation.terminalValuePercentage.toFixed(0)}%</span>
            <span class="pill-sub">Peso no EV Total</span>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="charts-double-grid">
          <div class="section-card">
            <h4 class="card-subtitle">📊 Fluxos Projetados Descontados</h4>
            <div id="fcff-chart-mount"></div>
          </div>
          <div class="section-card">
            <h4 class="card-subtitle">🌉 Ponte de Valor (EV para Equity)</h4>
            <div id="waterfall-chart-mount"></div>
          </div>
        </div>

        <!-- Tabela DRE Projetada com Scroll Tátil -->
        <div class="section-card">
          <h4 class="card-subtitle">📋 DRE e FCFF Projetado (5 Anos)</h4>
          <div class="table-scroll-hint">👉 Deslize horizontalmente para navegar</div>
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
                  <td>Receita</td>
                  ${projections.map((p) => `<td>${p.revenue.toFixed(0)}M</td>`).join('')}
                </tr>
                <tr>
                  <td>EBITDA</td>
                  ${projections.map((p) => `<td>${p.ebitda.toFixed(1)}M</td>`).join('')}
                </tr>
                <tr>
                  <td>NOPAT</td>
                  ${projections.map((p) => `<td>${p.nopat.toFixed(1)}M</td>`).join('')}
                </tr>
                <tr class="fcf-row">
                  <td><strong>FCFF</strong></td>
                  ${projections.map((p) => `<td><strong>${p.fcff.toFixed(1)}M</strong></td>`).join('')}
                </tr>
                <tr class="pv-row">
                  <td>VP FCFF</td>
                  ${computed.pvFlows.discountedFlows.map((p) => `<td>${p.pvFCFF.toFixed(1)}M</td>`).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Próxima Etapa -->
        <div class="action-footer">
          <button id="goto-step3-btn" class="btn btn-primary btn-large">
            Avançar para Madame Múltiplo ➔
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
              <span class="char-title">${characters.madame.name}</span>
              <span class="tag-multiples">Avaliação Relativa</span>
            </div>
            <p class="speech-text">
              "O Doutor Fluxo ama fórmulas, mas os investidores compram comparando com a bolsa! 
              Veja como seu EV/EBITDA se posiciona diante dos concorrentes:"
            </p>
          </div>
        </div>

        <!-- Parecer do Gap de Valuation -->
        <div class="discrepancy-card" style="border-left-color: ${discrepancy.color};">
          <div class="discrepancy-header">
            <h4>${discrepancy.status}</h4>
            <span class="gap-badge" style="background: ${discrepancy.color}22; color: ${discrepancy.color}; border: 1px solid ${discrepancy.color};">
              Gap: ${discrepancy.gapPercentage >= 0 ? '+' : ''}${discrepancy.gapPercentage.toFixed(1)}%
            </span>
          </div>
          <p class="discrepancy-feedback">${discrepancy.feedback}</p>
        </div>

        <!-- Comparação de Métricas Implícitas vs Setor -->
        <div class="multiples-comparison-grid">
          <div class="metric-box">
            <span class="m-sub">EV/EBITDA Implícito</span>
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
        </div>

        <!-- Gráfico Comparativo -->
        <div class="section-card">
          <h4 class="card-subtitle">📊 EV/EBITDA vs Pares de Mercado</h4>
          <div id="multiples-chart-mount"></div>
        </div>

        <!-- Tabela de Comparáveis de Mercado -->
        <div class="section-card">
          <h4 class="card-subtitle">🏢 Comparáveis do Setor (${comp.sector.toUpperCase()})</h4>
          <div class="table-scroll-hint">👉 Deslize horizontalmente para ver os pares</div>
          <div class="table-responsive">
            <table class="financial-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>EV/EBITDA</th>
                  <th>P/L</th>
                  <th>EV/Rec.</th>
                </tr>
              </thead>
              <tbody>
                <tr class="highlight-user-row">
                  <td><strong>${comp.name}</strong></td>
                  <td><strong>${impliedMultiples.impliedEvEbitda.toFixed(1)}x</strong></td>
                  <td><strong>${impliedMultiples.impliedPe.toFixed(1)}x</strong></td>
                  <td><strong>${impliedMultiples.impliedEvRevenue.toFixed(1)}x</strong></td>
                </tr>
                ${peers
                  .map(
                    (p) => `
                  <tr>
                    <td>${p.name.split(' ')[0]}</td>
                    <td>${p.evEbitda.toFixed(1)}x</td>
                    <td>${p.peRatio.toFixed(1)}x</td>
                    <td>${p.evRevenue.toFixed(1)}x</td>
                  </tr>
                `
                  )
                  .join('')}
                <tr class="median-row">
                  <td><strong>Mediana</strong></td>
                  <td><strong>${sectorAverages.medianEvEbitda.toFixed(1)}x</strong></td>
                  <td><strong>${sectorAverages.medianPe.toFixed(1)}x</strong></td>
                  <td><strong>${sectorAverages.medianEvRevenue.toFixed(1)}x</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Confronto: FCD vs Valuation Relativo -->
        <div class="section-card">
          <h4 class="card-subtitle">⚖️ FCD Intrínseco vs Múltiplos de Mercado</h4>
          <div class="methods-compare-grid">
            <div class="method-card">
              <span class="m-title">FCD (Doutor Fluxo):</span>
              <span class="m-val">R$ ${valuation.enterpriseValue.toFixed(1)}M</span>
            </div>
            <div class="method-card">
              <span class="m-title">EV/EBITDA Mediano:</span>
              <span class="m-val">R$ ${relativeValuation.byEbitda.ev.toFixed(1)}M</span>
            </div>
          </div>
        </div>

        <!-- Ação para o Choque da Inflação -->
        <div class="action-footer double-actions">
          <button id="back-to-fcd" class="btn btn-secondary">
            ⬅️ Ajustar FCD
          </button>
          <button id="goto-step4-btn" class="btn btn-primary glow-warning">
            🔥 Choque da Inflação! ➔
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
  // ETAPA 4: SOBREVIVENDO À INFLAÇÃO (MOBILE)
  // ==========================================
  renderStep4InflationShock(container, comp, computed) {
    const shockData = this.state.macroShockState;
    const choices = shockData.selectedChoices;

    container.innerHTML = `
      <section class="step-view fade-in">
        <!-- Alerta de Choque Macroeconômico -->
        <div class="macro-crisis-banner">
          <div class="crisis-badge">⚠️ CRISE MACROECONÔMICA</div>
          <h2>🔥 Inflação a 9,8% & Explosão de Juros!</h2>
          <p>
            O Banco Central elevou a Selic. Taxa livre de risco (+5,0 p.p.) e juros bancários (+5,5 p.p.) dispararam, 
            e custos operacionais pressionam sua margem EBITDA em até 3,5 pontos percentuais!
          </p>
        </div>

        <!-- Regra de Ouro -->
        <div class="lesson-box">
          <h4>💡 A Regra de Ouro do CFO sob Inflação:</h4>
          <p>
            Para o valor não desabar, o fluxo de caixa precisa crescer acima do aumento do custo de capital:
            <span class="formula-highlight">g (caixa) > ΔWACC</span>!
          </p>
        </div>

        <!-- 3 Decisões Táticas do Jogador -->
        <div class="section-card">
          <h3 class="section-title">🛡️ Decisões Táticas do CFO:</h3>

          <!-- Decisão 1: Precificação -->
          <div class="decision-block">
            <h4>1. Poder de Preço (Pricing Power):</h4>
            <div class="choice-cards-grid">
              <label class="choice-card ${choices.pricing === 'full_pass' ? 'active' : ''}">
                <input type="radio" name="opt-pricing" value="full_pass" ${choices.pricing === 'full_pass' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge green">Repasse Integral (+9.8%)</span>
                  <p>Repassar toda a inflação. Margem EBITDA blindada, leve queda de volume (-3%).</p>
                </div>
              </label>
              <label class="choice-card ${choices.pricing === 'partial_pass' ? 'active' : ''}">
                <input type="radio" name="opt-pricing" value="partial_pass" ${choices.pricing === 'partial_pass' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge amber">Repasse Parcial (+5.0%)</span>
                  <p>Absorver metade para defender mercado. Margem EBITDA comprime 2,0 p.p.</p>
                </div>
              </label>
              <label class="choice-card ${choices.pricing === 'value_added' ? 'active' : ''}">
                <input type="radio" name="opt-pricing" value="value_added" ${choices.pricing === 'value_added' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge blue">Reempacotamento Premium</span>
                  <p>Reajuste de 7% com novos serviços de alto valor. Margem e fidelidade protegidas.</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Decisão 2: Eficiência e Capex -->
          <div class="decision-block">
            <h4>2. Eficiência de Custos e Capex:</h4>
            <div class="choice-cards-grid">
              <label class="choice-card ${choices.efficiency === 'austerity' ? 'active' : ''}">
                <input type="radio" name="opt-efficiency" value="austerity" ${choices.efficiency === 'austerity' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge green">Austeridade & Foco em Caixa</span>
                  <p>Capex cai de 5% para 3% da receita. Preserva fluxo de caixa livre imediato.</p>
                </div>
              </label>
              <label class="choice-card ${choices.efficiency === 'keep_investing' ? 'active' : ''}">
                <input type="radio" name="opt-efficiency" value="keep_investing" ${choices.efficiency === 'keep_investing' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge red">Expansão Agressiva</span>
                  <p>Manter Capex acelerado para ganhar terreno de concorrentes em apuros.</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Decisão 3: Estrutura de Capital -->
          <div class="decision-block">
            <h4>3. Gestão da Dívida com Juros Altos:</h4>
            <div class="choice-cards-grid">
              <label class="choice-card ${choices.capital_structure === 'deleveraging' ? 'active' : ''}">
                <input type="radio" name="opt-capital" value="deleveraging" ${choices.capital_structure === 'deleveraging' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge green">Desalavancar R$ 10M com Caixa</span>
                  <p>Amortizar dívidas flutuantes caras, reduzindo risco e aliviando o WACC.</p>
                </div>
              </label>
              <label class="choice-card ${choices.capital_structure === 'hold_cash' ? 'active' : ''}">
                <input type="radio" name="opt-capital" value="hold_cash" ${choices.capital_structure === 'hold_cash' ? 'checked' : ''}>
                <div class="choice-content">
                  <span class="c-badge blue">Preservar Caixa em Renda Fixa</span>
                  <p>Manter colchão de liquidez rendendo a nova Selic alta pós-fixada.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Métricas Pós-Decisões -->
        <div class="section-card">
          <h4 class="card-subtitle">📈 Valuation Após Medidas do CFO</h4>
          <div class="metrics-grid-3">
            <div class="metric-card">
              <span class="m-label">WACC Final</span>
              <span class="m-value highlight">${(computed.wacc * 100).toFixed(1)}%</span>
            </div>
            <div class="metric-card">
              <span class="m-label">EV Protegido</span>
              <span class="m-value">R$ ${computed.valuation.enterpriseValue.toFixed(1)}M</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Equity Sócios</span>
              <span class="m-value highlight-green">R$ ${computed.valuation.equityValue.toFixed(1)}M</span>
            </div>
          </div>
        </div>

        <!-- Ação para o Capitão EVA -->
        <div class="action-footer">
          <button id="goto-step5-btn" class="btn btn-primary btn-large">
            O Julgamento do Capitão EVA ➔
          </button>
        </div>
      </section>
    `;

    // Handlers de rádio
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
  // ETAPA 5: O JULGAMENTO DO CAPITÃO EVA (MOBILE)
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
              <span class="char-title">${characters.captain.name}</span>
              <span class="tag-eva">Valor Econômico Adicionado (EVA)</span>
            </div>
            <p class="speech-text">
              "Bem-vindo ao tribunal da riqueza! 
              Não comemore lucro contábil na DRE se o seu retorno (ROIC) não cobrir o custo de capital (WACC)!"
            </p>
          </div>
        </div>

        <!-- Veredito EVA -->
        <div class="eva-verdict-card ${evaComparison.badgeType}">
          <div class="verdict-header">
            <h4>${evaComparison.statusText}</h4>
            <span class="eva-pill-tag">
              EVA: R$ ${evaComparison.eva >= 0 ? '+' : ''}${evaComparison.eva.toFixed(2)}M
            </span>
          </div>
          <p class="verdict-explanation">${evaComparison.explanation}</p>
        </div>

        <!-- Gráfico de Spread ROIC vs WACC -->
        <div class="section-card">
          <h4 class="card-subtitle">🎯 O Teste da Riqueza: ROIC vs WACC</h4>
          <div id="eva-chart-mount"></div>
        </div>

        <!-- Paradoxo Didático -->
        <div class="section-card">
          <h4 class="card-subtitle">⚖️ O Paradoxo Contábil vs Econômico</h4>
          <div class="accounting-vs-economic-grid">
            <div class="box-method">
              <div class="box-head">
                <h5>Visão Contábil (DRE)</h5>
                <span class="tag-acc">DRE</span>
              </div>
              <ul class="method-calc-list">
                <li><span>Lucro Operacional (EBIT):</span> <strong>R$ ${computed.projections[0].ebit.toFixed(1)}M</strong></li>
                <li><span>Despesas Financeiras (Juros):</span> <strong>-R$ ${(computed.valuation.grossDebt * this.state.assumptions.kdGross).toFixed(1)}M</strong></li>
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
                <h5>Visão Econômica (EVA)</h5>
                <span class="tag-eco">EVA</span>
              </div>
              <ul class="method-calc-list">
                <li><span>NOPAT Operacional:</span> <strong>R$ ${evaComparison.nopat.toFixed(1)}M</strong></li>
                <li><span>Custo do Capital (CI × WACC):</span> <strong>-R$ ${evaComparison.capitalCharge.toFixed(2)}M</strong></li>
                <li class="result-line">
                  <span>Valor Econômico Adicionado:</span> 
                  <strong class="${evaComparison.eva >= 0 ? 'color-green' : 'color-red'}">
                    R$ ${evaComparison.eva >= 0 ? '+' : ''}${evaComparison.eva.toFixed(2)}M
                  </strong>
                </li>
              </ul>
              <div class="box-footer">
                ${evaComparison.eva >= 0 ? '🌟 Riqueza Genuína Criada' : '⚠️ Destruição de Capital'}
              </div>
            </div>
          </div>
        </div>

        <!-- Botão para Laudo de Avaliação -->
        <div class="action-footer">
          <button id="goto-step6-btn" class="btn btn-primary btn-large glow-gold">
            Emitir Laudo de Avaliação Final ➔
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
  // ETAPA 6: LAUDO DE AVALIAÇÃO FINAL (MOBILE)
  // ==========================================
  renderStep6ValuationReport(container, comp, computed) {
    const { valuation, impliedMultiples, discrepancy, evaComparison, wacc } = computed;
    const cfoEval = this.state.evaluateCFOPerformance();
    const today = new Date().toLocaleDateString('pt-BR');

    // Oferta recomendada de M&A
    const minOffer = valuation.equityValue * 0.95;
    const maxOffer = valuation.equityValue * 1.10;
    const recommendedOffer = (minOffer + maxOffer) / 2;

    container.innerHTML = `
      <section class="step-view fade-in">
        <!-- Ações Rápidas -->
        <div class="report-actions-bar no-print">
          <button id="print-report-btn" class="btn btn-secondary">
            🖨️ Salvar PDF
          </button>
          <button id="new-valuation-btn" class="btn btn-primary">
            🔄 Novo Valuation
          </button>
        </div>

        <!-- DOCUMENTO FORMAL DO LAUDO DE AVALIAÇÃO -->
        <div class="valuation-formal-document" id="printable-report">
          <!-- Cabeçalho -->
          <div class="doc-header">
            <div class="doc-seal">LAUDO TÉCNICO OFICIAL</div>
            <div class="doc-brand">
              <h2>ANIMVALUE CONSULTING</h2>
              <span>Comitê de Avaliação Econômica e M&A</span>
            </div>
            <div class="doc-meta">
              <span><strong>Data:</strong> ${today}</span>
              <span><strong>Empresa:</strong> ${comp.name}</span>
            </div>
          </div>

          <hr class="doc-divider"/>

          <!-- Score do CFO -->
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

          <!-- Proposta de M&A -->
          <div class="doc-section">
            <h4 class="doc-section-title">1. PROPOSTA DE TRANSAÇÃO (M&A)</h4>
            <div class="ma-offer-banner">
              <div class="offer-col highlight-deal">
                <span class="off-label">Oferta Central Recomendada:</span>
                <span class="off-val-big">R$ ${recommendedOffer.toFixed(1)}M</span>
              </div>
              <div class="offer-col">
                <span class="off-label">Faixa Negociada:</span>
                <span class="off-val">R$ ${minOffer.toFixed(0)}M – R$ ${maxOffer.toFixed(0)}M</span>
              </div>
              <div class="offer-col">
                <span class="off-label">Enterprise Value:</span>
                <span class="off-val">R$ ${valuation.enterpriseValue.toFixed(1)}M</span>
              </div>
            </div>
          </div>

          <!-- Pareceres Individuais -->
          <div class="doc-section">
            <h4 class="doc-section-title">2. PARECER DOS CONSULTORES</h4>
            <div class="doc-signatures-grid">
              <!-- Dr. Fluxo -->
              <div class="signature-box">
                <div class="sig-char">
                  <div class="char-avatar-micro">${characters.doctor.avatarSvg}</div>
                  <strong>${characters.doctor.name}</strong>
                </div>
                <p>"Fluxo descontado sólido com WACC de ${(wacc * 100).toFixed(1)}%. O valor terminal responde por ${valuation.terminalValuePercentage.toFixed(0)}% do EV."</p>
                <div class="sig-line">Assinado Digitalmente</div>
              </div>

              <!-- Madame Múltiplo -->
              <div class="signature-box">
                <div class="sig-char">
                  <div class="char-avatar-micro">${characters.madame.avatarSvg}</div>
                  <strong>${characters.madame.name}</strong>
                </div>
                <p>"Múltiplo EV/EBITDA de ${impliedMultiples.impliedEvEbitda.toFixed(1)}x. Discrepância vs setor: ${discrepancy.gapPercentage.toFixed(1)}%."</p>
                <div class="sig-line">Assinado Digitalmente</div>
              </div>

              <!-- Capitão EVA -->
              <div class="signature-box">
                <div class="sig-char">
                  <div class="char-avatar-micro">${characters.captain.avatarSvg}</div>
                  <strong>${characters.captain.name}</strong>
                </div>
                <p>"ROIC de ${(evaComparison.roic * 100).toFixed(1)}% e EVA de R$ ${evaComparison.eva.toFixed(2)}M. Criação de valor aprovada."</p>
                <div class="sig-line">Assinado Digitalmente</div>
              </div>
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
