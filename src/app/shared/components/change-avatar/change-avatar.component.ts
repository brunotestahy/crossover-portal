import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DfActiveModal,
  DfFileUploader,
  DfFileUploadError,
  DfFileUploaderUtils,
  DfLoadingSpinnerService,
} from '@devfactory/ngx-df';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import 'rxjs/add/operator/take';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { EventWithStringResult } from 'app/core/models/browser';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { Base64 } from 'app/shared/helpers';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.scss'],
})
export class ChangeAvatarComponent implements OnInit {

  public static readonly ERROR = {
    wrongExtension: 'Not allowed extension! JPEG and PNG allowed only',
    maxFileExceeded: 'Only 1 file allowed; use "Remove Photo" button below to reset.',
    maxSizeExceeded: 'File too big. Try a smaller one.',
    upload: 'Error thrown uploading your file. Please try again in some minutes',
  };
  public static readonly USER_IMAGES = '/assets/images/';

  public currentFile: File;
  public fileUploader = new DfFileUploader({
    fileTable: true,
    actions: false,
    dropZone: true,
    dropZoneLabel: 'Drag file here or click to upload',
    fileExtensions: ['jpg', 'jpeg', 'png'],
    queueMaxLength: 1,
    fileMaxSize: 2000000,
  });
  public cropperSettings: CropperSettings = new CropperSettings();
  public avatar: string;
  @ViewChild('cropper')
  public cropper: ImageCropperComponent;
  public cropperData = {} as { image?: {} }; // required since cropper plugin does not defaults data object
  public error: string | null;

  public changeAvatarSubscription: Subscription;

  constructor(private service: IdentityService,
              private modal: DfActiveModal,
              private loader: DfLoadingSpinnerService) {}

  public ngOnInit(): void {
    this.cropperSettings.width = 160;
    this.cropperSettings.height = 160;
    this.cropperSettings.croppedWidth = 160;
    this.cropperSettings.croppedHeight = 160;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.noFileInput = true;
  }

  public save(): void {
    this.upload();
  }

  public cancel(): void {
    this.modal.close();
  }

  public onFileChanges(event: boolean): void {
    if (event) {
      const file = DfFileUploaderUtils.getAddedFiles(this.fileUploader.filesQueue)[0];
      if (file) {
        file.setComplete();
        this.setImage(file.file);
      }
      this.error = null;
    }
  }

  public onErrorEvent(error: DfFileUploadError): void {
    let errorDescription = '';
    if (error.maxFileExceeded) {
      errorDescription = ChangeAvatarComponent.ERROR.maxFileExceeded;
    }
    if (error.maxSizeExceeded) {
      errorDescription = ChangeAvatarComponent.ERROR.maxSizeExceeded;
    }
    if (error.wrongExtension) {
      errorDescription = ChangeAvatarComponent.ERROR.wrongExtension;
    }
    /* istanbul ignore else */
    if (errorDescription) {
      setTimeout(() => this.error = errorDescription);
    }
  }

  public remove(): void {
    this.fileUploader.removeAll();
    this.cropperData = {};
    this.cropper.reset();
    this.error = null;
  }

  private upload(): void {
    const file = this.croppedImageAsFile(this.cropper.image.image);
    this.loader.showLoader({});
    this.service
      .changeCurrentUserAvatar(file, this.currentFile.name)
      .pipe(
        finalize(() => this.loader.hide())
      )
      .subscribe(
        avatar => this.modal.close(this.avatar = avatar),
        () => this.error = ChangeAvatarComponent.ERROR.upload
      );
  }

  private setImage(file: File): void {
    const image = new Image();
    const reader = new FileReader();
    Object.assign(reader, {
      onload: (event: EventWithStringResult) => {
        image.onload = () => this.cropper.setImage(image);
        image.src = event.target.result;
      },
    });
    reader.readAsDataURL(this.currentFile = file);
  }

  private croppedImageAsFile(base64DataUri: string): Blob {
    const contentExcerpt = Base64.atob(window, base64DataUri.split(',')[1]);
    let contentIndex = contentExcerpt.length;
    const dataByteArray = new Uint8Array(contentIndex);
    while (contentIndex--) {
      dataByteArray[contentIndex] = contentExcerpt.charCodeAt(contentIndex);
    }
    return new Blob([dataByteArray], { type: this.currentFile.type });
  }
}
