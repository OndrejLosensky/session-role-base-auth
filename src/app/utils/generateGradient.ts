function generateHexColor(): string {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

export function generateGradient(): string {
  const color1 = generateHexColor();
  const color2 = generateHexColor();
  return `linear-gradient(135deg, ${color1}, ${color2})`;
} 