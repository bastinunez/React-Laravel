import React, { useState, useEffect, useRef, useMemo, useCallback} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TitleTemplate from '@/Components/TitleTemplate';
import FilterTemplate from '@/Components/FilterTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import { usePage ,Link, useForm} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import {Button, Pagination, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Input,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu, Chip, Progress,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip,}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileEyeOutline, mdiFileDownloadOutline, mdiPencilBoxOutline,mdiMagnify,mdiChevronDown,mdiPlus, mdiCancel, mdiCheckUnderline,mdiVacuumOutline} from '@mdi/js';
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
  const {isOpen:isOpenEstado, onOpen:onOpenEstado, onOpenChange:onOpenChangeEstado} = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [sinArchivos,setSinArchivos] = useState([])
  const [functionName,setFunctionName] = useState('')
  const [titleModal,setTitleModal]=useState('')
  const [contentModal,setContentModal]=useState('')

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

  const [stateBtnModal,setStateBtnModal] = useState(false)
  useEffect(()=>{
    setStateBtnModal(false)
  },[])
  const descargarSeleccionados = () => {
    if (seleccion.length!=0){
      setStateBtnModal(true)
      const respSinArchivos = DescargarDocumento(seleccion,documentos);
      if (respSinArchivos.length!==0){
        setSinArchivos(respSinArchivos)
        onOpen()
      }
      setStateBtnModal(false)
    }else{
      showMsg("No seleccionaste datos",severity.error,summary.error)
    }
  }
  const descargarUno = (doc) => {
    setStateBtnModal(true)
    const respSinArchivos = DescargarDocumento(new Set([doc.id]),documentos);
    if (respSinArchivos.length!==0){
      setSinArchivos(respSinArchivos)
      onOpen()
    }
    setStateBtnModal(false)
  }

  //progress
  const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();
  
  
  //UPDATE ESTADOS
  const anularSeleccionados = (e) => {
    if (seleccion.length!=0){
      setStateBtnModal(true)
      onOpenProgress()
      let datos=[]
      if (seleccion=="all"){
        datos = documentos.filter(item=>{item.estado === estados[0].nombre;return item.id})
        datos = datos.map(doc=>doc.id)
        dataEstado.opcion=2 //opcion de anular
      }else{
        const arraySeleccion = Array.from(seleccion)
        datos = arraySeleccion.map( doc_id => {
          const match = documentos.find( item => item.id == Number(doc_id) && item.estado === estados[0].nombre); //filtro que debe estar habilitado para cambiar el estado
          return match?match.id:undefined
        }).filter(id => id !== undefined);
        dataEstado.opcion=2 //opcion de anular
      }
      dataEstado.id_docs=datos
      patchEstado(route('gestion-documento.update-collection',0),{
        onSuccess:(msg)=>{getDocumentos();showMsg(msg.update,severity.success,summary.success);onCloseProgress();setStateBtnModal(false)},
        onError:(msg)=>{showMsg(msg.update,severity.error,summary.error);onCloseProgress();setStateBtnModal(false)}
      })
    }else{
      showMsg("No seleccionaste datos",severity.error,summary.error)
    }
    
  }

  
  const habilitarSeleccionados = (e) => {
    if (seleccion.length!=0){
      setStateBtnModal(true)
      onOpenProgress()
      let datos=[]
      if (seleccion=="all"){
        datos = documentos.filter(item=>{item.estado === estados[1].nombre;return item.id})
        datos = datos.map(doc=>doc.id)
        dataEstado.opcion=1
      }else{
        const arraySeleccion = Array.from(seleccion)
        datos = arraySeleccion.map( doc_id => {
          const match = documentos.find( item => item.id == Number(doc_id) && item.estado === estados[1].nombre); //filtro que debe estar anulado para cambiar el estado
          return match?match.id:undefined
        }).filter(id => id !== undefined);
        dataEstado.opcion=1
      }
      dataEstado.id_docs=datos
      patchEstado(route('gestion-documento.update-collection',0),{
        onSuccess:(msg)=>{getDocumentos();showMsg(msg.update,severity.success,summary.success);onCloseProgress();setStateBtnModal(false)},
        onError:(msg)=>{showMsg(msg.update,severity.error,summary.error);onCloseProgress();setStateBtnModal(false)}
      })
    }else{
      showMsg("No seleccionaste datos",severity.error,summary.error)
    }
  }


  return (
    <AuthenticatedLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Documentos</h2>}>
      <div>
        <Head title="Gestión de Documentos" />
        <TitleTemplate>Gestión de Documentos</TitleTemplate>
        <Toast ref={toast_global}></Toast>

        <Modal isOpen={isOpenProgress} onClose={onCloseProgress}>
            <ModalContent>
                {
                    (onCloseProgress)=>(
                        <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className="max-w-md"
                        />
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
                    <Calendar className='max-h-12 border-0 flex p-0' placeholder='Seleccione fecha' dateFormat="dd/mm/yy" locale="es"
                     value={filterFecha} onChange={(e) => setFilterFecha(e.value)} selectionMode="range" readOnlyInput />
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
          <div className='flex justify-between mb-3 gap-4'>
            <div >
              <h1 className='text-large md:text-2xl'>Resultados</h1>
            </div>
            <div className='flex gap-3'>
              {
                hasPermission('Gestion-Crear documento')?
                <>
                  <Link href={route('gestion-documento.create')}>
                    <Tooltip content={"Crear documento"} color='success'>
                      <Button color="success" variant="solid" size='sm'  className='min-w-0 min-h-0'
                      //isIconOnly 
                      endContent={<Icon path={mdiPlus} size={1} />}>
                        <div className='hidden text-tiny lg:flex xl:text-small'>
                          Agregar documento
                        </div>
                      </Button>
                    </Tooltip>
                  </Link>
                </>:<></>
              }{
                hasPermission('Gestion-Anular documento')?
                <>
                <Tooltip content={"Anular documentos"} color='danger'>
                  <Button color="danger" variant="solid" size='sm' className='min-w-0 min-h-0' 
                  //isIconOnly 
                  onPress={()=>{
                    setFunctionName(() => () => anularSeleccionados());setTitleModal('Anular documentos seleccionados');
                    setContentModal('¿Está seguro de anular los documentos?');onOpenEstado();}} 
                  //onPress={()=>anularSeleccionados()}
                  endContent={<Icon path={mdiCancel} size={1} />}>
                    <div className='hidden text-tiny lg:flex xl:text-small'>
                      Anular seleccionados
                    </div>
                  </Button>
                </Tooltip>
                </>:<></>
              }{
                hasPermission('Gestion-Habilitar documento')?
                <>
                <Tooltip content={"Habilitar documentos"} color='secondary'>
                  <Button color="secondary" variant="solid" size='sm' className='min-w-0 min-h-0' 
                  //isIconOnly 
                  onPress={()=>{
                    setFunctionName(() => () => habilitarSeleccionados());setTitleModal('Habilitar documentos seleccionados');
                    setContentModal('¿Está seguro de habilitar los documentos?');onOpenEstado();}} 
                  //onPress={habilitarSeleccionados}
                  endContent={<Icon path={mdiCheckUnderline} size={1} />}>
                    <div className='hidden text-tiny lg:flex xl:text-small'>
                    Habilitar seleccionados
                    </div>
                  </Button>
                  </Tooltip>
                </>:<></>
              }{
                hasPermission('Gestion-Descargar documento')?
                <>
                  <Tooltip content={"Descargar documentos"} color='primary'>
                    <Button color="primary" variant="solid" size='sm' className='min-w-0 min-h-0' 
                    //isIconOnly 
                    onClick={descargarSeleccionados}
                    endContent={<Icon path={mdiFileDownloadOutline} size={1} />}>
                      <div className='hidden text-tiny lg:flex xl:text-small'>
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
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{documento.id}</TableCell>
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
                        {
                          documento.anexos.length!==0?
                          <>
                            <Dropdown  type='listbox'> 
                              <DropdownTrigger>
                                  <Button variant="bordered" size='sm'>
                                      Documentos
                                  </Button>
                              </DropdownTrigger>
                              <DropdownMenu closeOnSelect={false} className='h-64 overflow-auto' aria-label="Static Actions"  emptyContent={'No posee'}>
                                  {
                                      documento.anexos.map((doc_anexo) => (
                                          <DropdownItem key={doc_anexo.documento_id_anexo} textValue={`Número: ${doc_anexo.datos_anexo.numero}`}>Número: {doc_anexo.datos_anexo.numero}</DropdownItem>
                                      ))
                                  }
                              </DropdownMenu>
                          </Dropdown>
                          </>:
                          <><Chip>No posee</Chip></>
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
        {/* MODAL HABILITAR/ANULAR */}
        <div>
          <Modal isOpen={isOpenEstado} placement={modalPlacement} onOpenChange={onOpenChangeEstado} size="md" >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">{titleModal}</ModalHeader>
                  <ModalBody>
                    {
                      contentModal
                    }
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose} >
                      Cerrar
                    </Button>
                    <Button color="primary" onPress={onClose} disabled={stateBtnModal} onClick={()=>functionName()}>
                        Confirmar
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
