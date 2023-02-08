// Mise en place du parent des articles
const section = document.getElementById("items");
// mise en place de l'url de l'api
const url = 'http://localhost:3000/api/products';

// Affichage de la liste des articles
// Récuperation de la liste des articles dans l'api
fetch(url)
// Mise en forme json
.then( (resp) => resp.json())
// Affichage des articles
.then( (data) => { 
   for (let product of data) {
        //Création du code HTML de l'article
       let templateHTML = `<a href="./product.html?id=${product._id}">
                                    <article>
                                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                                    <h3 class="productName">${product.name}</h3>
                                    <p class="productDescription">${product.description}</p>
                                    </article>
                                </a>`;
        // Ajout du code HTML à la page
        section.innerHTML += templateHTML; 
   }
})
.catch(function(error){
    // Une erreur est survenue
    console.log(error);   
});


