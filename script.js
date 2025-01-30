document.addEventListener("DOMContentLoaded", function () {
    let currentAudio = null; //contrôle sur un audio est en cours ou non
    let numCase = 0; // Sert pour différencier tout les audios entre eux

    // Variable pour l'API
    const login = "delavigne";

    // Charger les données depuis musique.json
    fetch('musique.json').then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log("Données chargées :", data);

        // Ajouter les musiques dynamiquement
        data.forEach(function (contenuCase) {
            ajouterMusique(contenuCase);
        });
    });

    // Fonction pour afficher une musique (prévisualisation de nom + pochette)
    function ajouterMusique(contenuCase) {
        const blocnonclickMusiques = document.createElement("section");
        blocnonclickMusiques.innerHTML =
            '<h2><em>' + contenuCase.nom + '</em></h2>' +
            "<img src='" + contenuCase.img + "' id='pochette'" + "alt='" + "Pochette de la musique :" + contenuCase.nom + "'>";

        // Clic pour afficher l'overlay
        blocnonclickMusiques.addEventListener('click', function () {
            afficherOverlay(contenuCase);
        });

        document.querySelector(".list-nonclick").append(blocnonclickMusiques);
    }

    // Fonction pour afficher l'overlay et tout le contenu avec
    function afficherOverlay(contenuCase) {
        const contenuOverlay =
            "<button id='closeOverlay' class='close-button'>✖</button>" +
            '<h2>' + contenuCase.nom + '</h2>' +
            '<p>' + "Catégorie :  " + contenuCase.categorie + '</p>' +
            "<img src='" + contenuCase.img + "' id='pochette'" + "alt='" + "Pochette de la musique :" + contenuCase.nom + "'>" +
            '<p>' + contenuCase.description + '</p>' +
            "<audio id='audio" + numCase + "'>" +
            "<source src='" + contenuCase.audio + "' type='audio/mpeg'>" +
            "</audio>" +
            "<div class='audio-button' id='play" + numCase + "'>&#9654;</div>" +
            "<ul>" +
            "<li><a href='" + contenuCase.urlspotify + "'target='_blank'><img src='./img/spotify.png' alt='Lien vers spotify' id='spotify'></a></li>" +
            "<li><a href='" + contenuCase.urlytb + "'target='_blank'><img src='./img/youtube.png' alt='Lien vers youtube' id='youtube'></a></li>" +
            "<li><a href='" + contenuCase.urlapplemusic + "'target='_blank'><img src='./img/applemusic.png' alt='Lien vers applemusic' id='applemusic'></a></li>" +
            "</ul>" +
            "<br>" +
            "<p>" + contenuCase.credit + "</p>";
        //affiche l'overlay (passe de display "none" = "block" pour l'afficher)
        // Inspiration de : https://www.w3schools.com/howto/howto_css_overlay.asp
        const overlay = document.getElementById("overlay");
        document.getElementById("overlay-content").innerHTML = contenuOverlay;
        overlay.style.display = "block";

        // Gestion des boutons audio
        const audio = document.getElementById("audio" + numCase);
        const playButton = document.getElementById("play" + numCase);
        let isPlaying = false;

        playButton.addEventListener("click", function () {
            if (isPlaying) { //on regarde si la musique se joue ou non
                audio.pause();
                playButton.innerHTML = "&#9654;";
            } else {
                audio.play();
                playButton.innerHTML = "&#9208;";
            }
            isPlaying = !isPlaying; //on change l'état de isPlaying, pour qu'on puisse après le mettre sur pause.
            currentAudio = audio;
        });

        // Gestion du bouton pour fermer l'overlay
        document.getElementById("closeOverlay").addEventListener("click", function () {
            overlay.style.display = "none";
            if (currentAudio) { // On veut mettre en pause la musique pour qu'elle arrête de se jouer lorsque l'on ferme l'overlay
                currentAudio.pause();
            }
        });

        numCase++;
    }

    // Bouton pour masquer et afficher le formulaire
    const formButton = document.getElementById('formButton');
    const formulaireSection = document.getElementById('formulaire-section');

    formButton.addEventListener('click', function () {
        // Vérifie si le formulaire est actuellement masqué, on utilise formumaireSection.style.display === "" car sans ça, il faudrait cliquer deux fois sur le bouton pour que le formulaire s'affiche
        // Inspiration de : https://www.washington.edu/accesscomputing/webd2/student/unit5/module2/lesson5.html
        if (formulaireSection.style.display === 'none' || formulaireSection.style.display === '') {
            formulaireSection.style.display = 'block'; // Affiche le formulaire
            formButton.textContent = "Cacher le formulaire d'ajout"; // Change le texte du bouton
        } else {
            formulaireSection.style.display = 'none'; // masque le formulaire
            formButton.textContent = "Afficher le formulaire d'ajout"; // Change le texte du bouton
        }
    });

    //On prépare la récupération des données du formulaire
    const selecteurMail = document.getElementById("mail");
    const selecteurNom = document.getElementById("nom");
    const selecteurDescription = document.getElementById("description");
    const selecteurImage = document.getElementById("fichierimage");
    const selecteurAudio = document.getElementById("fichieraudio");
    const selecteurSpotify = document.getElementById("urlspotify");
    const selecteurYTB = document.getElementById("urlytb");
    const selecteurApple = document.getElementById("urlapple");
    const selecteurCredits = document.getElementById("credits");
    const selecteurCategorie = document.getElementById("categorie");
    const selecteurURL = document.getElementById("send");

    //code pour prévisualiser ce que l'on écrit. 
    selecteurNom.addEventListener("input", function () {
        const list = document.getElementById("nominput");
        console.log(selecteurNom.value);
        list.innerHTML = "<h2>" + "<em>" + selecteurNom.value + "</em>" + "</h2>"
    });

    selecteurImage.addEventListener("input", function () {
        const list3 = document.getElementById("imageinput");
        console.log(selecteurImage.value);
        list3.innerHTML = "<img src='" + selecteurImage.value + "' id='pochette'" + "alt='" + "Pochette de la musique :" + selecteurNom.value + "'>"
    });

    // Ajouter les événements pour l'envoi du formulaire lors du clique sur le bouton envoyer
    selecteurURL.addEventListener("click", function () {
        const email = selecteurMail.value;
        const nom = selecteurNom.value;
        const description = selecteurDescription.value;
        const img = selecteurImage.value;
        const audioFile = selecteurAudio.files[0];
        const urlspoti = selecteurSpotify.value;
        const urlytb = selecteurYTB.value;
        const urlapple = selecteurApple.value;
        const credits = selecteurCredits.value;
        const categori = selecteurCategorie.value;

        // Vérification des champs sur formulaire avant affichage
        // On vérifie déjà si tout les champs required sont remplis (Je ne sais pas si c'est un problème mais le javascript fait ignoré completement le required du HTML)
        if (email === "" || nom === "" || description === "" || categori === "" || credits === "" || img === "") {
            alert("Tous les champs obligatoires ne sont pas remplis !");
            return;  // Si un champ est vide, ne pas envoyer
        }

        // On vérifie si un fichier audio à bien été mis
        if (!audioFile) {
            alert("Veuillez sélectionner un fichier audio.");
            return;
        }

        // On "converti" l'audio en URL pour qu'il puisse être exploité
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio
        const audio = new Audio();
        audio.src = URL.createObjectURL(audioFile);

        const dureeMax = 15; // Durée maximale du fichier audio

        // Vérification du nombre de seconde du fichier audio
        // Support : https://www.w3schools.com/jsref/prop_audio_duration.asp
        audio.onloadedmetadata = function () {
            const duration = audio.duration;
            if (duration > dureeMax) {
                alert('Le fichier audio dépasse la durée maximale de ' + dureeMax + ' secondes');
                return;
            }

            // Créer une URL pour le fichier audio
            const audioURL = URL.createObjectURL(audioFile);

            // Création du message pour l'envoi API avec les données écrite par l'utilisateur
            const message = "Nom : " + nom + ", Description : " + description + ", Catégorie : " + categori + ", Crédit : " + credits + ", URL Spotify : " + urlspoti + ", URL YouTube : " + urlytb + ", URL Apple Music : " + urlapple;

            //on place le mail de l'utilisateur de la variable email 
            const email = selecteurMail.value;

            // Construire l'URL en la créant au complet
            const urlVisitee = "https://perso-etudiant.u-pem.fr/~gambette/portrait/api.php?format=json&login=" + login +
                "&courriel=" + email + "&message=" + encodeURIComponent(message);

            // Afficher l'URL dans la console pour s'assurer que le lien envoyé est correct
            console.log("URL de l'API :", urlVisitee);

            // Appel de l'API avec fetch
            fetch(urlVisitee).then(function (response) {
                response.json().then(function (data) {
                    console.log("Réponse reçue :");
                    console.log(data);
                })
            })

            // Ajout des données pour créer une nouvelle musique
            const nouvelleMusique = {
                nom: nom,
                img: img,
                description: description,
                audio: audioURL,
                urlytb: urlytb,
                urlspotify: urlspoti,
                urlapplemusic: urlapple,
                categorie: categori,
                credit: credits
            };

            // Ajouter la nouvelle musique à la liste
            ajouterMusique(nouvelleMusique);
            alert("Envoi du formulaire à fonctionné !")

            // Réinitialiser le formulaire pour pouvoir ajouter une nouvelle musique
            selecteurMail.value = "";
            selecteurNom.value = "";
            selecteurDescription.value = "";
            selecteurImage.value = "";
            selecteurAudio.value = "";
            selecteurSpotify.value = "";
            selecteurYTB.value = "";
            selecteurCredits.value = "";
            selecteurApple.value = "";
            selecteurCategorie.value = "";
        };
    });
});
