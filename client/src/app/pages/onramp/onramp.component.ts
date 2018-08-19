import { Component, OnInit } from '@angular/core';
import { WizardService } from '../../services/wizard.service';

@Component({
  selector: 'onramp',
  templateUrl: './onramp.component.html',
  styleUrls: ['./onramp.component.scss']
})
export class OnRampComponent implements OnInit {

  constructor(public wizardService: WizardService) { }

  ngOnInit() {
  }

  moveStepForward(currentStep, nextStep) {
    console.log('moving');
    if (this.wizardService.completedSteps[`step${currentStep}`] === true) {
      this.wizardService.step = nextStep;
    }
  }

}
