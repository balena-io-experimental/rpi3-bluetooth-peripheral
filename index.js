const DEVICE_NAME = process.env.BLENO_DEVICE_NAME = 'resin-' + (
    process.env.RESIN_DEVICE_UUID || process.env.HOSTNAME || 'local'
);
const CUSTOM_SERVICE_UUID = '0e00bced-2e2a-4edb-9cc9-3c2a826ca1e9';
const CUSTOM_SERVICE_CHARACTERISTIC_UUID = 'b26f280f-e534-4705-86d6-b85c0fafc913';

const bleno = require('bleno');

const getMessage = () => {
    return Buffer.from(JSON.stringify({
        message: 'Hi there!'
    }, 'utf8'));
};

const messageCharacteristic = new bleno.Characteristic({
    uuid: CUSTOM_SERVICE_CHARACTERISTIC_UUID,
    properties: ['read', 'notify'],
    descriptors: [
        new bleno.Descriptor({
            uuid: '2901',
            value: 'Message from the device'
        })
    ],
    onReadRequest: (offset, callback) => {
        if (offset) {
            callback(bleno.Characteristic.RESULT_ATTR_NOT_LONG);
        }

        console.log('Read request');
        callback(bleno.Characteristic.RESULT_SUCCESS, getMessage());
    }
});

setInterval(() => {
    if (messageCharacteristic.updateValueCallback) {
        console.log('Sending update');
        messageCharacteristic.updateValueCallback(getMessage());
    }
}, 1000);

const messageService = new bleno.PrimaryService({
    uuid: CUSTOM_SERVICE_UUID,
    characteristics: [messageCharacteristic]
});

bleno.on('stateChange', (state) => {
    console.log('State:', state);

    if (state === 'poweredOn') {
        bleno.startAdvertising(DEVICE_NAME, [CUSTOM_SERVICE_UUID], (err) => {
            if (err) {
                console.log(err);
            } else {
                bleno.setServices([messageService]);
                console.log('Broadcasting!');
            }
        });
    }
});