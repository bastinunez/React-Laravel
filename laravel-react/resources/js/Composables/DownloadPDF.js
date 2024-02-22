import JSZip from "jszip";
import { saveAs } from "save-as";
import mime from 'mime';

const base64toBlob = (data,extension) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr(`data:${extension};base64,`.length);
    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: extension });
    // const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
    // console.log("tipo:",mime.getExtension(all_documents[0].mime_file)); 
    // const bytes = atob(base64WithoutPrefix);
    // let length = bytes.length;
    // let out = new Uint8Array(length);

    // while (length--) {
    //     out[length] = bytes.charCodeAt(length);
    // }

    // return new Blob([out], { type: 'application/pdf' });
};

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
    
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
        
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
    }

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
            fecha:match.fecha,tipo:match.tipo,anexos:match.anexos,otros_anexos:match.otros_anexos}
        })
    }
    //console.log(datos)
    let arraySinArchivos=[]
    for (let i = 0; i < datos.length; i++) {
        // Zip file with the file name.
        if (datos[i].file){
            const ext =mime.getExtension(datos[i].mime_file);
            if (datos[i].anexos.length>0 || datos[i].otros_anexos.length>0){
                const blob = base64toBlob(datos[i].file,datos[i].mime_file);
                zip.file(`${datos[i].name_file}/${datos[i].name_file}.${ext}`,blob)

                for (let j = 0;j<datos[i].anexos.length;j++){
                    const doc_anexo = datos[i].anexos[j].datos_anexo
                    const blob_anexo = base64toBlob(doc_anexo.file,doc_anexo.mime_file);
                    const ext_mini =mime.getExtension(doc_anexo.mime_file);
                    zip.file(`${datos[i].name_file}/Anexos/${datos[i].anexos[j].datos_anexo.name_file}.${ext_mini}`,blob_anexo)
                }

                for (let j = 0;j<datos[i].otros_anexos.length;j++){
                    const doc_anexo = datos[i].otros_anexos[j].datos_anexo
                    const blob_anexo = b64toBlob(doc_anexo.file,doc_anexo.mime_file);
                    //const blob_anexo = base64toBlob(doc_anexo.file,doc_anexo.mime_file);
                    const ext_mini =mime.getExtension(doc_anexo.mime_file);
                    zip.file(`${datos[i].name_file}/Anexos/Anexo-${j+1}.${ext_mini}`,blob_anexo)
                }
            }else{
                const blob = base64toBlob(datos[i].file,datos[i].mime_file);
                const url = URL.createObjectURL(blob);
                zip.file(`${datos[i].name_file}/${datos[i].name_file}.${ext}`, blob);
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