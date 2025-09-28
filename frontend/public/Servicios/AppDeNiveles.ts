import type { Nivel } from '../tipos';
const BASE = '/api/index.php?ruta=/niveles';

export default class AppDeNiveles {
  async listar(busqueda:string='', soloActivos?:boolean): Promise<Nivel[]> {
    const url = new URL(BASE, window.location.origin);
    if (busqueda) url.searchParams.set('q', busqueda);
    if (soloActivos!==undefined) url.searchParams.set('soloActivos', soloActivos?'1':'0');
    const r = await fetch(url.toString());
    return await r.json();
  }
  async crear(payload:{nombre:string; activo:boolean}) {
    const r = await fetch(BASE, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    if (r.status===409) throw new Error('NOMBRE_DUPLICADO');
    if (r.status===400) throw new Error('NOMBRE_OBLIGATORIO');
    if (!r.ok) throw new Error('ERROR_SERVIDOR');
  }
  async actualizar(id:number, payload:{nombre?:string; activo?:boolean}) {
    const r = await fetch(`${BASE}&id=${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    if (r.status===409) throw new Error('NOMBRE_DUPLICADO');
    if (r.status===400) throw new Error('NOMBRE_OBLIGATORIO');
    if (!r.ok) throw new Error('ERROR_SERVIDOR');
  }
  async alternar(id:number, activo:boolean) {
    const r = await fetch(`${BASE}&id=${id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({activo})});
    if (!r.ok) throw new Error('ERROR_SERVIDOR');
  }
  async eliminar(id:number) {
    const r = await fetch(`${BASE}&id=${id}`, {method:'DELETE'});
    if (!r.ok) throw new Error('ERROR_SERVIDOR');
  }
}