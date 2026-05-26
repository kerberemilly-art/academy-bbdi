# Spec Simples: Page Builder de Treinamentos

## Resumo

Criar um editor visual dentro do admin de treinamentos para montar o conteúdo da página por blocos arrastáveis. O admin terá uma área central de montagem e um menu fixo à direita com blocos disponíveis: imagem, título, link, tabela e vídeo por URL embed. A edição de texto acontecerá em um popover com controles simples de rich text.

## Mudanças Principais

- Substituir o editor atual de `contentBlocks` por um page builder visual.
- Manter compatibilidade com o backend atual, expandindo `contentBlocks` para aceitar blocos tipados:
  - `title`
  - `image`
  - `link`
  - `table`
  - `videoEmbed`
  - `richText`
- Usar drag-and-drop nativo do navegador para:
  - arrastar blocos do menu direito para a página
  - reordenar blocos já inseridos
  - remover blocos
- Criar preview fiel no aluno em `TrainingDetail`, renderizando cada tipo de bloco.

## Interface Esperada

- Layout do editor:
  - centro: canvas da página
  - direita: menu "Blocos" com cards arrastáveis
  - cada bloco inserido mostra ações rápidas: editar, duplicar, remover, mover
- Popover de rich text:
  - aberto ao clicar em editar texto/título/link
  - controles mínimos: negrito, itálico, lista, alinhamento, link
  - salva conteúdo como HTML sanitizado ou markdown compatível
- Bloco de tabela:
  - edição simples de linhas/colunas
  - botões para adicionar/remover linha e coluna
- Bloco de vídeo:
  - campo para URL do YouTube/Vimeo/embed
  - preview com iframe seguro
  - validar apenas URLs aceitas

## Dados/API

Expandir o formato de `contentBlocks`:

```js
{
  id: "block-123",
  type: "title" | "image" | "link" | "table" | "videoEmbed" | "richText",
  props: {}
}
```

Exemplos de `props`:

- título: `{ text, level }`
- imagem: `{ imageUrl, imageAlt }`
- link: `{ label, url }`
- tabela: `{ columns, rows }`
- vídeo: `{ url, title }`
- rich text: `{ content }`

O backend deve continuar salvando `content_blocks_json`, apenas normalizando os novos campos sem quebrar blocos antigos.

## Testes e Cenários

- Criar treinamento com blocos arrastados do menu direito.
- Reordenar blocos e confirmar que a ordem salva é preservada.
- Editar rich text pelo popover e visualizar corretamente no preview.
- Inserir imagem, link, tabela e vídeo embed.
- Validar erro para vídeo com URL inválida.
- Abrir treinamento antigo com blocos `{ title, text, imageUrl }` sem quebrar.
- Confirmar renderização no admin e na tela do aluno.

## Milestones e Tarefas

### Milestone 1: Modelo de Blocos Compatível

- Definir o formato tipado de `contentBlocks` com `id`, `type` e `props`.
- Criar função para converter blocos antigos `{ title, text, imageUrl }` para os novos tipos.
- Atualizar a normalização no backend para aceitar os novos campos.
- Garantir que treinamentos antigos continuem abrindo no admin e no aluno.
- Testar criação, edição e salvamento sem alterar quiz, departamento, módulo ou status.

### Milestone 2: Renderização dos Blocos

- Criar renderer único para exibir blocos tipados.
- Renderizar bloco de título com níveis configuráveis.
- Renderizar bloco de rich text.
- Renderizar bloco de imagem com `alt`.
- Renderizar bloco de link externo.
- Renderizar bloco de tabela.
- Renderizar bloco de vídeo por iframe seguro.
- Usar o renderer no preview do admin e na página `TrainingDetail`.

### Milestone 3: Canvas do Page Builder

- Criar área central de montagem da página.
- Listar blocos atuais na ordem salva.
- Adicionar ações por bloco: editar, duplicar e remover.
- Permitir seleção de um bloco para edição.
- Mostrar estado vazio quando não houver blocos.
- Garantir layout responsivo para desktop e mobile.

### Milestone 4: Menu Direito com Drag-and-Drop

- Criar menu lateral direito "Blocos".
- Criar cards arrastáveis para imagem, título, link, tabela, vídeo e rich text.
- Permitir soltar um bloco novo no canvas.
- Permitir reordenar blocos existentes no canvas.
- Mostrar feedback visual durante arraste e área de drop.
- Manter alternativa por clique para adicionar bloco, caso drag-and-drop não funcione no dispositivo.

### Milestone 5: Editores por Tipo de Bloco

- Criar popover de edição para título, link e rich text.
- Adicionar controles simples de rich text: negrito, itálico, lista, alinhamento e link.
- Criar editor de imagem usando upload existente.
- Criar editor de tabela com adicionar/remover linhas e colunas.
- Criar editor de vídeo com validação de URL YouTube/Vimeo/embed.
- Exibir mensagens de erro objetivas para campos inválidos.

### Milestone 6: Salvamento e Validação Final

- Integrar o page builder ao fluxo atual de salvar treinamento.
- Garantir que o markdown legado continue sendo gerado quando necessário.
- Validar que treinamento precisa ter título e ao menos um bloco com conteúdo.
- Preservar a regra atual de quiz com no mínimo dez perguntas.
- Confirmar que edição de treinamento existente carrega e salva corretamente.
- Rodar build e teste manual do fluxo completo.

## Assumptions

- "drain drop" significa drag-and-drop.
- O MVP não adiciona biblioteca externa de DnD; usa drag-and-drop nativo para manter a implementação simples.
- O rich text será simples, não um editor completo como Notion/Word.
- O page builder será aplicado ao conteúdo do treinamento, não à estrutura inteira do portal.
