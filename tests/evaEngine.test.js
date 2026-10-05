/**
 * evaEngine.test.js
 * Testes unitários para o motor de Valor Econômico Adicionado (Capitão EVA)
 */

import assert from 'node:assert';
import { evaEngine } from '../js/evaEngine.js';

console.log('🧪 Executando testes de evaEngine.js...');

// 1. Cálculo de NOPAT
const nopat = evaEngine.calculateNOPAT(20, 0.34);
assert.strictEqual(Math.round(nopat * 100) / 100, 13.20, 'NOPAT deve ser 20 * 0.66 = 13.20');
console.log('  ✓ NOPAT validado (13.20M)');

// 2. Cálculo de Capital Charge e EVA Positivo
const evaPos = evaEngine.calculateEVA({
  nopat: 15,
  investedCapital: 100,
  wacc: 0.12,
});
assert.strictEqual(evaPos.capitalCharge, 12, 'Capital charge = 100 * 12% = 12');
assert.strictEqual(evaPos.eva, 3, 'EVA = 15 - 12 = 3');
assert.strictEqual(evaPos.roic, 0.15, 'ROIC = 15%');
assert.strictEqual(evaPos.spread, 0.03, 'Spread = +3%');
assert.strictEqual(evaPos.isCreatingValue, true, 'Deve indicar criação de valor');
console.log('  ✓ Criação de valor positiva (EVA = +R$ 3M, Spread = +3%) validada');

// 3. Paradoxo Contábil: Lucro Líquido Positivo vs. EVA Negativo (Destruição de Riqueza)
const paradox = evaEngine.compareAccountingVsEconomic({
  ebit: 18,
  financialExpenses: 8,
  taxRate: 0.34,
  investedCapital: 110,
  wacc: 0.135,
});
// Lucro Líquido = (18 - 8) * (1 - 0.34) = 10 * 0.66 = 6.6M (Positivo!)
assert.strictEqual(Math.round(paradox.netAccountingProfit * 100) / 100, 6.60);
// NOPAT = 18 * 0.66 = 11.88M
// Capital Charge = 110 * 0.135 = 14.85M
// EVA = 11.88 - 14.85 = -2.97M (Negativo!)
assert.ok(paradox.netAccountingProfit > 0, 'Lucro contábil deve ser positivo');
assert.ok(paradox.eva < 0, 'EVA deve ser negativo');
assert.strictEqual(paradox.paradoxCase, true, 'Deve acusar o paradoxo de destruição de riqueza!');
console.log(`  ✓ Paradoxo comprovado: Lucro Contábil = +R$ ${paradox.netAccountingProfit.toFixed(2)}M mas EVA = R$ ${paradox.eva.toFixed(2)}M!`);

console.log('✅ Todos os testes de evaEngine passaram com sucesso!\n');
