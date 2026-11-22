"""Animated product reel builder (no stock footage).
usage: python3 product_reel.py spec.json out.mp4 [--frames]
spec.json: see the header of product.js. Output: 1080x1920, 30fps, silent AAC track
(add Instagram music through Metricool audioConfiguration).
--frames writes check frames (one per scene) next to out.mp4 instead of the video."""
import sys, os, json, subprocess, tempfile, shutil
HERE=os.path.dirname(os.path.abspath(__file__))
spec=json.load(open(sys.argv[1])); out=os.path.abspath(sys.argv[2]); frames='--frames' in sys.argv
import base64
for it in spec['items']:
    if it.get('img'):
        it['src']='data:image/jpeg;base64,'+base64.b64encode(open(os.path.join(HERE,'products',it['img']),'rb').read()).decode()
d=tempfile.mkdtemp()
open(os.path.join(d,'scenes.js'),'w').write('const SPEC='+json.dumps(spec)+';\n'+open(os.path.join(HERE,'product.js')).read())
if frames:
    n=len(spec['items']) if spec['format']=='logo_on' else 1
    ts=[1.2]+[2.2+i*2.3+1.5 for i in range(n)] if spec['format']=='logo_on' else [1.2,2.2+4.0]
    tot=2.2+(2.3*n if spec['format']=='logo_on' else (5.5 if spec['format']=='ab' else 4.2))
    ts.append(tot+2.5)
    subprocess.run(['python3',os.path.join(HERE,'render.py'),d,'frames']+[f'{t:.2f}' for t in ts],check=True)
    base=os.path.splitext(out)[0]
    for i,t in enumerate(ts): shutil.copy(os.path.join(d,'out',f'f_{t:.2f}.jpg'),f'{base}_check{i+1}.jpg')
    print('frames:',len(ts))
else:
    subprocess.run(['python3',os.path.join(HERE,'render.py'),d,'video'],check=True)
    subprocess.run(['ffmpeg','-v','error','-y','-i',os.path.join(d,'silent.mp4'),'-f','lavfi','-i','anullsrc=r=44100:cl=stereo','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-shortest','-movflags','+faststart',out],check=True)
    print('ok',out)
shutil.rmtree(d,ignore_errors=True)
