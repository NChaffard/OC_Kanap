// class basket qui permet de gerer le panier
class Basket{
    constructor(){
        // Création d'un objet basket qui contient le tableau d'articles dans localStorage
        let basket = localStorage.getItem("basket");
        if (basket == null) {
            // Si il n'y a rien dans localStorage, créer un tableau vide
            this.basket = [];
        } else {
            this.basket = JSON.parse(basket);
        }
    }
    // ---------------Méthodes---------------------
    // Sauvegarde du panier
    save(){
        localStorage.setItem("basket", JSON.stringify(this.basket));
    }

    // Ajout d'un produit
    add(product){
        // Recherche si le produit est deja dans le panier
        let foundProduct = this.basket.find(p => p.id+p.color == product.id+product.color);
        // Si non ajout du produit
        if (foundProduct == undefined){
            this.basket.push(product);
        }
        // Si oui ajout de la quantité
        else
        {
            this.changeQuantity(product, product.quantity);

        }
        this.save();
    }

    // Suppression d'un produit
    remove(product){
        this.basket = this.basket.filter(p => p.id+p.color != product.id+product.color);
        this.save();
    }

    // Modification de la quantité
    changeQuantity(product, quantity){
        // Recherche si le produit est dans le panier
        let foundProduct = this.basket.find(p => p.id+p.color == product.id+product.color);
        // Si oui
        if (foundProduct != undefined){
            // Ajout de la quantité supplémentaire à celle du panier
            foundProduct.quantity = quantity;
            // Si la quantité du panier est inferieur ou égale à 0
            if (foundProduct.quantity <=0){
                // Alors on supprime le poroduit du panier
                this.remove(foundProduct);
                console.log(foundProduct.color);
                console.log(product.color);
            } else{
                this.save();
            }   
        }
    }

    // Récupération de la quantité totale de produits dans le panier
    getNumberProduct() {
        let number = 0;
        // Recherche des quantités dans le panier
        for(let product of this.basket){
            // Ajout des quantité dans number
            number += product.quantity;
        }
        return number;
    }

    // Récupération du prix total
    getTotalPrice(){
        let total = 0;
        // Recherche des prix et quantités dans le panier
        for(let product of this.basket){
            // Ajout des quantités x prix dans total
            total += product.quantity * product.price;
        }
        return total;
    }

}