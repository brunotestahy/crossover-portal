import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
    CampaignSourcingIndexComponent,
} from 'app/modules/campaign-sourcing/pages/campaign-sourcing-index/campaign-sourcing-index.component';

describe('CampaignSourcingIndexComponent', () => {
    let component: CampaignSourcingIndexComponent;
    let fixture: ComponentFixture<CampaignSourcingIndexComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [CampaignSourcingIndexComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CampaignSourcingIndexComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

});
