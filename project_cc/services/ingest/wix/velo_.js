import wixData from 'wix-data';

$w.onReady(() => {
  $w('#subCategoryDropdown').disable();
});

export async function parentCategoryDropdown_change(event) {
  const selectedParent = event.target.value;

  // Reset sub category state
  $w('#subCategoryDropdown').options = [];
  $w('#subCategoryDropdown').disable();

  if (!selectedParent) return;

  const results = await wixData.query('business_categories')
    .eq('parentCategory', selectedParent)
    .eq('active', true)
    .ascending('order')
    .find();

  const options = results.items.map(item => ({
    label: item.subCategory,
    value: item.subCategory
  }));

  $w('#subCategoryDropdown').options = options;
  $w('#subCategoryDropdown').enable();
}
