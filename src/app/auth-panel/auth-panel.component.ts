import { Component } from '@angular/core';
import { HighscoresService } from '../highscores.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-auth-panel',
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.scss']
})
export class AuthPanelComponent {
  imageURL?: string
  name?: string
  isLoggedIn: boolean = false;

  // Theming
  theme = 'light';

  constructor(private highscores: HighscoresService, private settings: SettingsService) {
    highscores.getAuthState().subscribe(val => {
      if (val) {
        this.isLoggedIn = true;
        this.imageURL = val.photoURL!;
        this.name = val.displayName!;
      }
      else this.isLoggedIn = false;
    });
    settings.themeObserver.subscribe(theme => this.theme = theme);
  }

  login() {
    this.highscores.login();
  }

  logout() {
    this.highscores.logout();
  }
}
