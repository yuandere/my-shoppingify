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

export const listsSorter = (lists) => {
  const parsedLists = lists.map(list => ({
    ...list,
    updatedAt: new Date(list.updatedAt)
  }));

  const sortedLists = parsedLists.sort((a, b) => b.updatedAt - a.updatedAt);

  const result = [];
  const monthYearMap = new Map();

  sortedLists.forEach(list => {
    const updatedAtDate = list.updatedAt;
    const monthYear = `${updatedAtDate.toLocaleString('en-US', { month: 'long' })} ${updatedAtDate.getFullYear()}`;

    if (!monthYearMap.has(monthYear)) {
      monthYearMap.set(monthYear, []);
    }

    monthYearMap.get(monthYear).push(list);
  });

  for (const [monthYear, lists] of monthYearMap.entries()) {
    result.push({
      monthYear,
      lists
    });
  }
  console.log(result);
  return result;
}
