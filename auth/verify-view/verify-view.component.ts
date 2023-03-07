import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
//input code 
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { interval, Subscription, Observable, Subject } from 'rxjs';
//Httpclient import from sended  post and get 
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/api/authentication.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { Router } from '@angular/router';
import { BaseResponseDTO } from '../../../domain/base-response.dto';
import { tap } from 'rxjs/operators';

import { AuthorizationDTO } from 'src/app/domain/authorization.dto';
import { ThisReceiver } from '@angular/compiler';








@UntilDestroy()
@Component({
  selector: 'app-verify-view',
  templateUrl: './verify-view.component.html',
  styleUrls: ['./verify-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VerifyViewComponent implements OnInit, OnDestroy {
  //
  public set!: Subscription;
  //
  sendCode: boolean = false;
  //
  time: any = 10
  //get mobile from services
  phoneNumber!: string;
  //
  Interval: any = 0;
  //otpDisable= false use in inputcode tag for this enabled
  otpDisable: boolean = false;
  //singin or singup
  userRequest!: string;
  //user Role
  userRole!: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'DOCTER';
  //
  // token
  token!: string;
  //user r
  //object use post request 
  verificationInput = {
    mobile: "0",
    verification: ""
  };
 

  constructor(
    private http: HttpClient,
    private authServices: AuthenticationService,
    private authorization: AuthorizationService,
    private Router: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

  
    //when page loaded timer excuted  
    this.verifcation()
    // mobile number get from url current 
    this.Router.queryParams
      .subscribe(params => {
        this.phoneNumber = params['mobile'];
        this.userRole = params['role'];
        this.userRequest = params['userRequest']
      })
  }

  ngOnDestroy(): void {}
  //timer excuted for 10 second 
  verifcation() {
    this.time = 10;
    const set = new Observable((subscriber) => {
      this.Interval = setInterval(() => {
        subscriber.next(this.time);
        if (this.time > 0) {
          this.time = this.time - 1
        } else if (this.time == 0) {
          subscriber.complete()
          this.sendCode = true;
        }

      }, 1000)
    });
    set.pipe(untilDestroyed(this)).subscribe((res) => {
      this.time = res;
      if (this.Interval && this.time == 0) {
        clearInterval(this.Interval)
      }
    })
  }
  //when  clicked method resendcode excuted singIn or singUp
  resendCode() {
    //TIMER Excuted agine
    this.verifcation();
    //when sendCode false tage html hidden
    this.sendCode = false;
    //
    let authObsvable:Observable<BaseResponseDTO<string>>
    // request post in server 
    if (this.userRequest ==="Signin") {
      console.log("Signin")
      authObsvable = this.authServices.SignIn({
        mobile: this.phoneNumber,
        role: this.userRole,
      })

    } else  {
      authObsvable = this.authServices.SignUp({
        mobile: this.phoneNumber,
        role: this.userRole,
      })

    }
    authObsvable.pipe(untilDestroyed(this)).subscribe({
      next:(result)=>{
        console.log(result)
      },
      error:(error)=>{
        if(error.message==='previous otp not expired, please wait a few minutes'){
          console.log("please wait")
        }
      }
    })
  
  }
  // input code verify added  
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    pattern: /^\d+$/,
    isPasswordInput: true,
    autoblur: true,
    autofocus: true,

    classList: {
      container: "verification-container ",
      inputBox: "verification-input verification-active",
      input: "verification-input-one",
      inputFilled: "verification-inactive",
      inputDisabled: "verification-inactive",
      inputSuccess: "verification-active",
      inputError: "",
    }
  }

  handleOtpChange(e: any) { }
  // post request for set token
  VerifyReguest() {
    this.authServices.OtpVerify({
      mobile: this.verificationInput.mobile,
      verification: this.verificationInput.verification
    }).pipe(untilDestroyed(this),tap(response=>{
      this.authorization.handelerUser(response)
    
    })).subscribe({
      next: (result) => {
        console.log(result)
        // this.token=result.result.
        this.authorization.setToken(result.result);
        this.router.navigate(['/profile'])
      },
      error: (error) => {
        console.log('------------------------->', error)
      }
    })

  }

  // handeler user 
  

  //when box code filled this method excuted
  handleFillEvent(value: any) {
    //
    this.otpInputConfig.classList = {
      inputBox: "verification-inactive"
    }
    //
    this.verificationInput.mobile = this.phoneNumber;
    this.verificationInput.verification = value;
    //IF NOT TIMEOUT VerifyReguest
    if (!(this.time == 0)) {
      this.VerifyReguest()
    } else {
      console.log('EROOR TIMOUT ')

    }
  }

  
}
