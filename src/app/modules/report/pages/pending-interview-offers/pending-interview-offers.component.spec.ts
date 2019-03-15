import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { DownloadService } from 'app/core/services/download/download.service';
import { UPCOMING_INTERVIEW } from 'app/core/services/mocks/upcoming-interviews.mock';
import { ReportService } from 'app/core/services/report/report.service';
import {
    PendingInterviewOffersComponent,
} from 'app/modules/report/pages/pending-interview-offers/pending-interview-offers.component';

describe('PendingInterviewOffersComponent', () => {
    let component: PendingInterviewOffersComponent;
    let fixture: ComponentFixture<PendingInterviewOffersComponent>;
    let reportService: ReportService;
    let breakpointObserver: BreakpointObserver;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [PendingInterviewOffersComponent],
            imports: [],
            providers: [
                { provide: ReportService, useFactory: () => mock(ReportService) },
                { provide: DownloadService, useFactory: () => mock(DownloadService) },
                { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PendingInterviewOffersComponent);
        component = fixture.componentInstance;
        reportService = TestBed.get(ReportService);
        breakpointObserver = TestBed.get(BreakpointObserver);
        spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: true }]));
    });

    it('check if the component has been created', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit', () => {
        spyOn(component, 'loadData');
        component.ngOnInit();
        expect(component.loadData).toHaveBeenCalled();
    });

    it('onPageChange - it should change page', () => {
        spyOn(component, 'loadData');
        const pageNo = 1;
        component.onPageChange(pageNo);
        expect(component.currentPage).toBe(1);
        expect(component.loadData).toHaveBeenCalled();
    });

    it('loadData - it should return success response', () => {
        spyOn(reportService, 'getInterviewReport').and.returnValue(Observable.of(UPCOMING_INTERVIEW));
        component.loadData();
        expect(reportService.getInterviewReport).toHaveBeenCalled();
    });

    it('loadData - it should return error response with error text', () => {
        spyOn(reportService, 'getInterviewReport').and.returnValue(Observable.throw({
            error: {
                errorCode: 400,
                type: 'type',
                httpStatus: 400,
                text: 'error',
            },
        }));
        component.loadData();
        expect(reportService.getInterviewReport).toHaveBeenCalled();
        expect(component.error).toBe('error');
    });

    it('loadData - it should return error response without error text', () => {
        spyOn(reportService, 'getInterviewReport').and.returnValue(Observable.throw({
            error: 'text',
        }));
        component.loadData();
        expect(reportService.getInterviewReport).toHaveBeenCalled();
        expect(component.error).toBe('Error fetching pending interview offers.');
    });

    it('downloadCsv - it should download csv', () => {
        spyOn(reportService, 'getInterviewReportFile').and.returnValue(Observable.of('test'));
        component.downloadCsv();
        expect(reportService.getInterviewReportFile).toHaveBeenCalled();
    });
});
