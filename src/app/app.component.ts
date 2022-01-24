import { animate, animateChild, query, state, style, transition, trigger, group } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { getBG } from './bgs';
import { GameService } from './game.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({
          opacity: 0,
          zIndex: 9,
          position: 'relative'
        }),
        animate('0.25s ease', style({
          opacity: 1,
          zIndex: 9
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          zIndex: 9,
          position: 'relative'
        }),
        animate('0.25s ease', style({
          opacity: 0,
          zIndex: 9
        }))
      ])
    ]),
    trigger('menuRouteAnimation', [
      transition('Main <=> *', [
        /* style({position: 'relative', zIndex: 9}),
        group([
          query(':enter', [
            style({
              opacity: 0
            }),
            animate('0.25s ease-out', style({
              opacity: 1
            }))
          ]),
          query(':leave', [
            style({
              opacity: 1
            }),
            animate('0.25s ease-in', style({
              opacity: 0
            }))
          ])
        ]) */
        /* query(':enter', [
          style({
            transform: 'translateY(100px)',
            zIndex: 9,
            position: 'relative'
          }),
          animate('0.25s ease', style({
            transform: 'none',
            zIndex: 9,
            position: 'relative'
          }))
        ], {optional: true}),
        query(':enter', animateChild(), {optional: true}),
        query(':leave', animateChild(), {optional: true}),
        query(':leave', [
          style({
            transform: 'none',
            zIndex: 9,
            position: 'relative'
          }),
          animate('0.25s ease', style({
            transform: 'translateY(100px)',
            zIndex: 9,
            position: 'relative'
          }))
        ], {optional: true}), */
      ])
    ])
  ]
})
export class AppComponent {
  isMenuShown = true;
  isGameOver = false;
  lcc: string = "";
  score = 0;

  // Settings vars
  theme = 'light';
  showControls = false;

  constructor(
    private gameService: GameService,
    @Inject(DOCUMENT) private document: Document,
    private settingsService: SettingsService,
    private router: Router
  ) {
    // Main menu BehaviorSubject
    this.gameService.isMenuShown.subscribe(val => this.isMenuShown = val);
    // When game object is created, bind score and lastCreatedTile to game's values
    this.gameService.isReady.subscribe(val => {
      if (val) {
        this.gameService.getScore().subscribe(val => this.score = val);
        this.gameService.getLastCreatedCell().subscribe(val => this.lcc = val);
      }
    });
    // Background BehaviorSubject
    this.settingsService.bgObserver.subscribe(bg => {
      let bgObj = getBG(bg);
      let bgImageString = "";
      if (bgObj) bgImageString = `url(${getBG(bg)!.image})`;
      this.document.body.style.backgroundImage = bgImageString;
    });
    // Theme BehaviorSubject
    this.settingsService.themeObserver.subscribe(theme => {
      this.theme = theme;
      let bgColorString = "";
      if (theme === 'light') bgColorString = 'white';
      else if (theme === 'dark') bgColorString = '#111';
      this.document.body.style.backgroundColor = bgColorString;
    });
    // Show Controls BehaviorSubject
    this.settingsService.showControlsObserver.subscribe(showControls => this.showControls = showControls);

    this.document.addEventListener("keydown", e => {
      if (e.code === "Escape") {
        this.gameService.isMenuShown.next(!this.isMenuShown);
        router.navigate(['']);
      };
      if (e.code === "F1") this.gameService.game!.isGameOver.next(true);
    })
  }

  prepareRoute(outlet?: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  showMenu() {
    this.gameService.isMenuShown.next(true);
  }

  resetGame() {
    this.gameService.reset();
  }
}
