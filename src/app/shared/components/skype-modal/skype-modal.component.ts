import { AfterViewInit, Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { DfModalService, DfModalSize, DfToolTipDirective } from '@devfactory/ngx-df';

import { Assignment } from 'app/core/models/assignment';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';

@Component({
  selector: 'app-skype-modal',
  templateUrl: './skype-modal.component.html',
  styleUrls: ['./skype-modal.component.scss'],
})
export class SkypeModalComponent implements AfterViewInit {

  @ViewChild(DfToolTipDirective)
  public content: DfToolTipDirective;

  @Input()
  public skypeId: string;

  @Input()
  public container = 'body';

  @Input()
  public includeChangeAvatar = false;

  @Input()
  public assignment: Assignment;

  @ViewChild('changeAvatarModal')
  public changeAvatarModal: TemplateRef<{}>;

  public isVisible = false;

  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private modalService: DfModalService
  ) {
  }

  public ngAfterViewInit(): void {
    this.content.visibilityChange
      .subscribe((mode: boolean) => this.isVisible = mode);
  }

  public call(): void {
    this.window.location.href = `skype:${this.skypeId}?call`;
  }

  public chat(): void {
    this.window.location.href = `skype:${this.skypeId}?chat`;
  }

  public toggle(): void {
    this.isVisible ? this.content.hide() : this.content.show();
  }

  public hide(): void {
    this.content.hide();
  }

  public openChangeAvatarModal(): void {
    this.modalService.open(this.changeAvatarModal, {
      size: DfModalSize.Large,
    });
  }

}
