import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UiService } from './ui.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  userLoggedIn: boolean;


  constructor(private router: Router, private angularFirestore: AngularFirestore, private uiService: UiService, private http:HttpClient) {
        this.userLoggedIn = false;
  }

signupUser(user: any): Promise<any> {
      return this.angularFirestore.doc('/users/' + user.phone.substring(1))  
      .set({
          displayName: user.displayName,
          phone: user.phone,
      }).then((result)=>{
        this.uiService.showSnackBar("You will get an OTP",null,300);
        this.saveIntoLocal("phone",user.phone)
      }).catch(error => {
        this.uiService.showSnackBar("Sign up failed, try again later",null,300);
  });

}

sendMesg(message: any): Promise<any> {
  return this.angularFirestore.collection('messages')  
  .add(message).then((result)=>{
    this.uiService.showSnackBar("Message has been sent",null,300);
    this.saveIntoLocal("mesgId",result.id)
  }).catch(error => {
    this.uiService.showSnackBar("Sign up failed, try again later",null,300);
});

}

getMessageLogs(msgId: string) {
  return this.angularFirestore.collection("message-log", (ref) => ref.where("msgStatus.SmsSid", "==", msgId)).valueChanges();
}


getUserByPhone(phone: string):Observable<any> {
  const phoneNo = phone.substring(1); //without + prefix
  return this.angularFirestore.doc('users/' + phoneNo).snapshotChanges();
}


sendText(message: any):Observable<any> {
  return this.post("/textSend",{"phone":message.phone, "messageText":message.messageText})
}

otpSend(phone: string): Observable<any> {
 
  return this.post("/otpSend",{"phone":phone})
}

otpVerificationCheck(otp: string): Observable<any> {
  const phone = this.readFromLocal("phone");
  return this.post("/otpVerificationCheck",{"phone":phone, "otp": otp})
}

public post(url: string, data: any, options?: any) { 
  return this.http.post(this.baseUrl + url, data, options); 
}
  
saveIntoLocal(key:string, val:string): void {
 sessionStorage.setItem(key, val);
}

readFromLocal(key:string): string {
  return sessionStorage.getItem(key);
}

}
