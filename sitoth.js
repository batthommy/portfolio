document.addEventListener("DOMContentLoaded", () => {

function sistemaTesto(t) {

	if (!t) return t;

	// nomi propri
	t = t.replace(/\bthomas\b/gi, "Thomas");
	t = t.replace(/\bevan\b/gi, "Evan");
	t = t.replace(/\bantonio\b/gi, "Antonio");
	t = t.replace(/\belisa\b/gi, "elisa");

	// prima lettera maiuscola
	t = t.replace(/^\s*[a-zàèéìòù]/, c => c.toUpperCase());

	// maiuscola dopo . ! ?
	t = t.replace(/([.!?]\s*)([a-zàèéìòù])/g, (m,p1,p2)=>p1+p2.toUpperCase());

	return t;
}

function correggiNodo(n) {

	if (n.nodeType === 3) { // text node
		n.nodeValue = sistemaTesto(n.nodeValue);
		return;
	}

	if (n.nodeType !== 1) return;

	const tag = n.tagName;

	if (
		tag === "SCRIPT" ||
		tag === "STYLE" ||
		tag === "CODE" ||
		tag === "PRE" ||
		tag === "TEXTAREA" ||
		tag === "INPUT"
	) return;

	if (n.title)
		n.title = sistemaTesto(n.title);

	for (let child of n.childNodes)
		correggiNodo(child);
}

function correggiPagina() {

	correggiNodo(document.body);

	document.title = sistemaTesto(document.title);
}

	correggiPagina();

	const observer = new MutationObserver(m => {

		for (let mut of m)
			for (let n of mut.addedNodes)
				correggiNodo(n);

	});

	observer.observe(document.body,{
		childList:true,
		subtree:true
	});


let nomeUtente = localStorage.getItem("nomeUtente");
let ultimoPopup = localStorage.getItem("ultimoPopup");

const popup = document.getElementById("nome-popup");
const input = document.getElementById("nome-input");
const salva = document.getElementById("nome-salva");
const skip = document.getElementById("nome-skip");

let adesso = Date.now();

popup.style.display = "flex";

if(nomeUtente){
	input.value = nomeUtente;
}

salva.onclick = () => {

	let nome = input.value.trim();

	if(nome){

		if(nome.toLowerCase() === "thomas"){
			nome = "Thomas👑";
		}

		localStorage.setItem("nomeUtente", nome);
		nomeUtente = nome;

		// aggiorna subito il testo
		let intro = document.getElementById("introduzione");
		intro.textContent = intro.textContent.replace(/^ciao\./i, "ciao " + nome + ".");
	}

	popup.style.display = "none";
}

skip.onclick = () => {
	popup.style.display = "none";
}

input.addEventListener("keydown", e=>{
	if(e.key==="Enter") salva.click();
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("#scorr-barr a");
const linea = document.getElementById("linea"); // 👈 QUESTA MANCAVA

window.addEventListener("scroll", () => {

	let current = "";

	sections.forEach(section => {

		const rect = section.getBoundingClientRect();

		/* se la sezione è almeno al 20% dello schermo */
		if (rect.top <= window.innerHeight * 0.4 && rect.bottom > 0) {
			current = section.id;
		}

	});

	navLinks.forEach(link => {

		link.classList.remove("active");

		if(link.getAttribute("href") === "#" + current){

			link.classList.add("active");

			/* muove la linea sotto il link attivo */

			const rect = link.getBoundingClientRect();
			const parentRect = link.parentElement.getBoundingClientRect();

			linea.style.width = rect.width + "px";
			linea.style.left = (rect.left - parentRect.left) + "px";
		}

	});

});


const elementi = document.querySelectorAll(".anni");

const nascita = new Date(2013, 0, 20); // gennaio = 0
const oggi = new Date();

let eta = oggi.getFullYear() - nascita.getFullYear();

// controllo se ha già fatto il compleanno quest'anno
const mese = oggi.getMonth();
const giorno = oggi.getDate();

if (
	mese < nascita.getMonth() ||
	(mese === nascita.getMonth() && giorno < nascita.getDate())
) {
	eta--;
}

elementi.forEach(el => {
	el.textContent = eta;
});




fetch('giorno.json')
.then(res => res.json())
.then(data => {

	// 📅 oggi in formato MM-DD
	const now = new Date();
	const today = String(now.getMonth() + 1).padStart(2, '0') + '-' +
				String(now.getDate()).padStart(2, '0');

	// 🔍 trova evento
	let evento = data.find(item => item.date === today);

	// 🆘 fallback default
	if (!evento) {
	evento = {
		title: "Nessun evento importante oggi",
		text: "Torna a trovarci domani 😉, concentrati su me, non sugli eventi!",
		img: "default.png"
	};
	}

	// 🎯 inserimento nel DOM
	const container = document.querySelector('#eventi');

	container.querySelector('h2').textContent = evento.title;
	container.querySelector('p').textContent = evento.text;
	container.querySelector('img').src = "immagine_del_giorno/" + evento.img;

})
.catch(err => console.error(err));





const nome1 = document.getElementById("nome");
const nome2 = document.getElementById("nomec");

if (nomeUtente) {
    if (nome1 && nome1.value === "") nome1.value = nomeUtente;
    if (nome2 && nome2.value === "") nome2.value = nomeUtente;
}

// ====== FUNZIONE MAIL GENERICA ======
function collegaForm(formId, ids) {
    const form = document.getElementById(formId);
    if (!form) return;
}
function collegaForm(formId, ids) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const destinatario = document.getElementById(ids.dest)?.value || "";
        const oggetto = document.getElementById(ids.ogg)?.value || "";
        const testo = document.getElementById(ids.testo)?.value || "";
        const nome = document.getElementById(ids.nome)?.value || "";
        const note = document.getElementById(ids.note)?.value || "";

        const body =
            "Testo:\n" +
            "→ " + testo + "\n\n" +
            "— " + nome + "\n\n" +
            "Note:\n" +
            "→ *" + note + "*";

        window.location.href =
            `mailto:${destinatario}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(body)}`;
    });
}

// 👇 QUESTE DEVONO STARE FUORI
collegaForm("mailForm", {
    dest: "destinatario",
    ogg: "oggetto",
    testo: "testo",
    nome: "nome",
    note: "note"
});

collegaForm("mailFormc", {
    dest: "destinatarioc",
    ogg: "oggettoc",
    testo: "testoc",
    nome: "nomec",
    note: "notec"
});

// ====== OGGETTO AUTOMATICO SECONDO FORM ======
const nomeInput = document.getElementById("nomec");
const oggettoInput = document.getElementById("oggettoc");

let oggettoModificato = false;

function aggiornaOggetto() {
    if (!oggettoInput) return;

    const nome = nomeInput && nomeInput.value.trim()
        ? nomeInput.value.trim()
        : "[tuonome]";

    // aggiorna SEMPRE finché l’utente non scrive davvero qualcosa
    if (!oggettoModificato) {
        oggettoInput.value = `Ciao, sono ${nome}, volevo chiederti se ti andava di realizzare un sito per me...`;
    }
}

if (oggettoInput) {
    aggiornaOggetto();

    oggettoInput.addEventListener("input", () => {
        oggettoModificato = oggettoInput.value.trim() !== "";
    });
}

if (nomeInput) {
    nomeInput.addEventListener("input", aggiornaOggetto);
}

// ====== ZOOM WARNING ======
let zoomAllowed = false;

window.addEventListener("load", () => {
	zoomAllowed = false;
});

function showPopup() {
	document.getElementById("zoomWarning").classList.remove("hidden");
}

function hidePopup() {
	document.getElementById("zoomWarning").classList.add("hidden");
}

window.addEventListener('wheel', function(e) {
	if (e.ctrlKey && !zoomAllowed) {
		e.preventDefault();
		showPopup();
	}
}, { passive: false });

window.addEventListener('keydown', function(e) {
	if (e.ctrlKey && (
		e.key === '+' ||
		e.key === '-' ||
		e.key === '=' ||
		e.key === '0'
	) && !zoomAllowed) {
		e.preventDefault();
		showPopup();
	}
});

document.getElementById("continueZoom").onclick = function() {
	zoomAllowed = true;
	hidePopup();
};

document.getElementById("resetZoom").onclick = function() {
	zoomAllowed = false;
	document.body.style.zoom = "100%";
	hidePopup();
};

document.body.style.zoom = "100%";

// ====== FOOTER ANNO ======
const annoFooter = document.getElementById("anno-footer");
if (annoFooter) {
	annoFooter.textContent = new Date().getFullYear();
}
});