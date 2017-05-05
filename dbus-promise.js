const Promise = require('bluebird');
const DBus = require('dbus');
const Bus = require('dbus/lib/bus');
const Interface = require('dbus/lib/interface');

Promise.promisifyAll(Bus.prototype)
Promise.promisifyAll(Interface.prototype)

const oldInit = Interface.init;

Interface.init = function (...args) {
	oldInit.apply(this, args)

    for (method of this.object.method) {
        this[method + 'Async'] = (...methodArgs) =>
            new Promise((resolve, reject) => {
                this[method].timeout = 5000;
                this[method].finish = resolve;
                this[method].error = reject;
                this[method](...methodArgs);
            });
    }
}

module.exports = DBus;