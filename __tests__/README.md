# Test Suite Documentation

This directory contains comprehensive unit and integration tests for the Next.js Dashboard application.

## Test Structure

### Unit Tests
- **Components**: Tests for individual React components
- **Store/Slices**: Tests for Redux slices and state management
- **Pages**: Tests for page components

### Integration Tests
- **Auth Flow**: End-to-end authentication testing
- **User Interactions**: Complex user interaction scenarios

## Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## Test Coverage

The test suite covers:
- ✅ Authentication flow (login/logout)
- ✅ Redux state management
- ✅ Component rendering and interactions
- ✅ API data fetching and error handling
- ✅ Responsive behavior
- ✅ User input validation
- ✅ Navigation and routing

## Test Files

| File | Description |
|------|-------------|
| `authSlice.test.ts` | Redux auth state management |
| `dashboardSlice.test.ts` | Dashboard data state management |
| `Sidebar.test.tsx` | Navigation sidebar component |
| `UsersTable.test.tsx` | Data table with pagination |
| `ChartSection.test.tsx` | Analytics charts component |
| `login.test.tsx` | Login page functionality |
| `home.test.tsx` | Home dashboard page |
| `auth-flow.test.tsx` | Integration test for auth flow |

## Mocking Strategy

- **Next.js Router**: Mocked for navigation testing
- **Fetch API**: Mocked for API call testing
- **Material UI**: Uses theme provider in tests
- **Redux Store**: Test store with preloaded state
