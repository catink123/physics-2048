import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface saveData {
  theme?: 'light' | 'dark';
  bg?: string;
  showControls?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _theme = new BehaviorSubject("light");
  private _bg = new BehaviorSubject("");
  private _showControls = new BehaviorSubject(false);
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.loadSavedData();
  }

  loadSavedData() {
    let data = window.localStorage.getItem('physics-n2048');
    if (data) {
      let parsedData: saveData = JSON.parse(data);
      const {theme, bg, showControls} = parsedData;
      this._theme.next(theme ?? 'light');
      this._bg.next(bg ?? '');
      this._showControls.next(showControls ?? false);
    }
  }

  saveValue(key: keyof saveData, value: any) {
    let data = window.localStorage.getItem('physics-n2048');
    if (data) {
      var parsedData: saveData = JSON.parse(data);
    } else {
      var parsedData: saveData = {};
    }
    parsedData[key] = value;
    window.localStorage.setItem('physics-n2048', JSON.stringify(parsedData));
  }

  set theme(newValue: string) { 
    this._theme.next(newValue); 
    this.document.body.style.setProperty('--theme', newValue);
    this.saveValue('theme', newValue); 
  }
  get theme(): string{return this._theme.value};
  get themeObserver(): BehaviorSubject<string>  {return this._theme};

  set bg(newValue: string) { this._bg.next(newValue); this.saveValue('bg', newValue); }
  get bg(): string{return this._bg.value};
  get bgObserver(): BehaviorSubject<string> {return this._bg};

  set showControls(newValue: boolean) { this._showControls.next(newValue); this.saveValue('showControls', newValue); }
  get showControls(): boolean {return this._showControls.value};
  get showControlsObserver(): BehaviorSubject<boolean> {return this._showControls};
}
