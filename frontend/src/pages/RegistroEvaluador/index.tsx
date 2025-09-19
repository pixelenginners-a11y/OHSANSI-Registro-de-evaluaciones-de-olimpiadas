import { useState, type ChangeEvent, type FormEvent } from "react";
import "./stile.css";

export default function RegistroEvaluadores() {
  const [form, setForm] = useState({
    nombreCompleto: "",
    nombreUsuario: "",
    correo: "",
    contrasena: "",
    area: "Historia",
    telefono: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos del evaluador:", form);
    alert("Evaluador registrado (demo)");
  };
  

  return (
    <div className="page">
      {/* Top bar */}
      <div className="topbar" />

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">LOGO</div>
          <div className="menu-title">Evaluadores ▾</div>
          <div className="menu-sub">Registro</div>
        </aside>

        {/* Content */}
        <main className="content">
          <h1 className="title">Registro de Evaluadores</h1>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div>
                <label>Nombre completo</label>
                <input
                  name="nombreCompleto"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>
              <div>
                <label>Nombre de Usuario</label>
                <input
                  name="nombreUsuario"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Área de Evaluación</label>
                <select name="area" value={form.area} onChange={handleChange}>
                  <option>Historia</option>
                  <option>Matemática</option>
                  <option>Ciencias</option>
                  <option>Lenguaje</option>
                </select>
              </div>
              <div>
                <label>Teléfono</label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn">
              Registrar Evaluador
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
