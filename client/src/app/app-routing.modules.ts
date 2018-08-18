
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnRampComponent } from './pages/onramp/onramp.component';

const routes: Routes = [
  { path: '', component: OnRampComponent },
  // { path: 'status', component: StatusComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
