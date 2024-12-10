# Development Rules

## Internationalization (i18n)

### Message Files
- Use Paraglide for internationalization
- Place message files in `/messages` folder
- Use `.json` format
- Use single level JSON structure only (no nesting)
- Follow the naming convention:
  ```json
  {
    "key": "value",
    "section_key": "value",
    "parent_child": "value"
  }
  ```
  NOT:
  ```json
  {
    "key": "value",
    "section": {
      "key": "value"
    }
  }
  ```

### Using Messages in Code
- Import messages:
  ```typescript
  import * as m from "$lib/paraglide/messages"
  ```
- Use messages:
  ```typescript
  m.message_key()  // correct
  m.states_johor() // correct
  m.states.johor() // wrong - no nested structure
  ```

### Message Keys
- Use snake_case for message keys
- For grouped items, prefix with group name:
  ```json
  {
    "states_johor": "Johor",
    "states_kedah": "Kedah"
  }
  ```

## Svelte 5 Runes

### State Management
- Use `$state()` for reactive state:
  ```typescript
  let count = $state(0)
  ```
- Use `$derived()` for computed values:
  ```typescript
  let doubled = $derived(count * 2)
  ```
- Use `$effect()` for side effects:
  ```typescript
  $effect(() => {
    console.log(`Count changed to ${count}`)
  })
  ```

### Props
- Use `$props()` for component props:
  ```typescript
  let { title, description } = $props<{
    title: string
    description: string
  }>()
  ```

### Events
- Use `$on()` for event handling:
  ```typescript
  $on('click', () => {
    count++
  })
  ```

## Code Style
- Use TypeScript for type safety
- Use consistent indentation (2 spaces)
- Add type annotations for better IDE support
- Keep components focused and single-responsibility
- Use descriptive variable and function names

## Best Practices
- Keep translations up to date across all language files
- Test UI in all supported languages
- Use TypeScript interfaces for data structures
- Document complex logic or business rules
- Write unit tests for critical functionality
- Keep components small and focused
- Use CSS utility classes (Tailwind) consistently
