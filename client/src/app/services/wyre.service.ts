import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class WyreService {

  constructor(private http: HttpClient, private formService: FormService) { }

  createWallet() {
    // const url = environment.api_url + `/sendEmail`;

    const start = this.formService.startForm.value;
    const basic = this.formService.basicForm.value;
    const billing = this.formService.billingForm.value;

    const body = JSON.stringify({
      start, basic, billing
    });

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    // call cloud service
    // return this.http.post(url, body, { headers: httpHeaders }).toPromise();
  }
}
