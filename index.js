const DEVICE_NAME = process.env.BLENO_DEVICE_NAME = 'resin-' + (
    process.env.RESIN_DEVICE_UUID || process.env.HOSTNAME || 'local'
);
const CUSTOM_SERVICE = '0e00bced-2e2a-4edb-9cc9-3c2a826ca1e9';

const bleno = require('bleno');

bleno.on('stateChange', (state) => {
    console.log('State:', state);

    if (state === 'poweredOn') {
        bleno.startAdvertising(DEVICE_NAME, [CUSTOM_SERVICE], (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Broadcasting!');
            }
        });
    }
});