import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { tap } from 'rxjs/operators';
import { GoogleAuthProvider } from 'firebase/auth';
import { GameService } from './game.service';

export interface Entry {
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class HighscoresService {
  constructor(private db: AngularFireDatabase, public auth: AngularFireAuth, private gameService: GameService) { }

  getHighscores() {
    const compareFn = (a: Entry, b: Entry) => {
      if (a.score < b.score)
        return 1;
      if (a.score > b.score)
        return -1;
      return 0;
    };
    return this.db.list('highscores').valueChanges().pipe(
      tap(val => (val as Entry[]).sort(compareFn) as Entry[])
    )
  }

  login() {
    return this.auth.signInWithPopup(new GoogleAuthProvider());
  }

  logout() {
    this.auth.signOut();
  }

  getAuthState() {
    return this.auth.authState
  }

  sendScore() {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(user => {
        this.db
          .list('highscores')
          .set(user!.uid,
            {
              name: user!.displayName,
              score: this.gameService.getScore().value
            }
          )
          .then(_ => {resolve(null)});
      });
    })
  }
}
