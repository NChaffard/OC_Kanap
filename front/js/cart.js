// fonctions
function createNode(element){
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}
// Gestion d'evenements
function changeHandler(id, color){
    console.log("qte changee pour: "+id+" qui a la couleur "+color);
    // Recuperation de la quantité modifiée
    let newQty = document.getElementById(id+color).value;
    // Remise a zero des totaux
    this.totalQty = 0;
    this.totalPrice = 0;
    console.log("Value modifiée: "+newQty);
    // Recuperation de l'article dans le localStorage
    for(i = 0; i < localStorage.length; i++){
         // Mise en forme json
         let objLinea = localStorage.getItem("cart"+i);
         let objJson = JSON.parse(objLinea);
         let localId = objJson.id;
         let localColor = objJson.color;
         if (id == localId && color == localColor){
            //  puis mise a jour de la quanttité dans le localStorage
             console.log("Article trouvé !");
             objJson.quantity = newQty;
             objLinea = JSON.stringify(objJson);
             localStorage.setItem("cart"+i, objLinea);
             console.log(this.spanTotalQty);
         }
        //  Recuperation du prix
        // essayer avec element.closest()
        article = document.querySelector("[data-id='"+objJson.id+"']");
        description = article.querySelector(".cart__item__content__description");
        price = description.children[2].textContent.replace('€','');
        console.log(price);
            
        
        //  Ajout des totaux
        this.totalQty += parseInt(objJson.quantity);
        // Pour le prix il faut recuperer le prix dans l'article
        this.totalPrice += parseInt(price) * parseInt(objJson.quantity);
        this.spanTotalQty.textContent = totalQty;
        this.spanTotalPrice.textContent = totalPrice + ",00";
        console.log("qty: "+this.totalQty+", prix: "+this.totalPrice);
        

    }
}

function clickHandler(id, color){
    console.log("click !");
    for(i = 0; i < localStorage.length; i++){
        // Mise en forme json
        let objLinea = localStorage.getItem("cart"+i);
        let objJson = JSON.parse(objLinea);
        let localId = objJson.id;
        let localColor = objJson.color;
        if (id == localId && color == localColor){
            //  puis mise a jour de la quanttité dans le localStorage
             console.log("Article trouvé !");
             localStorage.removeItem("cart"+i);
             window.location.reload();
             console.log("Article supprimé !");

         }
    }

}
// Mise en place du parent
const section = document.getElementById("cart__items");

// Creation variable quantité totale et prix total
totalQty = 0;
totalPrice = 0;

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
            input.setAttribute("onchange", "changeHandler('"+id+"', '"+color+"')");
            input.setAttribute("id", id+color);
            pDelete.setAttribute("onclick", "clickHandler('"+id+"', '"+color+"')");
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
            pQuantity.textContent = "Qté : ";
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
            // Ajout a la quantité totale
            totalQty += parseInt(qty);
            // Ajout au prix total
            totalPrice += parseInt(product.price) * parseInt(qty);
                    

        })
        .then(()=>{
            // Affichage total articles et prix
            spanTotalQty = document.getElementById("totalQuantity");
            spanTotalPrice = document.getElementById("totalPrice");
            this.spanTotalQty.textContent = totalQty;
            this.spanTotalPrice.textContent = totalPrice + ",00";

        })
        .catch(function(error){
            // Une erreur est survenue
            console.log(error);
            
        });

    }
}
    