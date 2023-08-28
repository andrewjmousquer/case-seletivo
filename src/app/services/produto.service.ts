import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtosUrl = 'assets/produtos.json';

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.produtosUrl);
  }
}
