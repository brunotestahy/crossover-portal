import { async, TestBed } from '@angular/core/testing';
import * as FileSaver from 'file-saver';

import { DownloadService } from 'app/core/services/download/download.service';

describe('DownloadService', () => {
  let service: DownloadService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [DownloadService],
    });
  }));

  beforeEach(() => {
    service = TestBed.get(DownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should download file', () => {
    spyOn(FileSaver, 'saveAs');
    const fileName = `download.csv`;
    const blob = new Blob([{}], { type: 'text/csv' });
    service.download(blob, fileName);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(blob, fileName);
  });

});
