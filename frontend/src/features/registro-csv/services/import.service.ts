import { type FilaCSVValida } from "../types/inscritos";

export async function importInscritos(rows: FilaCSVValida[]) {
  // TODO: integra con tu API real (Laravel)
  await new Promise(r => setTimeout(r, 600));
  return { ok: true, imported: rows.length };
}
