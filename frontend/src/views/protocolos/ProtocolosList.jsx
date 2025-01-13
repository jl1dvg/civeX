import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import useDataTable from "../../components/hooks/useDatatable";
import {Badge, Row, Col} from "react-bootstrap";
import Card from "../../components/Card";
import ReactDOMServer from "react-dom/server";
import AfiliacionLogo from "../../components/AfiliacionLogo.jsx";
import ModalProtocolos from "../../components/modals/ModalProtocolos.jsx";
import $ from "jquery";

const ProtocolosTable = () => {
        const [protocolos, setProtocolos] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const tableRef = useRef(null);

        // Para abrir/cerrar el modal
        const [showModal, setShowModal] = useState(false);
        const [selectedRow, setSelectedRow] = useState(null);

        // Llamado cuando se da clic en "Editar"
        const handleOpenModal = async (rowData) => {
            // Agrega un console.log para ver los valores
            console.log("Abriendo modal para hc_number:", rowData.hc_number, "y form_id:", rowData.form_id);

            try {
                const {form_id, hc_number} = rowData;
                const response = await axios.get("http://localhost:8000/protocolos/detail/", {
                    params: {form_id, hc_number},
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                });

                if (response.status === 200) {
                    setSelectedRow(response.data); // Establecer los detalles del protocolo
                    setShowModal(true); // Mostrar el modal
                } else {
                    console.error("Error en el servidor: ", response.data.error);
                    alert("Error en el servidor al cargar los detalles del protocolo.");
                }
            } catch (error) {
                console.error("Error al cargar detalles del protocolo: ", error);
                alert("Hubo un error al intentar cargar los datos. Por favor, intente nuevamente.");
            }
        };

        // rowCallback: DataTables nos pasa `row` = <tr>, y `rowData` = la data JSON
        const rowCallback = (row, rowData, displayIndex) => {
            // row es un elemento <tr> nativo del DOM
            // 1) buscamos la celda de la última columna (Acciones)
            const cells = row.getElementsByTagName("td");
            const lastCell = cells[cells.length - 1]; // la última

            // 2) Creamos un botón (o varios):
            //    Ejemplo:  <button class="btn btn-primary">Editar</button>
            //    Agregamos un onclick que llama a `handleOpenModal(rowData)`
            //    Ojo: no es React real, es DOM nativo. Pero funciona ;)
            lastCell.innerHTML = `
      <button class="btn btn-primary btn-sm" id="editBtn"><i class="ri-edit-box-fill"></i></button>
    `;

            // 3) Enganchamos el evento click con JS nativo
            //    Podrías hacerlo con jQuery si gustas
            const editBtn = lastCell.querySelector("#editBtn");
            if (editBtn) {
                editBtn.addEventListener("click", () => {
                    handleOpenModal(rowData);  // Llama a la función de React
                });
            }
        };

        // 1) Cargar la data
        useEffect(() => {
            const fetchProtocolos = async () => {
                try {
                    const resp = await axios.get("http://localhost:8000/protocolos/complete_list/", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`
                        },
                    });
                    setProtocolos(resp.data);
                } catch (err) {
                    console.error("Error al cargar datos de protocolos:", err);
                    setError("Error al cargar datos.");
                } finally {
                    setLoading(false);
                }
            };

            fetchProtocolos();
        }, []);

        // Función que retorna sólo un ícono con un color distintivo
        function getStatusIcon(status) {
            if (status === "revisado") {
                // Icono check en verde
                return <i className="ri-check-fill text-success" style={{fontSize: "1.7rem"}}/>;
            } else if (status === "incompleto") {
                // Icono X en rojo
                return <i className="ri-close-circle-fill text-danger" style={{fontSize: "1.7rem"}}/>;
            }
            // Caso “no revisado”
            return <i className="ri-time-fill text-warning" style={{fontSize: "1.7rem"}}/>;
        }

        // 4) Definir columnas DataTables
        const columns = [
                {
                    title: "Nombre del Paciente",
                    data: "patient_name",
                },
                {
                    title: "Equipo Médico",
                    data: "doctors_team",
                    render: (data) => {
                        const doctors = Array.isArray(data) ? data : [];
                        return doctors
                            .map((doctor, idx) => {
                                if (doctor.profile_picture) {
                                    return `
                <a href="#" class="media">
                  <img
                    class="img-fluid avatar-40 rounded-circle"
                    src="${doctor.profile_picture}"
                    alt="Doctor ${idx + 1}"
                    title="${doctor.name}"
                  />
                </a>
              `;
                                }
                                return doctor.name || "N/A";
                            })
                            .join("");
                    },
                },
                {
                    title: "Fecha",
                    data: "operation_date",
                },
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
                    title: "Estado",
                    data: "status",
                    render: (status) => {
                        // Convertimos a HTML (porque DataTables espera HTML en `render`)
                        // Ajusta la función de tu preferencia
                        const iconElement = getStatusIcon(status);
                        return ReactDOMServer.renderToString(iconElement);
                    },
                },
                {
                    title: "Cirugía",
                    data: "membrete",
                    render: (data) => {
                        if (!data) return "";

                        const maxLen = 60; // Ajusta este número al gusto
                        const truncated = data.length > maxLen
                            ? data.substring(0, maxLen) + "..."
                            : data;

                        // Devolvemos un <span> con tooltip (por ejemplo usando title)
                        return `<span title="${data}">${truncated}</span>`;
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    render: () => ""
                }
            ]
        ;

        // Llamamos a useDataTable
        useDataTable({
            tableRef: tableRef,
            columns: columns,
            data: loading ? [] : protocolos, // Mientras loading = true, pasa []
            isFooter: true,
            isColumnHidden: true,
            isColumnHiddenClass: ".toggle-vis",
            isFilterColumn: true,
            rowCallback,    // <--- Pasamos aquí la callback
            order: [[2, "desc"]],  // Quiero ordenar por la 2da columna (fecha op)
            // ... resto de props
        });

        // 6) Delegar evento click en "Editar"
        useEffect(() => {
            const handleClick = function () {
                const rowData = $(this).data("row");
                const parsedRow = JSON.parse(rowData);
                handleOpenModal(parsedRow);
            };

            const $table = $(tableRef.current);
            $table.on("click", '[data-action="open-modal"]', handleClick);

            // Cleanup
            return () => {
                $table.off("click", '[data-action="open-modal"]', handleClick);
            };
        }, [protocolos]); // re-attach cuando cambien protocolos

        // 7) Render final
        if (loading) return <p>Cargando...</p>;
        if (error) return <p className="text-danger">{error}</p>;

        return (
            <div id="page_layout" className="cust-datatable">
                <Row>
                    <Col sm="12">
                        <Card>
                            <Card.Header className="d-flex justify-content-between">
                                <Card.Header.Title className="header-title">
                                    <h4 className="card-title">Protocolos Quirúrgicos</h4>
                                </Card.Header.Title>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <table ref={tableRef} className="table table-striped"/>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Modal */}
                <ModalProtocolos
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    rowData={selectedRow}
                />
            </div>
        );
    }
;

export default ProtocolosTable;