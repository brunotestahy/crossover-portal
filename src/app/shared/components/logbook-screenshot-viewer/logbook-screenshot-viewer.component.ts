import { Component, OnInit } from '@angular/core';
import { DfActiveModal } from '@devfactory/ngx-df';

import { WorkDiaryImage, WorkDiaryWithFlags } from 'app/core/models/logbook';

export interface LogbookScreenshotViewerData {
  currentIndex: number;
  workDiaries: WorkDiaryWithFlags[];
  hourFormat: string;
}

@Component({
  selector: 'app-logbook-screenshot-viewer',
  templateUrl: './logbook-screenshot-viewer.component.html',
  styleUrls: ['./logbook-screenshot-viewer.component.scss'],
})
export class LogbookScreenshotViewerComponent implements OnInit {

  public currentImage: WorkDiaryImage;
  public images: WorkDiaryImage[];
  public workDiaries: WorkDiaryWithFlags[];
  public currentIndex: number;
  public currentDiary: WorkDiaryWithFlags;
  public previousEnabled: boolean;
  public nextEnabled: boolean;
  public hourFormat: string;
  public isScreenshotMissing = false;

  constructor(private activeModal: DfActiveModal) { }

  public ngOnInit(): void {
    const data: LogbookScreenshotViewerData = this.activeModal.data;
    this.workDiaries = data.workDiaries;
    this.currentIndex = data.currentIndex;
    this.hourFormat = data.hourFormat;
    this.update();
  }

  public previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.update();
    }
  }

  public next(): void {
    if (this.currentIndex < this.workDiaries.length - 1) {
      this.currentIndex += 1;
      this.update();
    }
  }

  public changeImage(img: WorkDiaryImage): void {
    this.currentImage = img;
  }

  public onThumbnailLoadError(): void {
    this.isScreenshotMissing = true;
  }

  public getIntensityScore(diary: WorkDiaryWithFlags): string {
    return (diary.isMeeting ? '100' : diary.intensityScore) + '%';
  }

  private update(): void {
    this.currentDiary = this.workDiaries[this.currentIndex];
    this.images = this.currentDiary.images.filter(img => img.type === 'SCREENSHOT');
    this.currentImage = this.currentDiary.screenshot;
    this.updateButtons();
  }

  private updateButtons(): void {
    this.updateNextButton();
    this.updatePreviousButton();
  }

  private updateNextButton(): void {
    if (this.currentIndex < this.workDiaries.length - 1) {
      this.nextEnabled = true;
    } else {
      this.nextEnabled = false;
    }
  }

  private updatePreviousButton(): void {
    if (this.currentIndex > 0) {
      this.previousEnabled = true;
    } else {
      this.previousEnabled = false;
    }
  }
}
