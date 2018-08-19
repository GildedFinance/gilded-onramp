import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { WyreService } from '../../../services/wyre.service';

@Component({
  selector: 'onramp-billing',
  templateUrl: './onramp-billing.component.html',
  styleUrls: ['./onramp-billing.component.scss']
})
export class OnRampBillingComponent implements OnInit {

  accountTypeOptions = [
    { value: 'CHECKING', label: 'Checking' }, 
    { value: 'SAVINGS', label: 'Savings' }
  ];

  constructor(public formService: FormService, private wyreService: WyreService) { }

  ngOnInit() {
  }

  next() {
    this.formService.completedSteps.step3 = true;
    this.formService.step = 4;
    this.wyreService.createTransfer();
  }
}