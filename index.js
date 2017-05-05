const bleno = require('bleno');

bleno.on('stateChange', (state) => {
    if (state === 'poweredOn') {
        bleno.startAdvertising('pi', ['fffffffffffffffffffffffffffffff0'], (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Broadcasting!');
            }
        })
    }
});