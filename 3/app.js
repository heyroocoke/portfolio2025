// HANS TOWER - Local commerce template
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

/* ---------------------------
 * Theme (Light default / Dark optional)
 * - Icon must be centered (layout handled by CSS grid)
 * --------------------------- */
const THEME_KEY = "hans_tower_theme_local"; // "light" | "dark"
let theme = localStorage.getItem(THEME_KEY) || "light";

const ICON_SUN = `
  <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" stroke-width="2" />
  <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
`;
const ICON_MOON = `
  <path d="M21 12.6A7.5 7.5 0 0 1 11.4 3a6.5 6.5 0 1 0 9.6 9.6Z"
    stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
`;

function applyTheme() {
  const root = document.documentElement;
  if (theme === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");

  localStorage.setItem(THEME_KEY, theme);
  syncThemeUI();
}

function syncThemeUI() {
  const icon = $("#themeIcon");
  if (icon) icon.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;

  const label = theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";
  const btn = $("#themeBtn");
  if (btn) {
    btn.setAttribute("aria-label", label);
    btn.setAttribute("aria-pressed", String(theme === "dark"));
  }

  const btn2 = $("#themeBtn2");
  if (btn2) btn2.textContent = theme === "dark" ? "라이트 모드" : "다크 모드";
}

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
}

$("#themeBtn")?.addEventListener("click", toggleTheme);
$("#themeBtn2")?.addEventListener("click", toggleTheme);
applyTheme();

/* ---------------------------
 * Mobile Drawer
 * --------------------------- */
const burger = $("#burger");
const drawer = $("#drawer");

function closeDrawer() {
  if (!drawer || !burger) return;
  drawer.setAttribute("hidden", "");
  burger.setAttribute("aria-expanded", "false");
}
function toggleDrawer() {
  if (!drawer || !burger) return;
  const isOpen = !drawer.hasAttribute("hidden");
  if (isOpen) closeDrawer();
  else {
    drawer.removeAttribute("hidden");
    burger.setAttribute("aria-expanded", "true");
  }
}
burger?.addEventListener("click", toggleDrawer);

// close drawer when clicking a link
$$('.drawer a[href^="#"]').forEach((a) =>
  a.addEventListener("click", closeDrawer)
);

/* ---------------------------
 * Smooth Scroll
 * --------------------------- */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ---------------------------
 * Data
 * --------------------------- */
// 주소는 여기(한 곳)만 바꾸면 페이지 전반의 주소 표기가 함께 변경됩니다.
const ADDRESS = "충청북도 충주시 국원대로 107, HANS TOWER";
const PHONE = "010-0000-0000";

$("#addrLine") && ($("#addrLine").textContent = `주소: ${ADDRESS}`);
$("#addrText2") && ($("#addrText2").textContent = ADDRESS);
$("#phoneText") && ($("#phoneText").textContent = `${PHONE} (예시)`);

// Recommended tags
const BIZ_TAGS = [
  "카페/베이커리",
  "학원/스터디",
  "클리닉",
  "편의점",
  "오피스",
  "쇼룸",
  "미용/네일",
  "피트니스",
];
$("#bizTags") &&
  ($("#bizTags").innerHTML = BIZ_TAGS.map(
    (t) => `<span class="tag">${escapeHtml(t)}</span>`
  ).join(""));

/* ---------------------------
 * Floors (example)
 * --------------------------- */
const FLOORS = {
  B1: {
    title: "B1 | 주차/지원",
    desc: "주차/설비/지원 기능 중심입니다.",
    uses: ["주차장", "설비/창고", "입주자 동선"],
    meta: { 추천: "지원", 동선: "차량", 비고: "시설 운영" },
  },
  "1F": {
    title: "1F | 상가/카페",
    desc: "유동 인구를 흡수하는 핵심 층입니다.",
    uses: ["카페/베이커리", "편의점", "브랜드 쇼룸"],
    meta: { 추천: "상가", 동선: "보행", 비고: "전면 노출" },
  },
  "2F": {
    title: "2F | 서비스/클리닉",
    desc: "재방문형 서비스 업종에 유리합니다.",
    uses: ["클리닉", "미용/네일", "세무/법무"],
    meta: { 추천: "서비스", 동선: "혼합", 비고: "대기공간" },
  },
  "3F": {
    title: "3F | 교육/오피스",
    desc: "학원/스터디/소규모 오피스에 적합합니다.",
    uses: ["학원", "스터디", "소형 오피스"],
    meta: { 추천: "교육/업무", 동선: "예약", 비고: "소음 관리" },
  },
  "4F": {
    title: "4F | 입주형 오피스",
    desc: "업무 밀도가 높은 입주형 층입니다.",
    uses: ["사무실", "공유오피스", "회의실"],
    meta: { 추천: "오피스", 동선: "입주자", 비고: "출입 관리" },
  },
  "5F+": {
    title: "5F+ | 확장/특화",
    desc: "면적/구성에 따라 맞춤 협의가 가능합니다.",
    uses: ["확장 오피스", "스튜디오", "특화 업종"],
    meta: { 추천: "확장", 동선: "선택", 비고: "맞춤 협의" },
  },
};

function renderFloor(key) {
  const box = $("#floorDetail");
  const f = FLOORS[key];
  if (!box || !f) return;

  box.innerHTML = `
    <h3 style="margin:0 0 6px;">${escapeHtml(f.title)}</h3>
    <p style="margin:0; color:var(--muted); font-size:13px;">${escapeHtml(
      f.desc
    )}</p>

    <div class="miniStats" style="margin-top:12px;">
      ${Object.entries(f.meta)
        .map(
          ([k, v]) => `
        <div class="mini">
          <strong>${escapeHtml(k)}</strong>
          <span>${escapeHtml(v)}</span>
        </div>
      `
        )
        .join("")}
    </div>

    <div style="margin-top:12px;">
      <strong style="display:block; font-size:12px; color:var(--muted);">대표 구성(예시)</strong>
      <ul class="check" style="margin-top:8px;">
        ${f.uses.map((u) => `<li>${escapeHtml(u)}</li>`).join("")}
      </ul>
    </div>
  `;
}

$$(".floorBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".floorBtn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderFloor(btn.dataset.floor);
  });
});
renderFloor("B1");

/* ---------------------------
 * FAQ
 * --------------------------- */
const FAQ = [
  {
    q: "임대 문의 시 어떤 정보를 주면 빠르나요?",
    a: "희망 층/면적, 업종, 입주 희망 시기, 방문 가능 시간을 알려주시면 빠르게 안내드립니다.",
  },
  {
    q: "주차는 어떻게 운영되나요?",
    a: "임대 조건/입주 형태에 따라 상이합니다. 방문 상담 시 주차 규정을 안내드립니다.",
  },
  {
    q: "간판/인테리어 규정이 있나요?",
    a: "공용부 안전/미관 기준이 있습니다. 계약 전 가이드 제공이 일반적입니다.",
  },
];

const faqEl = $("#faq");
if (faqEl) {
  faqEl.innerHTML = FAQ.map(
    (item, i) => `
    <div class="faqItem" data-faq="${i}">
      <div class="faqQ" role="button" tabindex="0" aria-expanded="false">
        <strong>${escapeHtml(item.q)}</strong>
        <span style="color:var(--muted);">+</span>
      </div>
      <div class="faqA">${escapeHtml(item.a)}</div>
    </div>
  `
  ).join("");

  $$(".faqItem", faqEl).forEach((it) => {
    const q = $(".faqQ", it);
    const toggle = () => {
      const open = it.classList.toggle("is-open");
      q.setAttribute("aria-expanded", String(open));
      const sign = q.querySelector("span");
      if (sign) sign.textContent = open ? "−" : "+";
    };
    q.addEventListener("click", toggle);
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/* ---------------------------
 * Notices + filter/search
 * --------------------------- */
const NOTICES = [
  {
    id: 1,
    cat: "주차",
    title: "주차장 동선 안내(임시)",
    date: "2025-12-01",
    body: "공사 기간 중 주차장 진입로가 일부 변경됩니다. 안내 표지판을 참고해 주세요.",
  },
  {
    id: 2,
    cat: "시설",
    title: "엘리베이터 정기 점검",
    date: "2025-11-20",
    body: "정기 점검으로 일부 시간대 운행이 제한될 수 있습니다.",
  },
  {
    id: 3,
    cat: "운영",
    title: "관리실 운영시간 안내",
    date: "2025-11-05",
    body: "평일 09:00–18:00 운영(점심시간 12:00–13:00).",
  },
  {
    id: 4,
    cat: "시설",
    title: "공용부 청소 일정",
    date: "2025-10-28",
    body: "매주 수요일 공용부 집중 청소가 진행됩니다.",
  },
  {
    id: 5,
    cat: "주차",
    title: "주차 등록 절차(입주자)",
    date: "2025-10-10",
    body: "차량 등록은 관리실에 서류 제출 후 처리됩니다.",
  },
];

let noticeFilter = "all";
let noticeQuery = "";

function renderNotices() {
  const box = $("#noticeGrid");
  if (!box) return;

  const items = NOTICES.filter((n) =>
    noticeFilter === "all" ? true : n.cat === noticeFilter
  )
    .filter((n) => {
      if (!noticeQuery) return true;
      const q = noticeQuery.toLowerCase();
      return (n.title + " " + n.body + " " + n.cat).toLowerCase().includes(q);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  box.innerHTML = items.length
    ? items
        .map(
          (n) => `
      <article class="card noticeItem">
        <div class="noticeMeta">
          <span>${escapeHtml(n.cat)}</span>
          <span>·</span>
          <span>${escapeHtml(n.date)}</span>
        </div>
        <h3 style="margin-top:8px;">${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.body)}</p>
      </article>
    `
        )
        .join("")
    : `<div class="card"><h3>검색 결과가 없습니다.</h3><p>키워드를 바꾸거나 필터를 해제해 주세요.</p></div>`;
}

renderNotices();

$("#noticeSearch")?.addEventListener("input", (e) => {
  noticeQuery = e.target.value.trim();
  renderNotices();
});

$$(".chipBtn", $("#filters") || document).forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".chipBtn", $("#filters")).forEach((b) =>
      b.classList.remove("is-active")
    );
    btn.classList.add("is-active");
    noticeFilter = btn.dataset.filter;
    renderNotices();
  });
});

/* ---------------------------
 * Copy helpers + Toast
 * --------------------------- */
function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => (t.hidden = true), 1600);
}

async function copyText(text, okMsg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg || "복사되었습니다.");
  } catch {
    alert("복사에 실패했습니다. 직접 복사해 주세요:\n" + text);
  }
}

$("#copyAddr")?.addEventListener("click", () =>
  copyText(ADDRESS, "주소가 복사되었습니다.")
);
$("#copyAddr2")?.addEventListener("click", () =>
  copyText(ADDRESS, "주소가 복사되었습니다.")
);
$("#copyPhone")?.addEventListener("click", () =>
  copyText(PHONE, "대표번호가 복사되었습니다.")
);
$("#copyPhone2")?.addEventListener("click", () =>
  copyText(PHONE, "대표번호가 복사되었습니다.")
);

$("#downloadGuide")?.addEventListener("click", () => {
  alert("안내서(예시) 기능입니다. 실제 PDF 링크로 교체하시면 됩니다.");
});

/* ---------------------------
 * Contact form validation (demo)
 * --------------------------- */
function normalizePhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11)
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (digits.length === 10)
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  return value.trim();
}

$("#phone")?.addEventListener("blur", (e) => {
  e.target.value = normalizePhone(e.target.value);
});

$("#resetForm")?.addEventListener("click", () => {
  $("#contactForm")?.reset();
  toast("초기화되었습니다.");
});

$("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name")?.value.trim();
  const phone = normalizePhone($("#phone")?.value || "");
  const type = $("#type")?.value;
  const msg = $("#msg")?.value.trim();

  const phoneOk = /^0\d{1,2}-\d{3,4}-\d{4}$/.test(phone);

  if (!name) return toast("이름을 입력해 주세요.");
  if (!phoneOk)
    return toast("연락처 형식을 확인해 주세요. (예: 010-1234-5678)");
  if (!msg) return toast("문의 내용을 입력해 주세요.");

  $("#phone").value = phone;
  toast(`접수되었습니다(데모). ${type} 문의로 처리합니다.`);
  e.target.reset();
});

/* ---------------------------
 * Footer year
 * --------------------------- */
$("#year") && ($("#year").textContent = String(new Date().getFullYear()));

/* ---------------------------
 * Utils
 * --------------------------- */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
