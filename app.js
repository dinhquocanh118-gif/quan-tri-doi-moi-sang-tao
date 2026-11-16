/* Điều hướng theo #hash và dựng từng trang từ dữ liệu trong thư mục  */
(function () {
  "use strict";
  var S = window.SITE, CH = window.CHAPTERS, PARTS = window.PARTS, CASES = window.CASES, ROAD = window.ROADMAP, QUIZ = window.QUIZ;
  var view = document.getElementById("view");
  var NAV = [
    ["trang-chu", "Trang chủ"], ["giang-vien", "Giảng viên"], ["noi-dung", "Nội dung kiến thức"], ["tai-lieu", "Kho tài liệu"],
    ["case-study", "Góc Case Study"], ["quiz", "Quiz kiểm tra"], ["lo-trinh", "Lộ trình học tập"], ["mindmap", "Mindmap & Thuật ngữ"]
  ];
  var T = S.team || {};
  function plain(x) { return String(x == null ? "" : x).replace(/[&<>]/g, ""); }
  var FOOT = '<footer class="foot">' + (T.members && T.members.length ? '<p><b>Nhóm thực hiện:</b> ' + T.members.map(plain).join(" · ") + '</p>' : '') +
    ((T.classCode || T.faculty) ? '<p>' + [T.classCode ? "Lớp học phần " + plain(T.classCode) : "", plain(T.faculty)].filter(Boolean).join(" · ") + '</p>' : '') +
    '<p>Nội dung do nhóm sinh viên tóm tắt để phục vụ học tập, dựa trên giáo trình Paul Trott, <i>Innovation Management and New Product Development</i> (Pearson).</p></footer>';
  var NOTICE = S.notice ? '<p class="notice">' + plain(S.notice) + '</p>' : '';

  /* ---------- tiện ích ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ch(n) { return CH[n - 1]; }
  function partOf(n) { for (var i = 0; i < PARTS.length; i++) if (n >= PARTS[i].range[0] && n <= PARTS[i].range[1]) return PARTS[i].id; return 1; }
  function weekOf(n) { var w = null; ROAD.forEach(function (s) { s.weeks.forEach(function (x) { if (x.ch === n) w = x.w; }); }); return w; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function best() { return store("quiz-best") || {}; }
  var TERMS = CH.reduce(function (a, c) { return a + c.glossary.length; }, 0);
  var QTOTAL = CH.reduce(function (a, c) { return a + (QUIZ[c.n] || []).length; }, 0);

  /* ---------- hình của từng chương: khung lý thuyết đặc trưng, vẽ trên lưới 64×64 ---------- */
  function poly(f, x0, x1, step) { var d = ""; for (var x = x0; x <= x1 + 1e-6; x += step) d += (d ? "L" : "M") + x.toFixed(1) + " " + f(x).toFixed(1); return d; }
  function wave(x) { var t = (x - 6) / 52; return 46 - 18 * t - 6 * Math.sin(t * Math.PI * 5); }
  function bell(x) { return 52 - 38 * Math.exp(-Math.pow((x - 32) / 11, 2) / 2); }
  var FIG = {
    1: { cap: "Công nghệ đẩy và thị trường kéo", d: '<circle class="t" cx="32" cy="32" r="13"/><path d="M5 32h13.5M13 26.5l5.5 5.5-5.5 5.5"/><path d="M59 32H45.5M51 26.5 45.5 32l5.5 5.5"/><circle class="a" cx="32" cy="32" r="5"/>' },
    2: { cap: "Các làn sóng tăng trưởng dài", d: '<path class="t" d="M6 8v48h52"/><path d="' + poly(wave, 6, 58, 1) + '"/><circle class="a" cx="52.8" cy="' + wave(52.8).toFixed(1) + '" r="4.5"/>' },
    3: { cap: "Tam giác chiến lược của Moore", d: '<path d="M32 13 53 49H11z"/><circle class="f" cx="11" cy="49" r="4.5"/><circle class="f" cx="53" cy="49" r="4.5"/><circle class="a" cx="32" cy="13" r="5.5"/>' },
    4: { cap: "Bản đồ bất định của Pearson", d: '<rect x="9" y="9" width="46" height="46" rx="4"/><path d="M32 9v46M9 32h46"/><circle class="a" cx="43.5" cy="20.5" r="5"/>' },
    5: { cap: "Đầu vào, chuyển đổi, đầu ra", d: '<path d="M4 32h11M10.5 27l5 5-5 5"/><rect x="21" y="19" width="22" height="26" rx="4"/><path d="M48 32h11M54.5 27l5 5-5 5"/><circle class="a" cx="32" cy="32" r="4.5"/>' },
    6: { cap: "Thời hạn của các công cụ bảo hộ", d: '<path class="t" d="M9 7v50"/><path class="b" d="M11 16h26M11 28h18M11 40h31M11 52h36"/><path d="M47 34.5l5.5 5.5-5.5 5.5"/><circle class="a" cx="41" cy="16" r="4.5"/>' },
    7: { cap: "Đường cong chữ S của công nghệ", d: '<path class="t" d="M6 8v48h52"/><path d="M8 52C22 52 22 28 38 28"/><path d="M26 44C40 44 40 14 56 14"/><circle class="a" cx="56" cy="14" r="4.5"/>' },
    8: { cap: "Mạng lưới đối tác", d: '<path class="t" d="M14 17 51 14M12 50l40-1M14 17l-2 33M51 14l1 35"/><path d="M32 33 14 17M32 33 51 14M32 33 12 50M32 33l20 16"/><circle class="f" cx="14" cy="17" r="4.5"/><circle class="f" cx="51" cy="14" r="4.5"/><circle class="f" cx="12" cy="50" r="4.5"/><circle class="f" cx="52" cy="49" r="4.5"/><circle class="a" cx="32" cy="33" r="6"/>' },
    9: { cap: "Dải liên tục từ nghiên cứu đến phát triển", d: '<path class="t" d="M4 32h56"/><circle class="f" cx="8" cy="32" r="3"/><circle class="f" cx="21" cy="32" r="4.5"/><circle class="f" cx="36.5" cy="32" r="6.5"/><circle class="a" cx="53" cy="32" r="8.5"/>' },
    10: { cap: "Phễu đổi mới mở", d: '<path class="d" d="M6 14C26 14 34 25 58 26"/><path class="d" d="M6 50C26 50 34 39 58 38"/><path class="t" d="M37 9v10M43 44l1.5 9"/><circle class="f" cx="13" cy="26" r="3"/><circle class="f" cx="16" cy="40" r="3"/><circle class="f" cx="30" cy="32" r="3.5"/><circle class="f" cx="37" cy="7" r="3"/><circle class="f" cx="45" cy="56" r="3"/><circle class="a" cx="50" cy="32" r="4.5"/>' },
    11: { cap: "Bốn bộ phận của mô hình kinh doanh", d: '<rect x="8" y="10" width="48" height="44" rx="4"/><path d="M8 38h48M24 10v28M40 10v28"/><circle class="a" cx="32" cy="24" r="4.5"/>' },
    12: { cap: "Đường cong chấp nhận đổi mới", d: '<path class="t" d="M4 52h56M21 52V' + bell(21).toFixed(1) + 'M32 52V' + bell(32).toFixed(1) + 'M43 52V' + bell(43).toFixed(1) + '"/><path d="' + poly(bell, 5, 59, 1) + '"/><circle class="a" cx="15.5" cy="' + bell(15.5).toFixed(1) + '" r="4.5"/>' },
    13: { cap: "Các giai đoạn và điểm quyết định", d: '<rect x="3" y="25.5" width="12" height="13" rx="2.5"/><path d="M15 32h2M30 32h2M44 32h2"/><path d="M23.5 25.5l6.5 6.5-6.5 6.5L17 32z"/><rect x="32" y="25.5" width="12" height="13" rx="2.5"/><path class="a" d="M52.5 25l7 7-7 7-7-7z"/>' },
    14: { cap: "Ba tầng nhu cầu của khách hàng", d: '<path d="M14.3 42h35.4L56 54H8z"/><path d="M23.1 25h17.8l6.2 12H16.9z"/><path class="a" d="M32 8l6.3 12H25.7z"/>' },
    15: { cap: "Hao hụt ý tưởng qua các giai đoạn", d: '<path class="t" d="M5 56h54"/><path class="b" d="M11 51V12M21 51V28M31 51V37M41 51V43"/><circle class="f" cx="50" cy="50" r="3"/><circle class="a" cx="58" cy="51" r="3.5"/>' }
  };
  function em(n, cls) { return '<svg class="em p' + partOf(n) + (cls ? " " + cls : "") + '" viewBox="0 0 64 64" aria-hidden="true">' + FIG[n].d + '</svg>'; }
  function chFig(n) { return '<figure class="pl-fig p' + partOf(n) + '">' + em(n) + '<figcaption><b>Hình ' + pad(n) + '</b>' + esc(FIG[n].cap) + '</figcaption></figure>'; }
  function meter(n, score) { var h = ""; for (var i = 0; i < 10; i++) h += '<i' + (score != null && i < score ? ' class="on"' : '') + '></i>'; return '<span class="meter p' + partOf(n) + '" aria-hidden="true">' + h + '</span>'; }

  /* ---------- khối dùng chung ---------- */
  function plate(o) {
    return '<header class="plate ' + (o.cls || "") + '"><div class="plate-in">' + (o.fig || "") + '<div class="pl-text"><span class="label">' + esc(o.eyebrow) + '</span><h1>' + esc(o.title) + '</h1>' +
      (o.lead ? '<p class="lead">' + esc(o.lead) + '</p>' : '') + (o.actions ? '<div class="row">' + o.actions + '</div>' : '') + '</div></div></header>';
  }
  function slot(what, field) { return '<div class="slot"><b>Đang cập nhật</b>' + esc(what) + ' Điền tại <code>config.js</code>, mục <code>' + esc(field) + '</code>.</div>'; }
  function sh(label, title, sub) { return '<div class="sh">' + (label ? '<span class="label">' + esc(label) + '</span>' : '') + '<h2>' + esc(title) + '</h2>' + (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') + '</div>'; }

  /* ---------- đường cong chữ S của môn học ---------- */
  function logi(t) { return 1 / (1 + Math.exp(-8 * (t - 0.5))); }
  var L0 = logi(0), L1 = logi(1);
  function grow(t) { return (logi(t) - L0) / (L1 - L0); }
  function chart(o) {
    var N = CH.length, b = best(), ax = o.b + o.nr + 8, H = ax + (o.names ? (o.phase ? 62 : 46) : 26), out = "", nodes = "";
    function px(t) { return o.l + t * (o.W - o.l - o.r); }
    function py(t) { return o.b - grow(t) * (o.b - o.t); }
    function seg(t0, t1) { var d = "", n = 36, i, t; for (i = 0; i <= n; i++) { t = t0 + (t1 - t0) * i / n; d += (i ? "L" : "M") + px(t).toFixed(1) + " " + py(t).toFixed(1); } return d; }
    function col(p) { return "var(--p" + p + (o.dark ? "-lit" : "") + ")"; }
    var bg = o.dark ? "var(--pine)" : "var(--surface)", ink = o.dark ? "var(--on-pine)" : "var(--ink)", mut = o.dark ? "var(--on-pine-muted)" : "var(--muted)", rule = o.dark ? "var(--pine-line)" : "var(--line)";
    var areas = "", seps = "", labels = "", lines = "";
    PARTS.forEach(function (p, i) {
      var t0 = Math.max(0, (p.range[0] - 1.5) / (N - 1)), t1 = Math.min(1, (p.range[1] - 0.5) / (N - 1)), x0 = px(t0), x1 = px(t1), xm = ((x0 + x1) / 2).toFixed(1);
      if (!o.dark) areas += '<path d="' + seg(t0, t1) + 'L' + x1.toFixed(1) + ' ' + ax + 'L' + x0.toFixed(1) + ' ' + ax + 'Z" fill="var(--p' + p.id + '-soft)"/>';
      if (i) seps += '<line x1="' + x0.toFixed(1) + '" x2="' + x0.toFixed(1) + '" y1="' + (o.t - o.nr) + '" y2="' + ax + '" stroke="' + (o.dark ? rule : "var(--surface)") + '" stroke-width="' + (o.dark ? 1.5 : 3) + '"' + (o.dark ? ' stroke-dasharray="3 5"' : '') + '/>';
      labels += '<text class="mono" x="' + xm + '" y="' + (ax + 18) + '" text-anchor="middle" font-size="' + (o.names ? 11 : 9.5) + '" font-weight="700" letter-spacing="1" fill="' + col(p.id) + '">PHẦN ' + p.id + '</text>';
      if (o.names) labels += '<text x="' + xm + '" y="' + (ax + 36) + '" text-anchor="middle" font-size="13.5" font-weight="600" fill="' + ink + '">' + esc(p.short) + '</text>';
      if (o.phase) labels += '<text x="' + xm + '" y="' + (ax + 53) + '" text-anchor="middle" font-size="12" fill="' + mut + '">' + esc(ROAD[i].phase) + ' · tuần ' + ROAD[i].weeks[0].w + '–' + ROAD[i].weeks[ROAD[i].weeks.length - 1].w + '</text>';
      lines += '<path class="draw" pathLength="1" style="animation-delay:' + (0.15 + i * 0.6) + 's" d="' + seg(t0, t1) + '" fill="none" stroke="' + col(p.id) + '" stroke-width="3.5" stroke-linecap="round"/>';
    });
    CH.forEach(function (c, i) {
      var t = i / (N - 1), x = px(t).toFixed(1), y = py(t), p = partOf(c.n), done = b[c.n] != null;
      nodes += '<a href="#chuong-' + c.n + '" aria-label="Chương ' + c.n + ': ' + esc(c.vi) + (done ? ', đã làm quiz' : '') + '"><title>Chương ' + c.n + ' · ' + esc(c.vi) + '</title>' +
        '<circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="' + o.nr + '" fill="' + (done ? col(p) : bg) + '" stroke="' + col(p) + '" stroke-width="2.5"/>' +
        '<text class="mono" x="' + x + '" y="' + (y + o.fs * 0.36).toFixed(1) + '" text-anchor="middle" font-size="' + o.fs + '" font-weight="700" fill="' + (done ? bg : (o.dark ? ink : col(p))) + '">' + c.n + '</text></a>';
    });
    out += areas + seps;
    out += '<line x1="' + (o.l - o.nr) + '" x2="' + (o.W - o.r + o.nr) + '" y1="' + ax + '" y2="' + ax + '" stroke="' + (o.dark ? rule : "var(--line-strong)") + '" stroke-width="1.5"/>';
    if (o.ylab) out += '<text class="mono" transform="translate(' + (o.l - o.nr - 12) + ' ' + ax + ') rotate(-90)" font-size="10" letter-spacing="1" fill="' + mut + '">NĂNG LỰC TÍCH LŨY →</text>';
    out += '<path d="' + seg(0, 1) + '" fill="none" stroke="' + (o.dark ? rule : "var(--surface)") + '" stroke-width="' + (o.dark ? 9 : 8) + '" stroke-linecap="round"/>' + lines + nodes + labels;
    return '<svg class="cv ' + o.cls + '" viewBox="0 0 ' + o.W + ' ' + H + '" role="img" aria-label="Đường cong chữ S của môn học: ' + N + ' chương qua ba phần">' + out + '</svg>';
  }
  var NARROW = { W: 360, l: 20, r: 16, t: 22, b: 212, nr: 9.5, fs: 9, cls: "only-narrow" };
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  /* ---------- 1. Trang chủ ---------- */
  function home() {
    var h = S.home, b = best();
    var tools = [
      ["mindmap", "Mindmap & Thuật ngữ", "Mỗi chương một sơ đồ tư duy, kèm từ điển " + TERMS + " thuật ngữ Anh – Việt."],
      ["quiz", "Quiz kiểm tra", QTOTAL + " câu trắc nghiệm có đáp án, chấm ngay khi chọn."],
      ["case-study", "Góc Case Study", CASES.length + " tình huống thành công và thất bại của doanh nghiệp."],
      ["lo-trinh", "Lộ trình học tập", "Kiến thức và kỹ năng cần tích lũy qua từng tuần."],
      ["tai-lieu", "Kho tài liệu", "Slide bài giảng, giáo trình và tài liệu thầy cung cấp."],
      ["giang-vien", "Giảng viên", "Thông tin liên hệ và review của các thành viên trong nhóm."]
    ];
    var nextCh = 1; for (var i = 0; i < CH.length; i++) { if (b[CH[i].n] == null) { nextCh = CH[i].n; break; } }
    var started = Object.keys(b).length > 0;
    var orbit = '<svg class="orbit" viewBox="0 0 480 400" role="img" aria-label="Ý tưởng, tri thức và giá trị xoay quanh đổi mới"><g fill="none" stroke="var(--on-pine-muted)" stroke-width="1.2">' +
      '<circle cx="240" cy="200" r="150" opacity=".7"/><circle cx="240" cy="200" r="105" stroke-dasharray="3 5" opacity=".6"/><ellipse cx="240" cy="200" rx="205" ry="92" transform="rotate(-28 240 200)" opacity=".7"/></g>' +
      '<path transform="translate(240 200) rotate(14)" fill="var(--accent)" d="M0 -54C8 -14 14 -8 54 0C14 8 8 14 0 54C-8 14 -14 8 -54 0C-14 -8 -8 -14 0 -54Z"/>' +
      [["Ý TƯỞNG", 46, 44, 0], ["TRI THỨC", 366, 186, 0], ["GIÁ TRỊ", 62, 318, 1]].map(function (t) {
        return '<rect x="' + t[1] + '" y="' + t[2] + '" width="108" height="38" rx="19" fill="' + (t[3] ? "var(--accent)" : "var(--pine-2)") + '" stroke="' + (t[3] ? "var(--accent)" : "var(--pine-line)") + '"/><text x="' + (t[1] + 54) + '" y="' + (t[2] + 23.5) + '" text-anchor="middle" font-size="12" letter-spacing="1.2" font-weight="500" fill="' + (t[3] ? "var(--on-accent)" : "var(--on-pine)") + '">' + t[0] + '</text>';
      }).join("") + '</svg>';
    return '<header class="hero"><div class="hero-card">' +
      '<div class="pl-text"><span class="label">Thư viện kiến thức · ' + CH.length + ' chương</span><h1>Từ ý tưởng <span>đến <em>đổi mới.</em></span></h1>' +
      '<p class="lead">Khám phá từng chương, kết nối kiến thức và kiểm tra điều bạn đã học.</p>' +
      '<div class="row"><a class="btn" href="#chuong-' + nextCh + '">' + (started ? "Tiếp tục học · Chương " + nextCh : "Bắt đầu học") + ' →</a><a class="btn ghost" href="#lo-trinh">Xem lộ trình</a></div></div>' +
      '<div class="hero-fig">' + orbit + '<p>Kết nối để tạo khác biệt.</p></div></div></header>' +
      '<div class="strip"><div class="strip-in">' +
      '<a href="#noi-dung"><b>' + CH.length + '</b><span>Chương</span></a><a href="#quiz"><b>' + QTOTAL + '</b><span>Câu quiz</span></a>' +
      '<a href="#mindmap"><b>' + TERMS + '</b><span>Thuật ngữ</span></a><a href="#case-study"><b>' + CASES.length + '</b><span>Case study</span></a></div></div>' +
      '<div class="wrap">' +
      '<section class="block">' + sh(S.courseNameEn, "Môn học này là gì?") + (h.overview ? '<p class="big">' + esc(h.overview) + '</p>' : slot("Phần giới thiệu tổng quan về môn học.", "home.overview")) + '</section>' +
      '<section class="block">' + sh("Ý nghĩa", "Tại sao môn học này lại quan trọng?") + (h.why && h.why.length ? '<div class="why3">' + h.why.map(function (w, i) { return '<article><span class="num">' + pad(i + 1) + '</span><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></article>'; }).join("") + '</div>' : slot("Lý do môn học quan trọng.", "home.why")) + '</section>' +
      '<section class="block">' + sh("Đích đến", "Mục tiêu học tập", h.objectivesIntro) + (h.objectives && h.objectives.length ? '<ol class="objs">' + h.objectives.map(function (o) { return '<li>' + (FIG[o.icon] ? em(o.icon) : '<span></span>') + '<div><h3>' + esc(o.title) + '</h3><p>' + esc(o.text) + '</p></div></li>'; }).join("") + '</ol>' : slot("Danh sách mục tiêu môn học.", "home.objectives")) + '</section>' +
      '<section class="block">' + sh("Nội dung kiến thức", CH.length + " chương, ba phần") +
      '<div class="legend">' + PARTS.map(function (p) { return '<span class="p' + p.id + '">Phần ' + p.id + ' · ' + esc(p.name) + '</span>'; }).join("") + '</div>' +
      '<div class="tiles">' + CH.map(function (c) {
        return '<a class="tile p' + partOf(c.n) + '" href="#chuong-' + c.n + '"><span class="top"><span class="n">' + pad(c.n) + '</span>' + (b[c.n] != null ? '<span class="done">Quiz ' + b[c.n] + '/10</span>' : '') + '</span>' + em(c.n) + '<b>' + esc(c.vi) + '</b></a>';
      }).join("") + '</div></section>' +
      '<section class="block">' + sh("Công cụ học tập", "Ôn tập theo cách của bạn") + '<div class="tools">' + tools.map(function (t) {
        return '<a class="tool" href="#' + t[0] + '"><h3>' + t[1] + '</h3><p>' + t[2] + '</p><span class="cnt" aria-hidden="true">→</span></a>';
      }).join("") + '</div></section>' + FOOT + '</div>';
  }

  /* ---------- 2. Giảng viên ---------- */
  function instructor() {
    var p = S.instructor, filled = S.reviews.filter(function (r) { return r.text; }).length;
    function fact(label, html) { return '<div><dt>' + label + '</dt>' + (html ? '<dd>' + html + '</dd>' : '<dd class="na">Đang cập nhật</dd>') + '</div>'; }
    var ip = S.instructorPage || {};
    return plate({ eyebrow: "02 · Giảng viên", title: ip.title || p.name || "Giảng viên hướng dẫn", lead: ip.lead || "Thông tin liên hệ của thầy và cảm nhận của các thành viên sau khi học." }) +
      '<div class="wrap"><section class="profile">' +
      (p.photo ? '<div class="photo"><img src="' + esc(p.photo) + '" alt="Ảnh giảng viên"></div>' : '<div class="photo slot"><div><b>Ảnh giảng viên</b>Đang cập nhật</div></div>') +
      '<div class="block"><dl class="facts">' + fact("Giảng viên", esc(p.name)) + fact("Đơn vị công tác", esc(p.title)) + fact("Email UEH", p.email ? '<span style="user-select:all">' + esc(p.email) + '</span>' : "") +
      fact("Website cá nhân", p.website ? '<a href="' + esc(p.website) + '" target="_blank" rel="noopener">' + esc(p.website) + '</a>' : "") + '</dl>' +
      (p.bio ? '<p class="prose">' + esc(p.bio) + '</p>' : '') + (p.name ? '' : slot("Ảnh, họ tên, email và website của thầy.", "instructor")) + '</div></section>' +
      '<section class="block">' + sh("Góc nhìn từ lớp học", "Cảm nhận của " + S.reviews.length + " thành viên", filled < S.reviews.length ? filled + "/" + S.reviews.length + " thành viên đã viết review." : "") + '<div class="reviews">' +
      S.reviews.map(function (r, i) {
        var who = esc(r.name || "Thành viên " + (i + 1));
        return r.text ? '<blockquote class="review"><p>' + esc(r.text) + '</p><footer>' + who + '</footer></blockquote>' : '<div class="review slot"><b>' + who + '</b>Chưa có review.</div>';
      }).join("") + '</div></section>' + FOOT + '</div>';
  }

  /* ---------- 3. Nội dung kiến thức ---------- */
  function chapterRow(c, href, b, extra) {
    return '<a class="crow p' + partOf(c.n) + '" href="' + href + '">' + em(c.n) + '<span class="ttl"><span>Chương ' + pad(c.n) + '</span><b>' + esc(c.vi) + '</b><small>' + esc(c.en) + '</small></span>' +
      '<span class="side">' + extra + (b[c.n] != null ? meter(c.n, b[c.n]) + '<span>' + b[c.n] + '/10</span>' : '') + '<span class="go" aria-hidden="true">→</span></span></a>';
  }
  function contents() {
    var b = best();
    return plate({ eyebrow: "03 · Nội dung kiến thức", title: CH.length + " chương theo giáo trình", lead: "Mỗi chương là một bản tóm tắt bằng tiếng Việt: mục tiêu, ý chính từng phần và những điều cần nhớ." }) +
      '<div class="wrap">' + PARTS.map(function (p) {
        return '<section class="p' + p.id + '"><div class="part-h"><span class="label">Phần ' + p.id + ' · Chương ' + p.range[0] + '–' + p.range[1] + '</span><h2>' + esc(p.name) + '</h2><p>' + esc(p.desc) + '</p></div><div class="rows">' +
          CH.filter(function (c) { return partOf(c.n) === p.id; }).map(function (c) { return chapterRow(c, "#chuong-" + c.n, b, '<span>' + c.sections.length + ' mục · ' + c.glossary.length + ' thuật ngữ</span>'); }).join("") + '</div></section>';
      }).join("") + FOOT + '</div>';
  }
  function chapter(n) {
    var c = ch(n), p = partOf(n), b = best(), cs = CASES.filter(function (x) { return x.ch === n; })[0], d = (window.DOCS || {})[n] || { html: "", toc: [] };
    return plate({ cls: "pc p" + p, fig: chFig(n), eyebrow: "Chương " + pad(n) + " · Phần " + p + " · Tuần " + weekOf(n), title: c.vi, lead: c.intro,
      actions: '<a class="btn" href="#mindmap-' + n + '">Mindmap & thuật ngữ</a><a class="btn ghost" href="#quiz-' + n + '">Làm quiz' + (b[n] != null ? ' · cao nhất ' + b[n] + '/10' : '') + '</a>' + (S.sourceDoc ? '<a class="btn ghost" href="' + esc(S.sourceDoc) + '" target="_blank" rel="noopener">Xem trên Google Docs ↗</a>' : '') }) +
      '<div class="wrap p' + p + '" style="gap:28px">' + readerBar() + '<div class="chap"><div class="chap-main">' +
      '<article class="doc" id="doc">' + (d.variant ? '<p class="variant">' + esc(d.variant) + '</p>' : '') + d.html + '</article>' +
      '<section class="take"><h2>Điều cần nhớ</h2><ol>' + c.takeaways.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join("") + '</ol></section>' +
      '<nav class="pager" aria-label="Chuyển chương">' +
      (n > 1 ? '<a class="p' + partOf(n - 1) + '" href="#chuong-' + (n - 1) + '"><span class="label">← Chương ' + pad(n - 1) + '</span>' + esc(ch(n - 1).vi) + '</a>' : '') +
      (n < CH.length ? '<a class="next p' + partOf(n + 1) + '" href="#chuong-' + (n + 1) + '"><span class="label">Chương ' + pad(n + 1) + ' →</span>' + esc(ch(n + 1).vi) + '</a>' : '<a class="next" href="#quiz-tong-hop"><span class="label">Hoàn thành →</span>Thử đề tổng hợp 20 câu</a>') + '</nav>' +
      '</div><aside>' +
      (d.toc.length > 1 ? '<div class="block" style="gap:10px"><span class="label">Trong chương này</span><div class="toc">' + d.toc.map(function (t) { return '<button type="button" data-scroll="' + t.id + '">' + esc(t.t) + '</button>'; }).join("") + '</div></div>' : '') +
      '<div class="block" style="gap:10px"><span class="label">Học tiếp</span><div class="rel">' +
      (cs ? '<a href="#case-study"><span>Case study</span>' + esc(cs.name) + ': ' + esc(cs.title) + '</a>' : '') +
      '<a href="#mindmap-' + n + '"><span>Mindmap</span>Sơ đồ tư duy và ' + c.glossary.length + ' thuật ngữ</a>' +
      '<a href="#quiz-' + n + '"><span>Quiz</span>' + (QUIZ[n] || []).length + ' câu trắc nghiệm</a></div></div>' +
      '</aside></div>' + FOOT + '</div>';
  }

  /* ---------- Trình đọc bài giảng: giọng Google (Gemini TTS), dự phòng bằng giọng của trình duyệt ---------- */
  var TTS = S.tts || {};
  var RD = { chunks: [], i: 0, state: "idle", token: 0, cache: {}, google: true, voice: store("tts-voice") === "male" ? "male" : "female", rate: +store("tts-rate") || 1, audio: null };
  function ttsKey() { return String(window.TTS_KEY || store("tts-key") || "").trim(); }
  function readerBar() {
    var rates = [[0.85, "Chậm"], [1, "Vừa"], [1.15, "Nhanh"], [1.3, "Rất nhanh"]];
    return '<section class="reader" id="reader" aria-label="Nghe bài giảng">' +
      '<button type="button" class="btn" data-read="toggle" id="rdPlay">▶ Nghe bài giảng</button><button type="button" class="btn ghost" data-read="stop" id="rdStop" hidden>■ Dừng</button>' +
      '<div class="seg" role="group" aria-label="Giọng đọc"><button type="button" data-voice="female" aria-pressed="' + (RD.voice === "female") + '">Giọng nữ</button><button type="button" data-voice="male" aria-pressed="' + (RD.voice === "male") + '">Giọng nam</button></div>' +
      '<label class="rd-rate">Tốc độ <select id="rdRate">' + rates.map(function (r) { return '<option value="' + r[0] + '"' + (r[0] === RD.rate ? " selected" : "") + '>' + r[1] + '</option>'; }).join("") + '</select></label>' +
      '<button type="button" class="rd-link" data-read="key">Khóa API</button>' +
      '<p class="rd-status" id="rdStatus" role="status"></p>' +
      '<div class="rd-keybox" id="rdKeyBox" hidden><input class="search" id="rdKey" type="password" autocomplete="off" placeholder="Dán Google API key (Gemini)" aria-label="Google API key"><button type="button" class="btn ghost" data-read="savekey">Lưu</button><p class="hint">Khóa chỉ lưu trong trình duyệt này. Để trống rồi bấm Lưu để xóa.</p></div></section>';
  }
  function rdStatus(t) { var el = document.getElementById("rdStatus"); if (el) el.textContent = t || ""; }
  function rdText(el) {
    if (el.matches("ul,ol")) return [].map.call(el.querySelectorAll("li"), function (li) { return li.textContent.trim().replace(/[.;:]$/, ""); }).join(". ") + ".";
    if (el.matches(".tbl")) return [].map.call(el.querySelectorAll("tr"), function (tr) { return [].map.call(tr.children, function (c) { return c.textContent.trim(); }).filter(Boolean).join(", "); }).join(". ") + ".";
    var t = el.textContent.trim(); return /^H\d$/.test(el.tagName) ? t.replace(/[.:]$/, "") + "." : t;
  }
  function rdBuild() {
    var doc = document.getElementById("doc"), out = [], cur = null;
    function push() { if (cur && cur.text.trim()) out.push(cur); cur = null; }
    [].forEach.call(doc ? doc.children : [], function (el) {
      if (el.classList.contains("variant")) return;
      var t = rdText(el); if (!t || t === ".") return;
      if (/^H\d$/.test(el.tagName) || (cur && cur.text.length + t.length > 900)) push();
      if (t.length > 1300) {   // khối rất dài (bảng lớn): tách theo câu
        push(); var buf = "";
        t.split(/(?<=[.!?])\s+/).forEach(function (sn) { if (buf.length + sn.length > 900 && buf) { out.push({ els: [el], text: buf }); buf = ""; } buf += (buf ? " " : "") + sn; });
        if (buf) out.push({ els: [el], text: buf }); return;
      }
      if (!cur) cur = { els: [], text: "" };
      cur.els.push(el); cur.text += (cur.text ? " " : "") + t;
    });
    push(); RD.chunks = out;
  }
  function rdMark(i) {
    document.querySelectorAll(".doc .reading").forEach(function (e) { e.classList.remove("reading"); });
    var c = RD.chunks[i]; if (!c) return;
    c.els.forEach(function (e) { e.classList.add("reading"); });
    var r = c.els[0].getBoundingClientRect(); if (r.top < 90 || r.top > window.innerHeight * 0.7) c.els[0].scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function rdUI() {
    var play = document.getElementById("rdPlay"), stop = document.getElementById("rdStop"); if (!play) return;
    play.textContent = RD.state === "playing" ? "❚❚ Tạm dừng" : RD.state === "paused" ? "▶ Đọc tiếp" : "▶ Nghe bài giảng";
    stop.hidden = RD.state === "idle";
  }
  function wavBlob(bytes, mime) {
    if (/wav/i.test(mime)) return new Blob([bytes], { type: "audio/wav" });
    var rate = +((/rate=(\d+)/.exec(mime) || [0, 24000])[1]), h = new DataView(new ArrayBuffer(44)), n = bytes.length;
    function w(o, str) { for (var k = 0; k < str.length; k++) h.setUint8(o + k, str.charCodeAt(k)); }
    w(0, "RIFF"); h.setUint32(4, 36 + n, true); w(8, "WAVEfmt "); h.setUint32(16, 16, true); h.setUint16(20, 1, true); h.setUint16(22, 1, true);
    h.setUint32(24, rate, true); h.setUint32(28, rate * 2, true); h.setUint16(32, 2, true); h.setUint16(34, 16, true); w(36, "data"); h.setUint32(40, n, true);
    return new Blob([h, bytes], { type: "audio/wav" });
  }
  function rdFetch(i) {
    var k = RD.voice + ":" + i; if (RD.cache[k]) return RD.cache[k];
    // Send only the lesson text: style instructions can be spoken aloud by TTS.
    RD.cache[k] = fetch("https://generativelanguage.googleapis.com/v1beta/models/" + (TTS.model || "gemini-3.8-flash-tts") + ":generateContent", {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": ttsKey() },
      body: JSON.stringify({ contents: [{ parts: [{ text: RD.chunks[i].text }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: RD.voice === "male" ? (TTS.male || "Charon") : (TTS.female || "Sulafat") } } } } })
    }).then(function (r) { if (!r.ok) throw { status: r.status }; return r.json(); }).then(function (d) {
      var part = d.candidates[0].content.parts[0].inlineData, bin = atob(part.data), bytes = new Uint8Array(bin.length);
      for (var j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
      return URL.createObjectURL(wavBlob(bytes, part.mimeType || ""));
    });
    RD.cache[k].catch(function () { delete RD.cache[k]; });
    return RD.cache[k];
  }
  function rdBrowser(i, tok, why) {
    if (!("speechSynthesis" in window)) { rdStop(); rdStatus(why + " Trình duyệt này cũng không có giọng đọc sẵn."); return; }
    var u = new SpeechSynthesisUtterance(RD.chunks[i].text), vs = speechSynthesis.getVoices().filter(function (v) { return /^vi/i.test(v.lang); });
    u.lang = "vi-VN"; u.rate = RD.rate; if (vs.length) u.voice = vs[0];
    u.onend = function () { if (tok === RD.token && RD.state === "playing") rdSpeak(i + 1, tok); };
    u.onerror = function (e) { if (tok === RD.token && e.error !== "interrupted" && e.error !== "canceled") { rdStop(); rdStatus((why ? why + " " : "") + "Trình duyệt này không có giọng đọc tiếng Việt để thay thế."); } };
    rdStatus(why + " Đang dùng giọng có sẵn của trình duyệt (không chọn được nam hay nữ) · phần " + (i + 1) + "/" + RD.chunks.length);
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
  function rdSpeak(i, tok) {
    if (tok !== RD.token) return;
    if (i >= RD.chunks.length) { rdStop(); rdStatus("Đã đọc hết chương."); return; }
    RD.i = i; rdMark(i);
    if (!ttsKey()) return rdBrowser(i, tok, "Chưa có khóa API Google.");
    if (!RD.google) return rdBrowser(i, tok, RD.why || "");
    rdStatus("Đang chuẩn bị giọng đọc · phần " + (i + 1) + "/" + RD.chunks.length);
    rdFetch(i).then(function (url) {
      if (tok !== RD.token) return;
      if (!RD.audio) RD.audio = new Audio();
      var a = RD.audio; a.src = url; a.playbackRate = RD.rate;
      a.onended = function () { if (tok === RD.token) rdSpeak(i + 1, tok); };
      rdStatus("Đang đọc · phần " + (i + 1) + "/" + RD.chunks.length + " · giọng " + (RD.voice === "male" ? "nam" : "nữ"));
      var pr = a.play(); if (pr && pr.catch) pr.catch(function (er) { if (tok === RD.token && RD.state === "playing" && !(er && er.name === "AbortError")) { rdStop(); rdStatus("Trình duyệt chặn phát âm thanh. Bấm Nghe bài giảng lần nữa."); } });
      if (RD.state === "paused") a.pause();
      if (i + 1 < RD.chunks.length) rdFetch(i + 1).catch(function () {});
    }).catch(function (e) {
      if (tok !== RD.token) return;
      RD.google = false;
      RD.why = e && e.status === 429 ? "Google báo đã quá giới hạn lượt gọi." : e && (e.status === 400 || e.status === 401 || e.status === 403) ? "Google từ chối khóa API." : "Không gọi được Google từ trang này.";
      rdBrowser(i, tok, RD.why);
    });
  }
  function rdStop() {
    RD.token++; RD.state = "idle"; RD.i = 0;
    if (RD.audio) { RD.audio.pause(); RD.audio.removeAttribute("src"); }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    document.querySelectorAll(".doc .reading").forEach(function (e) { e.classList.remove("reading"); });
    rdUI(); rdStatus("");
  }
  function rdReset() { rdStop(); Object.keys(RD.cache).forEach(function (k) { RD.cache[k].then(function (u) { URL.revokeObjectURL(u); }).catch(function () {}); }); RD.cache = {}; RD.chunks = []; RD.google = true; RD.why = ""; }
  function rdToggle() {
    if (RD.state === "playing") { RD.state = "paused"; if (RD.audio) RD.audio.pause(); if ("speechSynthesis" in window) speechSynthesis.pause(); rdUI(); return; }
    if (RD.state === "paused") { RD.state = "playing"; rdUI(); if (RD.audio && RD.audio.src && RD.google && ttsKey()) RD.audio.play(); else if ("speechSynthesis" in window) speechSynthesis.resume(); return; }
    if (!RD.chunks.length) rdBuild();
    if (!RD.chunks.length) { rdStatus("Chương này chưa có nội dung để đọc."); return; }
    RD.state = "playing"; RD.token++; rdUI(); rdSpeak(RD.i, RD.token);
  }
  function rdAction(t) {
    if (t.dataset.voice) {
      RD.voice = t.dataset.voice; store("tts-voice", RD.voice);
      t.parentNode.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === t)); });
      if (RD.state !== "idle") { RD.token++; if (RD.audio) RD.audio.pause(); RD.state = "playing"; rdUI(); rdSpeak(RD.i, RD.token); }
    } else if (t.dataset.read === "toggle") rdToggle();
    else if (t.dataset.read === "stop") rdStop();
    else if (t.dataset.read === "key") { var box = document.getElementById("rdKeyBox"); box.hidden = !box.hidden; if (!box.hidden) document.getElementById("rdKey").focus(); }
    else if (t.dataset.read === "savekey") { var v = document.getElementById("rdKey").value.trim(); store("tts-key", v); RD.google = true; RD.why = ""; RD.cache = {}; document.getElementById("rdKeyBox").hidden = true; rdStatus(v ? "Đã lưu khóa API trong trình duyệt này." : "Đã xóa khóa API."); }
  }

  /* ---------- 4. Kho tài liệu ---------- */
  function materials() {
    var G = [["slide", "Slide bài giảng"], ["giao-trinh", "Giáo trình"], ["khac", "Tài liệu khác"]], m = S.materials || [];
    return plate({ eyebrow: "04 · Kho tài liệu", title: "Slide, giáo trình và tài liệu", lead: "Nơi lưu các tệp thầy cung cấp trong quá trình học." }) +
      '<div class="wrap">' + G.map(function (g) {
        var items = m.filter(function (x) { return (x.type || "khac") === g[0]; });
        return '<section class="block">' + sh(items.length ? items.length + " tệp" : "", g[1]) + (items.length ? '<div class="rows">' + items.map(function (x) {
          var ext = (String(x.url).split(/[?#]/)[0].match(/\.([a-z0-9]{2,4})$/i) || [0, "link"])[1].toUpperCase();
          return '<a class="mat" href="' + esc(x.url) + '" target="_blank" rel="noopener"><span class="ext">' + esc(ext) + '</span><span><b>' + esc(x.title) + '</b>' + (x.chapter ? '<small>Chương ' + pad(x.chapter) + ' · ' + esc(ch(x.chapter).vi) + '</small>' : '') + '</span><span aria-hidden="true">↗</span></a>';
        }).join("") + '</div>' : slot("Chưa có tệp nào trong mục này.", "materials")) + '</section>';
      }).join("") + FOOT + '</div>';
  }

  /* ---------- 5. Case study ---------- */
  var caseFilter = "all";
  function cases() {
    var nOk = CASES.filter(function (c) { return c.ok; }).length;
    var F = [["all", "Tất cả", CASES.length], ["ok", "Thành công", nOk], ["no", "Thách thức", CASES.length - nOk]];
    var list = CASES.filter(function (c) { return caseFilter === "all" || (caseFilter === "ok") === c.ok; });
    return plate({ eyebrow: "05 · Góc Case Study", title: "Bài học từ thực tế", lead: "Các tình huống đổi mới của doanh nghiệp và tổ chức, cả thành công lẫn chật vật, gắn với từng chương." }) +
      '<div class="wrap" style="gap:24px"><div class="chips">' + F.map(function (f) { return '<button type="button" class="chip" data-case="' + f[0] + '" aria-pressed="' + (caseFilter === f[0]) + '">' + f[1] + '<i>' + f[2] + '</i></button>'; }).join("") + '</div>' +
      '<div class="cases">' + list.map(function (c) {
        return '<article class="case p' + partOf(c.ch) + '"><div class="case-side">' + (c.images || (c.img ? [{ src: c.img, alt: 'Ảnh minh họa case ' + c.name }] : [])).map(function (im) { return '<a href="' + esc(im.src) + '" target="_blank" rel="noopener" aria-label="Xem ảnh: ' + esc(im.alt) + '"><img class="case-img" src="' + esc(im.src) + '" alt="' + esc(im.alt) + '" loading="lazy"></a>'; }).join('') + '<span class="stamp' + (c.ok ? '' : ' no') + '">' + esc(c.tag) + '</span><h2>' + esc(c.name) + '</h2><a href="#chuong-' + c.ch + '">Chương ' + pad(c.ch) + ' · ' + esc(ch(c.ch).vi) + '</a></div>' +
          '<div class="case-main"><h3>' + esc(c.title) + '</h3><p class="ctx">' + esc(c.context) + '</p><ul>' + c.analysis.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join("") + '</ul>' +
          '<p class="lesson"><span>Bài học</span>' + esc(c.lesson) + '</p></div></article>';
      }).join("") + '</div>' + FOOT + '</div>';
  }

  /* ---------- 6. Quiz ---------- */
  var quizState = null;
  function quizHome() {
    var b = best(), done = 0, sum = 0;
    CH.forEach(function (c) { if (b[c.n] != null) { done++; sum += b[c.n]; } });
    return plate({ eyebrow: "06 · Quiz kiểm tra kiến thức", title: QTOTAL + " câu cho " + CH.length + " chương", lead: "Mỗi chương 10 câu trắc nghiệm. Chọn đáp án để xem kết quả ngay; điểm cao nhất được lưu trên máy của bạn." }) +
      '<div class="wrap" style="gap:28px"><div class="qsum"><div class="stat"><div><b>' + done + '/' + CH.length + '</b><span>Chương đã làm</span></div><div><b>' + (done ? (sum / done).toFixed(1).replace(".", ",") : "–") + '</b><span>Điểm trung bình</span></div></div>' +
      '<a class="btn" href="#quiz-tong-hop">Đề tổng hợp 20 câu ngẫu nhiên</a></div>' +
      '<div class="rows">' + CH.map(function (c) { return chapterRow(c, "#quiz-" + c.n, b, b[c.n] != null ? '' : '<span>' + (QUIZ[c.n] || []).length + ' câu · chưa làm</span>'); }).join("") + '</div>' + FOOT + '</div>';
  }
  function quizRun(key) {
    var qs, mix = key === "mix";
    if (mix) {
      qs = [];
      CH.forEach(function (c) { (QUIZ[c.n] || []).forEach(function (q) { qs.push({ q: q.q, o: q.o, a: q.a, ch: c.n }); }); });
      for (var i = qs.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = qs[i]; qs[i] = qs[j]; qs[j] = t; }
      qs = qs.slice(0, 20);
    } else qs = QUIZ[key] || [];
    quizState = { key: key, qs: qs, done: 0, right: 0 };
    var segs = ""; qs.forEach(function () { segs += "<i></i>"; });
    return plate(mix ? { eyebrow: "Quiz · Đề tổng hợp", title: "20 câu ngẫu nhiên", lead: "Câu hỏi được rút từ cả " + CH.length + " chương. Mỗi lần làm là một đề khác.", actions: '<a class="btn ghost" href="#quiz">← Tất cả quiz</a><button type="button" class="btn ghost" data-retry="1">Đổi đề khác</button>' }
      : { cls: "pc p" + partOf(key), fig: chFig(key), eyebrow: "Quiz · Chương " + pad(key), title: ch(key).vi, lead: qs.length + " câu trắc nghiệm. Chọn đáp án để xem kết quả ngay.", actions: '<a class="btn ghost" href="#quiz">← Tất cả quiz</a><a class="btn ghost" href="#chuong-' + key + '">Ôn lại chương</a>' }) +
      '<div class="wrap' + (mix ? '' : ' p' + partOf(key)) + '" style="gap:28px"><div class="qs">' + qs.map(function (q, i) {
        return '<section class="q' + (q.ch ? ' p' + partOf(q.ch) : '') + '" data-q="' + i + '"><span class="qn" aria-hidden="true">' + pad(i + 1) + '</span><div class="qbody">' + (q.ch ? '<span class="from">Chương ' + pad(q.ch) + '</span>' : '') +
          '<h3>' + esc(q.q) + '</h3><div class="opts">' + q.o.map(function (o, k) { return '<button type="button" class="opt" data-o="' + k + '"><b>' + "ABCD"[k] + '</b><span>' + esc(o) + '</span></button>'; }).join("") + '</div><p class="fb" hidden></p></div></section>';
      }).join("") + '</div><div id="result" aria-live="polite"></div>' +
      '<div class="prog" id="prog" role="status"><span class="segs' + (qs.length > 12 ? ' many' : '') + '" id="segs" aria-hidden="true">' + segs + '</span><span id="progText">0/' + qs.length + ' · Đúng 0</span></div>' + FOOT + '</div>';
  }
  function answer(btn) {
    var box = btn.closest(".q"), st = quizState, i = +box.dataset.q, q = st.qs[i], pick = +btn.dataset.o, ok = pick === q.a;
    box.querySelectorAll(".opt").forEach(function (b, k) { b.disabled = true; b.classList.add(k === q.a ? "right" : k === pick ? "wrong" : "dim"); });
    box.classList.add(ok ? "is-ok" : "is-bad");
    var fb = box.querySelector(".fb"); fb.textContent = ok ? "Chính xác" : "Chưa đúng · Đáp án đúng là " + "ABCD"[q.a]; fb.hidden = false;
    st.done++; if (ok) st.right++;
    document.getElementById("segs").children[i].className = ok ? "ok" : "no";
    document.getElementById("progText").textContent = st.done + "/" + st.qs.length + " · Đúng " + st.right;
    if (st.done === st.qs.length) finish();
  }
  function finish() {
    var st = quizState, n = st.qs.length, r = st.right / n, mix = st.key === "mix", isBest = false;
    if (!mix) { var b = best(); if (!(b[st.key] >= st.right)) { b[st.key] = st.right; store("quiz-best", b); isBest = true; } renderRail(); }
    var msg = r >= 0.9 ? "Xuất sắc. Bạn nắm rất chắc phần này." : r >= 0.7 ? "Khá tốt. Xem lại những câu sai để chắc hơn." : r >= 0.5 ? "Đạt. Nên đọc lại phần tóm tắt trước khi làm lần nữa." : "Cần ôn lại. Đọc tóm tắt chương rồi thử lại nhé.";
    var next = !mix && st.key < CH.length ? '<a class="btn ghost" href="#quiz-' + (st.key + 1) + '">Quiz chương ' + (st.key + 1) + ' →</a>' : '<a class="btn ghost" href="#quiz">Tất cả quiz</a>';
    var res = document.getElementById("result");
    res.innerHTML = '<div class="result"><div class="big">' + st.right + '<small>/' + n + '</small></div><div><span class="label">Kết quả' + (isBest ? ' · điểm cao nhất mới' : '') + '</span><p>' + msg + '</p>' +
      '<div class="row"><button type="button" class="btn" data-retry="1">' + (mix ? "Làm đề khác" : "Làm lại") + '</button>' + (mix ? '' : '<a class="btn ghost" href="#chuong-' + st.key + '">Ôn lại chương</a>') + next + '</div></div></div>';
    document.getElementById("prog").hidden = true;
    res.firstChild.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- 7. Lộ trình ---------- */
  function roadmap() {
    var N = CH.length;
    return plate({ eyebrow: "07 · Bản đồ lộ trình học tập", title: "Tích lũy qua " + N + " tuần", lead: "Thứ tự kiến thức và kỹ năng cần có sau mỗi tuần. Việc học đi theo đường cong chữ S, giống một công nghệ mới: khởi đầu chậm để xây nền, tăng tốc ở giữa kỳ, rồi hoàn thiện ở cuối kỳ." }) +
      '<div class="wrap"><div class="chart">' + chart({ W: 980, l: 64, r: 34, t: 30, b: 290, nr: 15, fs: 12.5, names: true, phase: true, ylab: true, cls: "only-wide" }) + chart(NARROW) + '</div>' +
      ROAD.map(function (s, si) {
        var p = PARTS[s.part - 1];
        return '<section class="stage p' + p.id + '"><div class="stage-h"><div class="sh"><span class="label">Chặng ' + (si + 1) + ' · ' + esc(s.phase) + ' · Tuần ' + s.weeks[0].w + '–' + s.weeks[s.weeks.length - 1].w + '</span><h2>' + esc(p.name) + '</h2><p class="sub">' + esc(p.desc) + '</p></div>' +
          '<p class="outcome"><span>Sau chặng này bạn có thể</span>' + esc(s.outcome) + '</p></div><div class="rows">' +
          s.weeks.map(function (w) {
            return '<a class="week" href="#chuong-' + w.ch + '"><span class="wk"><small>Tuần</small>' + pad(w.w) + '</span>' + em(w.ch) + '<div><h3>' + esc(ch(w.ch).vi) + '</h3><div class="ks"><div><span>Kiến thức</span>' + esc(w.know) + '</div><div><span>Kỹ năng</span>' + esc(w.skill) + '</div></div></div></a>';
          }).join("") + '</div></section>';
      }).join("") + FOOT + '</div>';
  }

  /* ---------- 8. Mindmap và thuật ngữ ---------- */
  function wrapText(s, max) {
    var words = s.split(" "), lines = [], cur = "";
    words.forEach(function (w) { if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
    if (cur) lines.push(cur); return lines;
  }
  function tsp(lines, x, y0, lh) { return lines.map(function (l, i) { return '<tspan x="' + x + '" y="' + (y0 + i * lh) + '">' + esc(l) + '</tspan>'; }).join(""); }
  function mindWide(c) {
    var W = 1060, LH = 30, GAP = 24, sides = [[], []], half = Math.ceil(c.sections.length / 2), out = "";
    c.sections.forEach(function (s, i) { sides[i < half ? 1 : 0].push({ s: s, i: i }); });
    function heightOf(list) { return list.reduce(function (a, b) { return a + Math.max(b.s.k.length * LH, 58) + GAP; }, -GAP); }
    var H = Math.max(heightOf(sides[0]), heightOf(sides[1]), 200) + 56, cy = H / 2;
    sides.forEach(function (list, side) {
      var right = side === 1, y = (H - heightOf(list)) / 2;
      list.forEach(function (b) {
        var h = Math.max(b.s.k.length * LH, 58), by = y + h / 2, col = "var(--m" + (b.i % 6 + 1) + ")";
        var bx = right ? 645 : 235, bw = 180, edge = right ? bx : bx + bw, far = right ? bx + bw : bx, cx = right ? 620 : 440, lines = wrapText(b.s.t, 20);
        out += '<path d="M' + cx + ' ' + cy + ' C' + (cx + (right ? 30 : -30)) + ' ' + cy + ' ' + (edge + (right ? -30 : 30)) + ' ' + by + ' ' + edge + ' ' + by + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>' +
          '<rect x="' + bx + '" y="' + (by - 27) + '" width="' + bw + '" height="54" rx="10" fill="var(--surface)" stroke="' + col + '" stroke-width="2"/>' +
          '<text class="mm-b" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--ink)">' + tsp(lines, bx + bw / 2, by - (lines.length - 1) * 8.5 + 4.5, 17) + '</text>';
        b.s.k.forEach(function (k, j) {
          var ly = by + (j - (b.s.k.length - 1) / 2) * LH, lx = right ? 853 : 207, dx = right ? -6 : 6;
          out += '<path d="M' + far + ' ' + by + ' C' + (far + (right ? 14 : -14)) + ' ' + by + ' ' + (lx + (right ? -16 : 16)) + ' ' + ly + ' ' + (lx + dx) + ' ' + ly + '" fill="none" stroke="' + col + '" stroke-width="1.5" opacity=".75"/>' +
            '<circle cx="' + (lx + dx) + '" cy="' + ly + '" r="3.2" fill="' + col + '"/>' +
            '<text class="mm-l" x="' + (lx + (right ? 3 : -3)) + '" y="' + (ly + 4.5) + '" font-size="13.5" fill="var(--ink)" text-anchor="' + (right ? "start" : "end") + '">' + esc(k) + '</text>';
        });
        y += h + GAP;
      });
    });
    var cl = wrapText(c.vi, 17), th = cl.length * 19;
    out += '<rect x="440" y="' + (cy - 52) + '" width="180" height="104" rx="18" fill="var(--pc)"/>' +
      '<text class="mono" x="530" y="' + (cy - th / 2 - 4) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--on-part)" opacity=".8" letter-spacing="1.5">CHƯƠNG ' + pad(c.n) + '</text>' +
      '<text class="mm-c" text-anchor="middle" font-size="15" font-weight="700" fill="var(--on-part)">' + tsp(cl, 530, cy - th / 2 + 20, 19) + '</text>';
    return '<svg class="only-wide" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Sơ đồ tư duy chương ' + c.n + ': ' + esc(c.vi) + '">' + out + '</svg>';
  }
  function mindTall(c) {
    var W = 360, cl = wrapText(c.vi, 30), chh = 46 + cl.length * 20, tx = 22, y = 8 + chh + 18, lastBy = y, body = "";
    c.sections.forEach(function (s, i) {
      var col = "var(--m" + (i % 6 + 1) + ")", bl = wrapText(s.t, 34), bh = 22 + bl.length * 18, by = y + bh / 2;
      body += '<path d="M' + tx + ' ' + by + 'H42" stroke="' + col + '" stroke-width="2.5" fill="none"/>' +
        '<rect x="42" y="' + y + '" width="310" height="' + bh + '" rx="9" fill="var(--surface)" stroke="' + col + '" stroke-width="2"/>' +
        '<text class="mm-b" font-size="14.5" font-weight="600" fill="var(--ink)">' + tsp(bl, 56, y + 27, 18) + '</text>';
      lastBy = by; y += bh + 10;
      s.k.forEach(function (k) { body += '<circle cx="62" cy="' + (y + 8) + '" r="3.2" fill="' + col + '"/><text class="mm-l" x="76" y="' + (y + 13) + '" font-size="14" fill="var(--ink)">' + esc(k) + '</text>'; y += 26; });
      y += 12;
    });
    var out = '<path d="M' + tx + ' ' + (8 + chh) + 'V' + lastBy + '" stroke="var(--line-strong)" stroke-width="2.5" fill="none"/>' + body +
      '<rect x="8" y="8" width="344" height="' + chh + '" rx="14" fill="var(--pc)"/>' +
      '<text class="mono" x="24" y="33" font-size="10.5" font-weight="700" fill="var(--on-part)" opacity=".8" letter-spacing="1.5">CHƯƠNG ' + pad(c.n) + '</text>' +
      '<text class="mm-c" font-size="16.5" font-weight="700" fill="var(--on-part)">' + tsp(cl, 24, 57, 20) + '</text>';
    return '<svg class="only-narrow" viewBox="0 0 ' + W + ' ' + y + '" role="img" aria-label="Sơ đồ tư duy chương ' + c.n + ': ' + esc(c.vi) + '">' + out + '</svg>';
  }
  var glScope = "ch", glQuery = "";
  function glossary(n) {
    var q = glQuery.trim().toLowerCase(), rows = [], total = glScope === "all" ? TERMS : ch(n).glossary.length;
    (glScope === "all" ? CH : [ch(n)]).forEach(function (c) { c.glossary.forEach(function (g) { if (!q || g.join(" ").toLowerCase().indexOf(q) >= 0) rows.push({ g: g, c: c }); }); });
    if (glScope === "all") rows.sort(function (a, b) { return a.g[0].localeCompare(b.g[0]); });
    return '<p class="hint">' + (q ? rows.length + '/' + total + ' thuật ngữ khớp' : total + ' thuật ngữ') + (glScope === "all" ? ' trong cả ' + CH.length + ' chương' : ' của chương ' + pad(n)) + '</p>' +
      (rows.length ? '<dl class="gl">' + rows.map(function (r) {
        return '<div class="gl-row p' + partOf(r.c.n) + '"><dt>' + esc(r.g[0]) + (glScope === "all" ? '<a href="#mindmap-' + r.c.n + '" title="' + esc(r.c.vi) + '">C' + pad(r.c.n) + '</a>' : '') + '</dt><dd class="vi">' + esc(r.g[1]) + '</dd><dd class="df">' + esc(r.g[2]) + '</dd></div>';
      }).join("") + '</dl>' : '<div class="slot"><b>Không tìm thấy</b>Không có thuật ngữ nào khớp với “' + esc(glQuery) + '”. Thử từ khóa khác hoặc tìm trong tất cả chương.</div>');
  }
  function mindmap(n) {
    var c = ch(n), p = partOf(n);
    return plate({ cls: "pc p" + p, fig: chFig(n), eyebrow: "Mindmap · Chương " + pad(n), title: c.vi, lead: "Cốt lõi của chương trên một sơ đồ, kèm bảng tra cứu thuật ngữ Anh – Việt.",
      actions: '<a class="btn" href="#chuong-' + n + '">Đọc tóm tắt chương</a><a class="btn ghost" href="#quiz-' + n + '">Làm quiz</a>' }) +
      '<div class="wrap" style="gap:36px"><nav class="block" style="gap:10px" aria-label="Chọn chương"><span class="label">Chọn chương</span><div class="strip15">' +
      CH.map(function (x) { return '<a class="p' + partOf(x.n) + '" href="#mindmap-' + x.n + '" title="' + esc(x.vi) + '" aria-label="Chương ' + x.n + ': ' + esc(x.vi) + '"' + (x.n === n ? ' aria-current="true"' : '') + '>' + pad(x.n) + '</a>'; }).join("") + '</div></nav>' +
      '<div class="canvas p' + p + '">' + mindWide(c) + mindTall(c) + '</div>' +
      '<section class="block p' + p + '">' + sh("Tra cứu nhanh", "Từ điển thuật ngữ") + '<div class="gl-head"><div class="seg" role="group" aria-label="Phạm vi tra cứu">' +
      '<button type="button" data-scope="ch" aria-pressed="' + (glScope === "ch") + '">Chương ' + pad(n) + '</button><button type="button" data-scope="all" aria-pressed="' + (glScope === "all") + '">Tất cả chương</button></div>' +
      '<input class="search" id="glSearch" type="search" placeholder="Tìm thuật ngữ Anh hoặc Việt…" aria-label="Tìm thuật ngữ" data-ch="' + n + '" value="' + esc(glQuery) + '"></div>' +
      '<div id="glBox">' + glossary(n) + '</div></section>' + FOOT + '</div>';
  }

  /* ---------- thanh bên: tiến độ quiz ---------- */
  function renderRail() {
    var b = best(), done = 0, html = "";
    CH.forEach(function (c) {
      var on = b[c.n] != null; if (on) done++;
      html += '<a class="p' + partOf(c.n) + (on ? " on" : "") + '" href="#quiz-' + c.n + '" title="Chương ' + c.n + (on ? " · " + b[c.n] + "/10" : " · chưa làm quiz") + '" aria-label="Quiz chương ' + c.n + (on ? ", điểm cao nhất " + b[c.n] + "/10" : ", chưa làm") + '"></a>';
    });
    document.getElementById("railFoot").innerHTML = '<span class="label">Quiz đã làm <b>' + done + '/' + CH.length + '</b></span><div class="ticks">' + html + '</div>';
  }

  /* ---------- điều hướng ---------- */
  var lastHash = null;
  function route() {
    var h = (location.hash || "#trang-chu").slice(1), m, top = h, html;
    if (h !== lastHash) glQuery = "";
    if ((m = h.match(/^chuong-(\d+)$/)) && ch(+m[1])) { top = "noi-dung"; html = chapter(+m[1]); }
    else if (h === "quiz-tong-hop") { top = "quiz"; html = quizRun("mix"); }
    else if ((m = h.match(/^quiz-(\d+)$/)) && ch(+m[1])) { top = "quiz"; html = quizRun(+m[1]); }
    else if ((m = h.match(/^mindmap-(\d+)$/)) && ch(+m[1])) { top = "mindmap"; html = mindmap(+m[1]); }
    else if (h === "mindmap") html = mindmap(1);
    else if (h === "giang-vien") html = instructor();
    else if (h === "noi-dung") html = contents();
    else if (h === "tai-lieu") html = materials();
    else if (h === "case-study") html = cases();
    else if (h === "quiz") html = quizHome();
    else if (h === "lo-trinh") html = roadmap();
    else { top = "trang-chu"; html = home(); }
    rdReset();
    view.innerHTML = NOTICE + html;
    document.querySelectorAll("#navList a").forEach(function (a) { if (a.getAttribute("href") === "#" + top) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    var cur = document.querySelector("#navList a[aria-current]"), list = document.getElementById("navList");
    if (cur && list.scrollWidth > list.clientWidth) list.scrollLeft = cur.offsetLeft - (list.clientWidth - cur.offsetWidth) / 2;
    renderRail();
    if (h !== lastHash) { try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); } }
    lastHash = h;
  }

  document.getElementById("brandName").textContent = S.courseName;
  document.getElementById("navList").innerHTML = NAV.map(function (n, i) { return '<li><a href="#' + n[0] + '"><i>' + pad(i + 1) + '</i>' + n[1] + '</a></li>'; }).join("");
  view.addEventListener("click", function (e) {
    var t = e.target.closest("[data-case],[data-o],[data-retry],[data-scroll],[data-scope],[data-read],[data-voice]"); if (!t) return;
    if (t.dataset.read || t.dataset.voice) rdAction(t);
    else if (t.dataset.case) { caseFilter = t.dataset.case; route(); }
    else if (t.dataset.retry) { route(); try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (e2) { window.scrollTo(0, 0); } }
    else if (t.dataset.scroll) { var el = document.getElementById(t.dataset.scroll); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else if (t.dataset.scope) {
      glScope = t.dataset.scope;
      t.parentNode.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === t)); });
      document.getElementById("glBox").innerHTML = glossary(+document.getElementById("glSearch").dataset.ch);
    }
    else if (t.dataset.o && !t.disabled) answer(t);
  });
  view.addEventListener("change", function (e) {
    if (e.target.id === "rdRate") { RD.rate = +e.target.value || 1; store("tts-rate", RD.rate); if (RD.audio) RD.audio.playbackRate = RD.rate; }
  });
  view.addEventListener("input", function (e) {
    if (e.target.id === "glSearch") { glQuery = e.target.value; document.getElementById("glBox").innerHTML = glossary(+e.target.dataset.ch); }
  });
  window.addEventListener("hashchange", route);
  route();
})();
