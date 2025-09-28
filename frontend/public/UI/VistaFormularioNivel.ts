export default class VistaFormularioNivel {
  constructor(
    private formulario: HTMLFormElement,
    private inputNombre: HTMLInputElement,
    private selectActivo: HTMLSelectElement,
    private inputOcultoId: HTMLInputElement,
    private botonLimpiar: HTMLButtonElement
  ) {}

  alEnviar: (p:{id?:number; nombre:string; activo:boolean})=>void = ()=>{};

  inicializar() {
    this.formulario.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nombre = this.inputNombre.value.trim();
      if (!nombre) {
        this.formulario.dispatchEvent(new CustomEvent('nombre-invalido', {bubbles:true}));
        return;
      }
      this.alEnviar({
        id: this.inputOcultoId.value ? Number(this.inputOcultoId.value) : undefined,
        nombre,
        activo: this.selectActivo.value === '1'
      });
    });
    this.botonLimpiar.addEventListener('click', ()=> this.limpiar());
  }

  llenar(id:number, nombre:string, activo:boolean) {  // para editar
    this.inputOcultoId.value = String(id);
    this.inputNombre.value = nombre;
    this.selectActivo.value = activo ? '1':'0';
  }

  limpiar() {
    this.inputOcultoId.value=''; this.formulario.reset();
  }
}