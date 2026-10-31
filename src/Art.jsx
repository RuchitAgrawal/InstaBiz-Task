// Poodle rig. 300x240 viewBox, faces right, paws on ground at y=228.
// Each moving part is a [data-p] group so PupJourney can drive it frame by frame.
export const PUP = { W: 300, H: 240, ground: 228, eyeY: 98 }
export const COLORS = { ink: '#2a170e', fur: '#f2be6b', shade: '#e4a352', cream: '#fbe3b4', collar: '#a24a1a', blush: '#f9b9a6', tongue: '#e98c8c' }
export const JOINTS = { shoulderN: [186, 194], shoulderF: [168, 192], hipN: [110, 194], hipF: [94, 192], tail: [84, 150], head: [212, 100], earL: [174, 82], earR: [250, 82], body: [196, 206] }

// outline made of n outward arc bumps around an ellipse
const fluff = (cx, cy, rx, ry, n, start = 0) => {
  const pt = (a) => `${(cx + Math.cos(a) * rx).toFixed(1)} ${(cy + Math.sin(a) * ry).toFixed(1)}`
  let d = `M${pt(start)}`
  for (let i = 1; i <= n; i++) {
    const a0 = start + ((i - 1) / n) * Math.PI * 2
    const a1 = start + (i / n) * Math.PI * 2
    const chord = Math.hypot(Math.cos(a1) * rx - Math.cos(a0) * rx, Math.sin(a1) * ry - Math.sin(a0) * ry)
    d += ` A${(chord * 0.62).toFixed(1)} ${(chord * 0.62).toFixed(1)} 0 0 1 ${pt(a1)}`
  }
  return d + 'Z'
}

const ART = {
  body: fluff(140, 170, 64, 36, 14, 0.3),
  chest: fluff(190, 165, 28, 31, 9, 1),
  pom: fluff(68, 122, 16, 15, 8),
  haunch: fluff(110, 204, 30, 24, 10, 0.2),
  head: fluff(212, 100, 50, 45, 15, -1.2),
  topknot: fluff(212, 54, 24, 16, 8, 0.4),
  earL: fluff(168, 116, 15, 34, 10),
  earR: fluff(256, 116, 15, 34, 10),
  pawL: fluff(182, 152, 19, 11, 8),
  pawR: fluff(242, 152, 19, 11, 8),
}
const leg = (w, len) => `M${-w / 2} -12 L${-w / 2 + 1} ${len - 14} Q0 ${len - 8} ${w / 2 - 1} ${len - 14} L${w / 2} -12`
const LEGS = {
  fn: { at: JOINTS.shoulderN, w: 22, len: PUP.ground - 194, fill: 'fur' },
  ff: { at: JOINTS.shoulderF, w: 20, len: PUP.ground - 192, fill: 'shade' },
  bn: { at: JOINTS.hipN, w: 26, len: PUP.ground - 194, fill: 'fur' },
  bf: { at: JOINTS.hipF, w: 24, len: PUP.ground - 192, fill: 'shade' },
}

const ZERO = { bodyRot: 0, bodyX: 0, bodyY: 0, stretch: 1, headX: 0, headY: 0, headRot: 0, earL: 0, earR: 0, tail: 0, fn: 0, ff: 0, bn: 0, bf: 0, sit: 0, eyes: 1, happy: 0, tongue: 0, mouth: 0, front: 0 }
export const POSES = {
  stand: ZERO,
  walk: { ...ZERO, tail: -6, tongue: 1 },
  sit: { ...ZERO, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...ZERO, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...ZERO, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1 },
  settle: { ...ZERO, bodyRot: -5, bodyY: 22, headX: 10, headY: 16, fn: -84, ff: -80, sit: 1, tail: 40, tongue: 1 },
  hop: { ...ZERO, bodyRot: -9, stretch: 1.06, headY: -6, fn: -42, ff: -32, bn: 40, bf: 30, earL: -26, earR: 26, tail: -24, tongue: 1 },
  bow: { ...ZERO, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, fn: -58, ff: -52, tail: -32, happy: 1, tongue: 1 },
  beg: { ...ZERO, bodyRot: -36, bodyY: -6, headX: -18, headY: -18, sit: 1, fn: -70, ff: -64, tail: 30, happy: 1, tongue: 1 },
}
// bounding box [x0, y0, x1, y1] per pose (viewBox units)
export const BOXES = { sit: [50, 26, 284, 234], peek: [148, 34, 280, 163], snug: [148, 40, 280, 163], bow: [58, 56, 292, 236] }
export const BOX = [48, 30, 288, 236]

export const mixPose = (a, b, t) => {
  const o = { ...a }
  for (const k in ZERO) o[k] = a[k] + (b[k] - a[k]) * t
  return o
}

export const MOTION = { phase: 0, stride: 0, time: 0, wag: 0, gazeX: 0, gazeY: 0, blink: 0, ear: 0 }
const r2 = (v) => Math.round(v * 100) / 100
const rot = (a, [x, y]) => `rotate(${r2(a)} ${x} ${y})`

// converts pose + motion state into attribute values for each rig part
export function rigFrame(p, m = MOTION) {
  const walking = m.stride > 0.01 ? 1 : 0
  const swing = 20 + 10 * m.stride
  const a = Math.sin(m.phase)
  const b = -a
  const bob = (1 - Math.cos(2 * m.phase)) / 2
  const idle = Math.sin(m.time * 2.4) * (1 - walking)
  const bodyY = p.bodyY - bob * (2.5 + 4 * m.stride) * walking + 0.6 * idle
  const bodyRot = p.bodyRot + 1.6 * a * walking
  const level = -p.bodyRot
  const tail = p.tail + Math.sin(m.time * (1.2 + 2.6 * m.wag) * Math.PI * 2) * (5 + 17 * m.wag)
  const nod = (-(1 - Math.cos(2 * m.phase - 0.7)) / 2) * (2 + 3 * m.stride) * walking + 0.9 * idle
  const [px] = JOINTS.body
  const limb = (k, extra) => `translate(${LEGS[k].at[0]} ${LEGS[k].at[1]}) rotate(${r2(extra)})`
  return {
    body: `translate(${r2(p.bodyX)} ${r2(bodyY)}) ${rot(bodyRot, JOINTS.body)} translate(${px} 0) scale(${r2(p.stretch)} 1) translate(${-px} 0)`,
    fn: limb('fn', p.fn + level + a * swing * walking),
    ff: limb('ff', p.ff + level + b * swing * walking),
    bn: limb('bn', p.bn + b * swing * walking),
    bf: limb('bf', p.bf + a * swing * walking),
    tail: rot(tail, JOINTS.tail),
    haunch: `translate(0 ${r2(-0.06 * p.bodyRot)})`,
    head: `translate(${r2(p.headX)} ${r2(p.headY + nod)}) ${rot(p.headRot + 1.4 * a * walking, JOINTS.head)}`,
    earL: rot(p.earL + m.ear + 4 * Math.sin(2 * m.phase) * walking, JOINTS.earL),
    earR: rot(p.earR - m.ear - 4 * Math.sin(2 * m.phase) * walking, JOINTS.earR),
    eyes: `translate(${r2(3.4 * m.gazeX)} ${r2(2.6 * m.gazeY)})`,
    blink: `translate(0 ${r2(PUP.eyeY * m.blink * 0.92)}) scale(1 ${r2(1 - 0.92 * m.blink)})`,
    openEyes: r2(Math.max(0, p.eyes - p.happy)),
    happyEyes: r2(Math.min(p.happy, p.eyes)),
    shutEyes: r2(1 - p.eyes),
    tongue: r2(p.tongue * (1 - p.mouth)),
    mouth: r2(p.mouth),
    backLegs: r2(1 - p.sit),
    haunchOpacity: r2(p.sit * (1 - p.front)),
    side: r2(1 - p.front),
    ledge: r2(p.front),
    shadow: `translate(${r2(0.6 * p.bodyX)} 0) scale(${r2(1 - 0.05 * bob * walking)} 1)`,
    shadowOpacity: r2(0.12 * (1 - p.front)),
  }
}

// [part, attribute, frame key] written by the rig each tick
export const BINDINGS = [
  ['shadow', 'transform', 'shadow'], ['shadow', 'opacity', 'shadowOpacity'], ['body', 'transform', 'body'], ['body', 'opacity', 'side'],
  ['bf', 'transform', 'bf'], ['bf', 'opacity', 'backLegs'], ['bn', 'transform', 'bn'], ['bn', 'opacity', 'backLegs'],
  ['ff', 'transform', 'ff'], ['fn', 'transform', 'fn'], ['tail', 'transform', 'tail'], ['haunch', 'transform', 'haunch'],
  ['haunch', 'opacity', 'haunchOpacity'], ['head', 'transform', 'head'], ['earL', 'transform', 'earL'], ['earR', 'transform', 'earR'],
  ['eyes', 'transform', 'eyes'], ['open', 'opacity', 'openEyes'], ['blink', 'transform', 'blink'], ['happy', 'opacity', 'happyEyes'],
  ['shut', 'opacity', 'shutEyes'], ['tongue', 'opacity', 'tongue'], ['mouth', 'opacity', 'mouth'], ['ledge', 'opacity', 'ledge'],
]

const C = COLORS
const line = { stroke: C.ink, strokeWidth: 3.4, strokeLinejoin: 'round', strokeLinecap: 'round' }
const stroke = { ...line, fill: 'none' }

function Leg({ part, f, opacity }) {
  const { w, len, fill } = LEGS[part]
  return (
    <g data-p={part} transform={f[part]} opacity={opacity}>
      <path d={leg(w, len)} fill={C[fill]} {...line} />
      <path d={fluff(0, len - 9, w * 0.62, 9, 7)} fill={C[fill]} {...line} />
      <path d={`M-4 ${len - 6} v4 M4 ${len - 6} v4`} {...stroke} strokeWidth={2.4} />
    </g>
  )
}

export function Mascot({ pose = 'sit', facing = 'right', className = '', style, svgRef }) {
  const f = rigFrame(typeof pose === 'string' ? POSES[pose] ?? POSES.sit : pose)
  const flip = facing === 'left' ? `translate(${PUP.W} 0) scale(-1 1)` : undefined
  const [ex1, ex2, ey] = [194, 230, PUP.eyeY]
  return (
    <svg ref={svgRef} viewBox={`0 0 ${PUP.W} ${PUP.H}`} className={className} style={{ overflow: 'visible', ...style }} aria-hidden focusable="false">
      <g data-p="root" transform={flip}>
        <ellipse data-p="shadow" cx="150" cy="230" rx="92" ry="7" fill={C.ink} opacity={f.shadowOpacity} transform={f.shadow} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <g data-p="body" transform={f.body} opacity={f.side}>
          <Leg part="bf" f={f} opacity={f.backLegs} />
          <Leg part="ff" f={f} />
          <g data-p="tail" transform={f.tail}>
            <path d="M86 152 Q76 146 72 132" {...stroke} strokeWidth={9} />
            <path d="M86 152 Q76 146 72 132" stroke={C.fur} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={ART.pom} fill={C.fur} {...line} />
          </g>
          <Leg part="bn" f={f} opacity={f.backLegs} />
          <path d={ART.body} fill={C.fur} {...line} />
          <path d={ART.chest} fill={C.fur} {...line} />
          <Leg part="fn" f={f} />
        </g>
        <g data-p="haunch" opacity={f.haunchOpacity} transform={f.haunch}>
          <path d={ART.haunch} fill={C.fur} {...line} />
          <path d="M108 228 Q108 214 124 214 L138 214 Q148 216 148 222 Q148 229 138 229 L114 229 Q108 229 108 228Z" fill={C.fur} {...line} />
          <path d="M132 222v5M139 222v5" {...stroke} strokeWidth={2.4} />
        </g>
        <g data-p="head" transform={f.head}>
          <path d="M180 142 Q212 158 244 142 L246 152 Q212 168 178 152Z" fill={C.collar} {...line} strokeWidth={3} />
          <circle cx="212" cy="164" r="6" fill={C.cream} {...line} strokeWidth={2.4} />
          <path data-p="earL" d={ART.earL} fill={C.shade} {...line} transform={f.earL} />
          <path data-p="earR" d={ART.earR} fill={C.shade} {...line} transform={f.earR} />
          <path d={ART.head} fill={C.fur} {...line} />
          <path d={ART.topknot} fill={C.fur} {...line} strokeWidth={3} />
          <ellipse cx="212" cy="124" rx="22" ry="15" fill={C.cream} />
          <circle cx="181" cy="116" r="7" fill={C.blush} opacity=".85" />
          <circle cx="243" cy="116" r="7" fill={C.blush} opacity=".85" />
          <g data-p="eyes" transform={f.eyes}>
            <g data-p="open" opacity={f.openEyes}>
              <g data-p="blink" transform={f.blink}>
                <ellipse cx={ex1} cy={ey} rx="7" ry="8.4" fill={C.ink} />
                <ellipse cx={ex2} cy={ey} rx="7" ry="8.4" fill={C.ink} />
                <circle cx={ex1 + 2.4} cy={ey - 3.2} r="2.6" fill="#fff" />
                <circle cx={ex2 + 2.4} cy={ey - 3.2} r="2.6" fill="#fff" />
              </g>
            </g>
          </g>
          <path data-p="happy" d={`M${ex1 - 7} 101 Q${ex1} 92 ${ex1 + 7} 101 M${ex2 - 7} 101 Q${ex2} 92 ${ex2 + 7} 101`} {...stroke} opacity={f.happyEyes} />
          <path data-p="shut" d={`M${ex1 - 7} 97 Q${ex1} 103 ${ex1 + 7} 97 M${ex2 - 7} 97 Q${ex2} 103 ${ex2 + 7} 97`} {...stroke} opacity={f.shutEyes} />
          <path d="M204 112 Q212 108 220 112 Q218 120 212 121 Q206 120 204 112Z" fill={C.ink} />
          <path d="M212 121 v4 M201 126 Q206 131 212 126 Q218 131 223 126" {...stroke} strokeWidth={3} />
          <path data-p="tongue" d="M207 129 Q212 127 217 129 Q218 139 212 140 Q206 139 207 129Z" fill={C.tongue} stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" opacity={f.tongue} />
          <g data-p="mouth" opacity={f.mouth}>
            <path d="M201 127 Q212 124 223 127 Q220 142 212 142 Q204 142 201 127Z" fill="#6b2a1c" {...line} strokeWidth={2.6} />
            <path d="M206 135 Q212 131 218 135 Q215 140 212 140 Q209 140 206 135Z" fill={C.tongue} />
          </g>
        </g>
        <g data-p="ledge" opacity={f.ledge}>
          <path d={ART.pawL + ART.pawR} fill={C.fur} {...line} />
          <path d="M176 154v5M184 154v5M236 154v5M244 154v5" {...stroke} strokeWidth={2.4} />
        </g>
      </g>
    </svg>
  )
}

export function Photo({ src, label, className = '' }) {
  if (src) return <img src={src} alt={label} className={`photo ${className}`} loading="lazy" />
  return (
    <div className={`photo photo--ph ${className}`} role="img" aria-label={label}>
      <Paw />
    </div>
  )
}

export function Paw({ size = 34, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill={color} aria-hidden>
      <ellipse cx="20" cy="27" rx="9" ry="7.5" />
      <circle cx="9" cy="17" r="4" /><circle cx="16" cy="10" r="4" />
      <circle cx="24" cy="10" r="4" /><circle cx="31" cy="17" r="4" />
    </svg>
  )
}

export function Skyline({ color = 'currentColor', className = '' }) {
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className={className} aria-hidden>
      <path fill={color} d="M0 120h35v-20h20v-24h30v44h20v-30h45v-30h30v60h40v-40h35v-30h25v70h50v-50h20v-60h25v110h45v-45h30v-20h40v65h55v-90l12-20 12 20v90h30v-40h40v-30h25v70h45v-50h30v-25h25v75h40v-35h35v20h30v-55h20v55h50v-30h30v20h25v-40h35v60h40v-25h45v35V160H0z" />
    </svg>
  )
}
