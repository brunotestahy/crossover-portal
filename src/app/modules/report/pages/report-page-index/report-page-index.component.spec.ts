import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
    ReportPageIndexComponent,
} from 'app/modules/report/pages/report-page-index/report-page-index.component';

describe('ReportPageIndexComponent', () => {
    let component: ReportPageIndexComponent;
    let fixture: ComponentFixture<ReportPageIndexComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ReportPageIndexComponent],
            imports: [],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportPageIndexComponent);
        component = fixture.componentInstance;
    });

    it('check if the component has been created', () => {
        expect(component).toBeTruthy();
    });
});
