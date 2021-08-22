import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import isdcodes from '../../assets/isdcodes.json';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isProgressVisible: boolean;
  signupForm!: FormGroup;
  firebaseErrorMessage: string;
  isdCodelist: {dial_code:string, name:string}[] = isdcodes;
  
  userRef: any

  constructor(private authService: AuthService, private router: Router, private uiService:UiService) {
    this.isProgressVisible = false;
    this.firebaseErrorMessage = '';
}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
        'displayName': new FormControl('', Validators.required),
        'isdCodes': new FormControl('', [Validators.required]),
        'phone': new FormControl('', [Validators.required])
        
    });
  }

  async signup() {

    if (this.signupForm.invalid)
    return;
    
    const phoneNo = this.signupForm.value.isdCodes+this.signupForm.value.phone;
    //Validate E164 format
    let regexPhone = new RegExp(/^\+[1-9]\d{10,14}$/);
    if (!regexPhone.test(phoneNo)) 
    {
      this.uiService.showSnackBar("Invalid phone number",null,300);
      return;
    }
    const userforsave = {displayName:this.signupForm.value.displayName, phone:phoneNo};
    console.log(userforsave);
    this.isProgressVisible = true;
    this.authService.signupUser(userforsave).then((result) => {
        if (result == null)             
            this.router.navigate(['/otp']);
        else if (result.isValid == false)
            this.firebaseErrorMessage = result.message;

        this.isProgressVisible = false; 
    }).catch(() => {
        this.isProgressVisible = false;
    });
}

}
