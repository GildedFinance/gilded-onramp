import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'onramp-start',
  templateUrl: './onramp-start.component.html',
  styleUrls: ['./onramp-start.component.scss']
})
export class OnRampStartComponent implements OnInit {

  constructor(public formService: FormService) { }

  ngOnInit() {
  }

  next() {
    this.formService.completedSteps.step1 = true;
    this.formService.step = 2;
  }
}