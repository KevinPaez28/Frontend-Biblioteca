import "../../Styles/Formulario/Formulario.css"

import { get, post } from "../../Helpers/api";
import { validarCampos, datos, validarNumeros } from "../../Helpers/Modules/modules";
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

        // Validar campos
        if (!validarCampos(event)) {
            error("Por favor corrige los campos marcados");
            return;
        }

        const datosEnviar = {};
        //tomamos todos los elementos del formulario y los agregamos 
        // al objeto datosEnviar
        for (let i = 0; i < form.elements.length; i++) {
            const campo = form.elements[i];
            if (campo.hasAttribute('name')) {
                datosEnviar[campo.name] = campo.value.trim();
            }
        }

        //a claves del objeto le asignamos los valores de los inputs
        datosEnviar.documento=(datosEnviar.documento);
        datosEnviar.rol_sena = (datosEnviar.rol);
        datosEnviar.ficha_id = (datosEnviar.ficha);
        datosEnviar.programa = (datosEnviar.programa);
        datosEnviar.telefono = (datosEnviar.telefono);
        datosEnviar.estados_id = 1;

        console.log("DATA ENVIADA:", datosEnviar);

        const response = await post("user/create", datosEnviar);

        if (!response.success) {
            if (response.errors) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Error al registrar");
            }
            return;
        }

        success(response.message || "Registrado correctamente");
        form.reset();
    });

};
