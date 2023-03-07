import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { VerifyViewComponent } from './verify-view/verify-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthtabBarComponent } from 'src/app/components/authtab-bar/authtab-bar.component';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { MobileinputComponent } from 'src/app/components/mobileinput/mobileinput.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    VerifyViewComponent,
    LoginViewComponent,
    AuthtabBarComponent,
    MobileinputComponent,
 
    
    

   
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    MatInputModule,
    ReactiveFormsModule,
    NgxOtpInputModule,
    SharedModule,
    HttpClientModule,
   
    
  ]
})
export class AuthModule { }
