const AuthController = require("./Auth.controller");
const verifyToken = require("../Utils/VerifyToken");

exports.AuthRoutes = function (app) {
  app.post("/auth/register", [AuthController.insert]);

  app.post("/auth/login", [AuthController.login]);

  app.get("/auth/logout", [verifyToken, AuthController.logout]);

  app.post("/auth/forgot", [AuthController.forgotPassword]);

  app.get("/auth/paginated/:offset", [AuthController.findAuthPaginated]);

  app.delete("/auth/:authID", [verifyToken, AuthController.deleteAuthById]);

  app.put("/auth/:authID", [AuthController.updateAuthById]);

  app.get("/auth/:authID", [AuthController.findAuthById]);

  // app.get("/auth/:nationalId", [AuthController.findAuthByNationalId]);

  app.get("/auth", [AuthController.findAllAuth]);
};
