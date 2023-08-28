import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  editingTabIndex: number | null = null;
  tabLabels: string[] = ['CADASTRO', 'CÁLCULO DE PREÇO'];
  editedTabLabels: string[] = [...this.tabLabels];


  title = 'case-seletivo';

  ngOnInit(): void {
    this.editedTabLabels = JSON.parse(localStorage.getItem('editedTabLabels') || '[]');
  }

  startEditing(index: number): void {
    this.editingTabIndex = index;
  }

  saveTab(index: number): void {
    this.editingTabIndex = null;
    localStorage.setItem('editedTabLabels', JSON.stringify(this.editedTabLabels));
  }

  cancelEdit(): void {
    this.editingTabIndex = null;
    this.editedTabLabels = JSON.parse(localStorage.getItem('editedTabLabels') || '[]');
  }

}
