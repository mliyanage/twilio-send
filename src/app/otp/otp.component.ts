import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  isProgressVisible: boolean;
  otpForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private uiService:UiService) {
    this.isProgressVisible = false;
  
}

  ngOnInit(): void {
    this.otpForm = new FormGroup({
      'otpValue': new FormControl('', Validators.required)
  });
  }

  validateOTP(){
    this.isProgressVisible = true;
    this.authService.otpVerificationCheck(this.otpForm.value.otpValue).subscribe(
      (data) => {
        this.isProgressVisible = false; 
        this.router.navigate(['/home']);
      },
      (err) => {
        this.isProgressVisible = false; 
        this.uiService.showSnackBar("OTP Validation failed",null,300);
      }
    );
  }
}
