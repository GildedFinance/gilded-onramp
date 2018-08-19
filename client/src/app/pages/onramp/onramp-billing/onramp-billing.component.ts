import { Component, OnInit } from '@angular/core';
import { WizardService } from '../../../services/wizard.service';

@Component({
  selector: 'onramp-billing',
  templateUrl: './onramp-billing.component.html',
  styleUrls: ['./onramp-billing.component.scss']
})
export class OnRampBillingComponent implements OnInit {

  constructor(public wizardService: WizardService) { }

  ngOnInit() {
  }

  next() {
    this.wizardService.completedSteps.step3 = true;
    this.wizardService.step = 4;
  }
}