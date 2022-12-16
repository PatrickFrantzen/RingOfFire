import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';
import { PlayerComponent } from './player/player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { DialogAddPlayerComponent } from './dialog-add-player/dialog-add-player.component';
import { RuleDescriptionComponent } from './rule-description/rule-description.component';


@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    GameComponent,
    PlayerComponent,
    DialogAddPlayerComponent,
    RuleDescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
