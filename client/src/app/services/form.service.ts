import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  formGroup: FormGroup;

  step: number = 1;

  completedSteps = {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  };

  constructor() {
    this.formGroup = new FormGroup({
      // title: new FormControl('', Validators.required),
      
    });
  }

}
