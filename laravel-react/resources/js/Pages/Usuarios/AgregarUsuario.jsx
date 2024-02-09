import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React, { useState, useEffect, useRef, useMemo} from 'react'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';        
import { usePage ,Link,useForm} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,Select as NextSelect, SelectItem as NextSelectItem,
    Table, TableBody, TableColumn, TableHeader, TableCell,TableRow,Pagination, Divider, Input,Progress} from '@nextui-org/react';
import Icon from '@mdi/react';
import { mdiDownloadOutline, mdiTrashCanOutline } from '@mdi/js';
import * as XLSX from "xlsx";


const AgregarUsuario = ({auth}) => {
    //toast
    const toast_global = useRef(null);

    //PERMISOS
    const {hasRoles,hasPermission} = usePermission()

    //VARIABLES QUE ENTREGA EL CONTROLADOR
    const { roles } = usePage().props;

    const [btnAgregarManual,setbtnAgregarManual] = useState(true)
    const [btnAgregarXlsx,setBtnAgregarXlsx] = useState(false)

    //formularios
    const { data:data, setData:setData, post:post, processing:processing, errors:errors, reset:reset} = useForm({
        nombres:'',
        apellidos:'',
        rut:'',
        rol:'',
    });
    const { data:dataExcel, setData:setDataExcel, post:postExcel, processing:processingExcel, errors:errorsExcel, reset:resetExcel} = useForm({
        archivo:'',
        nombres:'',
        apellidos:'',
        rut:'',
        rol:''
    });

    //MODAL
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [modalPlacement, setModalPlacement] = useState("auto");
    const [dataModal,setDataModal] = useState('')

    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }

    const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();

    const submit = (e) => {
        e.preventDefault()
        onOpenProgress()
        post(route('gestion-usuarios.store'),{
            onSuccess: (msg) => {showMsg(msg.create,severity.success,summary.success);onCloseProgress()},
            onError: (msg) => {showMsg(msg.create,severity.error,summary.error);onCloseProgress()},
        })
    }

    const submitExcel = (e) => {
        e.preventDefault()
        //console.log(dataExcel)
        onOpenProgress()
        const reader = new FileReader();
        reader.readAsArrayBuffer(dataExcel.archivo);
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            // Suponiendo que el primer sheet (hoja) contiene los datos
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const usuarios = XLSX.utils.sheet_to_json(sheet);

            let cargarUsuarios = true;
            // Ahora puedes procesar los datos y realizar la llamada a la API
            let cont_i=1
            for (const usuario of usuarios) {
                if (!usuario.apellidos || !usuario.nombres || !usuario.rut || !usuario.role) {
                    setDataModal(`Hay datos vacíos para un usuario, revisa el archivo. Fila: ${cont_i}`)
                    onOpen()
                    cargarUsuarios = false;
                    return;
                } else {
                  try {
                    const response = await axios.get(`/api/find-user/${usuario.rut}`);
                    if (response.data.filas.length!=0) {
                        setDataModal(`El usuario con rut: ${usuario.rut} ya se encuentra registrado, modifica para seguir`)
                        onOpen()
                        cargarUsuarios = false;
                        return;
                    }else{
                        //console.log("No se encuentra puede seguir")
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }
                cont_i++
            }
            if(cargarUsuarios){
                try {
                  usuarios.forEach(async (usuario) => {
                    dataExcel.nombres=usuario.nombres
                    dataExcel.apellidos=usuario.apellidos
                    dataExcel.rut=usuario.rut
                    if (usuario.role=="Usuario"){
                        dataExcel.rol=1
                    }else if (usuario.role=="Digitador"){
                        dataExcel.rol=2
                    }else if (usuario.role=="Administrador"){
                        dataExcel.rol=3
                    }
                    else{
                        setDataModal(`Nombre incorrecto de rol: ${dataExcel.nombres} ${dataExcel.apellidos}`)
                        onOpen()
                    }
                    if (dataExcel.rol==1 || dataExcel.rol==2 || dataExcel.rol==3){
                        postExcel(route('gestion-usuarios.store'),{
                            onSuccess: (msg) => {showMsg(msg.create,severity.success,summary.success);onCloseProgress()},
                            onError: (msg) => {showMsg(msg.create,severity.error,summary.error);onCloseProgress()},
                        })
                    }
                  });
                } catch (error) {
                    
                }
              } 
        }
    }

    const getTemplate = (e) => {
        const path = '/assets/plantilla-usuarios.xlsx';
        const link = document.createElement('a');
        link.href = path;
        link.download = 'plantilla-usuarios.xlsx';
    
        document.body.appendChild(link);
        link.click();
    
        document.body.removeChild(link);
    }
    


    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar usuario</h2>}>
            <Head title="Agregar Usuario"></Head>
            <TitleTemplate>Agregar usuario</TitleTemplate>
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
            <ContentTemplate>
                <div className='p-8'>
                    {/* Seleccionar accion */}
                    <div className='xl:flex w-full xl:gap-4'>
                        {
                            hasPermission('Crear usuario')?
                            <>
                                <div className='w-full'>
                                    <Button color='secondary' className='w-full text-medium' variant={btnAgregarManual?'solid':'ghost'} 
                                    onClick={() => { if(!btnAgregarManual){setBtnAgregarXlsx(!btnAgregarXlsx);setbtnAgregarManual(!btnAgregarManual)}}} >
                                        Agregar usuario manualmente
                                    </Button>
                                </div>
                            </>
                            :
                            <></>
                        }
                        {
                            hasPermission('Cargar usuarios xlsx')?
                            <>
                                <div className='w-full'>
                                    <Button color='secondary' className='w-full text-medium'  variant={btnAgregarXlsx?'solid':'ghost'} 
                                    onClick={() => {
                                        if (!btnAgregarXlsx){
                                            setBtnAgregarXlsx(!btnAgregarXlsx);setbtnAgregarManual(!btnAgregarManual)
                                        }
                                        }} >
                                        Cargar vía XLSX
                                    </Button>
                                </div>
                            </>
                            :
                            <></>
                        }
                       
                    </div>
                    <Divider className='mt-10 w-full'></Divider>
                    <div className='mt-10 w-full'>
                        {
                            btnAgregarManual?
                            //se muestra formulario de agregar usuario
                            <>
                                <form onSubmit={submit}>
                                    <div className='w-full justify-between xl:flex mb-7 gap-10'>
                                        <div className="w-full">
                                            <InputLabel value={"Ingresa nombres"}></InputLabel>
                                            <TextInput type={'text'} className="w-full" placeholder={"Nombre Nombre"} value={data.nombres} onChange={(e) => setData('nombres',e.target.value)} required></TextInput>
                                            <InputError message={errors.nombres} className="mt-2" />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel value={"Ingresa apellidos"}></InputLabel>
                                            <TextInput type={'text'} className="w-full" placeholder={"Apellido Apellido"} value={data.apellidos} onChange={(e) => setData('apellidos',e.target.value)} required ></TextInput>
                                            <InputError message={errors.apellidos} className="mt-2" />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel value={"Ingresa rut"}></InputLabel>
                                            <TextInput type={'text'} className="w-full" placeholder={"XX.XXX.XXX-X"} value={data.rut} onChange={(e) => setData('rut',e.target.value)} required ></TextInput>
                                            <InputError message={errors.rut} className="mt-2" />
                                        </div>
                                        <div className='w-full'>
                                            <InputLabel value={"Selecciona rol"}></InputLabel>
                                            <Select opciones={roles} value={data.rol} onChange={(value) => setData('rol', value)} required>
                                            </Select>
                                            <InputError message={errors.rol} className="mt-2" />
                                        </div>
                                    </div>
                                    <div className='flex w-full gap-10'>
                                        <Link href={route("gestion-usuarios.index")} className='w-full'>
                                            <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                                        </Link>
                                        <Button className='w-full text-large' color='primary' variant='ghost' type='submit'>Registrar</Button>
                                    </div>
                                </form>
                            </>
                            :
                            //se muestra plantilla para cargar masivamente usuarios
                            <>
                                <form onSubmit={submitExcel}>
                                    <div className='justify-between flex mb-4'>
                                        <div className='w-full justify-center xl:flex mx-auto'>
                                            <div className='xl:me-2 mb-3 md:mb-0'>
                                                <InputLabel value={"Subir archivo"}></InputLabel>
                                                <Input type='file' accept='.xls, .xlsx' onChange ={(e) => setDataExcel('archivo',e.target.files[0])} >
                                                </Input>
                                                <InputError message={errors.archivo} className="mt-2" />
                                            </div>
                                            <div className='flex items-end'>
                                                <Button className='w-full' color='secondary' size='lg' onPress={()=>getTemplate()}>Descargar plantilla</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-3 md:flex gap-3'>
                                        <Link href={route("gestion-usuarios.index")} className='w-full'>
                                            <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                                        </Link>
                                        <Button className='w-full text-large' color='primary' variant='ghost' type='submit'>Subir archivo</Button>
                                    </div>
                                </form>
                                <Modal isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange} size="md" >
                                    <ModalContent>
                                    {(onClose) => (
                                        <>
                                        <ModalHeader className="flex flex-col gap-1">Error</ModalHeader>
                                        <ModalBody>
                                            <div>
                                                <h2>{dataModal}</h2>
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
                            </>
                        }
                    </div>
                </div>
            </ContentTemplate>
        </Authenticated>
  )
}

export default AgregarUsuario
