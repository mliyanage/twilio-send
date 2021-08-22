import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private snackbar: MatSnackBar) { }

  showSnackBar(message:string, action:any, duration:any) {
    this.snackbar.open(message, action, {
      duration: duration, verticalPosition: "top"
    });
  }

}
