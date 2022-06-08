// -------------------Variables----------------------

// Mise en place du parent des articles
const section = document.getElementById("cart__items");

// Récupération du formulaire de contact
const form = document.querySelector(".cart__order__form");

// Récuperation balises totaux
const spanTotalQty = document.getElementById("totalQuantity");
const spanTotalPrice = document.getElementById("totalPrice");


// Creation variable quantité totale et prix total
let totalQty = 0;
let totalPrice = 0;

// Appel du panier
let basket = new Basket();

//--------------- Gestion d'evenements du panier---------------------------

// Récupération des produits du panier à afficher
async function getProducts(){
    // Initialisation du template à afficher
    let templateHTML = '';
    // Récupération des produits dans le panier
    for (basketProduct of basket.basket){
    let id = basketProduct.id;
    let color = basketProduct.color;
    let quantity = basketProduct.quantity;
    // Récupération des données manquantes dans l'api
    let url = "http://localhost:3000/api/products/" + id;
    let apiProduct = await fetch(url).then((resp) => resp.json());
    let image = apiProduct.imageUrl;
    let alt = apiProduct.altTxt;
    let name = apiProduct.name;
    let price = apiProduct.price;
    // Ajout du code HTML de l'article
    templateHTML += `<article class="cart__item" data-id="${id}" data-color="${color}">
                            <div class="cart__item__img">
                                <img src="${image}" alt="${alt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${name}</h2>
                                    <p>${color}</p>
                                    <p>${price},00 €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}"><p id="quantityErrorMsg${id}${color}" style="color:#fbbcbc"></p>
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`;
    }
    return templateHTML;
    }

// Affichage des produits du panier
function displayProducts(templateHTML){
    // Ajout du code HTML dans la page
    section.innerHTML+= templateHTML;   
}


// Récuperation du prix total
function getTotalPrice(){
    //  Recuperation du prix des articles
    let total = 0;
    for (basketProduct of basket.basket){
   
       let article = document.querySelector("[data-id='"+basketProduct.id+"']");
       let description = article.querySelector(".cart__item__content__description");
       let price = description.children[2].textContent.replace('€','');
       
       // Pour le prix il faut recuperer le prix dans l'article
       total += parseInt(price) * parseInt(basketProduct.quantity);
   }
   return total;
}

// Affichage des totaux
function displayTotals(){
    // Remise a zero des totaux
    totalQty = 0;
    totalPrice = 0;
    // Récupération de la quantité totale
    totalQty = basket.getNumberProduct();
    totalPrice = getTotalPrice();
    spanTotalQty.textContent = totalQty;
    spanTotalPrice.textContent = totalPrice + ",00";   
}

// Changement de quantité
function changeQuantity(input){
    let article = input.parentElement.parentElement.parentElement.parentElement;
    let id = article.dataset.id;
    let color = article.dataset.color;
    if (validInput(input)){
        // Recuperation de la quantité modifiée sous forme d'entier
        let newQty = parseInt(input.value);
        
        // Mise en forme Json pour appel basket
        let product = {
            id : id,
            "color" : color
        };
        // Changement de la quantité via basket
        basket.changeQuantity(product,newQty);
        // Affichage des totaux mis à jour
        displayTotals();
    }
}

// Suppression d'un article
function deleteProduct(input){
    let article = input.parentElement.parentElement.parentElement.parentElement;
    let id = article.dataset.id;
    let color = article.dataset.color;

    // Mise en forme json
   let product = {
       id : id,
       "color" : color
   };
    // Suppression de l'article via basket
    basket.remove(product);
}

// -----------------------Gestion des évenements du formulaire-------------------------------

// Fonction verification des inputs
const validInput = function(input){
    // Initialisation du message d'erreur et du pattern RegExp
    let errorMsg;
    let msg;
    let regExpPattern = '';

    // Mise en place du pattern et du message d'erreur suivant le type d'input
    if( input.name == "firstName"|| input.name == "lastName" || input.name == "city"){
        errorMsg = document.getElementById(input.name+"ErrorMsg");
        regExpPattern = '^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\\s-]{3,30}$','g';
        msg = "Le champ ne doit contenir que des lettres, des tirets ou des espaces.";
    }
    else if( input.name == "address"){
        errorMsg = document.getElementById("addressErrorMsg");
        regExpPattern = '^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ,.\\s-]{3,30}$','g';
        msg = "Le champ ne doit contenir que des lettres, des points, des virgules, des tirets ou des espaces.";
    }
    else if( input.name == "email"){
        errorMsg = document.getElementById("emailErrorMsg");
        regExpPattern = '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$','g';
        msg = "Le format de l'adresse email n'est pas correct.";
    }
    else if ( input.name == "itemQuantity"){
        errorMsg = input.nextSibling;
        regExpPattern = '^[0-9]{1,3}$','g';    
        msg = "La quantité doit être un nombre entier !";
    }

    // L'input ne doit pas être vide
    if (input.value.length < 1){
        msg = "Le champ ne doit pas être vide.";
        // Affichage message d'erreur
        errorMsg.textContent = msg;
         // Retourne false pour bloquer l'envoi du formulaire
        return false;
    }
    else if ( input.name == "itemQuantity" && input.value > 100){
        msg ="La quantité est de 100 maximum !";
        // Affichage message d'erreur
        errorMsg.textContent = msg;
         // Retourne false pour bloquer l'envoi du formulaire
        return false;
    }
    else {
        // Mise en place de la regExp
        inputRegExp = new RegExp(regExpPattern);

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

// Fonction envoi du formulaire
const sendForm = function(){

    // Formatage des données à envoyer
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

    // Envoi de la requete POST à l'api
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
    // Récupération de orderId
    .then(resp => resp.json())
    .then((order) => {
        // Redirection vers confirmation.html avec orderId en parametre
        window.location.href = "./confirmation.html?orderId="+order.orderId;
    });
} 

// Ecouteurs de modification des inputs
for (formInput of form){
    if(formInput.type != "submit"){
        // Appeller la fonction validInput
        formInput.addEventListener('change', function(){
            validInput(this);
        });    
    }   
}

// Ecouteur du bouton de validation de la commande
form.addEventListener('submit', function(e){
    // Bloquer la soumission du formualire
    e.preventDefault();
    // Initialisation dla variable qui valide les inputs du formulaire
    let formOk = false;
    // Vérification de la validité des inputs
    for (inputCheck of form){
        // Ne pas vérifier submit
        if(inputCheck.type != "submit"){
            if (validInput(inputCheck)){
                // Si tous les champs sont valides 
                formOk = true;
            }
            else{
                // Casser la boucle
                formOk = false;
                break;
            }
        }
    }
    // Vérification de la validité du formulaire
    if (formOk == true){
        // Vérification de l'existence du panier
        if (localStorage.length > 0){
            // Si oui envoyer formulaire
            sendForm();
        }
        // Si non afficher un message et bloquer l'envoi
        else{
            alert("Le panier est vide !");
        }
    }  
});

// --------------------------Affichage du panier----------------

// affichage du panier en recuperant les donnees du localStorage
if(localStorage.length > 0){
    // Le panier contient des articles
    // Récupération des articles
    getProducts()
    .then((products) => {
        // Affichage des produits
        displayProducts(products);
    })
    .then(()=>{
        // Affichage des totaux
        displayTotals();
    })
    .then(()=>{
        // Récupération des inputs quntité du panier
        let inputs = document.getElementsByName("itemQuantity");
        for (input of inputs){
            // Ajout écouteur change sur les inputs
            input.addEventListener('change', function(){
                changeQuantity(this);
            });
            // Récupération du bouton Supprimer
            deleteInput = input.parentElement.nextElementSibling.children[0];
            // Ajout écouteur click sur le bouton Supprimer
            deleteInput.addEventListener('click', function(){
                deleteProduct(this);
            })
        }
    });
}