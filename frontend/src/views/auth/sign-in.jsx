import React, {useState, useEffect} from "react";
import {
    Carousel,
    Container,
    Row,
    Col,
    Form,
    FormControl,
} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

// Función para generar rutas de recursos
const generatePath = (path) => {
    return window.origin + import.meta.env.BASE_URL + path;
};

const SignIn = () => {
    const [formData, setFormData] = useState({
        username: "", // Cambiado a username
        password: "",
    });
    const [error, setError] = useState(""); // Estado para mostrar errores
    const [loginMessage, setLoginMessage] = useState(""); // Estado para el mensaje desde Django
    const navigate = useNavigate(); // Hook para redireccionar

    // Obtener datos de la API de prueba en Django
    useEffect(() => {
        const BASE_URL = "https://sistema.consulmed.me";
        axios
            .get(`${BASE_URL}/api/apache-test/api/login-data/`)
            .then((response) => {
                setLoginMessage(response.data.message); // Establece el mensaje recibido
            })
            .catch((error) => {
                console.error("Error fetching data from Django:", error);
            });
    }, []);

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        try {
            // Enviar solicitud al backend
            const response = await axios.post("http://127.0.0.1:8000/auth/login/", {
                username: formData.username, // Se usa `username` en lugar de `email`
                password: formData.password,
            });

            // Extraer tokens de la respuesta
            const {access, refresh} = response.data;

            // Guardar tokens en localStorage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Redirigir al usuario después del inicio de sesión exitoso
            navigate("/dashboard-pages/dashboard-1");
        } catch (err) {
            // Mostrar mensaje de error si el inicio de sesión falla
            setError("Invalid username or password. Please try again.");
        }
    };

    return (
        <>
            <section className="sign-in-page d-md-flex align-items-center custom-auth-height">
                <Container className="sign-in-page-bg mt-5 mb-md-5 mb-0 p-0">
                    <Row>
                        <Col md={6} className="text-center z-2">
                            <div className="sign-in-detail text-white">
                                <Link to="/" className="sign-in-logo mb-2">
                                    <img
                                        src={generatePath("/assets/images/logo-white.png")}
                                        className="img-fluid"
                                        alt="Logo"
                                    />
                                </Link>
                                <Carousel
                                    id="carouselExampleCaptions"
                                    interval={4000}
                                    controls={false}
                                >
                                    <Carousel.Item>
                                        <img
                                            src={generatePath("/assets/images/login/1.png")}
                                            className="d-block w-100"
                                            alt="Slide 1"
                                        />
                                        <div className="carousel-caption-container">
                                            <h4 className="mb-1 mt-3 text-white">
                                                Manage your orders
                                            </h4>
                                            <p className="pb-5">
                                                It is a long established fact that a reader will be
                                                distracted by the readable content.
                                            </p>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            src={generatePath("/assets/images/login/2.png")}
                                            className="d-block w-100"
                                            alt="Slide 2"
                                        />
                                        <div className="carousel-caption-container">
                                            <h4 className="mb-1 mt-3 text-white">
                                                Manage your orders
                                            </h4>
                                            <p className="pb-5">
                                                It is a long established fact that a reader will be
                                                distracted by the readable content.
                                            </p>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            src={generatePath("/assets/images/login/3.png")}
                                            className="d-block w-100"
                                            alt="Slide 3"
                                        />
                                        <div className="carousel-caption-container">
                                            <h4 className="mb-1 mt-3 text-white">
                                                Manage your orders
                                            </h4>
                                            <p className="pb-5">
                                                It is a long established fact that a reader will be
                                                distracted by the readable content.
                                            </p>
                                        </div>
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                        </Col>
                        <Col md={6} className="position-relative z-2">
                            <div className="sign-in-from d-flex flex-column justify-content-center">
                                <h1 className="mb-0">Sign In</h1>
                                {loginMessage && (
                                    <p className="alert alert-success">{loginMessage}</p>
                                )}
                                <Form className="mt-4" onSubmit={handleSubmit}>
                                    <p>Enter your username and password to access admin panel.</p>
                                    <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <FormControl
                                            type="text"
                                            name="username"
                                            className="form-control"
                                            id="username"
                                            placeholder="Enter username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between form-group mb-0">
                                        <label htmlFor="password">Password</label>
                                        <Link to="/auth/recover-password" className="float-end">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <FormControl
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <div className="d-flex w-100 justify-content-between align-items-center mt-3">
                                        <label className="d-inline-block form-group mb-0 d-flex">
                                            <input
                                                type="checkbox"
                                                id="customCheck1"
                                                className="custom-control-input me-1"
                                            />
                                            <label
                                                className="custom-control-label"
                                                htmlFor="customCheck1"
                                            >
                                                Remember Me
                                            </label>
                                        </label>
                                        <button
                                            type="submit"
                                            className="btn btn-primary-subtle float-end"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                    {error && <p className="text-danger mt-3">{error}</p>}
                                    <div
                                        className="sign-info d-flex justify-content-between flex-column flex-lg-row align-items-center">
                    <span className="dark-color d-inline-block line-height-2">
                      Don&apos;t have an account?{" "}
                        <Link to="/auth/sign-up">Sign Up</Link>
                    </span>
                                        <ul className="auth-social-media">
                                            <li>
                                                <a href="#">
                                                    <i className="ri-facebook-box-line"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <i className="ri-twitter-line"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <i className="ri-instagram-line"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default SignIn;
