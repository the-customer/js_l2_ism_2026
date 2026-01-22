// ===============================
// DONNEES METIER (constantes)
// ===============================

const TEAMS = [{
        id: "A",
        name: "Senegal",
        slogan: "Lions de la Teranga",
        players: [{
                name: 'Sadio Mane',
                role: 'Attaquant',
                number: 10
            },
            {
                name: 'Idrissa Gana',
                role: 'Milieu',
                number: 5
            },
            {
                name: 'Kalidou Koulibaly',
                role: 'Défenseur',
                number: 3
            },
        ]
    },
    {
        id: "B",
        name: "Côte d'Ivoire",
        slogan: "Éléphants",
        players: [{
                name: 'Sébastien Haller',
                role: 'Attaquant',
                number: 22
            },
            {
                name: 'Franck Kessié',
                role: 'Milieu',
                number: 8
            },
            {
                name: 'Serge Aurier',
                role: 'Défenseur',
                number: 17
            },
        ]
    },
];

// ===============================
// CONFIGURATION DU MATCH
// ===============================
// Toutes les valeurs reglables sont regroupees ici : bonne pratique car facile a modifier


const CFG = {
    DURATION: 90, //duree du match
    MIN_MS: 1000, // 1 min = 1 seconde
    GOAL_P: 0.18, // probabilite de but
    SIM_MS: 2000, // frequence de simulation
    OVERLAY_MS: 900, // duree animation : GOOOOOOOOL!!!
    LOG_MAX: 8
}


// ===================================
// ACCES AU DOM (Document Objet Model)
// ===================================

// Une petite fonction utilitaire pour eviter
// function getById(id) {
//     return document.getElementById(id)
// }

// const getById = function (id) {
//     return document.getElementById(id)
// }

// const getById = (id) => {
//     return document.getElementById(id)
// }

// const getById = (id) => document.getElementById(id);

// const getById = id => document.getElementById(id);


// function $(id) {
//     return document.getElementById(id)
// }

// const $ = function (id) {
//     return document.getElementById(id)
// }

// const $ = (id) => {
//     return document.getElementById(id)
// }

// const $ = (id) => document.getElementById(id);

const $ = id => document.getElementById(id);




const el = {
    // score: document.getElementById("score"),
    score: $("score"),
    time: $("time"),
    log: $("eventsLog"),
    overlay: $("goalOverlay"),
    overlaySub: $("goalOverlaySub"),
    start: $("startMatch"),
    pause: $("pauseMatch"),
    reset: $("reset"),
    goalA: $("goalA"),
    goalB: $("goalB"),
    aPlayers: $("teamAPlayers"),
    bPlayers: $("teamBPlayers"),
}

el.score.textContent = "toto - tata"