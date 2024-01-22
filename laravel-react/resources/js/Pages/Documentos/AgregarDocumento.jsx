import React,{useState} from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import {Button, Input} from "@nextui-org/react";
import { Calendar } from 'primereact/calendar';
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
   


const AgregarDocumento = ({auth}) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    rut_documento: '',
    numero_documento: '',
    materia_documento: '',
    autor_documento: '',
    direccion_documento: '',
    archivo: "",
    fecha_documento: '',
    tipo_documento: '',
  });

  //aqui puedo recibir las direcciones
  const { direcciones, tipos,autores,flash } = usePage().props;

  const selectTipoDocumento = (value) => {
    setData('tipo_documento',value)
  };
  const selectAutorDocumento = (value) => {
    setData('autor_documento',value)
  };
  const selectDireccionDocumento = (value) => {
    setData('direccion_documento',value)
  };


  const submit = async (e) => {
    e.preventDefault();
    //console.log(data)
    post(route('documento.store'),{
      onSuccess: () => reset('materia_documento')
    });
  }


  return (
    <Authenticated  user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar documento</h2>}> 
      <TitleTemplate>
        Agregar documento
      </TitleTemplate>
      <ContentTemplate>
        <h2>Formulario</h2>
        {
          flash.success==null?
            <form className='p-8' onSubmit={submit} >
              <div className='flex w-full justify-between mb-5'>
                <div className="w-80">
                  <InputLabel value={"Selecciona tipo de documento"}></InputLabel>
                  <Select opciones={tipos} value={data.tipo_documento} onChange={selectTipoDocumento} required>
                  </Select>
                  <InputError message={errors.tipo_documento} className="mt-2" />
                </div>
                <div className="w-80">
                  <InputLabel value={"Selecciona autor de documento"}></InputLabel>
                  <Select opciones={autores} value={data.autor_documento} onChange={selectAutorDocumento} required>
                  </Select>
                  <InputError message={errors.autor_documento} className="mt-2" />
                </div>
                <div className="w-80">
                  <InputLabel value={"Selecciona direccion de documento"}></InputLabel>
                  <Select opciones={direcciones} value={data.direccion_documento} onChange={selectDireccionDocumento} required>
                  </Select>
                  <InputError message={errors.direccion_documento} className="mt-2" />
                </div>
              </div>
              <div className='w-full justify-between flex mb-5'>
                <div className="">
                  <InputLabel value={"Ingresa rut"}></InputLabel>
                  <TextInput type={'text'} value={data.rut_documento} onChange={(e) => setData('rut_documento',e.target.value)} ></TextInput>
                  <InputError message={errors.rut_documento} className="mt-2" />
                </div>
                <div className="">
                  <InputLabel value={"Ingresa numero de documento"}></InputLabel>
                  <TextInput type={'number'} value={data.numero_documento} onChange={(e) => setData('numero_documento',e.target.value)}required ></TextInput>
                  <InputError message={errors.numero_documento} className="mt-2" />
                </div>
                <div className=''>
                  <InputLabel value={"Ingresa materia de documento"}></InputLabel>
                  <TextInput type={'text'} value={data.materia_documento} onChange={(e) => setData('materia_documento',e.target.value)} ></TextInput>
                  <InputError message={errors.materia_documento} className="mt-2" />
                </div>
              </div>
              <div className='w-full flex justify-between mb-8 pr-10'>
                <div className="w-80">
                  <InputLabel value={"Ingresa fecha"}></InputLabel>
                  <div className="card flex justify-content-center">
                    <Calendar value={data.fecha_documento} locale="es"  required onChange={(e) => setData('fecha_documento',e.target.value)} readOnlyInput />
                  </div>
                  <InputError message={errors.fecha_documento} className="mt-2" />
                </div>
                <div className="w-80">
                  <InputLabel value={"Agregar archivo"}></InputLabel>
                  <input  onChange ={(e) => setData('archivo',e.target.files[0])} type='file' accept='.pdf' />
                  {/* <TextInput value={data.archivo} type={'file'} accept={'.pdf'} onChange={handleFileChange} required></TextInput> */}
                  <InputError message={errors.archivo} className="mt-2" />
                </div>
              </div>
              <div className='w-full mb-5'>
                <Button type='submit' color='success' className='w-full text-large' size='md'>Agregar</Button>
              </div>
            </form>:
            <div>
                <div className='w-full p-5'>
                  <div className='bg-success-500 text-white rounded-md p-2 text-center text-large'>Se agregó correctamente el documento</div>
                </div>
            </div>
        }
        
      </ContentTemplate>
    </Authenticated>
  )
}
export default AgregarDocumento