import {ComponentRef, ElementRef, Inject, Injectable, Injector} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';

import { MiniProfilev2Component} from "../components/other-user-profile/mini-profilev2/mini-profilev2.component";
import {UserPreviewOverlayRef} from "../components/other-user-profile/mini-profilev2/user-preview-overlay-ref";
import {User} from "../domain/User";
import {USER_PREVIEW_DIALOG_DATA} from "../components/other-user-profile/mini-profilev2/user-preview-overlay.tokens";

interface UserPreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  user?: User;
}
const DEFAULT_CONFIG: UserPreviewDialogConfig = {
  hasBackdrop: false,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel'
}

@Injectable({
  providedIn: 'root'
})
export class MiniProfilOverlayService {
  private triggerElementRef: ElementRef;
  public user: User
  constructor(private overlay: Overlay,
              private injector: Injector) { }

  open( triggerEvent: ElementRef, user: User) {
    // Returns an OverlayRef which is a PortalHost
    this.triggerElementRef=triggerEvent;
    //console.log(user);
    this.user=user;
    const dialogConfig = DEFAULT_CONFIG;
    const overlayRef = this.createOverlay(dialogConfig);
    const dialogRef = new UserPreviewOverlayRef(overlayRef);
    // Create ComponentPortal that can be attached to a PortalHost
    const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);
    overlayRef.backdropClick().subscribe(_ => dialogRef.close());

    return dialogRef;
  }
  private createOverlay(config: UserPreviewDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }
  private attachDialogContainer(overlayRef: OverlayRef, config: UserPreviewDialogConfig, dialogRef: UserPreviewOverlayRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(MiniProfilev2Component, null, injector);
    const containerRef: ComponentRef<MiniProfilev2Component> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }
  private createInjector(config: UserPreviewDialogConfig, dialogRef: UserPreviewOverlayRef): PortalInjector {
    /*const injectionTokens = new WeakMap();

    injectionTokens.set(UserPreviewOverlayRef, dialogRef);
    injectionTokens.set(USER_PREVIEW_DIALOG_DATA, config.user);

    return new PortalInjector(this.injector, injectionTokens);*/
    const inj= Injector.create({
      parent: this.injector,
      providers:[
        {provide: USER_PREVIEW_DIALOG_DATA, useValue: this.user},
        {provide: UserPreviewOverlayRef, useValue: dialogRef}
      ]
    })
    return <PortalInjector>inj
  }
  private getOverlayConfig(config: UserPreviewDialogConfig): OverlayConfig {
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(rect)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      }, {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      }]);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy
    });

    return overlayConfig;
  }
}
