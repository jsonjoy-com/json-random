export const int = (min: number, max: number): number => {
  let int = Math.round(Math.random() * (max - min) + min);
  int = Math.max(min, Math.min(max, int));
  return int;
};
