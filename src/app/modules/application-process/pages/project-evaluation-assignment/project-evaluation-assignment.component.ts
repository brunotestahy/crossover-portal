import { Component, HostBinding, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DfFile,
  DfFileUploader,
  DfFileUploadError,
  DfFileUploaderUtils,
  DfLoadingSpinnerService,
  DfModalService,
} from '@devfactory/ngx-df';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

import { JobApplication, ProjectEvaluationAssignment } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-project-evaluation-assignment',
  templateUrl: './project-evaluation-assignment.component.html',
  styleUrls: [
    './project-evaluation-assignment.component.scss',
    '../../shared/steps.scss',
  ],
})
export class ProjectEvaluationAssignmentComponent implements OnInit {
  public static readonly STEP_NO = 3;

  public static readonly ERROR = {
    maxFileExceeded: `Only one file allowed.`,
    maxSizeExceeded: `Maximum file size passed. Please check the file you're trying to upload.`,
    wrongExtension: `Only ZIP files allowed.`,
  };

  @HostBinding('class')
  public readonly classes = 'project-evaluation-assignment';

  public applicationId: number;
  public data: ProjectEvaluationAssignment;
  public startDate: number;
  public endDate: number;
  public assignmentUrl: string;
  public uploadControl: FormControl;
  public error: string;
  public fileUploader: DfFileUploader;
  public pdfAssignmentUrl: string;
  public extensionForm: FormGroup;

  public canSubmitAssignmentRequest = true;

  public isIE: Boolean = false;

  constructor(private service: CandidateService,
    private loader: DfLoadingSpinnerService,
    private modal: DfModalService,
    private router: Router,
    private route: ActivatedRoute) {

    this.isIE = navigator.appName.toLocaleLowerCase().search('microsoft') > -1;

    this.uploadControl = new FormControl('', [Validators.required]);

    this.extensionForm = new FormGroup({
      days: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(7)]
      ),
      reason: new FormControl('', [Validators.required]),
    });

    this.fileUploader = new DfFileUploader({
      fileTable: true,
      actions: false,
      dropZone: true,
      dropZoneLabel: 'Drag file here or click to upload',
      fileExtensions: ['zip'],
      queueMaxLength: 2,
      fileMaxSize: 30 * 1024 * 1024,
    });
  }

  public ngOnInit(): void {
    this.loader.reveal();

    const body = document.querySelector('.application-process__body') as HTMLBodyElement;
    body.scrollTop = 0;

    this.service.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        this.assignmentUrl = `${application.job.title} Assigment.pdf`;
        this.applicationId = application.id;
        this.service.getProjectEvaluationAssignment(application.id)
          .subscribe((assignment: ProjectEvaluationAssignment) => {
            this.data = assignment;
            this.canSubmitAssignmentRequest = assignment.canSubmitAssignmentRequest;
            this.startDate = moment.unix(assignment.assignmentStartDate).valueOf();
            this.endDate = moment.unix(assignment.assignmentEndDate).valueOf();
            this.pdfAssignmentUrl = `${environment.apiPath}/hire/applications/${application.id}/tests/assignment.pdf`;
            this.loader.hide();
          });
      });
  }

  public openTimeExtensionModal(template: TemplateRef<{}>): void {
    this.extensionForm.controls.reason.reset();
    this.extensionForm.controls.days.setValue('1');
    this.modal.open(template);
  }

  public onFileChanges(): void {
    let file = DfFileUploaderUtils.getAddedFiles(this.fileUploader.filesQueue)[0];

    if (this.fileUploader.filesQueue.length > 1) {
      const previousFile = this.fileUploader.filesQueue[0];
      this.fileUploader.removeFile(previousFile);
      file = DfFileUploaderUtils.getAddedFiles(this.fileUploader.filesQueue)[0];
    }

    if (file) {
       this.upload(file);
    }
  }

  public upload(file: DfFile): void {
    file.setInProgress();
    this.service.uploadAssignment(this.applicationId, file)
      .subscribe(() => {
          file.setComplete();
          file.progress = 1;
          this.error = '';
          this.uploadControl.setValue(file.file.name);
          this.ngOnInit();
        },
        err => {
          file.setError();
          file.progress = 0;
          this.uploadControl.setValue(file.file.name);
          const data = JSON.parse(err.error);
          this.error = data.text;
        });
  }

  public onErrorEvent(error: DfFileUploadError): void {
    if (error.maxFileExceeded) {
      this.error = ProjectEvaluationAssignmentComponent.ERROR.maxFileExceeded;
    }
    if (error.maxSizeExceeded) {
      this.error = ProjectEvaluationAssignmentComponent.ERROR.maxSizeExceeded;
    }
    if (error.wrongExtension) {
      this.error = ProjectEvaluationAssignmentComponent.ERROR.wrongExtension;
    }
  }

  public submitExtension(): void {
    this.loader.reveal();
    this.service.extendAssignment({
      id: (this.applicationId || '').toString(),
      requestType: 'AssignmentExtension',
      requiredDuration: this.extensionForm.value.days,
      content: this.extensionForm.value.reason,
    }).subscribe(() => {
      this.loader.hide();
      this.ngOnInit();
    });
  }

  public submit(): void {
    this.loader.reveal();
    this.service.submitAssignment(this.applicationId)
      .pipe(
        finalize(() => this.loader.hide())
      )
      .subscribe(
        () => this.router.navigate(['..', 'project-evaluation-submitted'], {relativeTo: this.route}),
        () => true
      );
  }

  public downloadAssignmentPdf(newWindow?: Window): void {
    this.service.downloadFile(this.pdfAssignmentUrl).subscribe(response => {
      const data = response.body;
      const filename = response.headers.get('x-filename') || 'Assignment.pdf';
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      let blob, url;
      let success = false;

      blob = new Blob([response.body], {type: 'application/octet-stream'});

      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
        success = true;
      }

      if (!success) {
        // Get the blob url creator
        const urlCreator = window.URL;
        if (urlCreator) {
          // Try to use a download link
          const link = document.createElement('a');
          const DOWNLOAD = 'download';
          if (DOWNLOAD in link) {
            blob = new Blob([data], {type: contentType});
            url = urlCreator.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute(DOWNLOAD, filename);

            const event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 1, 0,
              0, 0, 0, false, false, false, false, 0, null);
            link.dispatchEvent(event);
            success = true;
          }

          if (!success) {
            // fallback for safari
            if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
              navigator.userAgent && !navigator.userAgent.match('CriOS') && newWindow) {
              url = 'data:' + contentType + ';base64,' +
                CandidateService.arrayBufferToBase64(Object.assign(data as {}));
              newWindow.name = 'Crossover';
              newWindow.location.href = url;
            } else {
              // Fallback to window.location method
              blob = new Blob([data], {type: 'application/octet-stream'});
              url = urlCreator.createObjectURL(blob);
              window.location.href = url;
            }
          }

        }
      }
    }, err => {
      const decoded = String.fromCharCode
        .apply(null, new Uint8Array(err.data));
      return JSON.parse(decoded);
    });
  }
}
