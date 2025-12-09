import "../../Styles/Formulario/Formulario.css"

import { get, post } from "../../Helpers/api";
import { validarCampos, datos } from "../../Helpers/Modules/modules";
import { success, error } from "../../Helpers/alertas";

export default async () => {
    const form = document.querySelector(".form__form");

    // Selects
    const selectRol = document.querySelector(".rol");
    const selectFicha = document.querySelector(".ficha");
    const selectPrograma = document.querySelector(".programa");

    // Cargar datos desde backend
    const roles = await get("roles");
    const fichas = await get("ficha");
    const programas = await get("programa");

    // ======= RELLENAR SELECTS ========
    roles.data.forEach(r => {
        const op = document.createElement("option");
        op.value = r.id;
        op.textContent = r.name;
        selectRol.append(op);
    });

    fichas.data.forEach(f => {
        const op = document.createElement("option");
        op.value = f.id;
        op.textContent = f.ficha;
        selectFicha.append(op);
    });

    programas.data.forEach(p => {
        const op = document.createElement("option");
        op.value = p.id;
        op.textContent = p.training_program;
        selectPrograma.append(op);
    });

    selectRol.addEventListener("change", () => {
        const roles_id = roles.data.find(rls => rls.name.toLowerCase() === "aprendiz");
        console.log(roles_id.id);

        const rls = roles_id.id;
        const clase = document.querySelectorAll(".form__grupo.activo");
        if (selectRol.value == rls) {
            clase.forEach(g => g.classList.remove("oculto"));
        } else {
            clase.forEach(g => g.classList.add("oculto"));
            selectFicha.value = "";
            selectPrograma.value = "";
        }
    });

    // ========= SUBMIT FORM =============
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const esValido = validarCampos(event);
        console.log("¿Formulario válido?:", esValido, datos);

        if (!esValido) return;

        // Aquí ya tienes todos los campos limpios en `datos`
        const datosEnviar = {
            nombres: datos.nombres,
            apellidos: datos.apellidos,
            documento:String(datos.documento),
            rol_sena: datos.rol,
            ficha_id: datos.ficha || null,
            programa: datos.programa || null,
            correo: datos.correo,
            contrasena: datos.password,
            telefono: String(datos.telefono),
            estados_id: 1,
        };

        console.log("DATA ENVIADA:", datosEnviar);

        const response = await post("user/create", datosEnviar);

        if (!response.success) {
            if (response.errors) {
                response.errors.forEach((err) => error(err));
            } else {
                error(response.message || "Error al registrar");
            }
            return;
        }

        success(response.message || "Registrado correctamente");
        form.reset();
    });
};
