import React, { useEffect, useState } from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { usePage ,Link} from '@inertiajs/react';
import { Viewer,Worker,LoadError,ProgressBar } from '@react-pdf-viewer/core';
import { zoomPlugin,RenderCurrentScaleProps, RenderZoomInProps, RenderZoomOutProps,} from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin, RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import {Head} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import '@react-pdf-viewer/core/lib/styles/index.css';
import TitleTemplate from '@/Components/TitleTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,Pagination,
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from '@nextui-org/react';
import { Transform } from '@/Composables/Base64toBlob';
// Import styles
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import Icon from '@mdi/react';
import { mdiTrayArrowDown,mdiMagnifyPlusOutline,mdiMagnifyMinusOutline } from '@mdi/js';


const VisualizadorDocumento = ({auth}) => {
  const { documento } = usePage().props;
  
  //PERMISOS
  const {hasRoles,hasPermission} = usePermission()

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [docAnexos,setDocAnexos]=useState([])

  const getDocuments = async () => {
    if (documento.id!==0){
      try {
        const response = await axios.get(`/api/documentos-anexos/${documento.id}`); // Cambia la ruta según tu configuración
        //console.log('Documentos obtenidos:', response.data.datos);
        setDocAnexos(response.data.datos)
        // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    }
  }

  //aqui transformo el archivo base64 para mostrarl
  const zoomPluginInstance = zoomPlugin();
  const { CurrentScale, ZoomIn, ZoomOut } = zoomPluginInstance;
  const {url,link,filename} = Transform(documento.file,documento.mime_file,documento.name_file)

  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { CurrentPageInput, GoToFirstPageButton, GoToLastPageButton, GoToNextPageButton, GoToPreviousPage } =
      pageNavigationPluginInstance;
  
  //tabla
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;
  const pages = Math.ceil(docAnexos.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return docAnexos.slice(start, end);
  }, [page, docAnexos]);

  useEffect(()=>{
    getDocuments()
  },[])

  const renderError = (error) => {
    let message = '';
    switch (error.name) {
        case 'InvalidPDFException':
            message = 'El documento es inválido o corrompido';
            break;
        case 'MissingPDFException':
            message = 'No se encuentra el documento';
            break;
        case 'UnexpectedResponseException':
            message = 'Error inesperado del servidor';
            break;
        default:
            message = 'No se puede cargar el documento';
            break;
    }
    return (
      <div
          style={{
              alignItems: 'center',
              border: '1px solid rgba(0, 0, 0, 0.3)',
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
          }}
      >
          <div
              style={{
                  backgroundColor: '#e53e3e',
                  borderRadius: '0.25rem',
                  color: '#fff',
                  padding: '0.5rem',
              }}
          >
              {message}
          </div>
      </div>
    );
  }
  return (
    <Authenticated user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Visualizador</h2>}>
      <Head title="Visualizar" />
      <TitleTemplate>
        <div className='w-full lg:flex justify-between'>
          <div>
              Visualizador Documento
          </div>
          {
            hasPermission('Ver documentos anexos')?
            <>
              <div className='align-items-center flex'>
                <Button color='primary' variant='ghost' onPress={onOpen}>Ver documentos anexos</Button>
              </div>
            </>
            :<></>
          }
          
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
                          <TableColumn>Acción</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Aún no hay documentos anexos"}>
                          {
                            docAnexos.map( (documento) => (
                              <TableRow key={documento.id}>
                                <TableCell>{documento.numero}</TableCell>
                                <TableCell>{documento.tipo}</TableCell>
                                <TableCell>{documento.autor_nombre} {documento.autor_apellido}</TableCell>
                                <TableCell>{documento.fecha}</TableCell>
                                <TableCell>
                                {
                                    hasPermission('Visualizar documento') && documento.file && documento.estado=="Habilitado"?
                                    <>
                                      <Tooltip content={"Visualizar"} color='secondary'>
                                        <Link href={route('documento.visualizar',documento.id)} >
                                          <Button className="me-1" size='sm'  color='secondary' variant='flat'> 
                                            {/* active={route().current('documento.visualizar')} */}
                                            <Icon path={mdiFileEyeOutline} size={1} />
                                          </Button>
                                        </Link>
                                      </Tooltip>
                                      
                                    </>:<></>
                                  }{
                                    hasPermission('Descargar documento') && documento.file && documento.estado=="Habilitado"?
                                    <>
                                      <Tooltip content={"Descargar"} color='primary'>
                                        <a download={documento.name_file+".pdf"} href={`data:${documento.mime_file};base64,${documento.file}`}>
                                            <Button className="me-1" size='sm' color='primary' variant='flat'> 
                                              {/* active={route().current('documento.visualizar')} */}
                                              <Icon path={mdiFileDownloadOutline} size={1} />
                                              
                                            </Button>
                                          </a>
                                      </Tooltip>
                                    </>:
                                    <></>
                                  }
                                </TableCell>
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
        <div className='justify-center lg:px-72'>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
          <div className="rpv-core__viewer" 
          style={{  border: '1px solid rgba(0, 0, 0, 0.3)', display: 'flex', 
          flexDirection: 'column', height: '100%'}} >
              <div className='justify-between' style={{ alignItems: 'center', backgroundColor: '#eeeeee', borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                      display: 'flex', padding: '4px', }} >
                  {
                    hasPermission('Descargar documento') && documento.file?
                    <>
                      <a download={filename} href={link} className=''>
                        <Button startContent={<Icon path={mdiTrayArrowDown} size={1} />}>
                            <p className='md:flex hidden'>
                              Descarga aqui
                            </p>
                        </Button>
                      </a>
                    </>
                    :<></>
                  }

                  <div className='hidden md:flex'>
                    <div style={{ padding: '0px 2px' }}>
                        <GoToFirstPageButton />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <GoToPreviousPage />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <CurrentPageInput />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <GoToNextPageButton />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <GoToLastPageButton />
                    </div>
                  </div>
                
                  <div className='flex items-center'>
                    <ZoomOut>
                      {(props) => (
                          <Button isIconOnly startContent={<Icon path={mdiMagnifyMinusOutline} size={1} />}
                              style={{
                                  backgroundColor: '#357edd',
                                  border: 'none',
                                  borderRadius: '4px',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  padding: '8px',
                              }}
                              onClick={props.onClick}
                          >
                          </Button>
                      )}
                    </ZoomOut>
                    <div style={{ padding: '0px 2px' }}>
                      <CurrentScale>
                        {(props) => <>{`${Math.round(props.scale * 100)}%`}</>}
                      </CurrentScale>
                    </div>
                    <ZoomIn>
                      {(props) => (
                          <Button isIconOnly startContent={<Icon path={mdiMagnifyPlusOutline} size={1} />}
                              style={{
                                  backgroundColor: '#357edd',
                                  border: 'none',
                                  borderRadius: '4px',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  padding: '8px',
                              }}
                              onClick={props.onClick}
                          >
                          </Button>
                      )}
                    </ZoomIn>
                  </div>
                  
              </div>
              <div style={{ height: '750px' }}
              //style={{ flex: 1, overflow: 'hidden', }} 
              >
                <Viewer  fileUrl={url} plugins={[zoomPluginInstance,pageNavigationPluginInstance]} 
                //defaultScale={0.8} renderError={renderError} 
                />
              </div>
          </div>
            
    
          </Worker>
        </div>
      </ContentTemplate>
     
      
    </Authenticated>
  )
}
export default VisualizadorDocumento