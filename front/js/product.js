// ---------------Variables-----------------------

// Récupération du id produit dans l'url de la page
let navUrl = new URL (window.location.href);
let id = navUrl.searchParams.get("id");

// Appel du panier
let basket = new Basket();

// Mise en place de l'url de l'api
const url = "http://localhost:3000/api/products/" + id;

// Récuperation des balises
const imgParent = document.getElementsByClassName("item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const errorColorParent = document.getElementsByClassName("item__content__settings__color")[0];
const errorQuantityParent = document.getElementsByClassName("item__content__settings__quantity")[0];
const select = document.getElementById("colors");
const button = document.getElementById("addToCart");

// Fonctions création et affichage d'élements
function createNode(element){
    return document.createElement(element);
}

function append(parent, el){
    return parent.appendChild(el);
}

// Remplissage des données liées à l'article
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
    
    // Mise en place messages d'erreurs
    let spanErrorColor = createNode("span");
    let spanErrorQuantity = createNode("span");

    spanErrorColor.setAttribute("style", "color: #fbbcbc");
    spanErrorQuantity.setAttribute("style", "color: #fbbcbc");


    append(errorColorParent, spanErrorColor);
    append(errorQuantityParent, spanErrorQuantity);

})
.then(()=>{
    // Evenement quand clic sur bouton ajouter panier
    button.addEventListener('click', function(){
        // Récupération des balises pour les messages d'erreurs
        const spanErrorColor = errorColorParent.lastChild;
        const spanErrorQuantity = errorQuantityParent.lastChild;
        let msg = "";
        spanErrorColor.textContent = msg;
        spanErrorQuantity.textContent = msg;
        
        // Récupération de la couleur
        let color = select.value;
        
        // Préparation pour tester la quantité saisie
        let input = document.getElementById("quantity").value;
        let numberRegExp = new RegExp('^[0-9]{1,3}$','g');
        let inputTest = numberRegExp.test(input);
        
        // Récupération de la quantité sous forme d'entier
        let quantity = parseInt(input);
        if (color == ""){
            msg ="Il faut choisir une couleur !";
            return spanErrorColor.textContent = msg;
        }
        // Vérification de la quantité saisie
        if (isNaN(quantity)){
            msg ="La quantité doit être un nombre !";
            return spanErrorQuantity.textContent = msg;
        }
        else if (quantity > 100){
            msg ="La quantité maximum est de 100 articles !";
            return spanErrorQuantity.textContent = msg;
        }
        else if (quantity == 0){
            msg ="La quantité ne peut pas être nulle !";
            return spanErrorQuantity.textContent = msg;
        }
        else if (!inputTest){
            msg ="La quantité doit être un nombre entier !";
            return spanErrorQuantity.textContent = msg;
        }
        else{      
            // Mise en forme du produit
            let product = {
                id : id,
                "color" : color,
                "quantity" : quantity
            } ;
            // Ajout du produit au panier
            basket.add(product);
            return alert("Produit ajouté au panier !");
        }
        })
})
.catch(function(error){
    // Une erreur est survenue
    console.log(error);   
});

