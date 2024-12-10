# Testing Guide

## Overview

This guide outlines testing practices for the flood evacuation center dashboard.

## Test Types

### Unit Tests

Located in `tests/unit/`:
- Component tests
- Utility function tests
- Data processing tests

Example component test:
```typescript
import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import BarChart from '../src/lib/components/BarChart.svelte';

test('renders bar chart with correct data', () => {
  const data = [
    { date: '2024-01-01', value: 10 },
    { date: '2024-01-02', value: 20 }
  ];
  
  const { container } = render(BarChart, { 
    props: { 
      data,
      xKey: 'date',
      yKey: 'value'
    }
  });
  
  expect(container.querySelector('svg')).toBeTruthy();
  expect(container.querySelectorAll('rect').length).toBe(2);
});
```

### Integration Tests

Located in `tests/integration/`:
- API integration tests
- Data flow tests
- State management tests

Example API test:
```typescript
import { expect, test } from 'vitest';
import { fetchDisasters } from '../src/lib/api';

test('fetches disaster data successfully', async () => {
  const data = await fetchDisasters();
  expect(data).toBeDefined();
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toHaveProperty('state');
  expect(data[0]).toHaveProperty('jumlah_mangsa');
});
```

### E2E Tests

Located in `tests/e2e/`:
- User flow tests
- Cross-browser tests
- Performance tests

Example E2E test:
```typescript
import { test, expect } from '@playwright/test';

test('user can switch language', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="language-selector"]');
  await page.click('[data-testid="lang-ms"]');
  
  const heading = await page.textContent('h1');
  expect(heading).toBe('Pusat Pemindahan Banjir');
});
```

## Test Setup

1. Install dependencies:
```bash
npm install -D vitest @testing-library/svelte playwright
```

2. Configure Vitest:
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**/*.test.ts']
  }
});
```

3. Configure Playwright:
```javascript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173'
  }
});
```

## Running Tests

```bash
# Run unit and integration tests
npm test

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test tests/unit/BarChart.test.ts

# Run tests in watch mode
npm test -- --watch
```

## Best Practices

1. Test Organization
   - Group related tests
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

2. Test Coverage
   - Aim for high coverage of critical paths
   - Test edge cases and error conditions
   - Test internationalization features

3. Mocking
   - Mock external dependencies
   - Use consistent mock data
   - Document mock assumptions

4. Assertions
   - Make assertions specific
   - Test both positive and negative cases
   - Verify state changes

5. Maintenance
   - Keep tests up to date
   - Refactor tests with code changes
   - Review test failures promptly

## CI/CD Integration

Tests are run in GitHub Actions:
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```
