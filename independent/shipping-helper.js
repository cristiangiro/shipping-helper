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
        [12, 13],
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
      if (timeValid != true) animate(input);
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
      <label class="caption">Delivery method</label>
      <div class="container_deliverymethods">
      ${deliveryMethods}
      </div>
    </div>
    <div class="ext ext-datepicker" style="visibility:hidden">
      <label class="caption">Delivery date</label>
      <div><input type="date" class="datepicker-btn" min="" required ><span class="validate"></span></div>
      <input type="text" class="converteddate" name="Date" style="display:none">
    </div>
    <div class="ext ext-input" style="visibility:hidden">
      <label class="caption">Delivery time</label>
      <input list="" id="input-datalist" autocomplete="off" name="Time" value="${defaultOption}">
    </div>
    <datalist id="datalist">
    </datalist>
    `
);

//reset hidden elemnts
function f_reset(el) {
  if (el === "datepick") {
    extInput.style.visibility = "hidden";
    validator.className = "validate";
    datePicker.value = "";
    dateValid = false;
    f_disabledCheckout();
  }
  if (el === "datepick" || el === "timeslot") {
    extInput.style.visibility = "hidden";
    timeValid = false;
    f_disabledCheckout();
  }
  if (el === "datepick" || el === "timeslot" || el === "datalist") {
    datalist.style.display = "none";
    f_disabledCheckout();
  }
}

// convert in ms
function f_ms(d = 0, h = 0, m = 0) {
  h += Number((d % 1).toFixed(4).substring(2));
  m += Number((h % 1).toFixed(4).substring(2));

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

      dateMin(addNDay);
      return;
    }
  }
}
const datePicker = document.querySelector(".datepicker-btn");
const extDatePicker = document.querySelector(".ext-datepicker");
const day = new Date();
day.setHours(0, 0, 0, 0);
const today = day.getTime();

console.log(today);

const nowraw = new Date();
const hours = nowraw.getHours();
const minutes = nowraw.getMinutes();
const now = f_ms(0, hours) + f_ms(0, 0, minutes);

//set min value of the datePicker
let min = new Date();
function dateMin(minDelay) {
  f_reset("datepick");

  min.setTime(today + f_ms(minDelay));

  if (jqui === true) {
    $(".datepicker-btn").datepicker("option", "minDate", minDelay);
  } else {
    datePicker.min = min.toISOString().slice(0, 10);
  }

  extDatePicker.style.visibility = "visible";
}

// listen for change in date picker
function setDeliverSlots() {
  const dateFromDPraw = new Date(datePicker.value);
  dateFromDPraw.setHours(0, 0, 0, 0);
  const dateFromDP = dateFromDPraw.getTime();

  let optiontimeSlotsValues = [];
  input.value = defaultOption;

  if (dateFromDP >= min) {
    validator.className = "validate y";
    document.querySelector(".converteddate").value =
      dateFromDPraw.getDate() +
      "-" +
      (dateFromDPraw.getMonth() + 1) +
      "-" +
      dateFromDPraw.getFullYear();
    dateValid = true;

    for (const deliveryMetAv of shippingDateTime) {
      const deliveryMetName = deliveryMetAv[0];
      const deliveryMetSlots = deliveryMetAv[1].timeSlots;
      const delayD = f_ms(deliveryMetAv[1].delayD);
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
          input.value = daysOffRisp;
          extInput.style.visibility = "visible";
          dateValid = false;
          datalist.innerHTML = "";
          validator.className = "validate n";
          f_disabledCheckout();
          return;
        }

        if (
          typeof deliveryMetSlots == "object" //if timeslot is an array
        ) {
          for (const slot of deliveryMetSlots) {
            const startS = f_ms(0, slot[0]);
            const endS = f_ms(0, slot[1]);

            if (
              (dateFromDP >= min && dateFromDP != today) ||
              (dateFromDP == today && now < endS + delayH)
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
        let optionstimeSlots = ``;

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

          element = convert(el1) + "-" + convert(el2);

          optionstimeSlots += `<option class="btn datalist-options" value="${element}">${element}</option>`;
        });

        datalist.innerHTML = optionstimeSlots;
        extInput.style.visibility = "visible";
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
const input = document.querySelector("#input-datalist");
const extInput = document.querySelector(".ext-input");
const datalist = document.querySelector("#datalist");
input.addEventListener("focus", () => (datalist.style.display = "block"));

datalist.addEventListener("click", function (e) {
  input.value = e.target.value;
  f_reset("datalist");
  checkTime();
});

datalist.style.width = input.offsetWidth + "px";
datalist.style.left = input.offsetLeft + "px";
datalist.style.top = input.offsetTop + input.offsetHeight + "px";

// validate time
function checkTime() {
  timeValid = false;
  const datalistOptions = document.querySelectorAll(".datalist-options");
  datalistOptions.forEach((element) => {
    if (element.value === input.value && element.value != "") {
      timeValid = true;
    }
  });
  f_disabledCheckout();
}
input.addEventListener("change", checkTime);

//close datalist if clicked somewhere outside the datalist
document.querySelector("body").addEventListener("click", (e) => {
  if (e.target != input && e.target.className != "datalist-options")
    f_reset("datalist");
});

//if browser not support input date load jquery data picker
let jqui;
if (datePicker.type === "text") {
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
            altField: ".converteddate",
            altFormat: "dd-mm-yy",
          });
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
  datalog.value = `Method:${selectedValue} | Date${
    document.querySelector(".converteddate").value
  } | Time${input.value}`;
  f_reset("datepick");
});
