// fonctions
function createNode(element){
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}
// Mise en place du parent
const section = document.getElementById("cart__items");

// affichage du panier en recuperant les donnees du localStorage
if (localStorage.length === 0){
    // Panier vide
    console.log("panier vide !")
}
else if(localStorage.length > 0){
    // Le panier contient des articles
    // Recuperation du localStorage
    for(i =0; i < localStorage.length; i++ ){
        // Mise en forme json
        let objLinea = localStorage.getItem("cart"+i);
        let objJson = JSON.parse(objLinea);
        let id = objJson.id;
        let color = objJson.color;
        let qty = objJson.quantity;

        // Recuperation des donnees manquantes dans l'api
        let url = "http://localhost:3000/api/products/" + id;
        fetch(url)
        .then((resp) => resp.json())
        .then((product) =>{
            // Creation des balises
            let article = createNode("article");
            let divImg = createNode("div");
            let img = createNode("img");
            let divContent = createNode("div");
            let divDescription = createNode("div");
            let h2 = createNode("h2");
            let pColor = createNode("p");
            let pPrice = createNode("p");
            let divSettings = createNode("div");
            let divQuantity = createNode("div");
            let pQuantity = createNode("p");
            let input = createNode("input");
            let divDelete = createNode("div");
            let pDelete = createNode("p");
            // mise en place des attributs
            article.setAttribute("data-id", id);
            article.setAttribute("data-color", color);
            img.setAttribute("src", product.imageUrl);
            img.setAttribute("alt", product.altTxt);
            input.setAttribute("name", "itemQuantity");
            input.setAttribute("min", "1");
            input.setAttribute("max", "100");
            input.setAttribute("value", qty);
            // mise en place des class CSS
            article.classList.add("cart__item");
            divImg.classList.add("cart__item__img");
            divContent.classList.add("cart__item__content");
            divDescription.classList.add("cart__item__content__description");
            divSettings.classList.add("cart__item__content__settings");
            divQuantity.classList.add("cart__item__content__settings__quantity");
            input.classList.add("itemQuantity");
            divDelete.classList.add("cart__item__content__settings__delete");
            pDelete.classList.add("deleteItem");
            // ajout du texte
            h2.textContent = product.name;
            pColor.textContent = color;
            pPrice.textContent = product.price + ",00 €";
            pQuantity.textContent = "Qté : " + qty;
            pDelete.textContent = "Supprimer";
            // Affichage du HTML
            append(section, article);
                append(article, divImg);
                    append(divImg, img);
                append(article, divContent);
                    append(divContent, divDescription);
                        append(divDescription, h2);
                        append(divDescription, pColor);
                        append(divDescription, pPrice);
                    append(divContent, divSettings);
                        append(divSettings, divQuantity);
                            append(divQuantity, pQuantity);
                            append(divQuantity, input);
                        append(divSettings, divDelete);
                            append(divDelete, pDelete);

                    

        })
        .catch(function(error){
            // Une erreur est survenue
            console.log(error);
            
        });

    }
}
    