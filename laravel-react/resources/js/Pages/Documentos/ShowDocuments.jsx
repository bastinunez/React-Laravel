import React, { useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TitleTemplate from '@/Components/TitleTemplate';
import FilterTemplate from '@/Components/FilterTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import AppTable from '@/Components/Table';
import { usePage ,Link} from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import { usePermission } from '@/Composables/Permission';
import {Button, link} from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileEyeOutline, mdiFileDownloadOutline } from '@mdi/js';


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
  
  const estadosOpciones = [
    {name: "Habilitado", uid: "habilitado"},
    {name: "Anulado", uid: "anulado"},
  ];
  const columnasVisibles = ["Numero", "Autor", "Fecha", "Tipo","Rut","Dirección","Acciones"];
  
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
            <table className='w-full'>
              <thead>
                <tr >
                  {columnas.map((columna)=>(
                    <th className='text-start' key={columna.uid}>{columna.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {
                  documentos.map((documento)=>(
                    <tr key={documento.id} className='text-start'>
                      <td>{documento.id}</td>
                      <td>{documento.numero}</td>
                      <td>{documento.autor}</td>
                      <td>{documento.fecha}</td>
                      <td>{documento.tipo}</td>
                      <td className='overflow-hidden'>{documento.materia}</td>
                      <td>{documento.rut}</td>
                      <td>{documento.direccion}</td>
                      <td>{documento.name_file}</td>
                      <td><>
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
                            <Button className="me-1" size='sm' href={route('documento.descargar',documento.id)} color='primary'> 
                              {/* active={route().current('documento.visualizar')} */}
                              <Icon path={mdiFileDownloadOutline} size={1} />
                              
                            </Button>
                          </>:
                          <></>
                        }
                        
                      </></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
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