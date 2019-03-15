import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import { WorkDiaryImage, WorkDiaryWithFlags } from 'app/core/models/logbook';
import { LogbookScreenshotViewerComponent } from 'app/shared/components/logbook-screenshot-viewer/logbook-screenshot-viewer.component';

describe('LogbookScreenshotViewerComponent', () => {
  let component: LogbookScreenshotViewerComponent;
  let fixture: ComponentFixture<LogbookScreenshotViewerComponent>;
  let activeModal: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogbookScreenshotViewerComponent,
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbookScreenshotViewerComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(DfActiveModal);
    activeModal.data = {
      currentIndex: 0,
      workDiaries: [
        {
          type: 'type1',
          images: [
            {
              type: 'SCREENSHOT',
              createdAt: '2018-01-01',
            } as WorkDiaryImage,
          ],
          screenshot: {
            type: 'SCREENSHOT',
            createdAt: '2018-01-01',
          } as WorkDiaryImage,
        } as WorkDiaryWithFlags,
        {
          type: 'type2',
          images: [
            {
              type: 'SCREENSHOT',
              createdAt: '2018-01-01',
            } as WorkDiaryImage,
          ],
          screenshot: {
            type: 'SCREENSHOT',
            createdAt: '2018-01-01',
          } as WorkDiaryImage,
        } as WorkDiaryWithFlags,
      ],
      hourFormat: 'someFormat',
    };
  });

  it('[ngOnInit] should update first timecard buttons', () => {
    fixture.detectChanges();
    expect(component.nextEnabled).toBe(true);
    expect(component.previousEnabled).toBe(false);
  });

  it('[ngOnInit] should update second timecard buttons', () => {
    activeModal.data.currentIndex = 1;
    fixture.detectChanges();
    expect(component.nextEnabled).toBe(false);
    expect(component.previousEnabled).toBe(true);
  });

  it('[previous] should switch to previous timecard', () => {
    fixture.detectChanges();
    activeModal.data.currentIndex = 0;
    component.previous();
    component.currentIndex = 1;
    component.previous();
    expect(component.nextEnabled).toBe(true);
    expect(component.previousEnabled).toBe(false);
  });

  it('[next] should switch to next timecard', () => {
    activeModal.data.currentIndex = 1;
    fixture.detectChanges();
    component.next();
    component.currentIndex = 0;
    component.next();
    expect(component.nextEnabled).toBe(false);
    expect(component.previousEnabled).toBe(true);
  });

  it('[changeImage] should changeImage', () => {
    component.changeImage(activeModal.data.workDiaries[0].images[0]);
    expect(component.currentImage).toEqual(activeModal.data.workDiaries[0].images[0]);
  });

  it('[onThumbnailLoadError] should show empty image', () => {
    component.onThumbnailLoadError();
    expect(component.isScreenshotMissing).toBe(true);
  });

  it('[getIntensityScore] should return 100% when a meeting card is displayed', () => {
    const diary = {} as WorkDiaryWithFlags;
    diary.isMeeting = true;
    expect(component.getIntensityScore(diary)).toBe('100%');
  });

  it('[getIntensityScore] should return the intensity score when a normal card is displayed', () => {
    const diary = {} as WorkDiaryWithFlags;
    diary.isMeeting = false;
    diary.intensityScore = 60;
    expect(component.getIntensityScore(diary)).toBe('60%');
  });
});
