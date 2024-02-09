import{r as t,q as $,j as e,a as ee}from"./app-eXGWw0Q1.js";import{C as se}from"./ContentTemplate-Tjr8Dmcy.js";import{T as te}from"./TitleTemplate-g8fmxVri.js";import{A as ae,I as u,m as v,b as R,K as le,a as re}from"./AuthenticatedLayout-xmXHQCqJ.js";import{T as oe}from"./toast.esm-hh8KxqiJ.js";import{C as T}from"./calendar.esm-zfuum9_B.js";import{S as ne}from"./Select-okRpXzt-.js";import{F as ie}from"./FilterTemplate-NM1ULPE2.js";import{i as F}from"./chunk-TC4QW7OA-vNTTWJaW.js";import{d as ce,a as de,b as me,m as ue}from"./chunk-L6QJ42W6-38BLIl0j.js";import{t as pe,p as he,a as fe,b as xe,c as be,d as je,e as w}from"./chunk-YRZGWF2W-C22kSm3v.js";import"./import-l4FZ2bLw.js";import"./import-oEubEFRA.js";import"./import-cu65eCSh.js";import"./import-Yb5YGcqg.js";import"./chunk-AMSULWPV-Pe1sDtjI.js";const Le=({auth:z})=>{const M=t.useRef(null),{historial:N,tipos:ge,acciones:y}=$().props,[k,B]=t.useState([]),[i,D]=t.useState(""),[c,I]=t.useState(""),[p,h]=t.useState(""),[f,x]=t.useState(""),[b,j]=t.useState(""),L=!!p,O=!!f,P=!!b,[d,V]=t.useState("all"),[g,E]=t.useState("all");t.useState("all");const[C,Ce]=t.useState({column:"fecha",direction:"ascending"}),H=[{name:"Responsable",uid:"responsable",sortable:!0},{name:"Acción",uid:"accion",sortable:!0},{name:"Detalles",uid:"detalles",sortable:!0},{name:"Creado",uid:"creado",sortable:!0}],S=t.useMemo(()=>{let s=[...N];if(L&&(s=s.filter(a=>a.doc_numero==parseInt(p))),O&&(s=s.filter(a=>(a.responsable.nombres+" "+a.responsable.apellidos).toLowerCase().includes(f.toLowerCase()))),P&&(s=s.filter(a=>a.detalles?a.detalles.toLowerCase().includes(b.toLowerCase()):null)),i&&(s=s.filter(a=>{const l=new Date(a.doc_fecha);return l>=i[0]&&l<=i[1]})),c&&(s=s.filter(a=>{const l=new Date(a.created_at);return l>=c[0]&&l<=c[1]})),d!=="all"&&Array.from(d).length!==y.length){let a=new Set([...d].map(l=>{const r=y.find(n=>n.id===parseInt(l));return r?r.nombre:null}).filter(l=>l!==null));s=s.filter(l=>Array.from(a).includes(l.accion.nombre))}if(g!=="all"&&Array.from(g).length!==autores.length){let a=new Set([...g].map(l=>{const r=autores.find(n=>n.id===parseInt(l));return r?[r.nombres+" "+r.apellidos]:null}).filter(l=>l!==null));s=s.filter(l=>Array.from(a).some(r=>JSON.stringify(r)===JSON.stringify([l.doc_autor])))}return s},[N,p,b,f,d,g,i,c]),[_,o]=t.useState(1),[m,K]=t.useState(8),J=Math.ceil(S.length/m),A=t.useMemo(()=>{const s=(_-1)*m,a=s+m;return S.slice(s,a)},[_,S,m]),q=t.useMemo(()=>[...A].sort((s,a)=>{const l=s[C.column],r=a[C.column],n=l<r?-1:l>r?1:0;return C.direction==="descending"?-n:n}),[C,A]),G=t.useCallback(s=>{s?(h(s),o(1)):h("")},[]),Q=t.useCallback(()=>{h(""),o(1)},[]),U=t.useCallback(s=>{s?(x(s),o(1)):x("")},[]),W=t.useCallback(()=>{x(""),o(1)},[]),X=t.useCallback(s=>{s?(j(s),o(1)):j("")},[]),Y=t.useCallback(()=>{j(""),o(1)},[]),Z=()=>{h(""),I(""),D(""),E("all"),x(""),j("")};return e.jsxs(ae,{user:z.user,children:[e.jsx(ee,{title:"Historial sobre formulario"}),e.jsx(oe,{ref:M}),e.jsx(te,{children:"Historial sobre formulario"}),e.jsx(ie,{children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"xl:flex",children:[e.jsxs("div",{className:"lg:flex gap-4 justify-center items-end",children:[e.jsx(F,{isClearable:!0,classNames:{input:["border-none"]},type:"text",className:"w-full mb-1",size:"sm",placeholder:"Buscar por numero...",startContent:e.jsx(u,{path:v,size:1}),value:p,onClear:()=>Q(),onValueChange:G}),e.jsx(F,{isClearable:!0,classNames:{input:["border-none"]},type:"text",className:"w-full mb-1",size:"sm",placeholder:"Buscar por responsable...",startContent:e.jsx(u,{path:v,size:1}),value:f,onClear:()=>W(),onValueChange:U}),e.jsx(F,{isClearable:!0,classNames:{input:["border-none"]},type:"text",className:"w-full mb-1",size:"sm",placeholder:"Buscar por detalles...",startContent:e.jsx(u,{path:v,size:1}),value:b,onClear:()=>Y(),onValueChange:X})]}),e.jsxs("div",{className:"lg:flex gap-4 justify-center items-end",children:[e.jsx("div",{className:"w-full card mb-1",children:e.jsx(T,{className:"max-h-10 border-0 flex p-0",placeholder:"Rango de fecha documento",dateFormat:"yy//mm/dd",showIcon:!0,value:i,onChange:s=>D(s.value),selectionMode:"range",readOnlyInput:!0})}),e.jsx("div",{className:"w-full card mb-1",children:e.jsx(T,{className:"max-h-10 border-0 flex p-0",placeholder:"Rango de fecha registro",dateFormat:"yy//mm/dd",showIcon:!0,value:c,onChange:s=>I(s.value),selectionMode:"range",readOnlyInput:!0})}),e.jsx("div",{className:"flex gap-3",children:e.jsx("div",{children:e.jsxs(ce,{children:[e.jsx(de,{className:"text-tiny lg:text-small",children:e.jsx(R,{endContent:e.jsx(u,{path:le,size:1}),variant:"flat",children:"Accion"})}),e.jsx(me,{disallowEmptySelection:!0,"aria-label":"Table Columns",closeOnSelect:!1,selectedKeys:d,selectionMode:"multiple",onSelectionChange:V,children:y.map(s=>e.jsx(ue,{children:s.nombre},s.id))})]})})})]})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("div",{children:e.jsxs("span",{className:"text-default-400 text-tiny lg:text-small",children:["Total ",N.length," filas"]})}),e.jsxs("div",{className:"flex gap-5",children:[e.jsxs(R,{color:"warning",className:"min-w-0 min-h-0",onPress:()=>Z(),children:[e.jsx(u,{path:re,size:1}),e.jsx("p",{className:"hidden sm:flex",children:"Limpiar filtros"})]}),e.jsxs("label",{className:"flex items-center text-default-400 text-tiny lg:text-small",children:["Filas por pagina:",e.jsx(ne,{onChange:s=>{K(s),o(1)},value:m,opciones:[{id:5,nombre:5},{id:8,nombre:8},{id:12,nombre:12}]})]})]})]})]})}),e.jsx(se,{children:e.jsx("div",{children:e.jsx("div",{children:e.jsxs(pe,{"aria-label":"Tabla historial",color:"primary",selectedKeys:k,onSelectionChange:B,bottomContent:e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(he,{isCompact:!0,showControls:!0,showShadow:!0,color:"secondary",page:_,total:J,onChange:s=>o(s)})}),classNames:{wrapper:"min-h-[222px]"},children:[e.jsx(fe,{children:H.map(s=>e.jsx(xe,{className:"text-start text-small",children:s.name},s.uid))}),e.jsx(be,{emptyContent:"No existen historial",children:q.map((s,a)=>e.jsxs(je,{className:"text-start",children:[e.jsxs(w,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:[s.responsable.nombres," ",s.responsable.apellidos]}),e.jsx(w,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.accion.nombre}),e.jsx(w,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:s.detalles}),e.jsx(w,{className:"overflow-hidden whitespace-nowrap text-ellipsis",children:new Date(s.created_at).toLocaleString()})]},a))})]})})})})]})};export{Le as default};
