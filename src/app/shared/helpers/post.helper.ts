export function replaceNbspWithSpace(postContent: string) {
  // Replace all occurrences of "&nbsp;" with a space
  return postContent.replace(/&nbsp;/g, ' ');
}
