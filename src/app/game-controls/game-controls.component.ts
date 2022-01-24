import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Direction } from '../lib/Game';

@Component({
  selector: 'app-game-controls',
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.scss']
})
export class GameControlsComponent {

  constructor(private game: GameService) { }

  move(direction: Direction) {
    this.game.game?.move(direction);
  }

}
