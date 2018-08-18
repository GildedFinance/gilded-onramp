import { Component, OnInit } from '@angular/core';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private mdbSpinningPreloader: MDBSpinningPreloader) {
    //
  }

  ngOnInit(): void {
    this.mdbSpinningPreloader.stop();
  }
}
