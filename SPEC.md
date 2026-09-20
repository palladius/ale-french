# 🇫🇷 Ale French — Specification & Architecture Spec (SPEC.md)

**Target Learner:** Alessandro Carlesso (Age 8, Primary 3 / 3ª Elementare)  
**Tutors / Parents:** Riccardo Carlesso & Kate Knight  
**Focus:** French Present Indicative (Le Présent de l'Indicatif) — Reflexive Routine Verbs & High-Frequency Verbs.

---

## 🎯 1. Obiettivi Pedagogici & Didattici

1. **Focus Verbi Riflessivi (La Routine Quotidiana):**
   - Imparare la sequenza dei pronomi riflessivi: `me`, `te`, `se`, `nous`, `vous`, `se` (e le forme elise davanti a vocale/h muta: `m'`, `t'`, `s'`).
   - Verbi coperti:
     - `s'habiller` (vestirsi)
     - `se brosser les dents` (lavarsi i denti)
     - `se lever` (alzarsi)
     - `se peigner` (pettinarsi)
     - `se doucher` (farsi la doccia)
     - `se réveiller` (svegliarsi)
     - `se coucher` (andare a letto)
     - `se laver les mains` (lavarsi le mani)

2. **Focus Verbi ad Alta Frequenza (Transitivi & Irregolari):**
   - `aller` (je vais, tu vas, il va, nous allons, vous allez, ils vont)
   - `manger` (je mange, tu manges, il mange, nous mangeons, vous mangez, ils mangent)
   - `boire`, `marcher`, `faire`, `dormir`, `regarder`, `écouter`, `être`, `avoir`.

3. **La Memoria Visiva & Ortografica (Test di Scrittura):**
   - Alessandro parla già 4 lingue, ma la scuola svizzera/internazionale richiede la **memorizzazione dell'ortografia scritta esatta** (es. le `s` silenti di `tu vas`, `tu manges`, e la desinenza `ent` muta della 3ª plurale `ils mangent`).
   - Per questo ogni verbo ha le desinenze scritte evidenziate in rosso e sottolineate.

---

## 📐 2. Specifiche UI / Layout (Secondo Direttive di Riccardo)

* **Titolo Principale del Verbo:** In `<h2>` grande, chiaro, con icona emoji esplicativa (es. `🪥 se brosser les dents`, `👕 s'habiller`).
* **I Sei Indicativi divisi in 2 Gruppi da Tre:**
  - **Gruppo 1 (Singulier):** `je`, `tu`, `il / elle / on`
  - **Gruppo 2 (Pluriel):** `nous`, `vous`, `ils / elles`
* **Codifica Colori Morfologica:**
  - 🔵 **Soggetto:** Blu (`#2563eb`)
  - 🟣 **Pronome Riflessivo:** Viola / Magenta con badge di sfondo (`#9333ea`)
  - ⚫️ **Radice verbale:** Grigio scuro / Nero (`#0f172a`)
  - 🔴 **Desinenza scritta:** Rosso acceso (`#dc2626`) con sottolineatura solida per fissare l'ortografia.
* **Tipografia Adatta a Bambini:** Font `Fredoka` e `Lexend` (Google Fonts), studiati specificamente per la leggibilità infantile e la facilitazione della dislessia/lettura precoce.

---

## 🔊 3. Sistema di Pronuncia Audio

* **Zero Dipendenze Esterne:** Utilizzo nativo dell'API standard dei browser `window.speechSynthesis` (Web Speech API).
* **Configurazione Audio:**
  - Lingua impostata su `fr-FR`.
  - Velocità di riproduzione rallentata a `rate: 0.85` (ideale per un bambino che deve cogliere i suoni delle desinenze e le *liaisons*).
  - Tasto audio 🔊 sull'infinito e su ciascuna delle 6 forme coniugate.

---

## 🎮 4. Modalità Interattive

1. **Modalità Studio (Default):**
   - Navigazione libera tra i verbi dalla barra laterale.
   - Filtri veloci: "Tutti (18)", "Routine (8)", "Comuni (10)".
   - Clic su audio per ascoltare la corretta dizione parigina/francese.

2. **Modalità Quiz / Test di Scrittura:**
   - La schermata propone un pronome e un infinito (es. `tu + s'habiller = ?`).
   - Alessandro deve digitare a tastiera la forma corretta.
   - Verifica immediata:
     - Se corretta: campo verde, punteggio ⭐, pronuncia automatica di rinforzo.
     - Se errata: campo rosso, suggerimento visivo con la grafia corretta evidenziata.

---

## 🚀 5. Roadmap per Antigravity / Sviluppi Futuri

1. **Schede Stampabili (PDF Worksheets):** Bottone per generare fogli di esercizi a quadretti da stampare su carta per la scrittura a mano.
2. **Supporto Riconoscimento Vocale (STT):** Ale pronuncia la frase e il browser valuta se la pronuncia è corretta.
3. **Modalità "Memory Game":** Carte da abbinare tra verbo italiano e coniugazione francese.
