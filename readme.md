# Shipping-Helper.js

> You can see a demo [here](https://cristiangiro.com/shipping-helper.html).

Shipping helper is a script that wants to make your life easier when it comes to make your visitors choose a date and time .

It comes in two version : one specifically build for shopify and one that can be used in every HTML form.

The script automatically add the HTML elements to your form , you just need to specify the CSS selector of your form in the `container` variable.


## Instalation

- Shopify

  This script as been created for the Brooklin theme so it may be need some adjustment to work in different themes

  - Download the `shipping-helper.shopify.js` and upload it on the `Assets` folder.

  - Look for the `theme.liquid` in the `Layout` folder and copy the following code near the others JS script

  ```html
  <script src="{{ 'shipping-helper.shopify.js' | asset_url }}" defer="defer"></script>
  ```

  - Download the `shipping-helper.shopify.scss` and copy the code inside the `theme.scss.liquid` file in the `Layout folder`

- HTML form (independent)

  - Download the files and place it on your project folder

  - Add the following code on the head section of your HTML page

  ```html
  <script src="./shipping-helper.js" defer="defer" type="text/javascript"></script>

  <link href="./shipping-helper.css" rel="stylesheet" type="text/css" />
  ```

  - You maybe gonna need to add some extra CSS to make the elemenst fit the style of your page

## Settings

  At the very beginning of the JS file you are gonna find the settings for the logic of the script

### Disable checkout button

  If set to `true` is gonna create a substitute of the checkout button and hiding the original one till that all    the fields are not properly filled.

  If the new button is gonna be clicked an animation will occur for the fields that are not filled properly

    ```javascript
    const disableCheckoutButton = true;
    //or
    const disableCheckoutButton = false;
    ```

## Dates and Time

  All the informarmation foreach delivery method are contained in the `shippingDateTime` variable.

  shippingDateTime needs to be an ** array cointaining one array foreach method**

    ```javascript
    const shippingDateTime = [
    ["Name method 1", { options }],
    ["Name method 2", { options }],
    ];
    // if you have just one method
    const shippingDateTime = [["Name method", { options }]];
    ```

### Delay Days

  This indicate the number of days between the current date and the first available date for the delivery

  Must be a number

    ```javascript
    const shippingDateTime = [["Name method", { delayD: 1 }]];
    // if the current date is 10/10/2020 the first date will be 11/10/2020
    ```

### Delay Hours

  This indicate the minimun number of hours between the current time and the first available delivery slot

  Must be a number

    ```javascript
    const shippingDateTime = [["Name method", { delayH: 1 }]];
    // if the current time is 12:00 the first date will be 13:00

    const shippingDateTime = [["Name method", { delayH: 1.3 }]];
    // if the current time is 12:00 the first date will be 13:30
    ```

### Time Slots (required)

There are two ways of setting up the slots time

- Continuosly

  The slots are calculated based on `startTime ` , `endTime` and `timeSlots`

  timeSlots in this case is the duration in hours of the slot

  ```javascript
  const shippingDateTime = [
    ["Name method", { timeSlots: 1, startTime: 12.3, endTime: 14.3 }],
  ];
  // output
  // 1° slot 12:30-13:30
  // 2° slot 13:30-14:30
  ```

- Discontinuously

  The slots are hard coded

  In this case timeSlots is an **array of arrays**

  ```javascript
  const shippingDateTime = [
    [
      "Name method",
      {
        timeSlots: [
          [8, 10],
          [15.3, 18],
          [22.15, 23],
        ],
      },
    ],
  ];
  // output
  // 1° slot 8:00-10:00
  // 2° slot 15:30-18:00
  // 3° slot 22:15-23:00
  ```

### Days Off

  You can set the days in wich the deliveries are unavailable this is **always an array**

  You can set the days of the week in number ex 1 , 2 or 7

  Or you can set the date in ISO yyyy-mm-dd format

    ```javascript
    const shippingDateTime = [["Name method", { daysOff: [1, 3, "2020-12-31"] }]];
    // output
    // off on mon , wed and 31 dec 2020
    ```

### Last order

  This indicate the maximum time of the current day in wich is possible have the delivery for the next day

  This is optional

    ```javascript
    const shippingDateTime = [
    [
        "Name method",
        {
        lastOrder: 22,
        },
    ],
    ];
    // output
    // if the current time is 20:00 the first delivery day is gonna be tomorrow
    // if the current time is 22:30 the first delivery day is gonna be in two days
    ```
