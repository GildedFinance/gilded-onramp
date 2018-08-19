import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'onramp-basic',
  templateUrl: './onramp-basic.component.html',
  styleUrls: ['../onramp.component.scss', './onramp-basic.component.scss']
})
export class OnRampBasicComponent implements OnInit {

  beneficiaryTypeOptions = [
    { value: 'INDIVIDUAL', label: 'Personal' }, 
    { value: 'CORPORATE', label: 'Business' }
  ];

  countryOptions = [
    { value: 'US', label: 'United States' }, 
    { value: 'GB', label: 'Great Britain' },
    { value: 'CA', label: 'Canada' }
  ];

  constructor(public formService: FormService) { }

  ngOnInit() {
  }

  next() {
    this.formService.completedSteps.step2 = true;
    this.formService.step = 3;
  }

}
