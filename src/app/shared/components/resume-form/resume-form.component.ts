import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize, take } from 'rxjs/operators';

import { GetApplicationResponse as Application } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';

@Component({
  selector: 'app-resume-form',
  templateUrl: 'resume-form.component.html',
  styleUrls: ['resume-form.component.scss'],
})
export class ResumeFormComponent {
  protected static fileValidationRules =
    /\.pdf$|\.md$|\.doc$|\.docx$|\.xml$|\.txt$/i;
  public uploadFields: {[applicationId: string]: {
    fileId: number;
    field: { files: FileList };
  }} = {};
  public uploadStarted = false;

  @Input()
  public applications = [] as Application[];

  @Output()
  public save = new EventEmitter<typeof ResumeFormComponent.prototype.uploadFields>();

  @Output()
  public cancel = new EventEmitter<boolean>();

  constructor(
    private hireService: HireService
  ) {
  }

  public onFileChange(applicationId: number, fileId: number,
    event: { preventDefault: () => void, stopPropagation: () => void, target: { files: FileList } }): void {
    if (!this.isValidFile(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.uploadFields[applicationId.toString()] = {
      fileId,
      field: { files: event.target.files },
    };
    const application = this.applications
      .find(entry => entry.id === applicationId) as Application;
    const files = event.target.files as FileList;
    application.resumeFile.name = files[0].name;
  }

  public onDownload(url: string): void {
    window.open(url, '_blank');
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.validFiles) {
      const fileKeys = Object.keys(this.uploadFields)
        .filter(key => this.uploadFields.hasOwnProperty(key))
        .filter(
          applicationId => this.uploadFields[applicationId].field.files.length === 1
        );
      const uploadRequests = fileKeys.map(
        applicationId => this.hireService.putApplicationFile(
        parseInt(applicationId, 10),
        this.uploadFields[applicationId].fileId,
        this.uploadFields[applicationId].field.files[0]
      ));
      this.uploadStarted = true;
      forkJoin(uploadRequests)
        .pipe(
          take(1),
          finalize(() => this.uploadStarted = false)
        )
        .subscribe(requests => requests.forEach(
          entry => this.applications
            .filter(app => app.resumeFile.id === entry.id)[0]
            .fileUrl = entry.signedUrl
        ),
        () => this.uploadStarted = false
      );
    }
  }

  public onCancel(): void {
    this.cancel.emit(true);
  }

  public get validFiles(): boolean {
    const fileKeys = Object.keys(this.uploadFields)
      .filter(key => this.uploadFields.hasOwnProperty(key));
    return fileKeys.length === 0 || fileKeys.reduce((carry, key) =>
      carry || this.isValidFile(this.uploadFields[key].field),
      false
    );
  }

  protected isValidFile(target: { files: FileList }): boolean {
    const files = target.files;
    const hasASingleFile = files.length === 1;
    const extensionMatches = hasASingleFile &&
      ResumeFormComponent.fileValidationRules.test(files[0].name);
    return extensionMatches;
  }
}
