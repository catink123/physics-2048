import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Action, Game, GameOptions } from './lib/Game';

export const gameSettings = {
  keybinds: {
    "ArrowUp": Action.MoveUp,
    "ArrowDown": Action.MoveDown,
    "ArrowLeft": Action.MoveLeft,
    "ArrowRight": Action.MoveRight
  }
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  game?: Game
  isMenuShown = new BehaviorSubject(true);
  isReady = new BehaviorSubject(false);
  constructor() { }
  createGameInstance(fieldContainer: HTMLElement) {
    this.game = new Game(fieldContainer, gameSettings);
    this.isReady.next(true);
  }

  getGameOver(): BehaviorSubject<boolean> {
    return this.game!.isGameOver;
  }

  getScore(): BehaviorSubject<number> {
    return this.game!.score;
  }

  getLastCreatedCell(): BehaviorSubject<string> {
    return this.game!.field.lastCreatedCell;
  }

  reset() {
    this.game?.score.next(0);
    this.game?.isGameOver.next(false);
    this.game?.field.reset();
  }
}
