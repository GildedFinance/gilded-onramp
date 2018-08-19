import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { WyreService } from '../../../services/wyre.service';

@Component({
  selector: 'onramp-preview',
  templateUrl: './onramp-preview.component.html',
  styleUrls: ['./onramp-preview.component.scss']
})
export class OnRampPreviewComponent implements OnInit {

  transfer: any;

  constructor(public formService: FormService, public wyreService: WyreService) { }

  ngOnInit() {
    this.wyreService.createTransfer().subscribe(transfer => {
      this.transfer = transfer;
      console.log(transfer);
    });
  }

  next() {
    this.wyreService.confirmTransfer(this.transfer.transferID).subscribe(result => {
      console.log('Confirmation', result);
      this.formService.completedSteps.step4 = true;
      this.formService.step = 5;
    });
  }
}