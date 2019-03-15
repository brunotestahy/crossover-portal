import { Platform } from '@angular/cdk/platform';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import {
  DfActiveModal,
  DfFile, DfFileUploadError,
  DfFileUploaderUtils,
  DfLoadingSpinnerModule,
  DfLoadingSpinnerService,
  DfModalModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { CurrentUserDetail } from 'app/core/models/identity';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ChangeAvatarComponent } from 'app/shared/components/change-avatar/change-avatar.component';

class FileReaderMock {
  constructor() {}

  public readAsDataURL(): void {
    this.onload({
      target: {
        result: 'data:image/png;base64,c29tZSBzYW1wbGUgdGV4dA==',
      },
    });
  }

  public onload = (_event: { target: { result: string } }) => {};
}

class FileMock {
}

class ImageMock {
  public set src(_value: {}) {
    this.onload({});
  }
  public onload = (_event: {}) => {};
}

interface WindowWithFile extends Window {
  File: new() => FileMock;
  FileReader: new() => FileReaderMock;
}

interface WindowWithImage extends Window {
  Image: new() => ImageMock;
}

class DfActiveModalMock {
  public close(): void {}
}

describe('ChangeAvatarComponent', () => {
  let component: ChangeAvatarComponent;
  let fixture: ComponentFixture<ChangeAvatarComponent>;
  let identityService: IdentityService;
  let activeModalService: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ChangeAvatarComponent],
      imports: [BrowserModule, DfValidationMessagesModule.forRoot(), DfLoadingSpinnerModule, DfModalModule],
      providers: [
        {provide: DfActiveModal, useClass: DfActiveModalMock},
        {provide: IdentityService, useFactory: () => mock(IdentityService)},
        DfLoadingSpinnerService,
        Platform,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAvatarComponent);
    component = fixture.componentInstance;
    component.cropper = mock(ImageCropperComponent);
    identityService = TestBed.get(IdentityService);
    activeModalService = TestBed.get(DfActiveModal);
  });

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should setImage onFileChanged', () => {
    const file = mock(DfFile);
    const getFilesSpy = spyOn(DfFileUploaderUtils, 'getAddedFiles').and.returnValue([file]);
    const spyCropper = spyOn(component.cropper, 'setImage').and.callFake(() => {
      component.cropperData.image = true;
    });

    const augmentedWindow = window as WindowWithFile & WindowWithImage;
    augmentedWindow.FileReader = FileReaderMock;
    augmentedWindow.Image = ImageMock;

    component.onFileChanges(true);
    expect(spyCropper).toHaveBeenCalled();
    expect(component.cropperData.image).toBeDefined();

    component.onFileChanges(false);
    expect(getFilesSpy).toHaveBeenCalledTimes(1);
  });

  it('should do nothing onFileChanged empty', () => {
    spyOn(DfFileUploaderUtils, 'getAddedFiles').and.returnValue([]);
    component.onFileChanges(true);
    expect(component.cropperData.image).toBeUndefined();
  });

  it('should upload file successfully when save method is invoked', () => {
    component.currentFile = {
      name: 'sample.png',
      type: 'image/png',
    } as File;
    component.cropper.image = {
      image: 'data:image/png;base64,c29tZSBzYW1wbGUgdGV4dA==',
    };

    const res = 'path/to/new/avatar';
    const augmentedWindow = window as WindowWithFile;
    augmentedWindow.File = FileMock;

    spyOn(identityService, 'getCurrentUser')
      .and.returnValue(Observable.of({ email: 'email@address.com', location: {} } as CurrentUserDetail));
    spyOn(identityService, 'changeCurrentUserAvatar').and.returnValue(Observable.of(res));

    component.save();
    expect(component.avatar).toBe(res);
  });

  it('should handle failure when an error occur during save operation', () => {
    component.currentFile = {
      name: 'sample.png',
      type: 'image/png',
    } as File;
    component.cropper.image = {
      image: 'data:image/png;base64,c29tZSBzYW1wbGUgdGV4dA==',
    };

    spyOn(identityService, 'changeCurrentUserAvatar').and.returnValue(
      Observable.throw('error on change avatar'));
    component.save();
    expect(component.error).toBe(ChangeAvatarComponent.ERROR.upload);
  });

  it('should hide the modal successfully', () => {
    spyOn(activeModalService, 'close');
    component.cancel();

    expect(activeModalService.close).toHaveBeenCalled();
  });

  it ('should set proper error value when an error occurs', fakeAsync(() => {
    const error: DfFileUploadError = new DfFileUploadError();

    error.maxFileExceeded = true;
    component.onErrorEvent(error);
    tick();

    expect(component.error).toEqual(ChangeAvatarComponent.ERROR.maxFileExceeded);

    error.maxFileExceeded = false;
    error.maxSizeExceeded = true;
    component.onErrorEvent(error);
    tick();

    expect(component.error).toEqual(ChangeAvatarComponent.ERROR.maxSizeExceeded);

    error.maxFileExceeded = false;
    error.maxSizeExceeded = false;
    error.wrongExtension = true;
    component.onErrorEvent(error);
    tick();

    expect(component.error).toEqual(ChangeAvatarComponent.ERROR.wrongExtension);

    component.remove();

    expect(component.fileUploader.filesQueue).toEqual([]);
    expect(component.cropperData).toEqual({});
    expect(component.error).toEqual(null);
  }));
});
