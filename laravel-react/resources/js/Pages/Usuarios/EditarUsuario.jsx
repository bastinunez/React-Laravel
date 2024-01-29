import ContentTemplate from '@/Components/ContentTemplate'
import FilterTemplate from '@/Components/FilterTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import React,{useRef,useState,useEffect,useMemo,useCallback} from 'react'
import { usePage ,Link, useForm} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import {Button, Radio,RadioGroup, Table,TableCell,TableRow,Pagination,
  Input,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu, Chip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip, TableHeader, TableBody, TableColumn,}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileEyeOutline, mdiFileDownloadOutline, mdiPencilBoxOutline,mdiMagnify,mdiChevronDown,mdiPlus, mdiCancel, mdiCheckUnderline, mdiTrashCan, mdiTrashCanOutline} from '@mdi/js';
import { Calendar } from 'primereact/calendar';
import Select from '@/Components/Select';
import { Head } from '@inertiajs/react';
import { Toast } from 'primereact/toast'; 


const EditarUsuario = ({auth}) => {
  //toast
  const toast_global = useRef(null);

  //modal
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [sinArchivos,setSinArchivos] = useState([])

  //VARIABLES QUE ENTREGA EL CONTROLADOR
  const { usuario,roles,permisos} = usePage().props;
  const permisos_filter=permisos.filter(item=>!usuario.permissions.includes(item.name))
  const rol_filter = roles.filter(item=>item.name === usuario.roles[0])

  //PERMISOS
  const {hasRoles,hasPermission} = usePermission()

  //mensaje formulario
  const severity = { success:'success',error:'error'}
  const summary = { success:'Exito',error:'Error'}
  const showMsg = (msg,sev,sum) => {
      toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
  }

  const { data:dataEdit, setData:setDataEdit, post:postEdit, processing, errors:errorsEdit, reset: resetEdit } = useForm({
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    rut: usuario.rut,
    rol: rol_filter.name,
    permisos: usuario.permissions,
  });

  const { data:dataPermission, setData:setDataPermission, patch:patchPermission, errors:errorsPermission, reset: resetPermission } = useForm({
    permisos:[],
    opcion:''
  });

  //Tabla
  const [seleccion, setSeleccion] = useState([]);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "fecha",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const pages = Math.ceil(usuario.permissions.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return usuario.permissions.slice(start, end);
  }, [page, usuario.permissions, rowsPerPage]);
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  const [permissionSelect, setPermissionSelect] = useState("");

  const submitPermisosAdd = (e) => {
    e.preventDefault()
  }
  const submitPermisosDelete = (nombre) => {
    dataPermission.permisos = [nombre]
    dataPermission.opcion = 0
    patchPermission(route('gestion-usuarios.update-permission',String(usuario.id)),{
      onSuccess: () => {showMsg("Exito",severity.success,summary.success)},
      onError: () => {showMsg("Falló",severity.error,summary.error)}
    })
  }
  const submitUpdateData = (e) => {
    e.preventDefault()
  }

  //QUEDE AQUI, X ALGUNA RAZON LOS PERMISOS NO SE ACTUALIZAN DE UNA PERSONA

  return (
    <Authenticated user={auth.user}>
        <TitleTemplate>Editar usuario</TitleTemplate>
        <Head title='Editar usuario'></Head>
        <Toast ref={toast_global}></Toast>
        <ContentTemplate>
            <div className='p-8'>
              <form onSubmit={submitUpdateData}>
                <div className='w-full flex justify-between mb-6 '>
                  <div className='w-full me-12'>
                    <div className='w-full mb-5'>
                        <InputLabel value={"Nombres"}></InputLabel>
                        <TextInput className="w-full"  type={'text'} value={dataEdit.nombres} onChange={(e) => setDataEdit('nombres',e.target.value)} ></TextInput>
                        <InputError message={errorsEdit.nombres} className="mt-2" />
                    </div>
                    <div className='w-full mb-5'>
                        <InputLabel value={"Apellidos"}></InputLabel>
                        <TextInput className="w-full"  type={'text'} value={dataEdit.apellidos} onChange={(e) => setDataEdit('apellidos',e.target.value)} ></TextInput>
                        <InputError message={errorsEdit.apellidos} className="mt-2" />
                    </div>
                    <div className='w-full mb-5'>
                        <InputLabel value={"Correo"}></InputLabel>
                        <TextInput className="w-full" disabled={true} type={'text'} value={dataEdit.correo} ></TextInput>
                    </div>
                    <div className='w-full mb-5'>
                      <InputLabel value={"Rol"}></InputLabel>
                      <RadioGroup color="secondary" defaultValue={rol_filter[0].id}>
                        {
                          roles.map((rol)=>(
                            <Radio key={rol.id} value={rol.id}>{rol.name}</Radio>
                          ))
                        }
                      </RadioGroup>
                    </div>
                    <div className='w-full mb-5'>
                      <InputLabel value={"Resetear contraseña"}></InputLabel>
                      <Button color='danger' variant='flat'>Resetar contraseña</Button>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='flex mb-2'>
                      <div className='w-full flex'>
                        <InputLabel value={"Agregar permiso: "} className='flex items-center me-5'></InputLabel>
                        <Dropdown>
                          <DropdownTrigger className="hidden sm:flex">
                            <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                              Permisos
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu   aria-label="Table Columns" id='permission' selectedKeys={permissionSelect} style={{maxHeight:"300px"}} className='overflow-hidden whitespace-nowrap overflow-y-scroll'
                            onSelectionChange={setPermissionSelect} closeOnSelect={false} selectionMode="multiple" items={permisos_filter}>
                            {
                              (permiso)=>(
                                <DropdownItem key={permiso.id}>{permiso.name}</DropdownItem>
                              )
                            }
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      <div className='w-full justify-end flex'>
                        <Button className='' color='danger' variant='flat' >Quitar seleccionados</Button>
                      </div>
                    </div>
                    <Table aria-label="Tabla documentos" color={"primary"} selectionMode="multiple"
                    selectedKeys={seleccion} onSelectionChange={setSeleccion} 
                    bottomContent={ 
                      <div className="flex w-full justify-center">
                        <Pagination isCompact showControls showShadow color="secondary" page={page}
                          total={pages} onChange={(page) => setPage(page)} />
                      </div>
                    }>
                      <TableHeader>
                          <TableColumn className='text-start text-small'>Permiso</TableColumn>
                          <TableColumn className='text-start text-small'>Acción</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {
                          sortedItems.map((permiso,index)=>(
                            <TableRow key={index}>
                              <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{permiso}</TableCell>
                              <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                                {
                                  <Button color='danger' endContent={<Icon size={1} path={mdiTrashCanOutline} />} 
                                  onPress={() => submitPermisosDelete(permiso)} size='sm'></Button>
                                }
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className='w-full flex gap-5'>
                  <Link href={route("gestion-usuarios.index")} className='w-full'>
                      <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                  </Link>
                  <Button className='w-full text-large' color='primary' variant='ghost' type='submit'>Guardar cambios</Button>
                </div>
              </form>
            </div>
        </ContentTemplate>
    </Authenticated>
  )
}

export default EditarUsuario
