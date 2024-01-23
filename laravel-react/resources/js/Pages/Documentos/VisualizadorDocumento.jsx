import React from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { usePage ,Link} from '@inertiajs/react';
import { Viewer,Worker,CharacterMap } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import TitleTemplate from '@/Components/TitleTemplate';
import ContentTemplate from '@/Components/ContentTemplate';


const VisualizadorDocumento = ({auth}) => {
  const { documento } = usePage().props;

  const base64toBlob = (data) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
  };
  const blob = base64toBlob(documento.file);
  const url = URL.createObjectURL(blob);


  const characterMap={
    isCompressed: true,
    // The url has to end with "/"
    url: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
  };
  console.log(documento)

  return (
    <Authenticated user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Visualizador</h2>}>
      <TitleTemplate>
        VisualizadorDocumento
      </TitleTemplate>
      <ContentTemplate>
        <div >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
            
            <Viewer fileUrl={url} />
    
          </Worker>
        </div>
      </ContentTemplate>
     
      
    </Authenticated>
  )
}
export default VisualizadorDocumento