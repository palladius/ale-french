# 🇫🇷 Ale & Seby French — Verbes & Débutant A1

Una mini web app per **Alessandro Carlesso (Primary 3 / 8 anni)** e **Sebastian Carlesso (Primary 1 / 6 anni)** alla **Tandem IMS Seefeld** per imparare, ripassare e memorizzare il Francese: verbi al presente, desinenze ortografiche, e programma esami A1 (saluti, numeri, presentazione, colori e forme).

---

## 🌟 Caratteristiche

### 👦 Per Alessandro (Primary 3)
* 📋 **Layout a Gruppi di Tre (`index.html`):** Titolo con icona e i 6 indicativi divisi in Singolari (`je`, `tu`, `il`) e Plurali (`nous`, `vous`, `ils`).
* 🎨 **Colori Morfologici:** Pronomi personali, pronomi riflessivi e desinenze mute/ortografiche (`-e`, `-es`, `-ons`, `-ez`, `-ent`) evidenziate per il test di scrittura.
* 🃏 **Flashcards 3D (`cards.html`):** 46 carte (verbi + simboli scuola) con card flip tridimensionale, indovinello Hangman a caselle e pronuncia audio.
* 🎯 **Quiz a Scelta Multipla (`quiz.html`):** 3 livelli di difficoltà, trappole ortografiche (accenti, apostrofi, doppie), persistenza e registro storico.

### 🧒 Per Sebastian (Primary 1 — Esame A1, `seby.html`)
* 👤 **Login "Chi sei?" (`profile-switcher.js`):** Schermata iniziale con le foto di Ale e Seby per scegliere il profilo e switch rapido dalla barra di navigazione.
* 👋 **Salutations & Présentation:** Hello, Bonjour, Salut, Au revoir, Bonne nuit, *"Je m'appelle Sebastian"*, *"J'ai 6 ans"*, *"Ça va bien, merci !"*.
* 🔢 **Les Nombres (0 à 12):** Conteggio visuale con pallini, pronuncia lenta (`0.80x`), grafia francese e indizi fonetici.
* 🎨 **Couleurs & Formes:** Colori (rouge, bleu, vert, jaune, orange, rose, violet, noir, blanc) e Forme geometriche (le cercle, le carré, le triangle, le rectangle) allineati al test con Mme Conde.
* ✍️ **Quiz & Scrittura P1:**
  - 👂 *Ascolta e Trova:* Esercizio di ascolto con 4 opzioni illustrate (matching listening test).
  - ✍️ *Scrivi la Parola:* Bolle di lettere da toccare nell'ordine corretto per comporre la parola.

---

## 🔊 Sintesi Vocale & Zero Server
* **Zero Dipendenze / 100% Statico:** Funziona nativamente con la Web Speech API (`fr-FR`) su iPad, Mac o iPhone.
* **Persistenza locale:** Salva lo stato e le preferenze in `localStorage`.

---

## 🌐 Live su GitHub Pages

👉 **URL Principale:** [https://palladius.github.io/ale-french/](https://palladius.github.io/ale-french/)  
👉 **Spazio Seby (A1):** [https://palladius.github.io/ale-french/seby.html](https://palladius.github.io/ale-french/seby.html)  
👉 **Flashcards 3D:** [https://palladius.github.io/ale-french/cards.html](https://palladius.github.io/ale-french/cards.html)  
👉 **Quiz Multiplo:** [https://palladius.github.io/ale-french/quiz.html](https://palladius.github.io/ale-french/quiz.html)  

---

## 📂 Struttura File

* `index.html` — Coniugazione verbi per Alessandro (P3).
* `seby.html` — Hub educativo A1 per Sebastian (P1).
* `seby-data.js` — Database vocabolario, numeri 0-12, saluti e forme per P1.
* `profile-switcher.js` & `profile-switcher.css` — Gestore profilo "Chi sei? Ale o Seby" con badge e modal.
* `cards.html` — Flashcards vocabolario con flip 3D e indovinello lettere.
* `quiz.html` — Quiz a scelta multipla con registro di papà.
* `grid.html` — Griglia 4x4 e selezione multipla.
* `verbs.json` — Database 26 verbi coniugati.
* `SPEC.md` — Specifiche didattiche, architettura e requisiti d'esame Tandem IMS.
