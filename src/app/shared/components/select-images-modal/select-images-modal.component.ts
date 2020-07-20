import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { FileUploadDownloadService } from '../../../core/services/file-upload-download.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-images-modal',
  templateUrl: './select-images-modal.component.html',
  styleUrls: ['./select-images-modal.component.css'],
})
export class SelectImagesModalComponent implements OnInit, OnDestroy {
  @Output() closeModal = new EventEmitter<void>();
  imageUploadForm: FormGroup;
  percentageTransferredForFiles = [];
  filesToUpload: File[] = [];
  filesToUploadPath: string[] = [];
  fileRenameInProgress: boolean[] = [];
  filesUploaded = false;
  uploadInProgress = false;
  fileServiceSubscription: Subscription = new Subscription();

  constructor(
    private fileUploadDownloadService: FileUploadDownloadService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createImageUploadForm();
    this.fileServiceSubscription = this.fileUploadDownloadService.percentageCompleted$.subscribe(
      (percentageArray) => {
        this.percentageTransferredForFiles = percentageArray;
      }
    );
  }

  createImageUploadForm(): void {
    this.imageUploadForm = this.fb.group({
      imageToUpload: [null, [Validators.required]],
      fileType: [
        null,
        [Validators.required, this.imageFileValidator.bind(this)],
      ],
    });
  }

  imageFileValidator(control: AbstractControl): { [key: string]: any } {
    const imageFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const imageTypeFound = imageFileTypes.find(
      (type) => type === control.value
    );
    return imageTypeFound === undefined
      ? { invalidFileType: { value: control.value } }
      : null;
  }

  handleFileInput(event: Event): any {
    const fileTarget = event.target as any;
    if (fileTarget.files && fileTarget.files[0]) {
      const file = fileTarget.files[0];
      this.imageUploadForm.get('fileType').patchValue(file.type);
      this.imageUploadForm.get('fileType').markAsDirty();
      this.imageUploadForm.get('fileType').updateValueAndValidity();
      if (this.imageUploadForm.invalid) {
        return;
      }
      const newFile = this.createFile(file);
      this.saveFileWithData(newFile);
      this.createPreviewFromFile(file);
      this.filesUploaded = false;
    }
  }

  createFile(file: File): File {
    return new File([file], file.name, { type: file.type });
  }

  saveFileWithData(file: File): void {
    this.filesToUpload.push(file);
    this.fileRenameInProgress.push(false);
  }

  createPreviewFromFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.filesToUploadPath.push(reader.result.toString());
    };
    reader.readAsDataURL(file);
    this.fileUploadDownloadService.resizePercentagesArray(
      this.filesToUpload.length
    );
  }

  renameSelectedImage(event: Event, index: number, newName: string): void {
    const file = this.filesToUpload[index];
    const newFile = new File([file], newName, { type: file.type });
    this.filesToUpload[index] = newFile;
    this.fileRenameInProgress[index] = false;
    event.stopPropagation();
  }

  deleteSelectedImage(event: Event, index: number): void {
    const files = this.filesToUpload;
    const newFilesToUpload = files.filter((_, i) => i !== index);
    this.filesToUpload = newFilesToUpload;
    event.stopPropagation();
  }

  uploadFiles(): void {
    this.uploadInProgress = true;
    this.fileUploadDownloadService
      .uploadFiles(this.filesToUpload)
      .subscribe(() => {
        this.filesUploaded = true;
        this.uploadInProgress = false;
      });
  }

  onRenameFile(index: number, newName: string): void {
    if (newName.length > 0) {
      this.fileRenameInProgress[index] = true;
    } else {
      this.fileRenameInProgress[index] = false;
    }
  }

  onCancelButtonClicked(): void {
    this.closeModal.emit();
  }

  ngOnDestroy(): void {
    if (this.fileServiceSubscription != null) {
      this.fileServiceSubscription.unsubscribe();
    }
  }
}
