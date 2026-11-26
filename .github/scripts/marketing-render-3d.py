"""Original ray-marched 3D illustrations; no external artwork or services."""
import argparse
from pathlib import Path
import numpy as np
from PIL import Image

WHITE=(.92,.86,.76); BLUE=(.035,.075,.40); GOLD=(.76,.50,.20); DARK=(.024,.035,.09); GLASS=(.66,.72,.86)
def box(c,s,m,r=.07): return ('box',np.array(c,np.float32),np.array(s,np.float32),r,m,1)
def cyl(c,r,h,m,axis=1): return ('cyl',np.array(c,np.float32),np.array([r,h/2],np.float32),0,m,axis)
def ball(c,r,m): return ('ball',np.array(c,np.float32),np.array([r],np.float32),0,m,1)
def platform(): return [cyl((0,.09,0),2.55,.18,GOLD),cyl((0,.24,0),2.52,.25,WHITE)]
def scene(key):
    # Card compositions use a different support geometry and tighter camera framing.
    supports={
        'ai-core': [box((0,.14,0),(1.55,.14,1.14),WHITE,.12)],
        'automation-flow': [box((a,.15,.34 if a else -.34),(.62,.15,.56),WHITE,.09) for a in [-1.26,0,1.26]],
        'commerce': [box((-.42,.14,-.05),(1.66,.14,1.12),WHITE,.12),box((.97,.12,.87),(.65,.12,.55),WHITE,.09)],
        'mobile-app': [cyl((0,.14,0),1.62,.28,WHITE),cyl((0,.025,0),1.63,.05,GOLD)],
        'integration-hub': [cyl((0,.13,0),1.91,.26,WHITE),cyl((0,.025,0),1.92,.05,GOLD)],
        'knowledge-vault': [box((.02,.14,.12),(1.66,.14,.98),WHITE,.10)]
    }
    s=supports[key] if key in supports else platform()
    if key=='ai-core':
        s += [box((0,.46,0),(1.35,.18,1.05),BLUE,.13),box((0,.83,0),(1.05,.13,.82),WHITE,.1),box((0,1.18,0),(.67,.18,.61),GOLD,.12),ball((0,1.72,0),.43,GLASS)]
        for a in [-1.06,1.06]:
            for z in [-.70,.70]:
                s += [box((a,.87,z),(.21,.16,.23),WHITE,.06),ball((a,1.14,z),.12,GOLD)]
        for z in [-.7,.7]: s.append(cyl((0,.78,z),.035,1.7,GOLD,0))
    elif key=='automation-flow':
        for i,(a,y,z,m) in enumerate([(-1.26,.86,.34,WHITE),(0,1.20,-.34,BLUE),(1.26,.9,.34,WHITE)]):
            s += [box((a,y,z),(.48,.46,.43),m,.14),box((a,y+.05,z+.45),(.28,.23,.035),GOLD,.06),ball((a,y+.05,z+.51),.12,WHITE if i==1 else BLUE)]
        for a in [-.64,.64]: s += [cyl((a,.54,.34),.05,.52,GOLD,0),ball((a,.54,.34),.1,GOLD)]
    elif key=='commerce':
        s += [box((-.65,1.30,-.22),(1.14,.80,.11),BLUE,.12),box((-.65,1.30,-.075),(1.03,.70,.05),WHITE,.08),box((-.65,1.80,-.011),(.9,.08,.025),GOLD,.03)]
        for a in [-1.25,-.65,-.05]:
            s += [box((a,1.20,-.006),(.24,.31,.04),GLASS,.04),box((a,1.32,.052),(.15,.15,.08),BLUE,.05),box((a,.98,.052),(.14,.045,.025),GOLD,.02)]
        s += [box((.97,.78,.87),(.52,.4,.41),BLUE,.07),box((.97,1.22,.87),(.56,.07,.45),GOLD,.05),box((.97,.99,1.29),(.07,.24,.025),GOLD,.02)]
    elif key=='mobile-app':
        s += [box((-.30,1.37,0),(.66,1.01,.13),GOLD,.19),box((-.30,1.37,.15),(.60,.95,.04),DARK,.13),box((-.30,1.37,.20),(.54,.87,.025),WHITE,.1),box((-.30,2.12,.24),(.19,.035,.02),BLUE,.02)]
        for i in range(3): s.append(box((-.30+(.08 if i%2 else -.08),1.86-i*.3,.24),(.35,.1,.028),BLUE if i%2 else GLASS,.06))
        s += [box((-.30,.66,.24),(.37,.1,.03),GOLD,.055),box((1.04,1.14,.58),(.56,.4,.1),BLUE,.1),box((1.04,1.14,.7),(.38,.075,.025),WHITE,.03),ball((1.46,1.5,.72),.15,GOLD)]
    elif key=='integration-hub':
        s += [cyl((0,.65,0),.79,.59,BLUE),cyl((0,1.02,0),.70,.13,GOLD),cyl((0,1.16,0),.55,.16,WHITE),ball((0,1.56,0),.3,BLUE)]
        for a,z in [(-1.4,0),(1.4,0),(0,-1.4),(0,1.4)]:
            s += [box((a,.69,z),(.38,.33,.38),WHITE,.1),box((a,1.06,z),(.23,.05,.23),BLUE,.04),ball((a,1.16,z),.085,GOLD),cyl((a/2,.39,z/2),.055,.73,GOLD,0 if a else 2)]
    elif key=='knowledge-vault':
        for a,m in [(-.92,WHITE),(-.45,BLUE),(.02,WHITE)]:
            s += [box((a,1.25,-.15),(.19,.86,.66),m,.06),box((a,1.28,.53),(.13,.12,.025),GOLD,.025),box((a,.64,.53),(.13,.045,.025),GOLD,.02)]
        s += [box((.95,1.04,.55),(.56,.64,.11),GOLD,.1),box((.95,1.04,.68),(.47,.55,.035),WHITE,.07)]
        for i in range(3): s.append(box((.95,1.3-i*.2,.73),(.28,.055,.025),GLASS,.025))
        s += [cyl((1.12,.7,1.02),.28,.1,BLUE,2),cyl((1.12,.7,1.09),.21,.04,GOLD,2),ball((1.12,.7,1.13),.1,WHITE)]
    elif key=='architecture':
        for j,(y,mat) in enumerate([(0.58,WHITE),(1.02,BLUE),(1.46,GOLD),(1.90,WHITE)]):
            s.append(box((-.18,y,.05),(1.24,.14,.94),mat,.11))
            for x in [-.97,-.57,.01,.60]:
                s.append(box((x,y,.99),(.12,.045,.025),GOLD if j==1 else BLUE,.016))
        for x,z in [(-1.39,-.75),(1.03,-.75),(-1.39,.85),(1.03,.85)]:
            s.append(cyl((x,1.28,z),.035,1.55,GOLD));s.append(ball((x,2.11,z),.07,GOLD))
        s += [box((-.18,2.10,.05),(.55,.06,.45),BLUE,.06),box((-.18,2.18,.05),(.32,.045,.25),GOLD,.04)]
        for i in range(3): s.append(box((1.60,.57+i*.24,.20),(.30,.09,.48),BLUE if i==1 else WHITE,.05))
    elif key=='journey':
        for x,mat in [(-1.24,WHITE),(0,BLUE),(1.24,WHITE)]:
            s.append(box((x,.99,.15),(.49,.64,.30),mat,.12))
        for j in range(3):
            s.append(box((-1.24,1.40-j*.28,.48),(.30,.075,.025),BLUE,.025))
            s.append(ball((-1.57,1.40-j*.28,.51),.055,GOLD))
        s += [box((0,1.20,.49),(.33,.24,.035),WHITE,.045),box((0,1.23,.535),(.33,.035,.016),GOLD,.009),box((-.14,1.08,.535),(.09,.026,.016),BLUE,.01),cyl((1.24,1.20,.49),.28,.09,GOLD,2),ball((1.24,1.20,.55),.18,WHITE)]
        for x in [-.62,.62]:
            s += [cyl((x,.53,.15),.05,.25,GOLD,0),ball((x+.16,.53,.15),.085,GOLD)]
        for i in range(3): s.append(ball((1.14+i*.18,.58,.64),.055,BLUE))
    elif key=='partnership':
        for i,(x,h,mat) in enumerate([(-1.15,.44,WHITE),(0,.88,BLUE),(1.12,1.34,WHITE)]):
            s.append(box((x,.37+h/2,-.1),(.47,h/2,.74),mat,.09))
            s.append(box((x,.39+h,.0),(.44,.045,.70),GOLD,.045))
        for x,y,z in [(-1.15,.89,-.1),(0,1.33,-.1),(1.12,1.79,-.1)]:
            s.append(cyl((x,y,z),.24,.13,GOLD));s.append(cyl((x,y+.075,z),.17,.03,WHITE))
        s += [cyl((.80,.78,1.12),.43,.15,GOLD,2),cyl((.80,.78,1.21),.32,.035,WHITE,2),cyl((.80,.78,1.24),.18,.035,BLUE,2)]
        for j in range(3): s.append(cyl((-1.48,.45+j*.09,1.05),.28,.08,GOLD))
    else:
        s += [box((-.42,1.49,-.27),(1.36,.86,.10),DARK,.10),box((-.42,1.49,-.14),(1.28,.78,.04),BLUE,.07),box((-.42,1.47,-.08),(1.17,.67,.035),WHITE,.06),box((-.42,.46,-.27),(.68,.055,.43),GOLD,.05),box((-.42,.58,-.27),(.12,.16,.10),DARK,.035)]
        s += [box((-.90,1.52,-.026),(.52,.42,.018),GLASS,.04),box((-.90,1.34,.001),(.32,.15,.015),BLUE,.035)]
        for j,w in enumerate([.36,.26,.30]): s.append(box((.19,1.85-j*.17,-.018),(w,.033,.02),GOLD if j==0 else GLASS,.015))
        s += [box((.19,1.30,-.018),(.32,.10,.02),BLUE,.04),box((1.27,1.06,.67),(.39,.70,.11),GOLD,.13),box((1.27,1.06,.80),(.35,.64,.04),DARK,.10),box((1.27,1.05,.85),(.30,.57,.025),WHITE,.07),box((1.27,1.26,.885),(.22,.20,.015),BLUE,.035),box((1.27,.78,.885),(.22,.075,.015),GOLD,.03)]
    return s
def sdf(p,objects,materials=False):
    d=p[:,1].copy(); idx=np.full(len(p),-1,np.int16)
    for i,(kind,c,s,r,m,axis) in enumerate(objects):
        q=p-c
        if kind=='box':
            v=np.abs(q)-s+r; z=np.maximum(v,0); e=np.sqrt(np.sum(z*z,axis=1))+np.minimum(np.max(v,axis=1),0)-r
        elif kind=='ball': e=np.sqrt(np.sum(q*q,axis=1))-s[0]
        else:
            a,b=[j for j in range(3) if j!=axis]; radial=np.sqrt(q[:,a]**2+q[:,b]**2)-s[0]; axial=np.abs(q[:,axis])-s[1]
            e=np.sqrt(np.maximum(radial,0)**2+np.maximum(axial,0)**2)+np.minimum(np.maximum(radial,axial),0)
        mask=e<d; d=np.minimum(d,e)
        if materials: idx[mask]=i
    return (d,idx) if materials else d
def unit(v): return v/np.linalg.norm(v)
def render(key,w,h):
    objects=scene(key); forward=unit(np.array([-5.,-3.7,-7.])); right=unit(np.cross(forward,[0,1,0])); up=np.cross(right,forward)
    is_card=key in ('ai-core','automation-flow','commerce','mobile-app','integration-hub','knowledge-vault')
    target=np.array([0.,1.12 if is_card else .95,0.]); origin=target-forward*8
    span=4.85 if is_card else 6.2
    x,y=np.meshgrid((np.arange(w)+.5)/w-.5,.5-(np.arange(h)+.5)/h)
    p=(origin+right*x.ravel()[:,None]*span+up*y.ravel()[:,None]*span*h/w).astype(np.float32)
    f=forward.astype(np.float32); t=np.zeros(len(p),np.float32); active=np.arange(len(p)); hit=np.zeros(len(p),bool)
    for _ in range(100):
        if not len(active): break
        d=sdf(p[active]+t[active,None]*f,objects); good=d<.0016; hit[active[good]]=True
        keep=~good & (t[active]<16); active=active[keep]; t[active]+=np.maximum(d[keep]*.88,.0008)
    pos=p+t[:,None]*f; color=np.tile(np.array([.94,.90,.84],np.float32),(len(p),1)); ids=np.flatnonzero(hit)
    v=pos[ids]; _,mi=sdf(v,objects,True); eps=.003
    n=np.stack([sdf(v+np.eye(3,dtype=np.float32)[i]*eps,objects)-sdf(v-np.eye(3,dtype=np.float32)[i]*eps,objects) for i in range(3)],1); n/=np.maximum(np.linalg.norm(n,axis=1)[:,None],1e-6)
    light=unit(np.array([-3.,6.,4.])).astype(np.float32); diff=np.maximum(n@light,0); half=unit(light-f); ndh=np.maximum(n@half,0)
    shadow=np.ones(len(v),np.float32); distance=np.full(len(v),.045,np.float32); pp=v+n*.012
    for _ in range(28):
        d=sdf(pp+distance[:,None]*light,objects); shadow=np.minimum(shadow,np.clip(9*d/distance,0,1)); distance+=np.clip(d,.035,.45)
    occ=np.ones(len(v),np.float32)
    for dist in [.06,.16,.32]: occ-=np.maximum(0,dist-sdf(v+n*dist,objects))*.56
    occ=np.clip(occ,.56,1)
    palette=np.array([(.90,.85,.78)]+[o[4] for o in objects],np.float32); base=palette[mi+1]; metal=np.array([False]+[o[4]==GOLD for o in objects])[mi+1]
    # Studio material approximation: marble, cobalt enamel and brushed gold.
    eye=-f; ndv=np.maximum(n@eye,0); reflected=2*ndv[:,None]*n-eye
    def lobe(direction,power): return np.maximum(reflected@unit(np.array(direction)),0)**power
    soft=lobe([-3,6,4],12); strip=lobe([5,3,2],30); edge=lobe([-1,4,-5],22)
    fill=np.maximum(n@unit(np.array([5.,3.,2.])),0); rim=np.maximum(n@unit(np.array([-1.,4.,-5.])),0)
    mats=[None]+[o[4] for o in objects]
    mask=lambda m:np.array([a==m for a in mats])[mi+1]
    stone=mask(WHITE); enamel=mask(BLUE); glass=mask(GLASS)
    x0,y0,z0=v.T
    wave=x0*3.2+z0*2.1+y0*.8+.7*np.sin(z0*3.8+x0*.8)+.23*np.sin(x0*12-z0*8)
    vein=.075*np.exp(-(np.sin(wave)/.047)**2)+.018*np.exp(-(np.sin(wave)/.16)**2)
    grain=.004*np.sin(x0*151+z0*97)*np.sin(y0*137-z0*83)
    base[stone]*=(1-vein[stone,None]+grain[stone,None])
    ambient=.38+.40*diff*shadow+.15*fill+.09*rim
    fresnel=.045+.17*(1-ndv)**4; spec=fresnel*(.54*soft+.48*strip+.42*edge)
    rgb=base*ambient[:,None]*occ[:,None]+spec[:,None]*np.array([1.,.97,.91])
    rgb[enamel]+=(.1*soft+.09*strip+.12*edge)[enamel,None]*np.array([.75,.83,1.])
    env=.32+.34*np.maximum(reflected[:,1],0)+.43*soft+.55*strip+.38*edge
    brushed=1+.022*np.sin(155*y0+12*x0)*np.sin(34*z0)
    rgb[metal]=base[metal]*env[metal,None]*brushed[metal,None]*occ[metal,None]+(.10*strip[metal,None]+.08*soft[metal,None])*np.array([1.,.87,.57])
    rgb[glass]=base[glass]*(.58+.26*(diff*shadow)[glass,None])+.14*soft[glass,None]+.14*(1-ndv[glass,None])**3
    floor=mi==-1; rgb[floor]=base[floor]*(.78+.20*shadow[floor,None])*occ[floor,None]
    color[ids]=rgb
    vign=np.clip(1-.20*(x.ravel()**2+y.ravel()**2),.85,1); color=np.clip(color*vign[:,None],0,1)**(1/2.2)
    return Image.fromarray(np.uint8(color.reshape(h,w,3)*255+.5),'RGB')
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('output',type=Path);parser.add_argument('--width',type=int,default=960);parser.add_argument('--scene',choices=['architecture','journey','partnership','portfolio','ai-core','automation-flow','commerce','mobile-app','integration-hub','knowledge-vault']);args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    for key in ([args.scene] if args.scene else ['architecture','journey','partnership','portfolio','ai-core','automation-flow','commerce','mobile-app','integration-hub','knowledge-vault']):
        im=render(key,args.width,round(args.width*.75));im.save(args.output/(key+'.webp'),quality=84,method=6);print(key,im.size,flush=True)
