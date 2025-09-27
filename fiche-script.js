// Contenu à mettre dans fiche-script.js
// ------------------------------------

async function loadPlanteDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const planteId = parseInt(urlParams.get('id'));
    const ficheContent = document.querySelector('.fiche-content');

    if (!planteId) {
        ficheContent.innerHTML = "<p class='error-message'>Erreur: ID de plante non spécifié. Retournez à l'accueil.</p>";
        return;
    }

    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("Erreur de chargement de data.json");
        const allPlantesData = await response.json();
        
        const plante = allPlantesData.find(p => p.id_plante === planteId);

        if (plante) {
            renderPlante(plante);
        } else {
            ficheContent.innerHTML = "<p class='error-message'>Erreur: Plante non trouvée dans la base de données.</p>";
        }

    } catch (error) {
        console.error("Erreur critique lors du chargement des données:", error);
        ficheContent.innerHTML = "<p class='error-message'>Erreur: Impossible de charger les données botaniques. Vérifiez la console pour plus de détails.</p>";
    }
}

function renderPlante(p) {
    const header = document.querySelector('.fiche-header');
    const imageContainer = document.getElementById('image-container');
    const detailsContainer = document.getElementById('details-container');
    
    const milieuClass = p.milieu_principal.toLowerCase().replace(/\s/g, '-');
    
    // --- Remplissage de l'en-tête (Aucun changement nécessaire) ---
    header.innerHTML = `
        <div class="identification">
            <p class="famille-tag">Famille : ${p.famille}</p>
            <h1>${p.nom_commun_fr}</h1>
            <p class="scientifique-name"><i>${p.nom_scientifique}</i></p>
        </div>
        
        <div class="meta-info">
            <div class="milieu-badge ${milieuClass}">
                Milieu Principal : ${p.milieu_principal} 🌳
            </div>
            <div class="milieu-badge statut">
                Statut de Conservation : ${p.statut_conservation}
            </div>
        </div>
    `;

    // --- Remplissage de la colonne Image (Amélioration) ---
    
    // URL de substitution si l'URL principale est manquante (utilisez un chemin local si vous le créez)
    const fallbackImage = 'https://via.placeholder.com/600x400?text=Image+Manquante';
    const mainImageUrl = p.url_image_principale || fallbackImage; 
    
    let miniaturesHTML = '';
    if (p.urls_images_secondaires && p.urls_images_secondaires.length > 0) {
         miniaturesHTML = p.urls_images_secondaires.map(url => 
            // Chaque miniature utilise son URL ou l'URL de substitution
            `<img src="${url || fallbackImage}" alt="Zoom sur un organe de la plante">`
        ).join('');
    }

    imageContainer.innerHTML = `
        <figure>
            <img src="${mainImageUrl}" alt="Image principale de ${p.nom_commun_fr}">
            <figcaption>Cliché de ${p.nom_commun_fr} par un contributeur Bot'Easy.</figcaption>
        </figure>
        <div class="galerie-miniatures">
            ${miniaturesHTML}
        </div>
    `;


    // --- Remplissage de la colonne Détails (Aucun changement nécessaire) ---
    detailsContainer.innerHTML = `
        <div class="bloc-details">
            <h2>1. Description & Morphologie</h2>
            <p>${p.description_generale}</p>
        </div>

        <div class="bloc-details">
            <h3>Caractéristiques Clés d'Identification</h3>
            <ul>
                <li>**Type de Feuille :** <a href="glossaire.html">${p.type_feuille}</a></li>
                <li>**Disposition :** <a href="glossaire.html">${p.disposition_feuille}</a></li>
                <li>**Couleur des Fleurs :** ${p.couleur_fleur}</li>
                <li>**Type de Fruit :** ${p.type_fruit}</li>
            </ul>
        </div>
        
        <div class="bloc-details">
            <h2>2. Éléments Complémentaires</h2>
            <p>Ajouter ici les informations sur l'écologie, les usages et le type de sol.</p>
        </div>

        <div class="bloc-details taxonomie">
            <h2>3. Vérification des Données</h2>
            <p>Source de vérification : <strong>${p.source_verification}</strong></p>
        </div>
        
        <div class="admin-meta">
            <p>Fiche générée automatiquement. Dernière mise à jour des données : ${new Date().toLocaleDateString('fr-FR')}.</p>
        </div>
    `;
}
