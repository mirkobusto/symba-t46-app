/** <PREFIX>_<case>_<date>.<ext>: the files of two cases, or of two weeks, all
 * used to be called dcf_<8 hex> (UX round 5, P7-07), and the case report and
 * the case file symba-case-report.docx and symba-case.json (round 6, P6-19). */
export function exportFilename(
  prefix: string, caseName: string | null | undefined, ext: string, today = new Date(),
): string {
  const slug = (caseName ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'draft'
  return `${prefix}_${slug}_${today.toISOString().slice(0, 10)}.${ext}`
}

export function dcfFilename(caseName: string | null | undefined, ext: string, today = new Date()): string {
  return exportFilename('DCF', caseName, ext, today)
}
