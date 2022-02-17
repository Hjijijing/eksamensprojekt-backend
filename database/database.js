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
    return item._id == id;
  });
}

function getItems() {
  return cache;
}

function getItemsStoredIn(id) {
  return cache.filter((item) => {
    return (item.storedIn = id);
  });
}

async function updateItem(id, newItemData) {
  if (newItemData == null) return;
  if (currentItem == null) return;

  if (newItemData.storedIn) {
    const storeIn = getItem(newItemData.storedIn);
    if (!storeIn.isContainer) return; //Cannot store in non-container
    if (storeIn.storedIn == id) return; //Cannot store inside container that is stored inside this: infinite loop.
  }

  const newItem = await ItemSchema.findOneAndUpdate({ _id: id }, newItemData, {
    upsert: true,
  });

  const index = cache.indexOf(getItem(id));
  cache[index] = newItem;
}

async function deleteItem(id) {
  if (!id) return;
  const storedInItem = getItemsStoredIn(id);
  storedInItem.forEach((item) => {
    updateItem(item.id, { storedIn: null });
  });

  ItemSchema.findOneAndRemove({ _id: id });
  const index = cache.indexOf(getItem(id));
  cache.splice(index, 1);
}

module.exports.createCache = createCache;
module.exports.createItem = createItem;
module.exports.getItem = getItem;
module.exports.getItemsStoredIn = getItemsStoredIn;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
