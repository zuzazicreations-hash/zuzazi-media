"""Zuzazi Stories renderer.
usage: python3 render.py <story_dir> frames t1 t2 ...   -> <story_dir>/out/f_<t>.jpg
       python3 render.py <story_dir> video                -> <story_dir>/silent.mp4
story_dir holds scenes.js (sets LINES, SCENES); lib.js sits beside this script."""
import sys, os, base64, subprocess, json
from playwright.sync_api import sync_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
sd=os.path.abspath(sys.argv[1]); mode=sys.argv[2]; FPS=30
def b64(p): return 'data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
html=f"""<!doctype html><html><head><style>html,body{{margin:0;background:#fff}}</style></head><body>
<svg id="v" xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"></svg>
<script>window.LOGO="{b64(os.path.join(HERE,'logo_white.png'))}";window.LOGOP="{b64(os.path.join(HERE,'logo_purple.png'))}";</script>
<script>{open(os.path.join(HERE,'lib.js')).read()}</script><script>{open(os.path.join(sd,'scenes.js')).read()}</script></body></html>"""
open(os.path.join(sd,'page.html'),'w').write(html)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto('file://'+os.path.join(sd,'page.html')); pg.wait_for_timeout(300)
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    tot=pg.evaluate('total()')
    if mode=='frames':
        os.makedirs(os.path.join(sd,'out'),exist_ok=True)
        for t in sys.argv[3:]:
            pg.evaluate(f'draw({float(t)})'); pg.screenshot(path=os.path.join(sd,'out',f'f_{t}.jpg'),type='jpeg',quality=85)
    else:
        n=int(tot*FPS)
        ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',os.path.join(sd,'silent.mp4')],stdin=subprocess.PIPE)
        for i in range(n):
            pg.evaluate(f'draw({i/FPS})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=92))
        ff.stdin.close(); ff.wait()
    print(json.dumps({'total':tot,'errors':errs}))
    b.close()
