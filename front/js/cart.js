// fonctions
function createNode(element){
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}
//--------------- Gestion d'evenements---------------------------

// Changement de quantité
function changeQuantity(id, color){
    // Recuperation de la quantité modifiée
    let newQty = parseInt(document.getElementById(id+color).value);
    // Remise a zero des totaux
    this.totalQty = 0;
    this.totalPrice = 0;
    
    // Mise en forme Json pour appel basket
    let product = {
        id : id,
        "color" : color
    };
    // Changement de la quantité via basket
    let basket = new Basket();
    basket.changeQuantity(product,newQty);
    // Récupération de la quantité totale
    this.totalQty = basket.getNumberProduct();
    
    //  Recuperation du prix des articles
    for (basketProduct of basket.basket){

        article = document.querySelector("[data-id='"+basketProduct.id+"']");
        description = article.querySelector(".cart__item__content__description");
        price = description.children[2].textContent.replace('€','');
        
        // Pour le prix il faut recuperer le prix dans l'article
        this.totalPrice += parseInt(price) * parseInt(basketProduct.quantity);
        this.spanTotalQty.textContent = totalQty;
        this.spanTotalPrice.textContent = totalPrice + ",00";
    }
    
}

// Suppression d'un article
function deleteProduct(id, color){
    // Mise en forme json
   let product = {
       id : id,
       "color" : color
   };
    //    Suppression de l'article via basket
    let basket = new Basket;
    basket.remove(product);
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
    
    // Recuperation du localStorage via la classe Basket
    let basket = new Basket();
    for (basketProduct of basket.basket){
        // Mise en forme json
       
        let id = basketProduct.id;
        let color = basketProduct.color;
        let qty = basketProduct.quantity;

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
            input.setAttribute("onchange", "changeQuantity('"+id+"', '"+color+"')");
            input.setAttribute("id", id+color);
            pDelete.setAttribute("onclick", "deleteProduct('"+id+"', '"+color+"')");
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

// ----------------------Formulaire---------------------------------



// Ecouteurs de modification des inputs
for (formInput of document.querySelector(".cart__order__form")){
    
    
    if(formInput.type != "submit"){
        // appeller la fonction validInput
        formInput.addEventListener('change', function(){
            validInput(this);
        });
        
    }
    
}

let form = document.querySelector(".cart__order__form");
form.addEventListener('submit', function(e){
    e.preventDefault();
    let formOk = false;
    // if (validInput())
    for (inputCheck of form){
        if(inputCheck.type != "submit"){
            if (validInput(inputCheck)){
                // Si tous les champs sont valides 
                formOk = true;
            }
            else{
                // Casser la boucle
                formOk = false;
                console.log("Une entrée n'est pas valide");
                break;
            }
        }
    }
    if (formOk == true){
        
        sendForm();
        // Faire une requete POST a l'api avec contact et produits
        // Recuperer orderid via fetch get
        // rediriger vers confirmation.html avec orderid dans l url
    }
    
});

const sendForm = function(){
    let contact = {
        "firstName": form.firstName.value,
        "lastName": form.lastName.value,
        "address": form.address.value,
        "city": form.city.value,
        "email": form.email.value
    };
    let products = [];
    for (let i =0; i < document.querySelectorAll("[data-id]").length; i++){
        products.push(document.querySelectorAll("[data-id]")[i].dataset.id);
    }
    console.log(contact);
    console.log(products);
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: { 
    'Accept': 'application/json', 
    'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
        contact,
        products
    }),
    })
    .then(resp => resp.json())
    .then((order) => {
        console.log(order);
        console.log(order.orderId);
        window.location.href = "./confirmation.html?orderId="+order.orderId;
    });

} 



// Fonction verification des inputs
const validInput = function(input){
    // Initialisation du message d'erreur et du pattern RegExp
    // console.log(input);
    let errorMsg;
    let msg;
    let regExpPattern = '';

    // Mise en place du pattern et du message d'erreur suivant le type d'input
    if( input.name == "firstName"|| input.name == "lastName" || input.name == "city"){
        errorMsg = document.getElementById(input.name+"ErrorMsg");
            // console.log("input fn, ln ou city: "+input.name);
        regExpPattern = '^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\\s-]{3,30}$','g';
        msg = "Le champ ne doit contenir que des lettres, des tirets ou des espaces.";
    }
    else if( input.name == "address"){
        errorMsg = document.getElementById("addressErrorMsg");
        // console.log("input adress: "+input.name);
        regExpPattern = '^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ.\\s-]{3,30}$','g';
        msg = "Le champ ne doit contenir que des lettres, des points, des tirets ou des espaces.";
    }
    else if( input.name == "email"){
        errorMsg = document.getElementById("emailErrorMsg");
        // console.log("input email: "+input.name);
        regExpPattern = '[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$','g';
        msg = "Le format de l'adresse email n'est pas correct.";
    }

    // L'input doit contenir au moins 3 caractères
    if (input.value.length < 3){
        msg = "Le champ doit contenir au moins 3 caractères.";
        // Affichage message d'erreur
        errorMsg.textContent = msg;
        // console.log(errorMsg);
         // Retourne false pour bloquer l'envoi du formulaire
        return false;
    }
    else{
        inputRegExp = new RegExp(regExpPattern);
        // console.log(inputRegExp);

        // Test de l'input
        let testInput = inputRegExp.test(input.value);
        // Si ok
        if (testInput){
            //  Message d'erreur vide
            msg = "";
            // Affichage message d'erreur
            errorMsg.textContent = msg;
            // Retourne true pour valider le champ
            return true;
        }
        // Si non
        else{
            // Affichage message d'erreur
            errorMsg.textContent = msg;
            // Retourne false pour bloquer l'envoi du formulaire
            return false;
        }
    }

}


    