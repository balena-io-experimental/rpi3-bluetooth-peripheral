const CUSTOM_SERVICE_UUID = '0e00bced-2e2a-4edb-9cc9-3c2a826ca1e9';
const CUSTOM_SERVICE_CHARACTERISTIC_UUID = 'b26f280f-e534-4705-86d6-b85c0fafc913';

document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector('#connect').addEventListener('click', () => {
        connect();
    });
});

function connect() {
    navigator.bluetooth.requestDevice({
        filters: [{
            services: [CUSTOM_SERVICE_UUID]
        }]
    }).then((device) => {
        console.log('Found device:', device.name);
        return device.gatt.connect()
        .then((server) => server.getPrimaryService(CUSTOM_SERVICE_UUID))
        .then((service) => service.getCharacteristic(CUSTOM_SERVICE_CHARACTERISTIC_UUID))
        .then((characteristic) => {
            characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                console.log('Update:', getMessage(event.target.value));
            });
            return characteristic.readValue();
        }).then((data) => {
            console.log('Initial value:', getMessage(data));

            setTimeout(() => {
                device.gatt.disconnect();
            }, 10 * 1000);
        });
    }).catch((err) => console.error(err));
}

function getMessage(data) {
    return JSON.parse(new TextDecoder('utf8').decode(data))
}
