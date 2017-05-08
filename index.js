const DEVICE_NAME = process.env.BLENO_DEVICE_NAME = 'resin-' + (process.env.HOSTNAME || 'local');
const CUSTOM_SERVICE_UUID = '0e00bced-2e2a-4edb-9cc9-3c2a826ca1e9';
const CUSTOM_SERVICE_CHARACTERISTIC_UUID = 'b26f280f-e534-4705-86d6-b85c0fafc913';

const bleno = require('bleno');
const NetworkManager = require('./network-manager');

const getConnectivityMessage = (connected) => {
    return Buffer.from(JSON.stringify({
        connected: connected
    }, 'utf8'));
};

const connectivityCharacteristic = new bleno.Characteristic({
    uuid: CUSTOM_SERVICE_CHARACTERISTIC_UUID,
    properties: ['read', 'notify'],
    descriptors: [
        new bleno.Descriptor({
            uuid: '2901',
            value: 'Device connectivity'
        })
    ],
    onReadRequest: (offset, callback) => {
        if (offset) {
            callback(bleno.Characteristic.RESULT_ATTR_NOT_LONG);
        }

        NetworkManager.getConnectedState().then((connected) => {
            callback(bleno.Characteristic.RESULT_SUCCESS, getConnectivityMessage(connected));
        });
    }
});

NetworkManager.onConnectedStateChange((connected) => {
    if (connectivityCharacteristic.updateValueCallback) {
        connectivityCharacteristic.updateValueCallback(getConnectivityMessage(connected));
    }
});

const connectivityService = new bleno.PrimaryService({
    uuid: CUSTOM_SERVICE_UUID,
    characteristics: [connectivityCharacteristic]
});

bleno.on('stateChange', (state) => {
    if (state === 'poweredOn') {
        bleno.startAdvertising(DEVICE_NAME, [CUSTOM_SERVICE_UUID], (err) => {
            if (err) {
                console.log(err);
            } else {
                bleno.setServices([connectivityService]);
                console.log('Broadcasting!');
            }
        });
    }
});