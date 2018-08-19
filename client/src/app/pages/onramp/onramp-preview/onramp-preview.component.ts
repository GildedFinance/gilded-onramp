import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'onramp-preview',
  templateUrl: './onramp-preview.component.html',
  styleUrls: ['./onramp-preview.component.scss']
})
export class OnRampPreviewComponent implements OnInit {

  transfer: any = 1;

  constructor(public formService: FormService) { }

  ngOnInit() {
  }

  next() {
    this.formService.completedSteps.step4 = true;
    this.formService.step = 5;
  }
}