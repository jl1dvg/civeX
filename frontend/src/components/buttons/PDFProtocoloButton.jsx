import React from "react";
import axios from "axios";

const PDFProtocoloButton = ({hcNumber, formId}) => {
    const handleDownloadPDF = async (hc_number, form_id) => {
        console.log("Botón clickeado. hc_number:", hc_number, "form_id:", form_id); // Verifica que estos valores sean correctos

        try {
            const response = await axios.get(
                `http://localhost:8000/protocolos/generate_pdf_data/?hc_number=${hc_number}&form_id=${form_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    responseType: "blob", // Para manejar archivos PDF como blob
                }
            );

            console.log("Respuesta recibida:", response); // Asegúrate de que obtienes datos

            const pdfBlob = new Blob([response.data], {type: "application/pdf"});
            const pdfUrl = window.URL.createObjectURL(pdfBlob);

            // Abrir el PDF en una nueva pestaña
            const newWindow = window.open();
            if (newWindow) {
                newWindow.location.href = pdfUrl;
            } else {
                console.error("No se pudo abrir la nueva pestaña. Verifica los bloqueadores de ventanas emergentes.");
            }
        } catch (error) {
            console.error("Error al descargar el PDF:", error);
        }
    };

    return (
        <button
            className="btn btn-link p-0 me-2"
            onClick={() => handleDownloadPDF(hcNumber, formId)}
        >
            <i className="ri-file-pdf-line font-size-16 text-danger"/>
        </button>
    );
};

export default PDFProtocoloButton;