import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, doc, getFirestore, onSnapshot, getDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { setDoc } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { async } from '@firebase/util';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation: boolean = false;
  currentCard: string = '';
  game: Game;
  games$: Observable<any>;
  games:[];
  gameCollection;
  db = getFirestore();
  dbRef = collection(this.db, 'games');

  constructor(private firestore: Firestore, public dialog: MatDialog, private route: ActivatedRoute) { 
    this.gameCollection = collection(firestore, 'games');
    this.games$ = collectionData(this.gameCollection);
  }
  

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params): void => {
      console.log('Die ID lautet', params['id']);
      let docRef = doc(this.gameCollection, 'games', params['id']);
      getDoc(docRef);

    })
   /*this.games$.subscribe( (newGames) => {
      console.log('Neues Spiel ist:', newGames);
      this.games = newGames;
    })*/
  }


  newGame() {
    this.game = new Game();
    /*let docRef = doc(this.gameCollection, 'games');
    setDoc(docRef, this.game.toJson())*/
    /*.catch(error => {
      console.log(error);
    })*/
    console.log(this.game)
    /*onSnapshot(this.dbRef, docsSnap => {
      docsSnap.forEach(doc => {
        console.log('Inhalte des Docs ist:',doc.data());
        console.log('Die Id des Docs ist:',doc.id);
      })
    })*/
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    }
    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name)
      }
    });
  }


}
