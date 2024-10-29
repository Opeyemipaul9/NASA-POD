const resultsNav = document.getElementById('resultsNav');
const favoritesNav  = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader  = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'jyJq7haspoKZ4qLtNbzSJJFYuP39bT45j6h1bJf6';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page){
    window.scrollTo({top:0, behavior:'instant'});
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray = page === 'results'? resultsArray : Object.values(favorites);
    
  
    currentArray.forEach((results)=>{

        // Card container
        const card = document.createElement('div');
        card.classList.add('card');

        // Link
        const link = document.createElement('a');
        link.href = results.hdurl
        link.title = 'View Full image';
        link.target = '_blank';

        // image
        const image = document.createElement('img');
        image.src = results.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top'); 

        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = results.title;

        // Save Text
        const saveText =document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick',  `saveFavorites('${results.url}')`);
        } else{
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick',  `removeFavorites('${results.url}')`);
        }

        // card Text
        const cardText = document.createElement('p');
        cardText.textContent = results.explanation;
        
        // Footer Container
        const footer  = document.createElement('small');
        footer.classList.add('text-muted');

        // Date
        const date = document.createElement('strong');
        date.textContent = results.date;

        // Copyright
        const copyrightresult = results.copyright === undefined ? '' : results.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `${copyrightresult}`; 


        // Append
        footer.append(date,  copyright);
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
    });

}

function updateDOM(page){
    // Get favorites from local storage
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
       
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);

}


// Get 10 IImages from Nasa API
async function getNasaPictures(){
    // Show Loader
    loader.classList.remove('hidden');

    try{
        const response  = await fetch(apiUrl);
        resultsArray = await response.json();
        
        updateDOM('results');
    }
    catch(error){
        // Catch error here
    }
}

// AD RESULTS TO FAVORITES
function saveFavorites(itemUrl){
    resultsArray.forEach((item)=>{
        
        // Lopp through results array to selects favorites
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;

            //  show save conformation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() =>{
                saveConfirmed.hidden = true;
            }, 2000);

            //  Set favorites in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
});
}
// Remove item from favorites
function removeFavorites(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
    //  Set favorites in local storage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
    }
}

 
// oN LOAD
getNasaPictures(); 