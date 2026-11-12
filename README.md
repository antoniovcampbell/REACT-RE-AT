# FlavorDash

Aplicação de delivery feita com React e Vite. O dashboard permite explorar restaurantes, consultar cardápios, combinar filtros e guardar favoritos.

## Requisitos

- Node.js
- npm

## Executar localmente

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra no navegador o endereço `Local` informado pelo Vite no terminal (normalmente `http://localhost:5173/`). Se a porta estiver ocupada, o Vite selecionará outra. O servidor local usa HTTP; no Firefox com HTTPS-Only Mode, permita HTTP para `localhost`.

Comandos adicionais:

```bash
npm run build    # gera a versão de produção em dist/
npm run preview  # serve localmente a versão gerada
```

## Dados JSON

Os dados são arquivos estáticos em `public/`, consumidos pela Fetch API:

- `restaurants.json`: lista inicial de 20 restaurantes, quatro em cada categoria: Italiana, Japonesa, Brasileira, Fast Food e Mexicana. Cada objeto usa `id`, `name`, `cuisine`, `isOpen`, `lastUpdate` e `description`.
- `restaurantDetails{id}.json`: detalhes individuais no formato `id`, `name`, `address`, `phone`, `openingHours`, `rating`, `deliveryTime` e `description`.
- `restaurantMenu{id}.json`: pratos de cada restaurante, com `id`, `name`, `price` e `category`.

O preço médio usado nos filtros é calculado a partir dos preços dos pratos do cardápio. Para adicionar dados estáticos, mantenha o mesmo ID nos arquivos de detalhes e cardápio associados. Cadastros, edições e exclusões de restaurantes e alterações no cardápio (adicionar, editar e remover pratos) feitos pela interface são guardados no `localStorage`; os JSONs originais permanecem inalterados. Para restaurar o catálogo original, remova a chave `flavordash-restaurant-changes` do armazenamento local do navegador.

## Funcionalidades

- Busca por nome, cozinha e descrição.
- Filtros combináveis por cozinha, funcionamento e preço médio.
- CRUD de restaurantes com escolha de emoji no cadastro e na edição.
- Edição do cardápio na mesma tela do restaurante: adicionar, editar e remover pratos.
- Ordenação por nome, cozinha, atualização, funcionamento e quantidade de pratos.
- Paginação da lista.
- Favoritos persistidos no `localStorage`.
- Carregamento assíncrono de lista, detalhes e cardápios, com estados de carregamento e erro.
- Layout minimalista e responsivo.

## Organização do código

- `src/components/`: interface em componentes, incluindo `Dashboard`, `RestaurantCard`, `RestaurantList`, filtros, ordenação, paginação e formulário.
- `src/hooks/useRestaurantData.js`: carrega os JSONs e cadastra restaurantes na sessão.
- `src/hooks/useRestaurantDiscovery.js`: busca, filtros, ordenação e paginação.
- `src/hooks/useFavorites.js`: favoritos e persistência em `localStorage`.
- `src/services/restaurantApi.js`: funções Fetch para a lista e os dados individuais.
- `src/constants/restaurant.js`: tamanho da página.
- `src/styles/`: estilos modulares de base, shell, descoberta, cartões, detalhes, estados e responsividade, importados na ordem correta por `src/main.jsx`.
