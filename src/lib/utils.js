export const dashboardSorter = (itemsData, itemsArray, uncategorizedItems) => {
  for (const item of itemsData) {
    const categoryName = item.categoryName;
    // if category exists adds item to category array and if not, creates new category and adds to it
    if (categoryName) {
      let category = itemsArray.find(
        (category) => category.categoryName === categoryName
      );
      if (category) {
        category.items.push(item);
      } else {
        category = {
          categoryName,
          items: [item],
        };
        itemsArray.push(category);
      }
    }
    // items with no category are added to the uncategorized list
    else {
      uncategorizedItems.push(item);
    }
  }
  // creates a category for the unsorted items
  if (uncategorizedItems.length > 0) {
    itemsArray.push({
      categoryName: 'Uncategorized',
      items: uncategorizedItems,
    });
  }
}