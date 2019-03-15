import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable()
export class DownloadService {

  public download(data: Blob, fileName?: string): void {
    FileSaver.saveAs(data, fileName);
  }
}
