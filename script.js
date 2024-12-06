let PokemonUrl = 'https://pokeapi.co/api/v2'

const cardsPerPage = 18
let offset = 0
let currentPage = 1

let allPokemons = []

let activeType = 'all'

const btns = document.querySelectorAll('BUTTON')
const menuTypes = document.querySelector('.menu-types')

const types = [
    { name: 'All', color: '#5a5a5a', image: 'pokeball.png' },
    { name: 'Normal', color: '#92999b', image: 'normal.png'},
    { name: 'Fire', color: '#f79431', image: 'fire.png' },
    { name: 'Water', color: '#30a7e2', image: 'water.png' },
    { name: 'Grass', color: '#3dcc6b', image: 'grass.png' },
    { name: 'Electric', color: '#d3b015', image: 'eletric.png' },
    { name: 'Ice', color: '#65c7ce', image: 'ice.png' },
    { name: 'Fighting', color: '#ec678b', image: 'fight.png'},
    { name: 'Poison', color: '#b954e4', image: 'poison.png' },
    { name: 'Ground', color: '#e78145', image: 'ground.png' },
    { name: 'Flying', color: '#4e7bd2', image: 'flying.png' },
    { name: 'Psychic', color: '#f38c89', image: 'psychic.png' },
    { name: 'Bug', color: '#a2d335', image: 'bug.png' },
    { name: 'Rock', color: '#c2ac70', image: 'rock.png' },
    { name: 'Ghost', color: '#5d64cd', image: 'ghost.png' },
    { name: 'Dragon', color: '#5286b8', image: 'dragon.png' },
    { name: 'Dark', color: '#6d7a9a', image: 'dark.png' },
    { name: 'Steel', color: '#5f9caf', image: 'steel.png' },
    { name: 'Fairy', color: '#f685e1', image: 'fairy.png' }
]

window.onload = async () => {
    try {
        await loadPokemons()
    } catch(error) {
        console.log(error)
        alert('Erro ao carregar cards')
    }
}

async function loadPokemons() {
    const cardsContent = document.querySelector('.cards-content')
    cardsContent.innerHTML = ''

    try {
        allPokemons = await getAllPokemons()

        console.log(allPokemons)

        let pokemonsToShow = allPokemons.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)

        for (let i = 0; i < pokemonsToShow.length; i++) {
            let pokemon = pokemonsToShow[i]

            const details = await getPokemonDetails(pokemon.url)

            let pokemonId = details.id
            let pokemonName = capitalizeFirstLetter(details.name)

            const card = document.createElement('div')
            card.className = 'card'

            const img = document.createElement('img')
            img.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${details.name}.png`
            
            img.onerror = function() {
                if (img.src === `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${details.name}.png`) {
                    img.src = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${details.name}.png`
                } else if (img.src === `https://img.pokemondb.net/sprites/scarlet-violet/normal/${details.name}.png`) {
                    img.src = `https://img.pokemondb.net/sprites/go/normal/${details.name}.png`
                } else if (img.src === `https://img.pokemondb.net/sprites/go/normal/${details.name}.png`) {
                    img.src = `https://img.pokemondb.net/sprites/sun-moon/normal/${details.name}.png`
                } else if (img.src === `https://img.pokemondb.net/sprites/sun-moon/normal/${details.name}.png`) {
                    img.src = `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(details.id)}.png`
                } else if (img.src === `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(details.id)}.png`){
                    img.src = `https://img.pokemondb.net/sprites/bank/normal/${details.name}.png`
                } else {
                    img.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/unown-qm.png`
                }
            }

            const cardText = document.createElement('span')
            cardText.className = 'card-text'
            cardText.innerText = `#${pokemonId} - ${pokemonName}`

            card.appendChild(img)
            card.appendChild(cardText)

            cardsContent.appendChild(card)

            card.onclick = async () => {
                loadModal(details); 
            };

            btns.forEach((btn) => {
                if(btn.classList.contains('back-button')) {
                    btn.style.visibility = currentPage === 1 ? 'hidden' : 'visible'
                } else if(btn.classList.contains('next-button')) {
                    btn.style.visibility = currentPage === Math.ceil(allPokemons.length / cardsPerPage) ? 'hidden' : 'visible'
                }
            })

            const pokemonNumbers = document.querySelector('.pokemon-numbers')
            pokemonNumbers.innerText = `${allPokemons.length} Pokémons`

        }
    } catch(error) {
        console.log(error)
    }
}

async function getAllPokemons() {
    if (allPokemons.length > 0) return allPokemons;

    do {
        const url = `${PokemonUrl}/pokemon/?offset=${offset}&limit=${cardsPerPage}`

        try {
            const response = await fetch(url)
            let responseJson = await response.json()

            allPokemons = allPokemons.concat(responseJson.results)

            offset += cardsPerPage
        } catch(error) {
            console.log(error)
            break
        }
    } while (offset < 1024);
    
    allPokemons.pop()

    return allPokemons
}

async function getPokemonDetails(url) {
    try {
        const response = await fetch(url)
        const responseJson = await response.json()
        return responseJson
    } catch(error) {
        console.log(error)
    }
}

async function loadNextPage() {
    currentPage++
    await filterPokemonsByType(activeType.charAt(0).toLowerCase() + activeType.slice(1))
    
}

async function loadPreviousPage() {
    currentPage--
    await filterPokemonsByType(activeType.charAt(0).toLowerCase() + activeType.slice(1))
}

async function filterPokemonsByType(desiredType) {
    if( desiredType === 'all') {
        await loadPokemons()
    } else {
        const url = `${PokemonUrl}/type/${desiredType}`
        let filteredPokemons = []
        
        try {
            const response = await fetch(url)
            let responseJson = await response.json()
    
            filteredPokemons = filteredPokemons.concat(responseJson.pokemon)
    
        } catch(error) {
            console.log(error)
        }
        
        console.log(filteredPokemons)
        renderFilteredPokemons(filteredPokemons);
    }
}

async function renderFilteredPokemons(filteredPokemons) {
    const cardsContent = document.querySelector('.cards-content')
    cardsContent.innerHTML = ''
        
        try {
            let pokemonsToShow = filteredPokemons.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
    
            for (let i = 0; i < pokemonsToShow.length; i++) {
                let pokemon = pokemonsToShow[i]
    
                const details = await getPokemonDetails(pokemon.pokemon.url)
    
                let pokemonId = details.id
                let pokemonName = capitalizeFirstLetter(details.name)
    
                const card = document.createElement('div')
                card.className = 'card'
    
                const img = document.createElement('img')
                img.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${details.name}.png`
                
                img.onerror = function() {
                    if (img.src === `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${details.name}.png`) {
                        img.src = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${details.name}.png`
                    } else if (img.src === `https://img.pokemondb.net/sprites/scarlet-violet/normal/${details.name}.png`) {
                        img.src = `https://img.pokemondb.net/sprites/go/normal/${details.name}.png`
                    } else if (img.src === `https://img.pokemondb.net/sprites/go/normal/${details.name}.png`) {
                        img.src = `https://img.pokemondb.net/sprites/sun-moon/normal/${details.name}.png`
                    } else if (img.src === `https://img.pokemondb.net/sprites/sun-moon/normal/${details.name}.png`) {
                        img.src = `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(details.id)}.png`
                    } else if (img.src === `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(details.id)}.png`){
                        img.src = `https://img.pokemondb.net/sprites/bank/normal/${details.name}.png`
                    } else {
                        img.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/unown-qm.png`
                    }
                }
    
                const cardText = document.createElement('span')
                cardText.className = 'card-text'
                cardText.innerText = `#${pokemonId} - ${pokemonName}`
    
                card.appendChild(img)
                card.appendChild(cardText)
    
                cardsContent.appendChild(card)
    
                card.onclick = async () => {
                    loadModal(details);
                };
    
                btns.forEach((btn) => {
                    if(btn.classList.contains('back-button')) {
                        btn.style.visibility = currentPage === 1 ? 'hidden' : 'visible'
                    } else if(btn.classList.contains('next-button')) {
                        btn.style.visibility = currentPage === Math.ceil(filteredPokemons.length / cardsPerPage) ? 'hidden' : 'visible'
                    }
                })

                const pokemonNumbers = document.querySelector('.pokemon-numbers')
                pokemonNumbers.innerText = `${filteredPokemons.length} Pokémons`
            }
        } catch(error) {
            console.log(error)
        }
}

async function loadModal(pokemon) {
    console.log(pokemon)
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';

    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${pokemon.name}.png`;
    pokemonImage.className = 'pokemon-image';
    
    pokemonImage.onerror = function() {
        if (pokemonImage.src === `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${pokemon.name}.png`) {
            pokemonImage.src = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${pokemon.name}.png`
        } else if (pokemonImage.src === `https://img.pokemondb.net/sprites/scarlet-violet/normal/${pokemon.name}.png`) {
            pokemonImage.src = `https://img.pokemondb.net/sprites/go/normal/${pokemon.name}.png`
        } else if (pokemonImage.src === `https://img.pokemondb.net/sprites/go/normal/${pokemon.name}.png`) {
            pokemonImage.src = `https://img.pokemondb.net/sprites/sun-moon/normal/${pokemon.name}.png`
        } else if (pokemonImage.src === `https://img.pokemondb.net/sprites/sun-moon/normal/${pokemon.name}.png`) {
            pokemonImage.src = `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(pokemon.id)}.png`
        } else if (pokemonImage.src === `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(pokemon.id)}.png`){
            pokemonImage.src = `https://img.pokemondb.net/sprites/bank/normal/${pokemon.name}.png`
        } else {
            pokemonImage.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/unown-qm.png`
        }
    }

    const name = document.createElement('span');
    name.className = 'pokemon-details';
    name.innerText = capitalizeFirstLetter(pokemon.name);

    const types = pokemon.types?.map((type) => capitalizeFirstLetter(type.type.name)) || [];
    const type = document.createElement('span');
    type.className = 'pokemon-details';
    type.innerText = `Type: ${types.join(', ')}`;

    const height = document.createElement('span');
    height.className = 'pokemon-details';
    height.innerText = `Height: ${convertHeight(pokemon.height || 0)} m`;

    const weight = document.createElement('span');
    weight.className = 'pokemon-details';
    weight.innerText = `Weight: ${convertWeight(pokemon.weight || 0)} kg`;

    const abilities = pokemon.abilities?.map((ability) => capitalizeFirstLetter(ability.ability.name)) || [];
    const ability = document.createElement('span');
    ability.className = 'pokemon-details';
    ability.innerText = `Abilities: ${abilities.join(', ')}`;

    modalContent.appendChild(pokemonImage);
    modalContent.appendChild(name);
    modalContent.appendChild(type);
    modalContent.appendChild(height);
    modalContent.appendChild(weight);
    modalContent.appendChild(ability);
}

document.querySelector('.modal').addEventListener('click', (event) => {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent.contains(event.target)) {
        hideModal();
    }
});

function hideModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
}

function convertHeight(height) {
    return (height / 10).toFixed(1);
}

function convertWeight(weight) {
    return (weight / 10).toFixed(1);
}

function capitalizeFirstLetter(pokemonName) {
    return pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
}

function formatPokemonId(id) {
    if (id < 10) {
        return `000${id}`;
    } else if (id < 100) {
        return `00${id}`;
    } else if (id < 1000) {
        return `0${id}`;
    }
    return `${id}`;
}

function searchPokemons(pokemonName) {
    const cardsContent = document.querySelector('.cards-content')
    cardsContent.innerHTML = ''

    const searchInput = document.querySelector(".pokemon-search")
    searchInput.placeholder = 'Search a Pokémon'

    let resultPokemon = allPokemons.filter((pokemon) => pokemon.name === pokemonName)

    if(resultPokemon.length > 0) {
        resultPokemon.forEach(async (pokemon) => {
            const details = await getPokemonDetails(pokemon.url);

            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${details.name}.png`;

            img.onerror = function() {
                if (img.src === `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${details.name}.png`) {
                    img.src = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${details.name}.png`
                } else if (img.src === `https://img.pokemondb.net/sprites/scarlet-violet/normal/${details.name}.png`) {
                    img.src = `https://img.pokemondb.net/sprites/go/normal/${details.name}.png`
                } else if (img.src === `https://img.pokemondb.net/sprites/go/normal/${details.name}.png`) {
                    img.src = `https://img.pokemondb.net/sprites/sun-moon/normal/${details.name}.png`
                } else if (img.src === `https://img.pokemondb.net/sprites/sun-moon/normal/${details.name}.png`) {
                    img.src = `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(details.id)}.png`
                } else if (img.src === `https://projectpokemon.org/images/sprites-models/sv-sprites-home/${formatPokemonId(details.id)}.png`){
                    img.src = `https://img.pokemondb.net/sprites/bank/normal/${details.name}.png`
                } else {
                    img.src = `https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/unown-qm.png`
                }
            }

            const cardText = document.createElement('span');
            cardText.className = 'card-text';
            cardText.innerText = `#${details.id} - ${capitalizeFirstLetter(details.name)}`;

            card.appendChild(img);
            card.appendChild(cardText);

            card.onclick = async () => {
                loadModal(details);
            };

            cardsContent.appendChild(card);

            btns.forEach((btn) => {
                btn.style.visibility = 'hidden' 
            })
        });
        
    } else {
        const noResultMessage = document.createElement('div')

        searchInput.value = ''
        searchInput.placeholder = 'Pokemon Not Found'

        noResultMessage.className = 'no-results'
        noResultMessage.innerText = 'No Pokémon found'
        cardsContent.appendChild(noResultMessage)
    }

    return resultPokemon
}

btns.forEach((btn) => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('next-button')) {
            loadNextPage()
        } else {
            loadPreviousPage()
        }
    })
})

types.forEach((type) => {
    const div = document.createElement('div')
    div.classList.add('content-types')
    div.setAttribute('data-type', type.name)
    div.style.setProperty('--clr', type.color)

    const img = document.createElement('img')
    img.classList.add('types')
    img.src = `images/${type.image}`

    const span = document.createElement('span')
    span.innerText = type.name

    div.appendChild(img)
    div.appendChild(span)

    menuTypes.appendChild(div)

    div.getAttribute('data-type') === 'All' ? div.classList.add('active') : ''

    div.addEventListener('click', () => {
        currentPage = 1
        activeType = div.getAttribute('data-type')
        
        types.forEach((type) => {
            document.querySelector(`[data-type='${type.name}']`).classList.remove('active')
        })

        div.classList.add('active')

        console.log(activeType.charAt(0).toLowerCase() + activeType.slice(1))

        filterPokemonsByType(activeType.charAt(0).toLowerCase() + activeType.slice(1))
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const searchIcon = document.querySelector(".search-icon")
    const searchInput = document.querySelector(".pokemon-search")
    const searchContainer = document.querySelector(".search")

    searchIcon.addEventListener("click", () => {
        searchIcon.classList.add("hidden")
        searchInput.classList.remove("hidden")
        searchInput.focus()
    })

    document.addEventListener("click", (e) => {
        if (!searchContainer.contains(e.target) && searchInput.value.trim() === "" ) {
            searchInput.classList.add("hidden")
            searchIcon.classList.remove("hidden")
            searchInput.placeholder = 'Search a Pokémon'
        }
    })

    searchInput.addEventListener('keydown', (e) => {
        e.key === 'Enter' && searchPokemons(searchInput.value)
    })
})