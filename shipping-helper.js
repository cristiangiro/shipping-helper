//shippinghelper v0.2 by cristiangiro see documentation on GitHub https://github.com/cristiangiro/shipping-helper
"use strict";
const container = document.querySelector(".cart");
const checkoutButton = document.querySelector(".btn.cart__checkout");
const defaultOption = "-Choose an option-";
const disableCheckoutButton = true;
const daysOffRisp = "No delivery this date";
const shippingDateTime = [
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
      startTime: 12.0,
      endTime: 23.0,
      lastOrder: 22,
      daysOff: [2, 3],
    },
  ],
];
const locale = false; // default option see documentation
const localeOptions = false; // default option see documentation
const maxDaysDate = false; // default option see documentation

////////   End settings

let dateValid = undefined;
let timeValid = undefined;
let deliveryMetValid = undefined;
let deliveryMethods = "";
checkoutButton.insertAdjacentHTML(
  "beforebegin",
  `<div class="btn newbutton" style="display:none">${checkoutButton.innerHTML}</div>`
);
const newButton = document.querySelector(".newbutton");

//if disableCheckoutButton is set to true
function f_disabledCheckout() {
  function sostituteButton(b) {
    if (b === "newB") {
      newButton.style.display = "inline-block";
      checkoutButton.style.display = "none";
    } else if (b === "oldB") {
      newButton.style.display = "none";
      checkoutButton.style.display = "inline-block";
    }
  }

  if (!disableCheckoutButton) {
    return;
  } else if (disableCheckoutButton && dateValid && timeValid) {
    sostituteButton("oldB");
  } else {
    sostituteButton("newB");

    newButton.addEventListener("click", function () {
      function animate(element) {
        element.classList.add("attention");
        element.addEventListener("animationend", (e) =>
          e.target.classList.remove("attention")
        );
      }

      if (dateValid != true) animate(datePicker);
      if (timeValid != true) animate(select);
      if (deliveryMetValid != true) animate(instancesDeliveryMethods);
    });
  }
}
f_disabledCheckout();

//generate one shipping button foreach shipping method available
for (const methods of shippingDateTime)
  deliveryMethods += `<label class="radiobutton deliverymethods" for="${methods[0]}">
       <input class="radio" type="radio" id="${methods[0]}" name="Method" value="${methods[0]}">${methods[0]}</label>`;

//attach all the elements to the main div
container.insertAdjacentHTML(
  "afterbegin",
  ` <div class="ext">
      <label class="caption">Shipping method</label>
      <div class="container_deliverymethods">
      ${deliveryMethods}
      </div>
    </div>
    <div class="ext ext-datepicker" style="visibility:hidden">
      <label class="caption">Choose a Date</label>
      <div><input type="text" class="datepicker-btn" required ><span class="validate"></span></div>
      <input type="text" class="converteddate" name="Date" style="display:none" readonly>
    </div>
    <div class="ext ext-select" style="visibility:hidden">
      <label class="caption">Choose a Time</label>
      <select class="btn--secondary" id="select" autocomplete="off" name="Time">
      </select>
    </div>
    `
);

//reset hidden elemnts
function f_reset(el) {
  if (el === "datepick") {
    extSelect.style.visibility = "hidden";
    validator.className = "validate";
    datePicker.value = "";
    inConvertedDate.value = "";
    dateValid = false;
    f_disabledCheckout();
  }
  if (el === "datepick" || el === "timeslot") {
    extSelect.style.visibility = "hidden";
    timeValid = false;
    f_disabledCheckout();
  }
}

// convert in ms
function f_ms(ds = 0, hr = 0, mn = 0) {
  const d = Math.trunc(ds);
  const h = Number((ds % 1).toFixed(4).substring(2, 4)) + Math.trunc(hr);
  const m = Number((hr % 1).toFixed(4).substring(2, 4)) + mn;

  const result = d * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000 + m * 60 * 1000;

  return result;
}

//listen for click on delivery methos
const instancesDeliveryMethods = document.querySelector(
  ".container_deliverymethods"
);
const validator = document.querySelector(".validate");
let choosenDeliveryM = "";

function checkDeliveryMethods(e) {
  validator.className = "validate";
  deliveryMetValid = true;
  choosenDeliveryM = e.target.value;
  f_reset("datepick");
  showDatePicker(e.target.value);
}
instancesDeliveryMethods.addEventListener("change", checkDeliveryMethods);

//calculate first availabe date
let addNDay = 0;

function showDatePicker(deliveryvalue) {
  addNDay = 0;
  for (const dv of shippingDateTime) {
    if (dv[0] === deliveryvalue) {
      const deliveryOptions = dv[1];
      const timeslot = deliveryOptions.timeSlots;
      const delayH = f_ms(0, deliveryOptions.delayH);

      if (
        typeof timeslot == "number" &&
        f_ms(0, deliveryOptions.endTime) < now + delayH + f_ms(0, timeslot)
      ) {
        addNDay = 1;
      }
      if (
        typeof timeslot == "object" &&
        f_ms(0, timeslot[timeslot.length - 1][0]) < now + delayH
      ) {
        addNDay = 1;
      }

      now > f_ms(0, deliveryOptions.lastOrder) ? (addNDay = 2) : "";

      deliveryOptions.delayD ? (addNDay = deliveryOptions.delayD) : "";

      dateMinMax(addNDay);
      return;
    }
  }
}
const datePicker = document.querySelector(".datepicker-btn");
const extDatePicker = document.querySelector(".ext-datepicker");
const inConvertedDate = document.querySelector(".converteddate");
const day = new Date();
day.setHours(0, 0, 0, 0);
const today = day.getTime();

const nowraw = new Date();
const hours = nowraw.getHours();
const minutes = nowraw.getMinutes();
const now = f_ms(0, hours) + f_ms(0, 0, minutes);
let max = new Date(maxDaysDate ? today + f_ms(maxDaysDate) : today + f_ms(364));

//set min and max value of the datePicker
let min = new Date();
function dateMinMax(minDelay) {
  f_reset("datepick");
  min.setTime(today + f_ms(minDelay));

  if (jqui === true) {
    $(".datepicker-btn").datepicker("option", "minDate", minDelay);
    $(".datepicker-btn").datepicker(
      "option",
      "maxDate",
      maxDaysDate ? maxDaysDate : 364
    );
  } else {
    datePicker.min = min.toISOString().slice(0, 10);
    datePicker.max = max.toISOString().slice(0, 10);
  }

  extDatePicker.style.visibility = "visible";
}

// listen for change in date picker
function setDeliverSlots() {
  const dateFromDPraw = new Date(datePicker.value);
  dateFromDPraw.setHours(0, 0, 0, 0);
  const dateFromDP = dateFromDPraw.getTime();

  let optiontimeSlotsValues = [];
  select.value = defaultOption;

  if (dateFromDP >= min && dateFromDP <= max) {
    validator.className = "validate y";
    const converteddate = new Intl.DateTimeFormat(
      locale ? locale : navigator.locale,
      localeOptions
        ? localeOptions
        : {
            weekday: "short",
            day: "numeric",
            month: "numeric",
            year: "numeric",
          }
    ).format(dateFromDPraw);
    inConvertedDate.value = converteddate;
    dateValid = true;

    for (const deliveryMetAv of shippingDateTime) {
      const deliveryMetName = deliveryMetAv[0];
      const deliveryMetSlots = deliveryMetAv[1].timeSlots;
      const delayH = f_ms(0, deliveryMetAv[1].delayH);
      const daysOff = deliveryMetAv[1].daysOff;
      const deliveryMetEndTime = f_ms(0, deliveryMetAv[1].endTime);
      const deliveryMetStartTime = f_ms(0, deliveryMetAv[1].startTime);

      if (deliveryMetName === choosenDeliveryM) {
        if (daysOff.includes(7)) {
          daysOff.splice(daysOff.indexOf(7), 1, 0);
        }

        if (
          daysOff.includes(dateFromDPraw.getDay()) ||
          daysOff.includes(datePicker.value)
        ) {
          select.innerHTML = `<option class="btn select-options" value="">${daysOffRisp}</option>`;
          extSelect.style.visibility = "visible";
          dateValid = false;
          validator.className = "validate n";
          f_disabledCheckout();
          return;
        }

        if (
          typeof deliveryMetSlots == "object" //if timeslot is an array
        ) {
          for (const slot of deliveryMetSlots) {
            const startS = f_ms(0, slot[0]);
            if (
              (dateFromDP >= min && dateFromDP != today) ||
              (dateFromDP == today && now < startS + delayH)
            ) {
              optiontimeSlotsValues.push(slot);
            }
          }
        } else if (
          typeof deliveryMetSlots == "number" //if timeslot is a number
        ) {
          const slotDuration = f_ms(0, deliveryMetAv[1].timeSlots);
          let currentSlot = deliveryMetStartTime;

          while (deliveryMetEndTime >= currentSlot + delayH) {
            if (dateFromDP == today && currentSlot >= now + delayH) {
              optiontimeSlotsValues.push([
                currentSlot / 60 / 60 / 1000,
                (currentSlot + slotDuration) / 60 / 60 / 1000,
              ]);
            } else if (dateFromDP !== today && dateFromDP >= min) {
              optiontimeSlotsValues.push([
                currentSlot / 60 / 60 / 1000,
                (currentSlot + slotDuration) / 60 / 60 / 1000,
              ]);
            }
            currentSlot += slotDuration;
          }
        }
      }

      if (optiontimeSlotsValues != "") {
        let optionstimeSlots = `<option class="btn select-options" value="${defaultOption}">${defaultOption}</option>`;

        optiontimeSlotsValues.forEach(function (element) {
          let [el1, el2] = [...element];
          function convert(el) {
            el = el.toString();
            if (el.includes(".")) {
              el = el.replace(".", ":").padEnd(5, "0");
            } else {
              el += ":00";
            }
            return el;
          }

          element = convert(el1) + " - " + convert(el2);

          optionstimeSlots += `<option class="btn select-options" value="${element}">${element}</option>`;
        });

        select.innerHTML = optionstimeSlots;
        extSelect.style.visibility = "visible";
      }
    }
  } else {
    validator.className = "validate n";
    dateValid = false;
    f_reset("timeslot");
  }
  f_disabledCheckout();
}
datePicker.addEventListener("input", setDeliverSlots);

//datalist
const extSelect = document.querySelector(".ext-select");
const select = document.querySelector("#select");

// validate time
function checkTime() {
  timeValid = false;
  const selectOptions = document.querySelectorAll(".select-options");
  selectOptions.forEach((element) => {
    if (element.value === select.value && element.value != "") {
      timeValid = true;
    }
  });
  f_disabledCheckout();
}
select.addEventListener("change", checkTime);

//if browser not support input date load jquery data picker
let jqui;
if (datePicker.type === "text" || !("min" in datePicker)) {
  jqui = true;

  const jq = document.createElement("script");
  jq.src = "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js";
  const jui = document.createElement("script");
  jui.src = "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.4/jquery-ui.min.js";
  const css = document.createElement("link");
  css.href =
    "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.4/themes/ui-lightness/jquery-ui.css";
  css.type = "text/css";
  css.rel = "stylesheet";
  const head = document.head || document.getElementsByTagName("head")[0];

  head.appendChild(jq);
  jq.addEventListener("load", function () {
    head.appendChild(jui);
    jui.addEventListener("load", function () {
      head.appendChild(css);
      css.addEventListener("load", function () {
        if (window.jQuery) {
          $(".datepicker-btn").datepicker({
            dateFormat: "yy-mm-dd",
          });
          inConvertedDate.style.display = "block";
          $(".datepicker-btn").on("change", setDeliverSlots);
        } else {
          alert(
            "Something went wrong ,please try reloading the browser or try with a different one "
          );
        }
      });
    });
  });
}

//collect the data (optional)
const datalog = document.querySelector(".datalog");
checkoutButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  let selectedValue;
  function check() {
    const rbs = document.querySelectorAll('input[name="Method"]');
    for (const rb of rbs) {
      if (rb.checked) {
        selectedValue = rb.value;
        break;
      }
    }
  }

  check();
  datalog.value = `Method: ${selectedValue} \nDate: ${inConvertedDate.value} \nTimeslot: ${select.value}`;
  f_reset("datepick");
});
