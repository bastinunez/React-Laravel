import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TitleTemplate from '@/Components/TitleTemplate';
import FilterTemplate from '@/Components/FilterTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import { Tag } from 'primereact/tag';

const ShowDocuments = ({auth}) => {
  //const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  const columns = [
    {field: 'code', header: 'Code'},
    {field: 'name', header: 'Name'},
    {field: 'category', header: 'Category'},
    {field: 'quantity', header: 'Quantity'}
  ];

  const products = [
    {
      code:'1',id:'1',name:'1',category:'1',quantity:1
    },{
      code:'2',id:'2',name:'2',category:'2',quantity:2
    },{
      code:'3',id:'3',name:'3',category:'3',quantity:3
    }
  ];

  const statusOrderBodyTemplate = (rowData) => {
    return <Tag value={rowData.quantity} severity={getOrderSeverity(rowData)}></Tag>;
  };
  
  const getOrderSeverity = (order) => {
    switch (order.status) {
        case 1:
            return 'success';

        case 2:
            return 'danger';

        case 3:
            return 'warning';
        default:
            return null;
    }
};

const getProductSeverity = (product) => {
  switch (product.quantity) {
      case 1:
          return 'success';

      case 2:
          return 'warning';

      case 3:
          return 'danger';

      default:
          return null;
  }
};

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.quantity} severity={getProductSeverity(rowData)}></Tag>;
  };

  return (
    <AuthenticatedLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documentos</h2>}>
      <div>
        <TitleTemplate>Documentos</TitleTemplate>
        <FilterTemplate>Aqui iran los filtros</FilterTemplate>
        <ContentTemplate>
          <h1>Resultados</h1>
    
          <DataTable value={products} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}  tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            {/* <Column field="id" header="Id" sortable></Column> */}
            <Column field="code" header="Code" sortable></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column field="category" header="Category" sortable></Column>
            <Column field="quantity" header="Quantity" body={statusBodyTemplate} sortable></Column>
            <Column headerStyle={{ width: '4rem' }} ></Column>
            {/* {columns.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header} sortable/>
                ))} */}
          </DataTable>
        </ContentTemplate>
      </div>
    </AuthenticatedLayout>
    
  )
}

export default ShowDocuments
