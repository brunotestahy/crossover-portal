import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DfModalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { Assignment } from 'app/core/models/assignment';
import { HireService } from 'app/core/services/hire/hire.service';
import { EndContractComponent } from 'app/shared/components/end-contract/end-contract.component';

describe('EndContractComponent', () => {
  let component: EndContractComponent;
  let fixture: ComponentFixture<typeof component>;
  let modalService: DfModalService;
  let hireService: HireService;
  let formBuilder: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndContractComponent,
      ],
      providers: [
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        FormBuilder,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-17T03:24:00'));
    fixture = TestBed.createComponent(EndContractComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.get(FormBuilder);
    hireService = TestBed.get(HireService);
    modalService = TestBed.get(DfModalService);
  });

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should build form sucessfully', () => {
    spyOn(component, 'buildScores').and.callThrough();
    spyOn(formBuilder, 'group').and.callThrough();
    fixture.detectChanges();
    expect(formBuilder.group).toHaveBeenCalled();
    expect(component.buildScores).toHaveBeenCalled();
  });

  it('should open confirmation modal successfully', () => {
    spyOn(modalService, 'open');
    component.openConfirmationModal();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should end contract successfully', () => {
    spyOn(hireService, 'endContract').and.returnValue(of({}));
    spyOn(component, 'onClose').and.callThrough();
    component.assignment = { id: 1 } as Assignment;
    fixture.detectChanges();
    component.formGroup.setValue(
      {
        effectiveDate: 'test',
        reason: 'test',
        additionalComments: 'test',
        contractorScore: 10,
      }
    );
    const close = function(): void { };
    component.endContract(close);
    expect(hireService.endContract).toHaveBeenCalled();
    expect(component.onClose).toHaveBeenCalled();
    expect(component.error).toBe(null);
    expect(component.isLoading).toBe(false);
  });

  it('should get server while end contract', () => {
    spyOn(hireService, 'endContract').and.returnValue(Observable.throw({ error: 'error' }));
    component.assignment = { id: 1 } as Assignment;
    fixture.detectChanges();
    component.formGroup.setValue(
      {
        effectiveDate: 'test',
        reason: 'test',
        additionalComments: 'test',
        contractorScore: 10,
      }
    );
    const close = function(): void { };
    component.endContract(close);
    expect(hireService.endContract).toHaveBeenCalled();
    expect(component.error).toBe('Error terminating contractor.');
    expect(component.isLoading).toBe(false);
  });
});
