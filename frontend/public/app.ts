import ApiDeNiveles from './Servicios/AppDeNiveles';
import AlmacenDeNiveles from './Estado/AlmacenDeNiveles';
import VistaTablaNiveles from './UI/VistaTablaNiveles';
import VistaFormularioNivel from './UI/VistaFormularioNivel';
import ServicioDeToasts from './Servicios/ServicioDeToasts';
import ServicioDeConfirmacion from './Servicios/ServicioDeConfirmacion';
import type { Nivel } from './tipos';

const api = new ApiDeNiveles();
const almacen = new AlmacenDeNiveles();
const tabla = new VistaTablaNiveles(document.querySelector('#tablaNiveles tbody')!);
const form = new VistaFormularioNivel(
  document.querySelector('#formNivel') as HTMLFormElement,
  document.querySelector('#nivelNombre') as HTMLInputElement,
  document.querySelector('#nivelActivo') as HTMLSelectElement,
  document.querySelector('#nivelId') as HTMLInputElement,
  document.querySelector('#btnLimpiar') as HTMLButtonElement
);
const toasts = new ServicioDeToasts(document.getElementById('toast')!);
const confirmar = new ServicioDeConfirmacion();
const inputBusqueda = document.getElementById('busqueda') as HTMLInputElement;

async function recargar() {
  const lista = await api.listar('');                 // CA1
  almacen.establecer(lista);
  tabla.renderizar(almacen.filtrados);
}

form.inicializar();
inputBusqueda.addEventListener('input', ()=>{
  almacen.buscar(inputBusqueda.value);                // CA9
  tabla.renderizar(almacen.filtrados);
});

tabla.alEditar = (n:Nivel)=> form.llenar(n.id, n.nombre, n.activo);                 // CA3

tabla.alAlternar = async (n:Nivel)=>{                                                    // CA4/CA8
  if (n.activo) {
    const ok = await confirmar.preguntar('¿Está seguro de desactivar este nivel?');
    if (!ok) return;
  }
  await api.alternar(n.id, !n.activo);
  toasts.mostrar('Éxito', n.activo?'Nivel desactivado':'Nivel activado', true);        // CA10
  await recargar();
};

tabla.alEliminar = async (n:Nivel)=>{                                                   // opcional
  const ok = await confirmar.preguntar('¿Eliminar este nivel?');
  if (!ok) return;
  await api.eliminar(n.id);
  toasts.mostrar('Éxito', 'Nivel eliminado', true);
  await recargar();
};

form.alEnviar = async ({id, nombre, activo})=>{                                         // CA2/CA3/CA5/CA6/CA10
  try {
    if (id) { await api.actualizar(id, {nombre, activo}); toasts.mostrar('Éxito','Nivel actualizado',true); }
    else    { await api.crear({nombre, activo});        toasts.mostrar('Éxito','Nivel creado',true); }
    form.limpiar(); await recargar();
  } catch (e:any) {
    if (e.message==='NOMBRE_DUPLICADO') toasts.mostrar('Error','Ya existe un nivel con ese nombre',false);
    else if (e.message==='NOMBRE_OBLIGATORIO') toasts.mostrar('Error','El nombre del nivel es obligatorio',false);
    else toasts.mostrar('Error','No se pudo completar la operación',false);
  }
};

recargar(); // carga inicial (CA1)