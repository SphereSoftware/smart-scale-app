# Xiaomi Smart Scale App

Smart apps designed to make our live easier are becoming increasing popular.

These range from fitness trackers to lightbulb controls. When designing these
apps, you may find you need to improve the user experience. Or you need to
access the raw data, but setting up a full stack project would be overkill for
this purpose. That is when `Electron` comes into play.

![Smart Scale App](assets/splash.png)

Electron is a new way to develop modern desktop apps with all the power of
`Node.js`, `HTML`, and `CSS`.  You can easily complete a functional app in a short
time frame, which could solve `80%` of your day-to-day needs.

In this example, we are going to explore the `Electron` universe by creating a
simple app that will give us access to the IoT world.  Integrating scales from
`Xiaomi`, we will build a `Smart Scale` app that will show the user’s weight in
real time. With `Electron`, the data will be collected and presented in a nice,
clean format.

### STEP 1: Setup

First, we need to make sure the setup is done properly. Many templates are
available for this step, but we are going to simplify this process by starting
with a basic setup:

```sh
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Once you have completed this step, you will have something like this:

```sh
.
├── README.md
├── index.html
├── main.js
├── node_modules
├── package.json
└── renderer.js
```

* `index.html`  is the app’s main view.
* `main.js` is the app’s entry point.
* `renderer.js` is where all the `Node.js` staff is available.

### STEP 2: Divide the  process into 3 parts

In order to build our app, we need to split it into 3 parts:

* `GUI` and `UX`
* Data service
* Integration of data & `UI`

Our `Smart Scale` is built on `BLE` (Bluetooth Low Energy), which is a very nice
protocol. In NPM land, the [https://github.com/sandeepmistry/noble](https://github.com/sandeepmistry/noble) project
provides us low-level API for basic Bluetooth interaction.

But we can go even further. A quick search on github will give us a ready-to-use
NPM package for our Smart Scale [node-xiaomi-scale](https://github.com/perillamint/node-xiaomi-scale):

```sh
% npm i node-xiaomi-scale --save
```

If you have problems with building this native extensions (for `macOS`) you can check [this](https://github.com/opensprints/opensprints-electron/issues/5) discussion.

### STEP 3: Enter data/code

Now we are ready get our first real data into the app.

Our `UI` will be pretty simple:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Smart Scale App</title>
  </head>
  <body>
    <h1>Smart Scale App</h1>
    <div id="weight">No Data</div>
  </body>
  <script>
    require('./renderer.js')
  </script>
</html>
```

We can get sample code from the `node-xiaomi-scale` package and put it, as well
as our data layer, into the `renderer.js` file, and we are good to go:

```js
const MiScale = require('node-xiaomi-scale');

let miscale = new MiScale();

miscale.startScanning();

miscale.on('data', function (scale) {
  console.log(scale);
});
```

### STEP 4: Start your app

Here’s what we need to start our app:

```sh
$ npm start
```

![First Real Data](assets/first_data.png)

### STEP 5: Make your app

Now we just need to polish our app and build it for all available platforms.

To get a nice, clean `UI`, we are going to use http://ignitersworld.com/lab/radialIndicator.html:

```sh
$ wget https://raw.githubusercontent.com/s-yadav/radialIndicator/master/radialIndicator.min.js
```

Here is our `UI`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Smart Scale App</title>
    <style>
      #container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="weight"></div>
    </div>
  </body>
  <script>
    require('./renderer.js')
  </script>
</html>
```

Here is our data layer:

```js
const radialIndicator = require('./radialIndicator.min.js')
const MiScale = require('node-xiaomi-scale');
const miscale = new MiScale();

miscale.startScanning();

const radialObj = radialIndicator('#weight' , {
  radius: 150,
  minValue: 0,
  fontWeight: 'normal',
  roundCorner: true,
  barWidth: 8,
  maxValue: 250,
  barColor: {
    200: '#FF0000',
    100: '#FFFF00',
    80: '#0066FF',
    50: '#33CC33',
  },
  format: function (value) {
    return `${value.toFixed(2)} kg`;
  },
});

miscale.on('data', function (scale) {
  radialObj.animate(scale.weight)
  console.log(scale);
});
```

So our app is pretty mach ready.

![app](assets/real_app.png)

Build you app

```sh
$ npm i electron-builder --save-dev
```

add some sections to your `package.json`

```json
{
  ...
  "scripts": {
    "start": "electron .",
    "pack": "build --dir",
    "dist": "build"
  },
  "build": {
    "appId": "smart.scale.app",
    "mac": {
      "category": "smart.scale.app.ble"
    }
  },
  ....
}
```

run following command to make a build.

```sh
$ npm run dist
```
