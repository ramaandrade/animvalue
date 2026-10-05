/**
 * dcfEngine.test.js
 * Testes unitários para o motor de Fluxo de Caixa Descontado (FCD)
 */

import assert from 'node:assert';
import { dcfEngine } from '../js/dcfEngine.js';

console.log('🧪 Executando testes de dcfEngine.js...');

// 1. Teste de CAPM
const ke = dcfEngine.calculateKeCAPM({
  riskFreeRate: 0.065,
  beta: 1.2,
  marketRiskPremium: 0.05,
});
assert.strictEqual(Math.round(ke * 1000) / 1000, 0.125, 'Ke deve ser 12.5%');
console.log('  ✓ Cálculo de Ke via CAPM validado (12.5%)');

// 2. Teste de WACC
const wacc = dcfEngine.calculateWACC({
  ke: 0.14,
  kd: 0.10,
  taxRate: 0.34,
  equityWeight: 0.60,
  debtWeight: 0.40,
});
// WACC = 0.6 * 0.14 + 0.4 * 0.10 * (1 - 0.34) = 0.084 + 0.0264 = 0.1104 (11.04%)
assert.strictEqual(Math.round(wacc * 10000) / 10000, 0.1104, 'WACC deve ser 11.04%');
console.log('  ✓ Cálculo de WACC validado (11.04%)');

// 3. Teste de Projeção de Fluxos de Caixa (5 anos)
const projections = dcfEngine.projectCashFlows({
  baseRevenue: 100,
  growthRates: [0.10, 0.10, 0.10, 0.10, 0.10],
  ebitdaMargins: 0.20,
  daRate: 0.04,
  taxRate: 0.34,
  capexRate: 0.05,
  nwcRate: 0.08,
});
assert.strictEqual(projections.length, 5, 'Deve gerar exatamente 5 anos');
assert.strictEqual(Math.round(projections[0].revenue * 10) / 10, 110.0, 'Ano 1 receita = 110');
assert.strictEqual(Math.round(projections[0].ebitda * 10) / 10, 22.0, 'Ano 1 EBITDA = 22.0');
assert.ok(projections[0].fcff > 0, 'FCFF deve ser positivo');
console.log(`  ✓ Projeção FCFF ano 1 = R$ ${projections[0].fcff.toFixed(2)}M validada`);

// 4. Teste de Valor Presente
const pvResults = dcfEngine.calculatePresentValues(projections, 0.1104);
assert.strictEqual(pvResults.discountedFlows.length, 5);
assert.ok(pvResults.sumPvFCFF > 0, 'Soma do VP dos fluxos deve ser positiva');
console.log(`  ✓ Soma VP dos fluxos explícitos = R$ ${pvResults.sumPvFCFF.toFixed(2)}M validada`);

// 5. Teste de Valor Terminal Gordon
const tv = dcfEngine.calculateTerminalValueGordon({
  lastFCFF: projections[4].fcff,
  terminalGrowth: 0.03,
  wacc: 0.1104,
  years: 5,
});
assert.ok(tv.nominalTerminalValue > 0, 'VT nominal deve ser positivo');
assert.ok(tv.pvTerminalValue > 0, 'VP do VT deve ser positivo');
assert.ok(tv.pvTerminalValue < tv.nominalTerminalValue, 'VP do VT deve ser menor que o nominal');
console.log(`  ✓ Valor Terminal descontado = R$ ${tv.pvTerminalValue.toFixed(2)}M validado`);

// 6. Teste de Valuation Total (Enterprise Value & Equity Value)
const val = dcfEngine.calculateValuation({
  sumPvFCFF: pvResults.sumPvFCFF,
  pvTerminalValue: tv.pvTerminalValue,
  cash: 15,
  grossDebt: 35,
});
assert.strictEqual(val.netDebt, 20, 'Dívida Líquida deve ser 35 - 15 = 20');
assert.strictEqual(val.enterpriseValue, pvResults.sumPvFCFF + tv.pvTerminalValue);
assert.strictEqual(val.equityValue, val.enterpriseValue - 20);
console.log(`  ✓ Enterprise Value = R$ ${val.enterpriseValue.toFixed(2)}M | Equity Value = R$ ${val.equityValue.toFixed(2)}M validado`);

console.log('✅ Todos os testes de dcfEngine passaram com sucesso!\n');
