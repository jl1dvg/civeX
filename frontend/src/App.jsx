import React, {Fragment} from "react";

// Redux Selector / Action
import {useDispatch} from "react-redux";

// Importa las acciones necesarias
import {setSetting} from "./store/setting/actions";

function App({children}) {
    const dispatch = useDispatch();

    // Configuración inicial de Redux
    dispatch(setSetting());

    return (
        <>
            <div className="App">
                {children} {/* Asegura que el resto del template funcione */}
            </div>
        </>
    );
}

export default App;