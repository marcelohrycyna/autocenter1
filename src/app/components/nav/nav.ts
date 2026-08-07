import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, MatToolbarModule, MatSidenavModule, MatButtonModule, MatIconModule, MatExpansionModule, MatListModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {}
