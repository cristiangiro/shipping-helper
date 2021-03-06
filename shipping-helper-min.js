//shippinghelper v0.2 by cristiangiro see documentation on GitHub https://github.com/cristiangiro/shipping-helper
"use strict";
const container = document.querySelector(".cart"),
  checkoutButton = document.querySelector(".btn.cart__checkout"),
  defaultOption = "-Choose an option-",
  disableCheckoutButton = !0,
  daysOffRisp = "No delivery this date",
  shippingDateTime = [
    [
      "Delivery",
      {
        delayD: 0,
        timeSlots: [
          [11.3, 13],
          [13, 15],
          [18.15, 19],
          [22, 23],
          [23, 24],
        ],
        lastOrder: 19,
        daysOff: ["2020-12-31"],
        delayH: 1,
      },
    ],
    [
      "Pick-up",
      {
        delayD: 0,
        delayH: 1,
        timeSlots: 3,
        startTime: 12,
        endTime: 23,
        lastOrder: 22,
        daysOff: [2, 3],
      },
    ],
  ],
  locale = !1,
  localeOptions = !1,
  maxDaysDate = !1;
let dateValid = void 0,
  timeValid = void 0,
  deliveryMetValid = void 0,
  deliveryMethods = "";
checkoutButton.insertAdjacentHTML(
  "beforebegin",
  `<div class="btn newbutton" style="display:none">${checkoutButton.innerHTML}</div>`
);
const newButton = document.querySelector(".newbutton");
function f_disabledCheckout() {
  function e(e) {
    "newB" === e
      ? ((newButton.style.display = "inline-block"),
        (checkoutButton.style.display = "none"))
      : "oldB" === e &&
        ((newButton.style.display = "none"),
        (checkoutButton.style.display = "inline-block"));
  }
  dateValid && timeValid
    ? e("oldB")
    : (e("newB"),
      newButton.addEventListener("click", function () {
        function e(e) {
          e.classList.add("attention"),
            e.addEventListener("animationend", (e) =>
              e.target.classList.remove("attention")
            );
        }
        1 != dateValid && e(datePicker),
          1 != timeValid && e(select),
          1 != deliveryMetValid && e(instancesDeliveryMethods);
      }));
}
f_disabledCheckout();
for (const e of shippingDateTime)
  deliveryMethods += `<label class="radiobutton deliverymethods" for="${e[0]}">\n       <input class="radio" type="radio" id="${e[0]}" name="Method" value="${e[0]}">${e[0]}</label>`;
function f_reset(e) {
  "datepick" === e &&
    ((extSelect.style.visibility = "hidden"),
    (validator.className = "validate"),
    (datePicker.value = ""),
    (inConvertedDate.value = ""),
    (dateValid = !1),
    f_disabledCheckout()),
    ("datepick" !== e && "timeslot" !== e) ||
      ((extSelect.style.visibility = "hidden"),
      (timeValid = !1),
      f_disabledCheckout());
}
function f_ms(e = 0, t = 0, i = 0) {
  return (
    24 * Math.trunc(e) * 60 * 60 * 1e3 +
    60 *
      (Number((e % 1).toFixed(4).substring(2, 4)) + Math.trunc(t)) *
      60 *
      1e3 +
    60 * (Number((t % 1).toFixed(4).substring(2, 4)) + i) * 1e3
  );
}
container.insertAdjacentHTML(
  "afterbegin",
  ` <div class="ext">\n      <label class="caption">Shipping method</label>\n      <div class="container_deliverymethods">\n      ${deliveryMethods}\n      </div>\n    </div>\n    <div class="ext ext-datepicker" style="visibility:hidden">\n      <label class="caption">Choose a Date</label>\n      <div><input type="date" class="datepicker-btn" required ><span class="validate"></span></div>\n      <input type="text" class="converteddate" name="Date" style="display:none" readonly>\n    </div>\n    <div class="ext ext-select" style="visibility:hidden">\n      <label class="caption">Choose a Time</label>\n      <select class="btn--secondary" id="select" autocomplete="off" name="Time">\n      </select>\n    </div>\n    `
);
const instancesDeliveryMethods = document.querySelector(
    ".container_deliverymethods"
  ),
  validator = document.querySelector(".validate");
let choosenDeliveryM = "";
function checkDeliveryMethods(e) {
  (validator.className = "validate"),
    (deliveryMetValid = !0),
    (choosenDeliveryM = e.target.value),
    f_reset("datepick"),
    showDatePicker(e.target.value);
}
instancesDeliveryMethods.addEventListener("change", checkDeliveryMethods);
let addNDay = 0;
function showDatePicker(e) {
  addNDay = 0;
  for (const t of shippingDateTime)
    if (t[0] === e) {
      const e = t[1],
        i = e.timeSlots,
        a = f_ms(0, e.delayH);
      return (
        "number" == typeof i &&
          f_ms(0, e.endTime) < now + a + f_ms(0, i) &&
          (addNDay = 1),
        "object" == typeof i &&
          f_ms(0, i[i.length - 1][0]) < now + a &&
          (addNDay = 1),
        now > f_ms(0, e.lastOrder) && (addNDay = 2),
        e.delayD && (addNDay = e.delayD),
        void dateMinMax(addNDay)
      );
    }
}
const datePicker = document.querySelector(".datepicker-btn"),
  extDatePicker = document.querySelector(".ext-datepicker"),
  inConvertedDate = document.querySelector(".converteddate"),
  day = new Date();
day.setHours(0, 0, 0, 0);
const today = day.getTime(),
  nowraw = new Date(),
  hours = nowraw.getHours(),
  minutes = nowraw.getMinutes(),
  now = f_ms(0, hours) + f_ms(0, 0, minutes);
let max = new Date(today + f_ms(364)),
  min = new Date();
function dateMinMax(e) {
  f_reset("datepick"),
    min.setTime(today + f_ms(e)),
    !0 === jqui
      ? ($(".datepicker-btn").datepicker("option", "minDate", e),
        $(".datepicker-btn").datepicker("option", "maxDate", 364))
      : ((datePicker.min = min.toISOString().slice(0, 10)),
        (datePicker.max = max.toISOString().slice(0, 10))),
    (extDatePicker.style.visibility = "visible");
}
function setDeliverSlots() {
  const e = new Date(datePicker.value);
  e.setHours(0, 0, 0, 0);
  const t = e.getTime();
  let i = [];
  if (((select.value = defaultOption), t >= min && t <= max)) {
    validator.className = "validate y";
    const a = new Intl.DateTimeFormat(navigator.locale, {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(e);
    (inConvertedDate.value = a), (dateValid = !0);
    for (const a of shippingDateTime) {
      const n = a[0],
        o = a[1].timeSlots,
        s = f_ms(0, a[1].delayH),
        d = a[1].daysOff,
        l = f_ms(0, a[1].endTime),
        c = f_ms(0, a[1].startTime);
      if (n === choosenDeliveryM) {
        if (
          (d.includes(7) && d.splice(d.indexOf(7), 1, 0),
          d.includes(e.getDay()) || d.includes(datePicker.value))
        )
          return (
            (select.innerHTML = `<option class="btn select-options" value="">${daysOffRisp}</option>`),
            (extSelect.style.visibility = "visible"),
            (dateValid = !1),
            (validator.className = "validate n"),
            void f_disabledCheckout()
          );
        if ("object" == typeof o)
          for (const e of o) {
            const a = f_ms(0, e[0]);
            ((t >= min && t != today) || (t == today && now < a + s)) &&
              i.push(e);
          }
        else if ("number" == typeof o) {
          const e = f_ms(0, a[1].timeSlots);
          let n = c;
          for (; l >= n + s; )
            ((t == today && n >= now + s) || (t !== today && t >= min)) &&
              i.push([n / 60 / 60 / 1e3, (n + e) / 60 / 60 / 1e3]),
              (n += e);
        }
      }
      if ("" != i) {
        let e = `<option class="btn select-options" value="${defaultOption}">${defaultOption}</option>`;
        i.forEach(function (t) {
          let [i, a] = [...t];
          function n(e) {
            return (
              (e = e.toString()).includes(".")
                ? (e = e.replace(".", ":").padEnd(5, "0"))
                : (e += ":00"),
              e
            );
          }
          (t = n(i) + " - " + n(a)),
            (e += `<option class="btn select-options" value="${t}">${t}</option>`);
        }),
          (select.innerHTML = e),
          (extSelect.style.visibility = "visible");
      }
    }
  } else
    (validator.className = "validate n"), (dateValid = !1), f_reset("timeslot");
  f_disabledCheckout();
}
datePicker.addEventListener("input", setDeliverSlots);
const extSelect = document.querySelector(".ext-select"),
  select = document.querySelector("#select");
function checkTime() {
  timeValid = !1;
  document.querySelectorAll(".select-options").forEach((e) => {
    e.value === select.value && "" != e.value && (timeValid = !0);
  }),
    f_disabledCheckout();
}
let jqui;
if (
  (select.addEventListener("change", checkTime),
  "text" === datePicker.type || !("min" in datePicker))
) {
  jqui = !0;
  const e = document.createElement("script");
  e.src = "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js";
  const t = document.createElement("script");
  t.src = "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.4/jquery-ui.min.js";
  const i = document.createElement("link");
  (i.href =
    "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.4/themes/ui-lightness/jquery-ui.css"),
    (i.type = "text/css"),
    (i.rel = "stylesheet");
  const a = document.head || document.getElementsByTagName("head")[0];
  a.appendChild(e),
    e.addEventListener("load", function () {
      a.appendChild(t),
        t.addEventListener("load", function () {
          a.appendChild(i),
            i.addEventListener("load", function () {
              window.jQuery
                ? ($(".datepicker-btn").datepicker({ dateFormat: "yy-mm-dd" }),
                  (inConvertedDate.style.display = "block"),
                  $(".datepicker-btn").on("change", setDeliverSlots))
                : alert(
                    "Something went wrong ,please try reloading the browser or try with a different one "
                  );
            });
        });
    });
}
const datalog = document.querySelector(".datalog");
checkoutButton.addEventListener("click", (e) => {
  let t;
  !(function () {
    const e = document.querySelectorAll('input[name="Method"]');
    for (const i of e)
      if (i.checked) {
        t = i.value;
        break;
      }
  })(),
    (datalog.value = `Method: ${t} \nDate: ${inConvertedDate.value} \nTimeslot: ${select.value}`),
    f_reset("datepick");
});
