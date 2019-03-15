import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { DocumentsServiceMock } from '../../../../core/services/documents/documents.service.mock';

import { ResourcesPageComponent } from './resources-page.component';

class IdentityServiceMock implements Partial<IdentityService> {

  public currentUserIsManager(): Observable<boolean> {
    return of(true);
  }
}

describe('ResourcesPageComponent', () => {
  let component: ResourcesPageComponent;
  let fixture: ComponentFixture<ResourcesPageComponent>;
  let documentsService: DocumentsService;
  let identityService: IdentityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ],
        declarations: [ ResourcesPageComponent ],
        providers: [
            { provide: DocumentsService, useClass: DocumentsServiceMock },
            { provide: IdentityService, useClass: IdentityServiceMock },
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    documentsService = getTestBed().get(DocumentsService);
    identityService = getTestBed().get(IdentityService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the document on ngOnInit', () => {
    spyOn(documentsService, 'getBestPracticesDocument');

    component.ngOnInit();

    expect(documentsService.getBestPracticesDocument).toHaveBeenCalled();
    expect(component.markdown$).toBe(documentsService.getBestPracticesDocument());
  });

  it('should call the service to calculate the isManager flag on ngOnInit', () => {
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(true));

    component.ngOnInit();

    expect(identityService.currentUserIsManager).toHaveBeenCalled();
    expect(component.isManager).toBe(true);
  });

});
