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
export const Transform = (file,mime_file,name_file) => {
    const blob = base64toBlob(file);
    const url = URL.createObjectURL(blob);
    const link=`data:${mime_file};base64,${file}`
    const filename = name_file+".pdf"
    return {url,link,filename}
}
