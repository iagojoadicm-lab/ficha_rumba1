# Estrutura de Dados

## Missoes

Cada missao fica em `data/missions/<missao>.js` e exporta um objeto com:

```js
export const fpb505 = {
  id: "FPB5-05",
  name: "FPB5-05",
  phase: "Fase Basica",
  group: "Adaptacao",
  fields: [
    {
      id: "relatorioVoo",
      title: "RELATÓRIO DE VOO",
      markers: ["relatorio de voo", "registro do voo"],
      keywords: ["relatorio de voo", "relatorio"],
    },
  ],
};
```

Depois, registre a missao em `data/missions/index.js`.

## Exemplos de estilo

Os exemplos ficam em `data/style-examples/<missao>.js` e exportam um objeto separado:

```js
export const styleExamplesFPB505 = {
  missionId: "FPB5-05",
  warning: "Exemplos apenas para referencia de estilo.",
  examples: [
    {
      item: "Registro objetivo",
      text: "Procedimento bem realizado, mantendo a sequencia prevista.",
      note: "Frase curta, tecnica e limitada ao item observado.",
      tags: ["objetivo"],
    },
  ],
};
```

Depois, registre os exemplos em `data/style-examples/index.js`.

## Regra de separacao

`script.js` pode importar missoes e exemplos, mas a classificacao deve usar somente:

- transcricao colada pelo IN;
- campos e palavras-chave da missao selecionada.

Os exemplos de estilo devem ser usados apenas para exibicao visual.

## Contexto ativo

Cada campo deve ter `markers`, que sao expressoes fortes para detectar a mudanca de item na fala do IN.

Durante a classificacao:

- quando um marker e encontrado, o item vira o contexto ativo;
- blocos seguintes sem novo marker continuam no contexto ativo;
- trechos antes de qualquer contexto ativo ficam em area auxiliar, fora da ficha final.
