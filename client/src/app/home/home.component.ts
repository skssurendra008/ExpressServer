import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  private username :any;
  constructor(private router: Router) { 
    this.username = sessionStorage.getItem('User_details');
  }

  loading = false;
  ngOnInit() {
  }
  
  logout() {
    this.loading = true;
    //this.signIn = true;
    this.loading = false;

    //this.location.replaceState('/'); // clears browser history so they can't navigate with back button
    // this.router.navigateByUrl('/home');
    this.router.navigate(['login']);
  }
}
