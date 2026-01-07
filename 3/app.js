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
let drawerCloseTimer = 0;

function closeDrawer() {
  if (!drawer || !burger) return;
  drawer.classList.remove("is-open");
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  drawer.setAttribute("aria-hidden", "true");

  clearTimeout(drawerCloseTimer);
  const hide = () => {
    if (drawer.classList.contains("is-open")) return;
    drawer.setAttribute("hidden", "");
  };

  const onEnd = (e) => {
    if (e.target !== drawer) return;
    drawer.removeEventListener("transitionend", onEnd);
    hide();
  };
  drawer.addEventListener("transitionend", onEnd);
  drawerCloseTimer = setTimeout(hide, 260); // fallback
}
function toggleDrawer() {
  if (!drawer || !burger) return;
  const isOpen = !drawer.hasAttribute("hidden");
  if (isOpen) closeDrawer();
  else {
    drawer.removeAttribute("hidden");
    burger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    clearTimeout(drawerCloseTimer);
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      burger.classList.add("is-open");
    });
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
 * Scroll to top
 * --------------------------- */
const toTopBtn = $("#toTop");
if (toTopBtn) {
  const THRESHOLD = 520; // px
  let visible = false;
  let ticking = false;

  function setVisible(next) {
    visible = next;
    toTopBtn.classList.toggle("is-visible", next);
    toTopBtn.setAttribute("aria-hidden", String(!next));
    if (next) toTopBtn.removeAttribute("tabindex");
    else toTopBtn.setAttribute("tabindex", "-1");
  }

  function update() {
    const next = window.scrollY > THRESHOLD;
    if (next !== visible) setVisible(next);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    },
    { passive: true }
  );

  toTopBtn.addEventListener("click", () => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  update();
}

/* ---------------------------
 * Data
 * --------------------------- */
// 주소는 여기(한 곳)만 바꾸면 페이지 전반의 주소 표기가 함께 변경됩니다.
const ADDRESS = "충청북도 충주시 국원대로 107, HANS TOWER";
const PHONE = "010-0000-0000";

$("#addrLine") && ($("#addrLine").textContent = `주소: ${ADDRESS}`);
$("#addrText2") && ($("#addrText2").textContent = ADDRESS);
$("#addrText3") && ($("#addrText3").textContent = ADDRESS);
$("#phoneText") && ($("#phoneText").textContent = PHONE);
$("#phoneText2") && ($("#phoneText2").textContent = PHONE);

// 전화 링크는 PHONE 값만 바꾸면 자동으로 함께 변경됩니다.
const TEL_HREF = `tel:${PHONE.replace(/\D/g, "")}`;
$$('[data-call="phone"]').forEach((a) => a.setAttribute("href", TEL_HREF));

// Recommended tags
const BIZ_TAGS = [
  "카페/베이커리",
  "학원/스터디",
  "클리닉",
  "오피스",
  "쇼룸",
  "미용/네일",
];
$("#bizTags") &&
  ($("#bizTags").innerHTML = BIZ_TAGS.map(
    (t) => `<span class="tag">${escapeHtml(t)}</span>`
  ).join(""));

/* ---------------------------
 * Floors (example)
 * --------------------------- */
const FLOORS = {
  "B1~B2": {
    title: "B1~B2 | 주차장",
    desc: "주차장 완비",
    tenants: [
      {
        name: "지하 주차장",
        category: "주차",
        desc: "건물 내 지하 주차 공간",
        img: "./images/tower.jpeg",
      },
      {
        name: "지상 주차장",
        category: "주차",
        desc: "건물 옆 지상 주차 공간",
        img: "./images/tower.jpeg",
      },
    ],
  },
  "1F": {
    title: "1F | 상가",
    desc: "1층 상가 라인",
    tenants: [
      {
        name: "입주 상가 1",
        category: "상가",
        desc: "업장명/업종/사진을 주시면 실제 정보로 교체해드릴게요.",
        img: "./images/tower.jpeg",
      },
      {
        name: "입주 상가 2",
        category: "상가",
        desc: "업장명/업종/사진을 주시면 실제 정보로 교체해드릴게요.",
        img: "./images/tower.jpeg",
      },
    ],
  },
  "2F": {
    title: "2F | 나이스 롤러장",
    desc: "실내 롤러스케이트 공간",
    tenants: [
      {
        name: "나이스 롤러장",
        category: "롤러장",
        desc: "가족/친구와 즐기는 실내 레저 공간",
        img: "./images/tenants/nice-roller.jpg",
      },
    ],
  },
  "3F": {
    title: "3F | 나이스 볼링장",
    desc: "쾌적한 실내 볼링장",
    tenants: [
      {
        name: "나이스 볼링장",
        category: "볼링장",
        desc: "단체 모임/동호회 이용 추천",
        img: "./images/tenants/nice-bowling.jpg",
      },
    ],
  },
  "4F": {
    title: "4F | 나이스 볼링장",
    desc: "추가 레인/공간",
    tenants: [
      {
        name: "나이스 볼링장(확장)",
        category: "볼링장",
        desc: "추가 레인/대기 공간 운영",
        img: "./images/tenants/nice-bowling-2.jpg",
      },
    ],
  },
  "5F+": {
    title: "5F+ | CGV충주교현",
    desc: "영화관",
    tenants: [
      {
        name: "CGV 충주교현",
        category: "영화관",
        desc: "최신 영화 상영",
        img: "./images/tenants/cgv.jpg",
      },
    ],
  },
};

function renderFloor(key) {
  const box = $("#floorDetail");
  const f = FLOORS[key];
  if (!box || !f) return;

  const fallbackImg = "./images/tower.jpeg";
  const tenants = Array.isArray(f.tenants) ? f.tenants : [];

  box.innerHTML = `
    <div class="floorDetailHead">
      <div>
        <h3 class="floorTitle">${escapeHtml(f.title)}</h3>
        <p class="floorDesc">${escapeHtml(f.desc || "")}</p>
      </div>
      <span class="floorCount">${
        tenants.length ? `${tenants.length}개 업장` : "입주 업장 정보"
      }</span>
    </div>

    ${
      tenants.length
        ? `<div class="tenantGrid">
            ${tenants
              .map(
                (t) => `
              <article class="tenantCard">
                <div class="tenantImg">
                  <img
                    src="${escapeHtml(t.img || fallbackImg)}"
                    alt="${escapeHtml(t.name)} 사진"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${fallbackImg}'"
                  />
                </div>
                <div class="tenantBody">
                  <div class="tenantTop">
                    <strong class="tenantName">${escapeHtml(t.name)}</strong>
                    ${
                      t.category
                        ? `<span class="tenantTag">${escapeHtml(
                            t.category
                          )}</span>`
                        : ""
                    }
                  </div>
                  ${
                    t.desc
                      ? `<p class="tenantDesc">${escapeHtml(t.desc)}</p>`
                      : ""
                  }
                </div>
              </article>
            `
              )
              .join("")}
          </div>`
        : `<div class="tenantEmpty">
            <strong>입주 업장 정보를 준비 중입니다.</strong>
            <p class="muted">원하시면 업장명/업종/사진을 주시면 이 섹션에 바로 반영해드릴게요.</p>
          </div>`
    }
  `;
}

$$(".floorBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".floorBtn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderFloor(btn.dataset.floor);
  });
});
// 초기 로딩 시: 현재 활성 버튼의 data-floor로 렌더 (키가 바뀌어도 안전)
const initialFloor = $(".floorBtn.is-active")?.dataset.floor;
renderFloor(initialFloor || Object.keys(FLOORS)[0]);

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
