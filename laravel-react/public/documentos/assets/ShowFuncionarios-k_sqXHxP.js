import{q as M,r as t,j as e,a as E,d as w}from"./app-eXGWw0Q1.js";import{A as R,I as c,m as B,b as h,a as D,t as N,c as L,d as k,u as G}from"./AuthenticatedLayout-xmXHQCqJ.js";import{T as O}from"./TitleTemplate-g8fmxVri.js";import{C as V}from"./ContentTemplate-Tjr8Dmcy.js";import{F as q}from"./FilterTemplate-NM1ULPE2.js";import{S as K}from"./Select-okRpXzt-.js";import{i as H}from"./chunk-TC4QW7OA-vNTTWJaW.js";import{t as J,p as Q,a as U,b as W,c as X,d as Y,e as n}from"./chunk-YRZGWF2W-C22kSm3v.js";import"./import-l4FZ2bLw.js";import"./import-oEubEFRA.js";import"./chunk-AMSULWPV-Pe1sDtjI.js";const xe=({auth:v})=>{const{hasRoles:Z,hasPermission:p}=G(),{all_funcionarios:C}=M().props,[d,$]=t.useState(C),y=[{name:"ID",uid:"id",sortable:!0},{name:"Nombres",uid:"nombres",sortable:!0},{name:"Apellidos",uid:"apellidos",sortable:!0},{name:"Abreviacion",uid:"abreviacion",sortable:!0},{name:"Acciones",uid:"accion"}],[l,m]=t.useState(""),[F,S]=t.useState([]),_=!!l,x=t.useMemo(()=>{let s=[...d];return _&&(s=s.filter(i=>i.nombres.toLowerCase().includes(l.toLowerCase()))),s},[d,l]),P=t.useCallback(s=>{s?(m(s),o(1)):m("")},[]),z=t.useCallback(()=>{m(""),o(1)},[]),[r,ee]=t.useState({column:"fecha",direction:"ascending"}),[u,o]=t.useState(1),[a,A]=t.useState(8),T=Math.ceil(x.length/a),f=t.useMemo(()=>{const s=(u-1)*a,i=s+a;return x.slice(s,i)},[u,x,a]),I=t.useMemo(()=>[...f].sort((s,i)=>{const j=s[r.column],b=i[r.column],g=j<b?-1:j>b?1:0;return r.direction==="descending"?-g:g}),[r,f]);return e.jsxs(R,{user:v.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Funcionarios"}),children:[e.jsx(E,{title:"Funcionarios"}),e.jsx(O,{children:"Funcionarios"}),e.jsx(q,{children:e.jsx("div",{className:"flex flex-col gap-4",children:e.jsxs("div",{className:"md:flex justify-center gap-4 items-end",children:[e.jsx(H,{isClearable:!0,classNames:{input:["border-none"]},type:"text",className:"w-full lg:w-80 mb-1",size:"sm",placeholder:"Buscar por nombre...",startContent:e.jsx(c,{path:B,size:1}),value:l,onClear:()=>z(),onValueChange:P}),e.jsxs("div",{className:"flex justify-between items-center w-full gap-1 md:gap-3",children:[e.jsx("div",{className:"flex items-center ",children:e.jsxs("span",{className:"text-default-400 text-tiny lg:text-small",children:["Total ",d.length," funcionarios"]})}),e.jsxs(h,{color:"warning",className:"min-w-0 min-h-0",onPress:()=>limpiarFiltros(),children:[e.jsx(c,{path:D,size:1}),e.jsx("p",{className:"hidden md:flex",children:"Limpiar filtros"})]}),e.jsx("div",{className:"",children:e.jsxs("label",{className:"flex items-center text-default-400 text-tiny lg:text-small",children:["Filas por pagina:",e.jsx(K,{onChange:s=>{A(s),o(1)},value:a,opciones:[{id:5,nombre:5},{id:8,nombre:8},{id:12,nombre:12}]})]})})]})]})})}),e.jsxs(V,{children:[e.jsxs("div",{className:"flex justify-between mb-3",children:[e.jsx("div",{children:e.jsx("h1",{className:"text-large md:text-2xl",children:"Resultados"})}),e.jsx("div",{className:"flex gap-3",children:p("Gestion-Crear funcionario")?e.jsx(e.Fragment,{children:e.jsx(N,{content:"Agregar funcionario",color:"primary",children:e.jsx(w,{href:route("funcionario.create"),children:e.jsx(h,{color:"success",variant:"solid",size:"sm",className:"min-w-0 min-h-0",endContent:e.jsx(c,{path:L,size:1}),children:e.jsx("div",{className:"hidden text-tiny md:flex md:text-small",children:"Agregar funcionario"})})})})}):e.jsx(e.Fragment,{})})]}),e.jsx("div",{className:"w-full",children:e.jsxs(J,{"aria-label":"Tabla documentos",color:"primary",selectedKeys:F,onSelectionChange:S,bottomContent:e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(Q,{isCompact:!0,showControls:!0,showShadow:!0,color:"secondary",page:u,total:T,onChange:s=>o(s)})}),classNames:{wrapper:"min-h-[222px]"},children:[e.jsx(U,{children:y.map(s=>e.jsx(W,{className:"text-start text-small",children:s.name},s.uid))}),e.jsx(X,{emptyContent:"No existen funcionarios",children:I.map(s=>e.jsxs(Y,{className:"text-start",children:[e.jsx(n,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.id}),e.jsx(n,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.nombres}),e.jsx(n,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.apellidos}),e.jsx(n,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.abreviacion}),e.jsx(n,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:p("Gestion-Editar funcionario")?e.jsx(e.Fragment,{children:e.jsx(N,{content:"Editar",color:"warning",children:e.jsx(w,{href:route("funcionario.edit",String(s.id)),children:e.jsx(h,{className:"me-1",size:"sm",color:"warning",variant:"flat",children:e.jsx(c,{path:k,size:1})})})})}):e.jsx(e.Fragment,{})})]},s.id))})]})})]})]})};export{xe as default};
