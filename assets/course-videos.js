/* 과학 수업 허브 · 과목 첫 화면(학생용 단원 목록, 과목 전체 QR 이 여는 곳)에 '▶️ 영상 모음'을 붙입니다.
 * 목록은 허브 data/videos.json (targets: pages·unit·n) 중 이 과목(주소 첫 칸 = pages)에 걸린 영상, 새것부터.
 * - 제목 아래 큰 '▶️ 영상 모음 N편' 단추: 누르면 단원별 영상 목록을 펼칩니다(바로 틀지 않음). 고르면 유튜브 쇼츠가 새 탭으로 열립니다.
 * - 영상이 있는 단원 카드에는 '▶ 영상 N' 표시를 붙입니다(카드를 누르면 예전처럼 단원으로 갑니다).
 * - 주소 끝에 #videos 가 있으면 처음부터 펼쳐 둡니다. 이 과목 영상이 없거나 목록을 못 읽으면 아무것도 하지 않습니다.
 * 과목 index.html 끝에서 이 파일을 한 번 부릅니다. */
(function () {
  var HUB = "https://wmfsljy-coder.github.io/science-teacher-hub-qtrqwc/";
  var seg = location.pathname.split("/").filter(Boolean);
  if (seg.length !== 1 && !(seg.length === 2 && /^index\.html?$/.test(seg[1]))) return;
  var pages = seg[0];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function vid(v) { return v.id || ((String(v.url || "").match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1]) || ""; }

  var css =
    ".cv-wrap{max-width:1080px;margin:0 auto;padding:6px 30px 0}" +
    ".cv-btn{display:inline-flex;align-items:center;gap:8px;min-height:56px;padding:0 24px;border-radius:16px;border:2px solid #dc2626;background:#dc2626;color:#fff;font-size:18px;font-weight:800;cursor:pointer;font-family:inherit}" +
    ".cv-btn:hover{background:#b91c1c;border-color:#b91c1c}.cv-btn:focus-visible{outline:4px solid var(--teal,#14b8a6);outline-offset:2px}" +
    ".cv-btn .cv-n{font-size:15px;font-weight:700;opacity:.9}" +
    ".cv-panel{margin-top:14px;background:var(--panel,#fff);border:1px solid var(--line,#ddd);border-radius:14px;padding:14px}" +
    ".cv-panel[hidden]{display:none}" +
    ".cv-hint{color:var(--mist,#64748b);font-size:13.5px;margin:0 4px 10px}" +
    ".cv-unit{font-size:13px;font-weight:800;color:var(--teal,#0f766e);margin:14px 4px 6px;letter-spacing:.04em}.cv-unit:first-of-type{margin-top:2px}" +
    ".cv-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:8px}" +
    ".cv-item{display:flex;align-items:center;gap:12px;min-height:72px;padding:8px;border-radius:12px;background:var(--panel-2,#f8fafc);border:1px solid var(--line,#e2e8f0);text-decoration:none;color:inherit}" +
    ".cv-item:hover{border-color:#dc2626}.cv-item:focus-visible{outline:4px solid var(--teal,#14b8a6)}" +
    ".cv-item img{width:56px;height:56px;border-radius:10px;object-fit:cover;flex:none;background:#0f172a}" +
    ".cv-txt{flex:1;min-width:0}.cv-t{display:block;font-size:15.5px;font-weight:700;line-height:1.35;word-break:keep-all}" +
    ".cv-s{display:block;margin-top:2px;font-size:12.5px;line-height:1.4;color:var(--mist,#64748b);word-break:keep-all}" +
    ".cv-go{flex:none;background:#dc2626;color:#fff;font-size:13px;font-weight:800;padding:5px 9px;border-radius:8px}" +
    ".cv-chip{display:inline-block;margin-top:10px;font-size:12px;font-weight:800;color:#dc2626;border:1.5px solid #dc2626;border-radius:999px;padding:3px 10px}" +
    "@media (max-width:600px){.cv-wrap{padding:6px 18px 0}.cv-btn{width:100%;justify-content:center}.cv-list{grid-template-columns:1fr}}";

  function run(d) {
    if (!d || !d.videos) return;
    /* 이 과목 영상만, 새것부터(목록 뒤쪽이 새 영상), 단원별로 묶기 */
    var byUnit = {}, order = [], total = 0;
    d.videos.slice().reverse().forEach(function (v) {
      var id = vid(v); if (!id) return;
      var seen = {};
      (v.targets || []).forEach(function (tg) {
        if (tg.pages !== pages || seen[tg.unit]) return;
        seen[tg.unit] = 1;
        if (!byUnit[tg.unit]) { byUnit[tg.unit] = []; order.push(tg.unit); }
        byUnit[tg.unit].push({ v: v, id: id });
      });
      if (Object.keys(seen).length) total++;
    });
    if (!total || document.getElementById("cv-wrap")) return;

    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

    /* 단원 순서는 화면의 카드 순서를 따름 */
    var cards = Array.prototype.slice.call(document.querySelectorAll("a.unit-card"));
    var unitOf = function (a) { return (a.getAttribute("href") || "").replace(/^\.?\//, "").split("/")[0]; };
    var pos = {}; cards.forEach(function (a, i) { pos[unitOf(a)] = i; });
    order.sort(function (a, b) { return (pos[a] == null ? 99 : pos[a]) - (pos[b] == null ? 99 : pos[b]); });

    var html = '<p class="cv-hint">단원별 관련 영상입니다. 고르면 유튜브 쇼츠로 열립니다.</p>';
    order.forEach(function (u) {
      var card = cards.filter(function (a) { return unitOf(a) === u; })[0];
      var ch = card && card.querySelector(".chapter"), h3 = card && card.querySelector("h3");
      html += '<div class="cv-unit">' + esc(ch ? ch.textContent.trim() : u) + (h3 ? " " + esc(h3.textContent.trim()) : "") + "</div><div class=\"cv-list\">";
      byUnit[u].forEach(function (x) {
        var parts = String(x.v.title || "").split("|"), main = (parts[0] || "").trim(), sub = (parts[1] || "").trim();
        var meta = [sub, x.v.dur].filter(Boolean).join(" · ");
        html += '<a class="cv-item" href="https://youtube.com/shorts/' + x.id + '" target="_blank" rel="noopener">' +
          '<img src="https://i.ytimg.com/vi/' + x.id + '/oardefault.jpg" alt="" loading="lazy" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src=\'https://i.ytimg.com/vi/' + x.id + '/default.jpg\'}">' +
          '<span class="cv-txt"><span class="cv-t">' + esc(main) + "</span>" + (meta ? '<span class="cv-s">' + esc(meta) + "</span>" : "") + "</span>" +
          '<span class="cv-go" aria-hidden="true">쇼츠 ↗</span></a>';
      });
      html += "</div>";
    });

    var wrap = document.createElement("div");
    wrap.className = "cv-wrap"; wrap.id = "cv-wrap";
    wrap.innerHTML = '<button type="button" class="cv-btn" id="cv-btn" aria-expanded="false" aria-controls="cv-panel">▶️ 영상 모음 <span class="cv-n">' + total + '편</span> <span aria-hidden="true" id="cv-arrow">▼</span></button>' +
      '<div class="cv-panel" id="cv-panel" hidden>' + html + "</div>";
    var hero = document.querySelector(".hero");
    if (hero && hero.parentNode) hero.parentNode.insertBefore(wrap, hero.nextSibling);
    else document.body.insertBefore(wrap, document.body.firstChild);

    var btn = document.getElementById("cv-btn"), panel = document.getElementById("cv-panel"), arrow = document.getElementById("cv-arrow");
    function set(open) { panel.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false"); arrow.textContent = open ? "▲" : "▼"; }
    btn.addEventListener("click", function () { set(panel.hidden); });
    if (/^#videos?$/.test(location.hash)) { set(true); wrap.scrollIntoView(); }

    /* 단원 카드에 '▶ 영상 N' 표시 */
    cards.forEach(function (a) {
      var n = (byUnit[unitOf(a)] || []).length;
      if (!n || a.querySelector(".cv-chip")) return;
      var c = document.createElement("span"); c.className = "cv-chip"; c.textContent = "▶ 영상 " + n;
      a.appendChild(c);
    });
  }
  try { fetch(HUB + "data/videos.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(run).catch(function () {}); } catch (e) {}
})();
