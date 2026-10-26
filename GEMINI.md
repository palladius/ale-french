# 🇫🇷 Ale French — Agent & Audio Rules (`GEMINI.md`)

## 🔊 1. Regola Ferrea per l'Audio: Usa SEMPRE `gemini-3.8-flash-tts` (`gemini38tts`)

- **MAI affidarsi esclusivamente a `window.speechSynthesis` (Web Speech API) del browser:** su Linux (`pupurabbux`) e su molti profili Chrome privi di voce locale `fr-FR`, il browser ignora `utterance.lang = 'fr-FR'` e ripiega sulla voce di default di sistema (`en-GB`, **British English**), leggendo *"je suis"* e *"un tableau"* con accento inglese britannico.
- **Generazione Audio Statica (`audio/*.mp3`):** ogni parola, verbo all'infinito, oggetto scolastico e forma coniugata presente in `verbs.json` **DEVE** avere il proprio file audio `.mp3` pre-generato nella cartella `audio/` tramite il modello **`gemini-3.8-flash-tts`** (`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent`).
- **Regola `speech_metadata.style` di `gemini-3.8-flash-tts`:**
  - **MAI inserire indicazioni di regia dentro `parts[].text`** (`gemini-3.8-flash-tts` legge `parts[].text` alla lettera!).
  - Inserire sempre lingua, tono didattico, velocità chiara per bambini di 8 anni e pronuncia madrelingua francese dentro `parts[].speech_metadata.style`:
    ```json
    {
      "contents": [{
        "parts": [{
          "text": "je suis",
          "speech_metadata": {
            "style": "Warm, clear, articulate native French primary school teacher pronouncing French vocabulary slowly and distinctly for an 8-year-old child (fr-FR)"
          }
        }]
      }],
      "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {
          "voiceConfig": {
            "prebuiltVoiceConfig": {
              "voiceName": "Aoede"
            }
          }
        }
      }
    }
    ```
- **Tracciabilità e Metadati ID3 negli `.mp3` (Incrementale, Zero Rigenerazioni Inutili):**
  - Ogni file `.mp3` generato con `ffmpeg` **DEVE** contenere nei metadati ID3 (`-metadata comment="Created with gemini-3.8-flash-tts (gemini38tts)" -metadata artist="gemini-3.8-flash-tts"` e `-metadata title="<frase francese>"`) la dicitura `"Created with gemini-3.8-flash-tts"`.
  - Il file `audio/manifest.json` tiene traccia di tutte le clip generate (`slug`, `text`, `file`, `model`, `voiceName`, `createdAt`, `sha256`).
  - Lo script di generazione (`scripts/generate-tts.mjs`) **salta automaticamente** qualsiasi file `.mp3` già esistente su disco che abbia i metadati `gemini-3.8-flash-tts` validi, rigenerando solo le parole nuove o mancanti.

## 🧪 2. Test-Driven Development (TDD)

- Prima di modificare la logica audio o aggiungere nuovi verbi/oggetti in `verbs.json`, esegui sempre:
  ```bash
  node --test tests/audio.test.mjs
  ```
- Il test verifica che ogni voce di `verbs.json` abbia il corrispondente `.mp3` in `audio/`, che i metadati `"created with gemini 3.8"` / `"gemini-3.8-flash-tts"` siano presenti nel file `.mp3` e in `audio/manifest.json`, e che tutte le pagine HTML (`index.html`, `cards.html`, `grid.html`, `quiz.html`) usino il player audio basato sui file statici pre-generati.
