import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {

  allProfilePictures = ['male.png', 'female.png', 'cat.png', 'penguin.png', 'pig.png'];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}

  ngOnInit(): void {
    
  }

  onNoClick() {
    this.dialogRef.close();
  };

}
