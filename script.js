/* ============================================================
   Ecophy website configuration
   ここだけ編集すれば、商品情報と予約送信先を変更できます。
   ============================================================ */

const PRODUCTS = [
  {
    id: "original-keyholder",
    label: "CUSTOM 01",
    name: "世界に1つだけのオリジナルキーホルダー",
    price: "700円",
    priceNote: "1個当たり",
    description: "お好みに合わせて制作する、世界に1つだけのオリジナル仕様のキーホルダーです。事前予約時に、キーホルダーに印刷する名前をご入力いただきます。",
    requiresReservation: true
  },
  {
    id: "drink",
    label: "DRINK 02",
    name: "飲み物（単体）",
    price: "300円",
    description: "九大祭で提供するドリンクです。複数種類をご用意する予定で、ラインナップは確定次第お知らせします。",
    requiresReservation: false
  },
  {
    id: "keyholder",
    label: "GOODS 03",
    name: "キーホルダー",
    price: "500円",
    priceNote: "1個当たり",
    description: "Ecophyの取り組みを、日常の中で身近に感じてもらうためのキーホルダーです。",
    requiresReservation: false
  },
  {
    id: "drink-keyholder-set",
    label: "SET 04",
    name: "飲み物＋キーホルダーセット",
    price: "600円",
    description: "お好きな飲み物とキーホルダーを一緒に楽しめるセットです。単品で購入するよりお得な価格です。",
    requiresReservation: false
  },
  {
    id: "coaster",
    label: "GOODS 05",
    name: "コースター",
    price: "300円",
    description: "毎日の飲み物時間に使えるコースター。Ecophyらしい素材の背景も一緒に楽しめる製品を目指しています。",
    requiresReservation: false
  },
  {
    id: "drink-cupholder-set",
    label: "SET 06",
    name: "飲み物＋カップホルダーセット",
    price: "700円",
    description: "飲み物とカップホルダーを組み合わせたセットです。九大祭で飲み物を楽しみながら、繰り返し使えるアイテムとして持ち帰れます。",
    requiresReservation: false
  },
  {
    id: "coffee-deodorizer",
    label: "UPCYCLE 07",
    name: "コーヒー由来消臭剤",
    price: "200円",
    description: "コーヒー由来の素材を活用した消臭剤です。身近な未利用資源の新しい使い道を感じていただける商品です。",
    requiresReservation: false
  }
];


const EVENT_INFO = {
  dates: "10月31日（金）・11月1日（土）",
  place: "2301教室",
  reservationDeadline: "2026-09-30"
};

// Ecophy 予約回答の保存先（Google Apps Script Web App）
const RESERVATION_ENDPOINT = "https://script.google.com/macros/s/AKfycbyH_DvQPPWGjc-DbnzHiRGl5-eRIy1AZPY4sRdE_gbAO7Qz4v-c9EVRYIeDgp_qFdvX/exec";

const productGrid = document.querySelector("#product-grid");
const productSelect = document.querySelector("#product-select");

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map((product) => `
    <article class="product-card reveal${product.requiresReservation ? " product-card-reservable" : ""}">
      <div class="product-visual" aria-label="${escapeHtml(product.name)} の商品画像スペース">
        <div class="product-placeholder" aria-hidden="true"></div>
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span class="product-label">${escapeHtml(product.label)}</span>
          <span class="product-price"><strong>${escapeHtml(product.price)}</strong>${product.priceNote ? `<small>${escapeHtml(product.priceNote)}</small>` : ""}</span>
        </div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        ${product.requiresReservation
          ? `<span class="reservation-badge">事前予約が必要です</span><a class="button" href="#reserve" data-product="${escapeHtml(product.id)}">この商品を予約する</a>`
          : `<span class="walkin-badge">予約不要・九大祭当日に販売</span>`}
      </div>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderProducts();

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-product]");
  if (!trigger) return;
  productSelect.value = "original-keyholder";
});

// Mobile navigation
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".global-nav a");
navToggle.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navLinks.forEach((link) => link.addEventListener("click", () => {
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}));

// Header state
const header = document.querySelector(".site-header");
const syncHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

// Reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Reservation form
const form = document.querySelector("#reservation-form");
const dialog = document.querySelector("#confirm-dialog");
const confirmList = document.querySelector("#confirm-list");
const finalSubmit = document.querySelector("#final-submit");
const formStatus = document.querySelector("#form-status");
const dialogNote = document.querySelector("#dialog-note");
let pendingData = null;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const selected = PRODUCTS.find((p) => p.id === data.product);
  pendingData = {
    name: data.name.trim(),
    email: data.email.trim(),
    productId: data.product,
    product: selected ? selected.name : data.product,
    printName: data.print_name.trim(),
    quantity: Number(data.quantity),
    pickupDate: data.pickup_date,
    pickupTime: data.pickup_time,
    note: data.note.trim(),
    submittedAt: new Date().toISOString(),
    eventDates: EVENT_INFO.dates,
    pickupPlace: EVENT_INFO.place
  };

  const rows = [
    ["お名前", pendingData.name],
    ["メール", pendingData.email],
    ["商品", pendingData.product],
    ["個数", `${pendingData.quantity}個`],
    ["キーホルダーに印刷する名前", pendingData.printName],
    ["受取日", pendingData.pickupDate],
    ["受け取り時間帯", pendingData.pickupTime],
    ["備考", pendingData.note || "なし"]
  ];

  confirmList.innerHTML = rows.map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  dialogNote.textContent = "送信すると予約内容がEcophy運営用のGoogleスプレッドシートに登録されます。";
  dialog.showModal();
});

finalSubmit.addEventListener("click", async (event) => {
  event.preventDefault();
  if (!pendingData) return;

  finalSubmit.disabled = true;
  finalSubmit.textContent = "送信中…";

  try {
    await fetch(RESERVATION_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(pendingData)
    });

    dialog.close();
    formStatus.textContent = "予約を送信しました。ありがとうございます。回答はEcophy運営用のGoogleスプレッドシートに保存されます。";
    form.reset();
    pendingData = null;
  } catch (error) {
    console.error(error);
    dialogNote.textContent = "送信できませんでした。時間をおいて再度お試しください。";
  } finally {
    finalSubmit.disabled = false;
    finalSubmit.textContent = "この内容で送信";
  }
});

// Footer year
const year = document.querySelector("#current-year");
year.textContent = new Date().getFullYear();
