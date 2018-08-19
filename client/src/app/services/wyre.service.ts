import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WyreService {

  constructor(private http: HttpClient) { }

  createWallet() {
    // const url = environment.api_url + `/sendEmail`;

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    // const body = JSON.stringify({ to: this.email, subject: this.subject, html: this.htmlBody });

    // call cloud service
    // return this.http.post(url, body, { headers: httpHeaders }).toPromise();
  }
}
