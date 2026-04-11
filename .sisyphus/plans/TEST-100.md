# TEST-100 — Add formatCurrency utility function

This plan implements a `formatCurrency` utility function that formats numbers as currency strings with proper comma separators, negative number handling, and multi-currency support.

## Wave 1

- [x] 1. Implement formatCurrency function in src/index.ts with USD as default currency
- [x] 2. Add formatting for positive numbers with comma separators (1234.5 → '$1,234.50')
- [x] 3. Handle negative numbers with proper negative sign placement (-99.99 → '-$99.99')
- [x] 4. Add EUR currency support using optional second parameter ('EUR' → '€100.00')

## Wave 2

- [ ] 1. Add Vitest unit tests for USD formatting of positive numbers
- [ ] 2. Add unit tests for USD formatting of large numbers with many separators (1000000 → '$1,000,000.00')
- [ ] 3. Add unit tests for negative number formatting
- [ ] 4. Add unit tests for EUR currency formatting
- [ ] 5. Run full test suite to verify all acceptance criteria pass

## Wave 3

- [ ] 1. Run TypeScript compiler to verify no type errors (npm run lint)
- [ ] 2. Verify build completes successfully (npm run build)
