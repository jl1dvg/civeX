import React from "react";
import {Modal, Button, Table, Alert} from "react-bootstrap";

const ModalProtocolos = ({show, onClose, rowData}) => {
    // Datos por defecto en caso de ausencia de rowData
    const mockData = {
        patient: {},
        protocolo: {},
        procedimiento_proyectado: "",
    };

    // Utilizar rowData o mockData para evitar errores
    const data = rowData || mockData;
    const {patient = {}, protocolo = {}} = data;

    // Validar duración
    const duracionValida = protocolo.duracion_valida;

    // Función para parsear un campo que podría ser un array o una cadena JSON
    const parseJsonArray = (value) => {
        if (Array.isArray(value)) return value;
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    // Roles obligatorios
    const requiredRoles = [
        "Cirujano Principal",
        "Instrumentista",
        "Circulante",
        "Anestesiólogo",
        "Ayudante de Anestesia",
    ];

    // Asegurarse de que los diagnósticos y procedimientos estén en formato array
    const diagnosticos = parseJsonArray(protocolo.diagnosticos);
    const procedimientos = parseJsonArray(protocolo.procedimientos);

    const staffFields = {
        "Cirujano Principal": protocolo.cirujano_1,
        Instrumentista: protocolo.instrumentista,
        Circulante: protocolo.circulante,
        Anestesiólogo: protocolo.anestesiologo,
        "Ayudante de Anestesia": protocolo.ayudante_anestesia,
        "Cirujano Asistente": protocolo.cirujano_2,
        "Primer Ayudante": protocolo.primer_ayudante,
        "Segundo Ayudante": protocolo.segundo_ayudante,
        "Tercer Ayudante": protocolo.tercer_ayudante,
    };

    // Validación de códigos
    const codigosPlantilla = protocolo.codigos_plantilla || [];
    const codigosProtocolo = protocolo.codigos_protocolo || [];
    const codigosFaltantes = codigosPlantilla.filter(
        (codigo) => !codigosProtocolo.includes(codigo)
    );

    // Función para calcular la duración entre dos horas
    const calculateDuration = (start, end) => {
        if (!start || !end) return "00:00";
        const startTime = new Date(`1970-01-01T${start}Z`);
        const endTime = new Date(`1970-01-01T${end}Z`);
        const diff = new Date(endTime - startTime);
        return `${diff.getUTCHours().toString().padStart(2, "0")}:${diff
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}`;
    };

    // Filtrar roles obligatorios y opcionales
    const filteredStaffFields = Object.entries(staffFields).filter(
        ([role, name]) =>
            requiredRoles.includes(role) || (name && name.trim())
    );

    // Validación del staff
    const staffCountExpected = protocolo.staff_count_esperado || 0;
    const staffActualCount = filteredStaffFields.filter(
        ([, name]) => name && name.trim()
    ).length;

    const staffValido =
        staffActualCount === staffCountExpected + requiredRoles.length;

    // Preparar detalles del staff
    const staffDetails = filteredStaffFields.map(([role, name]) => ({
        role,
        name: name || "Faltante",
        status: name ? "Presente" : "Faltante",
    }));

    // Render de filas para diagnósticos
    const diagnosticoRows = diagnosticos.map((diagnostico, idx) => {
        const [cie10 = "", detalle = ""] = diagnostico.idDiagnostico
            ? diagnostico.idDiagnostico.split(" - ", 2)
            : [];
        return (
            <tr key={idx}>
                <td>{cie10}</td>
                <td>{detalle}</td>
            </tr>
        );
    });

    // Render de filas para procedimientos
    const procedimientoRows = procedimientos.map((procedimiento, idx) => {
        if (!procedimiento.procInterno) return null;
        // Dividir la cadena completa sin límite
        const parts = procedimiento.procInterno.split(" - ");
        // El segundo elemento como código y el resto combinado como nombre
        const codigo = parts[1] || "";
        const nombre = parts.length > 2 ? parts.slice(2).join(" - ") : "";
        return (
            <tr key={idx}>
                <td
                    style={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    title={codigo}
                >
                    {codigo}
                </td>
                <td
                    style={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    title={nombre}
                >
                    {nombre}
                </td>
            </tr>
        );
    });

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Protocolo Quirúrgico</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Alertas de duración */}
                {duracionValida === false && (
                    <Alert variant="danger">
                        <strong>Atención:</strong> La duración del protocolo ({protocolo.duracion_real} horas) es menor
                        a la estipulada ({protocolo.duracion_estipulada} horas).
                    </Alert>
                )}
                {duracionValida === true && (
                    <Alert variant="success">
                        La duración del protocolo es válida ({protocolo.duracion_real} horas).
                    </Alert>
                )}
                {/* Alertas de códigos */}
                {codigosFaltantes.length > 0 && (
                    <Alert variant="danger">
                        <strong>Atención:</strong> Los códigos del protocolo no coinciden con los de la plantilla.
                        <br/>
                        <strong>Códigos del protocolo:</strong> {protocolo.codigos_protocolo.join(", ")}
                        <br/>
                        <strong>Códigos faltantes:</strong> {codigosFaltantes.join(", ")}
                    </Alert>
                )}
                {codigosFaltantes.length === 0 && (
                    <Alert variant="success">
                        Los códigos del protocolo coinciden con los de la plantilla.
                    </Alert>
                )}
                {/* Alertas de Staff */}
                {staffValido ? (
                    <Alert variant="success">
                        El Staff quirúrgico es válido ({staffActualCount} integrantes presentes).
                    </Alert>
                ) : (
                    <Alert variant="danger">
                        <strong>Atención:</strong> El Staff quirúrgico es inválido. Se
                        esperaban {staffCountExpected} integrantes,
                        pero solo hay {staffActualCount}.
                    </Alert>
                )}

                <h5>Diagnósticos</h5>
                <Table bordered>
                    <thead>
                    <tr>
                        <th className="table-info">CIE10</th>
                        <th className="table-info">Detalle</th>
                    </tr>
                    </thead>
                    <tbody>
                    {diagnosticoRows.length > 0 ? diagnosticoRows : (
                        <tr>
                            <td colSpan="2">No hay diagnósticos</td>
                        </tr>
                    )}
                    </tbody>
                </Table>

                <h5>Procedimientos</h5>
                <Table bordered>
                    <thead>
                    <tr>
                        <th className="table-info">Código</th>
                        <th className="table-info">Nombre del Procedimiento</th>
                    </tr>
                    </thead>
                    <tbody>
                    {procedimientoRows.length > 0 ? procedimientoRows : (
                        <tr>
                            <td colSpan="2">No hay procedimientos</td>
                        </tr>
                    )}
                    </tbody>
                </Table>

                <h5>Tiempo</h5>
                <Table bordered>
                    <thead>
                    <tr>
                        <th className="table-info">Fecha de Inicio</th>
                        <th className="table-info">Hora de Inicio</th>
                        <th className="table-info">Hora de Fin</th>
                        <th className="table-info">Duración</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{protocolo.fecha_inicio || "N/A"}</td>
                        <td>{protocolo.hora_inicio || "N/A"}</td>
                        <td>{protocolo.hora_fin || "N/A"}</td>
                        <td>{protocolo.duracion_real} horas</td>
                    </tr>
                    </tbody>
                </Table>

                <h5>Resultados</h5>
                <Table bordered>
                    <tbody>
                    <tr>
                        <td className="table-info">Dieresis</td>
                        <td style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                            {protocolo.dieresis || "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="table-info">Exposición</td>
                        <td style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                            {protocolo.exposicion || "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="table-info">Hallazgo</td>
                        <td style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                            {protocolo.hallazgo || "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="table-info">Operatorio</td>
                        <td style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                            {protocolo.operatorio || "N/A"}
                        </td>
                    </tr>
                    </tbody>
                </Table>

                <h5>Staff Quirúrgico</h5>
                <Table bordered>
                    <thead>
                    <tr>
                        <th className="table-info">Rol</th>
                        <th className="table-info">Nombre</th>
                        <th className="table-info">Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {staffDetails.map((staff, idx) => (
                        <tr
                            key={idx}
                            className={
                                staff.status === "Faltante" ? "table-danger" : ""
                            }
                        >
                            <td>{staff.role}</td>
                            <td>{staff.name}</td>
                            <td>
                                {staff.status === "Presente" ? (
                                    <i class="ri-checkbox-circle-fill text-success"></i>
                                ) : (
                                    <i class="ri-close-circle-fill text-danger"></i>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant=" secondary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button variant=" primary">Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalProtocolos;