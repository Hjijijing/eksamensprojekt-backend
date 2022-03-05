const ItemSchema = require("./models/item");

let cache = [];

async function createCache() {
  const items = await ItemSchema.find({});

  if (!items) return;

  items.forEach((item) => {
    cache.push(item);
  });
}

async function createItem(itemData) {
  if (itemData == null) return;

  if (itemData.storedIn) {
    if (!itemExists(itemData.storedIn)) itemData.storedIn = null;
  }

  ItemSchema.create(itemData, function (err, item) {
    if (err) {
      console.log(err);
      return;
    }

    cache.push(item);
  });
}

function getItem(id) {
  return cache.find((item) => {
    return item._id.toString() == id.toString();
  });
}

function itemExists(id) {
  return getItem(id) != null;
}

function getCacheIndexOfItem(id) {
  for (let i = 0; i < cache.length; i++) {
    if (cache[i]._id.toString() == id.toString()) {
      return i;
    }
  }

  console.log("error in finding item index");
  return -1;
}

function updateItemInCache(id, newItem) {
  console.log("Updating item " + newItem);
  const index = getCacheIndexOfItem(id);
  if (index > -1) cache[index] = newItem;
}

function removeItemFromCache(id) {
  const index = getCacheIndexOfItem(id);
  cache.splice(index, 1);
}

function getItems() {
  return cache;
}

function getItemsStoredIn(id) {
  return cache.filter((item) => {
    if (!item.storedIn) return false;
    return item.storedIn.toString() == id.toString();
  });
}

async function updateItem(id, newItemData) {
  if (newItemData == null) return;

  if (newItemData.storedIn) {
    const storeIn = getItem(newItemData.storedIn);
    if (!storeIn.isContainer) return; //Cannot store in non-container
    if (storeIn.storedIn == id) return; //Cannot store inside container that is stored inside this: infinite loop.
  }

  if (newItemData.isContainer != null && newItemData.isContainer == false) {
    const storedInItem = getItemsStoredIn(id);
    storedInItem.forEach((item) => {
      updateItem(item._id, { storedIn: null });
    });
  }

  const newItem = await ItemSchema.findOneAndUpdate({ _id: id }, newItemData, {
    upsert: true,
    new: true,
  });

  updateItemInCache(id, newItem);
}

async function deleteItem(id) {
  if (!id) return;
  const storedInItem = getItemsStoredIn(id);
  storedInItem.forEach((item) => {
    updateItem(item._id, { storedIn: null });
  });

  await ItemSchema.deleteOne({ _id: id });

  removeItemFromCache(id);
}

module.exports.createCache = createCache;
module.exports.createItem = createItem;
module.exports.getItem = getItem;
module.exports.getItems = getItems;
module.exports.getItemsStoredIn = getItemsStoredIn;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
