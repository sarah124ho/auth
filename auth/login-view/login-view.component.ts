import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
//HttpClient  imported for connection API
import { HttpClient, HttpHeaders } from '@angular/common/http';
//Location imported that url changed  
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { AuthenticationService } from 'src/app/api/authentication.service';
import { ThisReceiver } from '@angular/compiler';
import { AuthenticationInputDTO } from '../../../domain/authentication.dto';
import { Observable } from 'rxjs';
import { BaseResponseDTO } from '../../../domain/base-response.dto';
import { AlertService } from '../../../services/alert.service'



@UntilDestroy()
@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class LoginViewComponent implements OnInit {
  //
  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private authServices: AuthenticationService,
    private authorization: AuthorizationService,
    private aleartServices: AlertService

  ) { }

  ngOnInit(): void { }
  // mobileIsOk is false button inactive
  mobileIsOk: boolean = false;
  // 
  userRequest!: string;
  // object difnation 
  requestData: AuthenticationInputDTO = {
    mobile: "0",
    role: 'USER',
  };
  //defalt registerMode 
  public registerMode: boolean = false;
  // eroor 
  eroor!: string;
  //
  isActiveRoll: boolean = false;
  //when registerMode ture or false class  changed//
  public changeMode(): void {
    this.registerMode = !this.registerMode;
  }
  //input verifcation code save in singInInput
  InphoneNumber(value: string) {
    if (value.length === 10) {
      this.mobileIsOk = true;
      this.requestData.mobile = '+98' + value;
    } else {
      this.mobileIsOk = false;
    }
  }
  //
  InActiveDr(isDrActive: boolean) {
    //
    this.isActiveRoll = isDrActive;
  }
  //
  sendVerifcationCode() {
    // 
    if (this.isActiveRoll === true) {
      this.requestData.role = 'DOCTER';
    } else if (this.isActiveRoll === false) {
      this.requestData.role = 'USER'
    }
    // registermode false => singup
    let authObs: Observable<BaseResponseDTO<string>>
    // 
    if (!this.registerMode) {
      ///registerMode true => singup 
      console.log("up")
      this.userRequest = 'Signup'
      authObs = this.authServices.SignUp({
        mobile: this.requestData.mobile,
        role: this.requestData.role,
      })

    } else {
      // registerMode true => singin 
      this.userRequest = 'Signin'
      authObs = this.authServices.SignIn({
        mobile: this.requestData.mobile,
        role: this.requestData.role
      })
    }
    authObs.pipe(untilDestroyed(this)).subscribe({
      next: (result) => {
        console.log(result)
        if (result.errors) {
          alert(result.errors)
        } else {
          this.router.navigate(['/auth/verify'],
            { queryParams: { mobile: this.requestData.mobile, userRequest: this.userRequest, role: this.requestData.role } }
          )
        }
      },
      error: (error) => {
        console.log("------>", error.message)
        switch (error.message) {
          case 'account with specified params already exist':
            this.eroor = "این شماره وجود دارد";
            this.aleartServices.error(this.eroor, "1", { title: "خطا" })
            break;
          case "account not found or password error":
            this.eroor = "این شماره در سیستم ثبت نشده است لطفا ثبت نام کنید"
            this.aleartServices.error(this.eroor, "2", { title: "خطا" })
            break
          case "Http failure response for http://192.168.1.2:8080/api/v1/account/signup: 0 Unknown Error":
            this.eroor = "ارتباط با سرور قطع می باشد"
            this.aleartServices.error(this.eroor, "3", { title: "خطا" })
            break
          case "Http failure response for http://192.168.1.2:8080/api/v1/account/sign_in: 0 Unknown Error":
            this.eroor = "ارتباط با سرور قطع می باشد"
            this.aleartServices.error(this.eroor, "4", { title: "خطا" })
            break

        }

      }
    })
  }

  SHOW() {
    console.log(this.aleartServices.onAlert("1"))
  }
  SHOW1() {
    this.aleartServices.error("eroor", "1", { title: 'roor two' })
  }
  SHOW2() {
    this.aleartServices.confirm("confirm", "2", " ddgdgg")
  }
  SHOW3() {
    this.aleartServices.success(":sucsses", "3", { title: 'sucsees' })
  }
  SHOW4() {
    this.aleartServices.warn("warn", '5')
  }
  SHOW5() {
    this.aleartServices.info("info", "4")
  }

}




