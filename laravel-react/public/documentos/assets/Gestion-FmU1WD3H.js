import{q as I,r as t,j as e,a as M,d as w}from"./app-eXGWw0Q1.js";import{A as E,I as o,m as V,b as c,a as B,t as N,c as D,d as G,u as L}from"./AuthenticatedLayout-xmXHQCqJ.js";import{T as k}from"./TitleTemplate-g8fmxVri.js";import{C as O}from"./ContentTemplate-Tjr8Dmcy.js";import{F as q}from"./FilterTemplate-NM1ULPE2.js";import{S as K}from"./Select-okRpXzt-.js";import"./TextInput-ahoRra4W.js";import{i as $}from"./chunk-TC4QW7OA-vNTTWJaW.js";import{t as H,p as J,a as Q,b as U,c as W,d as X,e as m}from"./chunk-YRZGWF2W-C22kSm3v.js";import{d as Y,a as Z,b as ee,m as se}from"./chunk-L6QJ42W6-38BLIl0j.js";import"./import-l4FZ2bLw.js";import"./import-oEubEFRA.js";import"./chunk-AMSULWPV-Pe1sDtjI.js";import"./import-cu65eCSh.js";import"./import-Yb5YGcqg.js";const we=({auth:_})=>{const{hasRoles:te,hasPermission:p}=L(),{all_roles:C}=I().props,[d,ae]=t.useState(C),v=[{name:"ID",uid:"id",sortable:!0},{name:"Nombre",uid:"nombre",sortable:!0},{name:"Permisos",uid:"permisos",sortable:!0},{name:"Acciones",uid:"accion"}],[r,x]=t.useState(""),[y,S]=t.useState([]),F=!!r,u=t.useMemo(()=>{let s=[...d];return F&&(s=s.filter(a=>a.name.toLowerCase().includes(r.toLowerCase()))),s},[d,r]),P=t.useCallback(s=>{s?(x(s),n(1)):x("")},[]),z=t.useCallback(()=>{x(""),n(1)},[]),[i,le]=t.useState({column:"fecha",direction:"ascending"}),[h,n]=t.useState(1),[l,R]=t.useState(8),T=Math.ceil(u.length/l),f=t.useMemo(()=>{const s=(h-1)*l,a=s+l;return u.slice(s,a)},[h,u,l]),A=t.useMemo(()=>[...f].sort((s,a)=>{const j=s[i.column],g=a[i.column],b=j<g?-1:j>g?1:0;return i.direction==="descending"?-b:b}),[i,f]);return e.jsxs(E,{user:_.user,children:[e.jsx(M,{title:"Roles"}),e.jsx(k,{children:"Roles"}),e.jsx(q,{children:e.jsx("div",{className:"flex flex-col",children:e.jsxs("div",{className:"md:flex justify-center md:gap-4 items-end",children:[e.jsx($,{isClearable:!0,classNames:{input:["border-none"]},type:"text",className:"w-full lg:w-80 mb-1",size:"sm",placeholder:"Buscar por nombre...",startContent:e.jsx(o,{path:V,size:1}),value:r,onClear:()=>z(),onValueChange:P}),e.jsxs("div",{className:"flex justify-between items-center w-full gap-1 md:gap-3",children:[e.jsx("div",{className:"flex items-center",children:e.jsxs("span",{className:"text-default-400 text-tiny lg:text-small",children:["Total ",d.length," roles"]})}),e.jsxs(c,{color:"warning",className:"min-w-0 min-h-0",onPress:()=>limpiarFiltros(),children:[e.jsx(o,{path:B,size:1}),e.jsx("p",{className:"hidden lg:flex",children:"Limpiar filtros"})]}),e.jsx("div",{className:"",children:e.jsxs("label",{className:"flex items-center text-default-400 text-tiny lg:text-small",children:["Filas por pagina:",e.jsx(K,{onChange:s=>{R(s),n(1)},value:l,opciones:[{id:5,nombre:5},{id:8,nombre:8},{id:12,nombre:12}]})]})})]})]})})}),e.jsxs(O,{children:[e.jsxs("div",{className:"flex justify-between mb-3",children:[e.jsx("div",{children:e.jsx("h1",{className:"text-large md:text-2xl",children:"Resultados"})}),e.jsx("div",{className:"flex ",children:p("Gestion-Crear rol")?e.jsx(e.Fragment,{children:e.jsx(w,{href:route("rol.create"),children:e.jsx(N,{content:"Agregar rol",color:"success",children:e.jsx(c,{color:"success",variant:"solid",size:"sm",className:"min-w-0 min-h-0",endContent:e.jsx(o,{path:D,size:1}),children:e.jsx("div",{className:"hidden text-tiny md:flex md:text-small",children:"Agregar rol"})})})})}):e.jsx(e.Fragment,{})})]}),e.jsx("div",{className:"w-full",children:e.jsxs(H,{"aria-label":"Tabla documentos",color:"primary",selectedKeys:y,onSelectionChange:S,bottomContent:e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(J,{isCompact:!0,showControls:!0,showShadow:!0,color:"secondary",page:h,total:T,onChange:s=>n(s)})}),classNames:{wrapper:"min-h-[222px]"},children:[e.jsx(Q,{children:v.map(s=>e.jsx(U,{className:"text-start text-small",children:s.name},s.uid))}),e.jsx(W,{emptyContent:"No existen roles",children:A.map(s=>e.jsxs(X,{className:"text-start",children:[e.jsx(m,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.id}),e.jsx(m,{className:"overflow-auto whitespace-nowrap text-ellipsis",children:s.name}),e.jsx(m,{className:"overflow-auto whitespace-nowrap text-ellipsis",children:s.permisos.length!==0?e.jsx(e.Fragment,{children:e.jsxs(Y,{type:"listbox",children:[e.jsx(Z,{children:e.jsx(c,{variant:"bordered",size:"sm",children:"Ver permisos"})}),e.jsx(ee,{className:"h-64 overflow-auto","aria-label":"Static Actions",emptyContent:"No posee",children:s.permisos.map(a=>e.jsx(se,{textValue:`${a.name}`,children:a.name},a.id))})]})}):e.jsx(e.Fragment,{children:e.jsx("p",{className:"",children:"No posee"})})}),e.jsx(m,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:p("Gestion-Editar rol")?e.jsx(e.Fragment,{children:e.jsx(N,{content:"Editar",color:"warning",children:e.jsx(w,{href:route("rol.edit",String(s.id)),children:e.jsx(c,{className:"me-1",size:"sm",color:"warning",variant:"flat",children:e.jsx(o,{path:G,size:1})})})})}):e.jsx(e.Fragment,{})})]},s.id))})]})})]})]})};export{we as default};
