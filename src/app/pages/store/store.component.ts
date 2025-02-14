// src/app/pages/store/store.component.ts
import { Component } from '@angular/core';
import { StripeService } from '../../services/stripe.service';
import { CartService } from '../../services/cart.service';
import { NgForOf } from '@angular/common';
import { ServiceDTO } from '../../services/models/service.dto';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  imports: [
    NgForOf,
    RouterLink
  ],
  styleUrls: ['./store.component.css']
})
export class StoreComponent {
  skins = [
    { name: 'Skin 1', price: 100, imageUrl: 'assets/skins/skin1.png' },
    { name: 'Skin 2', price: 200, imageUrl: 'assets/skins/skin2.png' },
    { name: 'Skin 3', price: 300, imageUrl: 'assets/skins/skin3.png' }
  ];

  constructor(private stripeService: StripeService, private cartService: CartService) {}

  buySkin(skin: any) {
    const service: ServiceDTO = {
      id: skin.name, // Assuming name is unique, otherwise use a unique identifier
      title: skin.name,
      description: 'Skin for your character',
      price: skin.price,
      quantity: 1,
      titulo: skin.name, // Add other required properties
      descripcion: 'Skin for your character',
      descripcionPlus: '',
      descriptionPlus: '',
      reccurente: false
    };
    this.cartService.addToCart(service);
  }
}
