export const abrirModalCrearHorario = async () => {

    mostrarModal(htmlCrearHorario);

    requestAnimationFrame(async () => {

        /* ===== CARGAR JORNADAS ===== */
        const jornadas = await get("horarios/jornadas");
        const select = document.querySelector("#selectJornada");

        if (jornadas?.data) {
            jornadas.data.forEach(jornada => {
                const option = document.createElement("option");
                option.value = jornada.id;
                option.textContent = jornada.name;
                select.appendChild(option);
            });
        }

        /* ===== EVENTOS ===== */
        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);

        document
            .querySelector("#btnCrearHorario")
            .addEventListener("click", crearHorario);
    });
};

/* ===== CREAR HORARIO (POST) ===== */
const crearHorario = async () => {

    const name = document.querySelector("#inputNombre").value.trim();
    const jornada_id = document.querySelector("#selectJornada").value;
    const start_time = document.querySelector("#inputInicio").value;
    const end_time = document.querySelector("#inputFin").value;

    if (!name || !jornada_id || !start_time || !end_time) {
        alert("Complete todos los campos");
        return;
    }

    const payload = {
        name,
        jornada_id,
        start_time,
        end_time
    };

    const response = await post("horarios", payload);

    if (!response.ok) {
        alert(response.message || "Error al crear horario");
        return;
    }

    cerrarModal();
    alert("Horario creado correctamente 😎");

    // aquí puedes recargar la lista si quieres
};