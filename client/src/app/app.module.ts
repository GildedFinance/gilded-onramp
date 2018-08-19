import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, MDBBootstrapModulePro, MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// routing
import { AppRoutingModule } from './app-routing.modules';

// components
import { AppComponent } from './app.component';
import { OnRampComponent } from './pages/onramp/onramp.component';
import { OnRampStartComponent } from './pages/onramp/onramp-start/onramp-start.component';
import { OnRampBasicComponent } from './pages/onramp/onramp-basic/onramp-basic.component';
import { OnRampBillingComponent } from './pages/onramp/onramp-billing/onramp-billing.component';
import { OnRampPreviewComponent } from './pages/onramp/onramp-preview/onramp-preview.component';
import { OnRampFinishComponent } from './pages/onramp/onramp-finish/onramp-finish.component';

// services
import { FormService } from './services/form.service';

@NgModule({
  declarations: [
    AppComponent,
    OnRampComponent,
    OnRampStartComponent,
    OnRampBasicComponent,
    OnRampBillingComponent,
    OnRampPreviewComponent,
    OnRampFinishComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MDBBootstrapModulePro.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [MDBSpinningPreloader, FormService],
  bootstrap: [AppComponent]
})
export class AppModule { }
