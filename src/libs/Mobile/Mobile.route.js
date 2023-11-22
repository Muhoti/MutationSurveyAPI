const MobileController = require("./Mobile.controller");
const verifyToken = require("../Utils/VerifyToken");

exports.MobileRoutes = function (app) {
  
  app.post("/mobile/register", [MobileController.insert]);

  app.post("/mobile/login", [MobileController.MobileLogin]);

  app.get("/mobile/logout", [MobileController.logout]);

  app.post("/mobile/forgot", [MobileController.forgotPassword]);

  app.get("/mobile/paginated/:offset", [MobileController.findAuthPaginated]);

  app.get("/mobile/:authID", [MobileController.findAuthById]);

  app.put("/mobile/:authID", [MobileController.updateAuthById]);

  app.delete("/mobile/:authID", [MobileController.deleteAuthById]);

  app.get("/mobile", [MobileController.findAllAuth]);
};
