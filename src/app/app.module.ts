import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { SelectImagesModalComponent } from './shared/components/select-images-modal/select-images-modal.component';
import { NavigationComponent } from './core/navigation/navigation.component';
import { OutsideDirective } from './core/directives/outside.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { PrefixBytePipe } from './shared/pipes/prefix-byte.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SelectImagesModalComponent,
    NavigationComponent,
    OutsideDirective,
    PrefixBytePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
