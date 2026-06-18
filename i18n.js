/* ============================================================
   SCOPA — Internazionalizzazione (i18n)
   Lingue: Italiano (it), Deutsch (de), English (en)
   ============================================================ */

"use strict";

// Nomi dei valori e dei semi nelle tre lingue
const VAL_NOMI = {
  it: { 1: "Asso", 8: "Fante", 9: "Cavallo", 10: "Re" },
  de: { 1: "Ass", 8: "Bube", 9: "Reiter", 10: "König" },
  en: { 1: "Ace", 8: "Jack", 9: "Knight", 10: "King" },
};
const SEME_NOMI = {
  it: { denari: "Denari", coppe: "Coppe", spade: "Spade", bastoni: "Bastoni" },
  de: { denari: "Münzen", coppe: "Kelche", spade: "Schwerter", bastoni: "Stäbe" },
  en: { denari: "Coins", coppe: "Cups", spade: "Swords", bastoni: "Batons" },
};

function valNome(v) { return (VAL_NOMI[LANG] && VAL_NOMI[LANG][v]) || v; }
function semeNome(s) { return SEME_NOMI[LANG][s]; }
function cardName(c) {
  const v = valNome(c.v), s = semeNome(c.seme);
  if (LANG === "it") return `${v} di ${s}`;
  if (LANG === "en") return `${v} of ${s}`;
  return `${v} ${s}`; // de
}

const TR = {
  /* ---------------- Italiano ---------------- */
  it: {
    title: "Scopa — Gioco di carte italiano",
    tab_gioco: "Gioco", tab_risultati: "Risultati", tab_regole: "Regole",
    label_you: "Tu", label_cpu: "Computer",
    games_label: "Partite:", deck_label: "Mazzo:", btn_new: "Nuova partita",
    prese_cpu: "Prese Computer", prese_you: "Le tue prese",
    table_label: "Tavolo", hand_label: "La tua mano",
    live_summary: "📊 Come si compongono i punti (in tempo reale)",
    live_cat: "Categoria", col_you: "Tu", col_cpu: "Computer", live_to: "Punto a",
    live_empty: "Inizia una partita per vedere i punti.",
    live_total: "Totale provvisorio",
    live_note: "Provvisorio: le carte rimaste sul tavolo a fine partita vanno all'ultima presa, quindi «Carte», «Denari» e «Primiera» possono ancora cambiare. Settebello e Scope sono già definitivi.",
    res_title: "Risultati",
    res_won_you: "Partite vinte (Tu)", res_won_cpu: "Partite vinte (Computer)", res_played: "Partite giocate",
    res_last_detail: "Ultima mano — dettaglio punti",
    res_no_hand: "Nessuna mano completata.",
    res_history: "Storico partite", res_num: "#", res_outcome: "Esito",
    btn_reset: "Azzera storico", no_games: "Nessuna partita giocata.",
    confirm_reset: "Vuoi azzerare tutto lo storico e i risultati?",
    cat_carte_taken: "Carte prese", cat_carte: "Carte", cat_denari: "Denari",
    cat_settebello7: "Settebello (7♦)", cat_settebello: "Settebello",
    cat_primiera: "Primiera", cat_scope: "Scope", total_points: "TOTALE PUNTI",
    yes: "Sì",
    outcome_won: "Vinta", outcome_lost: "Persa", outcome_draw: "Pari",
    n_cards: "{n} carte", scope_label: "Scope: {n}",
    press_new: "Premi «Nuova partita» per iniziare.",
    select_hand: "Seleziona una carta dalla tua mano.",
    no_take: "Con {card} non puoi prendere nulla. Clicca di nuovo la carta per calarla sul tavolo.",
    must_single: "Devi prendere una carta singola: clicca la carta verde sul tavolo.",
    select_sum: "Seleziona sul tavolo le carte da prendere (somma {n}).",
    selection_progress: "Selezione: {n} carta/e. Continua fino alla somma {v}.",
    have_take: "Hai una presa disponibile: prendi le carte evidenziate sul tavolo.",
    move_scopa: "{name} gioca {card}, prende {set} e fa SCOPA! ✨",
    move_capture: "{name} gioca {card} e prende {set}.",
    move_drop: "{name} cala {card} sul tavolo.",
    turn_you: "Tocca a te.", turn_cpu: "Tocca al Computer…",
    esito_win: "Hai vinto la mano! 🎉", esito_lose: "Ha vinto il Computer.", esito_draw: "Pareggio!",
    hand_over: "Mano terminata — Tu {a} : {b} Computer. {esito} Premi «Nuova partita».",
    footer: "Scopa · gioco di carte tradizionale italiano",
    rules: `
      <h2>Regole della Scopa</h2>
      <h3>Il mazzo</h3>
      <p>La Scopa si gioca con un mazzo di <b>40 carte</b> italiane (qui napoletane), diviso in quattro semi: <b>Denari</b>, <b>Coppe</b>, <b>Spade</b> e <b>Bastoni</b>. Ogni seme ha dieci carte: Asso (1), dal 2 al 7, Fante (8), Cavallo (9) e Re (10).</p>
      <h3>Preparazione</h3>
      <p>Si distribuiscono <b>3 carte</b> a ciascun giocatore e <b>4 carte scoperte</b> sul tavolo. Esaurite le carte in mano, se ne distribuiscono altre 3 a testa finché il mazzo non è terminato.</p>
      <h3>Come si gioca</h3>
      <p>A turno si gioca una carta dalla propria mano per <b>prendere</b> carte dal tavolo:</p>
      <ul>
        <li>Se la carta ha lo <b>stesso valore</b> di una carta sul tavolo, la cattura.</li>
        <li>Se il suo valore è uguale alla <b>somma</b> di più carte, cattura quelle carte.</li>
        <li><b>Presa singola:</b> se c'è una carta di valore identico, si è obbligati a prendere quella singola carta.</li>
        <li>Se non si può prendere, la carta resta sul tavolo.</li>
      </ul>
      <h3>La Scopa</h3>
      <p>Prendere <b>tutte</b> le carte del tavolo vale <b>1 punto</b> (scopa). Non si fa scopa con l'ultima giocata.</p>
      <h3>Fine partita</h3>
      <p>Le carte rimaste sul tavolo vanno all'<b>ultimo giocatore che ha preso</b>.</p>
      <h3>Punteggio (1 punto per categoria)</h3>
      <ul>
        <li><b>Carte:</b> chi ha preso più carte.</li>
        <li><b>Denari:</b> chi ha preso più denari.</li>
        <li><b>Settebello:</b> chi ha preso il <b>7 di denari</b>.</li>
        <li><b>Primiera:</b> migliore combinazione (una carta per seme). Valori: 7→21, 6→18, Asso→16, 5→15, 4→14, 3→13, 2→12, figure→10.</li>
        <li><b>Scope:</b> 1 punto per ogni scopa.</li>
      </ul>`,
  },

  /* ---------------- Deutsch ---------------- */
  de: {
    title: "Scopa — Italienisches Kartenspiel",
    tab_gioco: "Spiel", tab_risultati: "Ergebnisse", tab_regole: "Regeln",
    label_you: "Du", label_cpu: "Computer",
    games_label: "Partien:", deck_label: "Stapel:", btn_new: "Neue Partie",
    prese_cpu: "Stiche Computer", prese_you: "Deine Stiche",
    table_label: "Tisch", hand_label: "Deine Hand",
    live_summary: "📊 Wie sich die Punkte zusammensetzen (in Echtzeit)",
    live_cat: "Kategorie", col_you: "Du", col_cpu: "Computer", live_to: "Punkt an",
    live_empty: "Starte eine Partie, um die Punkte zu sehen.",
    live_total: "Vorläufige Summe",
    live_note: "Vorläufig: Die am Ende auf dem Tisch verbliebenen Karten gehen an den letzten Stich, daher können 'Karten', 'Münzen' und 'Primiera' sich noch ändern. Settebello und Scope stehen bereits fest.",
    res_title: "Ergebnisse",
    res_won_you: "Gewonnene Partien (Du)", res_won_cpu: "Gewonnene Partien (Computer)", res_played: "Gespielte Partien",
    res_last_detail: "Letzte Runde — Punktedetails",
    res_no_hand: "Keine Runde abgeschlossen.",
    res_history: "Partienverlauf", res_num: "#", res_outcome: "Ergebnis",
    btn_reset: "Verlauf löschen", no_games: "Noch keine Partie gespielt.",
    confirm_reset: "Willst du den gesamten Verlauf und die Ergebnisse löschen?",
    cat_carte_taken: "Gemachte Karten", cat_carte: "Karten", cat_denari: "Münzen",
    cat_settebello7: "Settebello (7♦)", cat_settebello: "Settebello",
    cat_primiera: "Primiera", cat_scope: "Scope", total_points: "PUNKTE GESAMT",
    yes: "Ja",
    outcome_won: "Gewonnen", outcome_lost: "Verloren", outcome_draw: "Unentschieden",
    n_cards: "{n} Karten", scope_label: "Scope: {n}",
    press_new: "Drücke 'Neue Partie', um zu beginnen.",
    select_hand: "Wähle eine Karte aus deiner Hand.",
    no_take: "Mit {card} kannst du nichts nehmen. Klicke die Karte erneut, um sie auf den Tisch zu legen.",
    must_single: "Du musst eine einzelne Karte nehmen: Klicke die grüne Karte auf dem Tisch.",
    select_sum: "Wähle auf dem Tisch die zu nehmenden Karten (Summe {n}).",
    selection_progress: "Auswahl: {n} Karte(n). Mache weiter bis zur Summe {v}.",
    have_take: "Du hast einen möglichen Stich: Nimm die hervorgehobenen Karten.",
    move_scopa: "{name} spielt {card}, nimmt {set} und macht SCOPA! ✨",
    move_capture: "{name} spielt {card} und nimmt {set}.",
    move_drop: "{name} legt {card} auf den Tisch.",
    turn_you: "Du bist am Zug.", turn_cpu: "Der Computer ist am Zug…",
    esito_win: "Du hast die Runde gewonnen! 🎉", esito_lose: "Der Computer hat gewonnen.", esito_draw: "Unentschieden!",
    hand_over: "Runde beendet — Du {a} : {b} Computer. {esito} Drücke 'Neue Partie'.",
    footer: "Scopa · traditionelles italienisches Kartenspiel",
    rules: `
      <h2>Regeln von Scopa</h2>
      <h3>Das Kartenspiel</h3>
      <p>Scopa wird mit einem <b>40-Karten</b>-Deck italienischer (hier neapolitanischer) Karten gespielt, mit vier Farben: <b>Münzen (Denari)</b>, <b>Kelche (Coppe)</b>, <b>Schwerter (Spade)</b> und <b>Stäbe (Bastoni)</b>. Jede Farbe hat zehn Karten: Ass (1), 2 bis 7, Bube (8), Reiter (9) und König (10).</p>
      <h3>Vorbereitung</h3>
      <p>Jeder Spieler erhält <b>3 Karten</b>, <b>4 Karten</b> liegen offen auf dem Tisch. Sind die Handkarten aufgebraucht, werden je 3 neue ausgeteilt, bis der Stapel leer ist.</p>
      <h3>Spielablauf</h3>
      <p>Abwechselnd spielt man eine Handkarte, um Karten vom Tisch zu <b>nehmen</b>:</p>
      <ul>
        <li>Hat die Karte den <b>gleichen Wert</b> wie eine Tischkarte, nimmt sie diese.</li>
        <li>Entspricht ihr Wert der <b>Summe</b> mehrerer Karten, nimmt sie diese.</li>
        <li><b>Einzelnahme:</b> Liegt eine wertgleiche Einzelkarte, muss diese genommen werden.</li>
        <li>Kann man nichts nehmen, bleibt die Karte auf dem Tisch.</li>
      </ul>
      <h3>Die Scopa</h3>
      <p>Nimmt man <b>alle</b> Tischkarten, ist das eine <b>Scopa</b> = <b>1 Punkt</b>. Mit dem letzten Zug gibt es keine Scopa.</p>
      <h3>Spielende</h3>
      <p>Die restlichen Tischkarten gehen an den <b>letzten Spieler, der einen Stich gemacht hat</b>.</p>
      <h3>Wertung (je 1 Punkt)</h3>
      <ul>
        <li><b>Karten:</b> wer die meisten Karten hat.</li>
        <li><b>Münzen:</b> wer die meisten Münzen hat.</li>
        <li><b>Settebello:</b> wer die <b>7 der Münzen</b> hat.</li>
        <li><b>Primiera:</b> beste Kombination (eine Karte je Farbe). Werte: 7→21, 6→18, Ass→16, 5→15, 4→14, 3→13, 2→12, Bilder→10.</li>
        <li><b>Scope:</b> 1 Punkt pro Scopa.</li>
      </ul>`,
  },

  /* ---------------- English ---------------- */
  en: {
    title: "Scopa — Italian card game",
    tab_gioco: "Play", tab_risultati: "Results", tab_regole: "Rules",
    label_you: "You", label_cpu: "Computer",
    games_label: "Games:", deck_label: "Deck:", btn_new: "New game",
    prese_cpu: "Computer's captures", prese_you: "Your captures",
    table_label: "Table", hand_label: "Your hand",
    live_summary: "📊 How the points add up (live)",
    live_cat: "Category", col_you: "You", col_cpu: "Computer", live_to: "Point to",
    live_empty: "Start a game to see the points.",
    live_total: "Provisional total",
    live_note: "Provisional: cards left on the table at the end go to the last capture, so 'Cards', 'Coins' and 'Primiera' may still change. Settebello and Scope are already final.",
    res_title: "Results",
    res_won_you: "Games won (You)", res_won_cpu: "Games won (Computer)", res_played: "Games played",
    res_last_detail: "Last hand — points breakdown",
    res_no_hand: "No hand completed.",
    res_history: "Game history", res_num: "#", res_outcome: "Outcome",
    btn_reset: "Clear history", no_games: "No games played yet.",
    confirm_reset: "Do you want to clear all history and results?",
    cat_carte_taken: "Cards taken", cat_carte: "Cards", cat_denari: "Coins",
    cat_settebello7: "Settebello (7♦)", cat_settebello: "Settebello",
    cat_primiera: "Primiera", cat_scope: "Scope", total_points: "TOTAL POINTS",
    yes: "Yes",
    outcome_won: "Won", outcome_lost: "Lost", outcome_draw: "Draw",
    n_cards: "{n} cards", scope_label: "Scope: {n}",
    press_new: "Press 'New game' to start.",
    select_hand: "Select a card from your hand.",
    no_take: "With {card} you can't take anything. Click the card again to play it to the table.",
    must_single: "You must take a single card: click the green card on the table.",
    select_sum: "Select the cards to take on the table (sum {n}).",
    selection_progress: "Selection: {n} card(s). Keep going until the sum is {v}.",
    have_take: "You have a capture available: take the highlighted cards.",
    move_scopa: "{name} plays {card}, takes {set} and makes a SCOPA! ✨",
    move_capture: "{name} plays {card} and takes {set}.",
    move_drop: "{name} plays {card} to the table.",
    turn_you: "Your turn.", turn_cpu: "Computer's turn…",
    esito_win: "You won the hand! 🎉", esito_lose: "The Computer won.", esito_draw: "Draw!",
    hand_over: "Hand over — You {a} : {b} Computer. {esito} Press 'New game'.",
    footer: "Scopa · traditional Italian card game",
    rules: `
      <h2>Rules of Scopa</h2>
      <h3>The deck</h3>
      <p>Scopa is played with a <b>40-card</b> Italian (here Neapolitan) deck, with four suits: <b>Coins (Denari)</b>, <b>Cups (Coppe)</b>, <b>Swords (Spade)</b> and <b>Batons (Bastoni)</b>. Each suit has ten cards: Ace (1), 2 to 7, Jack (8), Knight (9) and King (10).</p>
      <h3>Setup</h3>
      <p>Each player gets <b>3 cards</b> and <b>4 cards</b> are placed face up on the table. When hands are empty, 3 more are dealt each until the deck runs out.</p>
      <h3>How to play</h3>
      <p>In turn, you play one card from your hand to <b>capture</b> cards from the table:</p>
      <ul>
        <li>If the card has the <b>same value</b> as a table card, it captures it.</li>
        <li>If its value equals the <b>sum</b> of several cards, it captures them.</li>
        <li><b>Single capture:</b> if a single card of equal value is present, you must take that single card.</li>
        <li>If you can't capture, the card stays on the table.</li>
      </ul>
      <h3>The Scopa</h3>
      <p>Taking <b>all</b> the cards on the table scores a <b>Scopa</b> = <b>1 point</b>. No scopa on the final play.</p>
      <h3>End of game</h3>
      <p>Cards left on the table go to the <b>last player who captured</b>.</p>
      <h3>Scoring (1 point each)</h3>
      <ul>
        <li><b>Cards:</b> whoever took the most cards.</li>
        <li><b>Coins:</b> whoever took the most coins.</li>
        <li><b>Settebello:</b> whoever took the <b>7 of coins</b>.</li>
        <li><b>Primiera:</b> best combination (one card per suit). Values: 7→21, 6→18, Ace→16, 5→15, 4→14, 3→13, 2→12, face cards→10.</li>
        <li><b>Scope:</b> 1 point per scopa.</li>
      </ul>`,
  },
};

let LANG = localStorage.getItem("scopa_lang") || "it";

// Traduzione con interpolazione di {variabili}
function t(key, vars) {
  let s = (TR[LANG] && TR[LANG][key]) != null ? TR[LANG][key] : (TR.it[key] != null ? TR.it[key] : key);
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}

// Applica le stringhe statiche segnate con data-i18n
function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((e) => { e.innerHTML = t(e.dataset.i18n); });
  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === LANG));
}
