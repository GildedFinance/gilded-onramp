import { Component, OnInit } from '@angular/core';
import { WizardService } from '../../../services/wizard.service';

@Component({
  selector: 'onramp-start',
  templateUrl: './onramp-start.component.html',
  styleUrls: ['./onramp-start.component.scss']
})
export class OnRampStartComponent implements OnInit {

  constructor(public wizardService: WizardService) { }

  ngOnInit() {
  }

  next() {
    this.wizardService.completedSteps.step1 = true;
    this.wizardService.step = 2;
  }
}