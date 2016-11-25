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
  maxValue: 150,
  barColor: {
    150: '#FF0000',
    120: '#FFFF00',
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
