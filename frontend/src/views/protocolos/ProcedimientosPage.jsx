import React, {useEffect, useState, Fragment} from "react";
import axios from "axios";
import {Row, Col, ProgressBar, Button, Badge, Table, Dropdown, ListGroup} from "react-bootstrap";
import Card from "../../components/Card";
import {Link} from "react-router-dom";


const ProcedimientosPage = () => {
    const [procedimientos, setProcedimientos] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProcedimientos = async () => {
            try {
                const response = await axios.get("http://localhost:8000/plantillas/categorias/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                setProcedimientos(response.data);
            } catch (error) {
                console.error("Error al cargar los procedimientos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProcedimientos();
    }, []);

    if (loading) {
        return <div className="text-center mt-5">Cargando...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="content-header">
                <h3 className="page-title">Editor de Protocolos</h3>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="#"><i className="mdi mdi-home-outline"></i></a>
                    </li>
                    <li className="breadcrumb-item active">Editor de Protocolos</li>
                </ol>
            </div>

            <section className="content">
                <Row>
                    {Object.entries(procedimientos).map(([categoria, procedimientosList], index) => (
                        <Col sm={12} key={index}>
                            <Card className="mb-4">
                                <Card.Header>
                                    <h4 className="card-title text-primary">{categoria}</h4>
                                </Card.Header>

                                <Card.Body>
                                    {/* Ajusta la altura y el overflow a tu gusto */}
                                    <ListGroup variant="flush" className="my-scrollbar"
                                               style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        {procedimientosList.map((procedimiento) => (
                                            <ListGroup.Item
                                                key={procedimiento.id}
                                                className="d-flex justify-content-between align-items-center p-0 mb-4 border-0"
                                            >
                                                {/* Parte izquierda: avatar e info */}
                                                <div className="d-flex align-items-center p-2">
                                                    <img
                                                        src={procedimiento.imagen_link || "/assets/images/default.jpg"}
                                                        alt={procedimiento.cirugia}
                                                        className="rounded-circle avatar-40"
                                                        style={{objectFit: 'cover'}}
                                                    />
                                                    <div className="ms-3">
                                                        <h6 className="mb-1">{procedimiento.membrete}</h6>
                                                        <p className="mb-0 text-muted">{procedimiento.cirugia}</p>
                                                    </div>
                                                </div>

                                                {/* Parte derecha: dropdown con opciones */}
                                                <Dropdown className="pe-3">
                                                    <Dropdown.Toggle
                                                        variant="link"
                                                        id={`dropdown-procedimiento-${procedimiento.id}`}
                                                        className="text-decoration-none text-gray"
                                                    >
                                                        <i className="ri-more-2-line"/>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item as={Link}
                                                                       to={`/protocolos/EditarProcedimiento/${procedimiento.id}`}>
                                                            <i className="ri-eye-line me-2"></i>Procedimiento
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as={Link}
                                                                       to={`/protocolos/EditarEvolucion/${procedimiento.id}`}>
                                                            <i className="ri-edit-box-line me-2"></i>Evolución
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as={Link}
                                                                       to={`/protocolos/EditarKardex/${procedimiento.id}`}>
                                                            <i className="ri-capsule-line me-2"></i>Kardex
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as={Link}
                                                                       to={`/protocolos/EditarInsumos/${procedimiento.id}`}>
                                                            <i className="ri-syringe-line me-2"></i>Insumos
                                                        </Dropdown.Item>
                                                        <Dropdown.Divider/>
                                                        <Dropdown.Item
                                                            href={`/protocolos/delete/${procedimiento.id}`}
                                                            className="text-danger"
                                                        >
                                                            <i className="ri-delete-bin-line me-2"></i>Eliminar
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>

                                    {/* Si quieres un botón de acción global al final de cada categoría */}
                                    {/* <Link to="#" className="btn btn-primary-subtle d-block mt-3">
                  <i className="ri-add-line"></i> Ver Todos
                </Link> */}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
};

export default ProcedimientosPage;