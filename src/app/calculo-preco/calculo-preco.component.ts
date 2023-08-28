import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { SharedService } from '../services/shared.service';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../model/produto.model';

@Component({
  selector: 'app-calculo-preco',
  templateUrl: './calculo-preco.component.html',
  styleUrls: ['./calculo-preco.component.scss'],
})
export class CalculoPrecoComponent implements OnInit {
  produtosFiltrados: any[] = [];
  produtosFiltradosTemp: any[] = [];
  dadosDaTabelaFiltrados: any[] = [];
  editingValorIndex: number | null = null;
  editingDescontoIndex: number | null = null;
  fabricantesUnicos: string[] = [];
  filtroFabricante: string = '';
  produtos: any[] = [];
  editedValores: number[] = [];
  editingIndex: number | null = null;
  editingIndexes: boolean[] = [];
  editedDescontos: number[] = [];
  editedValorValido: boolean = true;
  totalValoresSemDesconto: number = 0; // Adicione esta propriedade


  colunas: string[] = [
    'fabricante',
    'codigo',
    'descricao',
    'valor',
    'desconto',
    'valorTotal',
  ];

  constructor(
    private produtoService: ProdutoService,
    private cdRef: ChangeDetectorRef,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const produtosFromLocalStorage = localStorage.getItem('produtos');
    if (produtosFromLocalStorage) {
      this.produtos = JSON.parse(produtosFromLocalStorage);
      this.fabricantesUnicos = this.obterFabricantesUnicos();
      this.produtosFiltrados = [...this.produtos];
      this.produtosFiltradosTemp = [...this.produtos];
      this.totalValoresSemDesconto = this.calcularSomaTotalValores();
    }
    this.cdRef.detectChanges();
  }


  obterFabricantesUnicos(): string[] {
    const fabricantesSet = new Set<string>();
    this.produtos.forEach((produto) => fabricantesSet.add(produto.fabricante));
    return Array.from(fabricantesSet);
  }

  editarProduto(produto: Produto, index: number, coluna: string) {
    this.fecharCamposEdicao();

    if (coluna === 'valor') {
      this.editingValorIndex = index;
      this.editedValores[index] = produto.valor;
    } else if (coluna === 'desconto') {
      this.editingDescontoIndex = index;
      this.editedDescontos[index] = produto.desconto;
    }

    this.editingIndexes[index] = true;
  }

  fecharCamposEdicao() {
    if (this.editingIndex !== null) {
      this.editingIndexes[this.editingIndex] = false;
      this.editingIndex = null;
    }
  }

  excluirTudo() {
    this.produtos = [];
    localStorage.removeItem('produtos');
    this.sharedService.atualizarProdutos(this.produtos);
    location.reload();
  }

  salvarEdicao(index: number, coluna: string) {
    if (coluna === 'valor') {
      this.editingValorIndex = null;
      this.produtos[index].valor = this.editedValores[index];
      this.produtos[index].valor = this.calcularValorComDesconto(this.produtos[index]);
    } else if (coluna === 'desconto') {
      this.editingDescontoIndex = null;
      this.produtos[index].desconto = this.editedDescontos[index];
    }
    this.editingIndexes[index] = false;
    localStorage.setItem('produtos', JSON.stringify(this.produtos));
    this.cdRef.detectChanges();

  }

  private calcularSomaTotalValores(): number {
    return this.produtos.reduce(
      (total: number, produto) => total + this.calcularValorComDesconto(produto),
      0
    );
  }

  calcularValorComDesconto(produto: any): number {
    const valor = produto.valor;
    const desconto = produto.desconto / 100;
    const valorComDesconto = valor * (1 - desconto);
    return valorComDesconto;
  }

  cancelarEdicao(index: number, coluna: string) {
    if (coluna === 'valor') {
      this.editingValorIndex = null;
    } else if (coluna === 'desconto') {
      this.editingDescontoIndex = null;
    }

    this.editingIndexes[index] = false;
    this.editingIndex = null;
  }

  formatarDesconto(valor: number): string {
    return `${valor}%`;
  }


  calcularValorSemDesconto(produto: any): number {
    return produto.valor;
  }

  valorValido(valor: number): boolean {
    return valor <= 1;
  }

  verificarValorValido(valor: number): boolean {
    return valor >= 1;
  }

  limparFiltro() {
    this.filtroFabricante = '';
  }

  aplicarFiltro(): void {
    const filtro = this.filtroFabricante.trim().toLowerCase();

    if (filtro !== '') {
      this.produtosFiltrados = this.produtosFiltradosTemp.filter((produto) =>
        produto.fabricante.toLowerCase().includes(filtro)
      );
    } else {
      this.produtosFiltrados = [...this.produtosFiltradosTemp]; // Restaurar a lista completa quando o filtro estiver vazio
    }
  }

  atualizarFiltro() {
    this.aplicarFiltro(); // Atualizar a lista de produtos filtrados sempre que o filtro é alterado
  }
}
