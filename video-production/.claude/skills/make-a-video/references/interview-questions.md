# Interview Questions â€” Full Bank

Used by `/make-a-video` Gates 1â€“3. Ask one at a time via `AskUserQuestion`, multiple-choice where possible.

## Before asking anything â€” inventory first

Run these to see what already exists so you don't ask for supplied assets:

```bash
ls "<workspace-root>/assets" 2>/dev/null
ls "<project-folder>/assets" 2>/dev/null
```

Reference anything you find by path in the eventual `BRIEF.md`.

---

## Gate 1 Â· Intent & format

**Q1. What's this video for?**
- Promo / marketing video
- Social ad (TikTok Â· Reels Â· Shorts Â· X)
- Launch teaser
- Product demo
- Tutorial
- Explainer
- Intro / outro card
- Other (describe)

**Q2. Who's the audience?** (open-ended)
Probe: industry Â· expertise level Â· platform they'll watch on Â· what should they feel

**Q3. Target duration?**
- Short â€” 10â€“20s
- Promo â€” 20â€“45s
- Explainer â€” 45â€“90s
- Lesson â€” 1.5â€“3 min
- Custom â€” ask for a number

**Q4. Aspect ratio?**
- 16:9 landscape â€” 1920Ã—1080
- 9:16 vertical â€” 1080Ã—1920
- 1:1 square â€” 1080Ã—1080

**Q5. Frame rate?**
- 30 fps (default, good for everything)
- 60 fps (crisp UI, product demos, game footage)
- 24 fps (cinematic)

**Q6. Platform / delivery constraints?**
- Where will it play? (site hero Â· TikTok Â· LinkedIn Â· YouTube Â· internal deck Â· other)
- File-size ceiling?
- Deadline?

---

## Gate 2 Â· Script & voice

**Q7. Script source?**
- Paste the full script now
- I have an outline â€” draft the full script for me
- I'll record it myself (need path to voiceover or face-cam file)
- Generate TTS narration from text
- No narration â€” visuals + music only

**Q8. If TTS:**
- Voice choice (offer from `npx hyperframes tts --help`). Common: `am_adam`, `am_michael` (male US) Â· `af_bella`, `bf_emma` (female US/UK)
- Speaking pace (normal Â· slightly faster Â· slightly slower)

**Q9. If face-cam or recorded voiceover:**
- File path
- Full-screen or corner? (bottom-right Â· bottom-left Â· top-right Â· top-left)
- Need transcription? If yes: `npx hyperframes transcribe <file> --model small.en --json`

**Q10. Captions?**
- Off
- On â€” hype (bold, punchy, colored accent words)
- On â€” corporate (clean, single-line, no emphasis)
- On â€” karaoke (per-word sync, reveal as spoken)
- On â€” minimal (single sub-line, low contrast)

---

## Gate 3 Â· Style intake

**Q11. Style guide or brand document?**
- Yes â€” paste or give path (look for hex codes, fonts, logo rules, spacing rules)
- No

**Q12. Color palette?**
- Paste hex codes. Ask for at least: background Â· text/primary Â· accent (the "emotion" color). Optional: surface Â· border Â· warn.
- None â€” use MOTION_PHILOSOPHY defaults (see `style-intake.md`)

**Q13. Fonts?**
- Google Fonts names (e.g. Inter Â· Montserrat Â· JetBrains Mono Â· Bebas Neue Â· Space Grotesk)
- Font file paths
- None â€” use Inter + JetBrains Mono defaults

**Q14. Logo file?**
- Path to file
- None â€” text wordmark instead? Ask for the text and weight/style

**Q15. Reference videos?**
- URLs or file paths â€” "the vibe I want"
- None

**Q16. Other assets?**
- Screenshots (paths)
- Product photos (paths)
- B-roll clips (paths)
- Music tracks (paths)
- Any SVGs / icons / illustrations (paths)

**Q17. MOTION_PHILOSOPHY aesthetic or different feel?**
- MOTION_PHILOSOPHY: black canvas Â· chrome-gradient type Â· perspective grid Â· whip-pan transitions Â· 4â€“6s outro hold
- Different â€” describe or give references

**Q18. Pacing?**
- Kinetic â€” 1â€“2s scenes, energetic (reference-quality motion graphics)
- Balanced â€” 2â€“3s scenes (most promos)
- Relaxed â€” 3â€“5s scenes (explainers Â· lessons Â· luxury feel)

**Q19. Music?**
- None (silence)
- Ambient pad â€” `data-volume="0.15"` (premium, barely there)
- Music bed â€” `data-volume="0.4"` (standard promo layer)
- Full music â€” `data-volume="0.8"` (music-driven edit)
- File path if they have one

**Q20. Outro / call-to-action text?**
- CTA line (e.g. "Get started at example.com")
- Hold duration (4â€“6s recommended â€” the longest shot in the whole video)

---

## Sequencing rules

- **One question per `AskUserQuestion` call.** Don't batch. The user can't focus on three questions at once.
- **Multiple-choice over open-ended** when the answer has discrete valid forms.
- **Follow-ups happen inline.** If Q7 = "record it myself," the next question is Q9 (not Q8).
- **Capture every answer to the brief as you go** â€” short phrases, not full sentences. The `BRIEF.md` at Gate 4 is a synthesis, not a transcript.
- **If an answer is surprising** (e.g. "I want a 4-hour TikTok ad"), confirm before proceeding. Don't assume.
- **Never ask for what's already known.** If the user mentioned a file path earlier or it's sitting in `assets/`, skip that question and just confirm the interpretation.

