import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainMenuComponent } from './screens/main-menu/main-menu.component';
import { FieldComponent } from './field/field.component';
import { ScreenComponent } from './screen/screen.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { SettingsComponent } from './screens/settings/settings.component';
import { RulesComponent } from './screens/rules/rules.component';
import { HighscoresComponent } from './screens/highscores/highscores.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AuthPanelComponent } from './auth-panel/auth-panel.component';
import { GameControlsComponent } from './game-controls/game-controls.component';
import { ThemedDirective } from './themed.directive';
import { FormsModule } from '@angular/forms';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  overrides: { [key: string]: Object; } = {
    swipe: {
      direction: Hammer.DIRECTION_ALL
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    FieldComponent,
    ScreenComponent,
    SettingsComponent,
    RulesComponent,
    HighscoresComponent,
    AuthPanelComponent,
    GameControlsComponent,
    ThemedDirective
  ],
  imports: [
    BrowserModule, 
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    providePerformance(() => getPerformance()),
    AngularFireDatabaseModule,
    FormsModule,
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
