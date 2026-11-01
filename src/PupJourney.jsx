import { useEffect, useRef } from 'react'
import { Mascot, Paw, POSES, BOXES, BOX, PUP, JOINTS, MOTION, BINDINGS, rigFrame, mixPose } from './Art'
import './pup.css'

// Marker for where the dog rests. The static buddy inside only shows when the live dog is off (reduced motion)
export function Stop({ pose = 'sit', act, facing = 'right', behind = false, lane = false, className = '', style }) {
  return (
    <div className={`pup-stop ${className}`} style={style} data-pup-stop data-pose={pose} data-facing={facing}
      data-act={act || undefined} data-behind={behind || undefined} data-lane={lane || undefined}>
      <div className="pup-buddy" data-facing={facing}><Mascot pose={POSES[pose] ? pose : 'sit'} facing={facing} /></div>
    </div>
  )
}

export const cuePup = (detail) => dispatchEvent(new CustomEvent('pup:cue', { detail }))

const FEET = { x: 150, y: 228 } // actor anchor in viewBox units
const LANE_SINK = FEET.y - 159
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (t) => t * t * (3 - 2 * t)
const ramp = (a, b, v) => (b === a ? +(v >= b) : smooth(clamp01((v - a) / (b - a))))
const lerp = (a, b, t) => a + (b - a) * t
const ease = (dt, tau) => 1 - Math.exp(-dt / tau)
const softMax = (v, lo, k) => { const s = (v - lo) / k; return s > 20 ? v : lo + k * Math.log1p(Math.exp(s)) }
const softMin = (v, hi, k) => -softMax(-v, -hi, k)
const lerpBox = (a, b, t) => a.map((v, i) => lerp(v, b[i], t))
const bez = (p0, c1, c2, p1, t) => {
  const u = 1 - t
  return { x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x, y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y }
}
const boxOf = (pose) => BOXES[pose] ?? BOX
const BAND = [0.42, 0.78]
const BAND_LANE = [0.6, 0.86]
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const setData = (el, k, v) => el.dataset[k] !== v && (el.dataset[k] = v)

// Feet position of a stop at scroll y, following sticky pins
function anchorAt(stop, y) {
  const t = stop.track
  const top = t.kind === 'page' ? t.top - y : t.kind === 'screen' ? t.top : y < t.from ? t.top - (y - t.from) : y > t.to ? t.top - (y - t.to) : t.top
  return { x: stop.x + FEET.x * stop.s, y: top + FEET.y * stop.s }
}

// Which hold (k) we are in, or how far (t) along the blend from k to k+1
function locate(holds, y) {
  if (!holds.length || y <= holds[0][1]) return { k: 0, t: 0 }
  for (let k = 0; k < holds.length - 1; k++) {
    const end = holds[k][1]
    const next = holds[k + 1][0]
    if (y < next) return { k, t: clamp01((y - end) / Math.max(1, next - end)) }
    if (y <= holds[k + 1][1]) return { k: k + 1, t: 0 }
  }
  return { k: holds.length - 1, t: 0 }
}

// Keep the pose's box inside the safe area, softly
function keepIn(x, y, s, box, safe, k = 8) {
  const l = (FEET.x - box[0]) * s, r = (box[2] - FEET.x) * s, t = (FEET.y - box[1]) * s, b = (box[3] - FEET.y) * s
  return {
    x: safe.right - safe.left > l + r ? softMin(softMax(x, safe.left + l, k), safe.right - r, k) : (safe.left + safe.right) / 2 - (r - l) / 2,
    y: safe.bottom - safe.top > t + b ? softMin(softMax(y, safe.top + t, k), safe.bottom - b, k) : safe.bottom - b,
  }
}

function stickyParent(el) {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).position === 'sticky') return p
  return null
}

function trackOf(el, rect) {
  const pin = stickyParent(el)
  if (!pin) return { kind: 'page', top: rect.top + scrollY }
  const stickTop = parseFloat(getComputedStyle(pin).top) || 0
  const inner = rect.top - pin.getBoundingClientRect().top
  const prev = pin.style.position
  pin.style.position = 'relative'
  const pr = pin.getBoundingClientRect()
  const host = pin.parentElement
  const bottom = host.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(host).paddingBottom) || 0)
  pin.style.position = prev
  const from = pr.top + scrollY - stickTop
  const to = bottom + scrollY - pr.height - stickTop
  return to <= from ? { kind: 'page', top: pr.top + scrollY + inner } : { kind: 'pin', top: stickTop + inner, from, to }
}

// Scroll windows where the dog sits still; blends need room between them
function fitHolds(raw, gaps, maxY) {
  const gap = (i) => (typeof gaps === 'number' ? gaps : gaps[i] ?? 0)
  const h = raw.map(([a, b]) => (a <= b ? [a, b] : [(a + b) / 2, (a + b) / 2]))
  if (!h.length) return h
  h[0][0] = -Infinity
  const last = h[h.length - 1]
  last[1] = Infinity
  last[0] = Math.min(last[0], maxY - 1)
  for (let i = 0; i < h.length - 1; i++) {
    const a = h[i], b = h[i + 1]
    if (b[0] < a[1]) {
      const mid = (a[1] + b[0]) / 2
      a[1] = Math.max(a[0], mid)
      b[0] = Math.min(b[1], mid)
      if (b[0] < a[1]) b[0] = a[1]
    }
    let need = gap(i) - (b[0] - a[1])
    if (need > 0) {
      const ta = Math.min(need / 2, a[1] - a[0]), tb = Math.min(need / 2, b[1] - b[0])
      a[1] -= ta
      b[0] += tb
      need -= ta + tb
      const more = Math.min(need, b[1] - b[0])
      b[0] += more
      need -= more
      if (need > 0) a[1] -= Math.min(need, a[1] - a[0])
    }
  }
  for (const w of h) if (w[1] < w[0]) w[1] = w[0]
  return h
}

function measure(probe) {
  const lane = matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)').matches
  const vw = document.documentElement.clientWidth
  const vh = probe.getBoundingClientRect().height || innerHeight
  const header = document.getElementById('site-header')?.offsetHeight ?? 76
  const bar = document.querySelector('[data-whatsapp-bar]')
  const safe = { left: 10, top: header + 10, right: vw - 10, bottom: vh - 10 - (bar?.getClientRects().length ? bar.getBoundingClientRect().height : 0) }
  const main = document.getElementById('main')
  const stops = [], meta = [], raw = []

  const add = (el) => {
    const r = el.getBoundingClientRect()
    const pose = el.dataset.pose || 'sit'
    const act = el.dataset.act ?? ''
    const base = r.width / 300
    const s = act === 'basket' || lane ? base : 1.12 * base
    const foot = pose === 'peek' ? { x: FEET.x, y: 159 } : FEET
    const track = trackOf(el, r)
    if (track.kind !== 'screen') track.top += foot.y * (base - s)
    const stop = { x: r.left + foot.x * (base - s), track, s, behind: el.dataset.behind === 'true', sink: 0, box: boxOf(pose) }
    const scene = el.closest('[data-pup-scene]')
    stops.push(stop)
    meta.push({
      scene, pose, act, facing: el.dataset.facing === 'left' ? -1 : 1,
      looks: scene ? [...scene.querySelectorAll('[data-pup-look]')] : [],
      track: act === 'treadmill' ? scene?.querySelector('[data-treadmill]') ?? null : null,
    })
    let hold
    if (track.kind === 'pin') hold = [track.from, track.to]
    else {
      const band = lane ? BAND_LANE : BAND
      const top = track.top + stop.box[1] * s, bot = track.top + stop.box[3] * s, mid = (top + bot) / 2, H = safe.bottom - safe.top
      let a = mid - (safe.top + band[1] * H), b = mid - (safe.top + band[0] * H)
      a = Math.max(a, bot - safe.bottom)
      b = Math.min(b, top - safe.top)
      if (a > b) a = b = mid - (safe.top + H / 2)
      hold = [a, b]
    }
    // leave a stop before its scene scrolls off the top
    if (!lane && scene && track.kind === 'page' && act !== 'basket' && act !== 'peekaboo') {
      const H = safe.bottom - safe.top
      const sceneTop = scene.getBoundingClientRect().top + scrollY - safe.top + 0.08 * H
      const floor = track.top + stop.box[3] * s - safe.bottom
      if (hold[1] > sceneTop) {
        const end = Math.max(sceneTop, floor + 0.12 * H)
        hold = [Math.max(floor, end - Math.max(hold[1] - hold[0], 0.2 * H)), end]
      }
    }
    raw.push(hold)
  }

  const els = [...document.querySelectorAll('[data-pup-stop]')].filter((e) => e.getClientRects().length)
  if (lane) {
    const lanes = els.filter((e) => e.dataset.lane === 'true')
    const first = lanes[0], last = lanes.length > 1 ? lanes[lanes.length - 1] : undefined
    if (first) add(first)
    const skip = meta[0]?.scene ?? null
    const scenes = [...document.querySelectorAll('#main [data-pup-scene]')].filter((e) => e !== skip && e.getClientRects().length)
    const s = Math.min(0.62, Math.max(0.5, vw / 650))
    const box = boxOf('peek')
    scenes.forEach((scene, i) => {
      const left = i % 2 === 0
      stops.push({ x: left ? safe.left + 2 - box[0] * s : safe.right - 2 - box[2] * s, track: { kind: 'screen', top: 0 }, s, behind: false, sink: LANE_SINK, box })
      meta.push({ scene, pose: 'peek', facing: left ? 1 : -1, act: 'lane', looks: [], track: null })
      const r = scene.getBoundingClientRect()
      const a = r.top + scrollY - 0.42 * vh, b = r.bottom + scrollY - 0.58 * vh
      raw.push(a <= b ? [a, b] : [(a + b) / 2, (a + b) / 2])
    })
    if (last) add(last)
  } else els.forEach(add)

  const gaps = stops.slice(1).map((b, i) => {
    const a = stops[i]
    const minG = (lane ? 0.32 : 0.5) * vh
    return Math.min(1.4 * vh, Math.max(minG, 1.15 * Math.hypot(Math.abs(b.x + FEET.x * b.s - (a.x + FEET.x * a.s)), (BAND[1] - BAND[0]) * vh)))
  })
  return {
    lane, stops, meta,
    holds: fitHolds(raw, gaps, document.documentElement.scrollHeight - innerHeight),
    blend: 0.12 * vh,
    mainTop: main ? main.getBoundingClientRect().top + scrollY : 0,
  }
}

// Position, scale and state of the dog at scroll y
function place(stops, holds, y, safe, blend) {
  const { k, t: tRaw } = locate(holds, y)
  if (tRaw <= 0 || k >= stops.length - 1) {
    const st = stops[k], p = anchorAt(st, y), q = keepIn(p.x, p.y, st.s, st.box, safe)
    return { x: q.x, y: q.y, s: st.s, front: !st.behind, airborne: false, k, t: 0, walked: 0 }
  }
  const a = stops[k], b = stops[k + 1]
  const y0 = holds[k][1], y1 = holds[k + 1][0], span = Math.max(1, y1 - y0)
  const t = clamp01((y - y0) / span)
  const pa = anchorAt(a, y0), pb = anchorAt(b, y1)
  const p0 = { x: pa.x, y: pa.y - a.sink * a.s }, p1 = { x: pb.x, y: pb.y - b.sink * b.s }
  // curve: horizontal handles; swing out sideways when the stops line up vertically
  const dx = p1.x - p0.x, W = safe.right - safe.left, reach = 0.45 * Math.abs(dx), dir = dx >= 0 ? 1 : -1
  let c1 = { x: p0.x + dir * reach, y: p0.y }, c2 = { x: p1.x - dir * reach, y: p1.y }
  const minSpread = 0.14 * W
  if (Math.abs(dx) < minSpread) {
    const push = ((p0.x + p1.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1) * (minSpread - Math.abs(dx)) * 0.9
    c1 = { x: c1.x + push, y: lerp(p0.y, p1.y, 0.2) }
    c2 = { x: c2.x + push, y: lerp(p0.y, p1.y, 0.8) }
  }
  const inSafe = (p) => ({ x: Math.min(safe.right, Math.max(safe.left, p.x)), y: Math.min(safe.bottom, Math.max(safe.top, p.y)) })
  const curve = { p0, c1: inSafe(c1), c2: inSafe(c2), p1 }
  const e = t * t * t * (t * (6 * t - 15) + 10)
  const pt = bez(curve.p0, curve.c1, curve.c2, curve.p1, e)
  const s = lerp(a.s, b.s, smooth(clamp01(t / 0.65)))
  // near each end, keep following the stop if it is still moving (pinned tracks)
  const edge = Math.min(0.3, Math.max(0.06, blend / span))
  const keepA = 1 - ramp(0, edge, t), keepB = ramp(1 - edge, 1, t)
  let y2 = pt.y + keepA * (anchorAt(a, y).y - pa.y) + keepB * (anchorAt(b, y).y - pb.y)
  y2 += a.sink * a.s * (1 - ramp(0, 0.22, t)) + b.sink * b.s * ramp(0.78, 1, t)
  let airborne = false
  if (a.behind && t < 0.36) { y2 -= Math.sin((t / 0.36) * Math.PI) * Math.min(64 * a.s, 72); airborne = t < 0.32 }
  if (b.behind && t > 0.68) { y2 -= Math.sin(((t - 0.68) / 0.32) * Math.PI) * Math.min(56 * b.s, 60); airborne = true }
  if (a.sink && t < 0.2) airborne = true
  const front = !((a.behind && t < 0.12) || (b.behind && t > 0.92))
  const box = t < 0.5 ? lerpBox(a.box, BOX, ramp(0, a.sink ? 0.22 : a.behind ? 0.36 : 0.06, t)) : lerpBox(BOX, b.box, ramp(b.sink ? 0.78 : b.behind ? 0.68 : 0.94, 1, t))
  const q = keepIn(pt.x, y2, s, box, safe)
  let walked = 0, prev = curve.p0
  const n = Math.max(1, Math.ceil(32 * e))
  for (let i = 1; i <= n; i++) { const c = bez(curve.p0, curve.c1, curve.c2, curve.p1, (i / n) * e); walked += Math.hypot(c.x - prev.x, c.y - prev.y); prev = c }
  return { x: q.x, y: q.y, s, front, airborne, k, t, walked }
}

// While idle mid-blend, snap the "behind" hop so the dog never hangs half out of hiding
function settleScroll(stops, holds, y) {
  const { k, t } = locate(holds, y)
  if (t <= 0 || k >= stops.length - 1) return y
  const a = stops[k], b = stops[k + 1]
  const lo = a.sink ? 0.22 : 0.36 * !!a.behind, hi = b.sink ? 0.78 : b.behind ? 0.68 : 1
  let d = t
  if (t < lo) d = t < lo / 2 ? 0 : lo
  else if (t > hi) d = t > (1 + hi) / 2 ? 1 : hi
  return d === t ? y : holds[k][1] + d * (holds[k + 1][0] - holds[k][1])
}

// Live rig: eases pose, facing, stride, wag, gaze, ears and bounce, and writes only changed attributes
class Rig {
  constructor(svg, pose = 'sit', facing = 1) {
    this.svg = svg
    this.els = new Map()
    svg.querySelectorAll('[data-p]').forEach((el) => this.els.set(el.dataset.p, el))
    this.written = new Map()
    this.m = { ...MOTION }
    Object.assign(this, { strideTarget: 0, wagTarget: 0.35, gazeTarget: { x: 0, y: 0 }, tilt: 0, tiltTarget: 0, earV: 0, nextBlink: 1.2, blinkAt: -1, woofUntil: 0, bounce: 0, bounceV: 0, offset: 0, offsetTarget: 0, pet: 0, petTarget: 0, turn: 0.07 })
    this.pose = { ...POSES[pose] }
    this.target = this.pose
    this.facing = this.facingTarget = facing
  }
  setPose(p) { this.target = typeof p === 'string' ? POSES[p] ?? POSES.sit : p }
  face(dir, turn = 0.07) { this.facingTarget = dir; this.turn = turn }
  get facingDir() { return this.facingTarget }
  stride(v) { this.strideTarget = clamp01(v) }
  advance(px) { this.m.phase += (px / 46) * Math.PI }
  walkedTo(px) { this.m.phase = (px / 46) * Math.PI }
  wag(v) { this.wagTarget = clamp01(v) }
  cock(deg) { this.tiltTarget = deg }
  lookAt(pt) {
    if (!pt) { this.gazeTarget = { x: 0, y: 0 }; return }
    const r = this.svg.getBoundingClientRect()
    const hx = this.facingTarget > 0 ? JOINTS.head[0] : PUP.W - JOINTS.head[0]
    const dx = pt.x - (r.left + (hx / PUP.W) * r.width), dy = pt.y - (r.top + (PUP.eyeY / PUP.H) * r.height)
    const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 160)
    this.gazeTarget = { x: (dx / d) * k * this.facingTarget, y: (dy / d) * k }
  }
  woof(now) { this.woofUntil = now + 0.34; this.bounceV = -150; this.earV += 260 }
  jolt(v = 1) { this.earV += 220 * v }
  hop(v = 1) { this.bounceV = -230 * v; this.earV += 200 * v }
  yawn(now, secs = 0.9) { this.woofUntil = now + secs }
  dash(px) { this.offsetTarget = px }
  petting(on) { this.petTarget = +!!on }
  reset() { this.offsetTarget = 0; this.tiltTarget = 0; this.petTarget = 0 }
  tick(dt, now) {
    dt = Math.min(dt, 0.05)
    const m = this.m
    m.time = now
    this.pose = mixPose(this.pose, this.target, ease(dt, 0.16))
    this.facing += (this.facingTarget - this.facing) * ease(dt, this.turn)
    m.stride += (this.strideTarget - m.stride) * ease(dt, 0.12)
    if (m.stride < 0.012 && this.strideTarget === 0) m.stride = 0
    m.wag += (this.wagTarget - m.wag) * ease(dt, 0.4)
    m.gazeX += (this.gazeTarget.x - m.gazeX) * ease(dt, 0.07)
    m.gazeY += (this.gazeTarget.y - m.gazeY) * ease(dt, 0.07)
    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * ease(dt, 0.18)
    this.earV += (-150 * m.ear - 10 * this.earV) * dt
    m.ear = Math.max(-28, Math.min(28, m.ear + this.earV * dt))
    this.bounceV += (-260 * this.bounce - 16 * this.bounceV) * dt
    this.bounce += this.bounceV * dt
    const before = this.offset
    this.offset += (this.offsetTarget - this.offset) * ease(dt, 0.2)
    if (Math.abs(this.offsetTarget - this.offset) < 0.05) this.offset = this.offsetTarget
    const moved = Math.abs(this.offset - before)
    if (moved) this.advance(moved)
    const dashStride = dt > 0 ? Math.min(1, moved / dt / 180) : 0
    this.pet += (this.petTarget - this.pet) * ease(dt, 0.15)
    if (now > this.nextBlink && this.pose.eyes > 0.6) {
      this.blinkAt = now
      this.nextBlink = now + 2.2 + 3.8 * Math.random()
      if (Math.random() < 0.18) this.nextBlink = now + 0.32
    }
    const bt = (now - this.blinkAt) / 0.15
    m.blink = bt >= 0 && bt <= 1 ? Math.sin(bt * Math.PI) : 0
    const p = { ...this.pose, headRot: this.pose.headRot + this.tilt, bodyY: this.pose.bodyY + this.bounce, headY: this.pose.headY + 1.15 * this.bounce, mouth: now < this.woofUntil ? 1 : this.pose.mouth, happy: Math.max(this.pose.happy, this.pet) }
    const f = rigFrame(p, dashStride > m.stride ? { ...m, stride: dashStride } : m)
    const sx = Math.abs(this.facing) < 0.02 ? 0.02 * Math.sign(this.facing || 1) : this.facing
    f.root = `translate(${this.offset.toFixed(1)} 0) translate(${PUP.W / 2} 0) scale(${sx.toFixed(3)} 1) translate(${-PUP.W / 2} 0)`
    for (const [part, attr, key] of [['root', 'transform', 'root'], ...BINDINGS]) {
      const el = this.els.get(part)
      if (!el) continue
      const v = String(f[key]), id = part + ':' + attr
      if (this.written.get(id) !== v) { el.setAttribute(attr, v); this.written.set(id, v) }
    }
  }
}

// Little timed routines: lists of [time, fn(now)]
const other = (d) => (d === 1 ? -1 : 1)
const ACTS = {
  woof: ({ d, say }, t) => [[t, (n) => (d.woof(n), say('woof!'))], [t + 0.42, (n) => (d.woof(n), say('woof woof!'))]],
  spin: ({ d, rest, facing, say }, t) => [[t, () => (d.setPose('stand'), d.hop(0.5))], [t + 0.14, () => d.face(other(facing))], [t + 0.38, () => d.face(facing)], [t + 0.62, () => d.face(other(facing))], [t + 0.86, () => (d.face(facing), say('wheee!'))], [t + 1.3, () => d.setPose(rest)]],
  beg: ({ d, rest, say }, t) => [[t, () => (d.setPose('beg'), d.wag(1), say('treat, please?', 1.7))], [t + 1.9, () => (d.setPose(rest), d.wag(0.7))]],
  bow: ({ d, rest, say }, t) => [[t, () => (d.setPose('bow'), d.wag(1), say('play with me!'))], [t + 0.55, () => d.hop(0.45)], [t + 1.7, () => (d.setPose(rest), d.wag(0.7))]],
  hop: ({ d, rest, say }, t) => [[t, () => (d.setPose('hop'), d.hop(1.1), say('boing!'))], [t + 0.36, () => d.setPose(rest)], [t + 0.62, () => (d.setPose('hop'), d.hop(0.8))], [t + 0.98, () => d.setPose(rest)]],
  love: ({ d, rest, say, hearts }, t) => [[t, () => (d.setPose({ ...rest, happy: 1, tongue: 1 }), d.wag(1), hearts(), say('I like you!', 1.5))], [t + 1.9, () => (d.setPose(rest), d.wag(0.7))]],
  tilt: ({ d, say }, t) => [[t, () => (d.cock(-14), say('hm?'))], [t + 0.8, () => d.cock(12)], [t + 1.6, () => d.cock(0)]],
  sneeze: ({ d, say }, t) => [[t, () => d.cock(-8)], [t + 0.32, (n) => (d.cock(10), d.jolt(1.4), d.hop(0.35), d.yawn(n, 0.22), say('achoo!'))], [t + 0.8, () => d.cock(0)]],
  peekaboo: ({ d, say }, t) => [[t, () => d.setPose({ ...POSES.peek, headY: 120 })], [t + 0.55, () => (d.setPose('peek'), d.jolt(1.2), say('peekaboo!'))]],
}
const PLAY = ['woof', 'spin', 'beg', 'bow', 'hop', 'love', 'tilt', 'sneeze']
let deck = []
const nextPlay = (last, clicks) => (clicks >= 4 ? 'spin' : (deck.length || (deck = PLAY.filter((a) => a !== last).sort(() => Math.random() - 0.5)), deck.pop()))
const pick = (list, not) => { const l = list.filter((x) => x !== not); return l[Math.floor(Math.random() * l.length)] }

function hearts(layer, x, y) {
  for (let i = 0; i < 5; i++) {
    const h = document.createElement('span')
    h.className = 'pup-heart'
    h.textContent = '♥'
    h.style.left = `${x}px`
    h.style.top = `${y}px`
    layer.append(h)
    const dx = (Math.random() - 0.5) * 90, dy = -70 - 60 * Math.random()
    h.animate([{ transform: 'translate(-50%, 0) scale(.4)', opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translate(calc(-50% + ${dx.toFixed(0)}px), ${dy.toFixed(0)}px) scale(1.1)`, opacity: 0 }],
      { duration: 1150 + 110 * i, delay: 80 * i, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' }).finished.then(() => h.remove(), () => h.remove())
  }
}

export default function PupJourney() {
  const layerRef = useRef(null), actorRef = useRef(null), bodyRef = useRef(null), bubbleRef = useRef(null), bubbleAtRef = useRef(null), printsRef = useRef(null), probeRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current, actor = actorRef.current, body = bodyRef.current, bubble = bubbleRef.current, bubbleAt = bubbleAtRef.current, probe = probeRef.current
    const svg = body.querySelector('svg'), html = document.documentElement, header = document.getElementById('site-header')
    const prints = [...printsRef.current.children]
    let world = null, dog = null, live = false, raf = 0, resizeT = 0
    let printN = 0, bubbleUntil = 0, look = null, pointer = null
    let last = performance.now() / 1e3, lastY = scrollY, prev = null, cur = null
    const kick = { x: 0, y: 0, s: 0 }
    let still = 0, holdK = -1, holdAt = 0, quietAt = 0, queue = [], lookAt = 0, lookI = -1, trackX = null, trackIdle = 0
    let printK = -1, printStep = 0, scrolledAt = last, scrollDir = 1, settled = false, laneFollow = null, laneBase = 0, laneWalked = 0, layerTop = 0, basketAt = 0
    let clicks = 0, clickAt = 0, lastPlay = null

    const say = (text, now, secs = 1.4) => { bubble.textContent = text; bubble.dataset.show = 'true'; bubbleUntil = now + secs }
    const barTop = () => { const b = document.querySelector('[data-whatsapp-bar]'); const r = b?.getClientRects().length ? b.getBoundingClientRect() : null; return r && r.height ? r.top : innerHeight - 6 }
    const safeArea = (w) => {
      const vw = html.clientWidth, top = (header?.offsetHeight ?? 76) + 10
      if (w.lane) return { left: 10, top, right: vw - 10, bottom: barTop() + 40 }
      const b = document.querySelector('[data-whatsapp-bar]')
      const bt = b?.getClientRects().length ? b.getBoundingClientRect().top : innerHeight
      return { left: 10, top, right: vw - 10, bottom: Math.min(innerHeight, bt) - 10 }
    }
    const at = (w, y) => {
      if (w.lane) { const t = barTop(); for (const s of w.stops) if (s.track.kind === 'screen') s.track.top = t - 159 * s.s }
      return place(w.stops, w.holds, y, safeArea(w), w.blend)
    }
    const ctx = (m) => ({
      d: dog, rest: POSES[m.pose] ?? POSES.sit, facing: m.facing,
      say: (text, secs) => say(text, performance.now() / 1e3, secs),
      hearts: () => cur && hearts(layer, cur.x - FEET.x * cur.s + (dog.facingDir > 0 ? 212 : PUP.W - 212) * cur.s, cur.y - (FEET.y - 40) * cur.s - layerTop),
    })

    const onPointer = (e) => { if (e.pointerType === 'mouse') pointer = { x: e.clientX, y: e.clientY, t: performance.now() / 1e3 } }
    const onCue = (e) => {
      const d = e.detail, scene = holdK >= 0 ? world?.meta[holdK]?.scene : null
      if (!scene || (d.look && !scene.contains(d.look))) return
      const now = performance.now() / 1e3
      if (d.look) look = { el: d.look, until: now + (d.secs ?? 1.6) }
      if (d.say) say(d.say, now)
    }
    const onFocus = (e) => { const t = e.target; if (t instanceof HTMLElement && t.matches('a, button, input, textarea, select, summary')) look = { el: t, until: performance.now() / 1e3 + 1.4 } }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!world || !dog) return
      const now = performance.now() / 1e3, dt = Math.min(0.05, now - last)
      last = now
      const y = scrollY, dy = y - lastY
      lastY = y
      if (Math.abs(dy) > 0.5) { scrolledAt = now; scrollDir = dy > 0 ? 1 : -1 }
      while (queue.length && queue[0][0] <= now) queue.shift()[1](now)

      const eff = now - scrolledAt > 0.25 ? settleScroll(world.stops, world.holds, y) : y
      const v = at(world, eff)
      const a0 = world.stops[v.k], a1 = v.t > 0 ? world.stops[v.k + 1] : a0
      const inLane = world.lane && a0.track.kind === 'screen' && a1?.track.kind === 'screen'
      const decay = Math.exp(-dt / 0.28)
      kick.x *= decay; kick.y *= decay; kick.s *= decay
      if (Math.abs(kick.x) < 0.05 && Math.abs(kick.y) < 0.05) kick.x = kick.y = 0
      const snapped = eff !== y
      if (snapped !== settled && prev && !inLane) { kick.x = prev.x - v.x; kick.y = prev.y - v.y }
      settled = snapped
      const s = v.s + kick.s
      let x = v.x + kick.x, yy = v.y + kick.y, arrived = true
      const base = world.lane ? barTop() : 0
      if (inLane) {
        laneFollow ??= prev ? { x: prev.x, y: prev.y - laneBase } : { x, y: yy - base }
        const k = 1 - Math.exp(-dt / 0.14)
        laneFollow.x += (x - laneFollow.x) * k
        laneFollow.y += (yy - base - laneFollow.y) * k
        arrived = Math.hypot(x - laneFollow.x, yy - base - laneFollow.y) < 1.5
        x = laneFollow.x
        yy = base + laneFollow.y
      } else if (laneFollow) {
        kick.x = (prev?.x ?? x) - v.x; kick.y = (prev?.y ?? yy) - v.y
        x = v.x + kick.x; yy = v.y + kick.y
        laneFollow = null
      }
      laneBase = base
      cur = { ...v, x, y: yy, s }
      setData(layer, 'anchor', inLane ? 'bottom' : 'top')
      layerTop = inLane ? layer.getBoundingClientRect().top : 0

      const holding = v.t === 0 && arrived, k = v.k
      if (holding) {
        const m = world.meta[k]
        if (holdK !== k) {
          queue = []; look = null; holdK = k; holdAt = quietAt = now; trackX = null
          dog.reset(); dog.setPose(m.pose); dog.face(m.facing, 0.14); dog.stride(0)
          dog.wag(m.act === 'basket' ? 0.3 : 0.7); dog.jolt(0.4)
          basketAt = now + 2.4
        }
        if (m.track && !queue.length) {
          const left = m.track.getBoundingClientRect().left, moved = trackX === null ? 0 : left - trackX
          trackX = left
          dog.walkedTo(-left / s)
          if (Math.abs(moved) > 0.15) { trackIdle = 0; dog.setPose('walk'); dog.stride(1); dog.face(moved < 0 ? 1 : -1, 0.16) }
          else if ((trackIdle += dt) > 0.25) { dog.setPose('stand'); dog.stride(0) }
        }
        if (m.act === 'tilt' && !queue.length && now - holdAt > 1.2) { const w = Math.sin(0.9 * now); dog.cock(w > 0.35 ? 13 : w < -0.35 ? -10 : 0) }
        if (m.act === 'basket' && !queue.length && now > basketAt) { basketAt = now + 4.5 + 3 * Math.random(); Math.random() < 0.7 ? dog.jolt(0.55) : dog.yawn(now, 0.7) }
        const busy = (look && look.until > now) || (pointer && now - pointer.t < 2.5)
        if (m.looks.length && !busy && now - holdAt > 0.8 && now - lookAt > 1.7) {
          lookAt = now
          lookI = (lookI + 1) % (m.looks.length + 1)
          if (lookI < m.looks.length) look = { el: m.looks[lookI], until: now + 1.4 }
        }
        if (Math.abs(dy) > 0.5) quietAt = now
        if (!queue.length && !m.track && m.act !== 'basket' && now - quietAt > 9) {
          quietAt = now
          queue = Math.random() < 0.55 ? ACTS.tilt(ctx(m), now) : [[now, () => dog.wag(1)], [now + 2.4, () => dog.wag(0.7)]]
        }
      } else {
        if (holdK !== -1) { holdK = -1; queue = []; dog.reset() }
        const moved = prev ? Math.hypot(x - prev.x, yy - prev.y) : 0
        still = moved > 0.25 ? 0 : still + dt
        let air = v.airborne
        if (world.lane && v.t > 0) {
          const sa = world.stops[k], sb = world.stops[k + 1]
          if (sa.sink && v.t < 0.22) air = scrollDir > 0
          else if (sb?.sink && v.t > 0.78) air = scrollDir < 0
        }
        if (air) { dog.setPose('hop'); dog.stride(0) }
        else if (still > 0.3) { dog.setPose('stand'); dog.stride(0); if (still > 2.6 && still - dt <= 2.6) say('coming?', now) }
        else { dog.setPose('walk'); dog.stride(1) }
        dog.walkedTo((inLane ? (laneWalked += moved) : v.walked) / Math.max(0.05, s))
        if (prev) { const ddx = x - prev.x; if (Math.abs(ddx) > 0.6 && Math.abs(ddx) > 0.35 * Math.abs(yy - prev.y)) dog.face(ddx > 0 ? 1 : -1, 0.16) }
        if (!world.lane) {
          const step = Math.floor(v.walked / (34 * s))
          if (printK === k && step !== printStep && !v.airborne && prev) {
            const odd = step & 1, footX = odd ? 186 : 110
            const left = x - FEET.x * s, top = yy - FEET.y * s
            const px = left + (dog.facingDir > 0 ? footX : PUP.W - footX) * s
            const py = top + 226 * s + y - world.mainTop + (odd ? -4 : 4) * s
            const ang = Math.atan2(yy - prev.y + dy, x - prev.x) + Math.PI / 2
            const size = 14 * Math.max(0.75, 1.5 * s)
            const el = prints[printN++ % prints.length]
            el.style.transform = `translate(${(px - size / 2).toFixed(1)}px, ${(py - size / 2).toFixed(1)}px) rotate(${ang.toFixed(3)}rad)`
            el.style.width = el.style.height = `${size.toFixed(1)}px`
            el.animate([{ opacity: 0 }, { opacity: 0.45, offset: 0.08 }, { opacity: 0.45, offset: 0.5 }, { opacity: 0 }], { duration: 2600, easing: 'ease-out' })
          }
          printK = k
          printStep = step
        }
      }
      prev = { x, y: yy }

      if (look && look.until > now) { const r = look.el.getBoundingClientRect(); dog.lookAt({ x: r.left + r.width / 2, y: r.top + r.height / 2 }) }
      else dog.lookAt(pointer && now - pointer.t < 2.5 ? pointer : null)

      actor.style.transform = `translate3d(${(x - FEET.x * s).toFixed(2)}px, ${(yy - FEET.y * s - layerTop).toFixed(2)}px, 0)`
      body.style.transform = `scale(${s.toFixed(4)})`
      setData(layer, 'front', String(v.front))
      setData(actor, 'holding', String(holding))
      if (bubble.dataset.show === 'true') {
        if (now > bubbleUntil) bubble.dataset.show = 'false'
        bubbleAt.style.transform = `translate(${((dog.facingDir > 0 ? 214 : PUP.W - 214) * s).toFixed(1)}px, ${(30 * s).toFixed(1)}px)`
      }
      dog.tick(dt, now)
    }

    const onClick = () => {
      if (!dog || !world) return
      const now = performance.now() / 1e3
      clicks = now - clickAt < 0.7 ? clicks + 1 : 1
      clickAt = quietAt = now
      if (holdK < 0) {
        const c = ctx(world.meta[Math.max(0, cur?.k ?? 0)])
        const a = pick(['jump', 'woof', 'love', 'sneeze'], lastPlay)
        lastPlay = a
        queue = a === 'jump' ? [[now, () => (dog.hop(1.35), c.say(pick(['wheee!', 'boing!', 'yip!'])))], [now + 0.5, () => dog.hop(0.7)]]
          : a === 'woof' ? [[now, (n) => (dog.woof(n), c.say('woof!'))], [now + 0.4, (n) => dog.woof(n)]]
          : a === 'love' ? [[now, () => (dog.wag(1), dog.hop(0.5), c.hearts(), c.say('I like you!'))]]
          : [[now, (n) => (dog.jolt(1.4), dog.hop(0.4), dog.yawn(n, 0.22), c.say('achoo!'))]]
        return
      }
      const m = world.meta[holdK]
      const a = m.track ? pick(['woof', 'hop', 'love'], lastPlay) : m.act === 'basket' ? pick(['tilt', 'love', 'sneeze', 'woof'], lastPlay) : m.pose === 'peek' ? pick(['peekaboo', 'woof', 'tilt', 'sneeze'], lastPlay) : nextPlay(lastPlay, clicks)
      if (a === 'peekaboo' && queue.length) return
      lastPlay = a
      dog.reset()
      queue = ACTS[a](ctx(m), now)
    }
    const onEnter = (e) => { if (e.pointerType === 'mouse' && dog && holdK >= 0) { dog.petting(true); dog.wag(1) } }
    const onLeave = () => { if (dog) { dog.petting(false); if (holdK >= 0) dog.wag(world?.meta[holdK]?.act === 'basket' ? 0.3 : 0.7) } }

    const start = () => {
      if (live || reduced()) return
      const w = measure(probe)
      if (w.stops.length < 2) return
      world = w
      live = true
      html.dataset.pup = w.lane ? 'lane' : 'live'
      layer.hidden = false
      const m0 = w.meta[0]
      dog = new Rig(svg, m0.pose, m0.facing)
      lastY = scrollY; prev = null; last = scrolledAt = performance.now() / 1e3; settled = false; laneFollow = null
      const now = last, v = at(w, scrollY)
      if (v.k === 0 && v.t === 0 && m0.act === 'peekaboo') {
        holdK = 0; holdAt = now
        const friends = m0.scene?.querySelectorAll('[data-pup-friend]') ?? []
        const f0 = friends[0], f1 = friends[friends.length - 1]
        queue = [[now + 0.1, () => dog.setPose({ ...POSES.peek, headY: 120 })], [now + 0.7, (n) => (dog.setPose('peek'), dog.jolt(1.2), say('peekaboo!', n, 1.6))],
          [now + 1.5, (n) => f0 && (look = { el: f0, until: n + 0.8 })], [now + 2.3, (n) => f1 && (look = { el: f1, until: n + 0.8 })], [now + 3.1, () => ((look = null), dog.wag(1))]]
      } else holdK = -1
      addEventListener('pointermove', onPointer, { passive: true })
      addEventListener('pup:cue', onCue)
      addEventListener('focusin', onFocus)
      actor.addEventListener('click', onClick)
      actor.addEventListener('pointerenter', onEnter)
      actor.addEventListener('pointerleave', onLeave)
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (!live) return
      live = false
      cancelAnimationFrame(raf)
      delete html.dataset.pup
      layer.hidden = true
      delete layer.dataset.anchor
      layerTop = 0; world = null; dog = null; holdK = -1
      removeEventListener('pointermove', onPointer)
      removeEventListener('pup:cue', onCue)
      removeEventListener('focusin', onFocus)
      actor.removeEventListener('click', onClick)
      actor.removeEventListener('pointerenter', onEnter)
      actor.removeEventListener('pointerleave', onLeave)
    }
    const remeasure = () => {
      clearTimeout(resizeT)
      resizeT = setTimeout(() => {
        if (!live) return start()
        const w = measure(probe)
        if (w.stops.length < 2) return stop()
        const laneChanged = w.lane !== world.lane
        world = w
        html.dataset.pup = w.lane ? 'lane' : 'live'
        if (laneChanged) holdK = -1
        if (cur) { const v = at(w, scrollY); kick.x = cur.x - v.x; kick.y = cur.y - v.y; kick.s = cur.s - v.s }
      }, 120)
    }
    const ro = new ResizeObserver(remeasure)
    ro.observe(document.body)
    addEventListener('resize', remeasure)
    addEventListener('load', remeasure)
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => (reduced() ? stop() : start())
    mq.addEventListener('change', onMotion)
    start()
    document.fonts?.ready.then(remeasure)
    return () => {
      stop()
      clearTimeout(resizeT)
      ro.disconnect()
      removeEventListener('resize', remeasure)
      removeEventListener('load', remeasure)
      mq.removeEventListener('change', onMotion)
    }
  }, [])

  return (
    <>
      <div ref={probeRef} aria-hidden className="pup-probe" />
      <div ref={printsRef} aria-hidden className="pup-prints">
        {Array.from({ length: 24 }, (_, i) => <Paw key={i} size={15} />)}
      </div>
      <div ref={layerRef} aria-hidden className="pup-layer" hidden data-front="true">
        <div ref={actorRef} className="pup-actor">
          <div ref={bodyRef} className="pup-actor__body"><Mascot pose="peek" /></div>
          <span ref={bubbleAtRef} className="pup-bubble-at"><span ref={bubbleRef} className="pup-bubble" data-show="false" /></span>
        </div>
      </div>
    </>
  )
}
