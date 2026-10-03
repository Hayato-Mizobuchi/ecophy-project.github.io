/* ============================================================
   Ecophy
   商品一覧・複数商品予約フォーム
   ============================================================ */


/* ============================================================
   九大祭の商品一覧
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
    id: "keyholder",
    label: "GOODS 02",
    name: "キーホルダー（大・小）",
    price: "500円",
    priceNote: "1個当たり",

    description:
      "大・小の2サイズから選べるキーホルダーです。こちらは印刷名なしの仕様です。",

    requiresReservation: true
  },


  {
    id: "drink-cupholder-set",
    label: "SET 03",
    name: "飲み物＋カップホルダーセット",
    price: "700円",

    description:
      "飲み物とカップホルダーを組み合わせたセットです。カップホルダーにはアルファベット5文字以内で名前を印刷できます。",

    requiresReservation: true
  },


  {
    id: "drink-keyholder-set",
    label: "SET 04",
    name: "飲み物＋キーホルダーセット",
    price: "600円",

    description:
      "お好きな飲み物とキーホルダーを一緒に楽しめるセットです。単品で購入するよりお得な価格です。",

    caution:
      "このキーホルダーには、入れる名前を指定することはできませんので、ご注意ください。",

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
    id: "drink",
    label: "DRINK 06",
    name: "飲み物（単体）",
    price: "300円",

    description:
      "九大祭で提供するドリンクです。複数種類をご用意する予定で、ラインナップは確定次第お知らせします。",

    requiresReservation: false
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
   予約できる商品
   ============================================================ */

const RESERVATION_PRODUCTS = {

  "original-keyholder-large": {

    name:
      "世界に1つだけのオリジナルキーホルダー（大）",

    price: 700,

    printName: {

      required: true,

      label:
        "キーホルダーに印刷する名前",

      maxLength: 5,

      pattern:
        "[A-Za-z]{1,5}",

      placeholder:
        "例：ECOPH",

      help:
        "アルファベット5文字以内で入力してください。"

    }

  },


  "original-keyholder-small": {

    name:
      "世界に1つだけのオリジナルキーホルダー（小）",

    price: 700,

    printName: {

      required: true,

      label:
        "キーホルダーに印刷するアルファベット",

      maxLength: 1,

      pattern:
        "[A-Za-z]{1}",

      placeholder:
        "例：E",

      help:
        "アルファベット1文字を入力してください。"

    }

  },


  "keyholder-large": {

    name:
      "キーホルダー（大）",

    price: 500,

    printName: {

      required: false

    }

  },


  "keyholder-small": {

    name:
      "キーホルダー（小）",

    price: 500,

    printName: {

      required: false

    }

  },


  "cupholder-set-06": {

    name:
      "カップホルダー（SET 03）",

    price: 700,

    printName: {

      required: true,

      label:
        "カップホルダーに印刷する名前",

      maxLength: 5,

      pattern:
        "[A-Za-z]{1,5}",

      placeholder:
        "例：ECOPH",

      help:
        "アルファベット5文字以内で入力してください。"

    }

  }

};


/* ============================================================
   イベント情報
   ============================================================ */

const EVENT_INFO = {

  dates:
    "10月31日（金）・11月1日（土）",

  place:
    "2301教室",

  reservationDeadline:
    "2026-10-12"

};


/* ============================================================
   Google Apps Script
   ============================================================ */

const RESERVATION_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyH_DvQPPWGjc-DbnzHiRGl5-eRIy1AZPY4sRdE_gbAO7Qz4v-c9EVRYIeDgp_qFdvX/exec";


/* ============================================================
   共通処理
   ============================================================ */

const productGrid =
  document.querySelector(
    "#product-grid"
  );


function escapeHtml(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


function formatPrice(value) {

  return `${Number(value).toLocaleString("ja-JP")}円`;

}


/* ============================================================
   商品一覧
   ============================================================ */

function renderProducts() {

  if (!productGrid) return;


  productGrid.innerHTML =
    PRODUCTS.map(
      (product) => `

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
              product.caution

                ? `
                  <p class="product-caution">

                    <strong>
                      ご注意
                    </strong>

                    ${escapeHtml(product.caution)}

                  </p>
                `

                : ""
            }


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

      `
    ).join("");

}


renderProducts();


/* ============================================================
   複数商品予約
   ============================================================ */

const reservationItems =
  document.querySelector(
    "#reservation-items"
  );


const addReservationItemButton =
  document.querySelector(
    "#add-reservation-item"
  );


const totalQuantityEl =
  document.querySelector(
    "#reservation-total-quantity"
  );


const grandTotalEl =
  document.querySelector(
    "#reservation-grand-total"
  );


/* ============================================================
   予約商品プルダウン
   ============================================================ */

const RESERVATION_OPTIONS = `

  <option value="">
    選択してください
  </option>

  <option value="original-keyholder-large">
    世界に1つだけのオリジナルキーホルダー（大）
  </option>

  <option value="original-keyholder-small">
    世界に1つだけのオリジナルキーホルダー（小）
  </option>

  <option value="keyholder-large">
    キーホルダー（大）
  </option>

  <option value="keyholder-small">
    キーホルダー（小）
  </option>

  <option value="cupholder-set-06">
    カップホルダー（SET 03）
  </option>

`;


/* ============================================================
   予約商品を1行追加
   ============================================================ */

function createReservationItem(
  initialProductId = ""
) {

  if (!reservationItems) {
    return null;
  }


  const item =
    document.createElement(
      "div"
    );


  item.className =
    "reservation-item";


  item.innerHTML = `

    <div class="reservation-item-head">

      <strong class="reservation-item-title">
        商品
      </strong>


      <button
        class="reservation-item-remove"
        type="button"
        aria-label="この商品を予約から削除"
      >
        削除
      </button>

    </div>


    <div class="reservation-item-fields">

      <label>

        予約商品<span>*</span>

        <select
          class="reservation-item-product"
          required
        >

          ${RESERVATION_OPTIONS}

        </select>

      </label>


      <label>

        個数<span>*</span>

        <input
          class="reservation-item-quantity"
          type="number"
          min="1"
          max="20"
          value="1"
          required
        >

      </label>

    </div>


    <div
      class="reservation-item-print"
      hidden
    >

      <label>

        <span
          class="reservation-item-print-label"
        >
          印刷する名前
        </span>

        <span>*</span>


        <input
          class="reservation-item-print-input"
          type="text"
          inputmode="latin"
          autocapitalize="characters"
          autocomplete="off"
          disabled
        >


        <small
          class="field-help reservation-item-print-help"
        ></small>

      </label>

    </div>


    <div
      class="reservation-item-price"
      aria-live="polite"
    >

      <span>
        小計
      </span>

      <strong
        class="reservation-item-subtotal"
      >
        —
      </strong>

    </div>

  `;


  reservationItems.appendChild(
    item
  );


  const select =
    item.querySelector(
      ".reservation-item-product"
    );


  const quantity =
    item.querySelector(
      ".reservation-item-quantity"
    );


  const removeButton =
    item.querySelector(
      ".reservation-item-remove"
    );


  const printInput =
    item.querySelector(
      ".reservation-item-print-input"
    );


  if (
    initialProductId &&
    RESERVATION_PRODUCTS[
      initialProductId
    ]
  ) {

    select.value =
      initialProductId;

  }


  select.addEventListener(
    "change",
    () => {

      select.setCustomValidity("");

      syncReservationItem(
        item
      );

      syncOrderSummary();

    }
  );


  quantity.addEventListener(
    "input",
    () => {

      syncReservationItem(
        item
      );

      syncOrderSummary();

    }
  );


  quantity.addEventListener(
    "change",
    () => {

      syncReservationItem(
        item
      );

      syncOrderSummary();

    }
  );


  printInput.addEventListener(
    "input",
    () => {

      sanitizeReservationItemPrintName(
        item
      );

    }
  );


  printInput.addEventListener(
    "paste",
    () => {

      window.setTimeout(
        () =>
          sanitizeReservationItemPrintName(
            item
          ),
        0
      );

    }
  );


  removeButton.addEventListener(
    "click",
    () => {

      const allItems =
        reservationItems.querySelectorAll(
          ".reservation-item"
        );


      if (
        allItems.length === 1
      ) {

        resetReservationItem(
          item
        );

      } else {

        item.remove();

      }


      renumberReservationItems();

      syncOrderSummary();

    }
  );


  syncReservationItem(
    item
  );


  renumberReservationItems();


  syncOrderSummary();


  return item;

}


/* ============================================================
   商品行をリセット
   ============================================================ */

function resetReservationItem(
  item
) {

  const select =
    item.querySelector(
      ".reservation-item-product"
    );


  const quantity =
    item.querySelector(
      ".reservation-item-quantity"
    );


  const printInput =
    item.querySelector(
      ".reservation-item-print-input"
    );


  select.value = "";

  select.setCustomValidity("");

  quantity.value = "1";

  printInput.value = "";


  syncReservationItem(
    item
  );

}


/* ============================================================
   商品番号
   ============================================================ */

function renumberReservationItems() {

  if (!reservationItems) {
    return;
  }


  const items =
    reservationItems.querySelectorAll(
      ".reservation-item"
    );


  items.forEach(
    (item, index) => {

      const title =
        item.querySelector(
          ".reservation-item-title"
        );


      const removeButton =
        item.querySelector(
          ".reservation-item-remove"
        );


      title.textContent =
        `商品 ${index + 1}`;


      removeButton.hidden =
        items.length === 1;

    }
  );

}


/* ============================================================
   印刷名を英字のみに制限
   ============================================================ */

function sanitizeReservationItemPrintName(
  item
) {

  const select =
    item.querySelector(
      ".reservation-item-product"
    );


  const input =
    item.querySelector(
      ".reservation-item-print-input"
    );


  if (
    !select ||
    !input ||
    input.disabled
  ) {

    return;

  }


  const config =
    RESERVATION_PRODUCTS[
      select.value
    ]?.printName;


  if (
    !config?.required
  ) {

    return;

  }


  const cleaned =
    input.value

      .replace(
        /[^A-Za-z]/g,
        ""
      )

      .slice(
        0,
        config.maxLength
      );


  if (
    input.value !== cleaned
  ) {

    input.value =
      cleaned;

  }

}


/* ============================================================
   商品選択に応じてフォーム変更
   ============================================================ */

function syncReservationItem(
  item
) {

  const select =
    item.querySelector(
      ".reservation-item-product"
    );


  const quantityInput =
    item.querySelector(
      ".reservation-item-quantity"
    );


  const printWrap =
    item.querySelector(
      ".reservation-item-print"
    );


  const printInput =
    item.querySelector(
      ".reservation-item-print-input"
    );


  const printLabel =
    item.querySelector(
      ".reservation-item-print-label"
    );


  const printHelp =
    item.querySelector(
      ".reservation-item-print-help"
    );


  const subtotalEl =
    item.querySelector(
      ".reservation-item-subtotal"
    );


  const product =
    RESERVATION_PRODUCTS[
      select.value
    ];


  const quantity =
    Math.max(
      1,
      Number(
        quantityInput.value || 1
      )
    );


  if (!product) {

    printWrap.hidden =
      true;

    printInput.disabled =
      true;

    printInput.required =
      false;

    printInput.value =
      "";

    subtotalEl.textContent =
      "—";

    return;

  }


  const config =
    product.printName;


  if (
    config?.required
  ) {

    printWrap.hidden =
      false;

    printInput.disabled =
      false;

    printInput.required =
      true;

    printInput.maxLength =
      config.maxLength;

    printInput.minLength =
      1;

    printInput.pattern =
      config.pattern;

    printInput.placeholder =
      config.placeholder;

    printInput.title =
      config.help;

    printLabel.textContent =
      config.label;


    printHelp.textContent =
      config.help +
      " 同じ商品を異なる名前で予約する場合は「商品を追加」から分けて入力してください。";


    sanitizeReservationItemPrintName(
      item
    );

  } else {

    printWrap.hidden =
      true;

    printInput.disabled =
      true;

    printInput.required =
      false;

    printInput.value =
      "";


    printInput.removeAttribute(
      "maxlength"
    );


    printInput.removeAttribute(
      "minlength"
    );


    printInput.removeAttribute(
      "pattern"
    );


    printInput.removeAttribute(
      "placeholder"
    );


    printInput.removeAttribute(
      "title"
    );

  }


  subtotalEl.textContent =
    formatPrice(
      product.price *
      quantity
    );

}


/* ============================================================
   入力済みの商品を取得
   ============================================================ */

function getReservationOrderItems() {

  if (!reservationItems) {
    return [];
  }


  return Array.from(

    reservationItems.querySelectorAll(
      ".reservation-item"
    )

  ).map(
    (item) => {

      const productId =
        item.querySelector(
          ".reservation-item-product"
        ).value;


      const quantity =
        Math.max(

          1,

          Number(
            item.querySelector(
              ".reservation-item-quantity"
            ).value || 1
          )

        );


      const printName =
        item.querySelector(
          ".reservation-item-print-input"
        ).value.trim();


      const product =
        RESERVATION_PRODUCTS[
          productId
        ];


      if (!product) {
        return null;
      }


      return {

        productId:
          productId,

        product:
          product.name,

        quantity:
          quantity,

        printName:
          printName,

        unitPrice:
          product.price,

        subtotal:
          product.price *
          quantity

      };

    }

  ).filter(Boolean);

}


/* ============================================================
   合計金額
   ============================================================ */

function syncOrderSummary() {

  const items =
    getReservationOrderItems();


  const totalQuantity =
    items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  const grandTotal =
    items.reduce(
      (sum, item) =>
        sum + item.subtotal,
      0
    );


  if (totalQuantityEl) {

    totalQuantityEl.textContent =
      `${totalQuantity}点`;

  }


  if (grandTotalEl) {

    grandTotalEl.textContent =
      formatPrice(
        grandTotal
      );

  }

}


/* ============================================================
   商品カードから予約
   ============================================================ */

function addProductFromCard(
  productId
) {

  const map = {

    "original-keyholder":
      "original-keyholder-large",

    "keyholder":
      "keyholder-large",

    "drink-cupholder-set":
      "cupholder-set-06"

  };


  const reservationProductId =
    map[
      productId
    ];


  if (
    !reservationProductId ||
    !reservationItems
  ) {

    return;

  }


  const currentItems =
    reservationItems.querySelectorAll(
      ".reservation-item"
    );


  if (
    currentItems.length === 1 &&
    !currentItems[0]
      .querySelector(
        ".reservation-item-product"
      ).value
  ) {

    const select =
      currentItems[0]
        .querySelector(
          ".reservation-item-product"
        );


    select.value =
      reservationProductId;


    syncReservationItem(
      currentItems[0]
    );

  } else {

    createReservationItem(
      reservationProductId
    );

  }


  syncOrderSummary();

}


/* ============================================================
   ＋商品を追加
   ============================================================ */

if (
  addReservationItemButton
) {

  addReservationItemButton
    .addEventListener(
      "click",
      () => {

        createReservationItem(
          ""
        );

      }
    );

}


/* 最初の商品欄を作る */
createReservationItem(
  ""
);


/* 商品カードから予約 */
document.addEventListener(
  "click",
  (event) => {

    const trigger =
      event.target.closest(
        "[data-product]"
      );


    if (!trigger) {
      return;
    }


    addProductFromCard(
      trigger.dataset.product
    );

  }
);


/* ============================================================
   スマホメニュー
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

        document.body
          .classList.remove(
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
   ヘッダー
   ============================================================ */

const header =
  document.querySelector(
    ".site-header"
  );


const syncHeader = () => {

  if (!header) {
    return;
  }


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
   表示アニメーション
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


let pendingData =
  null;


/* ============================================================
   内容確認
   ============================================================ */

if (form) {

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (formStatus) {

        formStatus.textContent =
          "";

      }


      reservationItems
        ?.querySelectorAll(
          ".reservation-item"
        )
        .forEach(
          (item) => {

            sanitizeReservationItemPrintName(
              item
            );

            syncReservationItem(
              item
            );

          }
        );


      if (
        !form.checkValidity()
      ) {

        form.reportValidity();

        return;

      }


      const data =
        Object.fromEntries(

          new FormData(
            form
          ).entries()

        );


      const items =
        getReservationOrderItems();


      if (
        items.length === 0
      ) {

        const firstSelect =
          reservationItems
            ?.querySelector(
              ".reservation-item-product"
            );


        if (firstSelect) {

          firstSelect.setCustomValidity(
            "予約商品を選択してください。"
          );


          firstSelect.reportValidity();

        }


        return;

      }


      const totalQuantity =
        items.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );


      const totalPrice =
        items.reduce(
          (sum, item) =>
            sum + item.subtotal,
          0
        );


      const orderSummary =
        items

          .map(
            (item) =>
              `${item.product} ×${item.quantity}`
          )

          .join(
            " / "
          );


      const printNameSummary =
        items

          .filter(
            (item) =>
              item.printName
          )

          .map(
            (item) =>
              `${item.product}: ${item.printName}`
          )

          .join(
            " / "
          );


      pendingData = {

        name:
          data.name.trim(),

        email:
          data.email.trim(),


        productId:
          items.length === 1

            ? items[0].productId

            : "multi-item-order",


        product:
          orderSummary,


        printName:
          printNameSummary,


        quantity:
          totalQuantity,


        unitPrice:
          items.length === 1

            ? items[0].unitPrice

            : "",


        totalPrice:
          totalPrice,


        items:
          items,


        itemsJson:
          JSON.stringify(
            items
          ),


        orderSummary:
          orderSummary,


        pickupDate:
          data.pickup_date,


        pickupTime:
          data.pickup_time,


        note:
          data.note.trim(),


        requestId:
          createReservationRequestId(),

        submittedAt:
          new Date().toISOString(),


        eventDates:
          EVENT_INFO.dates,


        pickupPlace:
          EVENT_INFO.place,


        reservationDeadline:
          EVENT_INFO.reservationDeadline

      };


      /* ======================================================
         確認画面
         ====================================================== */

      const rows = [

        [
          "お名前",
          pendingData.name
        ],

        [
          "メール",
          pendingData.email
        ]

      ];


      items.forEach(
        (item, index) => {

          rows.push(

            [
              `予約商品 ${index + 1}`,
              item.product
            ],

            [
              `商品 ${index + 1}・個数`,
              `${item.quantity}個`
            ]

          );


          if (
            item.printName
          ) {

            rows.push(

              [
                `商品 ${index + 1}・印刷名`,
                item.printName
              ]

            );

          }


          rows.push(

            [
              `商品 ${index + 1}・小計`,
              formatPrice(
                item.subtotal
              )
            ]

          );

        }
      );


      rows.push(

        [
          "合計点数",
          `${totalQuantity}点`
        ],

        [
          "合計金額",
          formatPrice(
            totalPrice
          )
        ],

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
          pendingData.note ||
          "なし"
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
          "送信すると、すべての商品を1件の予約としてEcophy運営用のGoogleスプレッドシートへ登録します。";

      }


      if (dialog) {

        dialog.showModal();

      }

    }
  );

}


/* ============================================================
   予約送信の信頼性向上
   - requestId を同じまま再送することで、サーバー側で重複排除できる
   - サーバーレスポンスを確認してから「予約完了」にする
   - タイムアウト/一時エラー時は状態確認後に再試行する
   ============================================================ */

const RESERVATION_RETRY_CONFIG = {
  maxAttempts: 3,
  requestTimeoutMs: 12000,
  statusTimeoutMs: 8000,
  retryDelaysMs: [1000, 2500]
};


function createReservationRequestId() {

  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return [
    "ecophy",
    Date.now().toString(36),
    Math.random().toString(36).slice(2, 12)
  ].join("-");

}


function wait(ms) {

  return new Promise(
    (resolve) => {
      window.setTimeout(
        resolve,
        ms
      );
    }
  );

}


/* ============================================================
   CORSに依存しない読み取り用 JSONP
   Apps Script ContentService のGET応答確認に使用します。
   ============================================================ */

function fetchReservationJsonp(
  params,
  timeoutMs = 8000
) {

  return new Promise(
    (resolve, reject) => {

      const callbackName =
        "__ecophyJsonp_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
          .toString(36)
          .slice(2, 9);


      const script =
        document.createElement(
          "script"
        );


      const url =
        new URL(
          RESERVATION_ENDPOINT
        );


      Object.entries(
        params || {}
      ).forEach(
        ([key, value]) => {

          url.searchParams.set(
            key,
            String(value)
          );

        }
      );


      url.searchParams.set(
        "callback",
        callbackName
      );


      let finished =
        false;


      const cleanup = () => {

        if (finished) {
          return;
        }


        finished =
          true;


        window.clearTimeout(
          timer
        );


        try {
          delete window[
            callbackName
          ];
        } catch (error) {
          window[
            callbackName
          ] = undefined;
        }


        script.remove();

      };


      window[
        callbackName
      ] = (data) => {

        cleanup();

        resolve(
          data
        );

      };


      script.onerror =
        () => {

          cleanup();

          reject(
            new Error(
              "予約サーバーの状態確認に失敗しました。"
            )
          );

        };


      const timer =
        window.setTimeout(
          () => {

            cleanup();

            reject(
              new Error(
                "予約サーバーの状態確認がタイムアウトしました。"
              )
            );

          },
          timeoutMs
        );


      script.src =
        url.toString();


      script.async =
        true;


      document.head.appendChild(
        script
      );

    }
  );

}


let reliableBackendCapability =
  null;


async function detectReliableReservationBackend() {

  if (
    reliableBackendCapability !== null
  ) {

    return reliableBackendCapability;

  }


  try {

    const result =
      await fetchReservationJsonp(
        {
          action:
            "capabilities"
        },
        6000
      );


    reliableBackendCapability =
      Boolean(
        result &&
        result.success === true &&
        Number(
          result.apiVersion
        ) >= 2 &&
        result.features?.idempotency === true &&
        result.features?.statusCheck === true
      );


  } catch (error) {

    reliableBackendCapability =
      false;

  }


  return reliableBackendCapability;

}


async function fetchWithTimeout(
  url,
  options,
  timeoutMs
) {

  const controller =
    new AbortController();


  const timer =
    window.setTimeout(
      () => {
        controller.abort();
      },
      timeoutMs
    );


  try {

    return await fetch(
      url,
      {
        ...options,
        signal: controller.signal
      }
    );

  } finally {

    window.clearTimeout(
      timer
    );

  }

}


async function parseReservationResponse(
  response
) {

  if (!response) {
    throw new Error(
      "サーバーから応答を取得できませんでした。"
    );
  }


  if (!response.ok) {

    const error =
      new Error(
        `サーバーエラー: HTTP ${response.status}`
      );

    error.retryable =
      response.status >= 500 ||
      response.status === 408 ||
      response.status === 429;

    throw error;

  }


  let result;


  try {

    result =
      await response.json();

  } catch (error) {

    const parseError =
      new Error(
        "予約サーバーから正しいJSON応答を取得できませんでした。"
      );

    parseError.retryable =
      true;

    throw parseError;

  }


  if (
    result &&
    result.success === true
  ) {

    return result;

  }


  const serverError =
    new Error(
      result?.message ||
      "予約サーバーが処理失敗を返しました。"
    );


  serverError.retryable =
    result?.retryable !== false;


  serverError.code =
    result?.code || "";


  throw serverError;

}


async function postReservationOnce(
  payload
) {

  const response =
    await fetchWithTimeout(
      RESERVATION_ENDPOINT,
      {
        method: "POST",

        /*
          Apps Script 側がJSONを返す新版ではレスポンスを読めます。
          Content-Type を text/plain にすることで不要なCORS preflightを避けます。
        */
        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
          "Accept":
            "application/json"
        },

        redirect:
          "follow",

        cache:
          "no-store",

        credentials:
          "omit",

        body:
          JSON.stringify(
            payload
          )
      },
      RESERVATION_RETRY_CONFIG
        .requestTimeoutMs
    );


  return await parseReservationResponse(
    response
  );

}


async function checkReservationStatus(
  requestId
) {

  if (!requestId) {
    return {
      found: false
    };
  }


  const params = {
    action:
      "status",
    requestId
  };


  /*
    まず通常のfetchで確認し、CORS等で読めない場合は
    読み取り専用JSONPにフォールバックします。
  */
  try {

    const url =
      new URL(
        RESERVATION_ENDPOINT
      );


    Object.entries(
      params
    ).forEach(
      ([key, value]) => {

        url.searchParams.set(
          key,
          String(value)
        );

      }
    );


    const response =
      await fetchWithTimeout(
        url.toString(),
        {
          method:
            "GET",

          headers: {
            "Accept":
              "application/json"
          },

          redirect:
            "follow",

          cache:
            "no-store",

          credentials:
            "omit"
        },
        RESERVATION_RETRY_CONFIG
          .statusTimeoutMs
      );


    if (response.ok) {

      const result =
        await response.json();


      if (
        result &&
        result.success === true
      ) {

        return result;

      }

    }


  } catch (error) {

    /* JSONP fallback below */

  }


  try {

    const result =
      await fetchReservationJsonp(
        params,
        RESERVATION_RETRY_CONFIG
          .statusTimeoutMs
      );


    return result &&
      result.success === true
        ? result
        : {
            found: false
          };


  } catch (error) {

    return {
      found: false,
      statusCheckError: true
    };

  }

}


async function sendReservationWithRetry(
  payload,
  onAttempt
) {

  let lastError = null;


  for (
    let attempt = 1;
    attempt <= RESERVATION_RETRY_CONFIG.maxAttempts;
    attempt += 1
  ) {

    if (onAttempt) {
      onAttempt(
        attempt,
        RESERVATION_RETRY_CONFIG.maxAttempts
      );
    }


    try {

      const result =
        await postReservationOnce(
          payload
        );


      return {
        ...result,
        confirmed:
          true,
        attempt
      };


    } catch (error) {

      lastError =
        error;


      /*
        POST がタイムアウトした場合、
        実際にはサーバー側で保存が完了している可能性があります。
        そのため再送前に requestId で状態確認します。
      */
      const status =
        await checkReservationStatus(
          payload.requestId
        );


      if (
        status &&
        status.found === true
      ) {

        return {
          success: true,
          confirmed: true,
          duplicate:
            true,
          reservationId:
            status.reservationId || "",
          requestId:
            payload.requestId,
          attempt
        };

      }


      /*
        入力値エラーなど「再試行しても直らない」エラーは、
        サーバーが retryable:false と返せます。
      */
      if (
        error &&
        error.retryable === false
      ) {

        throw error;

      }


      if (
        attempt <
        RESERVATION_RETRY_CONFIG.maxAttempts
      ) {

        const delay =
          RESERVATION_RETRY_CONFIG
            .retryDelaysMs[
              attempt - 1
            ] || 2500;


        await wait(
          delay
        );

      }

    }

  }


  throw (
    lastError ||
    new Error(
      "予約の完了を確認できませんでした。"
    )
  );

}


/*
  旧Apps Scriptとの一時互換処理。
  新版バックエンド(apiVersion 2)が検出できない間は、
  二重登録防止のため再試行せず「1回だけ」旧方式で送信します。
  この場合は成功を断定せず「確認待ち」と表示します。
*/
async function legacyReservationFallback(
  payload
) {

  await fetch(
    RESERVATION_ENDPOINT,
    {
      method:
        "POST",

      mode:
        "no-cors",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:
        JSON.stringify(
          payload
        )
    }
  );


  return {
    success: true,
    confirmed: false,
    legacyFallback: true,
    requestId:
      payload.requestId
  };

}


/* ============================================================
   最終送信
   ============================================================ */

if (finalSubmit) {

  finalSubmit.addEventListener(

    "click",

    async (event) => {

      event.preventDefault();


      if (!pendingData) {
        return;
      }


      /*
        requestId は同じ予約の再試行中は変えません。
        サーバー側でこのIDを使って二重登録を防止します。
      */
      if (
        !pendingData.requestId
      ) {

        pendingData.requestId =
          createReservationRequestId();

      }


      finalSubmit.disabled =
        true;


      finalSubmit.textContent =
        "送信を確認中…";


      if (dialogNote) {

        dialogNote.textContent =
          "予約内容を送信し、サーバーで登録できたことを確認しています。";

      }


      let result;


      try {

        const reliableBackend =
          await detectReliableReservationBackend();


        if (reliableBackend) {

          result =
            await sendReservationWithRetry(
              pendingData,
              (
                attempt,
                maxAttempts
              ) => {

                finalSubmit.textContent =
                  attempt === 1
                    ? "送信を確認中…"
                    : `再確認中… (${attempt}/${maxAttempts})`;


                if (dialogNote) {

                  dialogNote.textContent =
                    attempt === 1
                      ? "予約内容を送信し、サーバーで登録できたことを確認しています。"
                      : `通信を再確認しています。登録済みの場合は二重登録されません。(${attempt}/${maxAttempts})`;

                }

              }
            );


        } else {

          /*
            新版バックエンドが確認できない間は再送を行いません。
            旧バックエンドへの複数回POSTで二重予約を作らないためです。
          */
          console.warn(
            "Reliable reservation backend v2 is not active; using one-time legacy submission without retry."
          );


          result =
            await legacyReservationFallback(
              pendingData
            );

        }


        if (dialog) {

          dialog.close();

        }


        if (
          result.confirmed === true
        ) {

          const reservationId =
            result.reservationId
              ? ` 受付番号：${result.reservationId}`
              : "";


          if (formStatus) {

            formStatus.textContent =
              `予約を受け付けました。サーバーへの登録を確認済みです。${reservationId}`;

          }


          if (form) {

            form.reset();

          }


          if (reservationItems) {

            reservationItems.innerHTML =
              "";


            createReservationItem(
              ""
            );

          }


          pendingData =
            null;


        } else {

          /*
            旧方式ではサーバー保存の成否を断定できないため、
            入力内容を保持します。
          */
          if (formStatus) {

            formStatus.textContent =
              "予約データは送信しましたが、サーバーから登録確認を取得できませんでした。入力内容は保持しています。時間をおいて再確認してください。";

          }


          if (dialogNote) {

            dialogNote.textContent =
              "送信は行いましたが、登録完了レスポンスを確認できませんでした。新版Apps Scriptへの更新後は自動確認・再試行が有効になります。";

          }

        }


      } catch (error) {

        console.error(
          error
        );


        if (dialogNote) {

          dialogNote.textContent =
            "予約の登録を確認できませんでした。入力内容は保持されています。通信環境を確認して、もう一度お試しください。";

        }


        if (formStatus) {

          formStatus.textContent =
            "予約はまだ完了していません。入力内容は保持されています。";

        }


      } finally {

        finalSubmit.disabled =
          false;


        finalSubmit.textContent =
          "この内容で送信";

      }

    }

  );

}


/* ============================================================
   フッターの年
   ============================================================ */

const year =
  document.querySelector(
    "#current-year"
  );


if (year) {

  year.textContent =
    new Date().getFullYear();

}
