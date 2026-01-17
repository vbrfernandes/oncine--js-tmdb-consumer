# Programação de Funcionalidades

## Consumo de API
A comunicação com o TMDB é feita via `fetch()` no JavaScript.
* `getMovies(url)`: Função principal que busca os dados e chama o renderizador.
* `fetchGenres()`: Busca a lista de categorias para popular o `<select>`.

## Funcionalidades de Interface
* **Busca (Debounce):** Implementada no event listener do `input`, aguardando o usuário parar de digitar antes de chamar a API.
* **Paginação:** Lógica matemática para calcular as páginas atuais e totais, renderizando botões numéricos dinamicamente.
* **Carrossel Infinito:** Utiliza animação CSS (`@keyframes scrollLoop`) combinada com clonagem de elementos JS para criar um loop visual contínuo.
* **Modal:** Manipulação do DOM para injetar dados do filme clicado dentro da estrutura HTML do modal e alternar a classe `.active`.

## Estilização Dinâmica
O CSS utiliza variáveis (`:root`) para facilitar a manutenção das cores neon e media queries para garantir a responsividade em celulares (até 600px) e tablets (até 768px).