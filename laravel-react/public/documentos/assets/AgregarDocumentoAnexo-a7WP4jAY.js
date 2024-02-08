import{l as ee,b as se,r as t,q as ae,W as F,m as M,j as e,a as oe,d as S}from"./app-peuYjEpJ.js";import{A as te,b as n,e as L}from"./AuthenticatedLayout-p56YD4qG.js";import{T as re}from"./TitleTemplate-VNYP4QaZ.js";import{C as ne}from"./ContentTemplate-Ei9JbHLa.js";import{I as m}from"./InputLabel-wkdhkWUR.js";import{I as p}from"./InputError-9KAUk6AJ.js";import{T as le}from"./TextInput-kaLmirDK.js";import{S as q}from"./Select-9YCHe840.js";import{C as ce}from"./calendar.esm-w5hXAkDL.js";import{T as ie}from"./toast.esm-scV4M1sv.js";import{s as de,l as me}from"./chunk-ZFWMN6TD-hM1Z1Unl.js";import{c as ue}from"./chunk-AMSULWPV-tDjQ4Vjp.js";import{t as xe,p as he,a as fe,b as j,c as ge,d as pe,e as v}from"./chunk-YRZGWF2W-82o9ud7j.js";import"./import-afMrECeO.js";import"./import-Z4lNxWiv.js";import"./import-V_VTaOEA.js";ee("en");se("es",{firstDayOfWeek:1,dayNames:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],dayNamesShort:["dom","lun","mar","mié","jue","vie","sáb"],dayNamesMin:["D","L","M","X","J","V","S"],monthNames:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],monthNamesShort:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],today:"Hoy",clear:"Limpiar"});const Ve=({auth:k})=>{const D=t.useRef(null),[_,V]=t.useState([]),{id_doc:o,all_docs:C,tipos:z,autores:P,flash:c}=ae().props,[B,O]=t.useState(C),R=async()=>{try{const s=await axios.get(`/api/all-documents/${o}`);O(s.data.documentos)}catch(s){console.error("Error al obtener documentos:",s)}},{data:l,setData:i,post:U,processing:je,errors:u,reset:W}=F({numero_documento:"",autor_documento:"DEFAULT",fecha_documento:"",tipo_documento:"DEFAULT",id_doc:o,estado:!1}),{data:E,setData:ve,delete:_e,post:$,reset:H}=F({documento_id:"",anexos:[]}),[d,T]=t.useState(!0),[x,I]=t.useState(!1);t.useEffect(()=>{c.FormDocumento=="Success"&&changeStateForm()},[c.FormDocumento]),t.useEffect(()=>{c.IdDoc!=null&&changeStateIdDoc(c.IdDoc)},[c.IdDoc]);const N=async s=>{if(o!==0)try{const a=await axios.get(`/api/documentos-anexos/${s}`);V(a.data.datos)}catch{}};t.useEffect(()=>{o!==0&&(l.id_doc=o,N(o))},[o]);const[w,b]=t.useState(new Set([])),J=s=>{b(new Set(s.target.value.split(",")))},h={success:"success",error:"error"},f={success:"Exito",error:"Error"},g=(s,a,r)=>{D.current.show({severity:a,summary:r,detail:s,life:3e3})},K=s=>{s.preventDefault(),U(route("documento-anexo.store"),{onSuccess:a=>{g(a.create,h.success,f.success),N(o),W("numero_documento","autor_documento","tipo_documento","fecha_documento")},onError:a=>{g(a.create,h.error,f.error)}})},X=s=>{s.preventDefault();let a="";w=="all"?a=C.map(r=>r.id):a=Array.from(w).map(Z=>Z),E.documento_id=o,E.anexos=a,b(new Set([])),$(route("documento-anexo.agregar-existente"),{onSuccess:r=>{g(r.add_anexo,h.success,f.success),R(),N(o),H("anexos"),b(new Set([]))},onError:r=>{g(r.add_anexo,h.error,f.error)}})},[A,G]=M.useState(1),y=4,Q=Math.ceil(_.length/y),Y=M.useMemo(()=>{const s=(A-1)*y,a=s+y;return _.slice(s,a)},[A,_]);return e.jsxs(te,{user:k.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Agregar documento anexo"}),children:[e.jsx(oe,{title:"Agregar documento anexo"}),e.jsx(ie,{ref:D}),e.jsx(re,{children:"Agregar documento"}),e.jsxs(ne,{children:[e.jsx("h2",{children:"Formulario"}),e.jsxs("div",{className:"xl:p-5",children:[e.jsx("div",{className:"w-full",children:e.jsx(S,{href:route("gestion-documento.create"),children:e.jsx(n,{className:"text-white rounded-md w-full p-2 whitespace-normal text-center xl:text-large ",color:"success",children:"Se agregó correctamente el documento, presione para agregar otro"})})}),e.jsx("div",{className:"p-5",children:e.jsx(L,{})}),e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:"mt-3 w-full",children:e.jsxs("div",{className:"xl:flex w-full gap-4",children:[e.jsx("div",{className:"w-full",children:e.jsx(n,{color:"secondary",className:"w-full text-medium",variant:d?"solid":"ghost",onClick:()=>{d||(I(!x),T(!d))},children:"Agregar nuevo documento"})}),e.jsx("div",{className:"w-full",children:e.jsx(n,{color:"secondary",className:"w-full text-medium",variant:x?"solid":"ghost",onClick:()=>{x||(I(!x),T(!d))},children:"Agregar documento existente"})})]})}),e.jsx("div",{className:"mt-3",children:d?e.jsx(e.Fragment,{children:e.jsxs("form",{onSubmit:K,children:[e.jsxs("div",{className:"lg:flex w-full justify-between mb-5 md:gap-4",children:[e.jsxs("div",{className:"w-80 xl:me-4",children:[e.jsx(m,{value:"Selecciona tipo de documento"}),e.jsx(q,{opciones:z,value:l.tipo_documento,onChange:s=>i("tipo_documento",s),required:!0}),e.jsx(p,{message:u.tipo_documento,className:"mt-2"})]}),e.jsxs("div",{className:"w-80 xl:me-4",children:[e.jsx(m,{value:"Selecciona autor de documento"}),e.jsx(q,{opciones:P,value:l.autor_documento,onChange:s=>i("autor_documento",s),required:!0}),e.jsx(p,{message:u.autor_documento,className:"mt-2"})]}),e.jsxs("div",{className:"w-80 xl:me-4",children:[e.jsx(m,{value:"Ingresa numero de documento"}),e.jsx(le,{className:"w-full",type:"number",value:l.numero_documento,onChange:s=>i("numero_documento",s.target.value),required:!0}),e.jsx(p,{message:u.numero_documento,className:"mt-2"})]}),e.jsxs("div",{className:"w-80 xl:me-4",children:[e.jsx(m,{value:"Ingresa fecha"}),e.jsx("div",{className:"card flex justify-content-center",children:e.jsx(ce,{value:l.fecha_documento,locale:"es",inputStyle:{padding:"0.5rem "},required:!0,onChange:s=>i("fecha_documento",s.target.value),readOnlyInput:!0})}),e.jsx(p,{message:u.fecha_documento,className:"mt-2"})]}),e.jsxs("div",{className:"w-80 xl:me-4",children:[e.jsx(m,{value:"Marque si el documento se encuentra anulado"}),e.jsx(ue,{value:l.estado,onChange:s=>i("estado",s.target.checked),color:"danger",children:"Anulado"})]})]}),e.jsxs("div",{className:"mt-3 w-full md:flex gap-8",children:[e.jsx(S,{href:route("gestion-documento.index"),className:"w-full",children:e.jsx(n,{className:"w-full text-large",color:"warning",variant:"ghost",children:"Volver atrás"})}),e.jsx(n,{type:"submit",color:"primary",variant:"ghost",className:"w-full text-large",size:"md",children:"Agregar documento anexo"})]})]})}):e.jsx(e.Fragment,{children:e.jsxs("form",{onSubmit:X,className:"w-full xl:gap-5 xl:flex",children:[e.jsx("div",{className:"w-full",children:e.jsx(de,{label:"Documentos para anexar: ",selectionMode:"multiple",placeholder:"Seleccionar documentos...",selectedKeys:w,className:"",onChange:J,children:B.map(s=>e.jsx(me,{textValue:s.numero+"/"+s.anno,children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-small",children:"Documento número: "+s.numero+" | Año: "+s.anno}),e.jsx("span",{className:"text-tiny",children:"Autor: "+s.autor+" | Tipo: "+s.tipo+" | Dirección: "+s.direccion+" | Fecha: "+s.fecha})]})},s.id))})}),e.jsxs("div",{className:"md:flex items-center xl:gap-5",children:[e.jsx(n,{type:"text",size:"lg",className:"w-full",color:"primary",variant:"ghost",children:"Anexar documentos"}),e.jsx(S,{href:route("gestion-documento.index"),className:"w-full",children:e.jsx(n,{className:"w-full text-large",size:"lg",color:"warning",variant:"ghost",children:"Volver atrás"})})]})]})})})]}),e.jsx("div",{className:"w-full mt-5",children:e.jsx(L,{})}),e.jsxs("div",{className:"w-full mt-5",children:[e.jsx("h1",{children:"Documentos anexos"}),e.jsxs(xe,{"aria-label":"Tabla documentos anexos",bottomContent:e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(he,{isCompact:!0,showControls:!0,showShadow:!0,color:"secondary",page:A,total:Q,onChange:s=>G(s)})}),classNames:{wrapper:"min-h-[222px]"},children:[e.jsxs(fe,{children:[e.jsx(j,{children:"Número"}),e.jsx(j,{children:"Tipo"}),e.jsx(j,{children:"Autor"}),e.jsx(j,{children:"Fecha"})]}),e.jsx(ge,{emptyContent:"Aún no hay documentos anexos",children:Y.map(s=>e.jsxs(pe,{children:[e.jsx(v,{children:s.numero}),e.jsx(v,{children:s.tipo}),e.jsxs(v,{children:[s.autor_nombre," ",s.autor_apellido]}),e.jsx(v,{children:s.fecha})]},s.id))})]})]})]})]})]})};export{Ve as default};
