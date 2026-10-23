"""Photo-background carousel builder for Zuzazi.
Usage: python3 build_photo.py <spec.py> <out_prefix>
spec.py defines SLIDES: list of dicts with keys
  photo (path or None), kick, h, p or list, pos ('center' crop focus, e.g. '50% 30%')
"""
import asyncio, base64, pathlib, sys, runpy
from playwright.async_api import async_playwright

here = pathlib.Path(__file__).parent
spec = runpy.run_path(sys.argv[1]); prefix = sys.argv[2]
SLIDES = spec["SLIDES"]

def b64(p, mime="image/png"):
    return f"data:{mime};base64," + base64.b64encode((here / p).read_bytes()).decode()

LOGO_W = b64("logo_white.png")
P1, P2, INK = "#8C00FF", "#7632AD", "#252525"

CSS = f"""
*{{margin:0;box-sizing:border-box}}
body{{width:1080px;height:1350px;font-family:'Inter',sans-serif;position:relative;overflow:hidden;color:#fff;background:{INK}}}
.bg{{position:absolute;inset:0;background-size:cover}}
.shade{{position:absolute;inset:0;background:
  linear-gradient(180deg,rgba(20,10,30,.55) 0%,rgba(20,10,30,0) 22%,rgba(20,10,30,0) 38%,rgba(40,8,80,.80) 66%,rgba(60,0,120,.96) 100%)}}
.shade.full{{background:linear-gradient(160deg,rgba(140,0,255,.86),rgba(75,29,122,.92))}}
.shade.plain{{background:linear-gradient(150deg,{P1} 0%,{P2} 70%,#4b1d7a 100%)}}
.logo{{position:absolute;left:100px;top:100px;height:60px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.35))}}
.wrap{{position:absolute;left:100px;right:100px;bottom:200px}}
.mid .wrap{{bottom:auto;top:50%;transform:translateY(-50%)}}
.kick{{display:inline-block;font-size:26px;letter-spacing:5px;font-weight:700;padding:12px 24px;border-radius:40px;margin-bottom:34px;background:{P1};color:#fff}}
h1{{font-family:'Inter Display','Inter',sans-serif;font-weight:800;font-size:96px;line-height:1.0;letter-spacing:-2px;text-shadow:0 4px 24px rgba(0,0,0,.25)}}
p{{font-size:40px;line-height:1.36;margin-top:30px;opacity:.95}}
p b{{background:#fff;color:{P1};padding:2px 14px;border-radius:10px}}
ul{{list-style:none;margin-top:40px}}
li{{font-size:42px;line-height:1.2;padding:16px 0;border-bottom:2px solid rgba(255,255,255,.18);display:flex;gap:24px;align-items:center}}
li:before{{content:'';width:20px;height:20px;border-radius:6px;background:#fff;flex:none}}
.foot{{position:absolute;left:100px;right:100px;bottom:100px;display:flex;justify-content:space-between;align-items:center;font-size:28px;font-weight:600}}
.dots{{display:flex;gap:10px}}
.dots i{{width:14px;height:14px;border-radius:50%;background:#fff;opacity:.35}}
.dots i.on{{opacity:1;width:40px;border-radius:8px}}
"""

def page(i, n, s):
    bg = f'<div class="bg" style="background-image:url({b64(s["photo"], "image/jpeg")});background-position:{s.get("pos","center")}"></div>' if s.get("photo") else ""
    shade = "shade " + s.get("shade", "") if s.get("photo") else "shade plain"
    body = "<ul>" + "".join(f"<li>{x}</li>" for x in s["list"]) + "</ul>" if s.get("list") else f'<p>{s["p"]}</p>'
    dots = "".join(f'<i class="{"on" if j == i else ""}"></i>' for j in range(1, n + 1))
    cls = "mid" if s.get("mid") else ""
    return f"""<html><head><style>{CSS}</style></head><body class="{cls}">{bg}<div class="{shade}"></div>
<img class="logo" src="{LOGO_W}"><div class="wrap"><div class="kick">{s['kick']}</div><h1>{s['h']}</h1>{body}</div>
<div class="foot"><span>@zuzazicreations</span><div class="dots">{dots}</div></div></body></html>"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1080, "height": 1350})
        for i, s in enumerate(SLIDES, 1):
            await pg.set_content(page(i, len(SLIDES), s))
            await pg.screenshot(path=str(here / f"{prefix}_{i:02d}.jpg"), type="jpeg", quality=80)
        await b.close()

asyncio.run(main())
