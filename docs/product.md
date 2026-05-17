# Product Context

## Objetivo do app

Ficha Rumba e um auxiliar local para preparar uma sugestao inicial de fichas do Curso C-95, Fase Basica.

O app recebe uma transcricao colada pelo instrutor, identifica itens da OI por contexto ativo e organiza os comentarios nos campos da ficha selecionada. A ficha gerada deve ser revisada pelo IN antes de uso.

## Publico-alvo

- Instrutores do Curso C-95.
- Usuarios que precisam transformar comentarios de debriefing/transcricao em uma ficha inicial organizada.

## Funcionalidades atuais

- Selecao de missao data-driven.
- Missoes cadastradas atualmente:
  - FPB5-03.
  - FPB5-05.
- Selecao Aluno/Aluna apenas para identificacao da ficha.
- Entrada de transcricao por campo de texto.
- Classificacao local por contexto ativo usando `markersStrong` da missao.
- Campos oficiais da OI renderizados a partir de `data/missions`.
- Ficha editavel por item.
- Filtros de campos: todos, preenchidos e vazios.
- Area auxiliar para trechos sem contexto ativo.
- Chat por item com historico por sessao.
- Versionamento interno do comentario do item.
- Copia da ficha final.
- Base separada de exemplos de estilo, sem uso como fonte de fatos.

## O que o app nao deve tentar fazer agora

- Nao substituir a revisao humana do IN.
- Nao inventar comentarios, fatos tecnicos ou desempenho nao citado.
- Nao deduzir desempenho ausente da transcricao.
- Nao implementar banco de dados sem decisao explicita.
- Nao implementar autenticacao sem decisao explicita.
- Nao expor chave de IA no frontend.
- Nao tratar exemplos de estilo como conteudo de uma nova ficha.
- Nao importar comentarios de exemplos para uma ficha real.
- Nao cadastrar novas missoes sem dados oficiais da OI.

## Pendencias de confirmacao

- Backend oficial para IA real.
- Provedor/modelo de IA.
- Fluxo real de transcricao de audio.
- Persistencia de fichas e historico.
- Regras finais de autenticacao e perfis de usuario.
