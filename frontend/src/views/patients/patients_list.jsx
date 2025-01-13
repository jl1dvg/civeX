import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import useDataTable from "../../components/hooks/useDatatable";
import {Badge, Row, Col} from "react-bootstrap";
import Card from "../../components/Card";
import {getAfiliacionBadge} from "../../utilities/afiliacion.jsx";
import ReactDOMServer from "react-dom/server";
import AfiliacionLogo from "../../components/AfiliacionLogo.jsx";

const PatientTable = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const tableRef = useRef(null);

    // Fetch patients from the backend
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/pacientes/patients/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                setPatients(response.data); // Guardar pacientes
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar datos de pacientes:", error);
                setError("Error al cargar datos.");
            }
        };

        fetchPatients();
    }, []);

    // Función para determinar el estado de cobertura
    const getCoverageStatus = (fecha_caducidad) => {
        if (!fecha_caducidad) {
            return <span className="badge badge-warning-light">N/A</span>;
        }

        const fechaCaducidad = new Date(fecha_caducidad);
        const now = new Date();

        if (fechaCaducidad < now) {
            return <Badge bg="danger">Sin Cobertura</Badge>;
        }

        return <Badge bg="primary">Con Cobertura</Badge>;
    };

    // Configuración de columnas para la tabla
    const columns = [
        {title: "ID del Paciente", data: "hc_number"},
        {title: "Nombre Completo", data: "full_name"},
        // Columna de afiliación con color
        {
            title: "Afiliación",
            data: "afiliacion",
            render: (cellData) => {
                // cellData es el valor de "afiliacion"
                // 1) Creamos un elemento React
                const element = <AfiliacionLogo afiliacion={cellData}/>;
                // 2) Lo convertimos a string
                return ReactDOMServer.renderToString(element);
            },
        }, {
            title: "Estado de Cobertura",
            data: "fecha_caducidad",
            // Convertimos el elemento React a un string HTML
            render: (data) => {
                const reactElement = getCoverageStatus(data);
                const htmlString = ReactDOMServer.renderToString(reactElement);
                return htmlString;
            },
        },
        {
            title: "Acciones",
            data: null,
            // Esto ya devuelve HTML crudo, así que DataTables lo muestra tal cual
            render: () => `
      <button class="btn btn-primary btn-sm">Editar</button>
      <button class="btn btn-danger btn-sm">Eliminar</button>
    `,
        },
    ];

    // Configuración del DataTable
    useDataTable({
        tableRef: tableRef,
        columns: columns,
        data: patients,
        isFooter: true,
        isColumnHidden: true,
        isColumnHiddenClass: ".toggle-vis",
        isFilterColumn: true,
    });

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <Card.Header.Title className="header-title">
                                <h4 className="card-title">Tabla de Pacientes</h4>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive custom-table-search">
                                <table
                                    ref={tableRef}
                                    className="table dataTable"
                                    data-toggle="data-table"
                                ></table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PatientTable;