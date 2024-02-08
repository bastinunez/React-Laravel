import{J as re,K as ye,e as O,k as $e,h as Pe,a6 as Re,r as n,j as m,t as we,s as Ce,p as Ie,z as ke}from"./app-peuYjEpJ.js";import{h as te,X as Se,a5 as De,a6 as Ve,a7 as ie,a8 as Oe,Y as je,E as _e,x as M,y,j as Be}from"./AuthenticatedLayout-p56YD4qG.js";import{$ as oe,a as qe,b as Ae,c as Ee}from"./import-V_VTaOEA.js";var Le=te({slots:{base:"group relative max-w-fit inline-flex items-center justify-start cursor-pointer tap-highlight-transparent p-2 -m-2",wrapper:["relative","inline-flex","items-center","justify-center","flex-shrink-0","overflow-hidden","before:content-['']","before:absolute","before:inset-0","before:border-solid","before:border-2","before:box-border","before:border-default","after:content-['']","after:absolute","after:inset-0","after:scale-50","after:opacity-0","after:origin-center","group-data-[selected=true]:after:scale-100","group-data-[selected=true]:after:opacity-100","group-data-[hover=true]:before:bg-default-100",...Se],icon:"z-10 w-4 h-3 opacity-0 group-data-[selected=true]:opacity-100",label:"relative text-foreground select-none"},variants:{color:{default:{wrapper:"after:bg-default after:text-default-foreground text-default-foreground"},primary:{wrapper:"after:bg-primary after:text-primary-foreground text-primary-foreground"},secondary:{wrapper:"after:bg-secondary after:text-secondary-foreground text-secondary-foreground"},success:{wrapper:"after:bg-success after:text-success-foreground text-success-foreground"},warning:{wrapper:"after:bg-warning after:text-warning-foreground text-warning-foreground"},danger:{wrapper:"after:bg-danger after:text-danger-foreground text-danger-foreground"}},size:{sm:{wrapper:["w-4 h-4 mr-2","rounded-[calc(theme(borderRadius.medium)*0.5)]","before:rounded-[calc(theme(borderRadius.medium)*0.5)]","after:rounded-[calc(theme(borderRadius.medium)*0.5)]"],label:"text-small",icon:"w-3 h-2"},md:{wrapper:["w-5 h-5 mr-2","rounded-[calc(theme(borderRadius.medium)*0.6)]","before:rounded-[calc(theme(borderRadius.medium)*0.6)]","after:rounded-[calc(theme(borderRadius.medium)*0.6)]"],label:"text-medium",icon:"w-4 h-3"},lg:{wrapper:["w-6 h-6 mr-2","rounded-[calc(theme(borderRadius.medium)*0.7)]","before:rounded-[calc(theme(borderRadius.medium)*0.7)]","after:rounded-[calc(theme(borderRadius.medium)*0.7)]"],label:"text-large",icon:"w-5 h-4"}},radius:{none:{wrapper:"rounded-none before:rounded-none after:rounded-none"},sm:{wrapper:["rounded-[calc(theme(borderRadius.medium)*0.5)]","before:rounded-[calc(theme(borderRadius.medium)*0.5)]","after:rounded-[calc(theme(borderRadius.medium)*0.5)]"]},md:{wrapper:["rounded-[calc(theme(borderRadius.medium)*0.6)]","before:rounded-[calc(theme(borderRadius.medium)*0.6)]","after:rounded-[calc(theme(borderRadius.medium)*0.6)]"]},lg:{wrapper:["rounded-[calc(theme(borderRadius.medium)*0.7)]","before:rounded-[calc(theme(borderRadius.medium)*0.7)]","after:rounded-[calc(theme(borderRadius.medium)*0.7)]"]},full:{wrapper:"rounded-full before:rounded-full after:rounded-full"}},lineThrough:{true:{label:["inline-flex","items-center","justify-center","before:content-['']","before:absolute","before:bg-foreground","before:w-0","before:h-0.5","group-data-[selected=true]:opacity-60","group-data-[selected=true]:before:w-full"]}},isDisabled:{true:{base:"opacity-disabled pointer-events-none"}},isInvalid:{true:{wrapper:"before:border-danger",label:"text-danger"}},disableAnimation:{true:{wrapper:"transition-none",icon:"transition-none",label:"transition-none"},false:{wrapper:["before:transition-colors","group-data-[pressed=true]:scale-95","transition-transform","after:transition-transform-opacity","after:!ease-linear","after:!duration-200","motion-reduce:transition-none"],icon:"transition-opacity motion-reduce:transition-none",label:"transition-colors-opacity before:transition-width motion-reduce:transition-none"}}},defaultVariants:{color:"primary",size:"md",isDisabled:!1,lineThrough:!1,disableAnimation:!1}});te({slots:{base:"relative flex flex-col gap-2",label:"relative text-medium text-foreground-500",wrapper:"flex flex-col flex-wrap gap-2 data-[orientation=horizontal]:flex-row",description:"text-small text-foreground-400",errorMessage:"text-small text-danger"},variants:{isRequired:{true:{label:"after:content-['*'] after:text-danger after:ml-0.5"}},isInvalid:{true:{description:"text-danger"}},disableAnimation:{true:{},false:{description:"transition-colors !duration-150 motion-reduce:transition-none"}}},defaultVariants:{isInvalid:!1,isRequired:!1,disableAnimation:!1}});function Ne(e,a,t){let{isDisabled:i=!1,isReadOnly:o=!1,value:l,name:d,children:r,"aria-label":c,"aria-labelledby":u,validationState:f="valid",isInvalid:h}=e,b=w=>{w.stopPropagation(),a.setSelected(w.target.checked)},R=r!=null,p=c!=null||u!=null;!R&&!p&&console.warn("If you do not provide children, you must specify an aria-label for accessibility");let{pressProps:v,isPressed:g}=re({isDisabled:i}),{pressProps:j,isPressed:V}=re({isDisabled:i||o,onPress(){a.toggle()}}),{focusableProps:_}=ye(e,t),B=O(v,_),q=$e(e,{labelable:!0});return Pe(t,a.isSelected,a.setSelected),{labelProps:O(j,{onClick:w=>w.preventDefault()}),inputProps:O(q,{"aria-invalid":h||f==="invalid"||void 0,"aria-errormessage":e["aria-errormessage"],"aria-controls":e["aria-controls"],"aria-readonly":o||void 0,onChange:b,disabled:i,...l==null?{}:{value:l},name:d,type:"checkbox",...B}),isSelected:a.isSelected,isPressed:g||V,isDisabled:i,isReadOnly:o,isInvalid:h||f==="invalid"}}function se(e={}){let{isReadOnly:a}=e,[t,i]=Re(e.isSelected,e.defaultSelected||!1,e.onChange);function o(d){a||i(d)}function l(){a||i(!t)}return{isSelected:t,setSelected:o,toggle:l}}function ne(e,a,t){let i=oe({...e,value:a.isSelected}),{isInvalid:o,validationErrors:l,validationDetails:d}=i.displayValidation,{labelProps:r,inputProps:c,isSelected:u,isPressed:f,isDisabled:h,isReadOnly:b}=Ne({...e,isInvalid:o},a,t);qe(e,i,t);let{isIndeterminate:R,isRequired:p,validationBehavior:v="aria"}=e;return n.useEffect(()=>{t.current&&(t.current.indeterminate=!!R)}),{labelProps:r,inputProps:{...c,checked:u,"aria-required":p&&v==="aria"||void 0,required:p&&v==="native"},isSelected:u,isPressed:f,isDisabled:h,isReadOnly:b,isInvalid:o,validationErrors:l,validationDetails:d}}const Ge=new WeakMap;function Te(e,a,t){const i=se({isReadOnly:e.isReadOnly||a.isReadOnly,isSelected:a.isSelected(e.value),onChange(g){g?a.addValue(e.value):a.removeValue(e.value),e.onChange&&e.onChange(g)}});let{name:o,descriptionId:l,errorMessageId:d,validationBehavior:r}=Ge.get(a);var c;r=(c=e.validationBehavior)!==null&&c!==void 0?c:r;let{realtimeValidation:u}=oe({...e,value:i.isSelected,name:void 0,validationBehavior:"aria"}),f=n.useRef(Ae),h=()=>{a.setInvalid(e.value,u.isInvalid?u:f.current)};n.useEffect(h);let b=a.realtimeValidation.isInvalid?a.realtimeValidation:u,R=r==="native"?a.displayValidation:b;var p;let v=ne({...e,isReadOnly:e.isReadOnly||a.isReadOnly,isDisabled:e.isDisabled||a.isDisabled,name:e.name||o,isRequired:(p=e.isRequired)!==null&&p!==void 0?p:a.isRequired,validationBehavior:r,[Ee]:{realtimeValidation:b,displayValidation:R,resetValidation:a.resetValidation,commitValidation:a.commitValidation,updateValidation(g){f.current=g,h()}}},i,t);return{...v,inputProps:{...v.inputProps,"aria-describedby":[e["aria-describedby"],a.isInvalid?d:null,l].filter(Boolean).join(" ")||void 0}}}var[Xe,ze]=De({name:"CheckboxGroupContext",strict:!1});function Fe(e){const{isSelected:a,disableAnimation:t,...i}=e;return m.jsx("svg",{"aria-hidden":"true",role:"presentation",viewBox:"0 0 17 18",...i,children:m.jsx("polyline",{fill:"none",points:"1 9 7 14 15 4",stroke:"currentColor",strokeDasharray:22,strokeDashoffset:a?44:66,strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,style:!t&&a?{transition:"stroke-dashoffset 250ms linear 0.2s"}:{}})})}function Me(e){const{isSelected:a,disableAnimation:t,...i}=e;return m.jsx("svg",{stroke:"currentColor",strokeWidth:3,viewBox:"0 0 24 24",...i,children:m.jsx("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function We(e){const{isIndeterminate:a,...t}=e,i=a?Me:Fe;return m.jsx(i,{...t})}function Ue(e={}){var a,t,i,o,l,d;const r=ze(),c=!!r,{as:u,ref:f,value:h="",children:b,icon:R,name:p,isRequired:v=!1,isReadOnly:g=!1,autoFocus:j=!1,isSelected:V,validationState:_,size:B=(a=r==null?void 0:r.size)!=null?a:"md",color:q=(t=r==null?void 0:r.color)!=null?t:"primary",radius:w=r==null?void 0:r.radius,lineThrough:W=(i=r==null?void 0:r.lineThrough)!=null?i:!1,isDisabled:U=(o=r==null?void 0:r.isDisabled)!=null?o:!1,disableAnimation:A=(l=r==null?void 0:r.disableAnimation)!=null?l:!1,isInvalid:x=_?_==="invalid":(d=r==null?void 0:r.isInvalid)!=null?d:!1,isIndeterminate:C=!1,defaultSelected:L,classNames:s,onChange:K,className:de,onValueChange:H,...S}=e;r&&Ve&&(V&&ie("The Checkbox.Group is being used, `isSelected` will be ignored. Use the `value` of the Checkbox.Group instead.","Checkbox"),L&&ie("The Checkbox.Group is being used, `defaultSelected` will be ignored. Use the `defaultValue` of the Checkbox.Group instead.","Checkbox"));const ce=u||"label",E=n.useRef(null),ue=Oe(f,E),N=n.useId(),G=n.useMemo(()=>({name:p,value:h,children:b,autoFocus:j,defaultSelected:L,isIndeterminate:C,isRequired:v,isInvalid:x,isSelected:V,isDisabled:U,isReadOnly:g,"aria-label":je(S["aria-label"],b),"aria-labelledby":S["aria-labelledby"]||N,onChange:H}),[h,p,N,b,j,x,C,U,g,V,L,S["aria-label"],S["aria-labelledby"],H]),{inputProps:$,isSelected:D,isDisabled:I,isReadOnly:fe,isPressed:be}=c?Te({...G,isInvalid:x},r.groupState,E):ne(G,se(G),E),J=I||fe,[pe,X]=n.useState(!1),{pressProps:Y}=_e({isDisabled:J,onPressStart(k){k.pointerType!=="keyboard"&&X(!0)},onPressEnd(k){k.pointerType!=="keyboard"&&X(!1)}}),Q=J?!1:pe||be;v&&($.required=!0);const{hoverProps:Z,isHovered:T}=we({isDisabled:$.disabled}),{focusProps:ee,isFocused:z,isFocusVisible:F}=Ce({autoFocus:$.autoFocus}),P=n.useMemo(()=>Le({color:q,size:B,radius:w,isInvalid:x,lineThrough:W,isDisabled:I,disableAnimation:A}),[q,B,w,x,W,I,A]),ae=M(s==null?void 0:s.base,de),me=n.useCallback(()=>({ref:ue,className:P.base({class:ae}),"data-disabled":y(I),"data-selected":y(D||C),"data-invalid":y(x),"data-hover":y(T),"data-focus":y(z),"data-pressed":y(Q),"data-readonly":y($.readOnly),"data-focus-visible":y(F),"data-indeterminate":y(C),...O(Z,Y,S)}),[P,ae,I,D,C,x,T,z,Q,$.readOnly,F,Z,Y,S]),he=n.useCallback((k={})=>({...k,"aria-hidden":!0,className:M(P.wrapper({class:M(s==null?void 0:s.wrapper,k==null?void 0:k.className)}))}),[P,s==null?void 0:s.wrapper]),ve=n.useCallback(()=>({ref:E,...O($,ee),onChange:Ie($.onChange,K)}),[$,ee,K]),ge=n.useCallback(()=>({id:N,className:P.label({class:s==null?void 0:s.label})}),[P,s==null?void 0:s.label,I,D,x]),xe=n.useCallback(()=>({isSelected:D,isIndeterminate:!!C,disableAnimation:!!A,className:P.icon({class:s==null?void 0:s.icon})}),[P,s==null?void 0:s.icon,D,C,A]);return{Component:ce,icon:R,children:b,isSelected:D,isDisabled:I,isInvalid:x,isFocused:z,isHovered:T,isFocusVisible:F,getBaseProps:me,getWrapperProps:he,getInputProps:ve,getLabelProps:ge,getIconProps:xe}}var le=Be((e,a)=>{const{Component:t,children:i,icon:o=m.jsx(We,{}),getBaseProps:l,getWrapperProps:d,getInputProps:r,getIconProps:c,getLabelProps:u}=Ue({...e,ref:a}),f=typeof o=="function"?o(c()):n.cloneElement(o,c());return m.jsxs(t,{...l(),children:[m.jsx(ke,{children:m.jsx("input",{...r()})}),m.jsx("span",{...d(),children:f}),i&&m.jsx("span",{...u(),children:i})]})});le.displayName="NextUI.Checkbox";var Ye=le;export{Ye as c};
