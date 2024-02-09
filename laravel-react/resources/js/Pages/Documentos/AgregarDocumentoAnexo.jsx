import React,{useEffect, useState,useRef} from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import {Button, Divider, ModalContent, Modal, Pagination,Select as NextSelect, SelectItem as NextSelectItem,Checkbox,
    Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, useDisclosure, Progress} from "@nextui-org/react";
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast'
import { Head } from '@inertiajs/react';        
import { usePage ,Link,useForm} from '@inertiajs/react';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
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
   
   


const AgregarDocumentoAnexo = ({auth}) => {
  //toast
  const toast_global = useRef(null);

  //variables que conservan su estado
  const [docAnexos,setDocAnexos] = useState([])


  //recibo los datos desde el controlador
  const { id_doc,all_docs, tipos,autores,flash } = usePage().props;
  const [documentos,setDocumentos] = useState(all_docs)
  const getDocumentosLess = async () => {
    try {
      const response = await axios.get(`/api/all-documents/${id_doc}`); // Cambia la ruta según tu configuración
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
    id_doc:id_doc,
    estado:false
  });
  const {data:dataAddAnexo, setData:setDataAddAnexoo, delete:deleteAddAnexo,post:postAddAnexo,reset:resetAddAnexo}=useForm({
    documento_id:"",
    anexos:[]
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
    if (id_doc!==0){
      try {
        const response = await axios.get(`/api/documentos-anexos/${id}`); // Cambia la ruta según tu configuración
        // console.log('Documentos obtenidos:', response.data);
        setDocAnexos(response.data.datos)
        // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
      } catch (error) {
      }
    }
  }
  useEffect(()=>{
    if (id_doc!==0){
      data_mini.id_doc=id_doc;
      getDocumentsAnexos(id_doc)
    }
  },[id_doc])

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
    //console.log(data_mini)
    post_mini(route('documento-anexo.store'),{
      onSuccess: (msg) => {
        showMsg(msg.create,severity.success,summary.success)
        getDocumentsAnexos(id_doc);
        reset_mini('numero_documento','autor_documento','tipo_documento','fecha_documento')
        onCloseProgress()
      },
      onError: (errors) => {
        showMsg(errors.create,severity.error,summary.error)
        onCloseProgress()
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
    dataAddAnexo.documento_id=id_doc
    dataAddAnexo.anexos=datos
    setValuesAgregarAnexo(new Set([]))
    postAddAnexo(route('documento-anexo.agregar-existente'),{
        onSuccess: (msg) => {
            showMsg(msg.add_anexo,severity.success,summary.success)
            getDocumentosLess()
            getDocumentsAnexos(id_doc);
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
  
  //Tabla
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(docAnexos.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return docAnexos.slice(start, end);
  }, [page, docAnexos]);

  return (
    <Authenticated  user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar documento anexo</h2>}>
      <Head title="Agregar documento anexo" />
      <Toast ref={toast_global}></Toast>
      <TitleTemplate>
        Agregar documento
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
      <ContentTemplate>
        <h2>Formulario</h2>
        <div className='xl:p-5'>
            <div className='w-full'>
                <Link href={route('gestion-documento.create')}>
                    <Button className='text-white rounded-md w-full p-2 whitespace-normal text-center xl:text-large ' color='success' >Se agregó correctamente el documento, presione para agregar otro</Button>
                </Link>
            </div>
            <div className='p-5'>
                <Divider></Divider>
            </div>
            <div className='w-full'>
                <div className='mt-3 w-full'>
                    <div className='xl:flex w-full gap-4'>
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
                                }
                                }} >
                                Agregar documento existente
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                {
                    btnAgregarNuevo?
                    <>
                    <form onSubmit={submitMiniForm}>
                    <div className='lg:flex w-full justify-between mb-5 md:gap-4'>
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
                        <TextInput className={"w-full"} type={'number'} placeholder={"Ingrese número"} value={data_mini.numero_documento} onChange={(e) => setData_mini('numero_documento',e.target.value)}required ></TextInput>
                        <InputError message={errors_mini.numero_documento} className="mt-2" />
                        </div>
                        <div className="w-80 lg:me-4">
                          <InputLabel value={"Fecha"}></InputLabel>
                          <div className="card flex justify-content-center">
                              <Calendar value={data_mini.fecha_documento} placeholder='Ingrese fecha' locale="es" inputStyle={{"padding":"0.5rem "}} required onChange={(e) => setData_mini('fecha_documento',e.target.value)} readOnlyInput />
                          </div>
                          <InputError message={errors_mini.fecha_documento} className="mt-2" />
                        </div>
                        <div className='w-80 lg:me-4'>
                          <InputLabel value={"¿Se encuentra anulado?"}></InputLabel>
                          <Checkbox value={data_mini.estado} onChange={(e) => setData_mini('estado',e.target.checked)}  color="danger">Anulado</Checkbox>
                        </div>
                    </div>
                    
                    <div className='mt-3 w-full md:flex gap-8'>
                        <Link href={route("gestion-documento.index")} className='w-full'>
                        <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                        </Link>
                        <Button type='submit' disabled={stateBtnMiniForm} color='primary' variant='ghost'  className='w-full text-large' size='md'>Agregar documento anexo</Button>
                    </div>
                    </form>
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
                        <div className='md:flex items-center xl:gap-5'>
                            <Button type='text' size='lg' className="w-full" color='primary' variant='ghost'>Anexar documentos</Button>
                            <Link href={route("gestion-documento.index")} className='w-full'>
                                <Button className='w-full text-large' disabled={stateBtnAgregar} size='lg' color='warning' variant='ghost' >Volver atrás</Button>
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
                <h1>Documentos anexos</h1>
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
            </div>
        </div>
      </ContentTemplate>
    </Authenticated>
  )
}
export default AgregarDocumentoAnexo