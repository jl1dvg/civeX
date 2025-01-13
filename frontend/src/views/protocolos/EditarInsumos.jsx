import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";

const EditarInsumos = () => {
    const {id} = useParams(); // ID del procedimiento
    const navigate = useNavigate();

    const [insumos, setInsumos] = useState({
        equipos: [],
        anestesia: [],
        quirurgicos: [],
    });
    const [opcionesInsumos, setOpcionesInsumos] = useState({});
    const [error, setError] = useState(null);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const insumosResp = await axios.get(`http://localhost:8000/plantillas/insumos/${id}/`);
                setInsumos(insumosResp.data.insumos || {});

                const opcionesResp = await axios.get(`http://localhost:8000/plantillas/insumos-disponibles/`);
                setOpcionesInsumos(opcionesResp.data || {});
            } catch (err) {
                console.error(err);
                setError("Error al cargar los datos.");
            }
        };
        fetchData();
    }, [id]);

    // Manejar cambios en una fila
    const handleInputChange = (categoria, index, field, value) => {
        const nuevosInsumos = {...insumos};

        // Si se cambia la categoría
        if (field === "categoria") {
            const nuevoItem = {nombre: "", cantidad: 1}; // Reinicia el nombre y cantidad
            nuevosInsumos[value] = nuevosInsumos[value] || []; // Asegura que la nueva categoría exista
            nuevosInsumos[value].push(nuevoItem); // Agrega el nuevo item a la nueva categoría
            nuevosInsumos[categoria].splice(index, 1); // Elimina el item de la categoría antigua
        } else {
            nuevosInsumos[categoria][index][field] = value; // Actualiza el campo correspondiente
        }

        setInsumos(nuevosInsumos);
    };

    // Agregar una nueva fila
    const handleAddRow = (categoria) => {
        const nuevosInsumos = {...insumos};
        nuevosInsumos[categoria].push({nombre: "", cantidad: 1});
        setInsumos(nuevosInsumos);
    };

    // Eliminar una fila
    const handleDeleteRow = (categoria, index) => {
        const nuevosInsumos = {...insumos};
        nuevosInsumos[categoria] = nuevosInsumos[categoria].filter((_, i) => i !== index);
        setInsumos(nuevosInsumos);
    };

    // Guardar los insumos
    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8000/plantillas/insumos/${id}/`, {insumos});
            navigate("/protocolos/ProcedimientosPage");
        } catch (err) {
            console.error(err);
            setError("Error al guardar los insumos.");
        }
    };

    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2>Editar Insumos</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Nombre del Insumo</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(insumos).map(([categoria, items]) =>
                        items.map((item, index) => (
                            <tr key={`${categoria}-${index}`}>
                                <td>
                                    <select
                                        className="form-control"
                                        value={categoria}
                                        onChange={(e) =>
                                            handleInputChange(categoria, index, "categoria", e.target.value)
                                        }
                                    >
                                        <option value="">Seleccione...</option>
                                        {Object.keys(opcionesInsumos).map((cat, i) => (
                                            <option key={i} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        className="form-control"
                                        value={item.nombre}
                                        onChange={(e) =>
                                            handleInputChange(categoria, index, "nombre", e.target.value)
                                        }
                                    >
                                        <option value="">Seleccione...</option>
                                        {opcionesInsumos[categoria]?.map((opcion, i) => (
                                            <option key={i} value={opcion}>
                                                {opcion}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            handleInputChange(categoria, index, "cantidad", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => handleDeleteRow(categoria, index)}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleAddRow(categoria)}
                                    >
                                        Agregar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <button className="btn btn-primary mt-3" onClick={handleSave}>
                    Guardar
                </button>
            </div>
        </div>
    );
};

export default EditarInsumos;