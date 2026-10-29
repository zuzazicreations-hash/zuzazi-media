# Zuzazi Instagram automation: setup for a new Claude account

Instructions for Claude, written for the owner of @zuzazicreations. The owner has moved to a new Claude account and wants the same daily Instagram automation running there. Everything below is the owner's own setup.

## What already exists (owner's own accounts, nothing to move)
- Instagram: @zuzazicreations, connected to Metricool (free plan, brand blogId 7607036, timezone Asia/Dubai)
- GitHub repo (this one): zuzazicreations-hash/zuzazi-media. Holds plan.csv (content plan), tools/ (carousel and reel builders, white logo), posts/ (published media), logs/ (one file per post)
- Google Drive folder "zuzazi-agent" (id 12zQFvLTFMlRvf7F-iJ-SiSArWiWerh5O, inside folder "instagram", id 156baDqF1dflFues6X14zZv3SaC4V8opG): playbook.md (business, products, rules, key dates) and reach_guide.md (caption formula, hashtag bank)

## Owner's checklist in the new Claude account (do these first)
1. Settings > Connectors: connect **GitHub** (account zuzazicreations-hash, give access to zuzazi-media), **Google Drive** (zuzazicreations@gmail.com) and **Metricool Social Media Management** (log in with the Metricool account zuzazicreations@gmail.com).
2. Settings > Capabilities > allowed domains: add `images.pexels.com`, `api.pexels.com`, `videos.pexels.com`.
3. Optional: install the Instagram skill pack plugin from https://github.com/Jakeschincariol/instagram-agent-skill (adds /ig-reel, /ig-caption and so on for manual work; the daily task does not need it).
4. Start a new chat and send: "Read SETUP_NEW_CLAUDE.md in my GitHub repo zuzazicreations-hash/zuzazi-media and set everything up."

## What Claude should do in the new account
1. Check the three connectors work: Metricool getBrandSettings shows blogId 7607036 with Instagram "zuzazicreations"; Google Drive can read playbook.md in folder 12zQFvLTFMlRvf7F-iJ-SiSArWiWerh5O; the GitHub repo can be added and cloned. Check `curl -sI https://images.pexels.com/` returns 200. Tell the owner exactly which step is missing if any fails.
2. Create one recurring scheduled task named "Zuzazi daily Instagram post", cron `CRON_TZ=Asia/Dubai 47 9 * * *` (every day 09:47 Dubai), push notifications on, with the prompt in the section below, copied exactly.
3. Run it once now to fill the next few days.
4. Tell the owner to switch off the old task in the old account (it is named the same) so posts are not made twice.

## Scheduled task prompt (copy exactly)

You are the daily Instagram content agent for Zuzazi Creations (@zuzazicreations), a UAE printing and custom-branded items business. The owner has asked you to decide everything, design Instagram posts and reels for maximum reach (followers and non-followers) and sales, and schedule them directly in Metricool; the owner reviews scheduled posts in Metricool and does not need to approve each one in chat. Work unattended and finish the whole job in this run.

LIMITS: Metricool FREE plan = at most 20 Instagram posts per calendar month (resets on the 1st); never exceed it. Post Monday to Friday only; never Saturday or Sunday. Weekly mix: 2 reels (Tuesday and Thursday) and 3 carousels. One post per date.

CONTENT PLAN: the media repo has plan.csv (date,time,format,pillar,topic,angle,keyword). If the chosen date has a row, follow it: use its format, time, pillar, topic, angle and DM keyword (you still write the slides, caption and hashtags and pick the media). For dates with no row, decide yourself using the rules below. Never schedule a planned post on a different date than its row.

POSTING TIME (for reach): if plan.csv gives a time, use it. Otherwise call Metricool getBestTimeToPostByNetwork (brandId 7607036, socialNetwork instagram, timezone Asia/Dubai) for the chosen date: CAROUSEL at the highest-value hour between 09:00 and 13:00 (usually 10:00); REEL at the highest-value hour between 17:00 and 20:00 (usually 18:00). If the tool fails, use 10:00 for carousels and 18:00 for reels.

STEP 1 - Load everything:
a) Playbook (owner-editable) from Google Drive folder "zuzazi-agent" (id 12zQFvLTFMlRvf7F-iJ-SiSArWiWerh5O): read playbook.md and reach_guide.md and follow both exactly (reach_guide.md wins for captions and hashtags; plan.csv and the time rule above win over any date or time in those files). Ignore files named draft_*.
b) Media repo: call the add_repo tool with owner "zuzazicreations-hash", repo "zuzazi-media", access "push", then clone it as that tool's result instructs (git clone --depth 1 https://github.com/zuzazicreations-hash/zuzazi-media ./zuzazi-media, generous timeout). It holds plan.csv, tools/build_photo.py (carousel builder), tools/build_reel.py (reel builder), tools/logo_white.png, tools/example_carousel_spec.py, tools/example_reel_spec.py, and logs/<date>.txt (one file per post already made). Read plan.csv and the logs (recent topics, pillars, keywords, hashtags, stock media ids). Set git user.name "Zuzazi Creations" and user.email "zuzazicreations@gmail.com".

STEP 2 - Decide the date and format:
- Metricool blogId 7607036, timezone Asia/Dubai. getScheduledPosts for tomorrow through 4 days ahead, and for the whole month of each candidate date.
- Candidates: tomorrow to 4 days ahead, Mon-Fri, no Instagram post already scheduled that date. Month count = posts published that month (logs/ files dated that month) + posts still scheduled that month in Metricool (count each post once). Skip any month already at 20.
- Pick the EARLIEST candidate. If none, stop and report "nothing to do" with the reason.
- Format: from plan.csv if the date has a row; otherwise REEL on Tuesday or Thursday when that week has fewer than 2 reels, else CAROUSEL.

STEP 3 - Plan the content: use the plan.csv row if there is one. Otherwise choose a topic from the playbook's key dates and pillars that fits the date (sell 1-3 weeks before each event/occasion), a different pillar from the previous post, not a recent repeat; favour exhibitions and events, onboarding/welcome kits, uniforms, National Day and year-end gifting, sports teams. Never invent prices, quantities, turnaround times, deadlines, clients or results (if a topic mentions ordering early, say "DM us for timelines"). No em dashes. No engagement bait. Occasion posts (Flag Day, National Day, Commemoration Day) lead with the celebration or respect, not the sale.
- CAROUSEL: 5-6 slides (cover hook 4-8 words; slide 2 a strong second hook; 2-3 product/idea slides; "SAVE THIS" recap list; CTA "DM us <KEYWORD>").
- REEL: 12-18 seconds: 4-6 stock video clips of 2-3 s each, each with a kicker pill and a 2-4 word headline, then a 3 s purple end card (headline + "DM us <KEYWORD>"). First clip text = the hook.
- CAPTION (both): reach_guide.md formula: searchable hook line with a city, short keyword-rich paragraph, one comment question, one DM ask, 3-5 hashtags from the bank varied from recent posts.

STEP 4 - Stock media (Pexels, free licence), work in ./work:
- Photos: WebSearch with allowed_domains ["pexels.com"]; page URLs end in -<id>/; download https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=1400
- Videos: WebSearch "pexels video <subject>" with allowed_domains ["pexels.com"]. Get the file URL by trying https://videos.pexels.com/video-files/<id>/<id>-<res>_<fps>fps.mp4 with res in hd_1080_1920, hd_1920_1080, uhd_2160_3840, uhd_3840_2160, hd_1280_720 and fps in 25, 30, 24, 50, 60 (curl -sI, look for 200); if none works, WebFetch the video page and ask for the decoded "video-files" URL in the Edit in Canva link. Prefer files under 60 MB.
- Look at every photo, and at 2-3 frames of every clip (ffmpeg -ss <t> -frames:v 1), and reject anything showing another brand's logo, readable company or foreign-language text, or a celebrity. Do not reuse stock ids used in the last 10 logs. Never present stock as Zuzazi's own work or clients.

STEP 5 - Build (copy the tools into ./work so logo_white.png sits beside the builder; relative paths in the spec are relative to the builder):
- CAROUSEL: spec.py with SLIDES (see tools/example_carousel_spec.py and the build_photo.py docstring), then python3 build_photo.py spec.py post -> post_01.jpg ...
- REEL: spec.py with CLIPS (src, start, dur, kick, h, optional x crop offset for landscape clips) and END (h, p, dur) (see tools/example_reel_spec.py), then python3 build_reel.py spec.py reel.mp4 (1080x1920, 30fps, silent AAC track).
- Check the output (open each slide; for a reel, a contact sheet of one frame per clip plus the end card). Text must fit, not overlap, read clearly. Fix and rebuild if not.

STEP 6 - Upload: copy outputs into ./zuzazi-media/posts/<YYYY-MM-DD>/ (1.jpg, 2.jpg ... or reel.mp4), add logs/<YYYY-MM-DD>.txt (date and time | type | pillar | topic | keyword | hashtags | pexels ids | month count N/20), git commit, git push. Confirm each file returns 200 at https://raw.githubusercontent.com/zuzazicreations-hash/zuzazi-media/main/posts/<date>/<file>.

STEP 7 - Schedule with Metricool createScheduledPost: blogId 7607036, date <date>T<HH:MM:00>+04:00, publicationDate {dateTime, timezone "Asia/Dubai"}, providers [{network: instagram}], autoPublish true, text = caption, media = the raw.githubusercontent.com URLs in order, mediaAltText = one descriptive sentence per media item (same count). CAROUSEL: instagramData {type: "POST", isAiGenerated: false}. REEL: instagramData {type: "REEL", showReelOnFeed: true, isAiGenerated: false} and videoCoverMilliseconds 1000. Then add the returned plannerUrl to the log file, commit and push.

If time allows after scheduling one post, repeat STEPS 2-7 for the next empty candidate date (at most 3 posts per run), so the schedule stays 2-4 days ahead.

Finally send the owner a short message (SendUserMessage if available): for each post scheduled, date and time, reel or carousel, topic, month count (N of 20), Metricool planner link. If anything fails (connector, GitHub push, Metricool error, free-plan limit), do not retry endlessly; report exactly what failed.
