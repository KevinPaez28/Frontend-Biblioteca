import "../../Styles/Formulario/Formulario.css"

import "../../Styles/Formulario/Formulario.css";
import { get, post } from "../../Helpers/api";
import { validarCampos, datos, validarNumeros } from "../../Helpers/Modules/modules";
import { success, error } from "../../Helpers/alertas";

export default async () => {

    const form = document.querySelector(".form__form");

    // Inputs
    const inputDocumento = document.querySelector("#documento");

    // Selects
    const selectRol = document.querySelector(".rol");
    const selectFicha = document.querySelector(".ficha");
    const selectPrograma = document.querySelector(".programa");

    // Cargar datos desde backend
    const roles = await get("roles");
    const fichas = await get("ficha");
    const programas = await get("programa");
    console.log(roles);
    console.log(fichas);
    console.log(programas);
    

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
        op.textContent = f.name;
        selectFicha.append(op);
    });

    programas.data.forEach(p => {
        const op = document.createElement("option");
        op.value = p.id;
        op.textContent = p.name;
        selectPrograma.append(op);
    });


    selectRol.addEventListener("change", () => {
        const roles_id = roles.data.find(rls => rls.name.toLowerCase() == "aprendiz");
        const rls = roles_id.id;
        const clase = document.querySelectorAll(".form__grupo.activo");
        if (selectRol.value == rls) {

            clase.forEach(g => g.classList.remove("oculto"));
        }
        else {
            clase.forEach(g => g.classList.add("oculto"));
            selectFicha.value = "";
            selectPrograma.value = "";
        }
    })

    inputDocumento.addEventListener("input", () => {
        validarNumeros(inputDocumento);
    });


    // ========= SUBMIT FORM =============
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validarCampos(e)) {
            error("Por favor corrige los campos marcados");
            return;
        }

        const data = {
            nombres: datos.nombres,
            apellidos: datos.apellidos,
            usuario_id: datos.usuario_id,
            rol_sena: datos.rol_sena,
            ficha: datos.rol_sena_1,        // segundo select con mismo name
            programa: datos.rol_sena_2,     // tercer select con mismo name
            correo: datos.correo,
            telefono: datos.telefono,
        };

        console.log("DATA ENVIADA:", data);

        const response = await post("usuarios/create", data);

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
