import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'onramp-basic',
  templateUrl: './onramp-basic.component.html',
  styleUrls: ['./onramp-basic.component.scss']
})
export class OnRampBasicComponent implements OnInit {

  constructor(public formService: FormService) { }

  ngOnInit() {
  }

  next() {
    this.formService.completedSteps.step2 = true;
    this.formService.step = 3;
  }

}
