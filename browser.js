const CUSTOM_SERVICE = '0e00bced-2e2a-4edb-9cc9-3c2a826ca1e9';

document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector('#connect').addEventListener('click', () => {
        connect();
    });
});

function connect() {
    window.devices = [];

    navigator.bluetooth.requestDevice({
        filters: [{
            services: [CUSTOM_SERVICE]
        }]
    }).then((device) => {
        window.devices.push(device);
        console.log('Found device', device);
    }).catch((err) => console.error(err));
}