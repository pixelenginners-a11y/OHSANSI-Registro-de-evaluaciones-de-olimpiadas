export default class ServicioDeToasts {
  constructor(private el: HTMLElement) {}
  mostrar(titulo: string, mensaje: string, ok=true) {
    this.el.querySelector('.toast-header strong')!.textContent = titulo;
    this.el.querySelector('.toast-body')!.textContent = mensaje;
    this.el.classList.remove('bg-success','bg-danger','text-white');
    this.el.classList.add(ok?'bg-success':'bg-danger','text-white');
    // @ts-ignore
    new bootstrap.Toast(this.el).show();
  }
}