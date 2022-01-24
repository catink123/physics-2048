import { Directive, ElementRef } from '@angular/core';
import { applyStyles } from './lib/Common';
import { SettingsService } from './settings.service';

@Directive({
  selector: '[appThemed]'
})
export class ThemedDirective {
  normalStyles: object = {};
  hoverStyles: object = {};
  activeStyles: object = {};
  constructor(private el: ElementRef, private settingsService: SettingsService) {
    const tagName = this.el.nativeElement.tagName.toLowerCase();
    this.settingsService.themeObserver.subscribe(theme => {
      if (tagName === "button" || tagName === "select") { // BUTTON and SELECT styling
        const commonStyles = {
          border: '1px solid',
          borderRadius: '5px',
          padding: '5px'
        };
        if (theme === 'dark') {
          this.normalStyles = {
            backgroundColor: '#333',
            color: 'white',
            borderColor: '#AAA',
            ...commonStyles
          };
          this.hoverStyles = {
            backgroundColor: '#444'
          };
          this.activeStyles = {
            backgroundColor: '#222'
          };
        }
        else if (theme === 'light') {
          this.normalStyles = {
            backgroundColor: '#CCC',
            color: 'black',
            borderColor: '#AAA',
            ...commonStyles
          };
          this.hoverStyles = {
            backgroundColor: '#DDD'
          };
          this.activeStyles = {
            backgroundColor: '#AAA'
          };
        }
      } else if (tagName === "div") { // DIV Styling
        if (theme === 'light') {
          this.normalStyles = {
            backgroundColor: 'white',
            color: 'black'
          };
        } else if (theme === 'dark') {
          this.normalStyles = {
            backgroundColor: '#111',
            color: 'white'
          }
        }
      } else if (tagName === "p") {
        if (theme === 'light') {
          this.normalStyles = {
            color: 'black'
          };
        } else if (theme === 'dark') {
          this.normalStyles = {
            color: 'white'
          }
        }
      }
      applyStyles(this.el.nativeElement, this.normalStyles);
    });

    // On Hover
    this.el.nativeElement.addEventListener("mouseenter", (_: any) => {
      applyStyles(this.el.nativeElement, this.hoverStyles);
    });
    this.el.nativeElement.addEventListener("mouseleave", (_: any) => {
      applyStyles(this.el.nativeElement, this.normalStyles);
    });

    // On Click/Touch
    const downListener = (_: any) => {
      applyStyles(this.el.nativeElement, this.activeStyles);
    };
    const upListener = (_: any) => {
      applyStyles(this.el.nativeElement, this.normalStyles);
    };
    this.el.nativeElement.addEventListener("mousedown", downListener);
    this.el.nativeElement.addEventListener("touchstart", downListener);
    this.el.nativeElement.addEventListener("mouseup", upListener);
    this.el.nativeElement.addEventListener("touchend", upListener);
  }
}
