# Template padrão da Aplicação

A estrutura base da aplicação é definida no arquivo `index.html` e segue o padrão semântico do HTML5:

1.  **Header (`<header class="hero">`):**
    * Contém a Logomarca com efeito neon.
    * Barra de pesquisa (`input`) e filtros (`select`).
2.  **Main Content (`<div class="content-container">`):**
    * Carrossel Infinito (`.infinite-carousel-wrapper`).
    * Botões de Ação Rápida (Aleatório).
    * Grid Principal de Filmes (`<main id="main">`).
    * Paginação (`<div class="pagination">`).
3.  **Modal (`<div id="movieModal">`):**
    * Estrutura oculta que se torna visível via JavaScript.
4.  **Footer (`<footer class="main-footer">`):**
    * Créditos, links sociais e atribuição à API do TMDB.