import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import { Link } from "react-router-dom";
import axios from "axios";

// Images
import img12 from "/assets/images/user/12.jpg";
import img13 from "/assets/images/user/13.jpg";
import img14 from "/assets/images/user/14.jpg";
import img15 from "/assets/images/user/15.jpg";
import img16 from "/assets/images/user/16.jpg";
import img17 from "/assets/images/user/17.jpg";
import img18 from "/assets/images/user/18.jpg";

const DoctorList = () => {
  const [staffMembers, setStaffMembers] = useState([]); // Inicializar estado vacío
  const navigate = useNavigate(); // Inicializar `useNavigate`

  // Función para manejar el clic en una card
  const handleCardClick = (id) => {
    if (id) {
      navigate(`/doctor/doctor-profile/${id}`);
    } else {
      console.error("El ID del doctor no está definido");
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/staff/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setStaffMembers(response.data); // Actualiza los datos
      } catch (error) {
        console.error("Error al obtener el staff:", error);
      }
    };

    fetchStaff();
  }, []);

  return (
    <>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header className="card-header-custom d-flex justify-content-between p-4 mb-0 border-bottom-0">
              <Card.Header.Title>
                <h4 className="card-title">Doctors List</h4>
              </Card.Header.Title>
            </Card.Header>
          </Card>
        </Col>

        {staffMembers.map((doctor, index) => {
          return (
            <Fragment key={index}>
              <Col sm={6} md={3}>
                <Card>
                  <Card.Body className="text-center">
                    <div className="doc-profile">
                      <img
                        className="rounded-circle img-fluid avatar-80"
                        src={
                          doctor.profile_picture
                            ? doctor.profile_picture
                            : "/assets/images/user/default.jpg"
                        }
                        alt="profile"
                      />
                    </div>
                    <div className="doc-info mt-3">
                      <h4>
                        {doctor.first_name} {doctor.last_name}
                      </h4>
                      <p className="mb-0">{doctor.especialidad}</p>
                      <Link to="#">cive.ec</Link>
                    </div>
                    <div className="iq-doc-description mt-2">
                      <p className="mb-0">{doctor.subespecialidad}</p>
                    </div>
                    <div className="doc-social-info mt-3 mb-3">
                      <ul className="m-0 p-0 list-group list-group-horizontal justify-content-center">
                        <li className="list-group-item border-0 p-0">
                          <Link to="#">
                            <i className="ri-facebook-fill"></i>
                          </Link>
                        </li>
                        <li className="list-group-item border-0 p-0">
                          <Link to="#">
                            <i className="ri-twitter-fill"></i>
                          </Link>{" "}
                        </li>
                        <li className="list-group-item border-0 p-0">
                          <Link to="#">
                            <i className="ri-google-fill"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <Link
                      to={`/doctor/doctor-profile/${doctor.id}`}
                      className="btn btn-primary-subtle"
                    >
                      View Profile
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Fragment>
          );
        })}
      </Row>
    </>
  );
};

export default DoctorList;
