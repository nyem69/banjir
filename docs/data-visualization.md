# Data Visualization

## Overview

The dashboard uses D3.js for data visualization, showing:
- Time series of flood incidents
- State and district statistics
- Comparative metrics

## Components

### Bar Chart

Used for showing:
- Number of victims by state/district
- Relief center counts
- Family counts

```typescript
<BarChart 
  data={dateSeriesData}
  xKey="date"
  yKey="jumlah_pps"
  width={200}
  height={100}
/>
```

### Time Series

Shows trends over time for:
- Number of affected states
- Number of affected districts
- Number of victims
- Number of relief centers

## Data Processing

### State Statistics
```typescript
disasters.by_state = d3.groups(disasterCases, d => d.state)
  .map(d => ({
    state: d[0],
    state_id: d[1][0].state_id,
    jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
    jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
    jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
    jumlah_kematian: d3.sum(d[1], d => d.jumlah_kematian),
  }));
```

### District Statistics
```typescript
disasters.by_district = d3.groups(disasterCases, d => d.state + '-' + d.district)
  .map(d => ({
    state: d[1][0].state,
    district: d[1][0].district,
    jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
    jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
    jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
    jumlah_kematian: d3.sum(d[1], d => d.jumlah_kematian),
  }));
```

## Best Practices

1. Data Processing
   - Process data before visualization
   - Use D3's data manipulation functions
   - Handle missing or invalid data

2. Responsiveness
   - Make charts responsive to container size
   - Use relative dimensions where possible
   - Test on different screen sizes

3. Performance
   - Limit unnecessary re-renders
   - Use efficient data structures
   - Cache computed values when possible

4. Accessibility
   - Include descriptive titles and labels
   - Use appropriate color contrasts
   - Provide alternative text descriptions

5. Internationalization
   - Use translated labels and titles
   - Handle different text lengths
   - Consider right-to-left languages
