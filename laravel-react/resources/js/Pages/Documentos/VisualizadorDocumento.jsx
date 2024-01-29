import React, { useState } from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { usePage ,Link} from '@inertiajs/react';
import { Viewer,Worker,CharacterMap,ProgressBar, ZoomEvent } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import Head from '@inertiajs/react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import TitleTemplate from '@/Components/TitleTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,Pagination,
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from '@nextui-org/react';


const VisualizadorDocumento = ({auth}) => {
  const { documento } = usePage().props;
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [docAnexos,setDocAnexos]=useState([])

  const getDocuments = async () => {
    if (documento.id!==0){
      try {
        const response = await axios.get(`/api/documentos-anexos/${documento.id}`); // Cambia la ruta según tu configuración
        // console.log('Documentos obtenidos:', response.data);
        setDocAnexos(response.data.datos)
        // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    }
  }

  //aqui transformo el archivo base64 para mostrarl
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

  //necesario para poder descargar el archivo
  const link=`data:${documento.mime_file};base64,${documento.file}`
  const filename = documento.name_file+".pdf"

  //tabla
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;
  const pages = Math.ceil(docAnexos.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return docAnexos.slice(start, end);
  }, [page, docAnexos]);

  return (
    <Authenticated user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Visualizador</h2>}>
      <Head title="Visualizar" />
      <TitleTemplate>
        <div className='w-full flex justify-between'>
          <div>
              VisualizadorDocumento
          </div>
          <div className='align-items-center flex'>
            <Button color='primary' variant='ghost' onPress={onOpen}>Ver documentos anexos</Button>
          </div>
        </div>
      </TitleTemplate>
      <Modal size={"4xl"}  isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Documentos anexos</ModalHeader>
              <ModalBody>
                <Table  aria-label="Tabla documentos anexos" bottomContent={
                      <div className="flex w-full justify-center">
                        <Pagination isCompact showControls showShadow color="secondary"
                          page={page} total={pages} onChange={(page) => setPage(page)} />
                      </div>
                    }
                    classNames={{
                      wrapper: "min-h-[222px]",
                    }}>
                        <TableHeader>
                          <TableColumn>Numero de documento</TableColumn>
                          <TableColumn>Tipo de documento</TableColumn>
                          <TableColumn>Autor de documento</TableColumn>
                          <TableColumn>Fecha de documento</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Aún no hay documentos anexos"}>
                          {
                            docAnexos.map( (documento) => (
                              <TableRow key={documento.id}>
                                <TableCell>{documento.numero}</TableCell>
                                <TableCell>{documento.tipo}</TableCell>
                                <TableCell>{documento.autor_nombre} {documento.autor_apellido}</TableCell>
                                <TableCell>{documento.fecha}</TableCell>
                              </TableRow>
                            ) )
                          }
                         
                        </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ContentTemplate>
        <div className='px-40'>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
          <div className="rpv-core__viewer"
              style={{  border: '1px solid rgba(0, 0, 0, 0.3)', display: 'flex',
                  flexDirection: 'column', height: '100%', }} >
              <div style={{ alignItems: 'center', backgroundColor: '#eeeeee', borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                      display: 'flex', padding: '4px', }} >
                  <a download={filename} href={link} className='bg-primary-500 p-1 text-medium text-white '>Descarga aqui</a>
              </div>
              <div style={{ flex: 1, overflow: 'hidden', }} >
                <Viewer fileUrl={url} theme={{theme:'auto'}} renderLoader={(percentages) => (
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