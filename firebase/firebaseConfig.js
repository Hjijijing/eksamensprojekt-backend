var admin = require("firebase-admin");

var serviceAccount = require("./programmeringseksamen-firebase-adminsdk-6mfha-386eac00e2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
