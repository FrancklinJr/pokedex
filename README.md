# 🔴 Pokédex

> Uma Pokédex web interativa e responsiva, feita com **HTML, CSS e JavaScript puro** (sem frameworks), consumindo a [PokéAPI](https://pokeapi.co).
> *An interactive, responsive web Pokédex built with **vanilla HTML, CSS & JavaScript**, powered by the [PokéAPI](https://pokeapi.co).*

🔗 **[Ver demo ao vivo / Live demo](https://SEU-USUARIO.github.io/pokedex)**

## 🇧🇷 Português

### Sobre o projeto
Uma aplicação web que permite buscar qualquer Pokémon e visualizar suas informações de forma elegante e interativa. Os dados são obtidos em tempo real a partir da PokéAPI.

### Funcionalidades
- 🔍 **Busca por nome ou número** de qualquer Pokémon
- ⌨️ **Autocomplete** — sugestões aparecem conforme você digita, navegáveis pelo teclado
- ◀️ ▶️ **Navegação** entre Pokémon (botões e setas do teclado)
- 🗂️ **Grade visual** com os 151 Pokémon da primeira geração
- 🧬 **Cadeia de evolução** completa, incluindo evoluções ramificadas (como o Eevee e suas 8 formas)
- 🎨 **Tema dinâmico** — as cores da interface mudam conforme o tipo do Pokémon
- 🔊 **Som do grito** (cry) do Pokémon ao buscar ou clicar no sprite
- 📊 **Estatísticas base** com barras animadas
- 📱 **Layout responsivo** — funciona bem no celular e no desktop

### Tecnologias
- HTML5
- CSS3 (variáveis, animações, layout responsivo)
- JavaScript (ES6+, async/await, Fetch API)
- [PokéAPI](https://pokeapi.co)

### Como rodar localmente
Por ser um projeto sem dependências, basta abrir o arquivo no navegador:
```bash
# clone o repositório
git clone https://github.com/SEU-USUARIO/pokedex.git
cd pokedex

# abra o index.html no navegador (ou use a extensão Live Server do VS Code)
```

### Destaques técnicos
- Consumo de API externa com tratamento de erros
- **Autocomplete eficiente**: a lista de nomes é carregada uma única vez e filtrada localmente, evitando requisições a cada tecla
- **Recursão** para percorrer a árvore de evolução e tratar evoluções com múltiplos ramos
- Manipulação dinâmica do DOM e de variáveis CSS

---

## 🇺🇸 English

### About
A web application to search for any Pokémon and view its information in an elegant, interactive way. Data is fetched in real time from the PokéAPI.

### Features
- 🔍 **Search by name or number** for any Pokémon
- ⌨️ **Autocomplete** — suggestions appear as you type, keyboard-navigable
- ◀️ ▶️ **Navigation** between Pokémon (buttons and arrow keys)
- 🗂️ **Visual grid** of the 151 first-generation Pokémon
- 🧬 **Full evolution chain**, including branching evolutions (like Eevee's 8 forms)
- 🎨 **Dynamic theme** — the UI colors change based on the Pokémon's type
- 🔊 **Pokémon cry** plays on search or when clicking the sprite
- 📊 **Base stats** with animated bars
- 📱 **Responsive layout** — works well on mobile and desktop

### Tech stack
- HTML5
- CSS3 (variables, animations, responsive layout)
- JavaScript (ES6+, async/await, Fetch API)
- [PokéAPI](https://pokeapi.co)

### Run locally
No dependencies — just open the file in your browser:
```bash
git clone https://github.com/SEU-USUARIO/pokedex.git
cd pokedex
# open index.html in your browser (or use VS Code's Live Server extension)
```

### Technical highlights
- External API consumption with error handling
- **Efficient autocomplete**: the full name list is loaded once and filtered locally, avoiding a request on every keystroke
- **Recursion** to traverse the evolution tree and handle multi-branch evolutions
- Dynamic DOM and CSS-variable manipulation

---

## 📄 Licença / License
MIT — sinta-se livre para usar e modificar. / Feel free to use and modify.

> Dados de Pokémon fornecidos pela [PokéAPI](https://pokeapi.co). Pokémon © Nintendo / Game Freak.
> *Pokémon data provided by the [PokéAPI](https://pokeapi.co). Pokémon © Nintendo / Game Freak.*
