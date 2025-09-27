// Variable pour stocker toutes les données des plantes
let allPlantesData = [];

// Fonction pour récupérer les données du fichier JSON
async function fetchPlantes() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Erreur de chargement des données: ${response.status}`);
        }
        allPlantesData = await response.json(); // Stocke toutes les données
        
        // Initialiser l'affichage avec toutes les plantes
        displayPlantes(allPlantesData);
        
        return allPlantesData;
    } catch (error) {
        console.error("Problème lors de la récupération des données:", error);
        document.querySelector('main').innerHTML += `<p style="text-align:center; color:red;">Erreur: Impossible de charger les données botaniques. (Serveur local requis)</p>`;
        return [];
    }
}

// Fonction qui prend un tableau de plantes et les affiche
function displayPlantes(plantesToDisplay) {
    // 1. Création de la section de liste si elle n'existe pas
    let listeSection = document.getElementById('liste-especes');
    if (!listeSection) {
        listeSection = document.createElement('section');
        listeSection.id = 'liste-especes';
        document.querySelector('main').appendChild(listeSection);

        // Ajout du titre et du conteneur de liste
        listeSection.innerHTML = `
            <h2 style="margin-top: 50px;">Toutes les espèces</h2>
            <div class="liste-container"></div>
        `;
    }

    const container = listeSection.querySelector('.liste-container');
    container.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux éléments

    // 2. Boucle et affichage
    if (plantesToDisplay.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%;">Aucune espèce trouvée pour ce filtre. Essayez une autre catégorie !</p>';
        return;
    }
    
    plantesToDisplay.forEach(plante => {
        const item = document.createElement('div');
        item.className = 'plante-item';
        // Le lien pointe vers la page fiche-espece.html et transmet l'ID
        item.innerHTML = `
            <img src="${plante.url_image_principale}" alt="${plante.nom_commun_fr}" class="plante-thumb">
            <div>
                <h3><a href="fiche-espece.html?id=${plante.id_plante}">${plante.nom_commun_fr}</a></h3>
                <p><i>${plante.nom_scientifique}</i></p>
                <p>Famille: ${plante.famille} | Milieu: <span class="badge ${plante.milieu_principal.toLowerCase().replace(/\s/g, '-')}">${plante.milieu_principal}</span></p>
            </div>
        `;
        container.appendChild(item);
    });
}

// Fonction de Filtrage
function filterPlantes(milieu) {
    let filteredPlantes = allPlantesData;
    const cleanMilieu = milieu.toLowerCase().replace(/-/g, ' '); // Nettoie le nom du milieu pour la comparaison

    if (milieu !== 'toutes') {
        // Filtrer les plantes dont le milieu_principal correspond au filtre
        filteredPlantes = allPlantesData.filter(plante => 
            plante.milieu_principal.toLowerCase() === cleanMilieu
        );
    }
    
    // Mettre à jour le titre
    const titre = document.querySelector('#liste-especes h2');
    titre.textContent = `Espèces (${milieu === 'toutes' ? 'Toutes' : cleanMilieu.charAt(0).toUpperCase() + cleanMilieu.slice(1)}) (${filteredPlantes.length})`;

    // Afficher le résultat du filtre
    displayPlantes(filteredPlantes);
}


// Ajout des écouteurs d'événements pour les boutons de filtre
function setupFilters() {
    
    // Fonction utilitaire pour éviter la répétition
    const attachFilterEvent = (selector, milieuName) => {
        const item = document.querySelector(selector);
        if (item) {
            item.querySelector('a').onclick = (e) => { 
                e.preventDefault(); 
                filterPlantes(milieuName.toLowerCase()); // Assure que le nom du filtre est en minuscules
            };
        }
    };
    
    // 1. Attacher les événements aux filtres de la grille
    attachFilterEvent('.grid-item.forestier', 'forestière');
    attachFilterEvent('.grid-item.agricole', 'agricole');
    attachFilterEvent('.grid-item.ouvert', 'milieu ouvert'); // Doit correspondre à la valeur dans data.json

    // 2. Ajout du bouton "Toutes les espèces"
    const toutesButton = document.createElement('a');
    toutesButton.href = '#';
    toutesButton.textContent = 'Voir TOUTES les espèces →';
    toutesButton.className = 'cta-secondary'; // Changement de classe pour un meilleur style
    toutesButton.style.marginTop = '20px';
    toutesButton.onclick = (e) => {
        e.preventDefault();
        filterPlantes('toutes');
    };
    
    // Ajout du bouton toutes les espèces après la grille
    const gridContainer = document.querySelector('.grid-container');
    if(gridContainer) {
        const boutonDiv = document.createElement('div');
        boutonDiv.style.textAlign = 'center';
        boutonDiv.appendChild(toutesButton);
        gridContainer.after(boutonDiv);
    }
}

// Exécution principale
fetchPlantes().then(() => {
    // S'assurer que les filtres sont configurés après le chargement des données
    if (document.getElementById('bibliotheque')) {
        setupFilters();
    }
});
