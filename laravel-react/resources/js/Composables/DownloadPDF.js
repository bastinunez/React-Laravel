import JSZip from "jszip";
import { saveAs } from "save-as";

const base64toBlob = (data,extension) => {
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
            fecha:match.fecha,tipo:match.tipo,anexos:match.anexos}
        })
    }
    //console.log(datos)
    let arraySinArchivos=[]
    for (let i = 0; i < datos.length; i++) {
        // Zip file with the file name.
        if (datos[i].file){
            if (datos[i].anexos.length>0){
                const blob = base64toBlob(datos[i].file,datos[i].mime_file);
                zip.file(`${datos[i].name_file}/${datos[i].name_file}`,blob)

                for (let j = 0;j<datos[i].anexos.length;j++){
                    const doc_anexo = datos[i].anexos[j].datos_anexo
                    const blob_anexo = base64toBlob(doc_anexo.file,doc_anexo.mime_file);
                    zip.file(`${datos[i].name_file}/Anexos/${datos[i].anexos[j].datos_anexo.name_file}`,blob_anexo)
                }
            }else{
                const blob = base64toBlob(datos[i].file,datos[i].mime_file);
                const url = URL.createObjectURL(blob);
                zip.file(`${datos[i].name_file}/${datos[i].name_file}`, blob);
            }
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