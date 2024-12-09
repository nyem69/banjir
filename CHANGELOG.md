# Changelog

All notable changes to the Malaysia Flood Evacuation Centers Dashboard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Planned
- Geographic visualization with MapboxGL
- Advanced filtering capabilities
- Multi-language support
- Offline mode support
- Historical data analysis
- Mobile app wrapper

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

[Unreleased]: https://github.com/nyem69/banjir/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/nyem69/banjir/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nyem69/banjir/releases/tag/v0.1.0
