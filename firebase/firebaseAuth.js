const admin = require("./firebaseConfig");

async function getUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedValue = await admin.auth().verifyIdToken(token);

    if (decodedValue) {
      console.log(decodedValue);
      return next();
    }
    return res.sendStatus(401);
  } catch {
    return res.sendStatus(500);
  }
}

module.exports = getUser;
