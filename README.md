# Banjir - Flood Monitoring and Analysis Platform

## Overview
Banjir is a comprehensive flood monitoring and analysis platform designed to provide real-time insights and historical data analysis for flood-related events.

## Tech Stack
- **Framework**: SvelteKit
- **UI Components**: 
  - shadcn-svelte
  - Tailwind CSS
- **Icons**: Lucide Svelte
- **Internationalization**: Paraglide
- **Accessibility**: Enhanced a11y compliance

## Features
- Real-time flood monitoring
- Historical data analysis
- Interactive dashboard
- Responsive design
- Multilingual support

## Prerequisites
- Node.js (v18+)
- pnpm or npm

## Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/nyem69/banjir.git

# Navigate to the project directory
cd banjir

# Install dependencies
pnpm install
# or
npm install
```

### Development
```bash
# Run development server
pnpm dev
# or
npm run dev
```

### Build
```bash
# Build for production
pnpm build
# or
npm run build
```



## Project Structure
- `src/`: Source code
  - `lib/`: Reusable components and utilities
  - `routes/`: Application routes
- `project.inlang/`: Internationalization configuration
- `tailwind.config.ts`: Tailwind CSS configuration

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Data provided by [Jabatan Kebajikan Masyarakat Malaysia](https://www.jkm.gov.my/)

## 📝 API Information

The dashboard uses the following JKM API endpoints:

- Centers List: `https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php`
- Active Centers: `https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php`
- District Boundaries:
  - Peninsula: `https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson`
  - Borneo: `https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson`


## License
Distributed under the MIT License. See `LICENSE` for more information.
