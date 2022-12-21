import { Component, OnInit } from '@angular/core';
import { collection, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from '@firebase/database';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit{
  gameCollection;
  game: Game;


  constructor(private router: Router, private firestore:Firestore) {
    this.gameCollection = collection(firestore, 'games');
  }

  ngOnInit(): void {

  }

/**
 * A new Game is created, the data is send as a json to database and the user is navigated to a specific game with unique id
 */
  async newGame() {
    this.game = new Game;
    let docRef = doc(this.gameCollection);
    setDoc(docRef, this.game.toJson());
    let docSnap = await getDoc(docRef);
    let gameId = docSnap.id;
    this.router.navigateByUrl('/game/'+ gameId);
  }
}
