import React,{useState} from 'react';


const LoadingPage = () => {

    const [loading, setLoading] = useState(false);

    // Configura un listener para manejar el cambio de estado de carga
    Inertia.on('start', () => setLoading(true));
    Inertia.on('finish', () => setLoading(false));
    
    return (
        <div className="loading-page">
      {loading ? <h1>Loading...</h1> : null}
      {/* Agrega aquí cualquier otro contenido que desees mostrar durante la carga */}
    </div>
    );
};

export default LoadingPage;