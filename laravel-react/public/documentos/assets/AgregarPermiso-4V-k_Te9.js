import{r as c,W as p,j as e,a as x,d as u}from"./app-eXGWw0Q1.js";import{C as g}from"./ContentTemplate-Tjr8Dmcy.js";import{T as d}from"./TitleTemplate-g8fmxVri.js";import{A as f,b as s}from"./AuthenticatedLayout-xmXHQCqJ.js";import{I as h}from"./InputLabel-_BYtn3Q_.js";import{I as j}from"./InputError-Gq9t3JFB.js";import{T as b}from"./TextInput-ahoRra4W.js";import{T as v}from"./toast.esm-hh8KxqiJ.js";const S=({auth:a})=>{const t=c.useRef(null),{data:o,setData:l,post:m,processing:N,errors:n,reset:T}=p({nombre:""}),i=r=>{r.preventDefault(),m(route("permiso.store"),{onSuccess:()=>console.log("bien")})};return e.jsxs(f,{user:a.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Agregar permiso"}),children:[e.jsx(x,{title:"Agregar permiso"}),e.jsx(d,{children:"Agregar permiso"}),e.jsx(v,{ref:t}),e.jsx(g,{children:e.jsx("div",{children:e.jsxs("form",{onSubmit:i,className:"p-8",children:[e.jsxs("div",{className:" w-full mb-5 gap-10",children:[e.jsx(h,{value:"Ingresa nombre"}),e.jsx(b,{type:"text",className:"w-full",placeholder:"Nombre",value:o.nombre,onChange:r=>l("nombre",r.target.value)}),e.jsx(j,{message:n.nombre,className:"mt-2"})]}),e.jsxs("div",{className:"w-full xl:flex gap-10",children:[e.jsx(u,{href:route("permiso.index"),className:"w-full",children:e.jsx(s,{className:"w-full text-large",color:"warning",variant:"ghost",children:"Volver atrás"})}),e.jsx(s,{type:"submit",color:"primary",variant:"ghost",className:"w-full text-large",children:"Agregar"})]})]})})})]})};export{S as default};
