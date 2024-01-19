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
import { StrictMode } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import { PrimeReactProvider } from 'primereact/api';

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
                    </NextUIProvider>
                </PrimeReactProvider>
            </StrictMode>
            
        );
    },
    progress: {
        color: '#4B5563',
    },
});
