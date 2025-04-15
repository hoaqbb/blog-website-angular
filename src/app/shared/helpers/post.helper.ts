export function replaceNbspWithSpace(postContent: string) {
  // Replace all occurrences of "&nbsp;" with a space
  return postContent.replace(/&nbsp;/g, ' ');
}

// Convert the base64 encoded string to image file
export function base64ToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

// Create blob URLs for all image files
export function getFileBlobUrls(imageFiles: File[]) {
  let fileBlobUrls: { [key: string]: string } = {};
  imageFiles.forEach((file) => {
    fileBlobUrls[file.name] = URL.createObjectURL(file);
  });
  return fileBlobUrls;
}