import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DfCardModule,
  DfFile,
  DfFileUploader,
  DfFileUploadError,
  DfFileUploaderUtils,
  DfLoadingSpinnerService,
  DfModalService,
} from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { CandidateService } from 'app/core/services/candidate/candidate.service';

import { ProjectEvaluationAssignmentComponent } from './project-evaluation-assignment.component';

describe('ProjectEvaluationAssignmentComponent', () => {
  let component: ProjectEvaluationAssignmentComponent;
  let fixture: ComponentFixture<ProjectEvaluationAssignmentComponent>;

  let router: Router;
  let candidateService: CandidateService;
  let loaderService: DfLoadingSpinnerService;
  let modalService: DfModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectEvaluationAssignmentComponent,
      ],
      imports: [
        DfCardModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: of({}),
          },
        },
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: DfLoadingSpinnerService, useFactory: () => mock(DfLoadingSpinnerService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEvaluationAssignmentComponent);
    component = fixture.componentInstance;

    router = TestBed.get(Router);
    candidateService = TestBed.get(CandidateService);
    loaderService = TestBed.get(DfLoadingSpinnerService);
    modalService = TestBed.get(DfModalService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load ngOnInit, get the current application and the project evaluation successfully', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({ job: { title: 'Test' }, id: 12 }));
    spyOn(candidateService, 'getProjectEvaluationAssignment').and.returnValue(of({ id: 23 }));
    spyOn(loaderService, 'reveal');
    spyOn(loaderService, 'hide');
    spyOn(document, 'querySelector').and.returnValue({ scrollTop: null });

    component.ngOnInit();

    expect(loaderService.reveal).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(component.assignmentUrl).toBeDefined();
    expect(component.applicationId).toBeDefined();
    expect(component.data).toBeDefined();
    expect(component.pdfAssignmentUrl).toBeDefined();
  });

  it('should load openTimeExtensionModal method, open the extension modal, set the day input to 1 and reset the reason input', () => {
    spyOn(modalService, 'open');
    spyOn(component.extensionForm.controls.reason, 'reset');
    spyOn(component.extensionForm.controls.days, 'setValue');
    const element = Object.assign({}) as TemplateRef<{}>;

    component.openTimeExtensionModal(element);

    expect(modalService.open).toHaveBeenCalled();
    expect(component.extensionForm.controls.reason.reset).toHaveBeenCalled();
    expect(component.extensionForm.controls.days.setValue).toHaveBeenCalledWith('1');
  });

  it('should load onFileChanges method, delete previous files in the queue and upload the last one', () => {
    spyOn(DfFileUploaderUtils, 'getAddedFiles').and.returnValue([{ filesQueue: [{ name: 'file' }] }]);
    spyOn(component, 'upload').and.returnValue('');
    component.fileUploader = Object.assign({ filesQueue: [{ name: 'file1' }, { name: 'file2' }], removeFile: () => {} }) as DfFileUploader;

    component.onFileChanges();

    expect(component.upload).toHaveBeenCalled();
  });

  it('should load onFileChanges method and not upload a file', () => {
    spyOn(component, 'upload').and.returnValue('');

    component.onFileChanges();

    expect(component.upload).not.toHaveBeenCalled();
  });

  it('should load upload method and upload a file successfully', () => {
    const file = Object.assign({
      file: { name: 'file1' },
      setInProgress: () => {},
      setComplete: () => {},
    }) as DfFile;
    spyOn(candidateService, 'uploadAssignment').and.returnValue(of({}));
    spyOn(component.uploadControl, 'setValue');
    spyOn(component, 'ngOnInit').and.returnValue('');

    component.upload(file);

    expect(component.error).toBeFalsy();
    expect(component.uploadControl.setValue).toHaveBeenCalledWith('file1');
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should load upload method and not upload a file after throwing an error', () => {
    const file = Object.assign({
      file: { name: 'file1' },
      progress: null,
      setInProgress: () => {},
      setError: () => {},
    }) as DfFile;
    spyOn(candidateService, 'uploadAssignment').and.returnValue(_throw({ error: JSON.stringify({ text: 'Error' }) }));
    spyOn(component.uploadControl, 'setValue');

    component.upload(file);

    expect(component.error).toBe('Error');
    expect(file.progress).toBe(0);
    expect(component.uploadControl.setValue).toHaveBeenCalledWith('file1');
  });

  it('should load onErrorEvent method with a maxFileExceeded error', () => {
    const error = Object.assign({
      maxFileExceeded: true,
      maxSizeExceeded: false,
      wrongExtension: false,
    }) as DfFileUploadError;

    component.onErrorEvent(error);

    expect(component.error).toBe(ProjectEvaluationAssignmentComponent.ERROR.maxFileExceeded);
  });

  it('should load onErrorEvent method with a maxSizeExceeded error', () => {
    const error = Object.assign({
      maxFileExceeded: false,
      maxSizeExceeded: true,
      wrongExtension: false,
    }) as DfFileUploadError;

    component.onErrorEvent(error);

    expect(component.error).toBe(ProjectEvaluationAssignmentComponent.ERROR.maxSizeExceeded);
  });

  it('should load onErrorEvent method with a wrongExtension error', () => {
    const error = Object.assign({
      maxFileExceeded: false,
      maxSizeExceeded: false,
      wrongExtension: true,
    }) as DfFileUploadError;

    component.onErrorEvent(error);

    expect(component.error).toBe(ProjectEvaluationAssignmentComponent.ERROR.wrongExtension);
  });

  it('should load submitExtension method and extend the assignment successfully', () => {
    spyOn(loaderService, 'reveal');
    spyOn(loaderService, 'hide');
    spyOn(component, 'ngOnInit').and.returnValue('');
    spyOn(candidateService, 'extendAssignment').and.returnValue(of({}));

    component.submitExtension();

    expect(loaderService.reveal).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should load submit method and submit the assignment successfully', () => {
    spyOn(loaderService, 'reveal');
    spyOn(loaderService, 'hide');
    spyOn(router, 'navigate');
    spyOn(candidateService, 'submitAssignment').and.returnValue(of({}));

    component.submit();

    expect(loaderService.reveal).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should load submit method and throw an error', () => {
    spyOn(loaderService, 'hide');
    spyOn(candidateService, 'submitAssignment').and.returnValue(_throw({}));

    component.submit();

    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should load downloadAssignmentPdf method and download the file successfully with a valid urlCreator', () => {
    const response = {
      body: {},
      headers: {
        get: () => '',
      },
    };
    delete navigator.msSaveBlob;

    window.URL = Object.assign({
      url: 'http://url.com',
      createObjectURL: () => '',
    }) as typeof window.URL;
    spyOn(document, 'createEvent').and.callThrough();
    spyOn(candidateService, 'downloadFile').and.returnValue(of(response));

    const dummyWindow = Object.assign({}) as Window;
    component.downloadAssignmentPdf(dummyWindow);

    expect(document.createEvent).toHaveBeenCalled();
  });

  it('should load downloadAssignmentPdf method and download the file successfully with a null urlCreator', () => {
    const response = {
      body: {},
      headers: {
        get: () => '',
      },
    };

    Object.assign(navigator, { msSaveBlob: null });
    Object.assign(window, { URL: null });

    spyOn(document, 'createEvent').and.callThrough();
    spyOn(candidateService, 'downloadFile').and.returnValue(of(response));

    const dummyWindow = Object.assign({}) as Window;
    component.downloadAssignmentPdf(dummyWindow);

    expect(document.createEvent).not.toHaveBeenCalled();
  });

  it('should load downloadAssignmentPdf method and download the file successfully with a null link', () => {
    const response = {
      body: {},
      headers: {
        get: () => '',
      },
    };
    delete navigator.msSaveBlob;

    window.URL = Object.assign({
      url: 'http://url.com',
      createObjectURL: () => '',
    }) as typeof window.URL;
    const wrongLink = document.createElement('p');
    spyOn(document, 'createEvent').and.callThrough();
    spyOn(document, 'createElement').and.returnValue(wrongLink);
    spyOn(CandidateService, 'arrayBufferToBase64').and.returnValue('test value');
    spyOn(candidateService, 'downloadFile').and.returnValue(of(response));

    const dummyWindow = Object.assign({location: { href: null}}) as Window;
    component.downloadAssignmentPdf(dummyWindow);

    expect(document.createEvent).not.toHaveBeenCalled();
  });

  it('should load downloadAssignmentPdf method and download the file successfully and call msSaveBlob', () => {
    const response = {
      body: {},
      headers: {
        get: () => '',
      },
    };
    navigator.msSaveBlob = (): boolean => true;
    spyOn(navigator, 'msSaveBlob').and.returnValue(true);
    spyOn(candidateService, 'downloadFile').and.returnValue(of(response));

    const dummyWindow = Object.assign({}) as Window;
    component.downloadAssignmentPdf(dummyWindow);

    expect(navigator.msSaveBlob).toHaveBeenCalled();
  });

  it('should load static arrayBufferToBase64 method and converto to base 64', () => {
    const base64 = CandidateService.arrayBufferToBase64([2]);

    expect(base64).toBeDefined();
  });
});
