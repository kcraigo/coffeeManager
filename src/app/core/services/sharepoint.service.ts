import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthService } from './auth.service';
import { SPLISTSCONFIG } from '../../../oauth';
import { AlertService } from './alert.service';
import { CoffeeInventory } from '../models/coffeeInventory';


const SHAREPOINT_SITE = SPLISTSCONFIG.siteID;
const COFFEEINVENTORY_LISTID = SPLISTSCONFIG.coffeeInventoryID;
const IMPULSEITEMS_LISTID = SPLISTSCONFIG.ImpulseItems;
const CUPPSMUGS_LISTID = SPLISTSCONFIG.cupsMugsID;


@Injectable({
  providedIn: 'root'
})
export class SharepointService {
  graphClient!: Client;

  constructor(
    private _notifierService: AlertService,
    private _auth: AuthService
  ) {
    if (!this._auth.authenticated) return;

     this.graphClient = Client.init({
      // Initialize the Graph client with an auth
      // provider that requests the token from the
      // auth service
      authProvider: async (done) => {
        let token = await this._auth.getAccessToken().catch((reason) => {
          done(reason, null);
        });

        if (token) {
          done(null, token);
        } else {
          done('Could not get an access token', null);
        }
      },
    });
  }

  /**
   * CoffeeInventory
   */
   async getCoffeeInventory(): Promise<CoffeeInventory[]> {
     try {
      let result = await this.graphClient
        .api(
          'sites/' +
          SHAREPOINT_SITE +
          '/lists/' +
          COFFEEINVENTORY_LISTID +
          '/items?expand=fields(select=Id,Title,Brand,Description,Organic,Grower,Region,ReOrderLevel)'
        )
        .get();

        return result;
    } catch (error) {
      this._notifierService.addNotification('Get Sites failed', error);
    }
    return;
  }
}
