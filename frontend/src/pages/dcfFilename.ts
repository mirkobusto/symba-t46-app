/** DCF_<case>_<date>.<ext>: the files of two cases, or of two weeks, all
 * used to be called dcf_<8 hex> (UX round 5, P7-07). */
export function dcfFilename(caseName: string | null | undefined, ext: string, today = new Date()): string {
  const slug = (caseName ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'draft'
  return `DCF_${slug}_${today.toISOString().slice(0, 10)}.${ext}`
}
