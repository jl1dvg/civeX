// OperationsTable.jsx
import React, {useState, useEffect} from "react";
import {Table, Card} from "react-bootstrap";
import PDFProtocoloButton from "../buttons/PDFProtocoloButton.jsx";
import axios from "axios";

const OperationsTable = () => {
    const [protocolos, setProtocolos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProtocolos = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/protocolos/list/",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    }
                );
                setProtocolos(response.data);
            } catch (error) {
                console.error("Error al cargar los protocolos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProtocolos();
    }, []);

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center iq-new-appoinments">
                <Card.Header className="d-flex justify-content-between align-items-center iq-new-appoinments">
                    <h4>Operations</h4>
                </Card.Header>
            </Card.Header>
            <Card.Body className="pt-0">
                <div className="table-responsive">
                    <Table className="mb-0 table-borderless">
                        <thead>
                        <tr>
                            <th className="text-center">Patient Name</th>
                            <th className="text-center">Doctors Team</th>
                            <th className="text-center">Date Of Operation</th>
                            <th className="text-center">Report</th>
                            <th className="text-center">Diseases</th>
                            <th className="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Cargando...
                                </td>
                            </tr>
                        ) : protocolos.length > 0 ? (
                            protocolos.slice(0, 5).map((protocolo, index) => (
                                <tr key={index}>
                                    <td className="text-center">{protocolo.patient_name}</td>
                                    <td className="text-center">
                                        <div className="media-group text-center">
                                            {protocolo.doctors_team.map((doctor, idx) => (
                                                doctor.profile_picture ? (
                                                    <a href="#" className="media" key={idx}>
                                                        <img
                                                            className="img-fluid avatar-40 rounded-circle"
                                                            src={doctor.profile_picture}
                                                            alt={`Doctor ${idx + 1}`}
                                                            title={doctor.name} // Aquí mostramos el nombre como tooltip
                                                        />
                                                    </a>
                                                ) : null
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-center">{protocolo.operation_date}</td>
                                    <td className="text-center">
                                        <PDFProtocoloButton
                                            hcNumber={protocolo.hc_number}
                                            formId={protocolo.form_id}
                                        />
                                    </td>
                                    <td className="text-center">
                                        {Array.isArray(protocolo.disease)
                                            ? protocolo.disease.join(", ")
                                            : "N/A"}
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-link p-0">
                                            <i className="ri-edit-line font-size-16"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-danger">
                                    No se encontraron protocolos.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default OperationsTable;
