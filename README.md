# AnimValue: O Preço do Sucesso 📈💼
> 📱 **Web App Gamificado de Valuation e Finanças Corporativas (PWA Mobile-First)**  
> 🏆 **CFO Simulator para Fusões & Aquisições (M&A) e Rodadas de Investimento**  
> 💡 *Aprenda Fluxo de Caixa Descontado (FCD), Múltiplos Relativos, Choque de Inflação e EVA de forma interativa e visual!*

---

## 🌟 1. Visão Geral e Objetivo

O **AnimValue: O Preço do Sucesso** coloca o usuário no papel estratégico de **CFO (Diretor Financeiro)** de uma companhia em forte expansão que recebeu manifestações de interesse de fundos de Private Equity e investidores estratégicos internacionais.

O objetivo do jogo é preparar a companhia para a transação de M&A ou captação de recursos, determinando o valor econômico do negócio (**Enterprise Value** e **Equity Value**). O aplicativo funciona como uma ferramenta de **"Valuation Consultivo"**, permitindo ao usuário:
1. Identificar as principais alavancas operacionais de criação de valor (crescimento de receita, margem EBITDA, Capex e capital de giro).
2. Compreender a mecânica do custo de oportunidade do capital (**WACC**).
3. Testar a consistência do valor intrínseco contra o humor e múltiplos do mercado de capitais (**EV/EBITDA**, **P/L**, **EV/Receita**).
4. Sobreviver a crises macroeconômicas reais (**Choque de Inflação e Alta dos Juros**).
5. Desmistificar o maior paradoxo das finanças corporativas: **"Lucro Contábil não é Riqueza Econômica"** através do **Valor Econômico Adicionado (EVA)**!

---

## 👥 2. Os Personagens (Os Especialistas em Avaliação)

O jogador é guiado e desafiado por três conselheiros animados que defendem escolas de valuation distintas:

| Personagem | Metodologia | Filosofia & Foco de Análise | Estilo & Reações |
| :--- | :--- | :--- | :--- |
| **Doutor Fluxo** 👨‍🔬📊 | **Fluxo de Caixa Descontado (FCD)** | Foco no **Valor Intrínseco**. Considera o FCD a metodologia mais nobre e sólida. Analisa a capacidade futura de gerar caixa livre da firma (FCFF) descontada pelo WACC até a perpetuidade (Gordon Growth). | Metódico, analítico, jaleco de cientista financeiro e óculos azuis. Alerta contra taxas de desconto descalibradas ou dependência excessiva do Valor Terminal. |
| **Madame Múltiplo** 👩‍💼📈 | **Avaliação Relativa por Múltiplos** | Foco no **Sentimento de Mercado**. Compara a empresa com concorrentes e pares de bolsa usando **EV/EBITDA**, **P/L** e **EV/Receita**. | Sofisticada, ágil, blazer magenta e olhar afiado de mercado. Detecta ágios excessivos, bolhas setoriais e oportunidades de arbitragem. |
| **Capitão EVA** 🛡️⚡ | **Valor Econômico Adicionado (EVA)** | Foco no **Retorno sobre o Capital**. Adverte que riqueza só existe quando a empresa cobre seus custos operacionais E o custo de oportunidade do capital investido (**ROIC > WACC**). | Protetor heroico dos acionistas, armadura verde esmeralda com o emblema $\Delta\text{EVA}$. Desmascara a ilusão de lucros contábeis que destroem valor econômico. |

---

## 🧮 3. Fundamentos Matemáticos e Fórmulas

### 3.1. Custo Médio Ponderado de Capital (WACC)
$$WACC = \left(\frac{E}{V}\right) \times K_e + \left(\frac{D}{V}\right) \times K_d \times (1 - T)$$
Onde:
- $K_e = R_f + \beta \times ERP$ (Custo do Capital Próprio via CAPM)
- $K_d$: Custo bruto da dívida; $(1 - T)$ reflete o benefício fiscal (*tax shield*)
- $E/V$ e $D/V$: Proporção de capital próprio e de terceiros

### 3.2. Fluxo de Caixa Livre da Firma (FCFF)
$$\text{FCFF}_t = \text{NOPAT}_t + \text{D\&A}_t - \text{Capex}_t - \Delta\text{NWC}_t$$
$$\text{NOPAT}_t = \text{EBIT}_t \times (1 - T)$$

### 3.3. Valor Terminal (Modelo de Gordon)
$$\text{VT} = \frac{\text{FCFF}_5 \times (1 + g)}{\text{WACC} - g}$$
$$\text{VP(VT)} = \frac{\text{VT}}{(1 + \text{WACC})^5}$$

### 3.4. Enterprise Value e Equity Value
$$\text{Enterprise Value (EV)} = \sum_{t=1}^5 \frac{\text{FCFF}_t}{(1 + \text{WACC})^t} + \text{VP(VT)}$$
$$\text{Equity Value} = \text{Enterprise Value} - (\text{Dívida Bruta} - \text{Caixa})$$

### 3.5. Valor Econômico Adicionado (EVA)
$$\text{EVA} = \text{NOPAT} - (\text{Capital Investido} \times \text{WACC})$$
$$\text{EVA} = \text{Capital Investido} \times (\text{ROIC} - \text{WACC})$$
Onde $\text{ROIC} = \frac{\text{NOPAT}}{\text{Capital Investido}}$.

---

## 🎮 4. A Jornada do Usuário (6 Etapas Interativas)

1. **Diagnóstico Inicial**: Escolha da empresa-alvo (**TechLog**, **BioSaúde Care** ou **Conecta Varejo**), visualização da DRE base e introdução dos 3 conselheiros.
2. **O Desafio do Doutor Fluxo**: Ajuste tátil de premissas em tempo real com sliders (crescimento, margem EBITDA, WACC, taxa terminal Gordon). Visualização do gráfico de barras de fluxos e da cascata de valor (Enterprise Value para Equity Value).
3. **O Teste da Madame Múltiplo**: Comparação direta da empresa com concorrentes virtuais através de múltiplos (EV/EBITDA, P/L e EV/Receita). Análise de gap e veredito de mercado.
4. **Sobrevivendo à Inflação (Choque Macroeconômico)**: Explosão da inflação para 9,8% e alta das taxas de juros. O jogador toma 3 decisões estratégicas: Poder de Preço (Repasse), Eficiência de Capex e Desalavancagem Financeira.
5. **O Julgamento do Capitão EVA**: Demonstração do paradoxo contábil vs. econômico. Comparação lado a lado de Lucro Líquido Contábil vs. EVA e velocímetro do Spread $\text{ROIC} - \text{WACC}$.
6. **Desfecho (Laudo de Avaliação Final)**: Formalização do laudo de avaliação com score do CFO, faixa de oferta de M&A recomendada, parecer individual assinado pelos 3 conselheiros e botão de impressão/PDF.

---

## 💻 5. Como Executar Localmente

### Opção A: Usando Node.js (Recomendado)
```bash
# Entrar no diretório
cd animvalue

# Executar os testes unitários automatizados
npm test

# Iniciar servidor local
npm start
# Acesse: http://localhost:3000
```

### Opção B: Usando Python
```bash
python serve.py
# Acesse: http://localhost:3000
```

---

## 🧪 6. Testes Automatizados

O projeto inclui suíte de testes unitários sem dependências externas:
- `tests/dcfEngine.test.js`: Projeções de FCFF, CAPM, WACC, modelo Gordon e valuation.
- `tests/multiplesEngine.test.js`: Múltiplos implícitos, medianas do setor e teste de gap.
- `tests/evaEngine.test.js`: NOPAT, ROIC, Capital Charge, EVA e paradoxo contábil.

Para rodar todos os testes:
```bash
node tests/dcfEngine.test.js
node tests/multiplesEngine.test.js
node tests/evaEngine.test.js
```

---

## 🚀 7. Tecnologias Utilizadas

- **HTML5 Semântico & PWA**: Manifesto PWA, Service Worker com cache offline e suporte a A2HS (Add to Home Screen).
- **CSS3 Moderno**: Layout mobile-first responsivo, variáveis CSS nativas, tema escuro fintech e folha de estilos dedicada para impressão de laudos (`@media print`).
- **JavaScript Moderno (ES Modules)**: Arquitetura modular sem bundler, pura, rápida e de alta manutenibilidade.
- **Gráficos Vetoriais SVG Nativos**: Gráficos táteis responsivos e leves sem dependências externas pesadas.
- **Web Audio API**: Efeitos sonoros sintetizados nativamente em tempo real com controle de mudo.

---
*Desenvolvido com carinho pedagógico para estudantes e profissionais de Finanças Corporativas e M&A.*
