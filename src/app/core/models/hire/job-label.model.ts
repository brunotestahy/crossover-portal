export interface JobLabel {
  id: number;
  name: string;
  parent?: JobLabel;
}
