var Bus, DBus, Interface, Promise, oldInit,
  slice = [].slice,
  hasProp = {}.hasOwnProperty;

Promise = require('bluebird');
DBus = require('dbus');
Bus = require('dbus/lib/bus');
Interface = require('dbus/lib/interface');

Promise.promisifyAll(Bus.prototype);
Promise.promisifyAll(Interface.prototype);

oldInit = Interface.prototype.init;

Interface.prototype.init = function() {
  var args, method, ref, results;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  oldInit.apply(this, args);
  ref = this.object.method;
  results = [];
  for (method in ref) {
    if (!hasProp.call(ref, method)) continue;
    results.push(this[method + 'Async'] = (function(method) {
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return new Promise((function(_this) {
          return function(resolve, reject) {
            _this[method].timeout = 5000;
            _this[method].finish = resolve;
            _this[method].error = reject;
            return _this[method].apply(_this, args);
          };
        })(this));
      };
    })(method));
  }
  return results;
};

module.exports = DBus;