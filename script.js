const card = document.getElementById('card');
const input = document.getElementById('search');
const goBtn = document.getElementById('go');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const gridBtn = document.getElementById('gridBtn');
const gridOverlay = document.getElementById('gridOverlay');
const gridClose = document.getElementById('gridClose');
const gridEl = document.getElementById('grid');
const suggestionsEl = document.getElementById('suggestions');

let currentId = null;
let currentCry = null;
let allNames = [];
let activeIndex = -1;

const TYPE_COLORS = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD'
};
const STAT_LABELS = {
    'hp': 'HP', 'attack': 'Ataque', 'defense': 'Defesa',
    'special-attack': 'At. Esp.', 'special-defense': 'Def. Esp.', 'speed': 'Velocidade'
};

function applyTheme(typeName) {
    const color = TYPE_COLORS[typeName] || '#3b6fff';
    document.documentElement.style.setProperty('--theme', color);
}

function showLoading() {
    card.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';
}
function showError(msg) {
    card.innerHTML = '<div class="error"><p>❌ ' + msg + '</p></div>';
}

async function fetchPokemon(query) {
    const q = String(query).trim().toLowerCase();
    if (!q) return;
    showLoading();
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(q));
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        renderPokemon(data);
        loadEvolution(data.species.url);
    } catch (e) {
        showError('Pokémon "' + query + '" não encontrado. Confira o nome ou número.');
    }
}

function playCry(url) {
    if (!url) return;
    if (currentCry) currentCry.pause();
    currentCry = new Audio(url);
    currentCry.volume = 0.4;
    currentCry.play().catch(function () { });
}

function renderPokemon(p) {
    currentId = p.id;
    const mainType = p.types[0].type.name;
    applyTheme(mainType);
    const glow = (TYPE_COLORS[mainType] || '#3b6fff') + '55';
    const sprite = p.sprites.other['official-artwork'].front_default || p.sprites.front_default;
    const cryUrl = p.cries ? (p.cries.latest || p.cries.legacy) : null;

    const typesHTML = p.types.map(function (t) {
        const c = TYPE_COLORS[t.type.name] || '#777';
        return '<span class="type-badge" style="background:' + c + '">' + t.type.name + '</span>';
    }).join('');

    const statsHTML = p.stats.map(function (s) {
        const pct = Math.min(100, (s.base_stat / 180) * 100);
        const c = TYPE_COLORS[mainType] || '#3b6fff';
        return '<div class="stat-row">' +
            '<span class="stat-name">' + (STAT_LABELS[s.stat.name] || s.stat.name) + '</span>' +
            '<span class="stat-num">' + s.base_stat + '</span>' +
            '<div class="stat-track"><div class="stat-fill" style="background:' + c + '" data-pct="' + pct + '"></div></div>' +
            '</div>';
    }).join('');

    card.innerHTML =
        '<div class="card-top">' +
        '<div class="poke-name">' + p.name + '</div>' +
        '<div class="dex-num">#' + String(p.id).padStart(3, '0') + '</div>' +
        '</div>' +
        '<div class="sprite-stage" style="--glow:' + glow + '">' +
        '<img id="sprite" src="' + sprite + '" alt="' + p.name + '" title="Clique para ouvir o grito">' +
        '</div>' +
        '<div class="types">' + typesHTML + '</div>' +
        '<div class="info-bar">' +
        '<div class="info-cell"><div class="info-label">Altura</div><div class="info-value">' + (p.height / 10).toFixed(1) + ' m</div></div>' +
        '<div class="info-cell"><div class="info-label">Peso</div><div class="info-value">' + (p.weight / 10).toFixed(1) + ' kg</div></div>' +
        '<div class="info-cell"><div class="info-label">Exp. Base</div><div class="info-value">' + (p.base_experience != null ? p.base_experience : '—') + '</div></div>' +
        '</div>' +
        '<div class="stats"><h3>Estatísticas base</h3>' + statsHTML + '</div>' +
        '<div class="evo"><h3>Evolução</h3><div class="evo-chain" id="evoChain"><span style="color:var(--muted);font-size:0.8rem">carregando...</span></div></div>';

    requestAnimationFrame(function () {
        document.querySelectorAll('.stat-fill').forEach(function (el) { el.style.width = el.dataset.pct + '%'; });
    });

    playCry(cryUrl);
    const spriteEl = document.getElementById('sprite');
    if (spriteEl) spriteEl.addEventListener('click', function () { playCry(cryUrl); });
}

async function loadEvolution(speciesUrl) {
    try {
        const sp = await (await fetch(speciesUrl)).json();
        const chainData = await (await fetch(sp.evolution_chain.url)).json();

        const stages = [];

        function walk(node, depth) {
            if (!stages[depth]) stages[depth] = [];
            stages[depth].push(node.species.name);
            node.evolves_to.forEach(function (child) { walk(child, depth + 1); });
        }
        walk(chainData.chain, 0);

        const chainEl = document.getElementById('evoChain');
        if (!chainEl) return;

        chainEl.innerHTML = stages.map(function (group, i) {
            const arrow = i > 0 ? '<span class="evo-arrow">→</span>' : '';
            const items = group.map(function (name) {
                return '<div class="evo-item" data-name="' + name + '">' +
                    '<img src="" alt="' + name + '">' +
                    '<span>' + name + '</span>' +
                    '</div>';
            }).join('');
            const cls = group.length > 1 ? 'evo-stage multi' : 'evo-stage';
            return arrow + '<div class="' + cls + '">' + items + '</div>';
        }).join('');

        chainEl.querySelectorAll('.evo-item').forEach(async function (item) {
            const name = item.dataset.name;
            try {
                const d = await (await fetch('https://pokeapi.co/api/v2/pokemon/' + name)).json();
                item.querySelector('img').src = d.sprites.other['official-artwork'].front_default || d.sprites.front_default;
            } catch (e) { }
            item.addEventListener('click', function () { fetchPokemon(name); });
        });
    } catch (e) {
        const chainEl = document.getElementById('evoChain');
        if (chainEl) chainEl.innerHTML = '<span style="color:var(--muted);font-size:0.8rem">sem dados de evolução</span>';
    }
}

function goPrev() { if (currentId && currentId > 1) fetchPokemon(currentId - 1); }
function goNext() { if (currentId && currentId < 1025) fetchPokemon(currentId + 1); }

let gridLoaded = false;
async function openGrid() {
    gridOverlay.classList.add('open');
    if (gridLoaded) return;
    gridLoaded = true;
    let html = '';
    for (let id = 1; id <= 151; id++) {
        const img = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png';
        html += '<div class="grid-cell" data-id="' + id + '">' +
            '<img src="' + img + '" loading="lazy" alt="#' + id + '">' +
            '<div class="gn">#' + String(id).padStart(3, '0') + '</div>' +
            '</div>';
    }
    gridEl.innerHTML = html;
    gridEl.querySelectorAll('.grid-cell').forEach(function (cell) {
        cell.addEventListener('click', function () {
            fetchPokemon(cell.dataset.id);
            gridOverlay.classList.remove('open');
        });
    });
}

async function loadNames() {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500');
        const data = await res.json();
        allNames = data.results.map(function (r) { return r.name; });
    } catch (e) {
        allNames = [];
    }
}

function updateSuggestions() {
    const term = input.value.trim().toLowerCase();
    activeIndex = -1;
    if (term.length < 1) { closeSuggestions(); return; }

    const matches = allNames
        .filter(function (name) { return name.startsWith(term); })
        .slice(0, 8);

    if (matches.length === 0) { closeSuggestions(); return; }

    suggestionsEl.innerHTML = matches.map(function (name) {
        const matched = name.slice(0, term.length);
        const rest = name.slice(term.length);
        return '<div class="suggestion" data-name="' + name + '">' +
            '<span class="match">' + matched + '</span>' + rest +
            '</div>';
    }).join('');

    suggestionsEl.querySelectorAll('.suggestion').forEach(function (el) {
        el.addEventListener('click', function () {
            input.value = el.dataset.name;
            closeSuggestions();
            fetchPokemon(el.dataset.name);
        });
    });

    suggestionsEl.classList.add('open');
}

function closeSuggestions() {
    suggestionsEl.classList.remove('open');
    activeIndex = -1;
}

function moveActive(dir) {
    const items = suggestionsEl.querySelectorAll('.suggestion');
    if (items.length === 0) return;
    items.forEach(function (el) { el.classList.remove('active'); });
    activeIndex += dir;
    if (activeIndex < 0) activeIndex = items.length - 1;
    if (activeIndex >= items.length) activeIndex = 0;
    items[activeIndex].classList.add('active');
    items[activeIndex].scrollIntoView({ block: 'nearest' });
}

goBtn.addEventListener('click', function () { closeSuggestions(); fetchPokemon(input.value); });

input.addEventListener('input', updateSuggestions);

input.addEventListener('keydown', function (e) {
    const open = suggestionsEl.classList.contains('open');
    if (e.key === 'ArrowDown' && open) { e.preventDefault(); moveActive(1); return; }
    if (e.key === 'ArrowUp' && open) { e.preventDefault(); moveActive(-1); return; }
    if (e.key === 'Enter') {
        const items = suggestionsEl.querySelectorAll('.suggestion');
        if (open && activeIndex >= 0 && items[activeIndex]) {
            input.value = items[activeIndex].dataset.name;
        }
        closeSuggestions();
        fetchPokemon(input.value);
    }
    if (e.key === 'Escape') closeSuggestions();
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-row')) closeSuggestions();
});

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);
gridBtn.addEventListener('click', openGrid);
gridClose.addEventListener('click', function () { gridOverlay.classList.remove('open'); });
document.addEventListener('keydown', function (e) {
    if (e.target === input) return;
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
});

loadNames();