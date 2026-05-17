# Design System

## Estilo visual atual

O app usa uma interface clara, operacional e discreta, voltada a trabalho repetido de revisao e preenchimento de ficha.

A linguagem visual deve parecer uma ferramenta de apoio ao IN, nao uma landing page, dashboard decorativo ou produto promocional.

## Cores atuais

Variaveis principais em `styles.css`:

```css
--bg: #f4f1ea;
--surface: #ffffff;
--surface-strong: #fbfaf6;
--ink: #20242a;
--muted: #636b74;
--line: #d7d2c8;
--accent: #116466;
--accent-strong: #0a4547;
--warning-bg: #fff3cd;
--warning-line: #e1bb4d;
--warning-ink: #5c4300;
--field-bg: #f7fbfb;
--soft-blue: #e8f1f5;
--danger: #8a2f2f;
--radius: 8px;
--shadow: 0 12px 32px rgba(32, 36, 42, 0.08);
```

## Tipografia

- Fonte atual: Arial, Helvetica, sans-serif.
- Corpo com `line-height: 1.45`.
- Titulos com peso forte e sem letter-spacing negativo.
- Eyebrows em caixa alta, pequenos e com peso alto.

## Padroes de componentes

- Paineis com fundo branco, borda clara e raio de 8px.
- Botoes primarios em verde petroleo (`--accent`).
- Botoes secundarios em azul/verde claro.
- Campos de texto amplos, com borda discreta.
- Cards de campo usando `details/summary` para expandir e recolher.
- Badges arredondadas para status e versao.
- Chat do item em painel fixo, com mensagens do usuario e da IA visualmente separadas.

## Regras para evitar "cara de IA"

- Evitar textos promocionais ou explicacoes longas dentro da interface.
- Evitar gradientes chamativos, brilhos, orbs, fundos abstratos e decoracao sem funcao.
- Evitar layout de landing page.
- Priorizar informacao, revisao e acao.
- Manter densidade razoavel para uso operacional.
- Usar linguagem objetiva e tecnica.
- Mostrar avisos somente quando ajudam a evitar erro operacional.

## O que deve ser evitado visualmente

- Paleta dominada por roxo, azul neon ou gradientes genericos.
- Cards aninhados sem necessidade.
- Hero section.
- Ilustracoes decorativas.
- Botoes grandes demais para a acao.
- Texto que explique obviedades do sistema.
- Mudancas de layout que reduzam a eficiencia de revisao.
- Elementos que parecam demo de IA em vez de ferramenta de ficha.

## Responsividade

- O layout atual usa duas colunas em desktop.
- Em telas pequenas, o workspace vira uma coluna.
- O chat do item ocupa largura responsiva com limite pelo viewport.
- Qualquer nova tela deve ser testada em desktop e mobile.
