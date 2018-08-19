import { Component, OnInit } from '@angular/core';
import { WizardService } from '../../../services/wizard.service';

@Component({
  selector: 'onramp-basic',
  templateUrl: './onramp-basic.component.html',
  styleUrls: ['./onramp-basic.component.scss']
})
export class OnRampBasicComponent implements OnInit {

  constructor(public wizardService: WizardService) { }

  ngOnInit() {
  }

  next() {
    this.wizardService.completedSteps.step2 = true;
    this.wizardService.step = 3;
  }

}
