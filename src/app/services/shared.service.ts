import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  private produtosSource = new BehaviorSubject<any[]>([]);
  produtos$ = this.produtosSource.asObservable();

  constructor() { }

  atualizarProdutos(produtos: any[]) {
    this.produtosSource.next(produtos); // Emita um novo valor para os observadores
  }
}

