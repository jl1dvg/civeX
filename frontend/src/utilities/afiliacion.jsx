import React from "react";
import {Badge} from "react-bootstrap";

// Array o función para asignar color según la afiliación
export function getAfiliacionBadge(afiliacion) {
    // Caso: sin afiliación
    if (!afiliacion) {
        return <Badge bg="secondary">N/A</Badge>;
    }

    // Normaliza, por si vienen mayúsculas, minúsculas mezcladas, etc.
    // (Opcional)
    const afiliacionNormalized = afiliacion.trim().toUpperCase();

    // Aplicas la lógica:
    switch (afiliacionNormalized) {
        // --- SEGUROS MILITARES:
        case "ISFFA":
            return <Badge bg="info">ISFFA</Badge>;

        // --- SEGURIDAD DE POLICÍAS:
        case "ISSPOL":
            return <Badge bg="dark">ISSPOL</Badge>;

        // --- SEGURIDAD SOCIAL DE TRABAJADORES:
        case "SEGURO GENERAL":
        case "SEGURO GENERAL JUBILADO":
        case "SEGURO GENERAL POR MONTEPIO":
        case "SEGURO GENERAL TIEMPO PARCIAL":
        case "CONYUGE":
        case "HIJOS DEPENDIENTES":
            return <Badge bg="primary">{afiliacion}</Badge>;

        // --- MINISTERIO DE SALUD:
        case "MSP":
            return <Badge bg="danger">MSP</Badge>;

        // --- Caso resto: pacientes privados VIP
        default:
            // Lo marcamos con otro color (p.e. success o warning)
            return <Badge bg="success">{afiliacion}</Badge>;
    }
}