import type { Nivel } from '../tipos';

export default class AlmacenDeNiveles {
  elementos: Nivel[] = [];
  filtrados: Nivel[] = [];
  termino = '';

  establecer(lista: Nivel[]) { this.elementos = lista; this.aplicar(); }
  buscar(termino: string) { this.termino = termino.toLowerCase(); this.aplicar(); }

  private aplicar() {
    this.filtrados = this.elementos.filter(n => n.nombre.toLowerCase().includes(this.termino));
  }
}