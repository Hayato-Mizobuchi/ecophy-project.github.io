/* ============================================================
   Ecophy website configuration
   商品情報・予約商品・予約送信先を管理します。
   ============================================================ */

const PRODUCTS = [
  {
    id: "original-keyholder",
    label: "CUSTOM 01",
    name: "世界に1つだけのオリジナルキーホルダー（大・小）",
    price: "700円",
    priceNote: "1個当たり",
    description:
      "大・小の2サイズから選べるオリジナルキーホルダーです。大はアルファベット5文字以内、小はアルファベット1文字を印刷できます。",
    requiresReservation: true
  },
  {
    id: "drink",
    label: "DRINK 02",
    name: "飲み物（単体）",
    price: "300円",
    description:
      "九大祭で提供するドリンクです。複数種類をご用意する予定で、ラインナップは確定次第お知らせします。",
    requiresReservation: false
  },
  {
    id: "keyholder",
    label: "GOODS 03",
    name: "キーホルダー（大・小）",
    price: "500円",
    priceNote: "1個当たり",
    description:
      "大・小の2サイズから選べるキーホルダーです。こちらは印刷名なしの仕様です。",
    requiresReservation: true
  },
  {
    id: "drink-keyholder-set",
    label: "SET 04",
    name: "飲み物＋キーホルダーセット",
    price: "600円",
    description:
      "お好きな飲み物とキーホルダーを一緒に楽しめるセットです。単品で購入するよりお得な価格です。",
    requiresReservation: false
  },
  {
    id: "coaster",
    label: "GOODS 05",
    name: "コースター",
    price: "300円",
    description:
      "毎日の飲み物時間に使えるコースター。Ecophyらしい素材の背景も一緒に楽しめる製品を目指しています。",
    requiresReservation: false
  },
  {
    id: "drink-cupholder-set",
    label: "SET 06",
    name: "飲み物＋カップホルダーセット",
    price: "700円",
    description:
      "飲み物とカップホルダーを組み合わせたセットです。カップホルダーにはアルファベット5文字以内で名前を印刷できます。",
    requiresReservation: true
  },
  {
    id: "coffee-deodorizer",
    label: "UPCYCLE 07",
    name: "コーヒー由来消臭剤",
    price: "200円",
    description:
      "コーヒー由来の素材を活用した消臭剤です。身近な未利用資源の新しい使い道を感じていただける商品です。",
    requiresReservation: false
  }
];


/* ============================================================
   予約フォームで選択できる商品
   ============================================================ */

const RESERVATION_PRODUCTS = {

  "original-keyholder-large": {
    name: "世界に1つだけのオリジナルキーホルダー（大）",
    printName: {
      required: true,
      label: "キーホルダーに印刷する名前",
      maxLength: 5,
      pattern: "[A-Za-z]{1,5}",
      placeholder: "例：ECOPH",
      help: "アルファベット5文字以内で入力してください。"
    }
  },

  "original-keyholder-small": {
    name: "世界に1つだけのオリジナルキーホルダー（小）",
    printName: {
      required: true,
      label: "キーホルダーに印刷するアルファベット",
      maxLength: 1,
      pattern: "[A-Za-z]{1}",
      placeholder: "例：E",
      help: "アルファベット1文字を入力してください。"
    }
  },

  "keyholder-large": {
    name: "キーホルダー（大）",
    printName: {
      required: false
    }
  },

  "keyholder-small": {
    name: "キーホルダー（小）",
    printName: {
      required: false
    }
  },

  "cupholder-set-06": {
    name: "カップホルダーセット（商品No.6）",
    printName: {
      required: true,
      label: "カップホルダーに印刷する名前",
      maxLength: 5,
      pattern: "[A-Za-z]{1,5}",
      placeholder: "例：ECOPH",
      help: "アルファベット5文字以内で入力してください。"
    }
  }

};


/* ============================================================
   九大祭情報
   ============================================================ */

const EVENT_INFO = {
  dates: "10月31日（金）・11月1日（土）",
  place: "2301教室",
  reservationDeadline: "2026-10-12"
};


/* ============================================================
   Google Apps Script 予約送信先
   ============================================================ */

const RESERVATION_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyH_DvQPPWGjc-DbnzHiRGl5-eRIy1AZPY4sRdE_gbAO7Qz4v-c9EVRYIeDgp_qFdvX/exec";


/* ============================================================
   HTML取得
   ============================================================ */

const productGrid =
  document.querySelector("#product-grid");

const productSelect =
  document.querySelector("#product-select");


/* ============================================================
   HTMLエスケープ
   ============================================================ */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* ============================================================
   商品一覧を表示
   ============================================================ */

function renderProducts() {

  if (!productGrid) return;


  productGrid.innerHTML =
    PRODUCTS.map((product) => `

      <article
        class="product-card reveal${
          product.requiresReservation
            ? " product-card-reservable"
            : ""
        }"
      >

        <div
          class="product-visual"
          aria-label="${escapeHtml(product.name)} の商品画像スペース"
        >
          <div
            class="product-placeholder"
            aria-hidden="true"
          ></div>
        </div>


        <div class="product-body">

          <div class="product-meta">

            <span class="product-label">
              ${escapeHtml(product.label)}
            </span>

            <span class="product-price">

              <strong>
                ${escapeHtml(product.price)}
              </strong>

              ${
                product.priceNote
                  ? `<small>${escapeHtml(product.priceNote)}</small>`
                  : ""
              }

            </span>

          </div>


          <h3>
            ${escapeHtml(product.name)}
          </h3>


          <p>
            ${escapeHtml(product.description)}
          </p>


          ${
            product.requiresReservation

              ? `
                <span class="reservation-badge">
                  事前予約できます
                </span>

                <a
                  class="button"
                  href="#reserve"
                  data-product="${escapeHtml(product.id)}"
                >
                  この商品を予約する
                </a>
              `

              : `
                <span class="walkin-badge">
                  予約不要・九大祭当日に販売
                </span>
              `
          }

        </div>

      </article>

    `).join("");

}


renderProducts();


/* ============================================================
   印刷名入力欄
   ============================================================ */

const printNameRow =
  document.querySelector("#print-name-row");

const printNameInput =
  document.querySelector("#print-name-input");

const printNameLabel =
  document.querySelector("#print-name-label");

const printNameHelp =
  document.querySelector("#print-name-help");


/* ============================================================
   印刷名から英字以外を除外
   ============================================================ */

function sanitizePrintName() {

  if (!printNameInput) return;

  if (printNameInput.disabled) return;

  if (!productSelect) return;


  const product =
    RESERVATION_PRODUCTS[
      productSelect.value
    ];


  if (
    !product ||
    !product.printName ||
    !product.printName.required
  ) {
    return;
  }


  const maxLength =
    product.printName.maxLength;


  const cleaned =
    printNameInput.value
      .replace(/[^A-Za-z]/g, "")
      .slice(0, maxLength);


  if (
    printNameInput.value !== cleaned
  ) {

    printNameInput.value =
      cleaned;

  }

}


/* ============================================================
   商品に応じて印刷名欄を切り替える
   ============================================================ */

function syncReservationFields() {

  if (
    !productSelect ||
    !printNameRow ||
    !printNameInput ||
    !printNameLabel ||
    !printNameHelp
  ) {
    return;
  }


  const selectedProduct =
    RESERVATION_PRODUCTS[
      productSelect.value
    ];


  const config =
    selectedProduct?.printName;


  /* --------------------------------------------
     印刷名が不要な商品
     -------------------------------------------- */

  if (!config?.required) {

    printNameRow.hidden = true;

    printNameInput.disabled = true;

    printNameInput.required = false;

    printNameInput.value = "";

    printNameInput.removeAttribute(
      "maxlength"
    );

    printNameInput.removeAttribute(
      "minlength"
    );

    printNameInput.removeAttribute(
      "pattern"
    );

    printNameInput.removeAttribute(
      "placeholder"
    );

    printNameInput.removeAttribute(
      "title"
    );

    return;

  }


  /* --------------------------------------------
     印刷名が必要な商品
     -------------------------------------------- */

  printNameRow.hidden = false;

  printNameInput.disabled = false;

  printNameInput.required = true;

  printNameInput.maxLength =
    config.maxLength;

  printNameInput.minLength = 1;

  printNameInput.pattern =
    config.pattern;

  printNameInput.placeholder =
    config.placeholder;

  printNameInput.title =
    config.help;

  printNameLabel.textContent =
    config.label;


  printNameHelp.textContent =
    config.help +
    " 複数個で異なる文字・名前をご希望の場合は、備考欄にそれぞれご記入ください。";


  sanitizePrintName();

}


/* ============================================================
   予約商品を変更したとき
   ============================================================ */

if (productSelect) {

  productSelect.addEventListener(
    "change",
    () => {

      productSelect.setCustomValidity("");

      syncReservationFields();

    }
  );

}


/* ============================================================
   印刷名入力時
   ============================================================ */

if (printNameInput) {

  printNameInput.addEventListener(
    "input",
    sanitizePrintName
  );


  printNameInput.addEventListener(
    "paste",
    () => {

      window.setTimeout(
        sanitizePrintName,
        0
      );

    }
  );

}


syncReservationFields();


/* ============================================================
   商品カードの「予約する」から予約フォームへ
   ============================================================ */

document.addEventListener(
  "click",
  (event) => {

    const trigger =
      event.target.closest(
        "[data-product]"
      );


    if (!trigger) return;

    if (!productSelect) return;


    const productId =
      trigger.dataset.product;


    /* --------------------------------------------
       CUSTOM 01
       オリジナルキーホルダー
       → 初期値は「大」
       -------------------------------------------- */

    if (
      productId ===
      "original-keyholder"
    ) {

      productSelect.value =
        "original-keyholder-large";

    }


    /* --------------------------------------------
       GOODS 03
       通常キーホルダー
       → 初期値は「大」
       -------------------------------------------- */

    if (
      productId ===
      "keyholder"
    ) {

      productSelect.value =
        "keyholder-large";

    }


    /* --------------------------------------------
       SET 06
       カップホルダーセット
       -------------------------------------------- */

    if (
      productId ===
      "drink-cupholder-set"
    ) {

      productSelect.value =
        "cupholder-set-06";

    }


    syncReservationFields();

  }
);


/* ============================================================
   スマホ用ナビゲーション
   ============================================================ */

const navToggle =
  document.querySelector(
    ".nav-toggle"
  );

const navLinks =
  document.querySelectorAll(
    ".global-nav a"
  );


if (navToggle) {

  navToggle.addEventListener(
    "click",
    () => {

      const open =
        document.body.classList.toggle(
          "nav-open"
        );


      navToggle.setAttribute(
        "aria-expanded",
        String(open)
      );

    }
  );

}


navLinks.forEach(
  (link) => {

    link.addEventListener(
      "click",
      () => {

        document.body.classList.remove(
          "nav-open"
        );


        if (navToggle) {

          navToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

  }
);


/* ============================================================
   ヘッダー表示
   ============================================================ */

const header =
  document.querySelector(
    ".site-header"
  );


const syncHeader = () => {

  if (!header) return;


  header.classList.toggle(
    "scrolled",
    window.scrollY > 24
  );

};


syncHeader();


window.addEventListener(
  "scroll",
  syncHeader,
  {
    passive: true
  }
);


/* ============================================================
   スクロール表示アニメーション
   ============================================================ */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


if (
  "IntersectionObserver" in window
) {

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target
                .classList.add(
                  "is-visible"
                );


              revealObserver
                .unobserve(
                  entry.target
                );

            }

          }
        );

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element.classList.add(
        "is-visible"
      );

    }
  );

}


/* ============================================================
   予約フォーム
   ============================================================ */

const form =
  document.querySelector(
    "#reservation-form"
  );

const dialog =
  document.querySelector(
    "#confirm-dialog"
  );

const confirmList =
  document.querySelector(
    "#confirm-list"
  );

const finalSubmit =
  document.querySelector(
    "#final-submit"
  );

const formStatus =
  document.querySelector(
    "#form-status"
  );

const dialogNote =
  document.querySelector(
    "#dialog-note"
  );


let pendingData = null;


/* ============================================================
   予約内容確認
   ============================================================ */

if (form) {

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (formStatus) {

        formStatus.textContent = "";

      }


      sanitizePrintName();


      if (!form.checkValidity()) {

        form.reportValidity();

        return;

      }


      const data =
        Object.fromEntries(
          new FormData(form).entries()
        );


      const selected =
        RESERVATION_PRODUCTS[
          data.product
        ];


      if (!selected) {

        if (productSelect) {

          productSelect.setCustomValidity(
            "予約商品を選択してください。"
          );


          productSelect.reportValidity();

        }

        return;

      }


      if (productSelect) {

        productSelect.setCustomValidity("");

      }


      const printName =
        (
          data.print_name || ""
        ).trim();


      pendingData = {

        name:
          data.name.trim(),

        email:
          data.email.trim(),

        productId:
          data.product,

        product:
          selected.name,

        printName:
          printName,

        quantity:
          Number(
            data.quantity
          ),

        pickupDate:
          data.pickup_date,

        pickupTime:
          data.pickup_time,

        note:
          data.note.trim(),

        submittedAt:
          new Date().toISOString(),

        eventDates:
          EVENT_INFO.dates,

        pickupPlace:
          EVENT_INFO.place,

        reservationDeadline:
          EVENT_INFO.reservationDeadline

      };


      /* --------------------------------------------
         確認画面
         -------------------------------------------- */

      const rows = [

        [
          "お名前",
          pendingData.name
        ],

        [
          "メール",
          pendingData.email
        ],

        [
          "予約商品",
          pendingData.product
        ],

        [
          "個数",
          `${pendingData.quantity}個`
        ]

      ];


      /* 印刷名がある商品のみ表示 */

      if (
        selected.printName?.required
      ) {

        rows.push(
          [
            selected.printName.label,
            pendingData.printName
          ]
        );

      }


      rows.push(

        [
          "受取日",
          pendingData.pickupDate
        ],

        [
          "受け取り時間帯",
          pendingData.pickupTime
        ],

        [
          "備考",
          pendingData.note || "なし"
        ]

      );


      if (confirmList) {

        confirmList.innerHTML =
          rows
            .map(
              ([key, value]) => `

                <div>
                  <dt>
                    ${escapeHtml(key)}
                  </dt>

                  <dd>
                    ${escapeHtml(value)}
                  </dd>
                </div>

              `
            )
            .join("");

      }


      if (dialogNote) {

        dialogNote.textContent =
          "送信すると予約内容がEcophy運営用のGoogleスプレッドシートに登録されます。";

      }


      if (dialog) {

        dialog.showModal();

      }

    }
  );

}


/* ============================================================
   最終送信
   ============================================================ */

if (finalSubmit) {

  finalSubmit.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();


      if (!pendingData) return;


      finalSubmit.disabled = true;

      finalSubmit.textContent =
        "送信中…";


      try {

        await fetch(
          RESERVATION_ENDPOINT,
          {

            method: "POST",

            mode: "no-cors",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(
                pendingData
              )

          }
        );


        if (dialog) {

          dialog.close();

        }


        if (formStatus) {

          formStatus.textContent =
            "予約を送信しました。ありがとうございます。回答はEcophy運営用のGoogleスプレッドシートに保存されます。";

        }


        if (form) {

          form.reset();

        }


        if (productSelect) {

          productSelect.value = "";

          productSelect
            .setCustomValidity("");

        }


        syncReservationFields();


        pendingData = null;


      } catch (error) {

        console.error(error);


        if (dialogNote) {

          dialogNote.textContent =
            "送信できませんでした。時間をおいて再度お試しください。";

        }


      } finally {

        finalSubmit.disabled = false;

        finalSubmit.textContent =
          "この内容で送信";

      }

    }
  );

}


/* ============================================================
   フッターの西暦
   ============================================================ */

const year =
  document.querySelector(
    "#current-year"
  );


if (year) {

  year.textContent =
    new Date().getFullYear();

}
