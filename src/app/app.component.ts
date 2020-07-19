import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileUploadDownloadService } from './core/services/file-upload-download.service';
import { Subscription } from 'rxjs';
import { ImageMetaData } from './shared/models/image-meta-data.model';
import { bytesToSize } from './shared/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isUploading = false;
  title = 'image-upload-download';
  imageUrls: string[] = [];
  imageMetaData: ImageMetaData[] = [];
  fileServiceSubscription: Subscription = new Subscription();

  constructor(private fileUploadDownloadService: FileUploadDownloadService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.imageUrls = [];
    this.imageMetaData = [];
    this.fileServiceSubscription = this.fileUploadDownloadService
      .downloadFiles()
      .subscribe((files) => {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.items.length; i++) {
          files.items[i]
            .getMetadata()
            .then((meta: ImageMetaData) => {
              this.imageMetaData.push(meta);
            })
            .then(() => {
              files.items[i].getDownloadURL().then((url: string) => {
                this.imageUrls.push(url);
              });
            });
        }
      });
  }

  closeModal(): void {
    this.isUploading = false;
    this.loadImages();
  }

  onUploadImage(event): void {
    this.isUploading = true;
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    if (this.fileServiceSubscription != null) {
      this.fileServiceSubscription.unsubscribe();
    }
  }
}
