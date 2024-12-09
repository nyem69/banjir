# Malaysia Flood Evacuation Centers Dashboard

A real-time dashboard showing information about flood evacuation centers in Malaysia. The dashboard fetches data from the official JKM (Jabatan Kebajikan Masyarakat) API and visualizes it using D3.js and Mapbox GL JS.

## 🌐 Live Demo

Visit the live dashboard at: [https://nyem69.github.io/banjir/](https://nyem69.github.io/banjir/)

## 📊 Features

- Real-time data from JKM API
- Interactive visualizations:
  - Summary statistics cards
  - District-wise bar chart using D3.js
  - Interactive map using Mapbox GL JS
  - Detailed data table
- Responsive design for mobile and desktop
- Multi-language support (English, Malay, Tamil, Chinese)
- Authentication system

## 🛠️ Technology Stack

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [D3.js](https://d3js.org/) - Data visualization library
- [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js) - Interactive mapping
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) - Internationalization
- [Lucia](https://lucia-auth.com/) - Authentication
- [MySQL](https://www.mysql.com/) - Database
- [Svelte-ux](https://www.svelte-ux.com/) - UI component library
- [Layerchart](https://layerchart.com/) - Charting library for Svelte

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm
- MySQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nyem69/banjir.git
   cd banjir
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your database credentials and Mapbox access token.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📱 Building for Production

1. Build the application:
   ```bash
   pnpm build
   ```

2. Preview the production build:
   ```bash
   pnpm preview
   ```

## 📝 API Information

The dashboard uses the following JKM API endpoints:

- Centers List: `https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php`
- Active Centers: `https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php`
- District Boundaries:
  - Peninsula: `https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson`
  - Borneo: `https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson`

## 🌍 Internationalization

The dashboard supports multiple languages:
- English (en)
- Malay (ms)
- Tamil (ta)
- Chinese (zh)

Language files are located in the `messages/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Data provided by [Jabatan Kebajikan Masyarakat Malaysia](https://www.jkm.gov.my/)
- Built with [SvelteKit](https://kit.svelte.dev/)
