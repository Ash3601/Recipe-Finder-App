const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const containerDiv = document.querySelector('.container');
const loader = document.querySelector('.loader');
const APP_KEY = '677efc165e292184502cb2ec91aa9a43';
const APP_ID = '11957e89';
const userSearchCountFlag = 0;
const paginationFooter = document.querySelector('.pagination')
const totalANodes = paginationFooter.querySelectorAll('a').length;
let from = 1;
let to = 10;
let _from = 1;
let _to = 10;
let query = '';
for (let i = 0; i < totalANodes; i++) {
    const value = paginationFooter.querySelectorAll('a')[i].addEventListener('click', async (e) => {
        e.preventDefault();
        if (i == 1) {
            from = 1;
            to = 10;
        }
        else if (i > 1 && i < totalANodes - 1) {
            from = i * 10;
            to = from + 10 - 1;
            _from = from;
            _to = to;
        } else if (i == totalANodes - 1) {
            from = _from + 10;
            to = _to + 10;
            _from = from;
            _to = to;
        } else if (i == 0) {
            if (from - 10 > 0) {
                from = _from - 10;
                to = _to - 10;
                _from = from;
                _to = to;

            }
        }

        if (query === '') {
            alert('Please put a query before clicking');
            document.getElementById("search-input").focus();
            // process.exit(1);
        } else {
            loader.style.display = 'block';
            let recipes = await getAPIData(query);
            loader.style.display = 'none';
            generateHTML(recipes);

        }
    });
}

try {
    let storedRecipes = JSON.parse(localStorage.getItem("recipes"));
    if (storedRecipes) {
        generateHTML(storedRecipes);
    }
} catch (err) {
    localStorage.removeItem("recipes");
    throw err;
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    query = e.target.querySelector('input').value;
    loader.style.display = 'block'
    let recipes = await getAPIData(query);
    loader.style.display = 'none'
    generateHTML(recipes);
});

async function getAPIData(query) {
    const baseURL = `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&to=${to}&from=${from}`;
    try {
        let response = await fetch(baseURL);
        let recipeData = await response.json();
        let recipes = await recipeData.hits;
        return await recipes;
    } catch (err) {
        console.log('An error occurred while fetching', err);
        throw err;
    }
}


function generateHTML(recipes) {
    to = 10;
    from = 1;
    localStorage.setItem('recipes', JSON.stringify(recipes));
    generatedHTML = '';
    recipes.map((recipe) => {
        recipe = recipe.recipe;
        const url = recipe.url;
        const image = recipe.image;
        if (!image || image === '') {
            image = 'https://i.pinimg.com/736x/0d/bb/dd/0dbbdd2944e06b540a3341c8d6a801e4.jpg';
        }
        const title = recipe.label;
        const calorie = recipe.calories;
        generatedHTML += `
        <div class="item">
        <img src="${image}" alt="${title}" srcset="">
        <div class="flex-container">
            <h1 class="title">${title}</h1>
            <a href="${url}" target=”_blank” class="view-btn">View Recipe</a>
        </div>
        <p class="item-data">Calories: ${calorie.toFixed(2)}</p>
    </div>
        `;
    })
    searchResultDiv.innerHTML = generatedHTML;
}

