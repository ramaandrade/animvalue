/**
 * multiplesEngine.test.js
 * Testes unitários para o motor de múltiplos de mercado (Madame Múltiplo)
 */

import assert from 'node:assert';
import { multiplesEngine } from '../js/multiplesEngine.js';

console.log('🧪 Executando testes de multiplesEngine.js...');

// 1. Obtenção de pares
const peers = multiplesEngine.getSectorPeers('tech');
assert.ok(peers.length >= 3, 'Deve haver pelo menos 3 pares');
console.log(`  ✓ Encontrados ${peers.length} pares no setor de tecnologia`);

// 2. Médias e medianas
const averages = multiplesEngine.calculateSectorAverages(peers);
assert.ok(averages.medianEvEbitda > 0, 'Mediana EV/EBITDA deve ser > 0');
assert.ok(averages.medianPe > 0, 'Mediana P/L deve ser > 0');
console.log(`  ✓ Mediana EV/EBITDA do setor: ${averages.medianEvEbitda}x | P/L: ${averages.medianPe}x`);

// 3. Múltiplos implícitos da empresa
const companyMultiples = multiplesEngine.calculateCompanyImpliedMultiples({
  enterpriseValue: 240,
  equityValue: 200,
  revenue: 120,
  ebitda: 24,
  netIncome: 12,
});
assert.strictEqual(companyMultiples.impliedEvEbitda, 10.0, 'EV/EBITDA deve ser 10.0x');
assert.strictEqual(companyMultiples.impliedEvRevenue, 2.0, 'EV/Receita deve ser 2.0x');
assert.strictEqual(Math.round(companyMultiples.impliedPe * 10) / 10, 16.7, 'P/L deve ser ~16.7x');
console.log('  ✓ Múltiplos implícitos calculados com precisão');

// 4. Valuation relativo implícito
const relVal = multiplesEngine.calculateRelativeValuation({
  averages,
  revenue: 120,
  ebitda: 24,
  netIncome: 12,
  netDebt: 40,
});
assert.ok(relVal.byEbitda.ev > 0, 'EV por EBITDA deve ser > 0');
assert.strictEqual(relVal.byEbitda.equity, relVal.byEbitda.ev - 40, 'Equity deve ser EV - NetDebt');
console.log(`  ✓ Valuation Relativo por EV/EBITDA: R$ ${relVal.byEbitda.ev.toFixed(2)}M`);

// 5. Avaliação de Discrepância (Ágio / Desconto)
const fairEval = multiplesEngine.evaluateValuationDiscrepancy(250, 245);
assert.strictEqual(fairEval.verdict, 'ideal', 'Gap pequeno deve ser classificado como ideal');

const overvaluedEval = multiplesEngine.evaluateValuationDiscrepancy(380, 240);
assert.strictEqual(overvaluedEval.verdict, 'desafiador', 'Gap > 35% deve acionar alerta');
console.log('  ✓ Regras de discrepância e feedback da Madame Múltiplo validadas');

console.log('✅ Todos os testes de multiplesEngine passaram com sucesso!\n');
