import React from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { usePage ,Link} from '@inertiajs/react';
import { Viewer,Worker,CharacterMap,ProgressBar, ZoomEvent } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import '@react-pdf-viewer/core/lib/styles/index.css';
import TitleTemplate from '@/Components/TitleTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import { Button } from '@nextui-org/react';


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

  const getFilePluginInstance = getFilePlugin();
  const { DownloadButton } = getFilePluginInstance;

  console.log(documento)
  const link=`data:${documento.mime_file};base64,${documento.file}`
  const filename = documento.name_file+".pdf"

  const handleZoom = (e) => {
    console.log(`Zoom to ${e.scale}`);
  };

  return (
    <Authenticated user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Visualizador</h2>}>
      <TitleTemplate>
        VisualizadorDocumento
      </TitleTemplate>
      <ContentTemplate>
        <div>
          
        </div>
        <div >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
          <div className="rpv-core__viewer"
              style={{  border: '1px solid rgba(0, 0, 0, 0.3)', display: 'flex',
                  flexDirection: 'column', height: '100%', }} >
              <div style={{ alignItems: 'center', backgroundColor: '#eeeeee', borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                      display: 'flex', padding: '4px', }} >
                  <a download={filename} href={link} className='bg-primary-500 p-1 text-medium text-white '>Descarga aqui</a>
              </div>
              <div style={{ flex: 1, overflow: 'hidden', }} >
                <Viewer fileUrl={url} theme={{theme:'auto'}} onZoom={handleZoom} renderLoader={(percentages) => (
                  <div style={{ width: '240px' }}>
                      <ProgressBar progress={Math.round(percentages)} />
                  </div>
                )} plugins={[getFilePluginInstance]}/>
              </div>
          </div>
            
    
          </Worker>
        </div>
      </ContentTemplate>
     
      
    </Authenticated>
  )
}
export default VisualizadorDocumento