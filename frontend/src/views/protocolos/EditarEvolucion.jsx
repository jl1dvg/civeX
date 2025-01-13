// src/views/protocolos/EditarEvolucion.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditarEvolucion = () => {
  const { id } = useParams(); // ID del procedimiento
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pre_evolucion: "",
    pre_indicacion: "",
    post_evolucion: "",
    post_indicacion: "",
    alta_evolucion: "",
    alta_indicacion: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar la evolución existente (si hay) al montar
  useEffect(() => {
    const fetchEvolucion = async () => {
      try {
        const resp = await axios.get(`http://localhost:8000/plantillas/evolucion/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        // Si la evolución existe, resp.data traerá los campos
        // Asignamos al estado
        setFormData({
          pre_evolucion: resp.data.pre_evolucion || "",
          pre_indicacion: resp.data.pre_indicacion || "",
          post_evolucion: resp.data.post_evolucion || "",
          post_indicacion: resp.data.post_indicacion || "",
          alta_evolucion: resp.data.alta_evolucion || "",
          alta_indicacion: resp.data.alta_indicacion || "",
        });
      } catch (err) {
        // Si no existe, vendrá 404 u otro error
        setError("No se encontró la evolución o error del servidor.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvolucion();
  }, [id]);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar / crear la evolución
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/plantillas/evolucion/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json"
          }
        }
      );
      // Redirigir de vuelta a la lista de procedimientos
      navigate("/protocolos/ProcedimientosPage");
    } catch (err) {
      console.error(err);
      setError("Error al guardar la evolución");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Editar Evolución</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Pre Evolución</label>
          <textarea
            className="form-control"
            name="pre_evolucion"
            rows="3"
            value={formData.pre_evolucion}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Pre Indicación</label>
          <textarea
            className="form-control"
            name="pre_indicacion"
            rows="3"
            value={formData.pre_indicacion}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Post Evolución</label>
          <textarea
            className="form-control"
            name="post_evolucion"
            rows="3"
            value={formData.post_evolucion}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Post Indicación</label>
          <textarea
            className="form-control"
            name="post_indicacion"
            rows="3"
            value={formData.post_indicacion}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Alta Evolución</label>
          <textarea
            className="form-control"
            name="alta_evolucion"
            rows="3"
            value={formData.alta_evolucion}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Alta Indicación</label>
          <textarea
            className="form-control"
            name="alta_indicacion"
            rows="3"
            value={formData.alta_indicacion}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default EditarEvolucion;
