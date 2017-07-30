#! /bin/sh

npm install

sleep 5

forever stop bin/server.js

sleep 5

forever start bin/server.js