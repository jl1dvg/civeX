import DefaultLayout from "../layouts/defaultLayout";
import BlankLayout from "../layouts/blank-layout";
import ProtectedRoute from "../components/ProtectedRoute";

// Importa los componentes necesarios
import Index from "../views";
import HospitalDashboardOne from "../views/dashboard-pages/hospital-dashboard-one";
import HospitalDashboardTwo from "../views/dashboard-pages/hospital-dashboard-two";
import PatientDashboard from "../views/dashboard-pages/patient-dashboard";
import Covid19Dashboard from "../views/dashboard-pages/covid-19-dashboard";
import Inbox from "../views/email/inbox";
import EmailCompose from "../views/email/email-compose";
import SignIn from "../views/auth/sign-in";
import SignUp from "../views/auth/sign-up";
import RecoverPassword from "../views/auth/recover-password";
import Error404 from "../views/extra-pages/pages-error-404";
import Error500 from "../views/extra-pages/pages-error-500";
import CommingSoon from "../views/extra-pages/pages-comingsoon";
import DoctorProfile from "../views/doctor/doctor-profile";
import EditDoctor from "../views/doctor/edit-doctor";
import DoctorList from "../views/doctor/doctor-list";
import {path} from "@amcharts/amcharts4/core";
import ProcedimientosPage from "../views/protocolos/ProcedimientosPage.jsx";
import ProtocolosTable from "../views/protocolos/ProtocolosList.jsx";
import EditarProcedimiento from "../views/protocolos/EditarProcedimiento.jsx";
import EditarEvolucion from "../views/protocolos/EditarEvolucion.jsx";
import EditarKardex from "../views/protocolos/EditarKardex.jsx";
import EditarInsumos from "../views/protocolos/EditarInsumos.jsx";
import PatientTable from "../views/patients/patients_list.jsx";

// Default Routes (Protegidas por el token de sesión)
export const DefaultRoute = [
    {
        path: "",
        element: (
            <ProtectedRoute>
                <DefaultLayout/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/",
                element: <Index/>,
            },
            {
                path: "/dashboard-pages/dashboard-1",
                element: <HospitalDashboardOne/>,
            },
            {
                path: "/dashboard-pages/dashboard-2",
                element: <HospitalDashboardTwo/>,
            },
            {
                path: "/dashboard-pages/patient-dashboard",
                element: <PatientDashboard/>,
            },
            {
                path: "/dashboard-pages/dashboard-4",
                element: <Covid19Dashboard/>,
            },
            {
                path: "/email/inbox",
                element: <Inbox/>,
            },
            {
                path: "/email/email-compose",
                element: <EmailCompose/>,
            },
            {
                path: "/doctor/doctor-profile/:id",
                element: <DoctorProfile/>,
            },
            {
                path: "doctor/edit-doctor/:id",
                element: <EditDoctor/>,
            },
            {
                path: "/doctor/doctor-list",
                element: <DoctorList/>,
            },
            {
                path: "/protocolos/ProcedimientosPage",
                element: <ProcedimientosPage/>,
            },
            {
                path: "/protocolos/ProtocolosList",
                element: <ProtocolosTable/>,
            },
            {
                path: "/protocolos/EditarProcedimiento/:id",
                element: <EditarProcedimiento/>
            },
            {
                path: "/protocolos/EditarEvolucion/:id",
                element: <EditarEvolucion/>
            },
            {
                path: "/protocolos/EditarKardex/:id",
                element: <EditarKardex/>
            },
            {
                path: "/protocolos/EditarInsumos/:id",
                element: <EditarInsumos/>
            },
            {
                path: "/patients/patients_list",
                element: <PatientTable/>
            }
        ],
    },
];

// Blank Layout Routes (No requieren autenticación)
export const BlankLayoutRouter = [
    {
        path: "",
        element: <BlankLayout/>,
        children: [
            {
                path: "/auth/sign-in",
                element: <SignIn/>,
            },
            {
                path: "/auth/sign-up",
                element: <SignUp/>,
            },
            {
                path: "/auth/recover-password",
                element: <RecoverPassword/>,
            },
            {
                path: "/extra-pages/pages-error-404",
                element: <Error404/>,
            },
            {
                path: "/extra-pages/pages-error-500",
                element: <Error500/>,
            },
            {
                path: "/extra-pages/pages-comingsoon",
                element: <CommingSoon/>,
            },
            // Agrega aquí más rutas públicas...
        ],
    },
];
