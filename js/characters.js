/**
 * characters.js
 * Os Especialistas em Avaliação de Empresas (Valuation)
 * AnimValue: O Preço do Sucesso
 */

export const characters = {
  doctor: {
    id: 'doctor',
    name: 'Doutor Fluxo',
    role: 'O Mestre do FCD',
    icon: '👨‍🔬📊',
    color: '#3b82f6', // Azul analítico
    secondaryColor: '#1d4ed8',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="character-svg">
        <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#3b82f6" stroke-width="3"/>
        <!-- Cabelo / Cabeça -->
        <circle cx="50" cy="46" r="24" fill="#fed7aa"/>
        <path d="M 28 42 Q 50 16 72 42 Q 50 24 28 42 Z" fill="#64748b"/>
        <!-- Óculos Redondos de Cientista Financeiro -->
        <circle cx="41" cy="44" r="7" fill="none" stroke="#0284c7" stroke-width="2.5"/>
        <circle cx="59" cy="44" r="7" fill="none" stroke="#0284c7" stroke-width="2.5"/>
        <line x1="48" y1="44" x2="52" y2="44" stroke="#0284c7" stroke-width="2.5"/>
        <!-- Olhos -->
        <circle cx="41" cy="44" r="2.5" fill="#0f172a"/>
        <circle cx="59" cy="44" r="2.5" fill="#0f172a"/>
        <!-- Bigode e Sorriso -->
        <path d="M 44 54 Q 50 58 56 54" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Jaleco / Terno -->
        <path d="M 26 84 C 26 66 74 66 74 84 Z" fill="#f8fafc"/>
        <polygon points="50,68 44,80 56,80" fill="#3b82f6"/>
        <line x1="50" y1="68" x2="50" y2="92" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Gravata borboleta ou régua de cálculo -->
        <rect x="42" y="66" width="16" height="4" rx="2" fill="#2563eb"/>
      </svg>
    `,
    badge: 'FCD & Fluxo Livre',
    philosophy:
      'O valor de qualquer empresa é igual ao valor presente de todo o caixa livre que ela gerará até o fim dos tempos, descontado pelo custo de capital!',
    dialogues: {
      intro:
        'Saudações, futuro CFO! Sou o Doutor Fluxo. Não se iluda com promessas vazias: em M&A, o que fecha negócios é a capacidade comprovada de gerar Fluxo de Caixa Livre (FCFF)!',
      lowWacc:
        'Excelente! Um WACC controlado preserva o valor presente dos fluxos. O custo de capital é o grande divisor de águas entre valuation alto ou medíocre.',
      highWacc:
        'Cuidado, colega! Com essa taxa de desconto, cada ano futuro perde valor exponencialmente. O investidor exigirá um retorno enorme para compensar o risco.',
      highTerminal:
        'Atenção! Mais de 70% do seu Enterprise Value está concentrado no Valor Terminal. Isso significa que sua tese depende quase toda do pós-ano 5!',
      shockReaction:
        'Alerta vermelho! A inflação fez o WACC disparar! Se você não repassar preços ou enxugar custos, o Enterprise Value vai despencar!',
    },
  },

  madame: {
    id: 'madame',
    name: 'Madame Múltiplo',
    role: 'A Analista de Mercado',
    icon: '👩‍💼📈',
    color: '#ec4899', // Rosa executivo / vibrante
    secondaryColor: '#be185d',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="character-svg">
        <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#ec4899" stroke-width="3"/>
        <!-- Cabelo moderno estilizado -->
        <path d="M 24 50 C 22 24 78 24 76 50 C 78 70 74 72 74 72 C 66 52 34 52 26 72 Z" fill="#831843"/>
        <circle cx="50" cy="46" r="22" fill="#fde68a"/>
        <path d="M 30 36 Q 50 20 70 36 Q 50 30 30 36 Z" fill="#9d174d"/>
        <!-- Óculos de grife elegantes -->
        <rect x="34" y="40" width="13" height="9" rx="3" fill="none" stroke="#be185d" stroke-width="2"/>
        <rect x="53" y="40" width="13" height="9" rx="3" fill="none" stroke="#be185d" stroke-width="2"/>
        <line x1="47" y1="44" x2="53" y2="44" stroke="#be185d" stroke-width="2"/>
        <!-- Olhos elegantes -->
        <circle cx="40" cy="44" r="2.2" fill="#0f172a"/>
        <circle cx="60" cy="44" r="2.2" fill="#0f172a"/>
        <!-- Sorriso confiante -->
        <path d="M 44 54 Q 50 57 56 54" stroke="#9d174d" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <!-- Blazer Executivo -->
        <path d="M 25 84 C 25 66 75 66 75 84 Z" fill="#be185d"/>
        <!-- Blusa de seda interna -->
        <polygon points="50,66 42,80 58,80" fill="#fbcfe8"/>
        <!-- Colar de pérolas -->
        <circle cx="50" cy="67" r="2" fill="#ffffff"/>
        <circle cx="46" cy="66" r="1.8" fill="#ffffff"/>
        <circle cx="54" cy="66" r="1.8" fill="#ffffff"/>
      </svg>
    `,
    badge: 'Múltiplos & Relativo',
    philosophy:
      'Uma empresa vale o que o mercado está pagando por empresas semelhantes agora! EV/EBITDA e P/L dão o pulso real dos investidores.',
    dialogues: {
      intro:
        'Olá, querido! Sou a Madame Múltiplo. O Doutor Fluxo vive com a cabeça nas planilhas de 10 anos, mas quem manda no preço hoje é o sentimento de mercado e os pares comparáveis!',
      overpriced:
        'Querido CFO, seu valuation está 30% acima dos líderes do setor! Os analistas de Wall Street e Faria Lima vão despedaçar essa tese se você não provar uma vantagem injusta!',
      fair:
        'Magnífico! Seus múltiplos implícitos convergem perfeitamente com a mediana das empresas negociadas em bolsa. O comitê de M&A vai aprovar sem hesitar.',
      underpriced:
        'Você está vendendo a companhia com desconto de liquidação! O comprador vai rir à toa. Suba essa régua ou defenda um múltiplo mais compatível com sua governança!',
      shockReaction:
        'Em tempos de inflação e juros, os múltiplos de mercado desabam! Ninguém paga 20x EBITDA por promessa. Hora de mostrar solidez de margens!',
    },
  },

  captain: {
    id: 'captain',
    name: 'Capitão EVA',
    role: 'O Guardião da Riqueza',
    icon: '🛡️⚡',
    color: '#10b981', // Verde esmeralda riqueza
    secondaryColor: '#047857',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="character-svg">
        <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
        <!-- Elmo / Cabelo de Capitão -->
        <circle cx="50" cy="45" r="22" fill="#fde047"/>
        <path d="M 30 38 Q 50 18 70 38 Q 50 28 30 38 Z" fill="#047857"/>
        <rect x="30" y="32" width="40" height="6" rx="3" fill="#10b981"/>
        <!-- Olhar Focado e Determinado -->
        <circle cx="42" cy="44" r="2.8" fill="#0f172a"/>
        <circle cx="58" cy="44" r="2.8" fill="#0f172a"/>
        <!-- Sobrancelhas resolutas -->
        <line x1="38" y1="40" x2="45" y2="42" stroke="#064e3b" stroke-width="2"/>
        <line x1="62" y1="40" x2="55" y2="42" stroke="#064e3b" stroke-width="2"/>
        <!-- Expressão firme -->
        <line x1="44" y1="53" x2="56" y2="53" stroke="#064e3b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Armadura de Capitão / Peitoral com Emblema EVA -->
        <path d="M 26 84 C 26 64 74 64 74 84 Z" fill="#047857"/>
        <polygon points="50,68 38,76 42,90 50,94 58,90 62,76" fill="#10b981" stroke="#fcd34d" stroke-width="1.5"/>
        <!-- Símbolo Delta EVA no Peito -->
        <text x="50" y="85" text-anchor="middle" font-size="9" font-weight="900" fill="#ffffff" font-family="sans-serif">ΔEVA</text>
      </svg>
    `,
    badge: 'EVA & ROIC vs WACC',
    philosophy:
      'Lucro contábil é uma ficção se não remunerar o capital empatado! Só existe criação de riqueza genuína quando ROIC supera WACC!',
    dialogues: {
      intro:
        'Atenção, CFO! Sou o Capitão EVA. Meu escudo protege os acionistas contra a maior mentira das finanças: comemorar lucro contábil enquanto o capital é silenciosamente destruído!',
      valueCreated:
        'Vitória! Seu ROIC superou com folga o WACC. O EVA está positivo e brilhante. Cada centavo alocado nesta empresa gerou valor acima do custo de oportunidade!',
      valueDestroyed:
        'ALERTA DE DESTRUIÇÃO! Seu Lucro Líquido pode até ser azul no papel, mas seu ROIC é menor que o custo do capital! Você está queimando o patrimônio dos sócios!',
      breakeven:
        'No limite da navalha: o negócio apenas empata com a taxa livre e o risco. Qualquer soluço na receita levará o EVA para o terreno negativo!',
      shockReaction:
        'O custo de capital disparou! Se você não elevar o NOPAT imediatamente ou desalavancar o capital investido, o EVA será engolido vivo!',
    },
  },
};
