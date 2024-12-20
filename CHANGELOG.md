# Changelog

All notable changes to the Malaysia Flood Evacuation Centers Dashboard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Planned
- Geographic visualization with MapboxGL
- Advanced filtering capabilities
- Offline mode support
- Historical data analysis
- Mobile app wrapper

### Added
- Created new dashboard components (search.svelte, user-nav.svelte, main-nav.svelte)
- Added multi-language support for search functionality (en, ms, zh, ta)
- Implemented new layout structure with responsive header
- Added language switcher buttons in the header
- Implemented comprehensive sidebar navigation with menu items
- Added dropdown menu for user actions in sidebar footer
- Integrated `shadcn-svelte` UI components
- Integrated `lucide-svelte` icons library
- Enhanced SEO component with full multi-language support (en, ms, zh, ta)

### Changed
- Reordered plugins in `vite.config.ts` to ensure correct initialization
- Enhanced `app-sidebar.svelte` with more structured and interactive components
- Improved accessibility in button components by adding missing attributes
- Updated SEO metadata to support all four languages with proper localization
- Improved SEO schema to include all supported languages

### Fixed
- Resolved a11y linting warnings in button components
- Updated deprecated accessibility rule names

## [0.5.1] - 2024-12-12
### Changed
- Removed Lucia authentication
- Removed Drizzle ORM
- Simplified app architecture for Cloudflare deployment
- Updated technical documentation

### Fixed
- Resolved Node.js compatibility issues for Cloudflare deployment
- Cleaned up unused dependencies
- Removed auth-related type declarations

## [0.5.0] - 2024-12-11
### Added
- Comprehensive project documentation
  - API documentation with endpoints and data structures
  - Data visualization guide with D3.js examples
  - Testing guide with unit, integration, and E2E testing setup
  - Updated i18n documentation with best practices
  - Development rules and guidelines
- Enhanced error handling and validation
- Expanded test coverage infrastructure

### Changed
- Updated project roadmap with new phases
- Enhanced documentation structure
- Improved code organization

### Documentation
- Added detailed API endpoints documentation
- Added WebSocket integration guide
- Added data visualization best practices
- Added testing infrastructure setup guide
- Added deployment and maintenance planning

## [0.4.0] - 2024-12-09
### Added
- Migrated to SvelteKit framework
- Added Tailwind CSS for styling
- Integrated Drizzle ORM for database management
- Added Paraglide for internationalization
- Integrated Lucia for authentication
- Set up MySQL database connection
- Added Svelte-ux for UI components
- Integrated Layerchart for data visualization

### Changed
- Restructured project to follow SvelteKit conventions
- Updated build and deployment configuration
- Moved static files to static directory

## [0.3.0] - 2024-12-09
### Added
- Interactive map visualization (map.html)
  - District boundaries for Peninsular and Borneo Malaysia
  - Evacuation center locations with interactive popups
  - Center statistics overlay
  - Visual legend
- MapboxGL integration for geographical visualization

### Changed
- Updated Mapbox access token
- Enhanced data visualization capabilities

## [0.2.0] - 2024-12-09
### Added
- Detailed project documentation
  - Comprehensive README.md
  - Project concept document (CONCEPT.md)
  - Detailed implementation plan (PLAN.md)
  - This CHANGELOG.md file

### Fixed
- CORS issues with API requests using corsproxy.io
- Data validation and error handling for API responses
- Improved type checking for data processing

### Changed
- Enhanced error handling in data processing
- Better validation of API responses
- More robust data type checking

## [0.1.0] - 2024-12-09
### Added
- Initial dashboard implementation
- Real-time data integration with JKM API
- Basic visualizations:
  - Summary statistics cards
  - District-wise bar chart
  - Detailed data table
- Responsive design
- Basic error handling
- GitHub Pages deployment setup

### Features
- Real-time data fetching from JKM API
- Interactive bar chart showing evacuees by district
- Summary statistics:
  - Total evacuation centers
  - Total evacuees
  - Active districts
- Detailed table view with:
  - District information
  - Center names
  - Number of families
  - Total evacuees
  - Center status

### Technical
- D3.js integration for data visualization
- Vanilla JavaScript implementation
- Responsive CSS design
- GitHub Pages hosting
- Basic API integration

[Unreleased]: https://github.com/nyem69/banjir/compare/v0.5.1...HEAD
[0.5.1]: https://github.com/nyem69/banjir/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/nyem69/banjir/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/nyem69/banjir/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/nyem69/banjir/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nyem69/banjir/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nyem69/banjir/releases/tag/v0.1.0
