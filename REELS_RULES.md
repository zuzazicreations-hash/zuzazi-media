# Reel rules (owner decision 22 Nov 2026). These override the stock-video reel steps in the task prompt and the "Reel:" / "Free Pexels media only" lines in playbook.md.

## Weekly slots (Mon-Fri 10:00 Dubai)
- Mon: PRODUCT REEL (animated template, format logo_on or ideas), normal REEL.
- Tue, Thu: CAROUSEL (unchanged; Pexels photos are still fine for carousels).
- Wed: ZUZAZI STORY reel, pre-made in chat by Claude and scheduled in advance. If a Wednesday has nothing scheduled, make a PRODUCT REEL in format ab instead.
- Fri: PRODUCT REEL as a TRIAL REEL (Metricool instagramData.type "TRIAL_REEL", shown to non-followers first). Never use TRIAL_REEL for story reels or occasion posts.
- plan.csv rows still win. Rows whose topic says "(animated, pre-made)" are already scheduled: never rebuild or reschedule them.

## Product reels: no stock footage
Build with the animated template in tools/story/ (needs Playwright Chromium + ffmpeg):
  cp -r tools/story ./work/story && python3 work/story/product_reel.py spec.json reel.mp4 --frames   (check frames: reel_check1.jpg ...)
  python3 work/story/product_reel.py spec.json reel.mp4                                               (10-15 s, 1080x1920, silent track)
spec.json examples: tools/story/example_logo_on.json, example_ab.json, example_ideas.json.
- format "logo_on": hook + 3-4 items; each item gets "YOUR LOGO" stamped on it. Hook idea: "Your logo on everything".
- format "ab": exactly 2 items, question "Which one would you pick?", CTA "Comment A or B". Caption asks people to comment A or B.
- format "ideas": 3 items with short labels (e.g. "3 welcome kit must-haves").
- Rotate formats: never the same format two product reels in a row (check logs).
- Items available (field "p"): tshirt, polo, hoodie, cap, mug, bottle, tumbler, notebook, diary, pen, tote, lanyard, powerbank, umbrella, medal. Optional "c" colour (hex). Labels max 16 characters. Hook max about 30 characters.
- Do not use gift boxes, packaging, paper bags, business cards or stickers as items (owner said stop).
- Music: add Instagram music with instagramData.audioConfiguration as before (instrumental, no repeat within 5 logs).
- Alt text: "Animated graphic of <items> with a YOUR LOGO placeholder ..." Set isAiGenerated false (graphics, no AI people or voices).
- Look at the check frames before rendering the video; fix any text that overflows.

## Story reels (Wed)
Made in chat with tools/story (characters, AI voices, subtitles, own music). Scheduled with isAiGenerated true and no Instagram music (they have their own audio). Cast: Fatima, Omar, Khalid (office), Mariam (nurse cameo in every story).
