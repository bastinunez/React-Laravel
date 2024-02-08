import{l as F,b as L,r as t,W as M,q as k,m as v,j as e,a as P,d as U}from"./app-peuYjEpJ.js";import{A as z,b as _,t as O}from"./AuthenticatedLayout-p56YD4qG.js";import{T as R}from"./TitleTemplate-VNYP4QaZ.js";import{C as V}from"./ContentTemplate-Ei9JbHLa.js";import{I as a}from"./InputLabel-wkdhkWUR.js";import{I as m}from"./InputError-9KAUk6AJ.js";import{T as i}from"./TextInput-kaLmirDK.js";import{S as x}from"./Select-9YCHe840.js";import{C as W}from"./calendar.esm-w5hXAkDL.js";import{T as H}from"./toast.esm-scV4M1sv.js";import{c as J}from"./chunk-AMSULWPV-tDjQ4Vjp.js";import"./import-V_VTaOEA.js";F("en");L("es",{firstDayOfWeek:1,dayNames:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],dayNamesShort:["dom","lun","mar","mié","jue","vie","sáb"],dayNamesMin:["D","L","M","X","J","V","S"],monthNames:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],monthNamesShort:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],today:"Hoy",clear:"Limpiar"});const ue=({auth:N})=>{const g=t.useRef(null),[l,X]=t.useState([]),{data:r,setData:o,post:b,processing:B,errors:c,reset:y}=M({rut_documento:"",numero_documento:"",materia_documento:"",autor_documento:"DEFAULT",direccion_documento:"DEFAULT",archivo:"",fecha_documento:"",tipo_documento:"DEFAULT",estado:!1}),{direcciones:w,all_docs:G,tipos:D,autores:S,flash:n}=k().props,[K,A]=t.useState([]),C=s=>{o("tipo_documento",s)},I=s=>{o("autor_documento",s)},E=s=>{o("direccion_documento",s)};t.useState(!0),t.useState(!1),t.useEffect(()=>{n.FormDocumento=="Success"&&changeStateForm()},[n.FormDocumento]),t.useEffect(()=>{n.IdDoc!=null&&changeStateIdDoc(n.IdDoc)},[n.IdDoc]),t.useEffect(()=>{n.documentos!=null&&A(n.documentos)},[n.documentos]),t.useState(new Set([]));const h={success:"success",error:"error"},j={success:"Exito",error:"Error"},f=(s,u,q)=>{g.current.show({severity:u,summary:q,detail:s,life:3e3})},T=async s=>{s.preventDefault(),b(route("gestion-documento.store"),{onSuccess:u=>{y("materia_documento"),f(u.success,h.success,j.success)},onError:u=>{f(u.create,h.error,j.error)}})},[p,Q]=v.useState(1),d=4;return Math.ceil(l.length/d),v.useMemo(()=>{const s=(p-1)*d,u=s+d;return l.slice(s,u)},[p,l]),e.jsxs(z,{user:N.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Agregar documento"}),children:[e.jsx(P,{title:"Agregar documento"}),e.jsx(H,{ref:g}),e.jsx(R,{children:"Agregar documento"}),e.jsxs(V,{children:[e.jsx("h2",{children:"Formulario"}),e.jsxs("form",{className:"md:p-8",onSubmit:T,children:[e.jsxs("div",{className:"md:flex w-full justify-between gap-3 mb-5",children:[e.jsxs("div",{className:"w-80",children:[e.jsx(a,{value:"Selecciona tipo de documento (*)"}),e.jsx(x,{opciones:D,value:r.tipo_documento,onChange:C,required:!0}),e.jsx(m,{message:c.tipo_documento,className:"mt-2"})]}),e.jsxs("div",{className:"w-80",children:[e.jsx(a,{value:"Selecciona autor de documento (*)"}),e.jsx(x,{opciones:S,value:r.autor_documento,onChange:I,required:!0}),e.jsx(m,{message:c.autor_documento,className:"mt-2"})]}),e.jsxs("div",{className:"w-80",children:[e.jsx(a,{value:"Selecciona direccion de documento (*)"}),e.jsx(x,{opciones:w,value:r.direccion_documento,onChange:E,required:!0}),e.jsx(m,{message:c.direccion_documento,className:"mt-2"})]})]}),e.jsxs("div",{className:"md:flex w-full justify-between mb-5",children:[e.jsxs("div",{className:"",children:[e.jsx(a,{value:"Ingresa rut (*)"}),e.jsx(i,{type:"text",value:r.rut_documento,onChange:s=>o("rut_documento",s.target.value)}),e.jsx(m,{message:c.rut_documento,className:"mt-2"})]}),e.jsxs("div",{className:"",children:[e.jsx(a,{value:"Ingresa numero de documento (*)"}),e.jsx(i,{type:"number",value:r.numero_documento,onChange:s=>o("numero_documento",s.target.value),required:!0}),e.jsx(m,{message:c.numero_documento,className:"mt-2"})]}),e.jsxs("div",{className:"",children:[e.jsx(a,{value:"Ingresa materia de documento"}),e.jsx(i,{type:"text",value:r.materia_documento,onChange:s=>o("materia_documento",s.target.value)}),e.jsx(m,{message:c.materia_documento,className:"mt-2"})]})]}),e.jsxs("div",{className:"md:flex w-full justify-between mb-8 gap-2 md:pr-10",children:[e.jsxs("div",{className:"w-80",children:[e.jsx(a,{value:"Ingresa fecha (*)"}),e.jsx("div",{className:"card flex justify-content-center",children:e.jsx(W,{value:r.fecha_documento,locale:"es",required:!0,onChange:s=>o("fecha_documento",s.target.value),readOnlyInput:!0})}),e.jsx(m,{message:c.fecha_documento,className:"mt-2"})]}),e.jsxs("div",{className:"w-80",children:[e.jsx(a,{value:"Agregar archivo (*)"}),e.jsx("input",{onChange:s=>o("archivo",s.target.files[0]),className:"text-tiny md:text-small",type:"file",accept:".pdf"}),e.jsx(m,{message:c.archivo,className:"mt-2"})]}),e.jsxs("div",{className:"w-80",children:[e.jsx(a,{value:"Marque si el documento se encuentra anulado"}),e.jsx(J,{value:r.estado,onChange:s=>o("estado",s.target.checked),color:"danger",children:"Anulado"})]})]}),e.jsxs("div",{className:"md:flex w-full mb-5 md:gap-8",children:[e.jsx(U,{href:route("gestion-documento.index"),className:"w-full",children:e.jsx(_,{className:"w-full text-large mb-1",color:"warning",variant:"ghost",children:"Volver atrás"})}),e.jsx(O,{content:"Confirmar y agregar",color:"success",children:e.jsx(_,{type:"submit",color:"success",variant:"ghost",className:"w-full text-large",size:"md",children:"Agregar"})})]})]})]})]})};export{ue as default};