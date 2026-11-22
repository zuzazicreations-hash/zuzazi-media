import json,sys; sys.path.insert(0,'.')
from lines import L
from kokoro_onnx import Kokoro; import soundfile as sf
k=Kokoro("/home/claude/tts/kokoro-v1.0.onnx","/home/claude/tts/voices-v1.0.bin")
d={}
for n,v,sp,t in L:
    a,sr=k.create(t,voice=v,speed=sp,lang="en-us" if v[0]=='a' else "en-gb"); sf.write(f"{n}.wav",a,sr); d[n]=round(len(a)/sr,2)
json.dump(d,open('dur.json','w')); print(d)
