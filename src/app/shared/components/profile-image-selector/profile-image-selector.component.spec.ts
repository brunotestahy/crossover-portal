import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfAlertButton,
  DfAlertOptions,
  DfAlertService,
  DfButtonModule,
  DfCardModule,
  DfFileUploadModule,
  DfInputModule,
  DfModalService,
  DfMouseUpService,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { ChangeAvatarComponent } from 'app/shared/components/change-avatar/change-avatar.component';
import { PageAlertComponent } from 'app/shared/components/page-alert/page-alert.component';
import {
  ProfileImageSelectorComponent,
} from 'app/shared/components/profile-image-selector/profile-image-selector.component';

describe('ProfileImageSelectorComponent', () => {
  let component: ProfileImageSelectorComponent;
  let fixture: ComponentFixture<typeof component>;
  let alertService: DfAlertService;
  let modalService: DfModalService;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        ChangeAvatarComponent,
        ImageCropperComponent,
        PageAlertComponent,
        ProfileImageSelectorComponent,
      ],
      imports: [
        DfButtonModule,
        DfCardModule,
        DfFileUploadModule,
        DfInputModule,
        DfValidationMessagesModule.forRoot(),
        LayoutModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        DfAlertService,
        DfMouseUpService,
        DfModalService,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ProfileImageSelectorComponent);
      component = fixture.componentInstance;
      alertService = TestBed.get(DfAlertService);
      modalService = TestBed.get(DfModalService);
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should handle image selection successfully', fakeAsync(() => {
    const photoUrl = 'http://my/new/avatar.png';
    spyOn(modalService, 'open').and.returnValue({
      instance: { title: '' },
      onClose: Observable.of(photoUrl),
    });

    component.onImageSelect('SAMPLE TITLE');
    tick();

    expect(component.photoUrl).toBe(photoUrl);
  }));

  it('should handle image removal successfully', async(() => {
    spyOn(alertService, 'createAlertComponent').and.callFake((params: DfAlertOptions) => {
      const button = (params.buttons as DfAlertButton[])[0];
      if (button && button.handler) {
        button.handler();
      }
    });

    component.remove
      .pipe(take(1))
      .subscribe(data => expect(data).toBe(true));

    component.onImageRemove();
  }));
});
