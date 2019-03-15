import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DfAlertService, DfAlertType, DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { ChangeAvatarComponent } from 'app/shared/components/change-avatar/change-avatar.component';

@Component({
  selector: 'app-profile-image-selector',
  templateUrl: './profile-image-selector.component.html',
  styleUrls: ['./profile-image-selector.component.scss'],
})
export class ProfileImageSelectorComponent {
  public defaultPhotoUrl = '/assets/images/user.png';

  @Output()
  public save = new EventEmitter<string>();
  @Output()
  public remove = new EventEmitter<boolean>();

  @Input()
  public photoUrl: string;

  @Output()
  public photoUrlChange = new EventEmitter<string>();

  constructor(
    private alertService: DfAlertService,
    private modal: DfModalService
  ) {
  }

  public onImageSelect(modalTitle: string): void {
    const modal = this.modal.open(ChangeAvatarComponent, {
      customClass: 'change-avatar-modal',
      size: DfModalSize.Large,
      data: this.photoUrl,
    });
    modal.instance.title = modalTitle;
    modal
      .onClose
      .pipe(take(1))
      .subscribe((newAvatar: string) => {
        /* istanbul ignore else */
        if (newAvatar) {
          this.photoUrl = newAvatar;
          this.photoUrlChange.emit(newAvatar);
        }
    });
  }

  public onImageRemove(): void {
    this.alertService
      .createAlertComponent({
        title: 'Delete Photo',
        message: 'Are you sure that you want to delete profile photo?',
        icon: 'fa fa-warning',
        type: DfAlertType.Custom,
        buttons: [
          {
            text: 'Yes',
            handler: () => this.remove.emit(true),
            className: 'info',
          },
          { text: 'No' },
        ],
      });
  }
}
