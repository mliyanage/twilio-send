import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import isdcodes from '../../assets/isdcodes.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isProgressVisible: boolean;
  loginForm!: FormGroup;
  firebaseErrorMessage: string;
  isdCodelist: {dial_code:string, name:string}[] = isdcodes;

  constructor(private authService: AuthService, private router: Router, private uiService:UiService) {
    this.isProgressVisible = false;
    this.firebaseErrorMessage = '';
}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'isdCodes': new FormControl('', [Validators.required]),
      'phone': new FormControl('', [Validators.required])
      
  });
  }

  login() {
    if (this.loginForm.invalid)
        return;

    const phoneNo = this.loginForm.value.isdCodes+this.loginForm.value.phone;
    //Validate E164 format
    let regexPhone = new RegExp(/^\+[1-9]\d{10,14}$/);
    if (!regexPhone.test(phoneNo)) 
    {
      this.uiService.showSnackBar("Invalid phone number",null,300);
      return;
    }

    this.isProgressVisible = true;

    this.authService.getUserByPhone(phoneNo).subscribe(
      (data) => {
        this.authService.otpSend(phoneNo).subscribe((res)=>{
          this.uiService.showSnackBar("Otp has been sent",null,300);  
          this.router.navigate(['/otp']);
        })
      },
      (err) => {
        this.isProgressVisible = false; 
        this.uiService.showSnackBar("User does not exists, please sign up",null,300);
      }
    );
   
}



}
