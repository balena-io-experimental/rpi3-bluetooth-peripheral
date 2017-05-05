const DBus = require('./dbus-promise');

const NM_STATE_CONNECTED_GLOBAL = 70;
const NM_CONNECTIVITY_FULL = 4;

const SERVICE = 'org.freedesktop.NetworkManager';

let connectedStateChangeCallback = () => {};

let manager = null;
const getManager = () => {
    if (!manager) {
        const bus = new DBus().getBus('system');
        manager = bus.getInterfaceAsync(SERVICE, '/org/freedesktop/NetworkManager', SERVICE)
        .delay(1000)
        .tap((manager) => manager.on('StateChanged', (state) => {
            console.log('Connected state changed', state);
            connectedStateChangeCallback(state === NM_STATE_CONNECTED_GLOBAL);
        }));
    }

    return manager;
};

exports.getConnectedState = () => {
    return getManager()
    .then((manager) => manager.CheckConnectivityAsync())
    .then((state) => {
        console.log('Connected state read got', state);
        return state === NM_CONNECTIVITY_FULL
    });
};

exports.onConnectedStateChange = (callback) => {
    connectedStateChangeCallback = callback;
};