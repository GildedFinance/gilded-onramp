import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class WyreService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private formService: FormService) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
  }

  createTransfer() {
    const url = `http://localhost:5000/gilded-onramp`;

    const start = this.formService.startForm.value;
    const basic = this.formService.basicForm.value;
    const billing = this.formService.billingForm.value;

    const body = JSON.stringify({
      ...start, ...basic, ...billing
    });

    return this.http.post(url, body, { headers: this.httpHeaders }).toPromise();
  }

  confirmTransfer(transferId: string) {
    const url = `http://localhost:5000/gilded-onramp-confirm`;

    const body = JSON.stringify({
      transferId
    });

    return this.http.post(url, body, { headers: this.httpHeaders }).toPromise();

  }
}
