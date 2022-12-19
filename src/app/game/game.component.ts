import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, doc, getFirestore, onSnapshot, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { setDoc } from '@firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from '@firebase/util';
import { databaseInstance$ } from '@angular/fire/database';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  game: Game;
  games$: Observable<any>;
  games:[];
  gameCollection;
  db = getFirestore();
  dbRef = collection(this.db, 'games');
  gameId;
  docRef;
  

  constructor(private firestore: Firestore, public dialog: MatDialog, private route: ActivatedRoute, private router: Router) { 
    this.gameCollection = collection(firestore, 'games');
    this.games$ = collectionData(this.gameCollection);
  }
  

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(async (params): Promise<void> => {
      this.gameId = params['id'];
      this.docRef =  doc(this.db, 'games', this.gameId);
      let docSnap = await getDoc(this.docRef);
      console.log('data',docSnap.data());
      let data:any = docSnap.data();
      this.games$.subscribe(() => {
        this.game.currentPlayer = data.currentPlayer;
        this.game.playedCards = data.playedCards;
        this.game.players = data.players;
        this.game.stack = data.stack;
        this.game.pickCardAnimation = data.pickCardAnimation;
        this.game.currentCard = data.currentCard;
      })
    })
  }


  newGame() {
   this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      console.log('after Timeout',this.game.currentCard)
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    }
    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
      console.log('after Timeout',this.game)
    }, 1000);
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    updateDoc(this.docRef, this.game.toJson())

  }

}
