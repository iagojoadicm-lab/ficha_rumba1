# Estrutura de Dados

## Missoes

Cada missao fica em `data/missions/<missao>.js` e exporta um objeto com os dados oficiais da OI:

```js
export const fpb505 = {
  id: "FPB5-05",
  name: "FPB5-05",
  phase: "Fase B\u00e1sica",
  group: "Adapta\u00e7\u00e3o",
  fields: [
    {
      id: "relatorioVoo",
      title: "RELAT\u00d3RIO DE VOO",
      markersStrong: ["relatorio de voo", "registro do voo"],
      keywords: ["relatorio de voo", "relatorio"],
    },
  ],
};
```

Depois, registre a missao em `data/missions/index.js`.

## Campos

- `id`: identificador interno estavel, sem acentos ou espacos.
- `title`: titulo oficial do item da OI.
- `markersStrong`: expressoes fortes que indicam mudanca de item na fala do IN.
- `keywords`: termos auxiliares para uso futuro. A classificacao atual nao usa `keywords`.

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

A classificacao deve usar somente:

- transcricao colada pelo IN;
- campos oficiais da missao selecionada;
- `markersStrong` da missao selecionada.

Os exemplos de estilo nao entram na classificacao e nao devem aparecer como conteudo da ficha.

## Contexto ativo

Durante a classificacao:

- quando um `markersStrong` e encontrado, o item vira o contexto ativo;
- blocos seguintes sem novo marker continuam no contexto ativo;
- trechos antes de qualquer contexto ativo ficam em area auxiliar, fora da ficha final.

## Depuracao

Apos gerar uma ficha, o app expoe no navegador:

```js
window.fichaRumbaDebug.getClassificationDebug()
```

Esse retorno mostra bloco por bloco qual item recebeu o texto e qual marker acionou a mudanca de contexto.
