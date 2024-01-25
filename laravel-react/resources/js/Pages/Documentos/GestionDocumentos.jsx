import React, { useState, useEffect, createElement, useMemo, useCallback} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TitleTemplate from '@/Components/TitleTemplate';
import FilterTemplate from '@/Components/FilterTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import AppTable from '@/Components/Table';
import { usePage ,Link} from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import { usePermission } from '@/Composables/Permission';
import {Button, Pagination, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  RadioGroup, Radio,Input,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu, Chip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip,}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileEyeOutline, mdiFileDownloadOutline, mdiPencilBoxOutline,mdiMagnify,mdiChevronDown,mdiPlus, mdiCancel, mdiCheckUnderline} from '@mdi/js';
import { Calendar } from 'primereact/calendar';
import Select from '@/Components/Select';
import JSZip from "jszip";
import { saveAs } from "save-as";
// import { saveAs } from 'file-saver';

const GestionDocumentos = ({auth}) => {
  //PERMISOS
  const {hasRoles,hasPermission} = usePermission()
  //VARIABLES QUE ENTREGA EL CONTROLADOR
  const { documentos,direcciones, tipos,autores,estados } = usePage().props;
  //MODAL
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [sinArchivos,setSinArchivos] = useState([])

  //TABLA Y FILTROS
  //Filtros
  const [seleccion, setSeleccion] = useState([]);
  const [filterNumero,setFilterNumero] = useState('');
  const [filterMateria,setFilterMateria] = useState('');
  const [filterRut,setFilterRut] = useState('');
  const [filterFecha,setFilterFecha] = useState('');
  const hasSearchFilterNumero = Boolean(filterNumero);
  const hasSearchFilterMateria = Boolean(filterMateria);
  const hasSearchFilterRut = Boolean(filterRut);
  const [tipoFilter, setTipoFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [direccionFilter, setDireccionFilter] = useState("all");
  const [autorFilter, setAutorFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "fecha",
    direction: "ascending",
  });

  //Tabla

  const filteredItems = useMemo(() => {
    let filteredDocumentos = [...documentos];
    if (hasSearchFilterNumero) {
      filteredDocumentos = filteredDocumentos.filter((documento) => documento.numero == parseInt(filterNumero));
    }
    if (hasSearchFilterMateria) {
      filteredDocumentos = filteredDocumentos.filter((documento) => documento.materia == filterMateria);
    }
    if (hasSearchFilterRut) {
      filteredDocumentos = filteredDocumentos.filter((documento) => documento.rut == filterRut);
    }
    if (filterFecha){
      filteredDocumentos = filteredDocumentos.filter((documento) => {
        const fecha_doc = new Date(documento.fecha);
        return fecha_doc >= filterFecha[0] && fecha_doc <= filterFecha[1]
      });
    }
    if (estadoFilter !== "all" && Array.from(estadoFilter).length !== estados.length) {
      let arrayEstado =  new Set([...estadoFilter].map(numero => {
          const matchingItem = estados.find(item => item.id === parseInt(numero));
          return matchingItem ? matchingItem.nombre : null;
        }).filter(nombre => nombre !== null));
      filteredDocumentos = filteredDocumentos.filter((documento) =>
        Array.from(arrayEstado).includes(documento.estado),
      );
    }
    if (tipoFilter !== "all" && Array.from(tipoFilter).length !== tipos.length) {
      let arrayTipo =  new Set([...tipoFilter].map(numero => {
          const matchingItem = tipos.find(item => item.id === parseInt(numero));
          return matchingItem ? matchingItem.nombre : null;
        }).filter(nombre => nombre !== null));
      filteredDocumentos = filteredDocumentos.filter((documento) =>
        Array.from(arrayTipo).includes(documento.tipo),
      );
    }
    if (direccionFilter !== "all" && Array.from(direccionFilter).length !== direcciones.length) {
      let arrayDireccion =  new Set([...direccionFilter].map(numero => {
          const matchingItem = direcciones.find(item => item.id === parseInt(numero));
          return matchingItem ? matchingItem.nombre : null;
        }).filter(nombre => nombre !== null));
      
      filteredDocumentos = filteredDocumentos.filter((documento) =>
        Array.from(arrayDireccion).includes(documento.direccion),
      );
    }
    if (autorFilter !== "all" && Array.from(autorFilter).length !== autores.length) {
      let arrayAutor =  new Set([...autorFilter].map(numero => {
          const matchingItem = autores.find(item => item.id === parseInt(numero));
          return matchingItem ? matchingItem.nombres : null;
        }).filter(nombres => nombres !== null));
      
      filteredDocumentos = filteredDocumentos.filter((documento) =>
        Array.from(arrayAutor).includes(documento.direccion),
      );
    }
    return filteredDocumentos;
  }, [documentos, estadoFilter,filterNumero, filterMateria,filterRut,tipoFilter,direccionFilter,autorFilter,filterFecha]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  
  const onSearchChangeNumero = useCallback((value) => {
    if (value) {
      setFilterNumero(value);
      setPage(1);
    } else {
      setFilterNumero("");
    }
  }, []);
  const onClearNumero = useCallback(()=>{
    setFilterNumero("")
    setPage(1)
  },[])

  const onSearchChangeMateria = useCallback((value) => {
    if (value) {
      setFilterMateria(value);
      setPage(1);
    } else {
      setFilterMateria("");
    }
  }, []);
  const onClearMateria = useCallback(()=>{
    setFilterMateria("")
    console.log("se limpia materia")
    setPage(1)
  },[])

  const onSearchChangeRut = useCallback((value) => {
    if (value) {
      setFilterRut(value);
      setPage(1);
    } else {
      setFilterRut("");
    }
  }, []);
  const onClearRut = useCallback(()=>{
    setFilterRut("")
    console.log("se limpia rut")
    setPage(1)
  },[])
   

  const columnas = [
    {name: "ID", uid: "id", sortable: true},
    {name: "#", uid: "numero", sortable: true},
    {name: "Autor", uid: "autor", sortable: true},
    {name: "Fecha", uid: "fecha", sortable: true},
    {name: "Tipo", uid: "tipo"},
    {name: "Materia", uid: "materia"},
    {name: "Rut", uid: "rut"},
    {name: "Dirección", uid: "direccion", sortable: true},
    {name: "Anexos", uid: "anexos"},
    {name: "Estado", uid: "estado", sortable: true},
    {name: "Archivo", uid: "name_file", sortable: true},
    {name: "Acciones", uid: "actions"},
  ];
  
  const download = (documento) => {
    const link=`data:${documento.mime_file};base64,${documento.file}`
    const filename = documento.name_file+".pdf"
    const downloadlink = createElement("a",{href:link,download:filename,click:true})
    
    //QUEDE AQUI FALTA VER COMO DESCARGAR DOCUMENTO CON EL BOTON 
  }

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

  const descargarSeleccionados = () => {
    const zip = new JSZip();
    let datos=[]
    if (seleccion=="all"){
      datos = documentos;
    }else{
      const arraySeleccion = Array.from(seleccion)

      datos = arraySeleccion.map( doc_id => {
        const match = documentos.find( item => item.id == Number(doc_id));
        return {mime_file:match.mime_file,file:match.file,name_file:match.name_file,numero:match.numero,
          fecha:match.fecha,tipo:match.tipo}
      })
    }
    

    // QUEDE AQUI FALTA ESTO DE DESCARGAR MASIVAMENTE ARCHIVOS
    let arraySinArchivos=[]
    for (let i = 0; i < datos.length; i++) {
      // Zip file with the file name.
      if (datos[i].file){
        const blob = base64toBlob(datos[i].file);
        const url = URL.createObjectURL(blob);
        zip.file(datos[i].name_file, blob);
      }else{
        console.log("No tenia archivo el documento n° ",datos[i].numero)
        arraySinArchivos.push(datos[i])
        setSinArchivos(arraySinArchivos)
      }
    } 
    zip.generateAsync({type: "blob",mimeType:"application/zip"}).then(content => {
      saveAs(content, "documentos.zip");
    });
    onOpen()
  }
  
  const anularSeleccionados = () => {
    console.log("Falta anular seleccionados, se debe comprobar los que si realmente estan habilitador")
    let datos=[]
    if (seleccion=="all"){
      datos = documentos;
    }else{
      const arraySeleccion = Array.from(seleccion)
    }
  }
  //no se si esto se necesario
  const habilitarSeleccionados = () => {
    console.log("Falta habilitar seleccionados")
    let datos=[]
    if (seleccion=="all"){
      datos = documentos;
    }else{
      const arraySeleccion = Array.from(seleccion)
    }
  }

  return (
    <AuthenticatedLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion de Documentos</h2>}>
      <div>
        <TitleTemplate>Gestion de Documentos</TitleTemplate>
        <FilterTemplate>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4 items-end">
            <Input isClearable classNames={{input:["border-none"]}} type='text'
              className="w-full input-next border-none" size='sm' placeholder="Buscar por numero..."
              startContent={<Icon path={mdiMagnify} size={1} />} value={filterNumero}
              onClear={() => onClearNumero()} onValueChange={onSearchChangeNumero} />

            <Input isClearable classNames={{input:["border-none"]}}
              className="w-full" size='sm' placeholder="Buscar por materia..."
              startContent={<Icon path={mdiMagnify} size={1} />} value={filterMateria}
              onClear={() => onClearMateria()} onValueChange={onSearchChangeMateria} />

            <Input isClearable classNames={{input:["border-none"]}}
              className="w-full" size='sm'  placeholder="Buscar por rut..."
              startContent={<Icon path={mdiMagnify} size={1} />} value={filterRut}
              onClear={() => onClearRut()} onValueChange={onSearchChangeRut} />

            <div className='w-full card'>
              <Calendar className='max-h-12 border-0 flex p-0' placeholder='Seleccione fecha' dateFormat="yy//mm/dd" showIcon value={filterFecha} onChange={(e) => setFilterFecha(e.value)} selectionMode="range" readOnlyInput />
            </div>
            
            <div className="flex gap-3">
              <div>
                {/* FILTRO TIPO */}
                <Dropdown >
                  <DropdownTrigger className="hidden sm:flex">
                    <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                      Tipo
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu  disallowEmptySelection aria-label="Table Columns"
                    closeOnSelect={false} selectedKeys={tipoFilter} selectionMode="multiple"
                    onSelectionChange={setTipoFilter} >
                    {tipos.map( (tipo) => (
                      <DropdownItem key={tipo.id}>{tipo.nombre}</DropdownItem>
                    ) )}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div>
                {/* FILTRO AUTOR */}
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                      Autor
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu  disallowEmptySelection aria-label="Table Columns" id='autor' selectedKeys={autorFilter}
                    onSelectionChange={setAutorFilter} closeOnSelect={false} selectionMode="multiple" items={autores}>
                    {
                      (autor)=>(
                        <DropdownItem key={autor.id}>{autor.nombres}</DropdownItem>
                      )
                    }
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div>
                {/* FILTRO DIRECCION */}
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                      Direccion
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu  disallowEmptySelection aria-label="Table Columns" selectedKeys={direccionFilter}
                    onSelectionChange={setDireccionFilter} closeOnSelect={false} selectionMode="multiple">
                    {direcciones.map( (direccion) => (
                      <DropdownItem key={direccion.id}>{direccion.nombre}</DropdownItem>
                    ) )}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div>
                <Dropdown >
                  <DropdownTrigger className="hidden sm:flex">
                    <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                      Estado
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu  disallowEmptySelection aria-label="Table Columns"
                    closeOnSelect={false} selectedKeys={estadoFilter} selectionMode="multiple"
                    onSelectionChange={setEstadoFilter} >
                    {estados.map( (estado) => (
                      <DropdownItem key={estado.id}>{estado.nombre}</DropdownItem>
                    ) )}
                  </DropdownMenu>
                </Dropdown>
              </div>
              {/* <Button color="primary" endContent={<PlusIcon />}>
                Add New
              </Button> */}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">Total {documentos.length} documentos</span>
            <label className="flex items-center text-default-400 text-small">
              Filas por pagina:
              <Select onChange={(value) => {setRowsPerPage(value);setPage(1)}} value={rowsPerPage} opciones={[{id:5,nombre:5},{id:10,nombre:10},{id:15,nombre:15}]}>
              </Select>
            </label>
          </div>
        </div>
        </FilterTemplate>
        <ContentTemplate>
          <div className='flex justify-between mb-3'>
            <div>
              <h1 className='text-2xl'>Resultados</h1>
            </div>
            <div className='flex gap-3'>
              {
                hasPermission('Gestion-Crear documento')?
                <>
                  <Link href={route('gestion-documento.create')}>
                    <Button color="success" variant="solid" endContent={<Icon path={mdiPlus} size={1} />}>
                      Agregar documento
                    </Button>
                  </Link>
                </>:<></>
              }{
                hasPermission('Gestion-Anular documento')?
                <>
                  <Link href={route('gestion-documento.create')}>
                    <Button color="danger" variant="solid" endContent={<Icon path={mdiCancel} size={1} />}>
                      Anular seleccionados
                    </Button>
                  </Link>
                </>:<></>
              }{
                hasPermission('Gestion-Habilitar documento')?
                <>
                  <Button color="secondary" variant="solid" onPress={anularSeleccionados}
                  endContent={<Icon path={mdiCheckUnderline} size={1} />}>
                    Habilitar seleccionados
                  </Button>
                </>:<></>
              }{
                hasPermission('Gestion-Descargar documento')?
                <>
                    <Button color="primary" variant="solid" onClick={descargarSeleccionados}
                    endContent={<Icon path={mdiFileDownloadOutline} size={1} />}>
                      Descargar seleccionados
                    </Button>
                </>:<></>
              }
            
            </div>
          </div>
          <div className='w-full'>
            <Table aria-label="Tabla documentos" color={"primary"} selectionMode="multiple"  
            selectedKeys={seleccion} onSelectionChange={setSeleccion}  
            bottomContent={ <div className="flex w-full justify-center">
                              <Pagination isCompact showControls showShadow color="secondary" page={page}
                                total={pages} onChange={(page) => setPage(page)} />
                            </div> }
            classNames={{  wrapper: "min-h-[222px]", }}>
              <TableHeader>
                  {columnas.map((columna)=>(
                    <TableColumn className='text-start text-small' key={columna.uid}>{columna.name}</TableColumn>
                  ))}
              </TableHeader>
              <TableBody emptyContent={"No existen documentos"}>
                {
                  sortedItems.map((documento)=>(
                    <TableRow key={documento.id} className='text-start'>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.id}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.numero}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.autor}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.fecha}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.tipo}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.materia}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.rut}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.direccion}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                        {
                          documento.anexos.length!==0?
                          <>
                            <Dropdown  type='listbox'> 
                              <DropdownTrigger>
                                  <Button variant="bordered" size='sm'>
                                      Ver Anexos
                                  </Button>
                              </DropdownTrigger>
                              <DropdownMenu className='h-64 overflow-auto' aria-label="Static Actions" onScroll={true} emptyContent={'No posee'}>
                                  {
                                      documento.anexos.map((doc_anexo) => (
                                          <DropdownItem key={doc_anexo.documento_id_anexo}>Número: {doc_anexo.datos_anexo.id}</DropdownItem>
                                      ))
                                  }
                              </DropdownMenu>
                          </Dropdown>
                          </>:
                          <><p className=''>No posee</p></>
                        }
                        
                      </TableCell>
                      <TableCell>
                      {
                        documento.estado === "Habilitado"?
                        <>
                          <Chip className="capitalize" color={'success'} size="sm" variant="flat">
                            {documento.estado}
                          </Chip>
                        </>:
                        <>
                          <Chip className="capitalize" color={'danger'} size="sm" variant="flat">
                            {documento.estado}
                          </Chip>
                        </>
                      
                      }</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.name_file}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                        <>
                        {
                          hasPermission('Visualizar documento') && documento.file?
                          <>
                            <Tooltip content={"Visualizar"} color='secondary'>
                              <Link href={route('documento.visualizar',documento.id)} >
                                <Button className="me-1" size='sm'  color='secondary' variant='flat'> 
                                  {/* active={route().current('documento.visualizar')} */}
                                  <Icon path={mdiFileEyeOutline} size={1} />
                                </Button>
                              </Link>
                            </Tooltip>
                            
                          </>:
                          <></>
                        }{
                          hasPermission('Descargar documento') && documento.file?
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
                        }{
                          hasPermission('Gestion-Editar documento')?
                          <>
                            <Tooltip content={"Editar"} color='warning'>
                              <Link href={route('gestion-documento.edit',String(documento.id))} >
                                <Button className="me-1" size='sm' color='warning' variant='flat'> 
                                  {/* active={route().current('documento.visualizar')} */}
                                <Icon path={mdiPencilBoxOutline} size={1}/>
                                  
                                </Button>
                              </Link>
                            </Tooltip>
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
          
          
        </ContentTemplate>
        {/* MODAL DESCARGA */}
        <div>
          <Modal isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange} size="xl" >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                  <ModalBody>
                    <div>
                      <p>Los siguientes documentos no poseen archivos</p>
                    </div>
                    <div>
                      <Table aria-label="Tabla documentos anexos" color={"primary"}
                      bottomContent={ <div className="flex w-full justify-center">
                                        <Pagination isCompact showControls showShadow color="secondary" page={page}
                                          total={pages} onChange={(page) => setPage(page)} />
                                      </div> }>
                        <TableHeader>
                            <TableColumn>Numero de documento</TableColumn>
                            <TableColumn>Tipo de documento</TableColumn>
                            <TableColumn>Nombre archivo</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No existen documentos"}>
                          {
                            sinArchivos.map((documento)=>(
                              <TableRow key={documento.numero} className='text-start'>
                                <TableCell>{documento.numero}</TableCell>
                                <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.tipo}</TableCell>
                                <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.file}</TableCell>
                                
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cerrar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
      <div>
              
      </div>
    </AuthenticatedLayout>
    
  )
}

export default GestionDocumentos
