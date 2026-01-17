# Plano de Testes de Software

## Casos de Teste Planejados

| Caso | Cenário | Passos | Resultado Esperado |
|:--- |:--- |:--- |:--- |
| CT-01 | Carregamento Inicial | Acessar a página inicial | Exibir filmes populares e carrossel animado. |
| CT-02 | Busca por Texto | Digitar "Avatar" na busca | Atualizar o grid apenas com filmes relacionados a "Avatar". |
| CT-03 | Filtro por Gênero | Selecionar "Terror" no dropdown | Exibir apenas filmes de terror. |
| CT-04 | Detalhes do Filme | Clicar em um card de filme | Abrir modal com sinopse, nota e poster corretos. |
| CT-05 | Paginação | Clicar na página "2" | Carregar novos filmes e rolar a tela para o topo. |
| CT-06 | Botão Aleatório | Clicar em "Aleatório" | Carregar filmes de uma página randômica da API. |