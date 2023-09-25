import path from 'path';
import fs from 'fs';
import * as fontkit from 'fontkit';
import { svgPathProperties } from 'svg-path-properties';
import { PathAttribute, SvgAttributesProps } from './index-types';

const fontPath = path.resolve('./assets/fraunces-italic.ttf');
const outSvgPath = path.resolve('./generated/svg/g.svg');
const outJsonPath = path.resolve('./generated/json/g.json');
const outTsPath = path.resolve('./generated/ts/g.ts');
const outPaths = [outSvgPath, outTsPath, outJsonPath];

for (const outPath of outPaths) {
  if (!fs.existsSync(outPath)) {
    const dirname = path.dirname(outPath);
    console.info(`"${dirname}" doesn't exist, attempting to create it...`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }
}

// rome-ignore lint/suspicious/noExplicitAny: <no type definition for lib>
let font = fontkit.openSync(fontPath) as any;
font = font.getVariation({ wght: 400, opsz: 144, wonk: 1, soft: 0 });

function getSvgLetter({ text }: { text: string }) {
  const glyphSeries = font.layout(text);

  const pathAttributeD = glyphSeries.glyphs[0].path;
  const svg_path = pathAttributeD.toSVG();
  const boundingBox = pathAttributeD.bbox;

  const svgAttributes: SvgAttributesProps = {
    viewBox: [
      boundingBox.minX,
      boundingBox.minY,
      boundingBox.width,
      boundingBox.height,
    ],
    width: boundingBox.width,
    height: boundingBox.height,
  };

  const svg = `<svg transform="scale(1,-1)" width="${svgAttributes.width}"
    height="${svgAttributes.height}"
    viewBox="${svgAttributes.viewBox.join(' ')}"
    xmlns="http://www.w3.org/2000/svg">
    <path d="${svg_path}" fill="salmon"/>
  </svg>`;

  return svg;
}

function processToAttributeDSeries({ text }: { text: string }) {
  const glyphSeries = font.layout(text);
  let advancement = 0;

  const pathAttributes: PathAttribute[] = [];

  const boundingBox = glyphSeries.bbox;

  // rome-ignore lint/suspicious/noExplicitAny: <no type definition>
  glyphSeries.glyphs.forEach((glyph: any, i: number) => {
    const attributeD = glyph.path.toSVG();
    const pathAttribute = {
      attributeD,
      advancement: advancement,
      pathTotalLength: new svgPathProperties(attributeD).getTotalLength(),
    };
    if (pathAttribute.attributeD) {
      pathAttributes.push(pathAttribute);
    }
    advancement += glyph.advanceWidth;
  });

  const svgAttributes: SvgAttributesProps = {
    viewBox: [
      boundingBox.minX,
      boundingBox.minY,
      boundingBox.width,
      boundingBox.height,
    ],
    width: boundingBox.width,
    height: boundingBox.height,
  };

  const paths = pathAttributes
    .map(
      (pathAttribute) =>
        `<path d="${pathAttribute.attributeD}" transform="translate(${pathAttribute.advancement} 0)" fill="cornflowerblue"/>`,
    )
    .join('');

  const jsonTemplate = {
    encodedText: text,
    svgAttributes: svgAttributes,
    pathAttributes: pathAttributes,
  };

  const json = JSON.stringify(jsonTemplate);

  fs.writeFileSync(outJsonPath, json);
  fs.writeFileSync(outTsPath, `export const svgData = ${json}`);

  const svg = `<svg transform="scale(1,-1)" width="${svgAttributes.width}"
    height="${svgAttributes.height}"
    viewBox="${svgAttributes.viewBox.join(' ')}"
    xmlns="http://www.w3.org/2000/svg">
    <g>
    ${paths}
    </g>
  </svg>`;

  return svg;
}

function main() {
  const svg = processToAttributeDSeries({
    text: 'Lorem ipsum dolor...',
  });
  fs.writeFileSync(outSvgPath, svg);
  console.log('all files written');
}

main();
