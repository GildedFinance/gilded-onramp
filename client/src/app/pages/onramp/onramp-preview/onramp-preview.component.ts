import { Component, OnInit } from '@angular/core';
import { WizardService } from '../../../services/wizard.service';

@Component({
  selector: 'onramp-preview',
  templateUrl: './onramp-preview.component.html',
  styleUrls: ['./onramp-preview.component.scss']
})
export class OnRampPreviewComponent implements OnInit {

  constructor(public wizardService: WizardService) { }

  ngOnInit() {
  }

  next() {
    this.wizardService.completedSteps.step4 = true;
    this.wizardService.step = 5;
  }
}