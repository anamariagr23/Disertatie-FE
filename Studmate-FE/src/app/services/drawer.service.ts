import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private drawerState = new Subject<boolean>();
  drawerState$ = this.drawerState.asObservable();

  openDrawer() {
    this.drawerState.next(true);
  }

  closeDrawer() {
    this.drawerState.next(false);
  }
}
