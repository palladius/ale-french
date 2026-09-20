# 🇫🇷 Ale French — Verbes au Présent

Una mini web app per **Alessandro Carlesso (Primary 3 / 8 anni)** per imparare, ripassare e memorizzare l'ortografia scritta dei **verbi francesi al presente indicativo**, con focus specifico sui **verbi riflessivi della routine quotidiana** (`se doucher`, `s'habiller`, `se brosser les dents`, `se lever`, `se peigner`, ecc.) e i principali verbi comuni (`aller`, `manger`, `boire`, `faire`, ecc.).

---

## 🌟 Caratteristiche

* 📋 **Layout a Gruppi di Tre:** Titolo in `<h2>` con icona e i 6 indicativi divisi puliti in Singolari (`je`, `tu`, `il`) e Plurali (`nous`, `vous`, `ils`).
* 🎨 **Colori Morfologici:** Pronomi personali, pronomi riflessivi e desinenze mute/ortografiche (`-e`, `-es`, `-ons`, `-ez`, `-ent`) evidenziate in rosso per il test di scrittura.
* 🔊 **Pronuncia Audio Nativa:** Web Speech API integrata (`fr-FR`) per ascoltare sia l'infinito che ciascuna forma coniugata a velocità calibrata per l'apprendimento (`0.85x`).
* ✍️ **Quiz di Scrittura Interattivo:** Modalità test per allenare Ale a digitare e ricordare la grafia corretta delle parole.
* 📱 **Zero Build / Statico al 100%:** Funziona su qualsiasi browser, iPad, Mac o telefono, compatibile con GitHub Pages.

---

## 🌐 Live su GitHub Pages

👉 **URL:** [https://palladius.github.io/ale-french/](https://palladius.github.io/ale-french/)

---

## 📂 Struttura File

* `index.html` — Frontend completo responsive (Studio + Quiz + Audio Web Speech).
* `verbs.json` — Database JSON con 18 verbi coniugati e segmentati (radice, pronomi, desinenze).
* `SPEC.md` — Specifiche dettagliate, pedagogia e architettura per espansioni future con Antigravity.
