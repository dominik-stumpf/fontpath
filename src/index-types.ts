export interface SvgAttributesProps {
  viewBox: [number, number, number, number];
  width: number;
  height: number;
}

export type PathAttribute = {
  attributeD: string;
  advancement: number;
  pathTotalLength: number;
};
