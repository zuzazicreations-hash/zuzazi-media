"""Zuzazi reel builder: stock clips -> 1080x1920 branded reel with text overlays and end card.
Usage: python3 build_reel.py <spec.py> <out.mp4>
spec.py defines CLIPS = [dict(src, start, dur, kick, h, x='center')], END = dict(h, p, dur)
Needs logo_white.png next to this script. Requires ffmpeg + playwright.
"""
import asyncio, base64, pathlib, subprocess, sys, runpy, tempfile

here = pathlib.Path(__file__).parent
spec = runpy.run_path(sys.argv[1]); out = sys.argv[2]
CLIPS, END = spec["CLIPS"], spec["END"]
LOGO = "data:image/png;base64," + base64.b64encode((here / "logo_white.png").read_bytes()).decode()
P1, P2 = "#8C00FF", "#7632AD"
tmp = pathlib.Path(tempfile.mkdtemp())

BASE = f"""*{{margin:0;box-sizing:border-box}}body{{width:1080px;height:1920px;font-family:'Inter',sans-serif;color:#fff;position:relative;overflow:hidden}}
.logo{{position:absolute;left:90px;top:230px;height:64px;filter:drop-shadow(0 2px 10px rgba(0,0,0,.5))}}
.wrap{{position:absolute;left:90px;right:200px;bottom:520px}}
.kick{{display:inline-block;font-size:30px;letter-spacing:5px;font-weight:700;padding:14px 26px;border-radius:40px;background:{P1};margin-bottom:26px}}
h1{{font-family:'Inter Display','Inter',sans-serif;font-weight:800;font-size:104px;line-height:1.0;letter-spacing:-2px;text-shadow:0 4px 30px rgba(0,0,0,.55)}}
.fade{{position:absolute;inset:auto 0 0 0;height:1100px;background:linear-gradient(180deg,rgba(40,8,80,0),rgba(40,8,80,.55) 45%,rgba(60,0,120,.85))}}
.top{{position:absolute;inset:0 0 auto 0;height:420px;background:linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,0))}}
.end{{background:linear-gradient(150deg,{P1} 0%,{P2} 70%,#4b1d7a 100%)}}
.end .logo{{position:static;height:110px;margin-bottom:70px}}
.endwrap{{position:absolute;left:90px;right:200px;top:50%;transform:translateY(-50%)}}
.end h1{{font-size:120px}} .end p{{font-size:48px;line-height:1.35;margin-top:36px;opacity:.95}}
.end b{{background:#fff;color:{P1};padding:2px 16px;border-radius:12px}}
.handle{{position:absolute;left:90px;bottom:430px;font-size:38px;font-weight:600}}"""

def overlay_html(c):
    return f"""<html><head><style>{BASE}body{{background:transparent}}</style></head><body>
<div class="top"></div><div class="fade"></div><img class="logo" src="{LOGO}">
<div class="wrap"><div class="kick">{c['kick']}</div><h1>{c['h']}</h1></div></body></html>"""

def end_html(e):
    return f"""<html><head><style>{BASE}</style></head><body class="end">
<div class="endwrap"><img class="logo" src="{LOGO}"><h1>{e['h']}</h1><p>{e['p']}</p></div>
<div class="handle">@zuzazicreations</div></body></html>"""

async def render():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1080, "height": 1920})
        for i, c in enumerate(CLIPS):
            await pg.set_content(overlay_html(c)); await pg.screenshot(path=str(tmp / f"ov{i}.png"), omit_background=True)
        await pg.set_content(end_html(END)); await pg.screenshot(path=str(tmp / "end.png"))
        await b.close()
asyncio.run(render())

def run(cmd): subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

parts = []
for i, c in enumerate(CLIPS):
    seg = tmp / f"seg{i}.mp4"
    x = c.get("x", "(iw-ow)/2")
    vf = (f"scale=-2:1920,crop=1080:1920:{x}:0,setsar=1,fps=30[v];"
          f"[v][1:v]overlay=0:0,fade=t=in:st=0:d=0.25,format=yuv420p")
    run(["ffmpeg", "-y", "-ss", str(c["start"]), "-t", str(c["dur"]), "-i", str(here / c["src"]),
         "-i", str(tmp / f"ov{i}.png"), "-filter_complex", vf, "-an", "-c:v", "libx264", "-preset", "medium",
         "-crf", "23", "-r", "30", str(seg)])
    parts.append(seg)
endseg = tmp / "endseg.mp4"
run(["ffmpeg", "-y", "-loop", "1", "-t", str(END["dur"]), "-i", str(tmp / "end.png"),
     "-vf", "fade=t=in:st=0:d=0.3,format=yuv420p,fps=30", "-c:v", "libx264", "-crf", "23", str(endseg)])
parts.append(endseg)
lst = tmp / "list.txt"; lst.write_text("".join(f"file '{p}'\n" for p in parts))
total = sum(c["dur"] for c in CLIPS) + END["dur"]
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-f", "lavfi", "-i",
     "anullsrc=channel_layout=stereo:sample_rate=44100", "-t", str(total), "-c:v", "libx264", "-crf", "23",
     "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out])
print("built", out, total, "s")
