# Integracao de IA do Chat por Item

O front nao deve guardar chave de API. Para usar IA real, configure um endpoint local ou backend que receba a conversa do item e chame o provedor de IA no servidor.

## Endpoint esperado

Antes de enviar uma mensagem no chat, defina:

```js
window.FICHA_RUMBA_AI_ENDPOINT = "http://localhost:3000/api/item-chat";
```

O app enviara:

```json
{
  "fieldTitle": "POUSO NORMAL",
  "currentText": "Comentario atual do item.",
  "userMessage": "Pedido do IN.",
  "messages": [],
  "rules": []
}
```

O endpoint deve responder:

```json
{
  "reply": "Resposta conversacional da IA para o IN.",
  "proposedText": "Nova proposta de texto para este item."
}
```

O front exibe `reply` no chat e guarda `proposedText` como sugestao pendente. A sugestao so e aplicada quando o IN confirmar no chat, por exemplo com "sim", "aplique" ou "pode aplicar".

## Regras

- A resposta deve atuar somente sobre o item selecionado.
- `proposedText` deve alterar apenas o comentario daquele item.
- A alteracao nao deve ser aplicada sem confirmacao do IN.
- Nao inventar fatos.
- Nao importar conteudo de exemplos de estilo.
- Se o pedido do IN for insuficiente, responder pedindo confirmacao em vez de criar fato novo.
