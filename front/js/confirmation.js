// Récupération de orderId  dans l'url de la page
let navUrl = new URL (window.location.href);
let orderId = navUrl.searchParams.get("orderId");

// Récuperation de l'emplacement où mettre orderId
span = document.getElementById("orderId");

// Intégration de orderId
span.textContent = orderId;

// Vidage du panier
localStorage.clear();
