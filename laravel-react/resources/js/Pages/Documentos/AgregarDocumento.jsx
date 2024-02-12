import React,{useEffect, useState,useRef} from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import {Button, Divider, Input, Tooltip, useDisclosure,Select as NextSelect, SelectItem as NextSelectItem,Checkbox,
    Popover,PopoverContent,PopoverTrigger } from "@nextui-org/react";
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
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
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
    materia_documento: '',
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
        showMsg(errors.create,severity.error,summary.error);onCloseProgress()
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


  return (
    <Authenticated  user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar documento</h2>}>
      <Head title="Agregar documento" />
      <Toast ref={toast_global}></Toast>
      <TitleTemplate>
        Agregar documento
      </TitleTemplate>
{/* 
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
      </Modal> */}

      <ContentTemplate> 
        <form className='md:p-8' onSubmit={submit} >
          <div className='md:flex w-full justify-between gap-3 mb-5'>
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
              <Popover 
                        showArrow
                        backdrop="opaque"
                        placement="right"
                        classNames={{
                        base: [  
                            // arrow color
                            "before:bg-default-200"
                        ],
                        content: [
                            "py-3 px-4 border border-default-200",
                            "bg-gradient-to-br from-white to-default-300",
                            "dark:from-default-100 dark:to-default-50",
                        ],
                        }}
                    >
                        <PopoverTrigger>
                        <Button isIconOnly endContent={<Icon path={mdiHelpCircle} size={1} />}></Button>
                        </PopoverTrigger>
                        <PopoverContent>
                        {(titleProps) => (
                            <div className="px-1 py-2 justify-center">
                              <h3 className="text-medium font-bold" {...titleProps}>
                                  ¿No encuentras el autor?
                              </h3>
                              <div className="text-medium justify-center">
                                <Link href={route('funcionario.create')} >
                                  <Button className='w-full' color='primary'>Agrega un autor</Button>
                                </Link>
                              </div>
                            </div>
                        )}
                        </PopoverContent>
                    </Popover>
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
          <div className='md:flex w-full justify-between mb-5'>
            <div className="">
              <InputLabel value={"Ingresa rut (*)"}></InputLabel>
              <TextInput type={'text'} value={data.rut_documento} onChange={(e) => setData('rut_documento',e.target.value)} ></TextInput>
              <InputError message={errors.rut_documento} className="mt-2" />
            </div>
            <div className="">
              <InputLabel value={"Ingresa numero de documento (*)"}></InputLabel>
              <TextInput type={'number'} value={data.numero_documento} onChange={(e) => setData('numero_documento',e.target.value)}required ></TextInput>
              <InputError message={errors.numero_documento} className="mt-2" />
            </div>
            <div className=''>
              <InputLabel value={"Ingresa materia de documento"}></InputLabel>
              <TextInput type={'text'} value={data.materia_documento} onChange={(e) => setData('materia_documento',e.target.value)} ></TextInput>
              <InputError message={errors.materia_documento} className="mt-2" />
            </div>
          </div>
          <div className='md:flex w-full justify-between mb-8 gap-2 md:pr-10'>
            <div className="w-80">
              <InputLabel value={"Ingresa fecha (*)"}></InputLabel>
              <div className="card flex justify-content-center">
                <Calendar value={data.fecha_documento} locale="es"  required onChange={(e) => setData('fecha_documento',e.target.value)} readOnlyInput />
              </div>
              <InputError message={errors.fecha_documento} className="mt-2" />
            </div>
            <div className="w-80">
              <InputLabel value={"Agregar archivo (*)"}></InputLabel>
              <input onChange ={(e) => setData('archivo',e.target.files[0])} className='text-tiny md:text-small' type='file' accept='.pdf' />
              <InputError message={errors.archivo} className="mt-2" />
            </div>
            <div className='w-80'>
              <InputLabel value={"Marque si el documento se encuentra anulado"}></InputLabel>
              <Checkbox value={data.estado} onChange={(e) => setData('estado',e.target.checked)}  color="danger">Anulado</Checkbox>
            </div>
          </div>
          <div className='flex w-full mb-5 gap-3 md:gap-8'>
            <Link href={route("gestion-documento.index")} className='w-full'>
              <Button className='w-full text-large' color='warning' variant='ghost' >Volver a gestión</Button>
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
