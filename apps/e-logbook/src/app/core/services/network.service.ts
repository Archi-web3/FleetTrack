import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { SyncService } from './sync.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService implements OnDestroy {
  private syncService = inject(SyncService);

  private online$ = new BehaviorSubject<boolean>(navigator.onLine);
  private subscription: Subscription = new Subscription();

  constructor() {
    this.initConnectivityMonitoring();
  }

  private initConnectivityMonitoring() {
    const online$ = fromEvent(window, 'online').pipe(mapTo(true));
    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

    this.subscription.add(
      merge(online$, offline$).subscribe((isOnline) => {
        this.online$.next(isOnline);
        if (isOnline) {
          this.syncService.syncData().catch((err) => console.error('Auto-sync failed', err));
        } else {
        }
      }),
    );
  }

  public get isOnline$(): Observable<boolean> {
    return this.online$.asObservable();
  }

  public get isOnline(): boolean {
    return this.online$.value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
