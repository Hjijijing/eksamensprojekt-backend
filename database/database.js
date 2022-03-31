const ItemSchema = require("./models/item");
const UserSchema = require("./models/user");

let itemCache = [];
let userCache = [];

async function createCache() {
  const items = await ItemSchema.find({});

  if (!items) return;

  items.forEach((item) => {
    itemCache.push(item);
  });

  const users = await UserSchema.find({});
  users.forEach((user) => {
    userCache.push(user);
  });
}

async function createItem(itemData, user) {
  if (!user) return;
  if (itemData == null) return;

  if (itemData.storedIn) {
    if (!itemExists(itemData.storedIn)) itemData.storedIn = null;
  }

  ItemSchema.create({ ...itemData, owner: user._id }, function (err, item) {
    if (err) {
      console.log(err);
      return;
    }

    itemCache.push(item);
  });
}

function getItem(id) {
  return itemCache.find((item) => {
    return item._id.toString() == id.toString();
  });
}

function itemExists(id) {
  return getItem(id) != null;
}

function getCacheIndexOfItem(id) {
  for (let i = 0; i < itemCache.length; i++) {
    if (itemCache[i]._id.toString() == id.toString()) {
      return i;
    }
  }

  console.log("error in finding item index");
  return -1;
}

function updateItemInCache(id, newItem) {
  // console.log("Updating item " + newItem);
  const index = getCacheIndexOfItem(id);
  if (index > -1) itemCache[index] = newItem;
}

function removeItemFromCache(id) {
  const index = getCacheIndexOfItem(id);
  itemCache.splice(index, 1);
}

function getItems(user) {
  if (!user) return [];
  const userItems = itemCache.filter((item) => itemBelongsToUser(user, item));
  return userItems;
}

function getItemsStoredIn(id) {
  return itemCache.filter((item) => {
    if (!item.storedIn) return false;
    return item.storedIn.toString() == id.toString();
  });
}

async function updateItem(id, newItemData, user) {
  if (user == null) return;
  if (newItemData == null) return;

  if (!idBelongsToUser(user, id)) return;

  if (newItemData.storedIn) {
    const storeIn = getItem(newItemData.storedIn);
    console.log(newItemData.storedIn);
    if (!storeIn) return;
    if (!storeIn.isContainer) return; //Cannot store in non-container
    if (storeIn.storedIn && storeIn.storedIn.toString() == id.toString()) return; //Cannot store inside container that is stored inside this: infinite loop.
    if (storeIn._id.toString() == id.toString()) return; //Cannot store inside self.
  }

  if (newItemData.isContainer != null && newItemData.isContainer == false) {
    const storedInItem = getItemsStoredIn(id);
    storedInItem.forEach((item) => {
      updateItem(item._id, { storedIn: null });
    });
  }

  const newItem = await ItemSchema.findOneAndUpdate({ _id: id }, newItemData, {
    new: true,
  });

  updateItemInCache(id, newItem);
}

async function deleteItem(id, user) {
  if (user == null) return;
  if (!id) return;

  if (!idBelongsToUser(user, id)) return;

  const storedInItem = getItemsStoredIn(id);
  storedInItem.forEach((item) => {
    updateItem(item._id, { storedIn: null });
  });

  await ItemSchema.deleteOne({ _id: id });

  removeItemFromCache(id);
}

async function createOrFindUser(userId, userName) {
  const user = userCache.find((user) => {
    return user.userId == userId;
  });

  if (user) return user;

  const newUser = await UserSchema.findOneAndUpdate(
    { userId },
    { userId, userName },
    { upsert: true, new: true }
  );

  if (!newUser) return null;

  userCache.push(newUser);
  return newUser;
}

function itemBelongsToUser(user, item) {
  if (!item) return;
  if (!item.owner) return false;
  return user._id.toString() == item.owner.toString();
}

function idBelongsToUser(user, id) {
  return itemBelongsToUser(user, getItem(id));
}

module.exports.createCache = createCache;
module.exports.createItem = createItem;
module.exports.getItem = getItem;
module.exports.getItems = getItems;
module.exports.getItemsStoredIn = getItemsStoredIn;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
module.exports.createOrFindUser = createOrFindUser;
