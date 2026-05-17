# Project Rules

## Regras obrigatorias do app

- Nao inventar comentarios.
- Nao deduzir desempenho nao mencionado.
- Nao criar fatos tecnicos que nao estejam na transcricao.
- Preencher apenas campos citados na transcricao.
- Manter fidelidade ao audio transcrito.
- Nao fazer troca automatica de genero no comentario gerado.
- Guardar trechos sem contexto ativo apenas em area auxiliar fora da ficha final.
- Exemplos de estilo nunca entram na classificacao.
- Exemplos de estilo nunca sao fonte de fatos.
- A ficha gerada e sempre sugestao inicial para revisao do IN.
- Alteracoes feitas no chat de um item devem afetar somente aquele item.
- IA nao deve aplicar alteracao sem confirmacao do IN.

## Regras para agentes/Codex

- Antes de alterar funcionalidade, entender o fluxo atual nos arquivos reais.
- Manter escopo fechado ao pedido do usuario.
- Nao inventar funcionalidades.
- Nao criar dependencias sem justificar a necessidade.
- Nao alterar backend, autenticacao, banco ou rotas globais sem pedir antes.
- Nao refatorar arquivos fora do escopo solicitado.
- Nao cadastrar novas missoes sem itens oficiais da OI fornecidos pelo usuario.
- Nao usar exemplos de estilo para preencher ficha.
- Nao colocar chaves, tokens ou segredos no frontend.
- Se algo nao estiver claro, registrar como pendente de confirmacao.

## Arquivos e pastas sensiveis

Alterar somente com autorizacao explicita:

- `data/missions/`: contem campos oficiais e markers das missoes.
- `data/style-examples/`: contem exemplos de estilo; nao sao fatos.
- `modules/classifier.js`: regra central de classificacao.
- `modules/item-ai.js`: contrato do chat com IA.
- `modules/final-output.js`: montagem da ficha final.
- `index.html` e `styles.css`: estrutura e design da interface.

## Backend, autenticacao, banco e rotas

Atualmente nao ha backend, autenticacao, banco ou rotas globais no repositorio.

Se forem adicionados no futuro, qualquer alteracao nesses pontos deve ser precedida de plano e aprovacao do usuario.
