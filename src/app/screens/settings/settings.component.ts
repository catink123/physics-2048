import { Component, OnInit } from '@angular/core';
import { BackgroundImage, bgs } from '../../bgs';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  _theme = 'light';
  _currentBG = '';
  _showControls = false;

  constructor(private settings: SettingsService) {
    this._theme = settings.theme;
    this._currentBG = settings.bg;
    this._showControls = settings.showControls;
  }

  ngOnInit(): void {
  }

  set theme(newValue: string) { this._theme = newValue; this.settings.theme = newValue; }
  get theme(): string { return this._theme; }

  set currentBG(newValue: string) { this._currentBG = newValue; this.settings.bg = newValue; }
  get currentBG(): string { return this._currentBG; }

  get bgs(): BackgroundImage[] {
    return bgs;
  }

  set showControls(newValue: boolean) { this._showControls = newValue; this.settings.showControls = newValue; }
  get showControls(): boolean { return this._showControls; }
}
