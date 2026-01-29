/**
 * LANDING PAGE CATEGORY DROPDOWNS
 * 
 * This code populates two linked dropdowns for business categories
 * on a Wix landing page. The first dropdown lists parent categories,
 * and the second lists sub-categories based on the selected parent.
 *
 * Data is sourced from a Wix Data Collection named 'business_categories',
 * which should have fields: parentCategory (string), subCategory (string),
 * order (number), and active (boolean).
 *
 * Caching is implemented using session storage to minimize data fetches
 * and improve performance, with a TTL of 24 hours.
 * 
 * PARENT: parent_category
 * CHILD: sub_category
 * VERSION 1.0.0
 */



// Page code (Frontend)
import wixData from 'wix-data';
import { session } from 'wix-storage';

const COLLECTION = 'business_categories';

// Cache keys (versioned so schema changes don’t break old cached data)
const CACHE_KEY = 'bc_cache_v1';
const CACHE_TS_KEY = 'bc_cache_ts_v1';

// TTL: 24 hours
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let categoryIndex = null; // { parentOptions: [], byParent: Map<string, Array<{label,value,order}>> }

$w.onReady(async () => {
  // Initial UI state
  $w('#sub_category').options = [];
  $w('#sub_category').disable();

  // Load + index categories (from cache if valid)
  categoryIndex = await loadCategoryIndex();

  // Populate parent dropdown
  $w('#parent_category').options = categoryIndex.parentOptions;

  // Optional: If you want a placeholder at the top:
  // $w('#parent_category').placeholder = "Select a category";
  // $w('#sub_category').placeholder = "Select a sub-category";
});

/**
 * Parent dropdown change handler
 * Wire this to the dropdown's onChange event in the Editor,
 * or keep the function name matching Wix's auto-binding.
 */
export function parent_category_change(event) {
  const selectedParent = event.target.value;

  // Reset sub category dropdown every time
  $w('#sub_category').options = [];
  $w('#sub_category').disable();

  if (!selectedParent || !categoryIndex) return;

  const subOptions = categoryIndex.byParent.get(selectedParent) || [];

  // If nothing found, keep it disabled (silent failure-safe)
  if (subOptions.length === 0) return;

  $w('#sub_category').options = subOptions.map(o => ({
    label: o.label,
    value: o.value
  }));

  $w('#sub_category').enable();
}

/**
 * Loads categories from session cache if valid, otherwise queries CMS and builds an index.
 */
async function loadCategoryIndex() {
  const cached = readCache();
  if (cached) return cached;

  const items = await fetchAllActiveCategories();

  const index = buildIndex(items);

  writeCache(index);
  return index;
}

/**
 * Fetch all active category rows with pagination
 */
async function fetchAllActiveCategories() {
  const pageSize = 1000; // Wix query limit max is typically 1000
  let all = [];
  let skip = 0;

  while (true) {
    const result = await wixData.query(COLLECTION)
      .eq('active', true)
      .ascending('parentCategory')
      .ascending('order')
      .ascending('subCategory')
      .limit(pageSize)
      .skip(skip)
      .find();

    all = all.concat(result.items);

    if (result.items.length < pageSize) break;
    skip += pageSize;

    // Hard stop safety (prevents runaway loops if collection is huge unexpectedly)
    if (skip > 10000) break;
  }

  return all;
}

/**
 * Build an in-memory index:
 * - parentOptions for dropdown A
 * - byParent Map for dropdown B
 */
function buildIndex(items) {
  const byParent = new Map();
  const parentSet = new Set();

  for (const item of items) {
    const parent = (item.parentCategory || '').trim();
    const sub = (item.subCategory || '').trim();
    const order = Number.isFinite(item.order) ? item.order : 9999;

    if (!parent || !sub) continue;

    parentSet.add(parent);

    if (!byParent.has(parent)) byParent.set(parent, []);
    byParent.get(parent).push({
      label: sub,
      value: sub,
      order
    });
  }

  // Ensure sub options are stable-ordered
  for (const [parent, subs] of byParent.entries()) {
    subs.sort((a, b) => (a.order - b.order) || a.label.localeCompare(b.label));
    byParent.set(parent, subs);
  }

  // Parent dropdown options (alphabetical; or swap to custom ordering if you prefer)
  const parentOptions = Array.from(parentSet)
    .sort((a, b) => a.localeCompare(b))
    .map(p => ({ label: p, value: p }));

  return { parentOptions, byParent };
}

/**
 * Session cache helpers
 */
function readCache() {
  try {
    const ts = Number(session.getItem(CACHE_TS_KEY));
    const raw = session.getItem(CACHE_KEY);

    if (!ts || !raw) return null;
    if ((Date.now() - ts) > CACHE_TTL_MS) return null;

    const parsed = JSON.parse(raw);

    // Rehydrate Map (JSON loses Map type)
    const byParent = new Map(parsed.byParentEntries || []);
    return { parentOptions: parsed.parentOptions || [], byParent };
  } catch (e) {
    return null;
  }
}

function writeCache(index) {
  try {
    const payload = {
      parentOptions: index.parentOptions,
      byParentEntries: Array.from(index.byParent.entries())
    };

    session.setItem(CACHE_KEY, JSON.stringify(payload));
    session.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch (e) {
    // If storage is unavailable, fail silently (UX still works without cache)
  }
}
