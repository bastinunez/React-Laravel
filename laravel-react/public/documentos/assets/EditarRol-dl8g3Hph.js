import{r as n,q as Q,W as N,j as e,a as V,d as W}from"./app-eXGWw0Q1.js";import{C as S}from"./ContentTemplate-Tjr8Dmcy.js";import{T as k}from"./TitleTemplate-g8fmxVri.js";import{A as B,b as c,I as _,K as J,f as U}from"./AuthenticatedLayout-xmXHQCqJ.js";import{I as P}from"./InputLabel-_BYtn3Q_.js";import{I as X}from"./InputError-Gq9t3JFB.js";import{T as Y}from"./TextInput-ahoRra4W.js";import{T as Z}from"./toast.esm-hh8KxqiJ.js";import{d as $,a as ee,b as se,m as re}from"./chunk-L6QJ42W6-38BLIl0j.js";import{t as te,p as ae,a as oe,b as E,c as le,d as ie,e as C}from"./chunk-YRZGWF2W-C22kSm3v.js";import"./import-cu65eCSh.js";import"./import-Yb5YGcqg.js";import"./chunk-AMSULWPV-Pe1sDtjI.js";import"./import-oEubEFRA.js";const Te=({auth:T})=>{const g=n.useRef(null),t={success:"success",error:"error"},a={success:"Exito",error:"Error"},o=(s,r,i)=>{g.current.show({severity:r,summary:i,detail:s,life:3e3})},{rol:l,all_permisos:D}=Q().props,h=D.filter(s=>!l.permissions.some(r=>r.name===s.name)),{data:b,setData:I,patch:A,processing:ne,errors:M,reset:ce}=N({nombre:l.name}),{data:m,setData:me,patch:f,errors:de,reset:ue}=N({permisos:[],opcion:""}),[d,z]=n.useState([]),[u,xe]=n.useState({column:"fecha",direction:"ascending"}),[j,F]=n.useState(1),[x,pe]=n.useState(6),R=Math.ceil(l.permissions.length/x),w=n.useMemo(()=>{const s=(j-1)*x,r=s+x;return l.permissions.slice(s,r)},[j,l.permissions,x]),K=n.useMemo(()=>[...w].sort((s,r)=>{const i=s[u.column],v=r[u.column],y=i<v?-1:i>v?1:0;return u.direction==="descending"?-y:y}),[u,w]),[p,O]=n.useState(""),q=s=>{s.preventDefault(),A(route("rol.update",String(l.id)),{onSuccess:()=>{o("Exito",t.success,a.success)},onError:()=>{o("Falló",t.error,a.error)}})},G=()=>{if(p.size>0){let s="";p=="all"?s=h.map(r=>r.id):s=Array.from(p).map(i=>i),m.permisos=s,f(route("rol.addPermissions",String(l.id)),{onSuccess:()=>{o("Exito",t.success,a.success)},onError:()=>{o("Falló",t.error,a.error)}})}else o("No hay seleccion",t.error,a.error)},H=s=>{m.permisos=[s],m.opcion=0,f(route("rol.deletePermissions",String(l.id)),{onSuccess:()=>{o("Exito",t.success,a.success)},onError:()=>{o("Falló",t.error,a.error)}})},L=()=>{if(d.size>0){let s="";d=="all"?s=h.map(r=>r.id):s=Array.from(d).map(i=>i),m.permisos=s,m.opcion=1,f(route("rol.deletePermissions",String(l.id)),{onSuccess:()=>{o("Exito",t.success,a.success)},onError:()=>{o("Falló",t.error,a.error)}})}else o("No hay seleccion",t.error,a.error)};return e.jsxs(B,{user:T.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Editar rol"}),children:[e.jsx(V,{title:"Editar rol"}),e.jsx(k,{children:"Editar rol"}),e.jsx(Z,{ref:g}),e.jsx(S,{children:e.jsx("div",{children:e.jsx("div",{children:e.jsxs("form",{onSubmit:q,className:"p-8",children:[e.jsx("div",{className:"xl:flex w-full mb-5 xl: gap-5",children:e.jsxs("div",{className:"w-full xl:me-5",children:[e.jsx(P,{value:"Ingresa nombre"}),e.jsx(Y,{type:"text",className:"w-full",placeholder:b.nombre,value:b.nombre,onChange:s=>I("nombre",s.target.value)}),e.jsx(X,{message:M.nombre,className:"mt-2"})]})}),e.jsxs("div",{className:"xl:flex xl:gap-2",children:[e.jsx(W,{href:route("rol.index"),className:"w-full",children:e.jsx(c,{className:"w-full text-large",color:"warning",variant:"ghost",children:"Volver atrás"})}),e.jsx(c,{className:"w-full text-large",color:"primary",variant:"ghost",type:"submit",children:"Guardar cambios"})]})]})})})}),e.jsx(S,{children:e.jsxs("div",{children:[e.jsxs("div",{className:"w-full mb-8",children:[e.jsx(P,{value:"Seleccionar permisos para agregar: ",className:"flex items-center me-5"}),e.jsxs("div",{className:"w-full flex gap-8",children:[e.jsx("div",{children:e.jsxs($,{children:[e.jsx(ee,{className:"hidden sm:flex",children:e.jsx(c,{endContent:e.jsx(_,{path:J,size:1}),variant:"flat",children:"Permisos"})}),e.jsx(se,{"aria-label":"Table Columns",id:"permission",selectedKeys:p,style:{maxHeight:"300px"},className:"overflow-hidden whitespace-nowrap overflow-y-scroll",onSelectionChange:O,closeOnSelect:!1,selectionMode:"multiple",items:h,children:s=>e.jsx(re,{children:s.name},s.name)})]})}),e.jsx("div",{children:e.jsx(c,{className:"w-full text-large",color:"primary",onPress:()=>G(),variant:"ghost",type:"submit",children:"Agregar permisos selecccionados"})})]})]}),e.jsx("div",{children:e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:"flex mb-2",children:e.jsx("div",{className:"w-full justify-end flex",children:e.jsx(c,{className:"",color:"danger",variant:"flat",onPress:()=>L(),children:"Quitar seleccionados"})})}),e.jsxs(te,{"aria-label":"Tabla documentos",color:"primary",selectionMode:"multiple",selectedKeys:d,onSelectionChange:z,bottomContent:e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(ae,{isCompact:!0,showControls:!0,showShadow:!0,color:"secondary",page:j,total:R,onChange:s=>F(s)})}),children:[e.jsxs(oe,{children:[e.jsx(E,{className:"text-start text-tiny lg:text-small",children:"Permiso"}),e.jsx(E,{className:"text-start text-tiny lg:text-small",children:"Acción"})]}),e.jsx(le,{className:"",children:K.map((s,r)=>e.jsxs(ie,{children:[e.jsx(C,{className:"overflow-hidden whitespace-nowrap text-ellipsis text-tiny lg:text-small",children:s.name}),e.jsx(C,{className:"overflow-hidden whitespace-nowrap text-ellipsis text-tiny lg:text-small",children:e.jsx(c,{color:"danger",endContent:e.jsx(_,{size:1,path:U}),onPress:()=>H(s),size:"sm"})})]},s.name))})]})]})})]})})]})};export{Te as default};
