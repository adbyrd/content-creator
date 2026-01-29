/**
 * CATEGORY SERVICE
 * 'categoryService.jsw'
 * 
 * Provides methods to fetch and structure business category data
 * from the 'BusinessCategories' Wix Data Collection.
 * 
 * This service implements in-memory caching to reduce data fetches
 * and improve performance, with a TTL of 30 minutes.
 * 
 * VERSION 1.0.0
 */
import wixData from 'wix-data';

let memoryCache = {
  loadedAt: 0,
  ttlMs: 1000 * 60 * 30, // 30 min
  rows: null
};

// WHY: Keep reads cheap and page fast; categories rarely change.
export async function getCategoryRows() {
  const now = Date.now();
  const isFresh = memoryCache.rows && (now - memoryCache.loadedAt) < memoryCache.ttlMs;
  if (isFresh) return memoryCache.rows;

  const results = await wixData.query('BusinessCategories')
    .eq('isActive', true)
    .limit(1000) // 240 rows fits comfortably
    .find();

  memoryCache = { loadedAt: now, ttlMs: memoryCache.ttlMs, rows: results.items };
  return results.items;
}

// WHY: Convenience method for page code
export async function getTaxonomy() {
  const rows = await getCategoryRows();

  // Build fast lookup maps
  const parentsMap = new Map(); // parentSlug -> parentLabel
  const childrenMap = new Map(); // parentSlug -> [{label, value}...]

  for (const r of rows) {
    if (!parentsMap.has(r.parentSlug)) parentsMap.set(r.parentSlug, r.parentLabel);

    const list = childrenMap.get(r.parentSlug) || [];
    list.push({
      label: r.subLabel,
      value: r.subSlug
    });
    childrenMap.set(r.parentSlug, list);
  }

  // Sort children by label (or by sortOrder if present)
  for (const [k, list] of childrenMap.entries()) {
    list.sort((a, b) => a.label.localeCompare(b.label));
    childrenMap.set(k, list);
  }

  const parentOptions = Array.from(parentsMap.entries())
    .map(([value, label]) => ({ label, value }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    parentOptions,
    childrenByParent: Object.fromEntries(childrenMap.entries())
  };
}
