import React,{useEffect, useState,useRef} from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import {Button, Divider, ModalContent, Modal,ModalBody,ModalHeader,ModalFooter, Pagination,Select as NextSelect, SelectItem as NextSelectItem,Checkbox,
    Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, useDisclosure, Progress, Tooltip,Tabs, Tab} from "@nextui-org/react";
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast'
import { Head } from '@inertiajs/react';
import Icon from '@mdi/react';
import { mdiPlus,mdiHelpCircle,mdiHelpBoxMultipleOutline,mdiFileEyeOutline} from '@mdi/js';
import { usePage ,Link,useForm} from '@inertiajs/react';
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
   
   


const AgregarDocumentoAnexo = ({auth}) => {
  //toast
  const toast_global = useRef(null);

  //variables que conservan su estado
  const [docAnexos,setDocAnexos] = useState([])


  //recibo los datos desde el controlador
  const { doc,all_docs, tipos,autores,flash } = usePage().props;
  const [otrosAnexos,setOtrosAnexos] = useState(doc.otros_anexos)
  const [documentos,setDocumentos] = useState(all_docs)
  const getDocumentosLess = async () => {
    try {
      const response = await axios.get(`/api/all-documents/${doc.id}`);
      //console.log('Documentos obtenidos:', response.data);
      setDocumentos(response.data.documentos)
      // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  }

  //formularios
  const { data:data_mini, setData:setData_mini, post:post_mini, processing:processing_mini, errors:errors_mini, reset:reset_mini } = useForm({
    numero_documento: '',
    autor_documento: 'DEFAULT',
    fecha_documento: '',
    tipo_documento: 'DEFAULT',
    id_doc:doc.id,
    archivo:'',
    materia_documento: ' ',
    estado:false
  });
  const {data:dataAddAnexo, setData:setDataAddAnexoo, delete:deleteAddAnexo,post:postAddAnexo,reset:resetAddAnexo}=useForm({
    documento_id:"",
    anexos:[]
  });
  const {data:dataOtroAnexo, setData:setDataOtroAnexo, post:postOtroAnexo,errors:errorsOtroAnexo}=useForm({
    documento_id:doc.id,
    descripcion:'',
    archivo:''
  });


  const [btnAgregarNuevo,setBtnAgregarNuevo] = useState(true)
  const [btnAgregarExistente,setBtnAgregarExistente] = useState(false)

  useEffect(() => {
    if (flash.FormDocumento=="Success"){
      changeStateForm()
    }
  }, [flash.FormDocumento]);
  useEffect(() => {
    if (flash.IdDoc!=null){
      changeStateIdDoc(flash.IdDoc)
    }
  }, [flash.IdDoc]);

  const getDocumentsAnexos = async (id) => {
    if (doc.id!==0){
      try {
        const response = await axios.get(`/api/documentos-anexos/${id}`);
        // console.log('Documentos obtenidos:', response.data);
        setDocAnexos(response.data.datos)
        // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
      } catch (error) {
      }
    }
  }
  const getOtrosAnexos = async () => {
    try {
      const response = await axios.get(`/api/otros-anexos/${doc.id}`);
      setOtrosAnexos(response.data.datos)
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  }

  useEffect(()=>{
    if (doc.id!==0){
      data_mini.id_id=doc.id;
      getDocumentsAnexos(doc.id)
    }
  },[doc.id])

  //seleccion agregar doocs
  const [valuesAgregarAnexo, setValuesAgregarAnexo] = useState(new Set([]));
  const handleSelectionChange = (e) => {
      setValuesAgregarAnexo(new Set(e.target.value.split(",")));
  };

  //mensaje formulario
  const severity = { success:'success',error:'error'}
  const summary = { success:'Exito',error:'Error'}
  const showMsg = (msg,sev,sum) => {
      toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
  }


  //progress
  const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();


  //post
  const [stateBtnMiniForm,setStateBtnMiniForm] = useState(false)
  const submitMiniForm = (e) => {
    e.preventDefault()
    if (stateBtnMiniForm) {
      return;
    }
    setStateBtnMiniForm(true)
    onOpenProgress()
    post_mini(route('documento-anexo.store'),{
      onSuccess: (msg) => {
        showMsg(msg.create,severity.success,summary.success)
        getDocumentsAnexos(doc.id);
        reset_mini('numero_documento','autor_documento','tipo_documento','fecha_documento')
        onCloseProgress()
      },
      onError: (errors) => {
        showMsg(errors.create,severity.error,summary.error)
        onCloseProgress()
    }
    })
  }
  const [stateBtnOtroAnexo,setStateBtnOtroAnexo] = useState(false)
  const submitOtroAnexo = (e) => {
    e.preventDefault()
    setStateBtnOtroAnexo(true)
    onOpenProgress()
    postOtroAnexo(route('otro-anexo.store'),{
        onSuccess: (msg) => {
          getOtrosAnexos();showMsg(msg.create,severity.success,summary.success);onCloseProgress();setStateBtnOtroAnexo(false)
        },
        onError: (errors) => {
            showMsg(errors.create,severity.error,summary.error);onCloseProgress();setStateBtnOtroAnexo(false)
        }
    })

  }
  useEffect(()=>{
    setStateBtnMiniForm(false)
  },[data_mini])


  const [stateBtnAgregar,setStateBtnAgregar] = useState(false)
  //console.log("agregar:",stateBtnAgregar)
  const submitAgregarAnexo = (e) => {
    e.preventDefault()
    setStateBtnAgregar(true)
    onOpenProgress()
    let datos=""
    if (valuesAgregarAnexo=="all"){
        datos = all_docs.map(doc => doc.id)
    }else{
        const arraySeleccion = Array.from(valuesAgregarAnexo)
        datos = arraySeleccion.map(doc => doc)
    }
    dataAddAnexo.documento_id=doc.id
    dataAddAnexo.anexos=datos
    setValuesAgregarAnexo(new Set([]))
    postAddAnexo(route('documento-anexo.agregar-existente'),{
        onSuccess: (msg) => {
            showMsg(msg.add_anexo,severity.success,summary.success)
            getDocumentosLess()
            getDocumentsAnexos(doc.id);
            resetAddAnexo('anexos');
            setValuesAgregarAnexo(new Set([]))
            onCloseProgress()
        },
        onError: (msg) => {
            showMsg(msg.add_anexo,severity.error,summary.error)
            onCloseProgress()
        }
    })
  }
  useEffect(()=>{
    setStateBtnAgregar(false)
  },[dataAddAnexo])

  const {isOpen:isOpen, onOpen:onOpen, onClose:onClose} = useDisclosure();
  const {isOpen:isOpenVerDoc, onOpen:onOpenVerDoc, onOpenChange:onOpenChangeVerDoc} = useDisclosure();
  const { data:dataFuncionario, setData:setDataFuncionario, post:postFuncionario, errors:errorsFuncionario, reset:resetFuncionario} = useForm({
    nombres: '',
    apellidos: '',
  });

  const submitFuncionario = (e) => {
      e.preventDefault()
      onOpenProgress()
      postFuncionario(route('funcionario.store'),{
          onSuccess: (msg) => {showMsg(msg.create,severity.success,summary.success);onCloseProgress();onClose();resetFuncionario('nombres');resetFuncionario('apellidos')},
          onError: (msg) => {showMsg(msg.create,severity.error,summary.error);onCloseProgress()}
      })
  }
  
  //Tabla
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(docAnexos.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return docAnexos.slice(start, end);
  }, [page, docAnexos]);
  const pagesAnexos = Math.ceil(otrosAnexos.length / rowsPerPage);
  const itemsOtrosAnexos = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return otrosAnexos.slice(start, end);
  }, [page, otrosAnexos]);

  const mostrar = (documento) => {
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
    <Authenticated  user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar documento anexo</h2>}>
      <Head title="Agregar documento anexo" />
      <Toast ref={toast_global}></Toast>
      <TitleTemplate>
        Agregar documento anexo
      </TitleTemplate>
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
      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
              {
                  (onClose)=>(
                    <form onSubmit={submitFuncionario} className='p-8'>
                      <div className='xl:flex w-full mb-5 gap-10'>
                          <div className="w-full me-5">
                              <InputLabel value={"Ingresa nombres"}></InputLabel>
                              <TextInput type={'text'} className="w-full" placeholder={"Nombre Nombre"} value={dataFuncionario.nombres} onChange={(e) => setDataFuncionario('nombres',e.target.value)} ></TextInput>
                              <InputError message={errorsFuncionario.nombres} className="mt-2" />
                          </div>
                          <div className="w-full">
                              <InputLabel value={"Ingresa apellidos"}></InputLabel>
                              <TextInput type={'text'} className="w-full" placeholder={"Apellido Apellido"} value={dataFuncionario.apellidos} onChange={(e) => setDataFuncionario('apellidos',e.target.value)} ></TextInput>
                              <InputError message={errorsFuncionario.apellidos} className="mt-2" />
                          </div>
                      </div>
                      <div className='w-full xl:flex gap-10'>
                          <Button type='submit' color='primary' variant='ghost' className='w-full text-large'>Agregar</Button>
                      </div>
                  </form>
                  )
              }
          </ModalContent>
      </Modal>
      <Modal isOpen={isOpenVerDoc} onOpenChange={onOpenChangeVerDoc}>
          <ModalContent>
            {
              (onClose)=>(
                  <>
                    <ModalHeader>Información de documento padre</ModalHeader>
                    <ModalBody>
                        <div>
                                <p>Numero: {doc.numero}</p>
                                <p>Fecha: {doc.fecha}</p>
                                <p>Autor: {doc.autor}</p>
                                <p>Tipo: {doc.tipo}</p>
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Cerrar
                        </Button>
                    </ModalFooter>
                  </>
              )
            }
          </ModalContent>
      </Modal>
      <ContentTemplate>
        <div className='xl:p-5'>
            <div className='w-full'>
                <Link href={route('gestion-documento.create')}>
                    <Button className='rounded-md w-full p-2 whitespace-normal text-center xl:text-large ' color='success' >Presiona para agregar otro</Button>
                </Link>
            </div>
            <div className='py-2 lg;py-5'>
                <Divider></Divider>
            </div>
            <div className='w-full'>
                <div className='mt-1 w-full'>
                    <div className='flex w-full gap-4'>
                      <div className='w-full'>
                          <Button color='secondary' className='w-full text-medium' variant={btnAgregarNuevo?'solid':'ghost'} startContent={<Icon path={mdiPlus} size={1} />}  
                          onClick={() => { if(!btnAgregarNuevo){setBtnAgregarExistente(!btnAgregarExistente);setBtnAgregarNuevo(!btnAgregarNuevo)}}} >
                              <p className='flex lg:hidden'>Nuevo</p>
                              <p className='hidden lg:flex'>Agregar nuevo documento anexo</p>
                          </Button>
                      </div>
                      <div className='hidden sm:flex justify-center'>
                          <Tooltip content={"Ver datos de documento padre"}>
                              <Button startContent={<Icon path={mdiHelpBoxMultipleOutline} size={1}></Icon>} onPress={onOpenVerDoc}>
                                  <p className=''>Ver documento padre</p>
                              </Button>
                          </Tooltip>
                      </div>
                      <div className='w-full'>
                        <Button color='secondary' className='w-full text-medium'  variant={btnAgregarExistente?'solid':'ghost'} startContent={<Icon path={mdiPlus} size={1} />}  
                        onClick={() => {
                            if (!btnAgregarExistente){
                                setBtnAgregarExistente(!btnAgregarExistente);
                                setBtnAgregarNuevo(!btnAgregarNuevo)
                            }
                            }} >
                            <p className='flex lg:hidden'>Existente</p>
                            <p className='hidden lg:flex'>Agregar documento existente anexo</p>
                            
                        </Button>
                      </div>
                    </div>
                    <div className='flex sm:hidden justify-center'>
                        <Tooltip content={"Ver datos de documento padre"}>
                            <Button startContent={<Icon path={mdiHelpBoxMultipleOutline} size={1}></Icon>} onPress={onOpenVerDoc}>
                                <p className=''>Ver documento padre</p>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className='mt-3'>
                {
                    btnAgregarNuevo?
                    <>
                      <div className="mt-3 flex w-full flex-col">
                          <Tabs aria-label="Options" fullWidth color="secondary">
                              <Tab key="documentos" className='w-full' title="Documentos">
                                    {/* formulario para agregar nuevo documento anexo*/}
                                  <div className=''>
                                      <form onSubmit={submitMiniForm}>
                                          <div className=''>
                                            <div className='lg:flex w-full justify-between mb-2 md:gap-4'>
                                              <div className="w-full lg:me-4">
                                                  <InputLabel value={"Tipo de documento"}></InputLabel>
                                                  <Select opciones={tipos} value={data_mini.tipo_documento} onChange={(value) => setData_mini('tipo_documento', value)} required>
                                                  </Select>
                                                  <InputError message={errors_mini.tipo_documento} className="mt-2" />
                                              </div>
                                              <div className="w-full lg:me-4">
                                                  <InputLabel value={"Selecciona autor de documento (*)"}></InputLabel>
                                                  <div className='flex'>
                                                  <Select opciones={autores} value={data_mini.autor_documento} onChange={(value) => setData_mini('autor_documento', value)} required>
                                                  </Select>
                                                  <Tooltip content={"¿No encuentra el autor?"}>
                                                  <Button className='' isIconOnly startContent={<Icon path={mdiHelpCircle} size={1} />} onPress={onOpen} color='primary'></Button>
                                                  </Tooltip>
                                                  </div>
                                                  <InputError message={errors_mini.autor_documento} className="mt-2" />
                                              </div>
                                              <div className="w-full lg:me-4">
                                                  <InputLabel value={"Número de documento"}></InputLabel>
                                                  <TextInput className={"w-full"} type={'number'} placeholder={"Ingrese número"} value={data_mini.numero_documento} onChange={(e) => setData_mini('numero_documento',e.target.value)} required ></TextInput>
                                                  <InputError message={errors_mini.numero_documento} className="mt-2" />
                                              </div>
                                            </div>
                                            <div className='lg:flex w-full justify-between mb-2 md:gap-4'>
                                              <div className="w-full lg:me-4">
                                                  <InputLabel value={"Fecha"}></InputLabel>
                                                  <div className="card flex justify-content-center">
                                                      <Calendar value={data_mini.fecha_documento} placeholder='Ingrese fecha' locale="es"  dateFormat="dd/mm/yy" 
                                                      inputStyle={{"padding":"0.5rem "}} required onChange={(e) => setData_mini('fecha_documento',e.target.value)} readOnlyInput />
                                                  </div>
                                                  <InputError message={errors_mini.fecha_documento} className="mt-2" />
                                              </div>
                                              <div className='w-full lg:me-4'>
                                                  <InputLabel value={"¿Se encuentra anulado?"}></InputLabel>
                                                  <Checkbox value={data_mini.estado} onChange={(e) => setData_mini('estado',e.target.checked)} className='sm:mt-1' color="danger">Anulado</Checkbox>
                                              </div>
                                              <div className="w-full mb-1">
                                                  <InputLabel value={"Agregar archivo (*)"}></InputLabel>
                                                  <input onChange ={(e) => setData_mini('archivo',e.target.files[0])} className='text-tiny md:text-small' type='file' accept='.pdf' />
                                                  <InputError message={errors_mini.archivo} className="mt-2" />
                                              </div>
                                            </div>
                                          </div>
                                          <div className='w-full sm:flex gap-4 mt-3'>
                                              <Link href={route('gestion-documento.index')} className='w-full'>
                                                  <Button className='w-full text-large' color='warning' size='md' variant='ghost' >Volver atrás</Button>
                                              </Link>
                                              <Button id='submit_miniform' disabled={stateBtnMiniForm} color='primary' type='submit'
                                              variant='ghost'  className='w-full text-large' size='md'>Agregar documento anexo</Button>
                                          </div>
                                      </form>
                                  </div>
                              </Tab>
                              <Tab key="otro" title="Otro">
                              <div className=''>
                                      <form onSubmit={submitOtroAnexo}>
                                          <div className=''>
                                              <div className='lg:flex w-full justify-between mb-2 md:gap-4'>
                                                  <div className='w-full'>
                                                      <InputLabel value={"Ingrese descripcion"}></InputLabel>
                                                      <TextInput type={'text'} className='w-full' value={dataOtroAnexo.descripcion} onChange={(e) => setDataOtroAnexo('descripcion',e.target.value)} ></TextInput>
                                                  </div>
                                                  <div className="w-full mb-1">
                                                      <InputLabel value={"Agregar archivo (*)"}></InputLabel>
                                                      <input onChange ={(e) => setDataOtroAnexo('archivo',e.target.files[0])} className='text-tiny md:text-small' type='file'  />
                                                      <InputError message={errorsOtroAnexo.archivo} className="mt-2" />
                                                  </div>
                                              </div>
                                          </div>
                                          <div className='w-full sm:flex gap-4 mt-3'>
                                              <Link href={route('gestion-documento.index')} className='w-full'>
                                                  <Button className='w-full text-large' color='warning' size='md' variant='ghost' >Volver atrás</Button>
                                              </Link>
                                              <Button id='submit_miniform' disabled={stateBtnMiniForm} color='primary' type='submit'
                                              variant='ghost'  className='w-full text-large' size='md'>Agregar documento anexo</Button>
                                          </div>
                                      </form>
                                  </div>
                              </Tab>
                          </Tabs>
                      </div> 
                    </>
                    :
                    <>
                    <form onSubmit={submitAgregarAnexo} className='w-full xl:gap-5 xl:flex'>
                        <div className='w-full'>
                            <NextSelect label="Documentos para anexar: "
                            selectionMode="multiple" placeholder="Seleccionar documentos..."
                            selectedKeys={valuesAgregarAnexo} className="" onChange={handleSelectionChange} >
                                {
                                    documentos.map(
                                        (doc) => (
                                          <NextSelectItem key={doc.id} textValue={doc.numero}>
                                            <div className="flex flex-col">
                                                <span className="text-small">{"Documento número: " +doc.numero +" | Tipo: " +doc.tipo}</span>
                                                <span className="text-tiny">
                                                    {"Autor: "+ doc.autor +" | Dirección: "+ doc.direccion + " | Fecha: "+doc.fecha}
                                                </span>
                                            </div>
                                          </NextSelectItem>
                                        )
                                    )
                                }
                            </NextSelect>
                        </div>
                        <div className='sm:flex items-center xl:gap-5'>
                            <Button type='text' size='md' className="w-full" color='primary' variant='ghost'>Anexar documentos</Button>
                            <Link href={route("gestion-documento.index")} className='w-full'>
                                <Button className='w-full text-large' disabled={stateBtnAgregar} size='md' color='warning' variant='ghost' >Volver atrás</Button>
                            </Link>
                        </div>
                    </form>
                    </>
                }
                </div>
            </div>
            <div className='w-full mt-5'>
                <Divider></Divider>
            </div>
            <div className='w-full mt-5'>
                <Tabs aria-label="documentos" fullWidth color="Documentos">
                    <Tab key="documentos-anexos" title="Documentos anexos">
                      <Table  aria-label="Tabla documentos anexos" bottomContent={
                          <div className="flex w-full justify-center">
                          <Pagination
                              isCompact
                              showControls
                              showShadow
                              color="secondary"
                              page={page}
                              total={pages}
                              onChange={(page) => setPage(page)}
                          />
                          </div>
                      }
                      classNames={{
                          wrapper: "min-h-[222px]",
                      }}>
                          <TableHeader>
                              <TableColumn>Número</TableColumn>
                              <TableColumn>Tipo</TableColumn>
                              <TableColumn>Autor</TableColumn>
                              <TableColumn>Fecha</TableColumn>
                          </TableHeader>
                          <TableBody emptyContent={"Aún no hay documentos anexos"}>
                              {
                              items.map( (documento) => (
                                  <TableRow key={documento.id}>
                                  <TableCell>{documento.numero}</TableCell>
                                  <TableCell>{documento.tipo}</TableCell>
                                  <TableCell>{documento.autor_nombre} {documento.autor_apellido}</TableCell>
                                  <TableCell>{documento.fecha}</TableCell>
                                  </TableRow>
                              ) )
                              }
                              
                          </TableBody>
                      </Table>
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
                              total={pagesAnexos}
                              onChange={(page) => setPage(page)}
                          />
                          </div>
                      }
                      classNames={{
                          wrapper: "min-h-[222px]",
                      }}>
                          <TableHeader>
                              <TableColumn>ID anexo</TableColumn>
                              <TableColumn>Descripción</TableColumn>
                              <TableColumn>Acción</TableColumn>
                          </TableHeader>
                          <TableBody emptyContent={"Aún no hay anexos"}>
                              {
                              itemsOtrosAnexos.map( (documento,index) => (
                                  <TableRow key={index}>
                                    <TableCell>{documento.otro_doc_id_anexo}</TableCell>
                                    <TableCell>{documento.datos_anexo.descripcion}</TableCell>
                                    <TableCell>
                                      <Button className="me-1" size='sm'  color='secondary' variant='flat' onPress={()=>mostrar(documento)}> 
                                        {/* active={route().current('documento.visualizar')} */}
                                        <Icon path={mdiFileEyeOutline} size={1} />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                              ) )
                              }
                              
                          </TableBody>
                      </Table>
                    </Tab>
                </Tabs>
            </div>
        </div>
      </ContentTemplate>
    </Authenticated>
  )
}
export default AgregarDocumentoAnexo