// Gestion de l'affichage de la page d'accueil

// Fonctions qui simplifient la création déléments
function createNode(element){
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

// Mise en place du parent
const section = document.getElementById("items");

// mise en place de l'url de l'api
const url = 'http://localhost:3000/api/products';

fetch(url)
.then( (resp) => resp.json())
  
.then( (data) => { 
   for (let product of data) {
       
        // Création des balises
        let a = createNode("a");
        let article = createNode("article");
        let img = createNode("img");
        let h3 = createNode("h3");
        let p = createNode("p");

        // Mise en place ddes attributs
        a.setAttribute("href", "./product.html?id=" + product._id);
        img.setAttribute("src", product.imageUrl);
        img.setAttribute("alt", product.altTxt);

        // Mise en place des class CSS
        h3.classList.add("productName");
        p.classList.add("productDescription");

        // Ajout du texte
        h3.textContent = product.name;
        p.textContent = product.description;

        // Affichage du html
        append(section, a);
        append(a, article);
        append(article, img);
        append(article, h3);
        append(article, p);   
   }
})
.catch(function(error){
    // Une erreur est survenue
    console.log(error);
    
});


