import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Globals } from '../app/app.globals';

@Injectable()
export class SocketService {
    private socket;
    constructor() {
        this.socket = io(Globals.BASE_API_URL, {
            // 'query': 'token=' + Globals.API_AUTH_TOKEN
        });
    }
   

    getData() {
        let observable = new Observable<any>(observer => {
            this.socket.on('data:save:', (data) => {
                observer.next(data);
            });

            return (error) => {
                console.error(error);
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getMessage(): Observable<any> {
        return Observable.create((observer) => {
            this.socket.on('data', (data) => {
                observer.next(data);
            });

            return (error) => {
                console.error(error);
                this.socket.disconnect();
            }
        })
    }
}
