import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { HighscoresService } from '../highscores.service';
import { SettingsService } from '../settings.service';
import { Direction } from '../lib/Game';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('0.15s ease', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate('0.15s ease', style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class FieldComponent implements AfterViewInit {
  @ViewChild('fieldContainer') fieldContainer?: ElementRef;
  isGameOver = false;
  isScoreButtonDisabled = false;
  theme = 'light';

  constructor(private gameService: GameService, private highscores: HighscoresService, private settings: SettingsService) {
    this.highscores.getAuthState().subscribe(user => {
      if (!user) this.isScoreButtonDisabled = true;
      else this.isScoreButtonDisabled = false;
    });
    this.settings.themeObserver.subscribe(theme => this.theme = theme);
  }

  ngAfterViewInit(): void {
    this.gameService.createGameInstance(this.fieldContainer!.nativeElement);
    this.gameService.getGameOver().subscribe(val => {this.isGameOver = val; this.isScoreButtonDisabled = false});
    this.gameService.game!.field._element.addEventListener("swipe", (e: any) => {
      let dirs = e.detail.directions;
      let direction: Direction;
      if (dirs.top) direction = Direction.Up;
      if (dirs.bottom) direction = Direction.Down;
      if (dirs.left) direction = Direction.Left;
      if (dirs.right) direction = Direction.Right;
    })
  }

  sendScore() {
    this.highscores.sendScore().then((_: any) => this.isScoreButtonDisabled = true);
  }

  onSwipe(e: any) {
    const threshold = 40;
    let direction: Direction;
    if (Math.abs(e.deltaX) > threshold) 
      if (e.deltaX > 0) direction = Direction.Right;
      else direction = Direction.Left;
    if (Math.abs(e.deltaY) > threshold) 
      if (e.deltaY > 0) direction = Direction.Down;
      else direction = Direction.Up;
    this.gameService.game?.move(direction!);
  }
}
