import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
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
        Table, TableBody, TableColumn, TableHeader, TableCell,TableRow,Pagination, Divider, Checkbox,Progress} from '@nextui-org/react';
import Icon from '@mdi/react';
import { mdiDownloadOutline, mdiTrashCanOutline } from '@mdi/js';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import { Head } from '@inertiajs/react';
import { DescargarDocumento } from '@/Composables/DownloadPDF'
locale('en');
addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
  //...
});

const EditarDocumento = ({auth}) => {
    //toast
    const toast_global = useRef(null);

    //modal
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [modalPlacement, setModalPlacement] = useState("auto");
    const [titleModal,setTitleModal] = useState('')
    const [contentModal,setContentModal] = useState('')
    const [functionName,setFunctionName] = useState('')

    //PERMISOS
    const {hasRoles,hasPermission} = usePermission()

    //VARIABLES QUE ENTREGA EL CONTROLADOR
    const { documento,all_docs,direcciones, tipos,autores,flash} = usePage().props;
    const [btnMetadato,setBtnMetadato] = useState(true)
    const [btnAnexos,setBtnAnexos] = useState(false)
    const [btnAgregarNuevo,setBtnAgregarNuevo] = useState(true)
    const [btnAgregarExistente,setBtnAgregarExistente] = useState(false)


    //Documentos anexos
    const datos=documento.anexos.map( anexo => anexo.datos_anexo )
    const [seleccion,setSeleccion] = useState([])
    const [docAnexos,setDocAnexos] = useState(datos)
    const [sinArchivos,setSinArchivos] = useState([])

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

    //seleccion agregar doocs
    const [valuesAgregarAnexo, setValuesAgregarAnexo] = useState(new Set([]));
    const handleSelectionChange = (e) => {
        setValuesAgregarAnexo(new Set(e.target.value.split(",")));
    };


    //formularios
    const matchAutor = autores.find(autor => documento.autor === (autor.nombres+" "+autor.apellidos))
    const matchDireccion = direcciones.find(direccion => documento.direccion === direccion.nombre)
    const matchTipo = tipos.find(tipo => documento.tipo === tipo.nombre)

    const { data:data, setData:setData, patch:patch, put, errors:errors,progress, reset:reset,post:post  } = useForm({
        rut_documento: documento.rut ? documento.rut:'',
        numero_documento: documento.numero,
        materia_documento: documento.materia?documento.materia:'',
        autor_documento: matchAutor.id,
        direccion_documento: documento.direccion?matchDireccion.id:'',
        archivo: documento.file? documento.file:"",
        //archivo: "",
        fecha_documento: new Date(`${documento.fecha}T00:00:00`),
        tipo_documento: matchTipo.id,
        estado:documento.estado == "Habilitado" ? false:true
    });
    const { data:data_mini, setData:setData_mini, post:post_mini, processing:processing_mini, errors:errors_mini, reset:reset_mini } = useForm({
        numero_documento: '',
        autor_documento: '',
        fecha_documento: '',
        tipo_documento: '',
        id_doc:documento.id,
        estado:false
    });
    const {data:dataDelete, setData:setDataDelete, delete:deleteAnexo,post:postDelete}=useForm({
        documento_id:documento.id,
        anexos:[]
    });
    const {data:dataAddAnexo, setData:setDataAddAnexoo,post:postAddAnexo,reset:resetAddAnexo}=useForm({
        documento_id:documento.id,
        anexos:[]
    });

    //esto puede ser cambiado (pendiente)
    useEffect(() => {
        if (flash.FormDocumento=="Success"){
          changeStateForm()
        }
    }, [flash.FormDocumento]);

    //Tabla
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const pages = Math.ceil(docAnexos.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return docAnexos.slice(start, end);
    }, [page, docAnexos, rowsPerPage]);

    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }

    const [isProgress,setIsProgress] = useState(false)
    const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();
    const {isOpen:isOpenArchivos, onOpen:onOpenArchivos, onOpenChange:onOpenChangeArchivos} = useDisclosure();

    const [stateBtnModal,setStateBtnModal] = useState(false)
    useEffect(()=>{
        setStateBtnModal(false)
    },[data,data_mini,seleccion,btnMetadato,btnAnexos,btnAgregarNuevo,btnAgregarExistente])

    //post
    const submit = async (e) => {
        // e.preventDefault();
        //console.log(data)
        setStateBtnModal(true)
        onOpenProgress()
        post(route('gestion-documento.update-doc',String(documento.id)),{
            onSuccess: (msg) => {showMsg(msg.update,severity.success,summary.success);setIsProgress(false);onCloseProgress();setStateBtnModal(false)},
            onError: (msg) => {showMsg(msg.update,severity.error,summary.error);setIsProgress(false);onCloseProgress();setStateBtnModal(false)}
        });
    }
    const [stateBtnMiniForm,setStateBtnMiniForm] = useState(false)
    const submitMiniForm = (e) => {
        e.preventDefault()
        setStateBtnMiniForm(true)
        onOpenProgress()
        post_mini(route('documento-anexo.store'),{
            onSuccess: (msg) => {
                getDocuments(documento.id);setStateBtnModal(true);
                reset_mini('numero_documento','autor_documento','tipo_documento','fecha_documento')
                showMsg(msg.create,severity.success,summary.success);onCloseProgress();setStateBtnModal(false)
            },
            onError: (errors) => {
                showMsg(errors.create,severity.error,summary.error);onCloseProgress();setStateBtnModal(false)
            }
        })

    }
    const submitAgregarAnexo = (e) => {
        e.preventDefault()
        let datos=""
        if (valuesAgregarAnexo=="all"){
            datos = all_docs.map(doc => doc.id)
        }else{
            const arraySeleccion = Array.from(valuesAgregarAnexo)
            datos = arraySeleccion.map(doc => doc)
        }
        dataAddAnexo.anexos=datos
        onOpenProgress()
        setValuesAgregarAnexo(new Set([]))
        postAddAnexo(route('documento-anexo.agregar-existente'),{
            onSuccess: (msg) => {
                showMsg(msg.add_anexo,severity.success,summary.success)
                getDocuments(documento.id);
                resetAddAnexo('anexos');
                setValuesAgregarAnexo(new Set([]));onCloseProgress();setStateBtnModal(false)
                
            },
            onError: (msg) => {
                showMsg(msg.add_anexo,severity.error,summary.error);onCloseProgress();setStateBtnModal(false)
            }
        })
    }
    
    const quitarDocAnexoSeleccion = () => {
        if (seleccion.length!=0){
            let datos=""
            setStateBtnModal(true)
            if (seleccion=="all"){
                datos = docAnexos.map(doc => doc.id)
                console.log("all")
            }else{
                const arraySeleccion = Array.from(seleccion)
                datos = arraySeleccion.map(doc => doc)
            }
            dataDelete.anexos=datos
            onOpenProgress()
            deleteAnexo(route('documento-anexo.destroy',documento.id),{
                onSuccess: (msg) => {setSeleccion([]);getDocuments();showMsg(msg.destroy,severity.success,summary.success);onCloseProgress();setStateBtnModal(false)},
                onError: (msg) => {showMsg(msg.destroy,severity.error,summary.error);onCloseProgress();setStateBtnModal(false)}
            })
        }else{
            showMsg("No seleccionaste datos",severity.error,summary.error)
          }
    }
    const quitarDocAnexoButton = (id_anexo) => {
        dataDelete.anexos=[id_anexo]
        setStateBtnModal(true)
        onOpenProgress()
        deleteAnexo(route('documento-anexo.destroy',id_anexo),{
            onSuccess: (msg) => {setSeleccion([]);getDocuments();showMsg(msg.destroy,severity.success,summary.success);onCloseProgress();setStateBtnModal(false)},
            onError: (msg) => { showMsg(msg.destroy,severity.error,summary.error);onCloseProgress();setStateBtnModal(false)}
        })

    }

    const descargarDocAnexoSeleccion = () => {
        if (seleccion.length!=0){
            setStateBtnModal(true)
            const respSinArchivos = DescargarDocumento(seleccion,docAnexos);
            if (respSinArchivos.length !== 0){
                setSinArchivos(respSinArchivos)
                onOpenArchivos()
            }
            setStateBtnModal(false)
        }else{
            showMsg("No seleccionaste datos",severity.error,summary.error)
          }
    }

    

    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Documentos</h2>}>
            <Head title="Editar Documento" />
            <div>
                <TitleTemplate>Editar Documento</TitleTemplate>
                <Toast ref={toast_global} />

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

                <Modal isOpen={isOpenArchivos} placement={modalPlacement} onOpenChange={onOpenChangeArchivos} size="xl" >
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
                
                <ContentTemplate>
                    <div className='md:p-5'>
                        {/* Seleccionar accion (Editar metadatos/editar doc. anexos) */}
                        <div className='md:flex w-full gap-4'>
                                <div className='w-full'>
                                    <Button color='secondary' className='w-full text-medium' variant={btnMetadato?'solid':'ghost'} 
                                    onClick={() => { if(!btnMetadato){setBtnAnexos(!btnAnexos);setBtnMetadato(!btnMetadato)}}} >
                                        Editar metadatos Documento
                                    </Button>
                                </div>
                                <div className='w-full'>
                                    <Button color='secondary' className='w-full text-medium'  variant={btnAnexos?'solid':'ghost'} 
                                    onClick={() => {
                                        if (!btnAnexos){
                                            setBtnAnexos(!btnAnexos);setBtnMetadato(!btnMetadato)
                                        }
                                        }} >
                                        Editar documentos anexos
                                    </Button>
                                </div>
                        </div>
                        <Divider className='mt-5 w-full'></Divider>
                        <div className='mt-5 w-full'>
                            {
                                btnMetadato?
                                // se muestra formulario de editar metadatos
                                <>
                                    <form className='md:p-8' onSubmit={submit} >
                                        <div className='md:flex w-full justify-between md:mb-5 md:gap-3 '>
                                            <div className="w-full">
                                                <InputLabel value={"Selecciona tipo de documento"}></InputLabel>
                                                <Select opciones={tipos} value={data.tipo_documento} onChange={(value) => {setData('tipo_documento', value)}} required>
                                                </Select>
                                                <InputError message={errors.tipo_documento} className="mt-2" />
                                            </div>
                                            <div className="w-full">
                                                <InputLabel value={"Selecciona autor de documento"}></InputLabel>
                                                <Select opciones={autores} value={data.autor_documento} onChange={(value) => setData('autor_documento', value)} required>
                                                </Select>
                                                <InputError message={errors.autor_documento} className="mt-2" />
                                            </div>
                                            <div className="w-full">
                                                <InputLabel value={"Selecciona direccion de documento"}></InputLabel>
                                                <Select opciones={direcciones} value={data.direccion_documento} onChange={(value) => setData('direccion_documento', value)} required>
                                                </Select>
                                                <InputError message={errors.direccion_documento} className="mt-2" />
                                            </div>
                                        </div>
                                        <div className='w-full justify-between md:flex md:mb-5 md:gap-3'>
                                            <div className="w-full">
                                                <InputLabel value={"Ingresa rut"}></InputLabel>
                                                <TextInput type={'text'} className='w-full' value={data.rut_documento} onChange={(e) => setData('rut_documento',e.target.value)} ></TextInput>
                                                <InputError message={errors.rut_documento} className="mt-2" />
                                            </div>
                                            <div className="w-full">
                                                <InputLabel value={"Ingresa numero de documento"}></InputLabel>
                                                <TextInput type={'number'} className='w-full' disabled={true} value={data.numero_documento} onChange={(e) => setData('numero_documento',e.target.value)}required ></TextInput>
                                                <InputError message={errors.numero_documento} className="mt-2" />
                                            </div>
                                            <div className='w-full'>
                                                <InputLabel value={"Ingresa materia de documento"}></InputLabel>
                                                <TextInput type={'text'} className='w-full' value={data.materia_documento} onChange={(e) => setData('materia_documento',e.target.value)} ></TextInput>
                                                <InputError message={errors.materia_documento} className="mt-2" />
                                            </div>
                                        </div>
                                        <div className='w-full md:flex justify-between md:mb-8  md:gap-3'>
                                            <div className="w-full">
                                                <InputLabel value={"Ingresa fecha"}></InputLabel>
                                                <div className="card flex justify-content-center">
                                                    <Calendar value={data.fecha_documento} locale="es"  required onChange={(e) => setData('fecha_documento',e.target.value)} readOnlyInput />
                                                </div>
                                                <InputError message={errors.fecha_documento} className="mt-2" />
                                            </div>
                                            <div className="w-full mb-2">
                                                <InputLabel value={"Agregar archivo"}></InputLabel>
                                                <input  onChange ={(e) => setData('archivo',e.target.files[0])} type='file' accept='.pdf' id="inputArchivo"
                                                    style={{ display: 'none' }}  
                                                    />
                                                 <label htmlFor="inputArchivo" style={{ cursor: 'pointer', padding: '', border: '1px solid #ccc' }}>
                                                    {data.archivo ? `Archivo seleccionado ${documento.name_file}` : 'Seleccionar archivo PDF'}
                                                </label>
                                                {/* <input onChange ={(e) => setData('archivo',e.target.files[0])} className='text-tiny md:text-small'  */}
                                                {/* type='file' accept='.pdf' formEncType="multipart/form-data"/> */}
                                                <InputError message={errors.archivo} className="mt-2" />
                                                <Button onPress={()=>setData('archivo','')} color='danger' className='md:ms-1 w-full'>Quitar archivo</Button>
                                            </div>
                                            <div className='w-full'>
                                                <InputLabel value={"Marque si el documento se encuentra anulado"}></InputLabel>
                                                <Checkbox value={data.estado} onChange={(e) => setData('estado',e.target.checked)} isSelected={data.estado} color="danger">Anulado</Checkbox>
                                            </div>
                                        </div>
                                        <div className='w-full flex mb-5 gap-5'>
                                            <Link href={route('gestion-documento.index')} className='w-full'>
                                                <Button className='w-full text-large' color='warning' size='md' variant='ghost' >Volver atrás</Button>
                                            </Link>
                                            <Tooltip content="Confirmar cambios y agregar" color='success'>
                                                <Button onPress={()=>{
                                                    setFunctionName(() => () => submit());setTitleModal('Guardar cambios');
                                                    setContentModal('¿Está seguro de aplicar los cambios?');onOpen();}}  
                                                color='success' variant='ghost' className='w-full text-large' size='md'>Guardar cambios</Button>
                                            </Tooltip>
                                            
                                        </div>
                                    </form>
                                </>
                                :
                                // se muestra formulario para documentos anexos
                                <>
                                    <div>
                                        {/* Seleccionar accion (Agregar nuevo documento/Agregar documento existentte) */}
                                        <div className='mt-5 w-full'>
                                            <div className='md:flex w-full gap-4'>
                                                <div className='w-full'>
                                                    <Button color='secondary' className='w-full text-medium' variant={btnAgregarNuevo?'solid':'ghost'}  
                                                    onClick={() => { if(!btnAgregarNuevo){setBtnAgregarExistente(!btnAgregarExistente);setBtnAgregarNuevo(!btnAgregarNuevo)}}} >
                                                        Agregar nuevo documento
                                                    </Button>
                                                </div>
                                                <div className='w-full'>
                                                    <Button color='secondary' className='w-full text-medium'  variant={btnAgregarExistente?'solid':'ghost'} 
                                                    onClick={() => {
                                                        if (!btnAgregarExistente){
                                                            setBtnAgregarExistente(!btnAgregarExistente);
                                                            setBtnAgregarNuevo(!btnAgregarNuevo)
                                                            // if(allDocuments.length==0){
                                                            //     getAllDocs()
                                                            // }
                                                        }
                                                        }} >
                                                        Agregar documento existente
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        btnAgregarNuevo?
                                        <>
                                            {/* formulario para agregar nuevo documento anexo*/}
                                            <div className='mt-5'>
                                                <form onSubmit={submitMiniForm}>
                                                    <div className='md:flex w-full justify-between mb-5 gap-3'>
                                                        <div className="w-80 lg:me-4">
                                                            <InputLabel value={"Tipo de documento"}></InputLabel>
                                                            <Select opciones={tipos} value={data_mini.tipo_documento} onChange={(value) => setData_mini('tipo_documento', value)} required>
                                                            </Select>
                                                            <InputError message={errors_mini.tipo_documento} className="mt-2" />
                                                        </div>
                                                        <div className="w-80 lg:me-4">
                                                            <InputLabel value={"Autor de documento"}></InputLabel>
                                                            <Select opciones={autores} value={data_mini.autor_documento} onChange={(value) => setData_mini('autor_documento', value)}  required>
                                                            </Select>
                                                            <InputError message={errors_mini.autor_documento} className="mt-2" />
                                                        </div>
                                                        <div className="w-80 lg:me-4">
                                                            <InputLabel value={"Número de documento"}></InputLabel>
                                                            <TextInput className={"w-full"} placeholder={"Ingresa número"} type={'number'} value={data_mini.numero_documento} onChange={(e) => setData_mini('numero_documento',e.target.value)}required ></TextInput>
                                                            <InputError message={errors_mini.numero_documento} className="mt-2" />
                                                        </div>
                                                        <div className="w-80 lg:me-4">
                                                            <InputLabel value={"Fecha"}></InputLabel>
                                                            <div className="card flex justify-content-center">
                                                                <Calendar value={data_mini.fecha_documento} placeholder={"Ingresa fecha"} locale="es" inputStyle={{"padding":"0.5rem "}} required onChange={(e) => setData_mini('fecha_documento',e.target.value)} readOnlyInput />
                                                            </div>
                                                            <InputError message={errors_mini.fecha_documento} className="mt-2" />
                                                        </div>
                                                        <div className='w-80 lg:me-4'>
                                                            <InputLabel value={"¿Se encuentra anulado?"}></InputLabel>
                                                            <Checkbox value={data_mini.estado} onChange={(e) => setData_mini('estado',e.target.checked)}  color="danger">Anulado</Checkbox>
                                                        </div>
                                                    </div>
                                                    <div className='w-full md:flex gap-4 mt-3'>
                                                        <Link href={route('gestion-documento.index')} className='w-full'>
                                                            <Button className='w-full text-large' color='warning' size='md' variant='ghost' >Volver atrás</Button>
                                                        </Link>
                                                        <Button id='submit_miniform' disabled={stateBtnMiniForm} color='primary' type='submit'
                                                        variant='ghost'  className='w-full text-large' size='md'>Agregar documento anexo</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        </>
                                        :
                                        <>
                                        {/* seleccionable para agregar documento anexo existente */}
                                            <div className='mt-5 '>
                                                <form onSubmit={submitAgregarAnexo} className='w-full gap-5 md:flex'>
                                                    <div className='w-full'>
                                                        <NextSelect label="Documentos para anexar: "
                                                        selectionMode="multiple" placeholder="Seleccionar documentos..."
                                                        selectedKeys={valuesAgregarAnexo} className="" onChange={handleSelectionChange} >
                                                            {
                                                                all_docs.map(
                                                                    (doc) => (
                                                                        <NextSelectItem key={doc.id} textValue={doc.numero +"/" +doc.anno}>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-small">{"Documento número: " +doc.numero +" | Año: " +doc.anno}</span>
                                                                                <span className="text-tiny">
                                                                                    {"Autor: "+ doc.autor +" | Tipo: "+doc.tipo+" | Dirección: "+ doc.direccion + " | Fecha: "+doc.fecha}
                                                                                </span>
                                                                            </div>
                                                                        </NextSelectItem>
                                                                    )
                                                                )
                                                            }
                                                            
                                                        </NextSelect>
                                                    </div>
                                                    <div className='flex items-center '>
                                                        <Button type='submit' className="w-full me-2" color='primary' variant='ghost'>Anexar documentos</Button>
                                                        <Link href={route('gestion-documento.index')} className='w-full'>
                                                            <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                                                        </Link>
                                                    </div>
                                                </form>
                                            </div>
                                        </>
                                    }
                                    
                                    <Divider className='mt-5'></Divider>
                                    {/* Tabla con los documentos actuales */}
                                    <div className='mt-5'>
                                        <div>
                                            <div className='flex justify-between mb-3'>
                                                <div className=''>
                                                    <h1 className='text-xl'></h1>
                                                </div>
                                                <div className='gap-4 flex'>
                                                    <Button color='danger' variant='solid' onPress={()=>{
                                                                            setFunctionName(() => () => quitarDocAnexoSeleccion());setTitleModal('Eliminar documentos anexos');
                                                                            setContentModal('¿Está seguro de eliminar los documentos?');onOpen();}} 
                                                    //onPress={quitarDocAnexoSeleccion} 
                                                    startContent={<Icon path={mdiTrashCanOutline} size={1} />}>
                                                        <p className='md:flex hidden'>Quitar seleccionados</p> </Button>
                                                    <Button color='primary' variant='solid' onPress={()=>{
                                                                            setFunctionName(() => () => descargarDocAnexoSeleccion());setTitleModal('Descargar documentos anexos');
                                                                            setContentModal('¿Está seguro de descargar los documentos?');onOpen();}} 
                                                    startContent={<Icon path={mdiDownloadOutline} size={1} />}>
                                                        <p className='md:flex hidden'>Descargar seleccionados</p></Button>
                                                </div>
                                            </div>
                                            <div className=''>
                                                <Table  aria-label="Tabla documentos anexos" selectionMode="multiple"
                                                selectedKeys={seleccion} onSelectionChange={setSeleccion}
                                                bottomContent={
                                                    <div className="flex w-full justify-center">
                                                        <Pagination isCompact showControls showShadow color="secondary" page={page}
                                                         total={pages} onChange={(page) => setPage(page)} />
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
                                                            items.map( (doc_anexo) => (
                                                            <TableRow key={doc_anexo.id}>
                                                                <TableCell>{doc_anexo.id}</TableCell>
                                                                <TableCell>{doc_anexo.numero}</TableCell>
                                                                <TableCell>{doc_anexo.tipo}</TableCell>
                                                                <TableCell> {doc_anexo.autor?doc_anexo.autor:doc_anexo.autor_nombre +" "+doc_anexo.autor_apellido} </TableCell>
                                                                <TableCell>{doc_anexo.fecha}</TableCell>
                                                                <TableCell>
                                                                    <Tooltip content={"Quitar"} color='danger'>
                                                                        <Button onPress={()=>{
                                                                            setFunctionName(() => () => quitarDocAnexoButton(doc_anexo.id));setTitleModal('Eliminar documentos anexos');
                                                                            setContentModal('¿Está seguro de eliminar los documentos?');onOpen();}} 
                                                                            // onPress={() => quitarDocAnexoButton(doc_anexo.id)} 
                                                                            className="" size='sm' color='danger' variant='flat'> 
                                                                            <Icon path={mdiTrashCanOutline} size={1}/>
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
                                    </div>
                                </>
                            }
                        </div>
                        
                    </div>
                </ContentTemplate>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">{titleModal}</ModalHeader>
                        <ModalBody>
                            {
                                <p>{contentModal}</p>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" disabled={stateBtnModal} onPress={onClose} onClick={()=>functionName()}>
                                Confirmar
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                    </ModalContent>
                </Modal>
            </div>
        </Authenticated>
    )
}

export default EditarDocumento
