/* ============================================================
   SCOPA — gioco di carte italiano
   Logica di gioco, intelligenza artificiale e punteggio.
   ============================================================ */

"use strict";

/* ---------- Costanti ---------- */
const SEMI = ["denari", "coppe", "spade", "bastoni"];
const PRIMIERA = { 1: 16, 2: 12, 3: 13, 4: 14, 5: 15, 6: 18, 7: 21, 8: 10, 9: 10, 10: 10 };
// I nomi delle carte e tutte le stringhe sono in i18n.js (cardName, t()).

/* ---------- Stato ---------- */
let S = null; // stato della partita corrente

const persist = {
  get vinteTu() { return +(localStorage.getItem("scopa_vinte_tu") || 0); },
  set vinteTu(v) { localStorage.setItem("scopa_vinte_tu", v); },
  get vinteCpu() { return +(localStorage.getItem("scopa_vinte_cpu") || 0); },
  set vinteCpu(v) { localStorage.setItem("scopa_vinte_cpu", v); },
  get storico() { try { return JSON.parse(localStorage.getItem("scopa_storico") || "[]"); } catch { return []; } },
  set storico(v) { localStorage.setItem("scopa_storico", JSON.stringify(v)); },
};

/* ---------- Utilità mazzo ---------- */
function creaMazzo() {
  const m = [];
  let id = 0;
  for (const seme of SEMI)
    for (let v = 1; v <= 10; v++)
      m.push({ v, seme, id: id++ });
  return m;
}

function mescola(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Combinazioni di presa ---------- */
// Regole: se esiste una carta singola di valore identico, si DEVE prendere
// una singola; altrimenti valgono tutte le combinazioni la cui somma è uguale.
function setDiPresaValidi(carta, tavolo) {
  const singole = tavolo.filter((c) => c.v === carta.v);
  if (singole.length) return singole.map((c) => [c]);

  const risultati = [];
  const n = tavolo.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    let somma = 0;
    const set = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) { somma += tavolo[i].v; set.push(tavolo[i]); }
    }
    if (set.length >= 2 && somma === carta.v) risultati.push(set);
  }
  return risultati;
}

/* ---------- Avvio partita ---------- */
function nuovaPartita() {
  const deck = mescola(creaMazzo());
  S = {
    deck,
    tavolo: deck.splice(0, 4),
    mani: { tu: deck.splice(0, 3), cpu: deck.splice(0, 3) },
    prese: { tu: [], cpu: [] },
    scope: { tu: 0, cpu: 0 },
    ultimaPresa: null,
    turno: "tu",
    selHand: null,        // indice carta selezionata in mano
    selTavolo: new Set(), // id carte selezionate sul tavolo
    fine: false,
  };
  render();
  setMsg(t("turn_you") + " " + t("select_hand"));
}

function distribuisciGiro() {
  S.mani.tu = S.deck.splice(0, 3);
  S.mani.cpu = S.deck.splice(0, 3);
}

/* ---------- Esecuzione di una mossa ---------- */
function ultimaGiocataDellaPartita() {
  // Niente scopa se è l'ultimissima carta dell'intera partita.
  return S.deck.length === 0 &&
         S.mani.tu.length + S.mani.cpu.length === 1;
}

function giocaCarta(player, carta, setPresa) {
  // rimuovi la carta dalla mano
  S.mani[player] = S.mani[player].filter((c) => c.id !== carta.id);

  const nome = player === "tu" ? t("label_you") : t("label_cpu");
  if (setPresa && setPresa.length) {
    const noScopa = ultimaGiocataDellaPartita();
    const ids = new Set(setPresa.map((c) => c.id));
    S.tavolo = S.tavolo.filter((c) => !ids.has(c.id));
    S.prese[player].push(carta, ...setPresa);
    S.ultimaPresa = player;

    const vars = { name: nome, card: descrCarta(carta), set: descrSet(setPresa) };
    if (S.tavolo.length === 0 && !noScopa) {
      S.scope[player]++;
      return t("move_scopa", vars);
    }
    return t("move_capture", vars);
  }
  S.tavolo.push(carta);
  return t("move_drop", { name: nome, card: descrCarta(carta) });
}

function descrCarta(c) { return cardName(c); }
function descrSet(set) { return set.map(descrCarta).join(" + "); }

/* ---------- Flusso dei turni ---------- */
function dopoMossa(player, messaggio) {
  S.selHand = null;
  S.selTavolo.clear();

  // distribuisci un nuovo giro se le mani sono vuote
  if (S.mani.tu.length === 0 && S.mani.cpu.length === 0) {
    if (S.deck.length > 0) {
      distribuisciGiro();
    } else {
      return fineMano(messaggio);
    }
  }

  S.turno = player === "tu" ? "cpu" : "tu";
  render();

  if (S.turno === "cpu" && !S.fine) {
    setMsg(messaggio + "  " + t("turn_cpu"));
    setTimeout(mossaCpu, 850);
  } else {
    setMsg(messaggio + "  " + t("turn_you"));
  }
}

/* ---------- Mossa del giocatore ---------- */
function selezionaMano(idx) {
  if (S.turno !== "tu" || S.fine) return;
  S.selHand = S.selHand === idx ? null : idx;
  S.selTavolo.clear();
  render();

  if (S.selHand === null) { setMsg(t("select_hand")); return; }

  const carta = S.mani.tu[S.selHand];
  const sets = setDiPresaValidi(carta, S.tavolo);
  if (sets.length === 0) {
    setMsg(t("no_take", { card: descrCarta(carta) }));
  } else if (sets.some((s) => s.length === 1)) {
    setMsg(t("must_single"));
  } else {
    setMsg(t("select_sum", { n: carta.v }));
  }
}

function clickTavolo(id) {
  if (S.turno !== "tu" || S.fine || S.selHand === null) return;
  const carta = S.mani.tu[S.selHand];
  const sets = setDiPresaValidi(carta, S.tavolo);
  const prendibili = new Set();
  sets.forEach((s) => s.forEach((c) => prendibili.add(c.id)));
  if (!prendibili.has(id)) return; // carta non prendibile

  if (S.selTavolo.has(id)) S.selTavolo.delete(id);
  else S.selTavolo.add(id);

  // se la selezione corrente coincide con un set valido → esegui
  const corrente = [...S.selTavolo].sort().join(",");
  const match = sets.find((s) => s.map((c) => c.id).sort().join(",") === corrente);
  render();
  if (match) {
    const msg = giocaCarta("tu", carta, match);
    dopoMossa("tu", msg);
  } else {
    setMsg(t("selection_progress", { n: S.selTavolo.size, v: carta.v }));
  }
}

function calaSelezionata() {
  if (S.turno !== "tu" || S.fine || S.selHand === null) return;
  const carta = S.mani.tu[S.selHand];
  const sets = setDiPresaValidi(carta, S.tavolo);
  if (sets.length > 0) {
    setMsg(t("have_take"));
    return;
  }
  const msg = giocaCarta("tu", carta, null);
  dopoMossa("tu", msg);
}

/* ---------- Intelligenza artificiale ---------- */
function valoreSet(carta, set) {
  // euristica: priorità a settebello, denari, scopa, numero di carte
  let p = set.length + 1;
  const tutte = [carta, ...set];
  for (const c of tutte) {
    if (c.v === 7 && c.seme === "denari") p += 9;      // settebello
    if (c.seme === "denari") p += 1.5;                  // denari
    if (c.v === 7) p += 0.6;                            // utile per primiera
    if (c.v === 6) p += 0.4;
    if (c.v === 1) p += 0.3;
  }
  const idsRest = new Set(set.map((x) => x.id));
  if (S.tavolo.filter((x) => !idsRest.has(x.id)).length === 0 && !ultimaGiocataDellaPartita())
    p += 12; // scopa
  return p;
}

function mossaCpu() {
  if (S.fine) return;
  const mano = S.mani.cpu;
  let migliore = null;

  for (const carta of mano) {
    const sets = setDiPresaValidi(carta, S.tavolo);
    if (sets.length === 0) continue;
    for (const set of sets) {
      const p = valoreSet(carta, set);
      if (!migliore || p > migliore.p) migliore = { carta, set, p };
    }
  }

  let msg;
  if (migliore) {
    msg = giocaCarta("cpu", migliore.carta, migliore.set);
  } else {
    // nessuna presa: cala evitando di lasciare somme comode (euristica semplice)
    let scarto = mano[0];
    for (const c of mano) {
      const rischio = (c.seme === "denari" ? 5 : 0) + (c.v === 7 && c.seme === "denari" ? 20 : 0) + c.v * 0.2;
      const rischioMin = (scarto.seme === "denari" ? 5 : 0) + (scarto.v === 7 && scarto.seme === "denari" ? 20 : 0) + scarto.v * 0.2;
      if (rischio < rischioMin) scarto = c;
    }
    msg = giocaCarta("cpu", scarto, null);
  }
  dopoMossa("cpu", msg);
}

/* ---------- Fine mano e punteggio ---------- */
function fineMano(messaggio) {
  // le carte rimaste vanno all'ultimo che ha preso
  if (S.tavolo.length && S.ultimaPresa) {
    S.prese[S.ultimaPresa].push(...S.tavolo);
    S.tavolo = [];
  }
  S.fine = true;

  const pt = calcolaPunti();
  registraRisultato(pt);
  _ultimoPt = pt;
  render();
  renderRisultati(pt);
  setMsg(messaggioFine(pt));
}

function messaggioFine(pt) {
  const esito = pt.totaleTu > pt.totaleCpu ? t("esito_win")
              : pt.totaleTu < pt.totaleCpu ? t("esito_lose")
              : t("esito_draw");
  return t("hand_over", { a: pt.totaleTu, b: pt.totaleCpu, esito });
}

function statistiche(carte) {
  const denari = carte.filter((c) => c.seme === "denari").length;
  const settebello = carte.some((c) => c.v === 7 && c.seme === "denari");
  const primPerSeme = { denari: 0, coppe: 0, spade: 0, bastoni: 0 };
  for (const c of carte) {
    const pv = PRIMIERA[c.v];
    if (pv > primPerSeme[c.seme]) primPerSeme[c.seme] = pv;
  }
  const primiera = SEMI.reduce((s, seme) => s + primPerSeme[seme], 0);
  return { carte: carte.length, denari, settebello, primiera };
}

function calcolaPunti() {
  const t = statistiche(S.prese.tu);
  const c = statistiche(S.prese.cpu);

  const p = { tu: {}, cpu: {}, stat: { tu: t, cpu: c } };

  // Carte
  p.tu.carte = t.carte > c.carte ? 1 : 0;
  p.cpu.carte = c.carte > t.carte ? 1 : 0;
  // Denari
  p.tu.denari = t.denari > c.denari ? 1 : 0;
  p.cpu.denari = c.denari > t.denari ? 1 : 0;
  // Settebello
  p.tu.settebello = t.settebello ? 1 : 0;
  p.cpu.settebello = c.settebello ? 1 : 0;
  // Primiera
  p.tu.primiera = t.primiera > c.primiera ? 1 : 0;
  p.cpu.primiera = c.primiera > t.primiera ? 1 : 0;
  // Scope
  p.tu.scope = S.scope.tu;
  p.cpu.scope = S.scope.cpu;

  p.totaleTu = p.tu.carte + p.tu.denari + p.tu.settebello + p.tu.primiera + p.tu.scope;
  p.totaleCpu = p.cpu.carte + p.cpu.denari + p.cpu.settebello + p.cpu.primiera + p.cpu.scope;
  return p;
}

function registraRisultato(pt) {
  let esito;
  if (pt.totaleTu > pt.totaleCpu) { persist.vinteTu = persist.vinteTu + 1; esito = "vinta"; }
  else if (pt.totaleTu < pt.totaleCpu) { persist.vinteCpu = persist.vinteCpu + 1; esito = "persa"; }
  else esito = "pari";

  const st = persist.storico;
  st.unshift({ tu: pt.totaleTu, cpu: pt.totaleCpu, esito });
  persist.storico = st.slice(0, 50);
}

/* ============================================================
   RENDERING
   ============================================================ */
function el(id) { return document.getElementById(id); }
function setMsg(t) { el("messaggio").textContent = t; }

function cartaHTML(c, classi = "") {
  const sett = (c.v === 7 && c.seme === "denari") ? " settebello" : "";
  const nome = descrCarta(c);
  return `<div class="carta${sett} ${classi}" data-id="${c.id}" title="${nome}">
      <img src="assets/cards/${c.seme}-${c.v}.jpg" alt="${nome}" draggable="false" loading="lazy">
    </div>`;
}

function render() {
  if (!S) return;

  // punteggio provvisorio in tempo reale (stesso calcolo del punteggio finale,
  // applicato alle carte già prese)
  const live = calcolaPunti();

  // mazzo / punteggi correnti
  el("mazzo-count").textContent = S.deck.length;
  el("punti-tu").textContent = live.totaleTu;
  el("punti-cpu").textContent = live.totaleCpu;
  el("vinte-tu").textContent = persist.vinteTu;
  el("vinte-cpu").textContent = persist.vinteCpu;

  // prese
  el("prese-tu-count").textContent = t("n_cards", { n: S.prese.tu.length });
  el("prese-cpu-count").textContent = t("n_cards", { n: S.prese.cpu.length });
  el("scope-tu").textContent = t("scope_label", { n: S.scope.tu });
  el("scope-cpu").textContent = t("scope_label", { n: S.scope.cpu });

  // carte prendibili
  let prendibili = new Set();
  if (S.turno === "tu" && S.selHand !== null && !S.fine) {
    const carta = S.mani.tu[S.selHand];
    setDiPresaValidi(carta, S.tavolo).forEach((s) => s.forEach((c) => prendibili.add(c.id)));
  }

  // tavolo
  el("tavolo").innerHTML = S.tavolo.map((c) => {
    let cls = "";
    if (prendibili.has(c.id)) cls += " prendibile";
    if (S.selTavolo.has(c.id)) cls += " selezionata";
    return cartaHTML(c, cls);
  }).join("");

  // mano del giocatore
  el("mano-tu").innerHTML = S.mani.tu.map((c, i) => {
    const cls = "mano-carta" + (S.selHand === i ? " selezionata" : "");
    return cartaHTML(c, cls);
  }).join("");

  // listener
  el("tavolo").querySelectorAll(".carta").forEach((node) =>
    node.addEventListener("click", () => clickTavolo(+node.dataset.id)));
  el("mano-tu").querySelectorAll(".carta").forEach((node, i) =>
    node.addEventListener("click", () => {
      if (S.selHand === i) calaSelezionata();
      else selezionaMano(i);
    }));

  // riepilogo risultati
  el("r-vinte-tu").textContent = persist.vinteTu;
  el("r-vinte-cpu").textContent = persist.vinteCpu;
  el("r-totali").textContent = persist.storico.length;
  renderStorico();
  renderLivePunti(live);
}

// Tabella "composizione punti in tempo reale" nella scheda Gioco.
function renderLivePunti(pt) {
  const si = t("yes") + " ★";
  const freccia = (a, b) => a ? t("col_you") + " ◀" : (b ? t("col_cpu") + " ▶" : "—");
  const riga = (nome, tu, cpu, vTu, vCpu) =>
    `<tr><td>${nome}</td>
       <td class="${vTu ? 'lead' : ''}">${tu}</td>
       <td class="${vCpu ? 'lead' : ''}">${cpu}</td>
       <td>${freccia(vTu, vCpu)}</td></tr>`;

  el("live-body").innerHTML = [
    riga(t("cat_carte_taken"), pt.stat.tu.carte, pt.stat.cpu.carte, pt.tu.carte, pt.cpu.carte),
    riga(t("cat_denari"), pt.stat.tu.denari, pt.stat.cpu.denari, pt.tu.denari, pt.cpu.denari),
    riga(t("cat_settebello7"), pt.stat.tu.settebello ? si : "—", pt.stat.cpu.settebello ? si : "—", pt.tu.settebello, pt.cpu.settebello),
    riga(t("cat_primiera"), pt.stat.tu.primiera, pt.stat.cpu.primiera, pt.tu.primiera, pt.cpu.primiera),
    riga(t("cat_scope"), pt.tu.scope, pt.cpu.scope, pt.tu.scope > pt.cpu.scope, pt.cpu.scope > pt.tu.scope),
  ].join("");
  el("live-tot-tu").textContent = pt.totaleTu;
  el("live-tot-cpu").textContent = pt.totaleCpu;
}

let _ultimoPt = null;

function renderRisultati(pt) {
  _ultimoPt = pt;
  const r = (nome, tu, cpu, vTu, vCpu) =>
    `<tr><td>${nome}</td>
       <td class="${vTu ? 'esito-vinta' : ''}">${tu}</td>
       <td class="${vCpu ? 'esito-vinta' : ''}">${cpu}</td></tr>`;

  const si = t("yes") + " ★";
  const body = [
    r(t("cat_carte"), pt.stat.tu.carte, pt.stat.cpu.carte, pt.tu.carte, pt.cpu.carte),
    r(t("cat_denari"), pt.stat.tu.denari, pt.stat.cpu.denari, pt.tu.denari, pt.cpu.denari),
    r(t("cat_settebello"), pt.stat.tu.settebello ? si : "—", pt.stat.cpu.settebello ? si : "—", pt.tu.settebello, pt.cpu.settebello),
    r(t("cat_primiera"), pt.stat.tu.primiera, pt.stat.cpu.primiera, pt.tu.primiera, pt.cpu.primiera),
    r(t("cat_scope"), pt.tu.scope, pt.cpu.scope, pt.tu.scope > pt.cpu.scope, pt.cpu.scope > pt.tu.scope),
    `<tr><td><b>${t("total_points")}</b></td>
       <td><b>${pt.totaleTu}</b></td><td><b>${pt.totaleCpu}</b></td></tr>`,
  ].join("");
  el("dettaglio-punti").innerHTML = body;
}

function renderStorico() {
  const st = persist.storico;
  if (!st.length) { el("storico").innerHTML = `<tr><td colspan="4" class="vuoto">${t("no_games")}</td></tr>`; return; }
  el("storico").innerHTML = st.map((g, i) => {
    const cls = g.esito === "vinta" ? "esito-vinta" : g.esito === "persa" ? "esito-persa" : "esito-pari";
    const txt = g.esito === "vinta" ? t("outcome_won") : g.esito === "persa" ? t("outcome_lost") : t("outcome_draw");
    return `<tr><td>${st.length - i}</td><td>${g.tu}</td><td>${g.cpu}</td><td class="${cls}">${txt}</td></tr>`;
  }).join("");
}

/* ============================================================
   UI: tab e pulsanti
   ============================================================ */
function initUI() {
  document.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      el(t.dataset.tab).classList.add("active");
    }));

  el("nuova-partita").addEventListener("click", nuovaPartita);
  el("azzera-storico").addEventListener("click", () => {
    if (confirm(t("confirm_reset"))) {
      persist.vinteTu = 0; persist.vinteCpu = 0; persist.storico = [];
      _ultimoPt = null;
      el("dettaglio-punti").innerHTML = `<tr><td colspan="3" class="vuoto">${t("res_no_hand")}</td></tr>`;
      if (S) render(); else { renderStorico(); el("r-vinte-tu").textContent = 0; el("r-vinte-cpu").textContent = 0; el("r-totali").textContent = 0; }
    }
  });

  // selettore di lingua
  document.querySelectorAll(".lang-btn").forEach((b) =>
    b.addEventListener("click", () => changeLang(b.dataset.lang)));

  // applica la lingua salvata e disegna lo stato iniziale
  applyStaticI18n();
  setMsg(t("press_new"));
  renderStorico();
  el("r-vinte-tu").textContent = persist.vinteTu;
  el("r-vinte-cpu").textContent = persist.vinteCpu;
  el("r-totali").textContent = persist.storico.length;
}

// Cambio lingua: ri-traduce le stringhe statiche e ridisegna le parti dinamiche.
function changeLang(lang) {
  LANG = lang;
  localStorage.setItem("scopa_lang", lang);
  applyStaticI18n();

  if (S) {
    render();
    // messaggio coerente con lo stato attuale
    if (S.fine && _ultimoPt) setMsg(messaggioFine(_ultimoPt));
    else if (S.turno === "cpu") setMsg(t("turn_cpu"));
    else setMsg(S.selHand === null ? t("select_hand") : t("turn_you"));
  } else {
    setMsg(t("press_new"));
  }

  // dettaglio ultima mano
  if (_ultimoPt) renderRisultati(_ultimoPt);
}

document.addEventListener("DOMContentLoaded", initUI);
