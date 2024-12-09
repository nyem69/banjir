# Malaysia Flood Evacuation Centers Dashboard

A real-time dashboard showing information about flood evacuation centers in Malaysia. The dashboard fetches data from the official JKM (Jabatan Kebajikan Masyarakat) API and visualizes it using D3.js.

## 🌐 Live Demo

Visit the live dashboard at: [https://nyem69.github.io/banjir/](https://nyem69.github.io/banjir/)

## 📊 Features

- Real-time data from JKM API
- Interactive bar chart showing evacuees by district
- Summary statistics including:
  - Total number of evacuation centers
  - Total number of evacuees
  - Number of active districts
- Detailed table view of all evacuation centers
- Responsive design for mobile and desktop

## 🛠️ Technology Stack

- HTML5
- CSS3
- JavaScript
- D3.js for data visualization
- GitHub Pages for hosting

## 🚀 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/nyem69/banjir.git
   cd banjir
   ```

2. Open the project in your preferred code editor

3. Serve the files using a local server. For example, using Python:
   ```bash
   python -m http.server
   ```
   Or using Node.js's `http-server`:
   ```bash
   npx http-server
   ```

4. Open your browser and navigate to `http://localhost:8000`

## 📝 API Information

The dashboard uses the JKM API endpoint:
```
https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php
```

Parameters:
- `seasonmain_id`: Identifies the flood season
- `seasonnegeri_id`: Identifies the state

## 📱 Browser Compatibility

The dashboard is tested and works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Data provided by [Jabatan Kebajikan Masyarakat Malaysia](https://www.jkm.gov.my/)
- Built with [D3.js](https://d3js.org/)
