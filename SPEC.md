# 🇫🇷 Ale French — Specification & Architecture Spec (SPEC.md)

**Target Learner:** Alessandro Carlesso (Age 8, Primary 3 / 3ª Elementare)  
**Tutors / Parents:** Riccardo Carlesso & Kate Knight  
**Focus:** French Present Indicative (Le Présent de l'Indicatif) — Reflexive Routine Verbs & High-Frequency Common Verbs.

---

## 🎯 1. Obiettivi Didattici & Approccio Multilingue

1. **Il Ponte Linguistico (Francese ↔ Italiano):**
   - Alessandro parla 4 lingue. L'italiano è la lingua neolatina più vicina al francese come struttura verbale.
   - **Colonna di Traduzione Italiana a Destra:** Ogni voce coniugata ha la sua esatta traduzione italiana in corsivo (`je m'habille` ➔ *io mi vesto*, `nous nous habillons` ➔ *noi ci vestiamo*).
   - **Modalità Copri/Scopri (Toggle 👁️):** L'utente può commutare tra 3 modalità per allenare la memoria:
     1. *Visibile:* la traduzione italiana è sempre visibile a destra.
     2. *Coperto (Flashcard):* la traduzione italiana è mascherata con un velo grigio (`👁️ tocca per scoprire`), così Ale prova prima a tradurla a mente e tocca col dito per verificare.
     3. *Nascosto:* la colonna italiana viene rimossa per concentrarsi al 100% sulla lingua francese.

2. **La Decomposizione Morfologica Visiva (Radice vs Desinenza):**
   - Per i bambini delle elementari l'ortografia francese è un incubo a causa delle lettere mute finali (`-s`, `-e`, `-ent`).
   - L'applicazione separa nettamente le componenti con colori ad alto contrasto:
     - 🔵 **Soggetto:** Blu (`#2563eb`)
     - 🟣 **Pronome Riflessivo:** Viola tenue (`#7c3aed`) con pillola arrotondata (`me`, `te`, `se`, `nous`, `vous`, `se`, `m'`, `t'`, `s'`)
    - ⚫️ **Radice Base:** Rosso scuro / bordeaux (`#991b1b`, es. `mang-`, `habill-`, `lav-`)
    - 🔴 **Desinenza Scritta:** Rosso chiaro vivace (`#ef4444`) con sottolineatura coordinata senza padding o spazi intermedi, così radice e desinenza appaiono come un'unica parola coesa senza distaccarsi!

3. **🃏 Nuova Sezione Flashcards Vocabolario (`cards.html`):**
   - **Obiettivo:** Imparare l'infinito francese associandolo all'azione ("Come si dice mangiare? Manger! Come si dice lavarsi i denti? Se brosser les dents!").
   - **Indovinello con Caselle Lettera (Hangman Style):** Ogni lettera dell'infinito è rappresentata da un tassello `?` (se la parola ha 6 lettere ci sono 6 caselle, se ne ha 12 ce ne sono 12), permettendo ad Ale di dedurre e contare la lunghezza esatta.
   - **3D Card Flip & Auto-Audio:** Al tocco/click la carta si capovolge in 3D, rivela la parola con desinenza evidenziata e pronuncia immediatamente l'audio francese a 0.85x.
   - **Doppia modalità:** Vista Mazzo (Flashcard a tutto schermo con navigazione sequenziale, shuffle `🔀` e filtri) e Vista Griglia (tutte le 18 carte contemporaneamente).
   - **Navigazione diretta:** Pulsante `📖 Coniuga ➔` sulla carta girata per atterrare direttamente alla tabella della coniugazione in `index.html`.

4. **Il Layout a Gruppi di Tre (Regola Fondamentale):**
   - Il verbo è introdotto da un **`<h2>`** grande e chiaro con icona emoji.
   - Sotto, i 6 tempi sono raggruppati esattamente in **due gruppi da tre**:
     - 👤 **Singulier (3 persone):** `je`, `tu`, `il / elle / on`
     - 👥 **Pluriel (3 persone):** `nous`, `vous`, `ils / elles`

---

## 🔊 2. Sintesi Vocale & Pronuncia (Web Speech API)

* **Zero Dipendenze / Zero Server:** L'audio sfrutta l'API standard `window.speechSynthesis` presente in Safari (iPad/Mac), Chrome e Firefox.
* **Lingua:** `fr-FR` nativa francese.
* **Velocità:** Calibrata a `0.85x` (leggermente rallentata per facilitare la percezione fonetica dei suoni vocalici e delle consonanti nasali).
* **Ascolto puntuale:** Pulsante altoparlante 🔊 per l'infinito e per ciascuna riga coniugata.

---

## ✍️ 3. Quiz & Test di Scrittura Interattivo

* **Allenamento Ortografico:** L'app propone un pronome e un verbo (es. `Tu + s'habiller = ?`) e mostra la traduzione italiana come indizio.
* **Feedback Istantaneo:**
  - Se corretto: campo verde, suono vocale di conferma, +10 punti ⭐.
  - Se errato: campo rosso, visualizzazione della grafia corretta per rinforzare la memoria visiva prima di riprovare.

---

## 📦 4. Repository & Deployment

* **URL Pubblico GitHub Pages:** https://palladius.github.io/ale-french/
* **Codice Sorgente:** https://github.com/palladius/ale-french
