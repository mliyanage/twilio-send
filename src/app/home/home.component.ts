import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import isdcodes from '../../assets/isdcodes.json';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { msgStatus: msgStatus; }
export interface msgStatus { From: string, To: string, MessageSid: string; MessageStatus: number }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  isProgressVisible: boolean;
  messageForm!: FormGroup;
  firebaseErrorMessage: string;
  isdCodelist: {dial_code:string, name:string}[] = isdcodes;
  
  userRef: any
  messages: any;


itemRef: AngularFirestoreCollection<any>;
items: Observable<any[]>

  constructor(private authService: AuthService, private router: Router, private uiService:UiService, private afs: AngularFirestore) {
    this.isProgressVisible = false;
    this.firebaseErrorMessage = '';
}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
        'message': new FormControl('', Validators.required),
        'isdCodes': new FormControl('', [Validators.required]),
        'phone': new FormControl('', [Validators.required])
        
    });

  }

  send() {

    if (this.messageForm.invalid)
    return;
    
    const phoneNo = this.messageForm.value.isdCodes+this.messageForm.value.phone;
    //Validate E164 format
    let regexPhone = new RegExp(/^\+[1-9]\d{10,14}$/);
    if (!regexPhone.test(phoneNo)) 
    {
      this.uiService.showSnackBar("Invalid phone number",null,300);
      return;
    }
    const mesg = {messageText:this.messageForm.value.message, phone:phoneNo};
    
    this.isProgressVisible = true;
    this.authService.sendText(mesg).subscribe((result) => {
      // console.log("after sending");
      // console.log(result.result.sid)
      this.isProgressVisible = false; 
      this.itemRef = this.afs.collection<any>('message-log', ref => {
        return ref
                .where("msgStatus.SmsSid", "==", result.result.sid)
        });
      this.items = this.itemRef.valueChanges();
      //this.items.subscribe(val => console.log(val));
      },
      (err) => {
        this.isProgressVisible = false; 
        this.uiService.showSnackBar("Message failed",null,300);
      }
      ); 
      
      
  
}

}