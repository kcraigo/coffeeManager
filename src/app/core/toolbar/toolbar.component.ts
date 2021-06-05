import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { MsalBroadcastService} from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

isAuthenticated = false;
curLogin = "";

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDir = new EventEmitter<void>();


  constructor(private authService: AuthService, private msalBroadcastService: MsalBroadcastService) {}

  ngOnInit() {
    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
    )
    .subscribe((result: EventMessage) => {
      console.log(result);
      if (result?.payload?.account) {
        this.authService;
      }
    });

    this.checkAuth();
  }

async signIn(): Promise<void> {
    await this.authService.login();
  }

  signOut(): void {
    this.authService.logout();
  }

/**
 * Get the current logged in user name.
 */
  checkAuth() {
    let isAuthorized = this.authService.checkLogin();
    if( isAuthorized ) {
      this.curLogin = this.authService.getCurrentLogin();
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }

}
