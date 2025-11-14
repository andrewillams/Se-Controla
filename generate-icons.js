const fs = require('fs');

// Criar ícone PNG simples (azul com círculo branco e símbolo $)
// Usando Canvas se disponível, ou gerando um PNG básico

const createPngIcon = (size) => {
  // Dados para um PNG simples azul
  const canvas = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.25}" fill="#3b82f6"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.35}" fill="white"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.28}" fill="none" stroke="#3b82f6" stroke-width="${size * 0.04}"/>
  <text x="${size * 0.5}" y="${size * 0.65}" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="#3b82f6" text-anchor="middle">$</text>
</svg>`;
  return canvas;
};

// Gerar SVGs temporários que serão convertidos
fs.writeFileSync('public/icon-192.svg', createPngIcon(192));
fs.writeFileSync('public/icon-512.svg', createPngIcon(512));

console.log('✓ SVG icons generated');
console.log('Converting to PNG...');

// Tentar usar sharp se disponível
try {
  const sharp = require('sharp');

  Promise.all([
    sharp('public/icon-192.svg')
      .resize(192, 192)
      .png()
      .toFile('public/icon-192.png'),
    sharp('public/icon-512.svg')
      .resize(512, 512)
      .png()
      .toFile('public/icon-512.png')
  ]).then(() => {
    console.log('✓ PNG icons generated successfully!');
    // Limpar SVGs temporários
    fs.unlinkSync('public/icon-192.svg');
    fs.unlinkSync('public/icon-512.svg');
    console.log('✓ Cleanup complete');
  }).catch(err => {
    console.error('Error converting to PNG:', err.message);
    console.log('\n⚠️  Keeping SVG files. Convert manually using:');
    console.log('   - Online: https://cloudconvert.com/svg-to-png');
    console.log('   - Or ImageMagick: convert public/icon-192.svg public/icon-192.png');
  });
} catch (err) {
  console.log('\n⚠️  Sharp not available yet. Run: npm install');
  console.log('   Then run: node generate-icons.js');
}
