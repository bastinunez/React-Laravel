import{r as t,q as Se,W as ve,j as e,a as ye,d as K}from"./app-peuYjEpJ.js";import{C as _e}from"./ContentTemplate-Ei9JbHLa.js";import{F as Fe}from"./FilterTemplate-lUzzgUcq.js";import{T as Ee}from"./TitleTemplate-VNYP4QaZ.js";import{A as ze,I as i,m as P,b as c,K as Ae,a as Pe,t as M,c as Me,L as Re,M as Oe,d as Te,u as ke}from"./AuthenticatedLayout-p56YD4qG.js";import{S as Le}from"./Select-9YCHe840.js";import{T as Be}from"./toast.esm-scV4M1sv.js";import{u as De,m as Ie,a as Ve,b as He,c as Ge,d as Ke}from"./index-tpWZSiLQ.js";import{i as R}from"./chunk-TC4QW7OA-pQkPxgO7.js";import{d as U,a as q,b as W,m as $}from"./chunk-L6QJ42W6-TZgBgFLH.js";import{t as Ue,p as qe,a as We,b as $e,c as Je,d as Qe,e as d}from"./chunk-YRZGWF2W-82o9ud7j.js";import{c as J}from"./chunk-OFH6WYRQ-8w9UZ3ya.js";import"./import-a4H3-vU0.js";import"./import-Z4lNxWiv.js";import"./import-V_VTaOEA.js";import"./import-afMrECeO.js";import"./chunk-AMSULWPV-tDjQ4Vjp.js";const Ns=({auth:Q})=>{const k=t.useRef(null),x={success:"success",error:"error"},p={success:"Exito",error:"Error"},f=(s,a,r)=>{k.current.show({severity:a,summary:r,detail:s,life:3e3})},{hasRoles:Xe,hasPermission:g}=ke(),{usuarios:m,estados:u}=Se().props,{isOpen:X,onOpen:L,onOpenChange:Y}=De(),[Z,Ye]=t.useState("auto"),[ee,B]=t.useState(""),[se,D]=t.useState(""),[ae,I]=t.useState(""),{data:j,setData:Ze,post:es,processing:ss,errors:as,reset:ts,patch:V}=ve({id_users:[],opcion:""}),[h,te]=t.useState([]),[S,v]=t.useState(""),[y,_]=t.useState(""),[b,F]=t.useState(""),[E,z]=t.useState(""),re=!!S,oe=!!y,le=!!b,ne=!!E,[C,H]=t.useState("all"),[A,rs]=t.useState({column:"fecha",direction:"ascending"}),O=t.useMemo(()=>{let s=[...m];if(re&&(s=s.filter(a=>a.nombres.toLowerCase().includes(S.toLowerCase()))),oe&&(s=s.filter(a=>a.apellidos.toLowerCase().includes(y.toLowerCase()))),ne&&(s=s.filter(a=>a.correo.toLowerCase().includes(E.toLowerCase()))),le&&(s=s.filter(a=>a.rut.toLowerCase().includes(b.toLowerCase()))),C!=="all"&&Array.from(C).length!==u.length){let a=new Set([...C].map(r=>{const o=u.find(n=>n.id===parseInt(r));return o?o.nombre:null}).filter(r=>r!==null));s=s.filter(r=>Array.from(a).includes(r.estado))}return s},[m,C,S,y,b,E,b]),[T,l]=t.useState(1),[w,ie]=t.useState(8),ce=Math.ceil(O.length/w),G=t.useMemo(()=>{const s=(T-1)*w,a=s+w;return O.slice(s,a)},[T,O,w]),de=t.useMemo(()=>[...G].sort((s,a)=>{const r=s[A.column],o=a[A.column],n=r<o?-1:r>o?1:0;return A.direction==="descending"?-n:n}),[A,G]),me=t.useCallback(s=>{s?(v(s),l(1)):v("")},[]),ue=t.useCallback(()=>{v(""),l(1)},[]),he=t.useCallback(s=>{s?(_(s),l(1)):_("")},[]),xe=t.useCallback(()=>{_(""),l(1)},[]),pe=t.useCallback(s=>{s?(F(s),l(1)):F("")},[]),fe=t.useCallback(()=>{F(""),l(1)},[]),je=t.useCallback(s=>{s?(z(s),l(1)):z("")},[]),ge=t.useCallback(()=>{z(""),l(1)},[]),be=[{name:"ID",uid:"id",sortable:!0},{name:"Nombres",uid:"nombres",sortable:!0},{name:"Apellidos",uid:"apellidos",sortable:!0},{name:"Correo",uid:"correo",sortable:!0},{name:"Rut",uid:"rut"},{name:"Rol",uid:"rol"},{name:"Permisos",uid:"permisos"},{name:"Estado",uid:"estado"},{name:"Acciones",uid:"actions"}],Ce=s=>{if(h.length!=0){let a=[];h=="all"?(a=m.filter(r=>(r.estado,u[0].nombre,r.id)),a=a.map(r=>r.id),j.opcion=2):(a=Array.from(h).map(o=>{const n=m.find(N=>N.id==Number(o)&&N.estado===u[0].nombre);return n?n.id:void 0}).filter(o=>o!==void 0),j.opcion=2),j.id_users=a,V(route("gestion-usuarios.update-collection",0),{onSuccess:r=>{f("Exito",x.success,p.success)},onError:()=>{f("Falló",x.error,p.error)}})}else f("No seleccionaste datos",x.error,p.error)},we=s=>{if(h.length!=0){let a=[];h=="all"?(a=m.filter(r=>(r.estado,u[1].nombre,r.id)),a=a.map(r=>r.id),j.opcion=1):(a=Array.from(h).map(o=>{const n=m.find(N=>N.id==Number(o)&&N.estado===u[1].nombre);return n?n.id:void 0}).filter(o=>o!==void 0),j.opcion=1),j.id_users=a,V(route("gestion-usuarios.update-collection",0),{onSuccess:r=>{f("Exito",x.success,p.success)},onError:()=>{f("Error",x.error,p.error)}})}else f("No seleccionaste datos",x.error,p.error)},Ne=()=>{H("all"),_(""),z(""),v(""),F("")};return e.jsxs(ze,{user:Q.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Gestion de usuarios"}),children:[e.jsx(Ee,{children:"Gestion de usuarios"}),e.jsx(ye,{title:"Gestion de usuarios"}),e.jsx(Be,{ref:k}),e.jsx(Fe,{children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"md:flex justify-center gap-4 items-end",children:[e.jsx(R,{isClearable:!0,classNames:{input:["border-none"]},type:"text",className:"w-full mb-1",size:"sm",placeholder:"Buscar por nombre...",startContent:e.jsx(i,{path:P,size:1}),value:S,onClear:()=>ue(),onValueChange:me}),e.jsx(R,{isClearable:!0,classNames:{input:["border-none"]},className:"w-full mb-1",size:"sm",placeholder:"Buscar por apellido...",startContent:e.jsx(i,{path:P,size:1}),value:y,onClear:()=>xe(),onValueChange:he}),e.jsx(R,{isClearable:!0,classNames:{input:["border-none"]},className:"w-full mb-1",size:"sm",placeholder:"Buscar por rut...",startContent:e.jsx(i,{path:P,size:1}),value:b,onClear:()=>fe(),onValueChange:pe}),e.jsx(R,{isClearable:!0,classNames:{input:["border-none"]},className:"w-full mb-1",size:"sm",placeholder:"Buscar por correo...",startContent:e.jsx(i,{path:P,size:1}),value:E,onClear:()=>ge(),onValueChange:je}),e.jsx("div",{className:"flex gap-3 mb-1",children:e.jsx("div",{className:"flex items-center",children:e.jsxs(U,{children:[e.jsx(q,{className:"hidden sm:flex",children:e.jsx(c,{endContent:e.jsx(i,{path:Ae,size:1}),variant:"flat",children:"Estado"})}),e.jsx(W,{disallowEmptySelection:!0,"aria-label":"Table Columns",closeOnSelect:!1,selectedKeys:C,selectionMode:"multiple",onSelectionChange:H,children:u.map(s=>e.jsx($,{children:s.nombre},s.id))})]})})})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("div",{children:e.jsxs("span",{className:"text-default-400 text-tiny lg:text-small",children:["Total ",m.length," usuarios"]})}),e.jsxs("div",{className:"flex gap-5",children:[e.jsxs(c,{color:"warning",className:"min-w-0 min-h-0",onPress:()=>Ne(),children:[e.jsx(i,{path:Pe,size:1}),e.jsx("p",{className:"hidden sm:flex",children:"Limpiar filtros"})]}),e.jsxs("label",{className:"flex items-center text-default-400 text-tiny lg:text-small",children:["Filas por pagina:",e.jsx(Le,{onChange:s=>{ie(s),l(1)},value:w,opciones:[{id:5,nombre:5},{id:8,nombre:8},{id:12,nombre:12}]})]})]})]})]})}),e.jsxs(_e,{children:[e.jsxs("div",{className:"flex justify-between mb-3",children:[e.jsx("div",{children:e.jsx("h1",{className:"text-large md:text-2xl",children:"Resultados"})}),e.jsxs("div",{className:"flex gap-3 md:gap-3",children:[g("Crear usuario")||g("Cargar usuarios xlsx")?e.jsx(e.Fragment,{children:e.jsx(K,{href:route("gestion-usuarios.create"),children:e.jsx(M,{content:"Crear usuario",color:"success",children:e.jsx(c,{color:"success",variant:"solid",size:"sm",className:"min-w-0 min-h-0",endContent:e.jsx(i,{path:Me,size:1}),children:e.jsx("div",{className:"hidden text-tiny md:flex xl:text-small",children:"Agregar usuario"})})})})}):e.jsx(e.Fragment,{}),g("Anular usuario")?e.jsx(e.Fragment,{children:e.jsx(M,{content:"Anular usuario",color:"danger",children:e.jsx(c,{color:"danger",variant:"solid",size:"sm",className:"min-w-0 min-h-0",onPress:()=>{B(()=>()=>Ce()),D("Anular usuarios seleccionados"),I("¿Está seguro de anular los usuarios?"),L()},endContent:e.jsx(i,{path:Re,size:1}),children:e.jsx("div",{className:"hidden text-tiny md:flex xl:text-small",children:"Anular seleccionados"})})})}):e.jsx(e.Fragment,{}),g("Habilitar usuario")?e.jsx(e.Fragment,{children:e.jsx(M,{content:"Habilitar usuario",color:"secondary",children:e.jsx(c,{color:"secondary",variant:"solid",size:"sm",className:"min-w-0 min-h-0",onPress:()=>{B(()=>()=>we()),D("Habilitar usuarios seleccionados"),I("¿Está seguro de habilitar los usuarios?"),L()},endContent:e.jsx(i,{path:Oe,size:1}),children:e.jsx("div",{className:"hidden text-tiny md:flex xl:text-small",children:"Habilitar seleccionados"})})})}):e.jsx(e.Fragment,{})]})]}),e.jsx("div",{className:"w-full",children:e.jsxs(Ue,{"aria-label":"Tabla documentos",color:"primary",selectionMode:"multiple",selectedKeys:h,onSelectionChange:te,bottomContent:e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(qe,{isCompact:!0,showControls:!0,showShadow:!0,color:"secondary",page:T,total:ce,onChange:s=>l(s)})}),classNames:{wrapper:"min-h-[222px]"},children:[e.jsx(We,{children:be.map(s=>e.jsx($e,{className:"text-start text-small",children:s.name},s.uid))}),e.jsx(Je,{emptyContent:"No existen usuarios",children:de.map(s=>e.jsxs(Qe,{className:"text-start",children:[e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.id}),e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.nombres}),e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.apellidos}),e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.correo}),e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.rut}),e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.roles[0].name}),e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.permissions.length!==0?e.jsx(e.Fragment,{children:e.jsxs(U,{type:"listbox",children:[e.jsx(q,{children:e.jsx(c,{variant:"bordered",size:"sm",children:"Ver permisos"})}),e.jsx(W,{className:"h-64 overflow-auto","aria-label":"Static Actions",onScroll:!0,emptyContent:"No posee",children:s.permissions.map(a=>e.jsx($,{textValue:`${a}`,children:a},a))})]})}):e.jsx(e.Fragment,{children:e.jsx("p",{className:"",children:"No posee"})})}),e.jsx(d,{children:s.estado==="Habilitado"?e.jsx(e.Fragment,{children:e.jsx(J,{className:"capitalize",color:"success",size:"sm",variant:"flat",children:s.estado})}):e.jsx(e.Fragment,{children:e.jsx(J,{className:"capitalize",color:"danger",size:"sm",variant:"flat",children:s.estado})})}),e.jsx(d,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:e.jsx(e.Fragment,{children:g("Editar usuario")?e.jsx(e.Fragment,{children:e.jsx(M,{content:"Editar",color:"warning",children:e.jsx(K,{href:route("gestion-usuarios.edit",String(s.id)),children:e.jsx(c,{className:"me-1",size:"sm",color:"warning",variant:"flat",children:e.jsx(i,{path:Te,size:1})})})})}):e.jsx(e.Fragment,{})})})]},s.id))})]})})]}),e.jsx(Ie,{isOpen:X,placement:Z,onOpenChange:Y,size:"md",children:e.jsx(Ve,{children:s=>e.jsxs(e.Fragment,{children:[e.jsx(He,{className:"flex flex-col gap-1",children:se}),e.jsx(Ge,{children:ae}),e.jsxs(Ke,{children:[e.jsx(c,{color:"danger",variant:"light",onPress:s,children:"Cerrar"}),e.jsx(c,{color:"primary",onPress:s,onClick:()=>ee(),children:"Confirmar"})]})]})})})]})};export{Ns as default};