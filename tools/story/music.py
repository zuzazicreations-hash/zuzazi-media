"""Synth an upbeat warm background track and mix voices.
usage: python3 music.py <story_dir> <total_seconds> <scenes.js LINES json> """
import numpy as np, soundfile as sf, json, sys, os
sd=sys.argv[1]; T=float(sys.argv[2]); lines=json.load(open(sys.argv[3])); sfx=json.load(open(os.path.join(sd,'sfx.json'))) if os.path.exists(os.path.join(sd,'sfx.json')) else []
SR=24000; n=int(T*SR); t=np.arange(n)/SR
bpm=104; beat=60/bpm
def note(f): return 440*2**((f-69)/12)
prog=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]  # C G Am F
mus=np.zeros(n)
def env(L,a=.01,r=.3):
    e=np.ones(L); A=int(a*SR); R=min(L,int(r*SR)); e[:A]=np.linspace(0,1,A); e[-R:]*=np.linspace(1,0,R); return e
bar=4*beat
for b in range(int(T/bar)+1):
    ch=prog[b%4]; s0=int(b*bar*SR); L=min(int(bar*SR),n-s0)
    if L<=0: break
    tt=np.arange(L)/SR
    pad=sum(np.sin(2*np.pi*note(m)*tt)+.3*np.sin(2*np.pi*note(m+12)*tt) for m in ch)*.045*env(L,.3,.4)
    mus[s0:s0+L]+=pad
    bass=note(ch[0]-24)
    for k in range(4):
        q=int((b*bar+k*beat)*SR); Lq=min(int(beat*.9*SR),n-q)
        if Lq<=0: continue
        tq=np.arange(Lq)/SR
        mus[q:q+Lq]+=np.sin(2*np.pi*bass*tq)*.16*np.exp(-tq*3)
        # kick
        mus[q:q+Lq]+=np.sin(2*np.pi*(50+80*np.exp(-tq*30))*tq)*.22*np.exp(-tq*12)
        if k%2: # clap/snap
            Ls=min(int(.12*SR),n-q); mus[q:q+Ls]+=np.random.randn(Ls)*.06*np.exp(-np.arange(Ls)/SR*40)
    arp=[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+12,ch[0]+24,ch[2]+12,ch[1]+12,ch[2]+12]
    for k,m in enumerate(arp):
        q=int((b*bar+k*beat/2)*SR); Lq=min(int(beat/2*SR),n-q)
        if Lq<=0: continue
        tq=np.arange(Lq)/SR; f=note(m)
        mus[q:q+Lq]+=(np.sin(2*np.pi*f*tq)+.4*np.sin(4*np.pi*f*tq))*.07*np.exp(-tq*7)
# ducking under dialogue
g=np.ones(n)*1.0
for l in lines:
    a=int(max(0,l['t0']-.15)*SR); z=int(min(T,l['t0']+l['dur']+.2)*SR); g[a:z]=.28
k=int(.15*SR); g=np.convolve(g,np.ones(k)/k,mode='same')
mus*=g
fade=int(1.5*SR); mus[-fade:]*=np.linspace(1,0,fade); mus[:int(.3*SR)]*=np.linspace(0,1,int(.3*SR))
vox=np.zeros(n)
for l in lines:
    a,sr=sf.read(os.path.join(sd,l['id']+'.wav'))
    if a.ndim>1: a=a.mean(1)
    s0=int(l['t0']*SR); L=min(len(a),n-s0); vox[s0:s0+L]+=a[:L]*(.75 if l.get('crowd') else 1.0)
# sfx: pop / chime
for kind,at in sfx:
    s0=int(at*SR)
    if kind=='pop': L=int(.12*SR); tt=np.arange(L)/SR; vox[s0:s0+L]+=np.sin(2*np.pi*(900-3000*tt)*tt)*.25*np.exp(-tt*35)
    if kind=='chime':
        for j,m in enumerate([84,88,91,96]):
            q=s0+int(j*.07*SR); L=min(int(1.2*SR),n-q); tt=np.arange(L)/SR; vox[q:q+L]+=np.sin(2*np.pi*note(m)*tt)*.09*np.exp(-tt*3.5)
out=vox+mus*.8
out/=max(1e-6,np.abs(out).max())/.92
sf.write(os.path.join(sd,'mix.wav'),out,SR); print('ok')
