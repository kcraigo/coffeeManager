import { Injectable, Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';



@Injectable({
  providedIn: 'root'
})

export class AlertService {
  // durationInSeconds: 5;

  constructor(private _snackBar: MatSnackBar){}

  addNotification(displayText: string, messageType: 'error' | 'success' | 'info' | 'warn') {

    this._snackBar.openFromComponent(NotificationComponent, {
      data: {
        message: displayText,
        type: messageType
      },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      announcementMessage:displayText,
      panelClass: messageType

    });
  }

}

@Component({
  selector: 'success',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
})
export class NotificationComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA)public data: any) {}
}
