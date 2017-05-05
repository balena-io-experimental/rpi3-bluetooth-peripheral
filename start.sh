#!/bin/bash

echo "Preparing bluetooth..."
if ! /usr/bin/hciattach /dev/ttyAMA0 bcm43xx 921600 noflow -; then
    echo "First try failed. Let's try again..."
    /usr/bin/hciattach /dev/ttyAMA0 bcm43xx 921600 noflow -
fi

hciconfig hci0 up
echo "Bluetooth up"

npm start