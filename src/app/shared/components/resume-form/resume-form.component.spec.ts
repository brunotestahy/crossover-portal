import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { take } from 'rxjs/operators';

import { environment } from 'app/../environments/environment';
import { HireService } from 'app/core/services/hire/hire.service';
import { GET_APPLICATION_RESPONSE } from 'app/core/services/mocks/hire.mock';
import { ResumeFormComponent } from 'app/shared/components/resume-form/resume-form.component';

describe('ResumeFormComponent', () => {
  let component: ResumeFormComponent;
  let fixture: ComponentFixture<typeof component>;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        ResumeFormComponent,
      ],
      imports: [
        LayoutModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        HireService,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ResumeFormComponent);
      component = fixture.componentInstance;
      httpMock = TestBed.get(HttpTestingController);
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should prevent resume file change when an invalid file is selected', () => {
    const fileSelectionEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      target: { files: Object.assign([{ name: 'invalid.asd' }]) as FileList },
    };
    const applicationId = 1;
    const fileId = 2;

    component.onFileChange(applicationId, fileId, fileSelectionEvent);

    expect(fileSelectionEvent.preventDefault).toHaveBeenCalled();
    expect(fileSelectionEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should allow resume file change successfully', () => {
    const file = { name: 'valid.doc' };
    const fileSelectionEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      target: { files: Object.assign([ file ]) as FileList },
    };
    const application = {...GET_APPLICATION_RESPONSE, fileUrl: 'http://my/file/url'};

    component.applications = [application];
    component.onFileChange(application.id, application.resumeFile.id, fileSelectionEvent);

    expect(fileSelectionEvent.preventDefault).not.toHaveBeenCalled();
    expect(fileSelectionEvent.stopPropagation).not.toHaveBeenCalled();
    expect(Object.keys(component.uploadFields)).toContain(application.id.toString());
    expect(application.resumeFile.name).toBe(file.name);
  });

  it('should download a file successfully', () => {
    const targetUrl = 'http://my/target/url.pdf';
    spyOn(window, 'open');

    component.onDownload(targetUrl);
    expect(window.open).toHaveBeenCalledWith(targetUrl, '_blank');
  });

  it('should manage errors when a resume upload fails', async(() => {
    const file = { name: 'valid.doc' };
    const fileSelectionEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      target: { files: Object.assign([ file ]) as FileList },
    };
    const application = Object.assign({}, GET_APPLICATION_RESPONSE, { fileUrl: null });

    component.applications = [application];
    component.onFileChange(application.id, application.resumeFile.id, fileSelectionEvent);
    component.onSubmit();

    const httpRequest = httpMock.expectOne(
      environment.apiPath
      + `/hire/applications/${application.id}/files/${application.resumeFile.id}`
    );
    expect(httpRequest.request.method).toBe('POST');
    httpRequest.flush({}, { status: 400, statusText: 'Some server error' });
    httpMock.verify();

    expect(application.fileUrl).toBeNull();
  }));

  it('should upload a resume successfully', async(() => {
    const file = { name: 'valid.doc' };
    const fileSelectionEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      target: { files: Object.assign([file]) as FileList },
    };
    const signedUrl = 'http://my/file/url.doc';
    const application = {...GET_APPLICATION_RESPONSE };

    component.applications = [application];
    component.onFileChange(application.id, application.resumeFile.id, fileSelectionEvent);
    component.onSubmit();

    const httpRequest = httpMock.expectOne(
      environment.apiPath
      + `/hire/applications/${application.id}/files/${application.resumeFile.id}`
    );
    expect(httpRequest.request.method).toBe('POST');
    httpRequest.flush({ id: application.resumeFile.id, signedUrl });
    httpMock.verify();

    expect(application.fileUrl).toBe(signedUrl);
  }));

  it('should cancel form display successfully', async(() => {
    component.cancel
      .pipe(take(1))
      .subscribe(data => expect(data).toBe(true));
    component.onCancel();
  }));
});
