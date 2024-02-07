import ContentTemplate from '@/Components/ContentTemplate'
import FilterTemplate from '@/Components/FilterTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import React,{useRef,useState,useEffect,useMemo,useCallback} from 'react'
import { usePage ,Link, useForm} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import {Button, Pagination, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Input,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu, Chip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip,}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiVacuumOutline, mdiPencilBoxOutline,mdiMagnify,mdiChevronDown,mdiPlus, mdiCancel, mdiCheckUnderline} from '@mdi/js';
import { Calendar } from 'primereact/calendar';
import Select from '@/Components/Select';
import { Head } from '@inertiajs/react';
import { Toast } from 'primereact/toast'; 


const ShowUsers = ({auth}) => {
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
  const { usuarios,estados } = usePage().props;
  //console.log(usuarios)

  //MODAL
  const {isOpen:isOpenEstado, onOpen:onOpenEstado, onOpenChange:onOpenChangeEstado} = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [functionName,setFunctionName] = useState('')
  const [titleModal,setTitleModal]=useState('')
  const [contentModal,setContentModal]=useState('')

  //formulario
  const { data:dataEstado, setData:setDataEstado, post:postEstado, processing:processingEstado, 
    errors:errorsEstado, reset:resetEstado, patch: patchEstado} = useForm({
    id_users:[],
    opcion:''
  });

  //TABLA Y FILTROS
  //Filtros
  const [seleccion, setSeleccion] = useState([]);
  const [filterNombre,setFilterNombre] = useState('');
  const [filterApellido,setFilterApellido] = useState('');
  const [filterRut,setFilterRut] = useState('');
  const [filterCorreo,setFilterCorreo] = useState('');
  const hasSearchFilterNombre = Boolean(filterNombre);
  const hasSearchFilterApellido = Boolean(filterApellido);
  const hasSearchFilterRut = Boolean(filterRut);
  const hasSearchFilterCorreo = Boolean(filterCorreo);
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "fecha",
    direction: "ascending",
  });

  //Tabla
  const filteredItems = useMemo(() => {
    let filteredUsuarios = [...usuarios];
    if (hasSearchFilterNombre) {
      filteredUsuarios = filteredUsuarios.filter((usuario) => usuario.nombres.toLowerCase().includes(filterNombre.toLowerCase()));
    }
    if (hasSearchFilterApellido) {
      filteredUsuarios = filteredUsuarios.filter((usuario) => usuario.apellidos.toLowerCase().includes(filterApellido.toLowerCase()));
    }
    if (hasSearchFilterCorreo) {
      filteredUsuarios = filteredUsuarios.filter((usuario) => usuario.correo.toLowerCase().includes(filterCorreo.toLowerCase()));
    }
    if (hasSearchFilterRut) {
      filteredUsuarios = filteredUsuarios.filter((usuario) => usuario.rut.toLowerCase().includes(filterRut.toLowerCase()));
    }
    if (estadoFilter !== "all" && Array.from(estadoFilter).length !== estados.length) {
      let arrayEstado =  new Set([...estadoFilter].map(numero => {
          const matchingItem = estados.find(item => item.id === parseInt(numero));
          return matchingItem ? matchingItem.nombre : null;
        }).filter(nombre => nombre !== null));
      filteredUsuarios = filteredUsuarios.filter((usuario) =>
        Array.from(arrayEstado).includes(usuario.estado),
      );
    }
    return filteredUsuarios;
  }, [usuarios, estadoFilter,filterNombre, filterApellido,filterRut,filterCorreo,filterRut]);

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
      setFilterNombre(value);
      setPage(1);
    } else {
      setFilterNombre("");
    }
  }, []);
  const onClearNumero = useCallback(()=>{
    setFilterNombre("")
    setPage(1)
  },[])

  const onSearchChangeApellido = useCallback((value) => {
    if (value) {
      setFilterApellido(value);
      setPage(1);
    } else {
      setFilterApellido("");
    }
  }, []);
  const onClearApellido = useCallback(()=>{
    setFilterApellido("")
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
  
  const onSearchChangeCorreo = useCallback((value) => {
    if (value) {
      setFilterCorreo(value);
      setPage(1);
    } else {
      setFilterCorreo("");
    }
  }, []);
  const onClearCorreo = useCallback(()=>{
    setFilterCorreo("")
    setPage(1)
  },[])
   

  const columnas = [
    {name: "ID", uid: "id", sortable: true},
    {name: "Nombres", uid: "nombres", sortable: true},
    {name: "Apellidos", uid: "apellidos", sortable: true},
    {name: "Correo", uid: "correo", sortable: true},
    {name: "Rut", uid: "rut"},
    {name: "Rol", uid: "rol"},
    {name: "Permisos", uid: "permisos"},
    {name: "Estado", uid: "estado"},
    {name: "Acciones", uid: "actions"},
  ];

  
  //UPDATE ESTADOS
  const anularSeleccionados = (e) => {
    if (seleccion.length!=0){
      let datos=[]
      if (seleccion=="all"){
        datos = usuarios.filter(item=>{item.estado === estados[0].nombre;return item.id})
        datos = datos.map(doc=>doc.id)
        dataEstado.opcion=2 //opcion de anular
      }else{
        const arraySeleccion = Array.from(seleccion)
        datos = arraySeleccion.map( doc_id => {
          const match = usuarios.find( item => item.id == Number(doc_id) && item.estado === estados[0].nombre); //filtro que debe estar habilitado para cambiar el estado
          return match?match.id:undefined
        }).filter(id => id !== undefined);
        dataEstado.opcion=2 //opcion de anular
      }
      dataEstado.id_users=datos
      patchEstado(route('gestion-usuarios.update-collection',0),{
        onSuccess:(msg)=>{showMsg("Exito",severity.success,summary.success)},
        onError:()=>{showMsg("Falló",severity.error,summary.error)}
      })
    }else{
      showMsg("No seleccionaste datos",severity.error,summary.error)
    }
    
  }
  //no se si esto se necesario
  const habilitarSeleccionados = (e) => {
    if (seleccion.length!=0){
      let datos=[]
      if (seleccion=="all"){
        datos = usuarios.filter(item=>{item.estado === estados[1].nombre;return item.id})
        datos = datos.map(item=>item.id)
        dataEstado.opcion=1
      }else{
        const arraySeleccion = Array.from(seleccion)
        datos = arraySeleccion.map( user_id => {
          const match = usuarios.find( item => item.id == Number(user_id) && item.estado === estados[1].nombre); //filtro que debe estar anulado para cambiar el estado
          return match?match.id:undefined
        }).filter(id => id !== undefined);
        dataEstado.opcion=1
      }
      dataEstado.id_users=datos
      patchEstado(route('gestion-usuarios.update-collection',0),{
        onSuccess:(msg)=>{showMsg("Exito",severity.success,summary.success)},
        onError:()=>{showMsg("Error",severity.error,summary.error)}
      })
    }else{
      showMsg("No seleccionaste datos",severity.error,summary.error)
    }
  }

  const limpiarFiltros = () =>{
    setEstadoFilter('all')
    setFilterApellido('')
    setFilterCorreo('')
    setFilterNombre('')
    setFilterRut('')
  }


  return (
    <Authenticated user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion de usuarios</h2>}>
        <TitleTemplate>Gestion de usuarios</TitleTemplate>
        <Head title='Gestion de usuarios'></Head>
        <Toast ref={toast_global}></Toast>
        <FilterTemplate>
        <div className="flex flex-col gap-4">
            <div className="md:flex justify-center gap-4 items-end">
              <Input isClearable classNames={{input:["border-none"]}} type='text'
                className="w-full mb-1" size='sm' placeholder="Buscar por numero..."
                startContent={<Icon path={mdiMagnify} size={1} />} value={filterNombre}
                onClear={() => onClearNumero()} onValueChange={onSearchChangeNumero} />

              <Input isClearable classNames={{input:["border-none"]}}
                className="w-full mb-1" size='sm' placeholder="Buscar por apellido..."
                startContent={<Icon path={mdiMagnify} size={1} />} value={filterApellido}
                onClear={() => onClearApellido()} onValueChange={onSearchChangeApellido} />

              <Input isClearable classNames={{input:["border-none"]}}
                className="w-full mb-1" size='sm'  placeholder="Buscar por rut..."
                startContent={<Icon path={mdiMagnify} size={1} />} value={filterRut}
                onClear={() => onClearRut()} onValueChange={onSearchChangeRut} />
              
              <Input isClearable classNames={{input:["border-none"]}}
                className="w-full mb-1" size='sm'  placeholder="Buscar por correo..."
                startContent={<Icon path={mdiMagnify} size={1} />} value={filterCorreo}
                onClear={() => onClearCorreo()} onValueChange={onSearchChangeCorreo} />
              
              <div className="flex gap-3">
                <div className='flex items-center'>
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
              <div>
                <span className="text-default-400 text-tiny lg:text-small">Total {usuarios.length} usuarios</span>
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
            <div className='flex gap-3 md:gap-3'>
              {
                hasPermission('Crear usuario') || hasPermission('Cargar usuarios xlsx')?
                <>
                  <Link href={route('gestion-usuarios.create')}>
                  <Tooltip content={"Crear usuario"} color='success'>
                    <Button color="success" variant="solid" size='sm' className='min-w-0 min-h-0'
                    //isIconOnly 
                    endContent={<Icon path={mdiPlus} size={1} />}>
                      <div className='hidden text-tiny md:flex xl:text-small'>
                        Agregar usuario
                      </div>
                    </Button>
                  </Tooltip>
                  </Link>
                </>:<></>
              }{
                hasPermission('Anular usuario')?
                <>
                <Tooltip content={"Anular usuario"} color='danger'>
                  <Button color="danger" variant="solid" size='sm' className='min-w-0 min-h-0'
                  //isIconOnly
                   onPress={()=>{
                    setFunctionName(() => () => anularSeleccionados());setTitleModal('Anular usuarios seleccionados');
                    setContentModal('¿Está seguro de anular los usuarios?');onOpenEstado();}} 
                  //onPress={()=>anularSeleccionados()}
                  endContent={<Icon path={mdiCancel} size={1} />}>
                    <div className='hidden text-tiny md:flex xl:text-small'>
                      Anular seleccionados
                    </div>
                  </Button>
                  </Tooltip>
                </>:<></>
              }{
                hasPermission('Habilitar usuario')?
                <>
                <Tooltip content={"Habilitar usuario"} color='secondary'>
                  <Button color="secondary" variant="solid" size='sm' className='min-w-0 min-h-0'
                  //isIconOnly 
                  onPress={()=>{
                    setFunctionName(() => () => habilitarSeleccionados());setTitleModal('Habilitar usuarios seleccionados');
                    setContentModal('¿Está seguro de habilitar los usuarios?');onOpenEstado();}} 
                  //onPress={habilitarSeleccionados}
                  endContent={<Icon path={mdiCheckUnderline} size={1} />}>
                    <div className='hidden text-tiny md:flex xl:text-small'>
                      Habilitar seleccionados
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
              <TableBody emptyContent={"No existen usuarios"}>
                {
                  sortedItems.map((usuario)=>(
                    <TableRow key={usuario.id} className='text-start'>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{usuario.id}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{usuario.nombres}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{usuario.apellidos}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{usuario.correo}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{usuario.rut}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{usuario.roles[0].name}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                        {
                           usuario.permissions.length!==0?
                          <>
                            <Dropdown  type='listbox'> 
                              <DropdownTrigger>
                                  <Button variant="bordered" size='sm'>
                                      Ver permisos
                                  </Button>
                              </DropdownTrigger>
                              <DropdownMenu className='h-64 overflow-auto' aria-label="Static Actions" onScroll={true} emptyContent={'No posee'}>
                                  {
                                      usuario.permissions.map((permiso) => (
                                          <DropdownItem key={permiso} textValue={`${permiso}`}>{permiso}</DropdownItem>
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
                        usuario.estado === "Habilitado"?
                        <>
                          <Chip className="capitalize" color={'success'} size="sm" variant="flat">
                            {usuario.estado}
                          </Chip>
                        </>:
                        <>
                          <Chip className="capitalize" color={'danger'} size="sm" variant="flat">
                            {usuario.estado}
                          </Chip>
                        </>
                      
                      }</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                        <>
                        {
                          hasPermission('Editar usuario')?
                          <>
                            <Tooltip content={"Editar"} color='warning'>
                              <Link href={route('gestion-usuarios.edit',String(usuario.id))}>
                                <Button className="me-1" size='sm' color='warning' variant='flat'> 
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
                    <Button color="primary" onPress={onClose} onClick={()=>functionName()}>
                        Confirmar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
    </Authenticated>
  )
}

export default ShowUsers
