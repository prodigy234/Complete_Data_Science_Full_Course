const d = require('docx');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType,
  ShadingType, BorderStyle, Header, Footer, PageNumber, LevelFormat, PageBreak, TableOfContents } = d;
const FONT = 'Arial';
const AUTHOR = 'Kajola Gbenga';
const TITLE = 'Data Scientist & AI Engineer';
const W = 9360; // content width, US Letter, 1" margins

const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 22, ...o });
const p = (t, o = {}) => new Paragraph({ spacing: { after: 120 }, children: Array.isArray(t) ? t : [run(t)], ...o });
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, font: FONT })] });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: FONT })] });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t, font: FONT })] });
const bullets = items => items.map(t => new Paragraph({ numbering: { reference: 'bul', level: 0 }, spacing: { after: 60 }, children: Array.isArray(t) ? t : [run(t)] }));
let _inst = 0;
const steps = items => { _inst++; return items.map(t => new Paragraph({ numbering: { reference: 'num', level: 0, instance: _inst }, spacing: { after: 60 }, children: [run(t)] })); };
const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const borders = { top: border, bottom: border, left: border, right: border };
function table(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const cell = (t, w, head) => new TableCell({
    width: { size: w, type: WidthType.DXA }, borders,
    shading: head ? { fill: '1F3864', type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: String(t), font: FONT, size: 18, bold: head, color: head ? 'FFFFFF' : '000000' })] })]
  });
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, widths[i], true)) }),
      ...rows.map(r => new TableRow({ children: r.map((c, i) => cell(c, widths[i], false)) }))]
  });
}
function code(lines) {
  return lines.map(l => new Paragraph({ spacing: { after: 0 }, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR, color: 'auto' },
    children: [new TextRun({ text: l === '' ? ' ' : l, font: 'Courier New', size: 18 })] }));
}
function warn(title, text) {
  const b = { style: BorderStyle.SINGLE, size: 8, color: 'C00000' };
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], rows: [new TableRow({ children: [new TableCell({
    width: { size: W, type: WidthType.DXA }, borders: { top: b, bottom: b, left: b, right: b },
    shading: { fill: 'FDECEA', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [new Paragraph({ children: [new TextRun({ text: title, font: FONT, bold: true, size: 20, color: 'C00000' })] }),
      new Paragraph({ children: [new TextRun({ text: text, font: FONT, size: 20 })] })] })] })] });
}
function titlePage(title, subtitle, audience) {
  return [
    new Paragraph({ spacing: { before: 2400, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: title, font: FONT, size: 52, bold: true, color: '1F3864' })] }),
    new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: subtitle, font: FONT, size: 28, color: '404040' })] }),
    ...(audience ? [new Paragraph({ spacing: { after: 1200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: audience, font: FONT, size: 22, italics: true })] })] : []),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: AUTHOR, font: FONT, size: 28, bold: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: TITLE, font: FONT, size: 24 })] }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}
async function build(path, children, headerText) {
  const doc = new Document({
    creator: AUTHOR, title: headerText, features: { updateFields: true },
    styles: {
      default: { document: { run: { font: FONT, size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 34, bold: true, font: FONT, color: '1F3864' }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT, color: '2F5496' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT, color: '2F5496' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
      ]
    },
    numbering: { config: [
      { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1F3864', space: 1 } }, children: [new TextRun({ text: headerText, font: FONT, size: 18, color: '595959' })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: AUTHOR + ' | ' + TITLE + ' | Page ', font: FONT, size: 18, color: '595959' }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: '595959' })] })] }) },
      children
    }]
  });
  fs.writeFileSync(path, await Packer.toBuffer(doc));
}
module.exports = { d, run, p, h1, h2, h3, bullets, steps, table, code, warn, titlePage, build, W, TableOfContents, PageBreak, Paragraph, TextRun };
