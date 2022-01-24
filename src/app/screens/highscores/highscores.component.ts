import { Component, OnInit } from '@angular/core';
import { Entry, HighscoresService } from '../../highscores.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss']
})
export class HighscoresComponent {
  data?: Entry[];
  constructor(private highscores: HighscoresService) {
    highscores.getHighscores().subscribe(val => this.data = val as Entry[]);
  }
}
