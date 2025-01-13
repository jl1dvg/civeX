import React from "react";
import {Badge} from "react-bootstrap";

// Componente que recibe 'afiliacion' como prop
export default function AfiliacionLogo({afiliacion}) {
    if (!afiliacion) {
        // Caso sin afiliación
        return <span className="text-muted">N/A</span>;
    }

    // Normalizamos
    const afil = afiliacion.trim().toUpperCase();

    // Decidimos ruta y "alt/title"
    let src = "/assets/images/logos/privado.png";
    let alt = afiliacion;
    let title = afiliacion;

    switch (afil) {
        case "ISSFA":
            src = "/assets/images/logos/issfa.png"; // Ojo: en algunos casos se llama issfa.png
            alt = "ISSFA";
            title = "ISSFA";
            break;
        case "ISSPOL":
            src = "/assets/images/logos/isspol.png";
            alt = "ISSPOL";
            title = "ISSPOL";
            break;
        case "MSP":
            src = "/assets/images/logos/msp.png";
            alt = "MSP";
            title = "MSP";
            break;
        case "SEGURO GENERAL":
        case "SEGURO GENERAL JUBILADO":
        case "SEGURO GENERAL POR MONTEPIO":
        case "SEGURO GENERAL TIEMPO PARCIAL":
        case "CONYUGE":
        case "HIJOS DEPENDIENTES":
        case "CONTRIBUYENTE VOLUNTARIO":
            src = "/assets/images/logos/iess.png";
            alt = afil;
            title = afil;
            break;
        default:
            // Lo marcamos con otro color (p.e. success o warning)
            return <Badge bg="success">{afiliacion}</Badge>;
            break;
    }

    // Retorna un <img> circular, o un <span> si quieres
    return (
        <img
            src={src}
            alt={alt}
            title={title}
            className="img-fluid avatar-40 rounded-circle"
        />
    );
}