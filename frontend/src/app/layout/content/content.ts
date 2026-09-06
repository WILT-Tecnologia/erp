import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-content',
  standalone: true,
  templateUrl: './content.html',
  imports: [MatCard],
})
export class Content {}
