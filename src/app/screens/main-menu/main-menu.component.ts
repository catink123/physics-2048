import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/game.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  hideMenu() {
    this.gameService.isMenuShown.next(false);
  }
}
