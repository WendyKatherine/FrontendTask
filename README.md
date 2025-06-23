<h1>🎨 Task List App – Frontend</h1>

  <p>
    Esta SPA permite gestionar tareas en un tablero kanban con drag&nbsp;&amp;&nbsp;drop. Está construida en <strong>React + Vite</strong>, usa <strong>Tailwind CSS</strong> para el diseño y <strong>@hello‑pangea/dnd</strong> para la interacción.
  </p>

  <h2>✨ Características</h2>
  <div class="feature">📌 Tablero kanban con columnas <em>Pending, In&nbsp;Progress, Completed</em>.</div>
  <div class="feature">🔄 Drag &amp; drop para mover tareas (estado se actualiza en el backend).</div>
  <div class="feature">➕ Crear tareas con formulario y subida de imagen (Cloudinary).</div>
  <div class="feature">✏️ Editar en modal y ❌ eliminar con confirmación.</div>
  <div class="feature">🖼️ Miniaturas de imagen en cada tarjeta.</div>
  <div class="feature">⚡ Consumida vía API "Task List" desplegada en Render.</div>

  <h2>🏗️ Stack &amp; Librerías</h2>
  <ul>
    <li>React 18 + Vite</li>
    <li>TypeScript</li>
    <li>Tailwind CSS</li>
    <li>@hello‑pangea/dnd (fork react‑beautiful‑dnd)</li>
    <li>Lucide‑react (icons)</li>
  </ul>

  <h2>🛠️ Instalación local</h2>
  <ol>
    <li>Clonar el repo y entrar:<br />
      <code>git clone https://github.com/WendyKatherine/FrontendTask.git && cd FrontendTask</code></li>
    <li>Instalar dependencias:<br /><code>npm install</code></li>
    <li>Crear <code>.env</code> con la URL del backend:<br /><code>VITE_API_URL=https://backendtask-dr2m.onrender.com/api/task</code></li>
    <li>Iniciar en modo dev:<br /><code>npm run dev</code></li>
    <li>La app se abre en <code>http://localhost:5173</code></li>
  </ol>

  <h2>🚀 Despliegue</h2>
  <p>
    Frontend desplegado en <strong>Vercel</strong>:
    <br/>
    <code>https://frontend-task-one-bay.vercel.app/</code>
  </p>

  <h2>🔐 Variables de entorno</h2>
  <ul>
    <li><code>VITE_API_URL</code> – URL base del backend (Render).</li>
  </ul>

  <h2>📜 Scripts disponibles</h2>
  <ul>
    <li><code>npm run dev</code> – modo desarrollo (Vite).</li>
    <li><code>npm run build</code> – genera build de producción.</li>
    <li><code>npm run preview</code> – previsualiza la build local.</li>
  </ul>

  <h2>✍️ Autora</h2>
  <p><strong>Wendy Katherine Villa</strong> – 2025 ©</p>
