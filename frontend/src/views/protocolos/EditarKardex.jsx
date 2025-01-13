import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";

const EditarKardex = () => {
    const {id} = useParams(); // ID del procedimiento
    const navigate = useNavigate();

    const [medicamentos, setMedicamentos] = useState([]);
    const [opcionesMedicamentos, setOpcionesMedicamentos] = useState([]);
    const [vias, setVias] = useState([
        "INTRAVENOSA",
        "VIA INFILTRATIVA",
        "SUBCONJUNTIVAL",
        "TOPICA",
        "INTRAVITREA",
    ]);
    const [responsables, setResponsables] = useState([
        "Asistente",
        "Anestesiólogo",
        "Cirujano Principal",
    ]);

    const [error, setError] = useState(null);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener datos del Kardex
                const kardexResp = await axios.get(
                    `http://localhost:8000/plantillas/kardex/${id}/` // 'id' es ahora 'procedimiento_id'
                );
                setMedicamentos(kardexResp.data.medicamentos || []);

                // Obtener opciones de medicamentos
                const opcionesResp = await axios.get(
                    `http://localhost:8000/inventario/medicamentos/`
                );
                setOpcionesMedicamentos(opcionesResp.data || []);
            } catch (err) {
                console.error("Error al cargar los datos:", err.response || err);
                setError("Error al cargar los datos.");
            }
        };
        fetchData();
    }, [id]); // Asegúrate de que 'id' sea el procedimiento_id

    // Manejar cambios en una fila
    const handleInputChange = (index, field, value) => {
        const nuevosMedicamentos = [...medicamentos];
        nuevosMedicamentos[index][field] = value;
        setMedicamentos(nuevosMedicamentos);
    };

    // Agregar una nueva fila
    const handleAddRow = () => {
        setMedicamentos([
            ...medicamentos,
            {
                medicamento: "",
                dosis: "",
                frecuencia: "",
                via_administracion: "",
                responsable: "",
            },
        ]);
    };

    // Eliminar una fila
    const handleDeleteRow = (index) => {
        const nuevosMedicamentos = medicamentos.filter((_, i) => i !== index);
        setMedicamentos(nuevosMedicamentos);
    };

    // Guardar el Kardex
    const handleSave = async () => {
        try {
            await axios.put(
                `http://localhost:8000/plantillas/kardex/${id}/`,
                {medicamentos},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            navigate("/protocolos/ProcedimientosPage");
        } catch (err) {
            console.error(err);
            setError("Error al guardar el Kardex.");
        }
    };

    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2>Editar Kardex</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Medicamento</th>
                        <th>Dosis</th>
                        <th>Frecuencia</th>
                        <th>Vía de Administración</th>
                        <th>Responsable</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {medicamentos.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <select
                                    className="form-control"
                                    value={item.medicamento}
                                    onChange={(e) =>
                                        handleInputChange(index, "medicamento", e.target.value)
                                    }
                                >
                                    <option value="">Seleccione...</option>
                                    {opcionesMedicamentos.map((opcion, i) => (
                                        <option key={i} value={opcion.medicamento}>
                                            {opcion.medicamento}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={item.dosis}
                                    onChange={(e) =>
                                        handleInputChange(index, "dosis", e.target.value)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={item.frecuencia}
                                    onChange={(e) =>
                                        handleInputChange(index, "frecuencia", e.target.value)
                                    }
                                />
                            </td>
                            <td>
                                <select
                                    className="form-control"
                                    value={item.via_administracion}
                                    onChange={(e) =>
                                        handleInputChange(index, "via_administracion", e.target.value)
                                    }
                                >
                                    <option value="">Seleccione...</option>
                                    {vias.map((via, i) => (
                                        <option key={i} value={via}>
                                            {via}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    className="form-control"
                                    value={item.responsable}
                                    onChange={(e) =>
                                        handleInputChange(index, "responsable", e.target.value)
                                    }
                                >
                                    <option value="">Seleccione...</option>
                                    {responsables.map((responsable, i) => (
                                        <option key={i} value={responsable}>
                                            {responsable}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDeleteRow(index)}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={handleAddRow}
                                >
                                    Agregar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button className="btn btn-primary mt-3" onClick={handleSave}>
                    Guardar
                </button>
            </div>
        </div>
    );
};

export default EditarKardex;