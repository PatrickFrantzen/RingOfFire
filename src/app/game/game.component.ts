import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, doc, getFirestore, getDoc,updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  game: Game;
  games$: Observable<any>;
  gameCollection;
  db = getFirestore();
  gameId;
  docRef;
  gameOver = false;
  

  constructor(private firestore: Firestore, public dialog: MatDialog, private route: ActivatedRoute, private router: Router) { 
    this.gameCollection = collection(firestore, 'games');
    this.games$ = collectionData(this.gameCollection);
  }
  

  ngOnInit(): void {
    this.newGame();
    this.openDialog();
    this.route.params.subscribe( (params):void => {
      this.gameId = params['id'];
      this.games$.subscribe(async() => {
        this.docRef =  doc(this.db, 'games', this.gameId);
        let docSnap = await getDoc(this.docRef);
        let data:any = docSnap.data();
        this.game.currentPlayer = data.currentPlayer;
        this.game.playerImage = data.playerImage;
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
    if(this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop();
        this.game.pickCardAnimation = true;
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        this.saveGame();
      }
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImage.push('male.png');
        this.saveGame();
      }
    });
  }

  saveGame() {
    updateDoc(this.docRef, this.game.toJson())
  }

  editPlayer(playerId) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if(change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImage.splice(playerId, 1);
        } else {
          this.game.playerImage[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  returnToStartpage() {
    this.router.navigateByUrl('');
  }

}
