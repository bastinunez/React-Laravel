import React,{useEffect, useState,useRef} from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import {Button, Modal,ModalBody,ModalContent,ModalFooter,ModalHeader, Tooltip, useDisclosure,Select as NextSelect, SelectItem as NextSelectItem,Checkbox,
    Progress,PopoverContent,PopoverTrigger } from "@nextui-org/react";
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast'
import { Head } from '@inertiajs/react';        
import { usePage ,Link,useForm} from '@inertiajs/react';
import Icon from '@mdi/react';
import { mdiLockOutline,mdiHelpCircle,mdiLockOffOutline } from '@mdi/js';
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
   


const AgregarDocumento = ({auth}) => {
  //toast
  const toast_global = useRef(null);

  //variables que conservan su estado
  const [docAnexos,setDocAnexos] = useState([])

  //formularios
  const { data:data, setData:setData, post:post, processing:processing, errors:errors, reset:reset,progress} = useForm({
    rut_documento: '',
    numero_documento: '',
    materia_documento: ' ',
    autor_documento: 'DEFAULT',
    direccion_documento: 'DEFAULT',
    archivo: "",
    fecha_documento: '',
    tipo_documento: 'DEFAULT',
    estado:false
  });
  //recibo los datos desde el controlador
  const { direcciones,all_docs, tipos,autores,flash } = usePage().props;
  const [documentos,setDocumentos] = useState([])

  const selectTipoDocumento = (value) => {  setData('tipo_documento',value) };
  const selectAutorDocumento = (value) => {  setData('autor_documento',value) };
  const selectDireccionDocumento = (value) => { setData('direccion_documento',value) };

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
  useEffect(() => {
    if (flash.documentos!=null){
      setDocumentos(flash.documentos)
    }
  }, [flash.documentos]);


  //progress
  const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();

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

  //post
  const [stateBtn,setStateBtn] = useState(false)
  const submit = async (e) => {
    e.preventDefault();
    setStateBtn(true)
    onOpenProgress()
    post(route('gestion-documento.store'),{
      onSuccess: (msg) => { 
        reset('materia_documento'); setStateBtn(false);showMsg(msg.success,severity.success,summary.success);onCloseProgress()},
      onError: (errors) => {
        setStateBtn(false)
        showMsg(errors.create,severity.error,summary.error);onCloseProgress();setStateBtn(false)
      }
    });
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

  const {isOpen:isOpen, onOpen:onOpen, onClose:onClose} = useDisclosure();

    //formularios
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


  return (
    <Authenticated  user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar documento</h2>}>
      <Head title="Agregar documento" />
      <Toast ref={toast_global}></Toast>
      <TitleTemplate>
        Agregar documento
      </TitleTemplate>

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
        <form className='md:p-8' onSubmit={submit} >
          <div className='md:flex w-full justify-between gap-3 mb-1 lg:mb-5'>
            <div className="w-80">
              <InputLabel value={"Selecciona tipo de documento (*)"}></InputLabel>
              <Select opciones={tipos} value={data.tipo_documento} onChange={selectTipoDocumento} required>
              </Select>
              <InputError message={errors.tipo_documento} className="mt-2" />
            </div>
            <div className="w-80">
              <InputLabel value={"Selecciona autor de documento (*)"}></InputLabel>
              <div className='flex'>
              <Select opciones={autores} value={data.autor_documento} onChange={selectAutorDocumento} required>
              </Select>
              <Tooltip content={"¿No encuentra el autor?"}>
                <Button className='' isIconOnly startContent={<Icon path={mdiHelpCircle} size={1} />} onPress={onOpen} color='primary'></Button>
              </Tooltip>
              </div>
              
              <InputError message={errors.autor_documento} className="mt-2" />
            </div>
            <div className="w-80">
              <InputLabel value={"Selecciona direccion de documento (*)"}></InputLabel>
              <Select opciones={direcciones} value={data.direccion_documento} onChange={selectDireccionDocumento} required>
              </Select>
              <InputError message={errors.direccion_documento} className="mt-2" />
            </div>
          </div>
          <div className='md:flex w-full justify-between mb-1 lg:mb-5 gap-16'>
            <div className="w-80">
              <InputLabel value={"Ingresa rut (*)"}></InputLabel>
              <TextInput type={'text'} className="w-full" placeholder={'Debe contener guión y puntos'} value={data.rut_documento} onChange={(e) => setData('rut_documento',e.target.value)} ></TextInput>
              <InputError message={errors.rut_documento} className="mt-2" />
            </div>
            <div className="w-80">
              <InputLabel value={"Ingresa numero de documento (*)"}></InputLabel>
              <TextInput type={'number'} className="w-full" value={data.numero_documento} onChange={(e) => setData('numero_documento',e.target.value)}required ></TextInput>
              <InputError message={errors.numero_documento} className="mt-2" />
            </div>
            <div className='w-80'>
              <InputLabel value={"Ingresa materia de documento"}></InputLabel>
              <TextInput type={'text'} className="w-full" value={data.materia_documento} onChange={(e) => setData('materia_documento',e.target.value)} ></TextInput>
              <InputError message={errors.materia_documento} className="mt-2" />
            </div>
          </div>
          <div className='md:flex w-full justify-between mb-8 gap-2 md:pr-10'>
            <div className="w-80">
              <InputLabel value={"Ingresa fecha (*)"}></InputLabel>
              <div className="card flex justify-content-center">
                <Calendar value={data.fecha_documento} locale="es" dateFormat="dd/mm/yy" inputStyle={{"padding":"0.5rem "}}  required onChange={(e) => setData('fecha_documento',e.target.value)} readOnlyInput />
              </div>
              <InputError message={errors.fecha_documento} className="mt-2" />
            </div>
            <div className="w-80 mb-1">
              <InputLabel value={"Agregar archivo PDF (*)"}></InputLabel>
              <input onChange ={(e) => setData('archivo',e.target.files[0])} className='text-tiny md:text-small' type='file' accept='.pdf' />
              <InputError message={errors.archivo} className="mt-2" />
            </div>
            <div className='w-80'>
              <InputLabel value={"Marque si el documento se encuentra anulado"}></InputLabel>
              <Checkbox value={data.estado} onChange={(e) => setData('estado',e.target.checked)}  color="danger">Anulado</Checkbox>
            </div>
          </div>
          <div className='flex w-full mb-5 gap-3 md:gap-8'>
            <Link href={route('gestion-documento.index')} className='w-full'>
              <Button className='w-full text-large mb-1' color='warning' variant='ghost' >Volver atrás</Button>
            </Link>
            <Tooltip content="Confirmar y agregar" color='success'>
              <Button type='submit' disabled={stateBtn} color='success' variant='ghost' className='w-full text-large' size='md'>Agregar</Button>
            </Tooltip>
          </div>
          
        </form>
      </ContentTemplate>
    </Authenticated>
  )
}
export default AgregarDocumento
