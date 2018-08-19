import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  startForm: FormGroup;
  basicForm: FormGroup;
  billingForm: FormGroup;

  step: number = 1;

  completedSteps = {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  };

  constructor(private _fb: FormBuilder) {
    this.startForm = this._fb.group({
      ethAddress: [],
      sourceCurrency: [],
      destCurrency: [],
      destAmount: [],
    });

    this.basicForm = this._fb.group({
      beneficiaryType: [, Validators.required],
      country: [, Validators.required],
      beneficiaryEmailAddress: [],

      // individual
      firstNameOnAccount: [],
      lastNameOnAccount: [],
      beneficiaryPhoneNumber: [],

      // corporate
      beneficiaryCompanyName: [],
      beneficiaryEinTin: [],
      beneficiaryLandlineNumber: [],
    });


    this.billingForm = this._fb.group({
      accountNumber: [],
      routingNumber: [],
      accountType: [],
    });
   
  }

}
