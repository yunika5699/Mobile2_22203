import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

var firebaseConfig = {
  apiKey: "AIzaSyCAOfZ6CuIFAn4EEKyVL1kqssGfZZOTj7U",
  authDomain: "mobile2-uas-5bf09.firebaseapp.com",
  databaseURL: "https://mobile2-uas-5bf09-default-rtdb.firebaseio.com",
  projectId: "mobile2-uas-5bf09",
  storageBucket: "mobile2-uas-5bf09.appspot.com",
  messagingSenderId: "802921355646",
  appId: "1:802921355646:web:039cb7f68cdb79e349bb2f",
  measurementId: "G-E7X0HWZ0RM"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
