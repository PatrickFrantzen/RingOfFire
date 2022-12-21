import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, doc, getFirestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

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

  /**
   * creates a new game, get the ID of the game and checks data on the database
   */
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params): void => {
      this.gameId = params['id'];
      this.games$.subscribe(async () => {
        this.docRef = doc(this.db, 'games', this.gameId);
        let docSnap = await getDoc(this.docRef);
        let data: any = docSnap.data();
        this.updateFromDatabase(data);
        this.checkNumberOfPlayer();
      })
    })

  }

  /**
   * creates a new game from Game model
   */
  newGame() {
    this.game = new Game();
  }

  /**
   * if the number of players is only one, the dialog to create new Players is open
   */
  checkNumberOfPlayer() {
    if (this.game.players.length < 2)
      this.openDialog();
  }

  /**
   * game gets the current values from the database
   * @param data current data on the database
   */
  updateFromDatabase(data) {
    this.game.currentPlayer = data.currentPlayer;
    this.game.playerImage = data.playerImage;
    this.game.playedCards = data.playedCards;
    this.game.players = data.players;
    this.game.stack = data.stack;
    this.game.pickCardAnimation = data.pickCardAnimation;
    this.game.currentCard = data.currentCard;
  }


  /**
   * when clicking on the card stack, a card is drawn and put on the discard stack. If the stack is empty, the game is over.
   * draw function is disabled as long as the current card is discarded, for 1 sec
   */
  takeCard() {
    if (this.game.stack.length == 0)
      this.gameOver = true;
    else if (!this.game.pickCardAnimation && this.game.players.length >= 2) {
      this.drawCardAndUpdateGame();
      this.discardCardandUpdateGame();
    }
  }

  /**
   * a card is drawn from the stack array and it is the turn of the next player. All data is send to database and game is updating.
   */
  drawCardAndUpdateGame() {
    this.game.currentCard = this.game.stack.pop();
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    this.saveGame();
  }

  /**
   * the current card is pushed to the played cards array and the animation is set back to false to enable the draw function. All data is send to database and game is updating.
   */
  discardCardandUpdateGame() {
    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
    }, 1000);
  }

  /**
   * A dialog to add new player and closed after clicking on ok or outside the dialog
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0)
        this.addNewPlayer(name);
    });
  }

  /**
   * Saving the name of new player and setting the default image
   * @param name is the name of the new player
   */
  addNewPlayer(name) {
    this.game.players.push(name);
    this.game.playerImage.push('male.png');
    this.saveGame();
  }

  /**
   * all data is send as a Json to database
   */
  saveGame() {
    updateDoc(this.docRef, this.game.toJson())
  }

  /**
   * Dialog to change the default image of a player or deleting the player from the game
   * @param playerId is ID of a player inside the players array
   */
  editPlayer(playerId) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE')
          this.deletePlayer(playerId)
        else
          this.changePicture(playerId, change)
      }
      this.saveGame();
    });
  }

  /**
   * Deleting of Player
   * @param playerId is ID of a player inside the players array
   */
  deletePlayer(playerId) {
    this.game.players.splice(playerId, 1);
    this.game.playerImage.splice(playerId, 1);
  }

  /**
   * Image of a specific player is changed to the choosen one
   * @param playerId is ID of a player inside the players array
   * @param change is the name of an image as string or string Delete
   */
  changePicture(playerId, change) {
    this.game.playerImage[playerId] = change;
  }

  /**
   * On click on the Game over screen the user is send back to starting page
   */
  returnToStartpage() {
    this.router.navigateByUrl('');
  }

}
