// ImageUploader.jsx
import React from "react";

const ImageUploader = ({value, onChange}) => {

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("http://localhost:8000/plantillas/upload/", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    // data.imageUrl = "/media/uploads/loquesea.jpg"
                    onChange(data.imageUrl);
                } else {
                    const errData = await response.json();
                    console.error("Error al subir la imagen:", errData);
                }
            } catch (error) {
                console.error("Error al procesar la solicitud:", error);
            }
        }
    };

    return (
        <div className="form-group">
            <label>Imagen</label>
            {/* El input para subir archivo directamente */}
            <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileUpload}
            />
            {/* Podemos mostrar un preview si 'value' tiene algo */}
            {value && <p className="mt-2">Ruta actual: {value}</p>}
        </div>
    );
};

export default ImageUploader;