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
  function run(d) {
    if (!d || !d.videos) return;
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
