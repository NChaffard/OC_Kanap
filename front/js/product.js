// fonctions
function createNode(element){
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}
// Mise en place des parents
const imgParent = document.getElementsByClassName("item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const select = document.getElementById("colors");



// Récupération du id produit dans l'url de la page
let navUrl = new URL (window.location.href);
let id = navUrl.searchParams.get("id");

// mise en place de l'url de l'api
const url = "http://localhost:3000/api/products/" + id;

fetch(url)
.then((resp) => resp.json())
.then((product) => {

    // Création des balises
    let img = createNode("img");

    // Mise en place ddes attributs
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);

    // Mise en place des class

    // Ajout du texte
    title.textContent = product.name;
    price.textContent = product.price;
    description.textContent = product.description;

    // Affichage du html
    append(imgParent[0], img);

    // Mise en place options
    for( let color of product.colors ){
        
        // Création de la balise
        let option = createNode("option");
        
        // Mise en place des attributs
        option.setAttribute("value", color);
        
        // Ajout du texte
        option.textContent = color;
        
        // Affichage du html
        append(select, option);
    }  
})
.then(()=>{
    // Evenement quand clic sur bouton ajouter panier
    const button = document.getElementById("addToCart");
    // detection du clic sur bouton ajouter au panier
    button.addEventListener('click', function(){
        let color = select.value;
        let qty = parseInt(document.getElementById("quantity").value);
        // Verification si il y aune couleur et une quantité saisies
        if (color != "" && qty != 0){
            // Mise en place variable etat qui permet de savoir si l'ajout dans local storage est deja fait
            let etat = false;
            // Comparaison saisie avec localStorage
            for (let i = 0; i < localStorage.length; i++){
                let objLinea = localStorage.getItem("cart"+i);
                let objJson = JSON.parse(objLinea);
                // est ce que le produit dans cette couleur est deja present ?
                if (id == objJson.id && color == objJson.color){
                    // alors on ajoute la qte
                    objJson.quantity += qty;
                    objLinea = JSON.stringify(objJson);
                    localStorage.setItem("cart"+i,objLinea);
                    etat = true;
                }
            }
            // Si non, ajout d'une nouvelle entree
            if (etat === false){

                let cartNb = localStorage.length;
                let objJson = {
                    id : id,
                    color : color,
                    quantity : qty
                }
                let objLinea = JSON.stringify(objJson);
                localStorage.setItem("cart"+cartNb,objLinea);
                etat = true;
            }
        }
    })
})
.catch(function(error){
    // Une erreur est survenue
    console.log(error);
    
});

