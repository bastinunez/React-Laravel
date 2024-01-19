import React,{useState} from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import {Input} from "@nextui-org/react";
import Select from '@/Components/Select'
import { usePage ,Link} from '@inertiajs/react';

const AgregarDocumento = ({auth}) => {
  const [rutDocumento,setRutDocumento] = useState('')
  const [numero,setNumeroDocumento] = useState('')
  const [materiaDocumento,setMateria] = useState('')
  const [autorDocumento,setAutor] = useState('')
  const [direccionDocumento,setDireccionDocumento] = useState('')
  const [archivoDocumento,setArchivoDocumento] = useState('')
  const [fechaDocumento,setFechaDocumento] = useState('')
  const [tipoDocumento,setTipoDocumento] = useState('')

  //aqui puedo recibir las direcciones
  //const { direcciones } = usePage().props;

  const tipos = [
    { value:1,label:"Tipo1" },{ value:2,label:"Tipo2" },{ value:3,label:"Tipo3" }
  ]
  const autores = [
    { value:1,label:"Autor1" },{ value:2,label:"Autor2" },{ value:3,label:"Autor3" }
  ]
  const direcciones = [
    { value:1,label:"Direccicon" },{ value:2,label:"Direccion2" },{ value:3,label:"Direccion3" }
  ]

  const selectTipoDocumento = (value) => {
    setTipoDocumento(value)
  };
  const selectAutorDocumento = (value) => {
    setAutor(value)
  };
  const selectDireccionDocumento = (value) => {
    setDireccionDocumento(value)
  };


  return (
    <Authenticated  user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar documento</h2>}> 
      <TitleTemplate>
        Agregar documento
      </TitleTemplate>
      <ContentTemplate>
        <form>
          <div className="">
            <InputLabel value={"Ingresa rut"}></InputLabel>
            <TextInput type={'text'} onChange={(e) => {console.log("rut:",e.value);setMateria(e.value)}}></TextInput>
          </div>
          <div className="">
            <InputLabel value={"Selecciona tipo de documento"}></InputLabel>
            <Select opciones={tipos} onChange={selectTipoDocumento}>
            </Select>
          </div>
          <div className="">
            <InputLabel value={"Selecciona autor de documento"}></InputLabel>
            <Select opciones={autores} onChange={selectAutorDocumento}>
            </Select>
          </div>
          <div className="">
            <InputLabel value={"Selecciona autor de documento"}></InputLabel>
            <Select opciones={autores} onChange={selectDireccionDocumento}>
            </Select>
          </div>
          <div className="">
            <InputLabel value={"Ingresa materia"}></InputLabel>
            <TextInput type={'text'}></TextInput>
          </div>
          <div className="">
            <InputLabel value={"Ingresa numero de documento"}></InputLabel>
            <TextInput type={'number'}></TextInput>
          </div>
          <div className="">
            <InputLabel value={"Agregar archivo"}></InputLabel>
            <TextInput type={'file'} accept={'.pdf'}></TextInput>
          </div>
          <div className="">
            <InputLabel value={"Ingresa fecha"}></InputLabel>
            <TextInput type={'date'}></TextInput>
          </div>
        </form>
      </ContentTemplate>
    </Authenticated>
  )
}
export default AgregarDocumento