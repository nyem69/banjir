# Malaysia Flood Evacuation Centers Dashboard

A real-time dashboard showing flood evacuation centers across Malaysia.

## Tech Stack

- SvelteKit
- Paraglide (i18n)
- D3.js (Data Visualization)
- Tailwind CSS

## Development

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
banjir/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable components
│   │   ├── paraglide/     # i18n configuration
│   │   └── utils.ts       # Utility functions
│   ├── routes/            # SvelteKit routes
│   └── app.css           # Global styles
├── messages/             # Translation files
│   ├── en.json
│   ├── ms.json
│   ├── zh.json
│   └── ta.json
└── docs/                # Documentation
```

## Features

### Internationalization (i18n)

The dashboard supports multiple languages:
- English (en)
- Malay (ms)
- Chinese (zh)
- Tamil (ta)

See [i18n Documentation](./i18n.md) for details.

### Data Visualization

Uses D3.js for:
- Time series charts
- Bar charts
- State/district statistics

See [Data Visualization Documentation](./data-visualization.md) for details.

## Contributing

1. Follow the [Development Rules](../RULES.md)
2. Create feature branch
3. Submit pull request

## License

MIT
