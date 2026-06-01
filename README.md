# 🃏 Scopa

App web per giocare a **Scopa**, il tradizionale gioco di carte italiano, contro
il computer. Include il **conteggio dei risultati** e le **regole** complete in
italiano.

## Funzionalità

- **Gioco** completo Tu vs Computer con **carte napoletane** (mazzo da 40:
  Denari, Coppe, Spade, Bastoni).
- Logica di presa fedele alle regole, inclusa la **regola della presa singola**
  obbligatoria e le prese per **somma** di più carte.
- Riconoscimento automatico delle **scope**.
- **Composizione dei punti in tempo reale**: durante la partita una tabella
  mostra come si formano i punti (Carte, Denari, Settebello, Primiera, Scope) e
  a chi andrebbe ciascun punto in quel momento.
- **Punteggio** completo a fine mano: Carte, Denari, Settebello, Primiera, Scope.
- Scheda **Risultati**: riepilogo partite vinte, dettaglio punti dell'ultima
  mano e **storico** delle partite (salvato nel browser).
- Scheda **Regole** con la spiegazione completa del gioco.

## Come si gioca all'app

1. Apri `index.html` in un browser.
2. Premi **«Nuova partita»**.
3. Clicca una carta della tua mano per **selezionarla**:
   - se hai una presa, le carte prendibili sul tavolo si evidenziano in verde:
     clicca quelle giuste fino a completare la presa;
   - se non puoi prendere nulla, **clicca di nuovo** la carta per calarla sul
     tavolo.
4. A fine mano viene calcolato il punteggio e aggiornato lo storico.

## Avvio in locale

Basta aprire il file `index.html`. In alternativa, con un piccolo server:

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Struttura

| File           | Descrizione                                      |
|----------------|--------------------------------------------------|
| `index.html`   | Struttura della pagina e le tre schede           |
| `style.css`    | Stile (tavolo verde, carte, tabelle)             |
| `game.js`      | Logica di gioco, IA del computer e punteggio     |
| `assets/cards/`| Immagini delle carte napoletane (`seme-valore.jpg`) |

## Crediti immagini

Le immagini delle carte napoletane in `assets/cards/` sono di **pubblico
dominio**, provenienti dalla
[categoria «Naples deck» di Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Naples_deck)
(reperite tramite il progetto [OMerkel/Scopa](https://github.com/OMerkel/Scopa)).

## Regole in breve

Mazzo di 40 carte italiane. Si distribuiscono 3 carte a giocatore e 4 sul
tavolo. A turno si gioca una carta prendendo dal tavolo le carte di valore
uguale, oppure la cui somma è uguale al valore giocato. Prendere tutte le carte
del tavolo vale una **scopa**. A fine partita si assegna 1 punto per ciascuna
categoria: **Carte**, **Denari**, **Settebello** (7 di denari) e **Primiera**,
più 1 punto per ogni **scopa**. Le regole complete sono nella scheda *Regole*
dell'app.
