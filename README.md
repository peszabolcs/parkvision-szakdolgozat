# ParkVision Frontend MVP - Sprint 2

Smart Parking Management System - Frontend MVP Implementation

## Sprint 2 Deliverables

This repository contains the complete Sprint 2 MVP implementation for ParkVision, including:

-  **Spec v0.2** - Product specification with scope, NFRs, and acceptance criteria
-  **User Stories** - 5 stories with acceptance criteria (INVEST compliant)
-  **ADR** - 2 architecture decision records (Platform + IaC)
-  **Wireframes** - 5 screen descriptions (normal, empty, error states)
-  **Frontend MVP** - React 18 + Vite + TypeScript + Material-UI
-  **Tests** - 6 test files with ≥60% coverage
-  **Mock Data** - MSW (Mock Service Worker) for API simulation
-  **IaC** - Terraform configuration (validate + plan)
-  **CI/CD** - GitHub Actions workflows
-  **Documentation** - Traceability matrix, DoR/DoD, AI log

## Quick Start

### Prerequisites

- Node.js 18.x
- npm 9.x
- Terraform 1.5+ (for IaC)

### Installation

```bash
# Install dependencies
npm install

# Start development server with mock API
npm run dev

# Open http://localhost:5173
```

### Available Scripts

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run ci-local     # Run full CI locally (lint + test + build)
```

## Project Structure

```
├── .github/workflows/     # CI/CD workflows (test, build, terraform)
├── sprints/02/
│   ├── docs/
│   │   ├── spec/          # Spec v0.2
│   │   ├── stories/       # User Stories + AC
│   │   ├── adr/           # Architecture Decision Records
│   │   ├── process/       # DoR/DoD
│   │   └── traceability.md
│   ├── wireframes/        # Wireframe descriptions
│   ├── tests/acceptance/  # Gherkin feature files
│   ├── deploy/            # Deployment config (target.yaml)
│   ├── scripts/           # Smoke tests
│   ├── infra/terraform/   # IaC configuration
│   └── ai/                # AI usage log
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components (Dashboard, Areas, etc.)
│   ├── hooks/             # Custom hooks (useQuery)
│   ├── mocks/             # MSW mock handlers
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── test/              # Test setup
└── package.json
```

## Features

### Implemented (Sprint 2 MVP)

-  **Dashboard** - Real-time parking occupancy statistics
- 🅿️ **Parking Spaces List** - Table view with status filtering
- 🗺️ **Areas Management** - Parking area overview with capacity
- 🚫 **Empty State** - Informative UI when no data available
- [!] **Error Handling** - Error banner with retry functionality
- 📱 **Responsive Design** - Mobile and desktop optimized

### Mock Scenarios

Switch between scenarios using environment variable:

```bash
# Normal scenario (default)
VITE_MOCK_SCENARIO=normal npm run dev

# Empty state scenario
VITE_MOCK_SCENARIO=empty npm run dev

# Error state scenario
VITE_MOCK_SCENARIO=error npm run dev
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Coverage report: sprints/02/reports/coverage/index.html
```

### Test Coverage

- **Target:** ≥60% line coverage
- **Current:** ~68%
- **Test files:** 6 (EmptyState, ErrorBanner, StatCard, useParkingSpaces, date utils)

### Smoke Tests

```bash
# Start preview server
npm run preview

# Run smoke tests (manual)
# - Check: http://localhost:4173/
# - Check: http://localhost:4173/dashboard
# - Check: http://localhost:4173/parking-spaces
# - Check: http://localhost:4173/areas
```

## Infrastructure (IaC)

### Terraform Setup

```bash
cd sprints/02/infra/terraform

# Initialize
terraform init

# Validate
terraform validate

# Plan (requires Vercel API token)
terraform plan -out=plan.out
```

See [Terraform README](sprints/02/infra/terraform/README.md) for details.

## CI/CD

GitHub Actions workflows:

- **Test & Coverage** - Runs tests, generates coverage report
- **Build** - Builds production bundle
- **Terraform** - Validates and plans infrastructure

All workflows run on:
- Push to `main`
- Pull requests to `main`

## Documentation

### Key Documents

- [Spec v0.2](sprints/02/docs/spec/product_spec_v0.2.md) - Product specification
- [User Stories](sprints/02/docs/stories/user_stories.md) - 5 stories with AC
- [ADR-0001](sprints/02/docs/adr/0001-frontend-platform-and-deployment.md) - Platform choice
- [ADR-0002](sprints/02/docs/adr/0002-iac-strategy-terraform.md) - IaC strategy
- [Traceability](sprints/02/docs/traceability.md) - Story → Test → Code mapping
- [DoR/DoD](sprints/02/docs/process/dor_dod.md) - Definition of Ready/Done
- [AI Log](sprints/02/ai/ai_log.jsonl) - AI tool usage log

## Tech Stack

- **Frontend:** React 18.2, TypeScript 5.0
- **Build Tool:** Vite 4.3
- **UI Library:** Material-UI v5
- **State Management:** Zustand 3.7
- **Data Fetching:** TanStack Query 4.29
- **Mock API:** MSW 1.2
- **Testing:** Vitest, React Testing Library
- **IaC:** Terraform 1.5
- **Deployment:** Vercel (planned)

## Known Issues

- Pagination not implemented (showing first 20 items only)
- Table column sorting limited to "Updated" column
- No real backend integration (mock data only)

## Next Steps (Sprint 3)

- [ ] E2E tests with Playwright
- [ ] Real backend API integration
- [ ] Full table pagination and sorting
- [ ] Terraform apply automation in CI
- [ ] Performance optimization (Lighthouse CI)

## License

MIT

## Contact

For questions or feedback, please create an issue in this repository.

---

**Sprint:** 2
**Version:** 0.2.0
**Last Updated:** 2025-12-08
