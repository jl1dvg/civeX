import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";

const EditarProcedimiento = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    // Estado para todos los campos, incluyendo "imagenFile" (donde guardaremos el File)
    const [formData, setFormData] = useState({
        cirugia: "",
        categoria: "",
        membrete: "",
        dieresis: "",
        exposicion: "",
        hallazgo: "",
        horas: "",
        operatorio: "",
        // Aquí no guardamos la ruta sino el "File" directamente
        imagenFile: null,
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lista de categorías para tu <select>
    const categorias = [
        "Catarata",
        "Conjuntiva",
        "Estrabismo",
        "Glaucoma",
        "Implantes secundarios",
        "Inyecciones",
        "Oculoplastica",
        "Refractiva",
        "Retina",
        "Traumatismo Ocular",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get(`http://127.0.0.1:8000/plantillas/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                const data = resp.data;

                // Llenamos el estado con los valores existentes del backend
                // OJO: en tu backend "imagen_link" es un ImageField, a menudo te devolverá la URL actual
                // Si deseas mostrar un preview, podrías guardarlo en un campo "imagenURL" distinto
                // Por ahora, lo dejamos en null (no subiremos nada a menos que el usuario cambie la imagen)
                setFormData({
                    cirugia: data.cirugia || "",
                    categoria: data.categoria || "",
                    membrete: data.membrete || "",
                    dieresis: data.dieresis || "",
                    exposicion: data.exposicion || "",
                    hallazgo: data.hallazgo || "",
                    horas: data.horas || "",
                    operatorio: data.operatorio || "",
                    imagenFile: null, // No guardamos la URL en "imagenFile"
                });
            } catch (e) {
                console.error(e);
                setError("Error al cargar el procedimiento");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Handler para inputs de texto
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    // Handler para el input file
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData((prev) => ({...prev, imagenFile: e.target.files[0]}));
        }
    };

    // Enviar PUT con FormData
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formToSend = new FormData();

            // Agregamos los campos de texto
            formToSend.append("cirugia", formData.cirugia);
            formToSend.append("categoria", formData.categoria);
            formToSend.append("membrete", formData.membrete);
            formToSend.append("dieresis", formData.dieresis);
            formToSend.append("exposicion", formData.exposicion);
            formToSend.append("hallazgo", formData.hallazgo);
            formToSend.append("horas", formData.horas);
            formToSend.append("operatorio", formData.operatorio);

            // Si el usuario subió un archivo nuevo, lo incluimos
            // NOTA: en tu serializer o modelo, el campo se llama "imagen_link"
            if (formData.imagenFile) {
                formToSend.append("imagen_link", formData.imagenFile);
            }

            await axios.put(`http://127.0.0.1:8000/plantillas/editar/${id}/`, formToSend, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/protocolos/ProcedimientosPage");
        } catch (err) {
            console.error(err);
            setError("Error al actualizar el procedimiento");
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Editar Procedimiento</h2>
            <form onSubmit={handleSubmit}>
                <section className="mb-4">
                    <h4 className="text-info">Requerido</h4>
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Nombre de Cirugía</label>
                                <input
                                    type="text"
                                    name="membrete"
                                    className="form-control"
                                    value={formData.membrete}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ejemplo de 2 campos en la misma row */}
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nombre Corto del Procedimiento</label>
                                <input
                                    type="text"
                                    name="cirugia"
                                    className="form-control"
                                    value={formData.cirugia}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Categoría</label>
                                <select
                                    name="categoria"
                                    className="form-select"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Selecciona una categoría
                                    </option>
                                    {categorias.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Siguiente row */}
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Dieresis</label>
                                <input
                                    type="text"
                                    name="dieresis"
                                    className="form-control"
                                    value={formData.dieresis}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Exposición</label>
                                <input
                                    type="text"
                                    name="exposicion"
                                    className="form-control"
                                    value={formData.exposicion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ... y así con los demás campos */}
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Hallazgos</label>
                                <input
                                    type="text"
                                    name="hallazgo"
                                    className="form-control"
                                    value={formData.hallazgo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Horas</label>
                                <input
                                    type="text"
                                    name="horas"
                                    className="form-control"
                                    value={formData.horas}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-4">
                    <h4 className="text-info">Operatorio</h4>
                    <hr/>
                    <div className="form-group">
                        <label htmlFor="operatorio">Operatorio</label>
                        <textarea
                            id="operatorio"
                            name="operatorio"
                            className="form-control"
                            rows="10"
                            value={formData.operatorio}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Campo para subir la imagen */}
                    <div className="form-group mt-3">
                        <label>Imagen (opcional)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </section>

                <button type="submit" className="btn btn-primary mt-4">
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
};

export default EditarProcedimiento;