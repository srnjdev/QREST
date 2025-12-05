import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { ToastHostComponent } from './shared/toast/toast-host';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, ToastHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'GeneradorDeMenus';
}
