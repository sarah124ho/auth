import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginViewComponent } from './login-view/login-view.component';
import { VerifyViewComponent } from './verify-view/verify-view.component';


const routes: Routes = [
  { path: 'login', component: LoginViewComponent },
  { path: 'verify', component: VerifyViewComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
