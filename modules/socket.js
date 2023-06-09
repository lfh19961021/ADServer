// Server side socket

import { Server } from "socket.io";
// const { Server } = require("socket.io");

let io;
let $store;
let lastUpdateTime;

export default {
    init(store, server){
        io = new Server(server, { /* options */ });
        $store = store;

        setInterval(() => {
            lastUpdateTime = new Date(Date.now()).toString();
            // console.clear();
            
            // console.log("Last Update Time: ", lastUpdateTime);
            // console.log("Login:  ", $store.loginMapping);
            // console.log("Online:  ", $store.userMapping);
            // console.log("Logout: ", $store.logoutMapping);

            // console.debug("Last Update Time: ", lastUpdateTime);
            // console.debug("Login:  ", $store.loginMapping);
            // console.debug("Online:  ", $store.userMapping);
            // console.debug("Logout: ", $store.logoutMapping);


            // this.printProgress();
        }, 500);

        setInterval(() => {
            $store.loginMapping.forEach((currUser, index) => {
                if(Date.now() - $store.loginBufferTime >= currUser.timestamp){
                    currUser.timestamp = Date.now();
                    $store.loginMapping.splice(index, 1);
                    $store.userMapping.push(currUser);
                }
            });

            $store.logoutMapping.forEach((currUser, index) => {
                if(Date.now() - $store.logoutBufferTime >= currUser.timestamp){
                    currUser.timestamp = Date.now();
                    $store.logoutMapping.splice(index, 1);
                }
            });

        }, 1000);

        // handler
        io.on("connection", (socket) => {
            console.log('one connection in');

            // listen
            socket.on("map_socket", (payload, callback) => {
                console.log('map_socket event');
                this.pushLoginUser({...payload, socketId: socket.id});

                // callback({
                //     status: 'mapped'
                // })
            });
            socket.on("send_message", (payload, callback) => {
                console.log('get new meessage', payload);
                console.log();
                payload.userName = $store.userMapping.find(currUser => currUser.socketId == payload.by)?.userName;
                io.emit('broadcast_message', payload);

                callback({
                    status: 'ok'
                })
            });
            socket.conn.on("close", (reason) => {
                console.log('one disconnect');
                this.removeLogoutUser(socket.id);
            });

            
        });
    },
    refreshQueue(userMapping, isLogin = false){
        // #1. Retrieve oid if logout
        if (!isLogin) {
            userMapping.oid = $store.userMapping.filter(currUser => currUser.socketId == userMapping.socketId)?.[0]?.oid;

            if (!userMapping.oid) {
                userMapping.oid = $store.loginMapping.filter(currUser => currUser.socketId == userMapping.socketId)?.[0]?.oid;
            }
        }

        // #2. Remove user from queue
        $store.logoutMapping = $store.logoutMapping.filter(currUser => currUser.oid != userMapping.oid);
        $store.userMapping = $store.userMapping.filter(currUser => currUser.oid != userMapping.oid);
        $store.loginMapping = $store.loginMapping.filter(currUser => currUser.oid != userMapping.oid);

        // #3. Line up
        const targetQueue = (isLogin ? $store.loginMapping: $store.logoutMapping);
        targetQueue.push({...userMapping, timestamp: Date.now()});

        // if(!user) $store.userMapping.push(loginUser);
        // console.log($store.userMapping);
    },
    
    pushLoginUser(loginUser){
        this.refreshQueue(loginUser, true);
    },
    removeLogoutUser(socketId){
        this.refreshQueue({socketId});
    },
    printProgress(){
        // process.stdout.clearLine();
        // process.stdout.cursorTo(-1);
        // process.stdout.write(`Last Update Time: ${lastUpdateTime}`);
        // process.stdout.write(`Login: ${$store.loginMapping}`);
        // process.stdout.clearLine();
        // process.stdout.cursorTo(-1);
        // process.stdout.write(`Online: ${$store.userMapping}`);
        // process.stdout.clearLine();
        // process.stdout.cursorTo(-1);
        // process.stdout.write(`Logout: ${$store.logoutMapping}`);
    }
} 