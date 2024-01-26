import JSZip from "jszip";
import { saveAs } from "save-as";

const base64toBlob = (data) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
};

export const DescargarDocumento = (seleccion,documentos) => {
    const zip = new JSZip();
    let datos=[]
    if (seleccion=="all"){
      datos = documentos;
    }else{
        const arraySeleccion = Array.from(seleccion)
        datos = arraySeleccion.map( doc_id => {
            const match = documentos.find( item => item.id == Number(doc_id));
            return {mime_file:match.mime_file,file:match.file,name_file:match.name_file,numero:match.numero,
            fecha:match.fecha,tipo:match.tipo}
        })
    }

    let arraySinArchivos=[]
    for (let i = 0; i < datos.length; i++) {
        // Zip file with the file name.
        if (datos[i].file){
            const blob = base64toBlob(datos[i].file);
            const url = URL.createObjectURL(blob);
            zip.file(datos[i].name_file, blob);
        }else{
            //console.log("No tenia archivo el documento n° ",datos[i].numero)
            arraySinArchivos.push(datos[i])
        }
    }
    if (arraySinArchivos.length !== datos.length){
        zip.generateAsync({type: "blob",mimeType:"application/zip"}).then(content => {
            saveAs(content, "documentos.zip");
        });
    }
    return arraySinArchivos
}