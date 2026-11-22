# Zuzazi Stories (animated dialogue reels)
Cartoon story reels in Zuzazi purple with AI voices (Kokoro), subtitles, synthesized music and the Zuzazi logo on gifts.
- lib.js: characters (person), props (giftBox, tumbler, scarf, pin, notebook, flag), backgrounds, subtitles, captions.
- <story>/scenes.js: LINES (who, t0, text) and SCENES. <story>/lines.py + tts.py: voices (needs kokoro-onnx + model files in /home/claude/tts).
- Build: python3 tts.py (in story dir) -> python3 render.py <story> frames 2 5 ... (check) -> python3 render.py <story> video -> export LINES to lines.json -> python3 music.py <story> <seconds> <story>/lines.json -> ffmpeg mux silent.mp4 + mix.wav.
- Recurring cameo: Mariam (nurse, rose-pink hijab, purple scrubs with logo).
