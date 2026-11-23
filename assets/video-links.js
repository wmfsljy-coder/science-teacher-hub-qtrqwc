/* 과학 수업 허브 · 단원 화면에 관련 영상(유튜브 「교실 너머 과학」) 카드를 자동으로 붙입니다.
 * 목록은 허브 data/videos.json (targets: pages·unit·n). 단원 index.html 끝에서 이 파일을 한 번 부릅니다.
 * 소단원 n 의 이야기 탭(data-panel = n-1) 마지막 장면 끝과, 칠판모드 탭(#board-wrap)의 n 번째 줄에 단추를 더합니다.
 * 같은 영상 주소가 이미 있으면 건너뜁니다. 목록을 못 읽으면 아무것도 하지 않습니다. */
(function () {
  var HUB = "https://wmfsljy-coder.github.io/science-teacher-hub-qtrqwc/";
  var seg = location.pathname.split("/").filter(Boolean);
  if (seg.length < 2) return;
  var pages = seg[0], unit = seg[1];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function has(root, url) { return !!(root && root.querySelector('a[href="' + url + '"]')); }
  function vid(v) { return v.id || ((String(v.url || "").match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1]) || ""; }

  /* 탭 목록 맨 위(00 들어가기 앞)에 '▶ 영상 모음' 탭: 이 단원에 걸린 영상을 소단원별로 보여 주고, 누르면 그 자리에서 틉니다(단원 화면을 떠나지 않음). */
  function videoTab(list) {
    if (!list.length || document.querySelector('.tab-btn[data-tab="vid"]')) return;
    var first = document.querySelector(".tab-btn"), firstPanel = document.querySelector(".tab-panel");
    if (!first || !firstPanel) return;
    var st = document.createElement("style");
    st.textContent =
      ".vt-sec{font-size:13px;font-weight:800;color:var(--teal,#0f766e);margin:22px 2px 8px;letter-spacing:.04em}" +
      ".vt-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;align-items:start}" +
      ".vt-card{background:var(--panel,#fff);border:1px solid var(--line,#e2e8f0);border-radius:14px;overflow:hidden}" +
      ".vt-head{display:flex;gap:12px;align-items:center;width:100%;padding:10px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;min-height:84px}" +
      ".vt-head:hover{background:var(--panel-2,#f8fafc)}.vt-head:focus-visible{outline:4px solid var(--teal,#14b8a6);outline-offset:-4px}" +
      ".vt-head img{width:64px;height:64px;border-radius:10px;object-fit:cover;flex:none;background:#0f172a}" +
      ".vt-t{display:block;font-size:16px;font-weight:700;line-height:1.35;word-break:keep-all}" +
      ".vt-s{display:block;margin-top:3px;font-size:13px;line-height:1.45;color:var(--mist,#64748b);word-break:keep-all}" +
      ".vt-play{flex:none;background:#dc2626;color:#fff;font-size:14px;font-weight:800;padding:7px 11px;border-radius:10px}" +
      ".vt-body{padding:0 12px 14px}.vt-body[hidden]{display:none}" +
      ".vt-frame{display:block;width:min(100%,360px);aspect-ratio:9/16;margin:0 auto;border:0;border-radius:12px;background:#000}" +
      ".vt-note{font-size:13.5px;line-height:1.6;color:var(--mist,#64748b);margin:10px 2px 0}" +
      ".vt-yt{display:inline-block;margin-top:8px;font-size:13px;font-weight:700;color:var(--mist,#64748b)}";
    document.head.appendChild(st);

    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "tab-btn"; btn.setAttribute("data-tab", "vid");
    btn.innerHTML = "<span class='num'>\u25B6</span> 영상 모음";
    first.parentNode.insertBefore(btn, first);

    var panel = document.createElement("section");
    panel.className = "tab-panel"; panel.setAttribute("data-panel", "vid"); panel.hidden = true;
    var html = "<div class='stage-head'><div class='eyebrow'>\u25B6 · 영상 모음</div><h2 class='display'>이 단원 관련 영상</h2>" +
      "<p>유튜브 「교실 너머 과학」의 짧은 정리 영상 " + list.map(function (x) { return x.id; }).filter(function (id, i, a) { return a.indexOf(id) === i; }).length + "편이에요. 영상을 누르면 이 자리에서 틀어져요. 이야기를 풀기 전에 맛보기로, 푼 뒤에 정리로 보면 좋아요.</p></div>";
    var secs = [];
    list.forEach(function (x) { if (secs.indexOf(x.n) < 0) secs.push(x.n); });
    secs.sort();
    secs.forEach(function (n) {
      var tb = document.querySelector('.tab-btn[data-sec="' + n + '"]');
      var name = tb ? tb.textContent.replace(/^\s*\d+\s*/, "").trim() : "";
      html += "<div class='vt-sec'>" + esc(n) + (name ? " " + esc(name) : "") + "</div><div class='vt-list'>";
      list.filter(function (x) { return x.n === n; }).forEach(function (x) {
        var parts = String(x.v.title || "").split("|"), main = (parts[0] || "").trim(), sub = (parts[1] || "").trim();
        html += "<div class='vt-card' data-id='" + x.id + "'><button type='button' class='vt-head' aria-expanded='false'>" +
          "<img src='https://i.ytimg.com/vi/" + x.id + "/oardefault.jpg' alt='' loading='lazy' onerror=\"if(!this.dataset.fb){this.dataset.fb=1;this.src='https://i.ytimg.com/vi/" + x.id + "/default.jpg'}\">" +
          "<span style='flex:1;min-width:0'><span class='vt-t'>" + esc(main) + "</span><span class='vt-s'>" + esc([sub, x.v.dur].filter(Boolean).join(" · ")) + "</span></span>" +
          "<span class='vt-play'>\u25B6 보기</span></button><div class='vt-body' hidden></div></div>";
      });
      html += "</div>";
    });
    panel.innerHTML = html;
    firstPanel.parentNode.insertBefore(panel, firstPanel);

    /* 한 번에 한 편만 틀기 */
    function closeAll() {
      Array.prototype.forEach.call(panel.querySelectorAll(".vt-card"), function (c) {
        var b = c.querySelector(".vt-body"); b.hidden = true; b.innerHTML = "";
        c.querySelector(".vt-head").setAttribute("aria-expanded", "false");
        c.querySelector(".vt-play").textContent = "\u25B6 보기";
      });
    }
    Array.prototype.forEach.call(panel.querySelectorAll(".vt-card"), function (c) {
      var id = c.getAttribute("data-id"), x = list.filter(function (y) { return y.id === id; })[0];
      c.querySelector(".vt-head").addEventListener("click", function () {
        var body = c.querySelector(".vt-body"), open = !body.hidden;
        closeAll();
        if (open) return;
        body.innerHTML = "<iframe class='vt-frame' src='https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1' title='" + esc(x.v.title) + "' allow='autoplay; encrypted-media; picture-in-picture; fullscreen' allowfullscreen></iframe>" +
          (x.v.note ? "<p class='vt-note'>" + esc(x.v.note) + "</p>" : "") +
          "<a class='vt-yt' href='https://youtube.com/shorts/" + id + "' target='_blank' rel='noopener'>유튜브에서 열기 ↗</a>";
        body.hidden = false;
        this.setAttribute("aria-expanded", "true");
        c.querySelector(".vt-play").textContent = "\u25A0 닫기";
      });
    });

    function openVid() {
      Array.prototype.forEach.call(document.querySelectorAll(".tab-btn"), function (b) { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      Array.prototype.forEach.call(document.querySelectorAll(".tab-panel"), function (p) { p.hidden = p !== panel; });
      btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
      window.scrollTo(0, 0);
      window.dispatchEvent(new CustomEvent("tab-shown", { detail: "vid" }));
    }
    btn.addEventListener("click", openVid);
    /* 다른 탭을 누르면 영상 탭을 닫고 틀던 영상도 멈춤 */
    document.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest(".tab-btn") : null;
      if (!b || b === btn) return;
      btn.classList.remove("active"); btn.setAttribute("aria-selected", "false"); panel.hidden = true; closeAll();
    }, true);
    if (/^#videos?$/.test(location.hash)) openVid();
  }

  function run(d) {
    if (!d || !d.videos) return;
    var mine = [];
    d.videos.slice().reverse().forEach(function (v) {
      var id = vid(v); if (!id) return;
      (v.targets || []).forEach(function (tg) {
        if (tg.pages === pages && tg.unit === unit && tg.n) mine.push({ v: v, id: id, n: String(tg.n) });
      });
    });
    videoTab(mine);
    d.videos.forEach(function (v) {
      (v.targets || []).forEach(function (tg) {
        if (tg.pages !== pages || tg.unit !== unit) return;
        var n = parseInt(tg.n, 10); if (!n) return;
        var panel = document.querySelector('section.tab-panel[data-panel="' + (n - 1) + '"]');
        if (panel && !has(panel, v.url)) {
          var scenes = panel.querySelectorAll("section.scene");
          var host = scenes.length ? scenes[scenes.length - 1] : panel;
          var card = document.createElement("div");
          card.className = "info-card"; card.setAttribute("data-video", v.id || ""); card.style.margin = "0 0 14px";
          card.innerHTML = "\uD83C\uDFAC <b>영상으로 다시 보기</b> — 「" + esc(v.title) + "」" + (v.dur ? " (" + esc(v.dur) + ", 교실 너머 과학)" : "") +
            "<br>" + esc(v.note || "이야기를 먼저 해결한 뒤에 보면 정리에 도움이 됩니다.") +
            '<br><a class="btn primary" href="' + esc(v.url) + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:10px;text-decoration:none">\u25B6 유튜브에서 영상 보기</a>';
          var sc = host.querySelector(":scope > .stage-card");
          if (sc) host.insertBefore(card, sc); else host.appendChild(card);
        }
        var rows = document.querySelectorAll("#board-wrap .board-row");
        var row = rows[n - 1];
        if (row && !has(row, v.url)) {
          var br = row.querySelector(".btn-row") || row;
          var a = document.createElement("a");
          a.className = "btn"; a.href = v.url; a.target = "_blank"; a.rel = "noopener"; a.style.textDecoration = "none";
          a.textContent = "\u25B6\uFE0F " + (v.label || "유튜브 영상");
          br.appendChild(a);
        }
      });
    });
  }
  try { fetch(HUB + "data/videos.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(run).catch(function () {}); } catch (e) {}
})();
