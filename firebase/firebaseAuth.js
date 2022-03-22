const admin = require("./firebaseConfig");
const { createOrFindUser } = require("../database/database");

async function getUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedValue = await admin.auth().verifyIdToken(token);

    if (decodedValue) {
      const user = await createOrFindUser(
        decodedValue.user_id,
        decodedValue.name
      );

      if (!user) {
        throw new Error();
      }

      req.user = user;
      return next();
    }
    return res.sendStatus(401);
  } catch {
    return res.sendStatus(500);
  }
}

module.exports = getUser;
