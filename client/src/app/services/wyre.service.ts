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
    const url = `http://localhost:5000/gilded-onramp/us-central1/configureBilling`;

    const start = this.formService.startForm.value;
    const basic = this.formService.basicForm.value;
    const billing = this.formService.billingForm.value;

    const body = { ...start, ...basic, ...billing };

    console.log(JSON.stringify(body));

    return this.http.post(url, JSON.stringify(body), { headers: this.httpHeaders });
  }

  confirmTransfer(transferID: string) {
    const url = `http://localhost:5000/gilded-onramp/us-central1/confirmTransfer`;

    const body = { id: transferID };

    console.log(JSON.stringify(body));

    return this.http.post(url, JSON.stringify(body), { headers: this.httpHeaders });

  }
}
