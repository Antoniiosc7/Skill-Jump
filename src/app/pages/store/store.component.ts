import { Component } from '@angular/core';
import { StripeService } from '../../services/stripe.service';
import { CartService } from '../../services/cart.service';
import { NgForOf, NgClass, NgIf } from '@angular/common';
import { ServiceDTO } from '../../services/models/service.dto';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  imports: [
    NgForOf,
    RouterLink,
    MatBadgeModule,
    MatIconModule,
    NgIf
  ],
  standalone: true,
  styleUrls: ['./store.component.css']
})
export class StoreComponent {
  skins = [
    {
      id: 'skin1',
      name: 'Golden Warrior',
      price: 100,
      imageUrl: 'assets/skins/skin1.png',
      rarity: 'Common',
      description: 'A classic warrior skin with golden accents'
    },
    {
      id: 'skin2',
      name: 'Shadow Assassin',
      price: 200,
      imageUrl: 'assets/skins/skin2.png',
      rarity: 'Rare',
      description: 'Blend into the shadows with this stealthy skin'
    },
    {
      id: 'skin3',
      name: 'Dragon Knight',
      price: 300,
      imageUrl: 'assets/skins/skin3.png',
      rarity: 'Legendary',
      description: 'Command respect with this legendary dragon armor'
    }
  ];

  selectedSkin: any = null;
  cartItemCount$: Observable<number>;

  constructor(
    private stripeService: StripeService,
    private cartService: CartService
  ) {
    this.cartItemCount$ = this.cartService.getCartItems().pipe(
      map(items => items.length)
    );
  }

  buySkin(skin: any) {
    const service: ServiceDTO = {
      id: skin.id,
      title: skin.name,
      description: skin.description,
      price: skin.price,
      quantity: 1,
      titulo: skin.name,
      descripcion: skin.description,
      descripcionPlus: `Rarity: ${skin.rarity}`,
      descriptionPlus: `Rarity: ${skin.rarity}`,
      reccurente: false
    };
    this.cartService.addToCart(service);
  }

  selectSkin(skin: any) {
    this.selectedSkin = skin;
  }

  getRarityColor(rarity: string): string {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-yellow-400';
      case 'rare': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }

  getCartItemCount(): number {
    let itemCount = 0;
    this.cartService.getCartItems().subscribe(items => {
      itemCount = items.length;
    });
    return itemCount;
  }
}
