import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head,usePage } from '@inertiajs/react'
import { Toast } from 'primereact/toast'
import {Button, Pagination, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Input,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu, Chip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip,}  from "@nextui-org/react";
import React,{useState,useEffect,useRef,useMemo,useCallback} from 'react'
import Icon from '@mdi/react';
import { Calendar } from 'primereact/calendar';
import Select from '@/Components/Select';
import { mdiVacuumOutline,mdiMagnify,mdiChevronDown} from '@mdi/js';
import FilterTemplate from '@/Components/FilterTemplate'

const DocumentosAnexos = ({auth}) => {
  //toast
  const toast_global = useRef(null);


  const { historial,tipos,autores,acciones } = usePage().props;

  //TABLA Y FILTROS
  //Filtros
  const [seleccion, setSeleccion] = useState([]);
  const [filterFechaDoc,setFilterFechaDoc] = useState('');
  const [filterFechaCreated,setFilterFechaCreated] = useState('');
  const [filterNumero,setFilterNumero] = useState('');
  const [filterResponsable,setFilterResponsable] = useState('');
  const [filterDetalles,setFilterDetalles] = useState('');
  const hasSearchFilterNumero = Boolean(filterNumero);
  const hasSearchFilterResponsable = Boolean(filterResponsable);
  const hasSearchFilterDetalles = Boolean(filterDetalles);
  const [tipoFilter, setTipoFilter] = useState("all");
  const [accionFilter, setAccionFilter] = useState("all");
  const [autorFilter, setAutorFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "fecha",
    direction: "ascending",
  });

  const columnas = [
    {name: "ID", uid: "id", sortable: true},
    {name: "#", uid: "numero", sortable: true},
    {name: "Fecha", uid: "fecha", sortable: true},
    {name: "Autor", uid: "autor", sortable: true},
    {name: "Tipo", uid: "tipo", sortable: true},
    {name: "ID anexo", uid: "id_anexo", sortable: true},
    {name: "# anexo", uid: "numero_anexo", sortable: true},
    {name: "Fecha anexo", uid: "fecha_anexo", sortable: true},
    //{name: "Autor anexo", uid: "autor_anexo", sortable: true},
    //{name: "Tipo anexo", uid: "tipo_anexo", sortable: true},
    {name: "Responsable", uid: "responsable", sortable: true},
    {name: "Acción", uid: "accion", sortable: true},
    {name: "Detalles", uid: "detalles", sortable: true},
    {name: "Creado", uid: "creado", sortable: true},
  ];

  //Tabla
  const filteredItems = useMemo(() => {
    let filteredHistorial = [...historial];
    if (hasSearchFilterNumero) {
      filteredHistorial = filteredHistorial.filter((fila) => fila.doc_numero == parseInt(filterNumero));
    }
    if (hasSearchFilterResponsable) {
      filteredHistorial = filteredHistorial.filter((fila) => (fila.responsable.nombres + " " + fila.responsable.apellidos).toLowerCase().includes(filterResponsable.toLowerCase()));
    }
    if (hasSearchFilterDetalles) {
      filteredHistorial = filteredHistorial.filter((fila) => fila.detalles? (fila.detalles).toLowerCase().includes(filterDetalles.toLowerCase()) : null);
    }
    if (filterFechaDoc){
      filteredHistorial = filteredHistorial.filter((fila) => {
        const fecha_doc = new Date(fila.doc_fecha);
        return fecha_doc >= filterFechaDoc[0] && fecha_doc <= filterFechaDoc[1]
      });
    }
    if (filterFechaCreated){
      filteredHistorial = filteredHistorial.filter((fila) => {
        const fecha_registro = new Date(fila.created_at);
        return fecha_registro >= filterFechaCreated[0] && fecha_registro <= filterFechaCreated[1]
      });
    }
    if (tipoFilter !== "all" && Array.from(tipoFilter).length !== tipos.length) {
      let arrayTipo =  new Set([...tipoFilter].map(numero => {
          const matchingItem = tipos.find(item => item.id === parseInt(numero));
          return matchingItem ? matchingItem.nombre : null;
        }).filter(nombre => nombre !== null));
      filteredHistorial = filteredHistorial.filter((fila) =>
        Array.from(arrayTipo).includes(fila.doc_tipo),
      );
    }
    if (autorFilter !== "all" && Array.from(autorFilter).length !== autores.length) {
      let arrayAutor =  new Set([...autorFilter].map(numero => {
          const matchingItem = autores.find(item => item.id === parseInt(numero));
          return matchingItem ? [matchingItem.nombres + " " + matchingItem.apellidos]: null;
        }).filter(nombres => nombres !== null));
      filteredHistorial = filteredHistorial.filter((fila) =>
        Array.from(arrayAutor).some(item=>JSON.stringify(item) === JSON.stringify([fila.doc_autor]))
      );
    }
    return filteredHistorial;
  }, [historial, filterNumero,filterDetalles,filterResponsable,tipoFilter,accionFilter,autorFilter,filterFechaDoc,filterFechaCreated]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChangeNumero = useCallback((value) => {
    if (value) {
      setFilterNumero(value);
      setPage(1);
    } else {
      setFilterNumero("");
    }
  }, []);
  const onClearNumero = useCallback(()=>{
    setFilterNumero("")
    setPage(1)
  },[])

  const onSearchChangeResponsable = useCallback((value) => {
    if (value) {
      setFilterResponsable(value);
      setPage(1);
    } else {
      setFilterResponsable("");
    }
  }, []);
  const onClearResponsable = useCallback(()=>{
    setFilterResponsable("")
    setPage(1)
  },[])

  const onSearchChangeDetalles = useCallback((value) => {
    if (value) {
      setFilterDetalles(value);
      setPage(1);
    } else {
      setFilterDetalles("");
    }
  }, []);
  const onClearDetalles = useCallback(()=>{
    setFilterDetalles("")
    setPage(1)
  },[])

  const limpiarFiltros = () =>{
    setFilterNumero("")
    setFilterFechaCreated('')
    setFilterFechaDoc('')
    setTipoFilter("all")
    setAutorFilter("all")
    setFilterResponsable('')
    setFilterDetalles('')
  }

  return (
    <Authenticated user={auth.user}>
      <Head title="Historial de documentos anexos" />
      <Toast ref={toast_global}></Toast>
      <TitleTemplate>
        Historial de documentos anexos
      </TitleTemplate>
      <FilterTemplate>
          <div className="flex flex-col gap-4">
            <div className="xl:flex justify-center gap-4 items-end">
              <div className='md:flex md:gap-2'>
                <Input isClearable classNames={{input:["border-none"]}} type='text'
                  className="w-full mb-1" size='sm' placeholder="Buscar por numero..."
                  startContent={<Icon path={mdiMagnify} size={1} />} value={filterNumero}
                  onClear={() => onClearNumero()} onValueChange={onSearchChangeNumero} />
                <Input isClearable classNames={{input:["border-none"]}} type='text'
                  className="w-full mb-1" size='sm' placeholder="Buscar por responsable..."
                  startContent={<Icon path={mdiMagnify} size={1} />} value={filterResponsable}
                  onClear={() => onClearResponsable()} onValueChange={onSearchChangeResponsable} />
                <Input isClearable classNames={{input:["border-none"]}} type='text'
                  className="w-full mb-1" size='sm' placeholder="Buscar por detalles..."
                  startContent={<Icon path={mdiMagnify} size={1} />} value={filterDetalles}
                  onClear={() => onClearDetalles()} onValueChange={onSearchChangeDetalles} />
              </div>
              <div className='md:flex items-center md:gap-2'>
                <div className='w-full card mb-1'>
                  <Calendar className='max-h-10 border-0 flex p-0'  placeholder='Rango de fecha documento' dateFormat="yy//mm/dd" showIcon value={filterFechaDoc} onChange={(e) => setFilterFechaDoc(e.value)} selectionMode="range" readOnlyInput />
                </div>
                <div className='w-full card mb-1'>
                  <Calendar className='max-h-10 border-0 flex p-0' placeholder='Rango de fecha registro' dateFormat="yy//mm/dd" showIcon value={filterFechaCreated} onChange={(e) => setFilterFechaCreated(e.value)} selectionMode="range" readOnlyInput />
                </div>
                <div className="flex gap-3">
                  <div>
                    {/* FILTRO ACCION */}
                    <Dropdown >
                      <DropdownTrigger className="text-tiny lg:text-small">
                        <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                          Accion
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu  disallowEmptySelection aria-label="Table Columns"
                        closeOnSelect={false} selectedKeys={accionFilter} selectionMode="multiple"
                        onSelectionChange={setAccionFilter} >
                        {acciones.map( (accion) => (
                          <DropdownItem key={accion.id}>{accion.nombre}</DropdownItem>
                        ) )}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div>
                    {/* FILTRO TIPO */}
                    <Dropdown >
                      <DropdownTrigger className="text-tiny lg:text-small">
                        <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                          Tipo
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu  disallowEmptySelection aria-label="Table Columns"
                        closeOnSelect={false} selectedKeys={tipoFilter} selectionMode="multiple"
                        onSelectionChange={setTipoFilter} >
                        {tipos.map( (tipo) => (
                          <DropdownItem key={tipo.id}>{tipo.nombre}</DropdownItem>
                        ) )}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div>
                    {/* FILTRO AUTOR */}
                    <Dropdown>
                      <DropdownTrigger className="text-tiny lg:text-small">
                        <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                          Autor
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu  disallowEmptySelection aria-label="Table Columns" id='autor' selectedKeys={autorFilter}
                        onSelectionChange={setAutorFilter} closeOnSelect={false} selectionMode="multiple" items={autores}>
                        {
                          (autor)=>(
                            <DropdownItem key={autor.id}>{autor.nombres}</DropdownItem>
                          )
                        }
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              
              
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-default-400 text-tiny lg:text-small">Total {historial.length} filas</span>
              </div>
              <div className='flex gap-5'>
                <Button color='warning' className='min-w-0 min-h-0' onPress={()=>limpiarFiltros()}>
                    <Icon path={mdiVacuumOutline} size={1} />
                    <p className='hidden sm:flex'>
                    Limpiar filtros
                    </p>
                </Button>
                <label className="flex items-center text-default-400 text-tiny lg:text-small">
                  Filas por pagina:
                  <Select onChange={(value) => {setRowsPerPage(value);setPage(1)}} value={rowsPerPage} opciones={[{id:5,nombre:5},{id:8,nombre:8},{id:12,nombre:12}]}>
                  </Select>
                </label>
              </div>
              
            </div>
          </div>
        </FilterTemplate>
      <ContentTemplate>
        <div>
            <div>
            <Table aria-label="Tabla historial" color={"primary"}
            selectedKeys={seleccion} onSelectionChange={setSeleccion}  
            bottomContent={ 
              <div className="flex w-full justify-center">
                <Pagination isCompact showControls showShadow color="secondary" page={page}
                  total={pages} onChange={(page) => setPage(page)} />
              </div>
            }
            classNames={{  wrapper: "min-h-[222px]", }}>
              <TableHeader>
                  {columnas.map((columna)=>(
                    <TableColumn className='text-start text-small' key={columna.uid}>{columna.name}</TableColumn>
                  ))}
              </TableHeader>
              <TableBody emptyContent={"No existen historial"}>
                {
                  sortedItems.map((fila,index)=>(
                    <TableRow key={index} className='text-start'>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_id}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_numero}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_fecha}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_autor}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_tipo}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_anexo_id}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_anexo_numero}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_anexo_fecha}</TableCell>
                      {/* <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_anexo_autor}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.doc_anexo_tipo}</TableCell> */}
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.responsable.nombres} {fila.responsable.apellidos}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.accion.nombre}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{fila.detalles}</TableCell>
                      <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{new Date(fila.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            </div>
        </div>
      </ContentTemplate>
    </Authenticated>
  )
}
export default DocumentosAnexos