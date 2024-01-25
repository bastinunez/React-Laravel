import React,{useEffect, useState} from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import {Button, Divider, Input, Tooltip, Pagination,
    Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { Calendar } from 'primereact/calendar';
import { usePage ,Link,useForm} from '@inertiajs/react';
import { useFormDocumentStore,useIdDocumentStore,useFormMiniDocumentStore } from '@/Store/useStore'
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
  //variables que conservan su estado
  const {form_document_state,changeStateForm}=useFormDocumentStore()
  const { id_document, changeStateIdDoc } = useIdDocumentStore();
  const {form_mini_document_state,changeStateMiniForm}=useFormMiniDocumentStore()
  const [docAnexos,setDocAnexos] = useState([])

  //formularios
  const { data:data, setData:setData, post:post, processing:processing, errors:errors, reset:reset} = useForm({
    rut_documento: '',
    numero_documento: '',
    materia_documento: '',
    autor_documento: 'DEFAULT',
    direccion_documento: 'DEFAULT',
    archivo: "",
    fecha_documento: '',
    tipo_documento: 'DEFAULT',
  });
  const { data:data_mini, setData:setData_mini, post:post_mini, processing:processing_mini, errors:errors_mini, reset:reset_mini } = useForm({
    numero_documento: '',
    autor_documento: 'DEFAULT',
    fecha_documento: '',
    tipo_documento: 'DEFAULT',
    id_doc:id_document
  });

  //recibo los datos desde el controlador
  const { direcciones, tipos,autores,flash } = usePage().props;

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

  const getDocuments = async (id) => {
    if (id_document!==0){
      try {
        const response = await axios.get(`/api/documentos-anexos/${id}`); // Cambia la ruta según tu configuración
        // console.log('Documentos obtenidos:', response.data);
        setDocAnexos(response.data.datos)
        // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    }
  }
  useEffect(()=>{
    if (id_document!==0){
      //console.log("actualmente id_doc:",id_document)
      data_mini.id_doc=id_document;
      getDocuments(id_document)
    }
  },[id_document])

  //post
  const submit = async (e) => {
    e.preventDefault();
    //console.log(data)
    post(route('documento.store'),{
      onSuccess: () => {data_mini.id_doc=id_document;getDocuments(id_document);reset('materia_documento')}
    });
  }
  const submitMiniForm = (e) => {
    e.preventDefault()
    //console.log(data_mini)
    post_mini(route('documento-anexo.store'),{
      onSuccess: () => {getDocuments(id_document);reset_mini('numero_documento','autor_documento','tipo_documento','fecha_documento')}
    })
  }
  //console.log(data_mini)

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
      <TitleTemplate>
        Agregar documento
      </TitleTemplate>
      <ContentTemplate>
        <h2>Formulario</h2>
        {
          form_document_state?
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
                <Tooltip content="Confirmar y agregar" color='success'>
                  <Button type='submit' color='success' variant='ghost' className='w-full text-large' size='md'>Agregar</Button>
                </Tooltip>
              </div>
              {
                flash.FormDocumento?
                <>
                  {
                    flash.FormDocumento=="Error"?
                    <>
                      <h1>Error con subir el formulario</h1>
                    </>
                    :
                    <></>
                  }
                </>
                :<></>
              }
              
            </form>
            
            :
            <>
              <div>
                <div className='w-full p-5'>
                  <Button className='text-white rounded-md w-full p-2 text-center text-large' color='success' onClick={changeStateForm}>Se agregó correctamente el documento, presione para agregar otro</Button>
                </div>
                <div className='p-5'>
                  <Divider></Divider>
                </div>
                <div className='w-full p-5'>
                  <h2>Puedes agregar documentos anexos a éste</h2>
                  <div className='mt-3'>
                    <form onSubmit={submitMiniForm}>
                      <div className='flex w-full justify-between mb-5'>
                        <div className="w-80">
                          <InputLabel value={"Selecciona tipo de documento"}></InputLabel>
                          <Select opciones={tipos} value={data_mini.tipo_documento} onChange={(value) => setData_mini('tipo_documento', value)} required>
                          </Select>
                          <InputError message={errors_mini.tipo_documento} className="mt-2" />
                        </div>
                        <div className="w-80">
                          <InputLabel value={"Selecciona autor de documento"}></InputLabel>
                          <Select opciones={autores} value={data_mini.autor_documento} onChange={(value) => setData_mini('autor_documento', value)}  required>
                          </Select>
                          <InputError message={errors_mini.autor_documento} className="mt-2" />
                        </div>
                        <div className="w-80">
                          <InputLabel value={"Ingresa numero de documento"}></InputLabel>
                          <TextInput className={"w-full"} type={'number'} value={data_mini.numero_documento} onChange={(e) => setData_mini('numero_documento',e.target.value)}required ></TextInput>
                          <InputError message={errors_mini.numero_documento} className="mt-2" />
                        </div>
                        <div className="w-80">
                          <InputLabel value={"Ingresa fecha"}></InputLabel>
                          <div className="card flex justify-content-center">
                            <Calendar value={data_mini.fecha_documento} locale="es" inputStyle={{"padding":"0.5rem "}} required onChange={(e) => setData_mini('fecha_documento',e.target.value)} readOnlyInput />
                          </div>
                          <InputError message={errors_mini.fecha_documento} className="mt-2" />
                        </div>
                      </div>
                      {
                        flash.FormDocMini?
                        <>
                          {
                            flash.FormDocMini=="Error"?
                            <>
                              <div className='bg-success-500 text-white rounded-md p-1 text-center text-medium'>Hubo un error al guardar </div>
                            </>
                            :<>
                              <div className='bg-success-500 text-white rounded-md p-2 text-center text-medium'>Se guardo correctamente</div>
                            </>
                          }
                        </>:
                        <></>
                      }
                      <div className='mt-3'>
                        <Button type='submit' color='primary' variant='ghost'  className='w-full text-large' size='md'>Agregar documento anexo</Button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='w-full p-5'>
                  <Divider></Divider>
                </div>
                <div className='w-full p-5'>
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
                          <TableColumn>Numero de documento</TableColumn>
                          <TableColumn>Tipo de documento</TableColumn>
                          <TableColumn>Autor de documento</TableColumn>
                          <TableColumn>Fecha de documento</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Aún no hay documentos anexos"}>
                          {
                            docAnexos.map( (documento) => (
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
            </>
        }
        
      </ContentTemplate>
    </Authenticated>
  )
}
export default AgregarDocumento