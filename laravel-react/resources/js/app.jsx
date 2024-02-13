import './bootstrap';
import '../css/app.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import '@react-pdf-viewer/core/lib/styles/index.css';
// import 'primeflex/primeflex.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import {NextUIProvider} from "@nextui-org/react";
import { StrictMode, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import { PrimeReactProvider } from 'primereact/api';
import LoadingPage from './Layouts/LoadingPage';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);


        root.render(
            <StrictMode>
                <PrimeReactProvider >
                    <NextUIProvider>
                        <App {...props} />
                    {/* <App {...props} />  */}
                    </NextUIProvider>
                </PrimeReactProvider>
            </StrictMode>
            
        );
    },
    progress: {
        color: '#4B5563',
        // The delay after which the progress bar will appear, in milliseconds...
        delay: 250,


        // Whether to include the default NProgress styles...
        includeCSS: true,
        //QUEDE AQUI PARA MODIFICAR EL SPINNER
        // Whether the NProgress spinner will be shown...
        showSpinner: true,
    },
});
