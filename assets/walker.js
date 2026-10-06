
(() => {
  const timeline = document.querySelector(".timeline")
  const walker = document.querySelector(".walker")
  if (!timeline || !walker) return
  const svg = walker.querySelector("svg")
  const bubble = walker.querySelector(".bubble")
  const days = [...document.querySelectorAll("[data-day-label]")]
  let lastY = scrollY, stop
  function update() {
    const y = scrollY
    if (y !== lastY) {
      walker.classList.add("moving")
      svg.style.transform = y < lastY ? "scaleX(-1)" : ""
      clearTimeout(stop)
      stop = setTimeout(() => walker.classList.remove("moving"), 200)
    }
    lastY = y
    const middle = innerHeight / 2
    let label = ""
    for (const d of days) { if (d.getBoundingClientRect().top <= middle) label = d.dataset.dayLabel; else break }
    bubble.textContent = label
  }
  addEventListener("scroll", update, { passive: true })
  update()

  let drag = null
  svg.addEventListener("pointerdown", (e) => {
    e.preventDefault()
    svg.setPointerCapture(e.pointerId)
    drag = { y: e.clientY, scroll: scrollY }
    walker.classList.add("scrubbing")
    document.documentElement.style.scrollBehavior = "auto"
  })
  svg.addEventListener("pointermove", (e) => {
    if (!drag) return
    // scrub between the timeline's first and last moments, never past them
    const top = 70, bottom = innerHeight - 24
    const y = Math.min(bottom, Math.max(top, e.clientY))
    const r = timeline.getBoundingClientRect(), mid = innerHeight / 2
    const max = document.documentElement.scrollHeight - innerHeight
    const first = Math.max(0, scrollY + r.top - mid)
    const last = Math.max(first, Math.min(max, scrollY + r.bottom - mid))
    const from = Math.min(last, Math.max(first, drag.scroll))
    scrollTo(0, y < drag.y
      ? first + (from - first) * ((y - top) / Math.max(1, drag.y - top))
      : from + (last - from) * ((y - drag.y) / Math.max(1, bottom - drag.y)))
  })
  const end = () => { drag = null; walker.classList.remove("scrubbing"); document.documentElement.style.scrollBehavior = "" }
  svg.addEventListener("pointerup", end)
  svg.addEventListener("pointercancel", end)
})()
