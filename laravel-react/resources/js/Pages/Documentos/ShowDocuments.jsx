import React, { useState, useEffect, useRef, useMemo, useCallback} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TitleTemplate from '@/Components/TitleTemplate';
import FilterTemplate from '@/Components/FilterTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import { usePage ,Link, useForm} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import {Button, Pagination, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Input,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu, Chip, Tab,Tabs,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip,}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileEyeOutline, mdiFileDownloadOutline, mdiVacuumOutline,mdiMagnify,mdiChevronDown,mdiPlus, mdiCancel, mdiCheckUnderline} from '@mdi/js';
import { Calendar } from 'primereact/calendar';
import Select from '@/Components/Select';
import { Head } from '@inertiajs/react';
import { Toast } from 'primereact/toast';  
import { DescargarDocumento } from '@/Composables/DownloadPDF';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
locale('en');
addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
  //...
});


const GestionDocumentos = ({auth}) => {
  //toast
  const toast_global = useRef(null);
  //mensaje formulario
  const severity = { success:'success',error:'error'}
  const summary = { success:'Exito',error:'Error'}
  const showMsg = (msg,sev,sum) => {
      toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
  }

  //PERMISOS
  const {hasRoles,hasPermission} = usePermission()

  //VARIABLES QUE ENTREGA EL CONTROLADOR
  const { all_documents,direcciones, tipos,autores,estados } = usePage().props;
  const [anexosDoc,setAnexosDoc] = useState([])
  const [anexosOtros,setAnexosOtros] = useState([])
  const [documentos,setDocumentos] = useState(all_documents)
  const getDocumentos = async () => {
    try {
      const response = await axios.get(`/api/all-documents`); // Cambia la ruta según tu configuración
      //console.log('Documentos obtenidos:', response.data);
      setDocumentos(response.data.documentos)
      // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  }

  //MODAL
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {isOpen:isOpenAnexosVer, onOpen:onOpenAnexosVer, onClose:onCloseAnexosVer} = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [sinArchivos,setSinArchivos] = useState([])

  //formulario
  const { data:dataEstado, setData:setDataEstado, post:postEstado, processing:processingEstado, 
    errors:errorsEstado, reset:resetEstado, patch: patchEstado} = useForm({
    id_docs:[],
    opcion:''
  });

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
      filteredDocumentos = filteredDocumentos.filter((documento) => documento.numero.includes(filterNumero));
    }
    if (hasSearchFilterMateria) {
      filteredDocumentos = filteredDocumentos.filter((documento) => documento.materia.toLowerCase().includes(filterMateria.toLowerCase()));
    }
    if (hasSearchFilterRut) {
      filteredDocumentos = filteredDocumentos.filter((documento) => documento.rut?.includes(filterRut));
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
        return matchingItem ? [matchingItem.nombres + " " + matchingItem.apellidos]: null;
      }).filter(nombres => nombres !== null));
      filteredDocumentos = filteredDocumentos.filter((fila) =>
        Array.from(arrayAutor).some(item=>JSON.stringify(item) === JSON.stringify([fila.autor]))
      );
    }
    return filteredDocumentos;
  }, [documentos, estadoFilter,filterNumero, filterMateria,filterRut,tipoFilter,direccionFilter,autorFilter,filterFecha]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const pagesAnexosDoc = Math.ceil(anexosDoc.length / rowsPerPage);
  const itemsAnexosDoc = React.useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return anexosDoc.slice(start, end);
  }, [page, anexosDoc]);

  const pagesAnexosOtros = Math.ceil(anexosOtros.length / rowsPerPage);
  const itemsAnexosOtros = React.useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return anexosOtros.slice(start, end);
  }, [page, anexosOtros]);

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
    setPage(1)
  },[])

  const limpiarFiltros = () =>{
    setFilterRut('')
    setFilterFecha('')
    setFilterMateria('')
    setFilterNumero('')
    setTipoFilter("all")
    setAutorFilter("all")
    setDireccionFilter('all')
    setEstadoFilter('all')
  }
   

  const columnas = [
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

  const descargarSeleccionados = () => {
    if (seleccion.length!=0){
      const respSinArchivos = DescargarDocumento(seleccion,documentos);
      if (respSinArchivos.length!==0){
        setSinArchivos(respSinArchivos)
        onOpen()
      }
    }else{
      showMsg("No seleccionaste datos",severity.error,summary.error)
    }
  }
  const descargarUno = (doc) => {
    const respSinArchivos = DescargarDocumento(new Set([doc.id]),documentos);
    if (respSinArchivos.length!==0){
      setSinArchivos(respSinArchivos)
      onOpen()
    }
  }
  const mostrarDoc = (documento) => {
    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
    
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
        
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
    }
    const blob = b64toBlob(documento.file,documento.mime_file);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  }

  const mostrarAnexo = (documento) => {
    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
    
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
        
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
    }
    const blob = b64toBlob(documento.datos_anexo.file,documento.datos_anexo.mime_file);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  }
  

  return (
    <AuthenticatedLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documentos</h2>}>
      <div>
        <Head title="Documentos" />
        <TitleTemplate>Documentos</TitleTemplate>
        <Toast ref={toast_global}></Toast>

        <Modal isOpen={isOpenAnexosVer} onClose={onCloseAnexosVer} size='5xl'>
          <ModalContent>
            {
              (onCloseAnexosVer) => (
                <>
                    <ModalHeader>
                    Anexos
                    </ModalHeader>
                    <ModalBody>
                      <Tabs aria-label="documentos" fullWidth color="Documentos">
                          <Tab key="documentos-anexos" title="Documentos anexos">
                              <div>
                                  <div className=''>
                                      <Table  aria-label="Tabla documentos anexos"
                                      bottomContent={
                                          <div className="flex w-full justify-center">
                                              <Pagination isCompact showControls showShadow color="secondary" page={page}
                                              total={pagesAnexosDoc} onChange={(page) => setPage(page)} />
                                          </div>
                                          }
                                          classNames={{ wrapper: "min-h-[222px]", }}>
                                              <TableHeader>
                                                  <TableColumn className='text-medium'>ID</TableColumn>
                                                  <TableColumn className='text-medium'>Numero de documento</TableColumn>
                                                  <TableColumn className='text-medium'>Tipo de documento</TableColumn>
                                                  <TableColumn className='text-medium'>Autor de documento</TableColumn>
                                                  <TableColumn className='text-medium'>Fecha de documento</TableColumn>
                                                  <TableColumn className='text-medium'>Acciones</TableColumn>
                                              </TableHeader>
                                              <TableBody emptyContent={"Aún no hay documentos anexos"}>
                                              {
                                                  itemsAnexosDoc.map( (doc_anexo) => (
                                                  <TableRow key={doc_anexo.datos_anexo.id}>
                                                      <TableCell>{doc_anexo.datos_anexo.id}</TableCell>
                                                      <TableCell>{doc_anexo.datos_anexo.numero}</TableCell>
                                                      <TableCell>{doc_anexo.datos_anexo.tipo}</TableCell>
                                                      <TableCell> {doc_anexo.datos_anexo.autor?doc_anexo.datos_anexo.autor:doc_anexo.datos_anexo.autor_nombre +" "+doc_anexo.datos_anexo.autor_apellido} </TableCell>
                                                      <TableCell>{doc_anexo.datos_anexo.fecha}</TableCell>
                                                      <TableCell>
                                                        <Tooltip content={"Ver"} color='secondary'>
                                                          <Button className="me-1" size='sm'  color='secondary' variant='flat' onPress={()=>mostrarAnexo(doc_anexo)}>
                                                              <Icon path={mdiFileEyeOutline} size={1} />
                                                          </Button>
                                                        </Tooltip>
                                                      </TableCell>
                                                  </TableRow>
                                                  ) )
                                              }
                                              
                                              </TableBody>
                                      </Table>
                                  </div>
                              </div>
                          </Tab>
                          <Tab key="otros-anexos" title="Otros anexos">
                              <Table  aria-label="Tabla otros anexos" bottomContent={
                                  <div className="flex w-full justify-center">
                                  <Pagination
                                      isCompact
                                      showControls
                                      showShadow
                                      color="secondary"
                                      page={page}
                                      total={pagesAnexosOtros}
                                      onChange={(page) => setPage(page)}
                                  />
                                  </div>
                              }
                              classNames={{
                                  wrapper: "min-h-[222px]",
                              }}>
                                  <TableHeader>
                                      <TableColumn className='text-medium'>ID anexo</TableColumn>
                                      <TableColumn className='text-medium'>Descripción</TableColumn>
                                      <TableColumn className='text-medium'>Acción</TableColumn>
                                  </TableHeader>
                                  <TableBody emptyContent={"Aún no hay anexos"}>
                                      {
                                      itemsAnexosOtros.map( (documento,index) => (
                                          <TableRow key={index}>
                                              <TableCell>{documento.otro_doc_id_anexo}</TableCell>
                                              <TableCell>{documento.datos_anexo.descripcion}</TableCell>
                                              <TableCell>
                                                  <Tooltip content={"Ver"} color='secondary'>
                                                      <Button className="me-1" size='sm'  color='secondary' variant='flat' onPress={()=>mostrarAnexo(documento)}> 
                                                          {/* active={route().current('documento.visualizar')} */}
                                                          <Icon path={mdiFileEyeOutline} size={1} />
                                                      </Button>
                                                  </Tooltip>
                                              </TableCell>
                                          </TableRow>
                                      ) )
                                      }
                                      
                                  </TableBody>
                              </Table>
                          </Tab>
                      </Tabs>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onCloseAnexosVer}>
                          Cerrar
                        </Button>
                    </ModalFooter>
                </>
              )
            }
          </ModalContent>
        </Modal>

        <FilterTemplate>
          <div className="lg:flex lg:flex-col gap-4">
            <div className="lg:flex mb-2">
              <div className='md:flex w-full gap-2 items-center justify-center mb-1 me-1'>
                <div className='md:flex gap-2'>
                  <Input isClearable classNames={{input:["border-none", "placeholder:none",]}} type='text'
                    className="w-full mb-1"  size='sm' placeholder="Buscar por numero..."
                    startContent={<Icon path={mdiMagnify} size={1} />} value={filterNumero}
                    onClear={() => onClearNumero()} onValueChange={onSearchChangeNumero} />

                  <Input isClearable classNames={{input:["border-none"]}}
                    className="w-full mb-1"  size='sm' placeholder="Buscar por materia..."
                    startContent={<Icon path={mdiMagnify} size={1} />} value={filterMateria}
                    onClear={() => onClearMateria()} onValueChange={onSearchChangeMateria} />
                </div>
                <div className='md:flex gap-2'>
                  <Input isClearable classNames={{input:["border-none"]}}
                    className="w-full mb-1"  size='sm'  placeholder="Buscar por rut..."
                    startContent={<Icon path={mdiMagnify} size={1} />} value={filterRut}
                    onClear={() => onClearRut()} onValueChange={onSearchChangeRut} />
                  <div className='w-full card'>
                    <Calendar locale="es" className='max-h-12 border-0 flex p-0' placeholder='Seleccione fecha' dateFormat="dd/mm/yy" value={filterFecha} onChange={(e) => setFilterFecha(e.value)} selectionMode="range" readOnlyInput />
                  </div>
                </div>
              </div>
              <div className="lg:flex gap-1">
                <div className='flex mb-1 gap-1'>
                  <div className='w-full flex items-center'>
                    {/* FILTRO TIPO */}
                    <Dropdown >
                      <DropdownTrigger className="text-tiny md:text-small">
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
                  <div className='w-full flex items-center'>
                    {/* FILTRO AUTOR */}
                    <Dropdown>
                      <DropdownTrigger className="text-tiny md:text-small">
                        <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                          Autor
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu  disallowEmptySelection aria-label="Table Columns" id='autor' selectedKeys={autorFilter}
                        onSelectionChange={setAutorFilter} closeOnSelect={false} selectionMode="multiple" items={autores}>
                        {
                          (autor)=>(
                            <DropdownItem key={autor.id}>{autor.nombres} {autor.apellidos} - {autor.abreviacion}</DropdownItem>
                          )
                        }
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  </div>
                <div className='flex mb-1 gap-1'>
                  <div className='w-full flex items-center'>
                    {/* FILTRO DIRECCION */}
                    <Dropdown>
                      <DropdownTrigger className="text-tiny md:text-small">
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
                  <div className='w-full flex items-center'>
                    <Dropdown >
                      <DropdownTrigger className="text-tiny md:text-small">
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
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-default-400 text-tiny lg:text-small">Total {documentos.length} documentos</span>
              </div>
              <div className='flex gap-5'>
                <Button color='warning' className='min-w-0 min-h-0' onPress={()=>limpiarFiltros()}>
                    <Icon path={mdiVacuumOutline} size={1} />
                    <p className='hidden sm:flex'>
                    Limpiar filtros
                    </p>
                </Button>
                <label className="flex items-center text-default-400 text-tiny lg:text-small">
                  Filas por pagina:
                  <Select onChange={(value) => {setRowsPerPage(value);setPage(1)}} value={rowsPerPage} opciones={[{id:5,nombre:5},{id:8,nombre:8},{id:12,nombre:12}]}>
                  </Select>
                </label>
              </div>
            </div>
          </div>
        </FilterTemplate>
        <ContentTemplate>
          <div className='flex justify-between mb-3'>
            <div>
              <h1 className='text-large md:text-2xl'>Resultados</h1>
            </div>
            <div className='flex gap-3'>
              {
                hasPermission('Gestion-Descargar documento')?
                <>
                    <Tooltip content={"Descargar documentos"} color='primary'>
                    <Button color="primary" variant="solid" size='sm' className='min-w-0 min-h-0'
                    //isIconOnly 
                    onClick={descargarSeleccionados}
                    endContent={<Icon path={mdiFileDownloadOutline} size={1} />}>
                    <div className='hidden text-tiny lg:flex md:text-small'>
                      Descargar seleccionados
                    </div>
                    </Button>
                  </Tooltip>
                </>:<></>
              }
            
            </div>
          </div>
          <div className='w-full'>
            <Table aria-label="Tabla documentos" color={"primary"} selectionMode="multiple"  
            selectedKeys={seleccion} onSelectionChange={setSeleccion}  
            bottomContent={ 
              <div className="flex w-full justify-center">
                <Pagination isCompact showControls showShadow color="secondary" page={page}
                  total={pages} onChange={(page) => setPage(page)} />
              </div>
            }
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
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.numero}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.autor}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.fecha}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.tipo}</TableCell>
                      <TableCell>
                        {
                          documento.materia?
                          <>
                             <Dropdown  type='listbox'> 
                              <DropdownTrigger>
                                  <Button variant="bordered" size='sm'>
                                      Ver materia
                                  </Button>
                              </DropdownTrigger>
                              <DropdownMenu closeOnSelect={false} className='h-64 overflow-auto' aria-label="Static Actions"  emptyContent={'No posee'}>
                                <DropdownItem key={documento.materia} >{documento.materia}</DropdownItem>   
                              </DropdownMenu>
                            </Dropdown>
                          </>
                          :<>
                          <Chip>No posee</Chip>
                          </>
                        }
                       
                      </TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.rut}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.direccion}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                        <Button className="me-1" size='sm'  color='secondary' variant='flat' onPress={()=>{setAnexosDoc(documento.anexos);setAnexosOtros(documento.otros_anexos);onOpenAnexosVer()}}> 
                          Ver
                        </Button>
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
                          hasPermission('Visualizar documento') && documento.file && documento.estado=="Habilitado"?
                          <>
                            <Tooltip content={"Visualizar"} color='secondary'>
                              {/* <Link href={route('documento.visualizar',documento.id)} > */}
                              <Button className="me-1" size='sm'  color='secondary' variant='flat' onPress={()=> mostrarDoc(documento)}> 
                                  {/* active={route().current('documento.visualizar')} */}
                                  <Icon path={mdiFileEyeOutline} size={1} />
                                </Button>
                              {/* </Link> */}
                            </Tooltip>
                            
                          </>:
                          <></>
                        }{
                          hasPermission('Descargar documento') && documento.file && documento.estado=="Habilitado"?
                          <>
                            <Tooltip content={"Descargar"} color='primary'>
                              {/* <a download={documento.name_file+".pdf"} href={`data:${documento.mime_file};base64,${documento.file}`}> */}
                                  <Button className="me-1" size='sm' color='primary' variant='flat' onPress={()=>descargarUno(documento)}> 
                                    {/* active={route().current('documento.visualizar')} */}
                                    <Icon path={mdiFileDownloadOutline} size={1} />
                                  </Button>
                                {/* </a> */}
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
                  <ModalHeader className="flex flex-col gap-1">Documentos sin archivo</ModalHeader>
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
                            <TableColumn>Fecha</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No existen documentos"}>
                          {
                            sinArchivos.map((documento)=>(
                              <TableRow key={documento.numero} className='text-start'>
                                <TableCell>{documento.numero}</TableCell>
                                <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.tipo}</TableCell>
                                <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.fecha}</TableCell>
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
