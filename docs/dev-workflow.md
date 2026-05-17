# Dev Workflow

## Como trabalhar com escopo fechado

1. Ler a solicitacao do usuario.
2. Verificar os arquivos reais afetados.
3. Identificar se a mudanca e de dados, UI, classificacao, chat ou documentacao.
4. Alterar somente os arquivos necessarios.
5. Nao refatorar fora do escopo.
6. Informar arquivos alterados e como testar.

## Como iniciar uma nova sessao do Codex

Antes de pedir alteracoes, informe:

- objetivo da mudanca;
- arquivos ou modulo afetado, se souber;
- se pode ou nao alterar arquivos;
- se deve primeiro propor plano;
- dados oficiais da OI, quando envolver nova missao;
- exemplo de transcricao para teste, quando envolver classificacao.

Leitura recomendada no inicio de uma sessao:

- `docs/product.md`
- `docs/architecture.md`
- `docs/rules.md`
- `docs/estrutura-dados.md`
- `docs/ia.md`, se a tarefa envolver IA/chat.

## Como pedir alteracoes por modulo

### Dados de missao

Forneca codigo da missao, fase, grupo, objetivo e itens oficiais da OI. Nao pedir para reaproveitar campos de outra missao.

### Classificacao

Forneca transcricao de exemplo e resultado esperado por item.

### Chat/IA

Explique se a mudanca e apenas de interface, simulacao local ou integracao com endpoint real.

### Visual/UI

Explique fluxo desejado, estados esperados e telas afetadas. Evitar pedir mudanca visual junto com mudanca profunda de regra de negocio.

### Documentacao

Indique se a documentacao deve ser canonica ou apenas complementar.

## Padrao de commits sugerido

Ainda nao ha padrao de commits confirmado no repositorio.

Sugestao:

- `docs: organiza contexto do projeto`
- `feat: adiciona missao FPB5-03`
- `feat: implementa chat por item`
- `fix: corrige markers da FPB5-05`
- `refactor: separa classificador em modulo`

## Checklist antes de finalizar uma tarefa

- A mudanca respeita as regras de fidelidade ao audio?
- Exemplos de estilo continuam isolados?
- O chat altera somente o item selecionado?
- A ficha final continua copiavel?
- Campos sem comentario continuam vazios?
- Nenhum segredo foi colocado no frontend?
- O usuario recebeu resumo dos arquivos alterados?
