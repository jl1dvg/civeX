import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import Card from "../../components/Card";
import axios from "axios";

const EditDoctor = () => {
  const { id } = useParams(); // Capturar el ID del doctor desde la URL
  const [doctor, setDoctor] = useState(null); // Estado para los datos del doctor
  const [selectedFile, setSelectedFile] = useState(null); // Estado para la imagen seleccionada
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de errores

  // Obtener los datos del doctor desde el backend
  useEffect(() => {
    axios
      .get(`http://localhost:8000/auth/staff/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Incluye el token de acceso
        },
      })
      .then((response) => {
        setDoctor(response.data); // Asignar datos al estado
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los datos del doctor.");
        setLoading(false);
      });
  }, [id]);

  // Manejador para los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  // Manejador para el campo de archivo (imagen)
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Actualizar el estado con el archivo seleccionado
  };

  // Manejador para el envío del formulario
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append("first_name", doctor.first_name);
    formData.append("last_name", doctor.last_name);
    formData.append("email", doctor.email);
    formData.append("especialidad", doctor.especialidad);
    formData.append("subespecialidad", doctor.subespecialidad);

    if (selectedFile) {
      formData.append("profile_picture", selectedFile); // Agregar el archivo si se seleccionó
    }

    axios
      .put(`http://localhost:8000/auth/staff/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Incluye el token de acceso
        },
      })
      .then(() => {
        alert("Información actualizada correctamente.");
      })
      .catch((error) => {
        console.error("Error al actualizar:", error.response || error);
        alert(
          "Error al actualizar la información. Revisa los datos e intenta de nuevo."
        );
      });
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Row>
        <Tab.Container defaultActiveKey={"personal-information"}>
          <Col lg={12}>
            <Card>
              <Card.Body className="p-0">
                <div className="edit-list">
                  <Nav
                    as="ul"
                    className="edit-profile nav nav-pills list-inline mb-0 flex-md-row flex-column"
                    role="tablist"
                  >
                    <Col md={3} as="li" className="p-0">
                      <Nav.Link
                        className="nav-link py-4 text-center"
                        eventKey="personal-information"
                      >
                        Personal Information
                      </Nav.Link>
                    </Col>
                    <Col md={3} as="li" className="p-0">
                      <Nav.Link
                        className="nav-link  py-4 text-center"
                        eventKey="chang-pwd"
                      >
                        Change Password
                      </Nav.Link>
                    </Col>
                  </Nav>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12}>
            <div className="edit-list-data">
              <Tab.Content>
                <Tab.Pane className="fade show" eventKey="personal-information">
                  <Card>
                    <Card.Header className="d-flex justify-content-between">
                      <Card.Header.Title>
                        <h4 className="card-title">Personal Information</h4>
                      </Card.Header.Title>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleFormSubmit}>
                        <Row className="form-group align-items-center">
                          <Col md={12}>
                            <div className="profile-img-edit">
                              <img
                                className="profile-pic"
                                src={
                                  doctor.profile_picture ||
                                  "/assets/images/user/default.jpg"
                                }
                                alt="profile-pic"
                              />
                              <div className="p-image">
                                <i
                                  className="ri-pencil-line upload-button"
                                  onClick={() =>
                                    document
                                      .querySelector(".file-upload")
                                      .click()
                                  } // Simula un clic en el input
                                  style={{ cursor: "pointer" }} // Asegúrate de que el puntero sea de clic
                                ></i>
                                <input
                                  className="file-upload d-none"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row className="cust-form-input">
                          <Col sm={6} className="form-group">
                            <Form.Label htmlFor="first_name" className="mb-0">
                              First Name:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="my-2"
                              id="first_name"
                              name="first_name"
                              value={doctor.first_name || ""}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col sm={6} className="form-group">
                            <Form.Label htmlFor="last_name" className="mb-0">
                              Last Name:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="my-2"
                              id="last_name"
                              name="last_name"
                              value={doctor.last_name || ""}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col sm={6} className="form-group">
                            <Form.Label htmlFor="email" className="mb-0">
                              Email:
                            </Form.Label>
                            <Form.Control
                              type="email"
                              className="my-2"
                              id="email"
                              name="email"
                              value={doctor.email || ""}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col sm={6} className="form-group">
                            <Form.Label htmlFor="especialidad" className="mb-0">
                              Especialidad:
                            </Form.Label>
                            <Form.Control
                              as="select"
                              className="my-2"
                              id="especialidad"
                              name="especialidad"
                              value={doctor.especialidad || ""}
                              onChange={handleInputChange}
                            >
                              <option value="">
                                Seleccione una especialidad
                              </option>
                              <option value="Cirujano Oftalmólogo">
                                Cirujano Oftalmólogo
                              </option>
                              <option value="Anestesiólogo">
                                Anestesiólogo
                              </option>
                              <option value="Asistente">Asistente</option>
                              <option value="Enfermera">Enfermera</option>
                              <option value="Residente">Residente</option>
                              <option value="Optometra">Optometra</option>
                            </Form.Control>
                          </Col>

                          {doctor.especialidad === "Cirujano Oftalmólogo" && (
                            <Col sm={6} className="form-group">
                              <Form.Label
                                htmlFor="subespecialidad"
                                className="mb-0"
                              >
                                Subespecialidad:
                              </Form.Label>
                              <Form.Control
                                as="select"
                                className="my-2"
                                id="subespecialidad"
                                name="subespecialidad"
                                value={doctor.subespecialidad || ""}
                                onChange={handleInputChange}
                              >
                                <option value="">
                                  Seleccione una subespecialidad
                                </option>
                                {[
                                  "Córnea",
                                  "Glaucoma",
                                  "General",
                                  "Oculoplastia",
                                  "Oftalmopediatría",
                                  "Retina y Vítreo",
                                  "Segmento Anterior",
                                ]
                                  .sort() // Ordenar alfabéticamente
                                  .map((subespecialidad) => (
                                    <option
                                      key={subespecialidad}
                                      value={subespecialidad}
                                    >
                                      {subespecialidad}
                                    </option>
                                  ))}
                              </Form.Control>
                            </Col>
                          )}
                          <Col sm={12} className="form-group">
                            <Button
                              type="submit"
                              className="btn btn-primary-subtle mt-3"
                            >
                              Guardar Cambios
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Col>
        </Tab.Container>
      </Row>
    </>
  );
};

export default EditDoctor;
