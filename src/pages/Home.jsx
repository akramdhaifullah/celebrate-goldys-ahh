import { useEffect, useRef, useState, useCallback } from 'react'
import { getMemories } from '../lib/storage.js'

// ── Batik SVG pattern (shared) ───────────────────────────────────────────────
const BatikDefs = () => (
  <svg style={{ width: 0, height: 0, position: 'absolute', overflow: 'hidden' }}>
    <defs>
      <pattern id="bk" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
        <circle cx="18" cy="9"  r="7"   fill="none" stroke="#2C2C2C" strokeWidth="0.9"/>
        <circle cx="18" cy="27" r="7"   fill="none" stroke="#2C2C2C" strokeWidth="0.9"/>
        <circle cx="9"  cy="18" r="7"   fill="none" stroke="#2C2C2C" strokeWidth="0.9"/>
        <circle cx="27" cy="18" r="7"   fill="none" stroke="#2C2C2C" strokeWidth="0.9"/>
        <polygon points="18,13 22,18 18,23 14,18" fill="none" stroke="#2C2C2C" strokeWidth="0.7"/>
        <circle cx="18" cy="18" r="1.5" fill="#2C2C2C"/>
        <line x1="18" y1="3"  x2="18" y2="6.5" stroke="#2C2C2C" strokeWidth="0.55"/>
        <line x1="18" y1="31" x2="18" y2="33.5" stroke="#2C2C2C" strokeWidth="0.55"/>
        <line x1="3"  y1="18" x2="6.5" y2="18"  stroke="#2C2C2C" strokeWidth="0.55"/>
        <line x1="31" y1="18" x2="33.5" y2="18" stroke="#2C2C2C" strokeWidth="0.55"/>
        <circle cx="0"  cy="0"  r="0.9" fill="#2C2C2C"/>
        <circle cx="36" cy="0"  r="0.9" fill="#2C2C2C"/>
        <circle cx="0"  cy="36" r="0.9" fill="#2C2C2C"/>
        <circle cx="36" cy="36" r="0.9" fill="#2C2C2C"/>
      </pattern>
    </defs>
  </svg>
)

const BatikStrips = () => (
  <>
    <div className="batik-l"><svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#bk)"/></svg></div>
    <div className="batik-r"><svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#bk)"/></svg></div>
  </>
)

const ROTS = [-3.2,1.8,-1.4,3.6,-2.1,0.9,-3.8,2.4,-0.9,3.1,-2.5,1.3]

// ── Home page ─────────────────────────────────────────────────────────────────
export default function Home() {
  // flip state
  const [flipped, setFlipped] = useState(false)
  const [hinting, setHinting] = useState(false)
  const flipRef = useRef(null)
  const hintTimer = useRef(null)
  const dragStartX = useRef(null)
  const touchStartX = useRef(null)

  // lightbox
  const [lb, setLb] = useState(null) // { cap, ssn, imgSrc, bg, fromRect }
  const lbCardRef = useRef(null)
  const lbBgRef   = useRef(null)
  const lbSrcRect = useRef(null)

  // wishes
  const [wishes, setWishes] = useState([])
  const [cur, setCur] = useState(0)
  const [cardAnim, setCardAnim] = useState({ opacity: 1, x: 0 })
  const wishTouchX = useRef(null)

  // uploaded memories
  const [uploads, setUploads] = useState([])

  // ── Load uploads + wishes from Supabase on mount ─────────────────────────
  useEffect(() => {
    getMemories().then(mems => {
      setUploads(mems)
      const derived = mems.map(m => ({
        msg: `\u201c${m.message}\u201d`,
        sig: `\u2014 ${m.name}`,
      }))
      if (derived.length) setWishes(derived)
    }).catch(() => {})
  }, [])

  // ── Flip hint on hover ─────────────────────────────────────────────────────
  const onFlipEnter = () => {
    if (flipped || hinting) return
    setHinting(true)
    hintTimer.current = setTimeout(() => setHinting(false), 2000)
  }
  const doFlip = useCallback(() => {
    setFlipped(f => !f)
    setHinting(false)
    clearTimeout(hintTimer.current)
  }, [])

  const onMouseDown = e => { dragStartX.current = e.clientX }
  const onMouseUp   = e => {
    if (dragStartX.current !== null && Math.abs(e.clientX - dragStartX.current) > 28) doFlip()
    dragStartX.current = null
  }
  const onTouchStart = e => { touchStartX.current = e.changedTouches[0].clientX }
  const onTouchEnd   = e => {
    if (touchStartX.current !== null && Math.abs(e.changedTouches[0].clientX - touchStartX.current) > 28) doFlip()
    touchStartX.current = null
  }

  // ── Lightbox ───────────────────────────────────────────────────────────────
  const LBW = () => (lbCardRef.current?.offsetWidth || 260)

  const openLb = (e, cap, ssn, imgSrc, bg) => {
    const rect = e.currentTarget.getBoundingClientRect()
    lbSrcRect.current = rect
    setLb({ cap, ssn, imgSrc, bg })

    // Animate from source position after next paint
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!lbCardRef.current) return
      const cw = LBW()
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2
      const sx = rect.left + rect.width / 2 - cx
      const sy = rect.top  + rect.height / 2 - cy
      const ss = rect.width / cw
      lbCardRef.current.style.transition = 'none'
      lbCardRef.current.style.opacity    = '0.3'
      lbCardRef.current.style.transform  = `translate(${sx}px,${sy}px) scale(${ss}) rotate(-1deg)`
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!lbCardRef.current) return
        lbCardRef.current.style.transition = 'transform 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease'
        lbCardRef.current.style.opacity    = '1'
        lbCardRef.current.style.transform  = 'translate(0,0) scale(1) rotate(-0.5deg)'
      }))
    }))
  }

  const closeLb = () => {
    if (!lbCardRef.current || !lbSrcRect.current) { setLb(null); return }
    const rect = lbSrcRect.current
    const cw = LBW()
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2
    const ex = rect.left + rect.width / 2 - cx
    const ey = rect.top  + rect.height / 2 - cy
    const es = rect.width / cw
    lbCardRef.current.style.transition = 'transform 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.18s ease 0.7s'
    lbCardRef.current.style.opacity    = '0'
    lbCardRef.current.style.transform  = `translate(${ex}px,${ey}px) scale(${es}) rotate(-1deg)`
    if (lbBgRef.current) lbBgRef.current.style.opacity = '0'
    setTimeout(() => { setLb(null); lbSrcRect.current = null }, 900)
  }

  // ── Wishes navigation ──────────────────────────────────────────────────────
  const animWish = dir => {
    const outX = dir === 'r' ? '-18px' : '18px'
    const inX  = dir === 'r' ? '18px'  : '-18px'
    setCardAnim({ opacity: 0, x: outX })
    setTimeout(() => {
      setCur(c => dir === 'r' ? (c + 1) % wishes.length : (c - 1 + wishes.length) % wishes.length)
      setCardAnim({ opacity: 0, x: inX })
      requestAnimationFrame(() => requestAnimationFrame(() => setCardAnim({ opacity: 1, x: '0px' })))
    }, 180)
  }
  const onWishTouchStart = e => { wishTouchX.current = e.changedTouches[0].clientX }
  const onWishTouchEnd   = e => {
    const dx = e.changedTouches[0].clientX - wishTouchX.current
    if (Math.abs(dx) > 40) animWish(dx < 0 ? 'r' : 'l')
  }

  return (
    <>
      <BatikDefs />

      {/* ── LIGHTBOX ── */}
      <div className={`lightbox${lb ? ' open' : ''}`}>
        <div
          className="lb-bg"
          ref={lbBgRef}
          onClick={closeLb}
          style={{ opacity: lb ? undefined : 0 }}
        />
        {lb && (
          <div className="lb-card" ref={lbCardRef}>
            <button className="lb-x" onClick={closeLb}>✕</button>
            <div className="lb-img">
              {lb.imgSrc
                ? <img src={lb.imgSrc} alt={lb.cap} />
                : <div style={{ width: '100%', height: '100%', background: lb.bg }} />
              }
            </div>
            <div className="lb-meta">
              <span className="lb-cap">{lb.cap}</span>
              {lb.ssn && <span className="lb-ssn">{lb.ssn}</span>}
            </div>
          </div>
        )}
      </div>

      {/* ── S1a: TEXT ── */}
      <section className="hero-text">
        <BatikStrips />
        <img
          src="/fcb-logo.png"
          alt="FC Barcelona"
          style={{ height: 'clamp(28px,3vw,42px)', width: 'auto', marginBottom: 'clamp(14px,2.5vh,24px)', position: 'relative', zIndex: 1 }}
        />
        <div className="hero-eyebrow">a birthday dedication</div>
        <div className="hero-title">Celebrating<br/>Twenty-Four Years<br/>of Goldan</div>
        <div className="hero-divider" />
        <div className="hero-scroll">Scroll down</div>
      </section>

      {/* ── S1b: PHOTO ── */}
      <section className="hero-photo-sec">
        <BatikStrips />
        <div
          className="flip-scene"
          onMouseEnter={onFlipEnter}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={doFlip}
        >
          <div
            ref={flipRef}
            className={`flip-inner${flipped ? ' flipped' : ''}${hinting ? ' hinting' : ''}`}
          >
            <div className="flip-face front">
              <div className="flip-photo">
                <span style={{ fontStyle: 'italic', fontSize: 'clamp(12px,1.2vw,16px)', color: '#8B7D6B' }}>hero portrait</span>
              </div>
              <div className="flip-caption">Goldan, 2024</div>
            </div>
            <div className="flip-face back">
              <div className="flip-photo goofy">
                😂<span style={{ fontSize: 'clamp(12px,1.2vw,18px)', color: '#A50044', fontStyle: 'italic' }}>the real Goldan</span>
              </div>
              <div className="flip-caption b">caught in 4K 💀</div>
            </div>
          </div>
        </div>
        <div className="photo-scroll">Scroll down</div>
      </section>

      {/* ── S2: CORK BOARD ── */}
      <section className="section-board">
        <div className="board-label-wrap"><span className="lbl">MEMORIES</span></div>
        <div className="cork-wrap">
          <div className="cork-board">
            <div className="board-grid">
              {/* Uploaded memories */}
              {uploads.map((m, i) => {
                const rot = ROTS[i % ROTS.length]
                const usePin = i % 2 === 0
                return (
                  <div className="board-item" key={`u${i}`}>
                    {usePin
                      ? <div className="pin" style={{ background: 'radial-gradient(circle at 35% 35%,#ff8a8a,#A50044)' }} />
                      : <div className="tape" style={{ width: 34, background: 'rgba(237,187,0,0.42)', transform: 'translateX(-50%) rotate(-2deg)' }} />
                    }
                    <div
                      className="board-polaroid"
                      style={{ transform: `rotate(${rot}deg)`, '--rh': `rotate(${rot}deg) scale(1.1) translateY(-6px)` }}
                      onClick={e => openLb(e, m.note || m.name, null, m.imgSrc || m.img_url, null)}
                    >
                      <div className="board-photo" style={{ background: '#c8c0b0', overflow: 'hidden' }}>
                        <img src={m.imgSrc || m.img_url} alt={m.note} />
                      </div>
                      <div className="board-caption">{m.note || m.name}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── S3: WISHES ── */}
      <section
        className="section-wishes"
        onTouchStart={onWishTouchStart}
        onTouchEnd={onWishTouchEnd}
      >
        <div className="wz-l" onClick={() => animWish('l')} />
        <div className="wz-r" onClick={() => animWish('r')} />
        <BatikStrips />
        <div className="w-content">
          <div style={{ marginBottom: 'clamp(12px,2vh,20px)' }}><span className="lbl red">WISHES</span></div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px,4vw,48px)', fontWeight: 700, color: '#2C2C2C', marginBottom: 6 }}>
            Words of Love
          </div>
          <div style={{ fontSize: 'clamp(11px,1.1vw,14px)', color: '#8B7D6B', fontStyle: 'italic', marginBottom: 'clamp(20px,3vh,36px)' }}>
            Click anywhere left or right · Swipe on touch
          </div>
          <div className="w-card-wrap">
            <div
              className="w-card"
              style={{
                opacity: cardAnim.opacity,
                transform: `translateX(${cardAnim.x})`,
                transition: cardAnim.opacity === 1 ? 'opacity .28s, transform .28s' : 'opacity .18s, transform .18s',
              }}
            >
              <div className="w-msg">{wishes[cur]?.msg}</div>
              <div className="w-sig">{wishes[cur]?.sig}</div>
            </div>
          </div>
          <div className="dots">
            {wishes.map((_, i) => <div key={i} className={`dot${i === cur ? ' on' : ''}`} />)}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <p className="footer-note">again, wishing you a blessed birthday!</p>
      </footer>
    </>
  )
}
