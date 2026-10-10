const L = require('./docx_lib.js');
const { p, h2, h3, bullets, steps, table, code, warn, run, Paragraph, TextRun } = L;
const FILE = 'Banking_Power_Query_Training_Dirty_Dataset.xlsx';
const b = (t) => new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: t, font: 'Arial', size: 22, bold: true, color: '2F5496' })] });

// o: {id,title,objectives[],scenario,source:{sheet,table,cols,dirty,expected},steps[],before:{h,rows,w},mcode[],explain:[[a,b]],expected,validation[],errors:[[m,c,f]],interp,practice,solution,warn:[title,text]}
function lesson(o) {
  const out = [];
  out.push(h2(`Lesson ${o.id}: ${o.title}`));
  out.push(b('A. Learning objectives')); out.push(...bullets(o.objectives));
  out.push(b('B. Business scenario')); out.push(p(o.scenario));
  out.push(b('C. Source data'));
  out.push(table(['Item', 'Detail'], [
    ['Workbook', FILE], ['Worksheet', o.source.sheet], ['Excel table', o.source.table], ['Columns used', o.source.cols],
    ['Example dirty values', o.source.dirty], ['Expected output', o.source.expected]], [2200, 7160]));
  if (o.warn) { out.push(p('')); out.push(warn(o.warn[0], o.warn[1])); }
  out.push(b('D. Step-by-step Excel Power Query procedure')); out.push(...steps(o.steps));
  out.push(b('E. Before-and-after demonstration')); out.push(table(o.before.h, o.before.rows, o.before.w));
  out.push(b('F. M code')); out.push(...code(o.mcode));
  out.push(p(''));
  out.push(b('G. Line-by-line code explanation'));
  out.push(table(['Code element', 'What it does'], o.explain, [3000, 6360]));
  out.push(b('H. Expected result')); out.push(p(o.expected));
  out.push(b('I. Validation')); out.push(...bullets(o.validation));
  out.push(b('J. Common errors')); out.push(table(['Mistake', 'Cause', 'Correction'], o.errors, [2600, 3000, 3760]));
  out.push(b('K. Accounting interpretation')); out.push(p(o.interp));
  out.push(b('L. Independent practice')); out.push(p(o.practice));
  out.push(b('M. Instructor solution')); out.push(p(o.solution));
  out.push(p(''));
  return out;
}
const review = (title, qs) => [h3(title), ...L.steps(qs)];
module.exports = { lesson, review, b, FILE };
