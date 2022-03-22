const admin = require("./firebaseConfig");
const { createOrFindUser } = require("../database/database");

async function getUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (token && token !== "null" && token.length > 0) {
      const decodedValue = await admin.auth().verifyIdToken(token);

      if (decodedValue) {
        const user = await createOrFindUser(
          decodedValue.user_id,
          decodedValue.name
        );

        req.user = user;
      }
    }

    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

async function requireAuth(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return res.sendStatus(401);
  }
}

module.exports.getUser = getUser;
module.exports.requireAuth = requireAuth;
