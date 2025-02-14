// src/app/stripe/stripe.module.ts
import { NgModule } from '@angular/core';
import { NgxStripeModule } from 'ngx-stripe';
import {STRIPE_KEY} from "../../config";

@NgModule({
  imports: [NgxStripeModule.forRoot(STRIPE_KEY)],

  exports: [NgxStripeModule]
})
export class StripeModule {}
/*

  imports: [NgxStripeModule.forRoot('pk_live_51Q6fi5BNvUWWco5bYziCvBgp7tdg6dj5eQ37QB1v87iNDpHQboCmEaO5RhNk8zfB3p4Ugodfy1j9aez0YDnH7LzM00KEbifX0O')],

  imports: [NgxStripeModule.forRoot('pk_test_51Q6fi5BNvUWWco5brEUJVyucYAGqoiLGnMRwgFFx1rbyMGwXV0Y5rYaMzz5cyXm94AqAGloH6OaQxdnHyYXR4UG800m87CJlyW')],


 */
