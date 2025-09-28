import type { Nivel } from '../tipos';

export default class VistaTablaNiveles {
  constructor(private cuerpo: HTMLElement) {}
  alEditar: (n:Nivel)=>void = ()=>{};
  alAlternar: (n:Nivel)=>void = ()=>{};
  alEliminar: (n:Nivel)=>void = ()=>{};

  renderizar(niveles: Nivel[]) {
    this.cuerpo.innerHTML = '';
    niveles.forEach(n => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${n.nombre}</td>
        <td>${n.activo ? 'Activo':'Inactivo'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1">Editar</button>
          <button class="btn btn-sm ${n.activo?'btn-outline-warning':'btn-outline-success'} me-1">
            ${n.activo?'Desactivar':'Activar'}
          </button>
          <button class="btn btn-sm btn-outline-danger">Eliminar</button>
        </td>`;
      (tr.children[2].children[0] as HTMLButtonElement).onclick = () => this.alEditar(n);
      (tr.children[2].children[1] as HTMLButtonElement).onclick = () => this.alAlternar(n);
      (tr.children[2].children[2] as HTMLButtonElement).onclick = () => this.alEliminar(n);
      this.cuerpo.appendChild(tr);
    });
  }
}