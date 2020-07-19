import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { forkJoin, Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploadDownloadService {
  private ref = this.storage.ref('uploads/');
  private percentageCompletedSubject = new BehaviorSubject<any[]>([]);
  percentageCompleted$ = this.percentageCompletedSubject.asObservable();

  constructor(private storage: AngularFireStorage) {}

  uploadFiles(
    filesToUpload: File[]
  ): Observable<firebase.storage.UploadTaskSnapshot[]> {
    const fileUploadRefs: Observable<
      firebase.storage.UploadTaskSnapshot
    >[] = [];
    filesToUpload.forEach((file, index) => {
      const fileRef = this.ref
        .child(file.name)
        .put(file)
        .snapshotChanges()
        .pipe(
          tap((snapshot: any) => {
            const bytesTransferred =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const percentageCompleted = this.percentageCompletedSubject.value;
            percentageCompleted[index] = bytesTransferred;
            this.percentageCompletedSubject.next(percentageCompleted);
          })
        );
      fileUploadRefs.push(fileRef);
    });

    return forkJoin(fileUploadRefs);
  }

  resizePercentagesArray(newLength: number): void {
    const percentageCompletedStart = Array(newLength).fill(0);
    this.percentageCompletedSubject.next(percentageCompletedStart);
  }

  downloadFiles(): Observable<firebase.storage.ListResult> {
    return this.ref.listAll();
  }
}
