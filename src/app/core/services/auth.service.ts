import { Component, OnInit, Inject, OnDestroy, Injectable } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { OAuthSettings } from 'src/oauth';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  userName = "";
  private readonly _destroying$ = new Subject<void>();
  msalService: any;
  alertsService: any;
  authenticated!: boolean;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkLogin();
      });
  }

/**
 * Check if the user is logged in. If true set the userName.
 * @returns boolean
 */
  checkLogin() {
    const curAccount = this.authService.instance.getAllAccounts();

    if (curAccount === null ) {
      console.log("No Accounts found!");
      return false;
    } else if ( curAccount .length > 1) {
      console.log("More than one Account was found!");
      return false;
    } else if (curAccount.length === 1) {
      this.userName = curAccount[0].name!;
      return true;
    }
    return;
  }

  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
        } else {
          this.authService.loginPopup()
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
            });
      }
    } else {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  /**
   * Return the current user name.
   * @returns string
   */
  getCurrentLogin() {
    return this.userName;
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {
    let result = await this.msalService.acquireTokenSilent(OAuthSettings)
      .catch((reason: any) => {
        this.alertsService.addError('Get token failed', JSON.stringify(reason, null, 2));
      });

    if (result) {
      // Temporary to display token in an error box
      this.alertsService.addSuccess('Token acquired', result.accessToken);
      return result.accessToken;
    }

    // Couldn't get a token
    this.authenticated = false;
    return '';
  }


  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
