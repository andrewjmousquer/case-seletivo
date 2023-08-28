import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Produto } from '../model/produto.model';
import { ProdutoService } from '../services/produto.service';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  valorTemp: string = ''; // Declare como string
  novoProduto: Produto = { fabricante: '', codigo: '', descricao: '', valor: 0, desconto: 0, valorTotal: 0, valorTotalSemDesconto: 0 };
  produtos: any[] = [];
  produtoEmEdicao: Produto | null = null;
  indiceProdutoEmEdicao: number = -1; // Definindo um valor padrão que não representa um índice válido
  colunas: string[] = ['fabricante', 'codigo', 'descricao', 'valor', 'acoes'];


  constructor(private produtoService: ProdutoService, private cdRef: ChangeDetectorRef, private sharedService: SharedService) {}

  ngOnInit(): void {
    const produtosFromLocalStorage = localStorage.getItem('produtos');
    if (produtosFromLocalStorage) {
      this.produtos = JSON.parse(produtosFromLocalStorage);
    }
  }


  adicionarProduto() {
    if (this.novoProduto.fabricante && this.novoProduto.codigo && this.novoProduto.descricao && this.novoProduto.valor) {
      this.produtos.push(this.novoProduto);
      localStorage.setItem('produtos', JSON.stringify(this.produtos));
      this.novoProduto = { fabricante: '', codigo: '', descricao: '', valor: 0, desconto: 0, valorTotal: 0, valorTotalSemDesconto: 0 };
      this.cdRef.detectChanges();
      this.produtos = [...this.produtos];
      this.sharedService.atualizarProdutos(this.produtos);
      location.reload();
    }
  }


  editarProduto(produto: any, indice: number) {
    this.produtoEmEdicao = produto;
    this.indiceProdutoEmEdicao = indice;
    this.novoProduto = { ...produto };
  }

  excluirProduto(produto: any) {
    const index = this.produtos.indexOf(produto);
    if (index !== -1) {
      this.produtos.splice(index, 1);
      localStorage.setItem('produtos', JSON.stringify(this.produtos));
      this.produtos = [...this.produtos];
      location.reload();
    }
  }

  salvarEdicao() {

    this.produtos[this.indiceProdutoEmEdicao] = this.novoProduto;
    localStorage.setItem('produtos', JSON.stringify(this.produtos));
    this.produtoEmEdicao = null;
    this.indiceProdutoEmEdicao = -1;
    this.novoProduto = { fabricante: '', codigo: '', descricao: '', valor: 0, desconto: 0, valorTotal: 0, valorTotalSemDesconto: 0};
    this.produtos = [...this.produtos];
    location.reload();
  }

  cancelarEdicao() {
    this.produtoEmEdicao = null;
    this.indiceProdutoEmEdicao = -1;
    this.novoProduto = { fabricante: '', codigo: '', descricao: '', valor: 0, desconto: 0, valorTotal: 0, valorTotalSemDesconto: 0};
  }

  valorTempChanged(newValue: string) {
    if (newValue === '0') {
      this.valorTemp = '';
    } else {
      this.valorTemp = newValue;
    }
  }
}
