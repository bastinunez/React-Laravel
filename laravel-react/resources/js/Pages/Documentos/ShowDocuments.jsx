import React, { useState, useEffect, createElement} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TitleTemplate from '@/Components/TitleTemplate';
import FilterTemplate from '@/Components/FilterTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import AppTable from '@/Components/Table';
import { usePage ,Link} from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import { usePermission } from '@/Composables/Permission';
import {Button, Pagination, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileEyeOutline, mdiFileDownloadOutline } from '@mdi/js';
import { document } from 'postcss';


const ShowDocuments = ({auth}) => {
  
  const {hasRoles,hasPermission} = usePermission()
  const { documentos } = usePage().props;

  const columnas = [
    {name: "ID", uid: "id", sortable: true},
    {name: "Numero", uid: "numero", sortable: true},
    {name: "Autor", uid: "autor", sortable: true},
    {name: "Fecha", uid: "fecha", sortable: true},
    {name: "Tipo", uid: "tipo"},
    {name: "Materia", uid: "materia"},
    {name: "Rut", uid: "rut"},
    {name: "Dirección", uid: "direccion", sortable: true},
    {name: "Archivo", uid: "name_file", sortable: true},
    {name: "Acciones", uid: "actions"},
  ];
  
  const download = (documento) => {
    const link=`data:${documento.mime_file};base64,${documento.file}`
    const filename = documento.name_file+".pdf"
    const downloadlink = createElement("a",{href:link,download:filename,clik:true})

    //QUEDE AQUI FALTA VER COMO DESCARGAR DOCUMENTO CON EL BOTON 

  }

  //Tabla
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(documentos.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return documentos.slice(start, end);
  }, [page, documentos]);
  
  return (
    <AuthenticatedLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documentos</h2>}>
      <div>
        <TitleTemplate>Documentos</TitleTemplate>
        <FilterTemplate>Aqui iran los filtros</FilterTemplate>
        <ContentTemplate>
          <div className='flex justify-between'>
            <div>
              <h1>Resultados</h1>
            </div>
            <div>
            <Link href={route('documento.create')}>
              <Button color="success" variant="bordered" >
                <i className="pi pi-plus" style={{ color: 'green' }}></i>
                 Agregar documento
              </Button>
            </Link>
            
            </div>

          </div>
          <div className='w-full'>
            <Table aria-label="Tabla documentos anexos" bottomContent={
                      <div className="flex w-full justify-center">
                        <Pagination sCompact showControls showShadow color="secondary" page={page}
                          total={pages} onChange={(page) => setPage(page)} />
                      </div>
                    }
                    classNames={{  wrapper: "min-h-[222px]", }}>
              <TableHeader>
                  {columnas.map((columna)=>(
                    <TableColumn className='text-start' key={columna.uid}>{columna.name}</TableColumn>
                  ))}
              </TableHeader>
              <TableBody emptyContent={"Aún no hay documentos"}>
                {
                  documentos.map((documento)=>(
                    <TableRow key={documento.id} className='text-start'>
                      <TableCell>{documento.id}</TableCell>
                      <TableCell>{documento.numero}</TableCell>
                      <TableCell>{documento.autor}</TableCell>
                      <TableCell>{documento.fecha}</TableCell>
                      <TableCell>{documento.tipo}</TableCell>
                      <TableCell className='overflow-hidden'>{documento.materia}</TableCell>
                      <TableCell>{documento.rut}</TableCell>
                      <TableCell>{documento.direccion}</TableCell>
                      <TableCell>{documento.name_file}</TableCell>
                      <TableCell>
                        <>
                        {
                          hasPermission('Visualizar documento')?
                          <>
                            <Button className="me-1" as={Link} size='sm' href={route('documento.visualizar',documento.id)} color='secondary'> 
                              {/* active={route().current('documento.visualizar')} */}
                              <Icon path={mdiFileEyeOutline} size={1} />
                              
                            </Button>
                          </>:
                          <></>
                        }{
                          hasPermission('Descargar documento')?
                          <>
                            <Button className="me-1" size='sm' onClick={() => download(documento)} color='primary'> 
                              {/* active={route().current('documento.visualizar')} */}
                              <Icon path={mdiFileDownloadOutline} size={1} />
                              
                            </Button>
                          </>:
                          <></>
                        }
                        
                      </></TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
          
          {/* <div className='p-2'>
            <AppTable datos={documentos} estados={estadosOpciones} columnas={columnas} visibles={columnasVisibles}></AppTable>
          </div> */}
          
        </ContentTemplate>
      </div>
      <div>
              
      </div>
    </AuthenticatedLayout>
    
  )
}

export default ShowDocuments
  {/* <DataTable lazy value={products} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}  tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} filters={lazyState.filters}>
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
           
            <Column field="code" header="Code" sortable filter filterPlaceholder="Search"></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column field="category" header="Category" sortable></Column>
            <Column field="quantity" header="Quantity" body={statusBodyTemplate} sortable></Column>
            <Column headerStyle={{ width: '4rem' }} ></Column>
            
          </DataTable> */}