import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];

  constructor(private http: HttpClient,private router: Router) { }
  
  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/menu').subscribe(data => {
      this.menuItems = data;
    });
  }

  navigate(link: string): void {
    this.router.navigate([link]);
  }
}
