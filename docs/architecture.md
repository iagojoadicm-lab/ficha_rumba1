# Architecture

## Stack utilizada

Estado atual do repositorio:

- HTML estatico em `index.html`.
- CSS puro em `styles.css`.
- JavaScript modular com ES Modules.
- Dados locais em arquivos `.js` dentro de `data/`.
- Sem framework frontend.
- Sem backend implementado.
- Sem banco de dados implementado.
- Sem autenticacao implementada.
- Sem dependencias externas declaradas.

## Estrutura de pastas

```text
/
  index.html
  styles.css
  script.js
  data/
    missions/
      index.js
      fpb5-03.js
      fpb5-05.js
    style-examples/
      index.js
      fpb5-03.js
      fpb5-05.js
  modules/
    classifier.js
    chat-state.js
    final-output.js
    item-ai.js
  docs/
    architecture.md
    design-system.md
    dev-workflow.md
    product.md
    rules.md
    estrutura-dados.md
    fluxo.md
    ia.md
    regras.md
```

## Principais fluxos tecnicos

### Geracao inicial da ficha

1. `script.js` le a missao selecionada em `data/missions/index.js`.
2. O usuario cola a transcricao.
3. `modules/classifier.js` divide a transcricao em blocos.
4. O classificador procura `markersStrong`.
5. Ao encontrar marker, define o contexto ativo.
6. Blocos seguintes entram no mesmo item ate novo marker ser encontrado.
7. O resultado preenche `state.fieldValues`.
8. `script.js` renderiza os campos editaveis.
9. `modules/final-output.js` monta a ficha final para copia.

### Chat do item

1. O usuario abre o chat de um item.
2. `modules/chat-state.js` cria ou recupera historico e versoes daquele item.
3. O usuario conversa no painel.
4. `modules/item-ai.js` tenta chamar `window.FICHA_RUMBA_AI_ENDPOINT`, se configurado.
5. Sem endpoint, o app usa um assistente local limitado apenas para simular fluxo.
6. Uma sugestao fica pendente.
7. Se o IN confirmar no chat, o app cria nova versao e atualiza somente aquele item.

### Dados de missoes

- Cada missao fica em `data/missions/<missao>.js`.
- Cada campo deve ter `id`, `title`, `markersStrong` e, se util, `keywords`.
- `keywords` existe para uso futuro; a classificacao atual usa `markersStrong`.

## Frontend, backend, autenticacao e banco

### Frontend

Implementado como app estatico local.

### Backend

Nao existe backend no repositorio atualmente.

Pendente de confirmacao: criar backend para IA real, transcricao de audio, seguranca e persistencia.

### Autenticacao

Nao existe autenticacao no repositorio atualmente.

Pendente de confirmacao: se o app tera login, perfis, permissoes ou ambiente multiusuario.

### Banco de dados

Nao existe banco de dados no repositorio atualmente.

Pendente de confirmacao: persistencia de fichas, historico, exemplos e usuarios.

## Pontos sensiveis do sistema

- Fidelidade ao audio/transcricao.
- Nao inventar fatos.
- Separacao entre exemplos de estilo e conteudo da ficha.
- Classificacao por contexto ativo.
- `markersStrong` de cada missao.
- Chat do item deve afetar somente o item selecionado.
- Chave de IA nunca deve ficar no frontend.
- Alteracoes em dados oficiais da OI devem ser feitas apenas com fonte oficial fornecida pelo usuario.
