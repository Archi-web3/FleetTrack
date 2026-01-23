import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { SyncService } from './sync.service';

@Injectable({
    providedIn: 'root'
})
export class NetworkService implements OnDestroy {
    private online$ = new BehaviorSubject<boolean>(navigator.onLine);
    private subscription: Subscription = new Subscription();

    constructor(private syncService: SyncService) {
        this.initConnectivityMonitoring();
    }

    private initConnectivityMonitoring() {
        const online$ = fromEvent(window, 'online').pipe(mapTo(true));
        const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

        this.subscription.add(
            merge(online$, offline$).subscribe(isOnline => {
                this.online$.next(isOnline);
                if (isOnline) {
                    console.log('🌐 Connection restored. Triggering auto-sync...');
                    this.syncService.syncData().catch(err => console.error('Auto-sync failed', err));
                } else {
                    console.log('🚫 Connection lost. App is now offline.');
                }
            })
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
