import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'onramp',
  templateUrl: './onramp.component.html',
  styleUrls: ['./onramp.component.scss']
})
export class OnRampComponent implements OnInit {

  constructor(public formService: FormService) { }

  ngOnInit() {
  }

  moveStepForward(currentStep, nextStep) {
    console.log('moving');
    if (this.formService.completedSteps[`step${currentStep}`] === true) {
      this.formService.step = nextStep;
    }
  }

}
