import io from 'socket.io-client';


class WSService {
    initializeSocket = (socketUrl) => {
        try {
            this.socket = io(socketUrl, {
                transports: ['websocket'],
            });
            console.log('initializing socket', this.socket);
            this.socket.on('connect', (data) => {
                console.log('===== socket connected =====');
                console.log(data)
            });
    
            this.socket.on('disconnect', () => {
                console.log('socket disconnected', this.socket);
            });

            this.socket.on('destroy', () => {
                console.log('socket destroy', this.socket);
            });

            this.socket.on('socketError', (err) => {
                console.log('socket connection error: ', err);
                // logger.data('socket connection error: ', err);
            });
            this.socket.on("parameterError", () => {
                console.log('socket connection error: ', err);
            })
            this.socket.on('error', (error) => {
                console.log(error, 'thea data');
            });

        } catch (error) {
            // logger.error('initialize token error: ', error);
            console.log(error, 'hter tereo');
        }
    };

    emit(event, data = {}) {
        this.socket.emit(event, data);
    }

    on(event, cb) {
        this.socket.on(event, cb);
    }


    removeListener(listenerName) {
        this.socket.removeListener(listenerName);
    }

    addEventListener(listenerName) {
        this.socket.addEventListener(listenerName);
    }

    disconnectSocket() {
        this.socket.disconnect();
    }

    destroySocket() {
        this.socket.destroy();
    }
    hasListeners(){
        return this.socket.hasListeners()
    }
    
}

const socketServices = new WSService();

export default socketServices;