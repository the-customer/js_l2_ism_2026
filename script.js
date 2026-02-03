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
    OVERLAY_MS: 1900, // duree animation : GOOOOOOOOL!!!
    LOG_MAX: 8 // nombre max d'evenements dans le journal
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

// ===================================
// ETAT AU MATCH (Variables)
// ===================================
const st = {
    score: {
        A: 0,
        B: 0
    },
    minute: 0,
    running: false, // demarre ou arrete le match
    t: null, // timer principal
    sim: null, // timer de simulation
}

// ===================================
// FUNCTION UTILITAIRES 
// ===================================

// Modifier ldu texte dans le DOM
/*
function setTxt(node, txt) {
    // if (node)
    //     node.innerText = txt;
    node && (node.innerText = txt);
}
*/
const setTxt = (node, txt) => node && (node.innerText = txt);

// Ajouter un evenment dans le journal:
// const addLog = (msg) => {
//     const li = "<li>" + msg + "</li>";
//     el.log.innerHTML += li
// }


//Limiter le nombre d'evemenemt a afficher
const limitLog = () => {
    while (el.log.children.length > CFG.LOG_MAX) {
        el.log.removeChild(el.log.lastElementChild);
    }
}
const addLog = (msg) => {
    if (!el.log) return;
    const li = document.createElement("li"); //<li></li>
    li.innerText = msg //<li>msg</li>
    // el.log.appendChild(li)
    el.log.prepend(li);
    //
    limitLog();
}

// Generer des initiales a partir d'un nom de joueur
const initials = (name) => name
    .split(" ")
    .map(function (p) {
        return p[0]
    })
    .slice(0, 2)
    .join("")
    .toUpperCase()

// Nombre aleatoire
const rnd = (n) => Math.floor(Math.random() * n);

//choisir un element aleatoire dans le tableau
const pick = (arr) => arr[rnd(arr.length)]

//Recuperer une equipe par son id
const teamById = (id) => TEAMS.find(t => t.id === id)


// ===================================
// INTERFACE UTILISATEUR 
// ===================================


const ui = {
    score: () => setTxt(el.score, `${st.score.A} - ${st.score.B}`),
    time: () => setTxt(el.time, `${st.minute} min`),

    // Affichage de l'animation GOAL
    overlay: (txt) => {
        if (!el.overlay || !el.overlaySub) return;

        setTxt(el.overlaySub, txt);
        el.overlay.classList.add("is-open");
        setTimeout(() => {
            el.overlay.classList.remove("is-open");
        }, CFG.OVERLAY_MS)
    },

    // Activer / desactiver les boutons et les joueurs
    enableManual: (on) => {
        // el.goalA.disabled = !on;
        // el.goalB.disabled = !on;
        [el.goalA, el.goalB].forEach(b => b && (b.disabled = !on))

        document.querySelectorAll(".player-card")
            .forEach((b) => {
                b.disabled = !on;
            })
    },

    // Generer les joueurs dans le html
    renderPlayers: (container, teamId) => {
        if (!container) return;
        const team = teamById(teamId);

        container.innerHTML = team.players
            .map(p => `
            <button class="player-card" data-team="${teamId}" data-name="${p.name}" data-number="${p.number}">
                <div class="avatar">${initials(p.name)}</div>
                <div>${p.name}</div>
            </button>
        `)
            .join("");
    }
}
// ===================================
// LOGIQUE METIER : BUT 
// ===================================

function goal(teamId, player) {
    st.score[teamId]++;
    ui.score()

    const team = teamById(teamId);

    addLog(`${st.minute}' - BUT ${team.name} : ${player.name} (${player.number})`)

    ui.overlay(`${team.name} - ${player.name}`)
}

function simulateGoal(teamId) {
    if (st.minute <= 0 || st.minute >= CFG.DURATION) return;
    const player = pick(teamById(teamId).players)
    goal(teamId, player);
}



// ===================================
// GESTION DU MATCH
// ===================================

function start() {
    if (st.running || st.minute >= CFG.DURATION) return;
    st.running = true;

    el.start.disabled = true;
    el.pause.disabled = false;
    ui.enableManual(true);

    addLog("Coup d'envoi !")

    //chrono
    st.t = setInterval(() => {
        st.minute++;
        ui.time();
        if (st.minute >= CFG.DURATION) {
            //fin du match
            end()
        }
    }, CFG.MIN_MS);

    //timer de simulation
    st.sim = setInterval(() => {
        if (Math.random() < CFG.GOAL_P) {
            simulateGoal(Math.random() < 0.5 ? "A" : "B")
        }
    }, CFG.SIM_MS)
}



function end() {
    ///
    stop();
    ui.enableManual(false);
    ui.overlay("FIN DU MATCH")
}

function stop() {
    st.running = false;
    clearInterval(st.t);
    clearInterval(st.sim);
    el.start.disabled = false;
    el.pause.disabled = true;
    addLog("Pause")
}

function reset() {
    stop();
    st.score.A = st.score.B = 0;
    st.minute = 0;
    ui.score();
    ui.time();
    addLog("Matchj reinitialisé");
}


// ===================================
// EVENEMENTS
// ===================================

el.start.addEventListener("click", start);
el.pause.addEventListener("click", stop);
el.reset.addEventListener("click", reset);



// ===================================
// INITIALISATION
// ===================================


ui.renderPlayers(el.aPlayers, "A")
ui.renderPlayers(el.bPlayers, "B")
ui.score()
ui.time()

ui.enableManual(false);