
const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
// 通り芯の交点に散った8文字が、一列に集まって KAIENSYA になる
(function () {
  const mark = document.querySelector(".mark");
  const gs = [...mark.querySelectorAll(".mv")], word = mark.querySelector(".word");
  const finalX = k => 165 + (k - 3.5) * 33, finalY = 196 - 16;
  const fromXY = g => { const t = g.querySelector("text"); return [ +t.getAttribute("x"), +t.getAttribute("y") - 16 ]; };
  if (reduce) { gs.forEach(g => g.style.opacity = 0); word.style.opacity = 1; mark.classList.add("done"); return; }
  const START = 2900, MOVE = 1300;
  setTimeout(() => {
    gs.forEach((g, k) => {
      const [x, y] = fromXY(g);
      g.animate([{ transform: "translate(0,0)" }, { transform: `translate(${finalX(k) - x}px,${finalY - y}px)` }],
        { duration: MOVE, delay: k * 40, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" });
    });
    mark.classList.add("done");
  }, START);
  setTimeout(() => {
    gs.forEach(g => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: "forwards" }));
    word.animate([{ opacity: 0, letterSpacing: ".5em" }, { opacity: 1, letterSpacing: ".16em" }], { duration: 900, easing: "ease-out", fill: "forwards" });
  }, START + MOVE + 400);
})();


// 冒頭のロゴが見えている間は、上のロゴを隠す
const hdr = $("hdr");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => hdr.classList.toggle("solo", e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] }).observe($("intro"));
} else hdr.classList.remove("solo");

// 冒頭の写真
const slides = [...document.querySelectorAll(".hslide")], dots = [...$("dots").children];
let cur = 0, timer;
function show(i) {
  cur = i;
  slides.forEach((s, k) => s.classList.toggle("on", k === i));
  dots.forEach((b, k) => b.classList.toggle("on", k === i));
  $("heroEn").textContent = slides[i].dataset.en; $("heroJa").textContent = slides[i].dataset.ja;
}
function restart() { clearInterval(timer); if (!reduce) timer = setInterval(() => show((cur + 1) % slides.length), 5500); }
dots.forEach((b, i) => b.onclick = () => { show(i); restart(); });
show(0); restart();

// 事例の絞り込み
const fbtn = [...$("filters").children], cards = [...document.querySelectorAll("#grid .work")];
let filter = "ALL";
try { filter = localStorage.getItem("kaiensya-filter") || "ALL"; } catch (e) {}
function apply() {
  fbtn.forEach(b => b.classList.toggle("on", b.dataset.k === filter));
  cards.forEach(c => c.hidden = !(filter === "ALL" || c.dataset.cat === filter));
}
fbtn.forEach(b => b.onclick = () => { filter = b.dataset.k; try { localStorage.setItem("kaiensya-filter", filter); } catch (e) {} apply(); });
apply();
