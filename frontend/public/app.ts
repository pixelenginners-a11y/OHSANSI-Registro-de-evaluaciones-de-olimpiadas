type Level = { id:number; name:string; is_active:boolean };

const API = '/api/levels.php';

const tblBody = document.querySelector<HTMLTableSectionElement>('#tblLevels tbody')!;
const form = document.querySelector<HTMLFormElement>('#formLevel')!;
const search = document.querySelector<HTMLInputElement>('#search')!;
const btnClear = document.getElementById('btnClear') as HTMLButtonElement;
const levelId = document.getElementById('levelId') as HTMLInputElement;
const levelName = document.getElementById('levelName') as HTMLInputElement;
const levelActive = document.getElementById('levelActive') as HTMLSelectElement;

let data: Level[] = [];
let filtered: Level[] = [];

function toast(title:string, msg:string, ok=true) {
  const el = document.getElementById('toast')!;
  (document.getElementById('toastTitle')!).textContent = title;
  (document.getElementById('toastBody')!).textContent = msg;
  el.classList.remove('text-bg-danger','text-bg-success');
  el.classList.add(ok ? 'text-bg-success' : 'text-bg-danger');
  // @ts-ignore
  new bootstrap.Toast(el).show();
}

async function load(q="") { // CA1 + CA9
  const res = await fetch(`${API}?q=${encodeURIComponent(q)}`);
  data = await res.json();
  filtered = [...data];
  render();
}

function render() { // CA1
  tblBody.innerHTML = '';
  filtered.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.name}</td>
      <td>${l.is_active ? 'Activo' : 'Inactivo'}</td>
      <td class="actions">
        <i class="bi bi-pencil-square" title="Editar"></i>
        <i class="bi bi-toggle-${l.is_active ? 'on' : 'off'}" title="${l.is_active ? 'Desactivar' : 'Activar'}"></i>
        <i class="bi bi-trash" title="Eliminar"></i>
      </td>`;
    // Editar (CA3)
    (tr.querySelector('.bi-pencil-square') as HTMLElement).onclick = () => {
      levelId.value = String(l.id);
      levelName.value = l.name;
      levelActive.value = l.is_active ? '1' : '0';
      levelName.focus();
    };
    // Activar/Desactivar (CA4 + CA8)
    (tr.querySelector(`.bi-toggle-${l.is_active ? 'on' : 'off'}`) as HTMLElement).onclick = async () => {
      if (l.is_active && !confirm('¿Está seguro de desactivar este nivel?')) return; // CA8
      const res = await fetch(`${API}?id=${l.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ is_active: !l.is_active })
      });
      if (!res.ok) { toast('Error','No se pudo cambiar el estado',false); return; }
      toast('Éxito', l.is_active ? 'Nivel desactivado' : 'Nivel activado', true); // CA10
      await load(search.value.trim());
    };
    // Eliminar (opcional)
    (tr.querySelector('.bi-trash') as HTMLElement).onclick = async () => {
      if (!confirm('¿Eliminar este nivel?')) return;
      const r = await fetch(`${API}?id=${l.id}`, { method:'DELETE' });
      if (!r.ok) { toast('Error', 'No se pudo eliminar', false); return; }
      toast('Éxito','Nivel eliminado', true);
      await load(search.value.trim());
    };

    tblBody.appendChild(tr);
  });
}

// Guardar (crear/editar)  CA2, CA3, CA5, CA6, CA10
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validación cliente (CA5)
  if (!levelName.value.trim()) {
    levelName.classList.add('is-invalid');
    toast('Error','El nombre del nivel es obligatorio', false);
    return;
  } else levelName.classList.remove('is-invalid');

  const id = levelId.value ? parseInt(levelId.value,10) : 0;
  const payload = {
    name: levelName.value.trim(),
    is_active: levelActive.value === '1'
  };

  let res: Response;
  try {
    if (id>0) {
      res = await fetch(`${API}?id=${id}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(API, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
    }

    if (res.status === 409) { toast('Error','Ya existe un nivel con ese nombre', false); return; } // CA6
    if (res.status === 400) { toast('Error','El nombre del nivel es obligatorio', false); return; } // CA5
    if (!res.ok) throw new Error();

    toast('Éxito', id>0 ? 'Nivel actualizado' : 'Nivel creado', true); // CA10
    form.reset(); levelId.value='';
    await load(search.value.trim());
  } catch {
    toast('Error','No se pudo guardar. Intenta nuevamente.', false);
  }
});

btnClear.onclick = () => { form.reset(); levelId.value=''; };

search.addEventListener('input', (e) => { // CA9
  const term = (e.target as HTMLInputElement).value.toLowerCase();
  filtered = data.filter(l => l.name.toLowerCase().includes(term));
  render();
});

// Carga inicial (CA1)
load();
