import recipes from './recipes.mjs';

function RandomInt(num) {
    return Math.floor(Math.random()*num);
}

function GetRandomFromList(list) {
    const listLength = list.length;
    const randomIndex = RandomInt(listLength);
    return list[randomIndex];
}

function RecipeTemplate(recipe) {
    return `<article class="recipe-article">
            <img class="recipe-image" src="${recipe.image}" alt="An apple crisp with ice cream.">
            <span>
                ${TagTemplate(recipe.tags)}
                <h2 class="recipe-name">${recipe.name}</h2>
                ${ratingTemplate(recipe.rating)}
                <p class="recipe-description">${recipe.description}</p>
            </span>
            </article>`
}

function TagTemplate(tags) {
    let html = `<div class="tag-holder">`
    html += tags.map(ConvertTagToHTML).join('');
    html += `</div>`
    return html;
}

function ConvertTagToHTML(tag) {
    return `<p class="tag">${tag}</p>`
}

function ratingTemplate(rating) {
	// begin building an html string using the ratings HTML written earlier as a model.
	let html = `<span
	class="rating"
	role="img"
	aria-label="Rating: ${rating} out of 5 stars"
>`
// our ratings are always out of 5, so create a for loop from 1 to 5
    for (let i = 1; i <= 5; i++){
        // check to see if the current index of the loop is less than our rating
		// if so then output a filled star
        if(i < rating){
            html += `<span aria-hidden="true" class="icon-star">⭐</span>`
        }
        else {
            html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`
        }

		// else output an empty star
    }
	// after the loop, add the closing tag to our string
	html += `</span>`
	// return the html string
	return html
}

function renderRecipe(recipeList) {
	// get the element we will output the recipes into
    let recipeArticle = document.getElementById("recipe-article");

	// use the recipeTemplate function to transform our recipe objects into recipe HTML strings
    let recipe = recipeList.map(RecipeTemplate).join('');

	// Set the HTML strings as the innerHTML of our output element.
    recipeArticle.innerHTML = recipe;

}

function init() {
    // get a random recipe
    const recipe = GetRandomFromList(recipes)
    // render the recipe with renderRecipes.
    renderRecipe([recipe]);
  }
  init();

const form = document.getElementById("search-recipe");
const searchInput = document.getElementById("search-input");
const button = document.getElementById("search-button")

function FilterRecipes(list, query) {
    query = query.toLowerCase(); // Convert the query to lowercase for case-insensitive search

    let filteredList = list.filter(recipe => 
        recipe.name.toLowerCase().includes(query) || // Check if the name contains the query
        recipe.tags.some(tag => tag.toLowerCase().includes(query)) // Check if any tag contains the query
    );

    filteredList.sort((a, b) => a.name.localeCompare(b.name));
    return filteredList; // Return the filtered recipes
}



form.addEventListener("submit", searchForRecipe);
button.addEventListener("click", searchForRecipe)

function searchForRecipe(){
    let recipeArticle = document.getElementById("recipe-article");
    let query = searchInput.value;
    let newRecipeList = FilterRecipes(recipes, query);
    let html = newRecipeList.map(RecipeTemplate).join('');
    recipeArticle.innerHTML = html;
}