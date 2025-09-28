export default class ServicioDeConfirmacion {
  async preguntar(texto: string): Promise<boolean> {
    return confirm(texto);
  }
}