document.querySelectorAll('.button-container button').forEach(button => {
    button.addEventListener('click', (event) => {
        const context = event.target.getAttribute('data-context');
        const search = document.getElementById('search').value.toLowerCase();
        
        if (context) {
            handleSearch(context, search);
        } else if (event.target.id === 'clear-button') {
            clearResults();
        } else if (event.target.id === 'random-button') {
            fetchRandomPokemon();
        }
    });
});

function handleSearch(context, search) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';

    let url;
    if (context === 'name' || context === 'id') {
        url = `https://pokeapi.co/api/v2/pokemon/${search}`;
    } else if (context === 'type') {
        url = `https://pokeapi.co/api/v2/type/${search}`;
    } else if (context === 'ability') {
        url = `https://pokeapi.co/api/v2/ability/${search}`;
    }

    if (url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se encontraron resultados');
                }
                return response.json();
            })
            .then(data => {
                spinner.style.display = 'none';
                if (context === 'name' || context === 'id') {
                    displayPokemon(data);
                } else if (context === 'type' || context === 'ability') {
                    displayPokemonList(data.pokemon, context);
                }
            })
            .catch(error => {
                showError(error.message);
                spinner.style.display = 'none';
            });
    } else {
        showError('Contexto de búsqueda no válido');
        spinner.style.display = 'none';
    }
}

function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1;
    fetchPokemon(randomId);
}

function fetchPokemon(search) {
    handleSearch('id', search);
}

function displayPokemon(data) {
    const pokemon = document.getElementById('pokemon');
    pokemon.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Experiencia base: ${data.base_experience}</p>
        <p>Altura: ${data.height}</p>
        <p>Orden: ${data.order}</p>
        <p>Peso: ${data.weight}</p>
        <p>Habilidad: <br>${data.abilities.map(a => a.ability.name).join('<br> ')}</p>
    `;
}

function displayPokemonList(pokemonList, context) {
    const pokemon = document.getElementById('pokemon');
    pokemon.innerHTML = `<h2>Pokemones con ${context}</h2>`;
    pokemonList.forEach(p => {
        fetch(p.pokemon.url)
            .then(response => response.json())
            .then(data => {
                pokemon.innerHTML += `
                    <div>
                        <h3>${data.name}</h3>
                        <img src="${data.sprites.front_default}" alt="${data.name}">
                    </div>
                `;
            });
    });
}

function clearResults() {
    document.getElementById('pokemon').innerHTML = '';
    document.getElementById('search').value = '';
}

function showError(message) {
    const pokemon = document.getElementById('pokemon');
    pokemon.innerHTML = `<p style="color: red;">${message}</p>`;
}
