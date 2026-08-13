import { resolveProductGST, calculateItemGST } from '../src/utils/gstUtils.js';

console.log('--- SELLER CONTROLLED GST UNIT TESTS ---');

// Test 1: Category GST resolution
const category18 = { _id: 'cat1', name: 'Laptop', gstRate: 18 };
const productCatMode = { name: 'ASUS Vivobook', gstMode: 'category', categoryId: category18 };
const gstResult1 = resolveProductGST(productCatMode, category18);
console.log('TEST 1 (Category GST mode):', gstResult1 === 18 ? 'PASS (18%)' : `FAIL (${gstResult1})`);

// Test 2: Custom GST resolution (12%)
const productCustomMode = { name: 'ASUS Special', gstMode: 'custom', gstRate: 12, categoryId: category18 };
const gstResult2 = resolveProductGST(productCustomMode, category18);
console.log('TEST 2 (Custom GST mode 12%):', gstResult2 === 12 ? 'PASS (12%)' : `FAIL (${gstResult2})`);

// Test 3: Category GST change 18% -> 5%
const category5 = { _id: 'cat1', name: 'Laptop', gstRate: 5 };
const gstResult3_cat = resolveProductGST(productCatMode, category5);
const gstResult3_custom = resolveProductGST(productCustomMode, category5);
console.log('TEST 3 (Category updated to 5% - Cat product):', gstResult3_cat === 5 ? 'PASS (5%)' : `FAIL (${gstResult3_cat})`);
console.log('TEST 3 (Category updated to 5% - Custom product):', gstResult3_custom === 12 ? 'PASS (12%)' : `FAIL (${gstResult3_custom})`);

// Test 4: Calculate GST amounts (exclusive)
const calcExcl = calculateItemGST(50000, 1, 18, 0, false);
console.log('TEST 4 (Exclusive GST ₹50k @ 18%):', calcExcl.taxableAmount === 50000 && calcExcl.gstAmount === 9000 && calcExcl.totalAmount === 59000 ? 'PASS (Taxable: ₹50,000, GST: ₹9,000, Total: ₹59,000)' : `FAIL`, calcExcl);

// Test 5: Calculate GST amounts (inclusive)
const calcIncl = calculateItemGST(118, 1, 18, 0, true);
console.log('TEST 5 (Inclusive GST ₹118 @ 18%):', calcIncl.taxableAmount === 100 && calcIncl.gstAmount === 18 && calcIncl.totalAmount === 118 ? 'PASS (Taxable: ₹100, GST: ₹18, Total: ₹118)' : `FAIL`, calcIncl);

console.log('--- ALL UNIT TESTS COMPLETED ---');
