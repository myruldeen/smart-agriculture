import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../app/app.globals';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class DataService {
    dataLimit = 100;

    constructor(private http: Http) { }

    private createAuthorizationHeader(headers: Headers) {
        headers.append('Accept-Language', 'en_US');
        headers.append('Content-Type', 'application/json');
    }

    create(data): Observable<Response> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(Globals.BASE_API_URL + 'data', data, {
            headers: headers
        });
    }

    get(): Observable<Response> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(Globals.BASE_API_URL + 'data/' + this.dataLimit, {
            headers: headers
        });
    }

    saveFileCSV(): Observable<Response> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(Globals.BASE_API_URL + 'data/save', {
            headers: headers
        });
    }

    csvList(): Observable<Response> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(Globals.BASE_API_URL + 'data/file', {
            headers: headers
        });
    }

    deleteFile(id: String): Observable<Response> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(Globals.BASE_API_URL + 'data/' + id, {
            headers: headers
        });
    }
}
