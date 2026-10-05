/**
 * chartRenderer.js
 * Renderizador de Gráficos SVG Nativos, Leves e Reativos
 * AnimValue: O Preço do Sucesso
 */

export const chartRenderer = {
  /**
   * Renderiza o Gráfico de Barras dos Fluxos de Caixa (FCFF) dos 5 anos + Valor Terminal
   */
  renderCashFlowChart(containerId, projections, tvResult) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = projections.map((p) => ({
      label: `Ano ${p.year}`,
      nominal: p.fcff,
      pv: p.pvFCFF || p.fcff,
    }));

    // Adiciona o Valor Terminal Descontado
    if (tvResult) {
      data.push({
        label: 'VP Term.',
        nominal: tvResult.nominalTerminalValue,
        pv: tvResult.pvTerminalValue,
        isTerminal: true,
      });
    }

    const maxVal = Math.max(...data.map((d) => d.pv), 10);
    const chartHeight = 160;
    const barWidth = 36;
    const gap = 16;
    const totalWidth = data.length * (barWidth + gap) + 30;

    let barsSvg = '';
    data.forEach((d, idx) => {
      const x = 20 + idx * (barWidth + gap);
      const h = Math.max(4, (d.pv / maxVal) * (chartHeight - 40));
      const y = chartHeight - 25 - h;
      const color = d.isTerminal ? '#6366f1' : '#3b82f6';

      barsSvg += `
        <g class="chart-bar-group" tabindex="0">
          <!-- Barra de Valor Presente -->
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${color}" opacity="0.9">
            <title>${d.label}: R$ ${d.pv.toFixed(1)}M (VP)</title>
          </rect>
          <!-- Rótulo do Valor -->
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="10" font-weight="700" fill="#f8fafc" text-anchor="middle">
            ${d.pv.toFixed(0)}M
          </text>
          <!-- Rótulo do Eixo X -->
          <text x="${x + barWidth / 2}" y="${chartHeight - 8}" font-size="10" fill="#94a3b8" text-anchor="middle">
            ${d.label}
          </text>
        </g>
      `;
    });

    container.innerHTML = `
      <div class="chart-wrapper">
        <svg viewBox="0 0 ${totalWidth} ${chartHeight}" class="responsive-svg" preserveAspectRatio="xMidYMid meet">
          <!-- Linha de Base -->
          <line x1="10" y1="${chartHeight - 25}" x2="${totalWidth - 10}" y2="${chartHeight - 25}" stroke="#334155" stroke-width="1.5"/>
          ${barsSvg}
        </svg>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#3b82f6"></span> VP FCFF (Anos 1-5)</span>
          <span class="legend-item"><span class="legend-dot" style="background:#6366f1"></span> VP Valor Terminal</span>
        </div>
      </div>
    `;
  },

  /**
   * Renderiza a Ponte / Cascata de Valuation (Enterprise Value -> Dívida Líquida -> Equity Value)
   */
  renderValuationWaterfall(containerId, valuation) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { sumPvFCFF, pvTerminalValue, enterpriseValue, netDebt, equityValue } = valuation;

    const items = [
      { label: 'VP Fluxos', value: sumPvFCFF, color: '#3b82f6', sign: '+' },
      { label: 'VP Terminal', value: pvTerminalValue, color: '#8b5cf6', sign: '+' },
      { label: 'Enterprise Val.', value: enterpriseValue, color: '#06b6d4', isTotal: true },
      { label: 'Dív. Líquida', value: netDebt, color: '#ef4444', sign: '-' },
      { label: 'Equity Value', value: equityValue, color: '#10b981', isTotal: true },
    ];

    const maxVal = Math.max(...items.map((i) => Math.abs(i.value)), 10);
    const height = 150;
    const barWidth = 44;
    const gap = 16;
    const totalWidth = items.length * (barWidth + gap) + 30;

    let barsSvg = '';
    items.forEach((item, idx) => {
      const x = 15 + idx * (barWidth + gap);
      const h = Math.max(6, (Math.abs(item.value) / maxVal) * (height - 45));
      const y = height - 25 - h;

      barsSvg += `
        <g class="waterfall-bar-group">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${item.color}" opacity="0.95"/>
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="10" font-weight="700" fill="#f8fafc" text-anchor="middle">
            R$ ${item.value.toFixed(0)}M
          </text>
          <text x="${x + barWidth / 2}" y="${height - 8}" font-size="9" fill="#94a3b8" text-anchor="middle">
            ${item.label}
          </text>
        </g>
      `;
    });

    container.innerHTML = `
      <div class="chart-wrapper">
        <svg viewBox="0 0 ${totalWidth} ${height}" class="responsive-svg" preserveAspectRatio="xMidYMid meet">
          <line x1="5" y1="${height - 25}" x2="${totalWidth - 5}" y2="${height - 25}" stroke="#334155" stroke-width="1.5"/>
          ${barsSvg}
        </svg>
      </div>
    `;
  },

  /**
   * Renderiza o Gráfico de Spread ROIC vs WACC (Criação ou Destruição de Valor)
   */
  renderROICvsWACCChart(containerId, roic, wacc, eva) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const roicPct = roic * 100;
    const waccPct = wacc * 100;
    const spreadPct = roicPct - waccPct;
    const isCreating = spreadPct >= 0;

    const maxPct = Math.max(roicPct, waccPct, 20) * 1.25;
    const height = 140;
    const width = 280;

    const roicHeight = (roicPct / maxPct) * (height - 40);
    const waccHeight = (waccPct / maxPct) * (height - 40);

    const roicY = height - 25 - roicHeight;
    const waccY = height - 25 - waccHeight;

    const spreadColor = isCreating ? '#10b981' : '#ef4444';

    container.innerHTML = `
      <div class="chart-wrapper">
        <svg viewBox="0 0 ${width} ${height}" class="responsive-svg">
          <line x1="20" y1="${height - 25}" x2="${width - 20}" y2="${height - 25}" stroke="#334155" stroke-width="1.5"/>
          
          <!-- Barra ROIC -->
          <rect x="50" y="${roicY}" width="50" height="${roicHeight}" rx="5" fill="#10b981"/>
          <text x="75" y="${roicY - 6}" font-size="11" font-weight="700" fill="#10b981" text-anchor="middle">
            ${roicPct.toFixed(1)}%
          </text>
          <text x="75" y="${height - 8}" font-size="10" fill="#94a3b8" text-anchor="middle">ROIC</text>

          <!-- Barra WACC -->
          <rect x="130" y="${waccY}" width="50" height="${waccHeight}" rx="5" fill="#f59e0b"/>
          <text x="155" y="${waccY - 6}" font-size="11" font-weight="700" fill="#f59e0b" text-anchor="middle">
            ${waccPct.toFixed(1)}%
          </text>
          <text x="155" y="${height - 8}" font-size="10" fill="#94a3b8" text-anchor="middle">WACC</text>

          <!-- Indicador de Spread -->
          <circle cx="230" cy="${height / 2 - 5}" r="26" fill="${spreadColor}" opacity="0.15"/>
          <circle cx="230" cy="${height / 2 - 5}" r="22" fill="none" stroke="${spreadColor}" stroke-width="2.5"/>
          <text x="230" y="${height / 2 - 9}" font-size="9" fill="#94a3b8" text-anchor="middle">Spread</text>
          <text x="230" y="${height / 2 + 6}" font-size="11" font-weight="800" fill="${spreadColor}" text-anchor="middle">
            ${spreadPct >= 0 ? '+' : ''}${spreadPct.toFixed(1)}%
          </text>
        </svg>
        <div class="eva-summary-pill" style="border-color:${spreadColor}; color:${spreadColor};">
          ${isCreating ? '✨ CRIAÇÃO DE VALOR ECONÔMICO' : '⚠️ DESTRUIÇÃO DE VALOR ECONÔMICO'}
          (EVA: R$ ${eva >= 0 ? '+' : ''}${eva.toFixed(2)}M)
        </div>
      </div>
    `;
  },

  /**
   * Renderiza a comparação de Múltiplos EV/EBITDA da Empresa vs Pares
   */
  renderMultiplesComparison(containerId, companyImpliedMultiple, peers, sectorMedian) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = [
      { name: 'Sua Empresa', multiple: companyImpliedMultiple, isUser: true },
      ...peers.map((p) => ({ name: p.name.split(' ')[0], multiple: p.evEbitda })),
      { name: 'Mediana Setor', multiple: sectorMedian, isMedian: true },
    ];

    const maxMul = Math.max(...data.map((d) => d.multiple), 20) * 1.2;
    const height = 150;
    const barWidth = 32;
    const gap = 12;
    const totalWidth = data.length * (barWidth + gap) + 20;

    let bars = '';
    data.forEach((d, idx) => {
      const x = 10 + idx * (barWidth + gap);
      const h = Math.max(5, (d.multiple / maxMul) * (height - 40));
      const y = height - 25 - h;
      let color = '#64748b';
      if (d.isUser) color = '#ec4899';
      if (d.isMedian) color = '#f59e0b';

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${color}"/>
          <text x="${x + barWidth / 2}" y="${y - 5}" font-size="10" font-weight="700" fill="#f8fafc" text-anchor="middle">
            ${d.multiple.toFixed(1)}x
          </text>
          <text x="${x + barWidth / 2}" y="${height - 8}" font-size="8.5" fill="#94a3b8" text-anchor="middle">
            ${d.name}
          </text>
        </g>
      `;
    });

    container.innerHTML = `
      <div class="chart-wrapper">
        <svg viewBox="0 0 ${totalWidth} ${height}" class="responsive-svg">
          <line x1="5" y1="${height - 25}" x2="${totalWidth - 5}" y2="${height - 25}" stroke="#334155" stroke-width="1.5"/>
          ${bars}
        </svg>
      </div>
    `;
  },
};
