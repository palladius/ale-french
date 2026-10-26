# Ale French — Justfile

# Run TDD test suite
test:
    node --test tests/audio.test.mjs tests/card-spelling.test.mjs

# Generate missing French TTS audio clips via gemini-3.8-flash-tts (incremental, skips existing valid MP3s)
tts *args:
    node scripts/generate-tts.mjs {{args}}

# Commit and push audio fix immediately to GitHub Pages
deploy: test
    git add -A
    git commit -m "fix(audio): fix silent cards, apostrophe SyntaxError, Chrome speechSynthesis bug, and add TDD suite" || true
    git push origin main

# Generate all 202 Gemini 3.8 TTS MP3s, run tests, and push to GitHub Pages
tts-deploy: tts test
    git add -A
    git commit -m "feat(audio): add pre-generated gemini-3.8-flash-tts French MP3s with ID3 metadata" || true
    git push origin main

# Serve locally on port 8000
serve port="8000":
    python3 -m http.server {{port}}
