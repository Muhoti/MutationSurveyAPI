const PowerbaseController = require("./Powerbase.controller");

exports.PowerbaseRoutes = function (app) {
  app.get("/powerbase", [PowerbaseController.findAll]);

  app.get("/powerbase/paginated/:offset", [
    PowerbaseController.findPowerbasePagnited,
  ]);

  
  app.get("/powerbase/filter/:column/:operator/:value/:offset", [
    PowerbaseController.filterPowerbase,
  ]);

 app.get("/powerbase/paginated/search/:column/:value/:offset", [
   PowerbaseController.paginatedSearch,
 ]);

  app.get("/powerbase/lrnumber", [PowerbaseController.findLRnumber]);

  app.get("/powerbase/topstats", PowerbaseController.findTopStats);

  app.get("/powerbase/stats", PowerbaseController.findStats);

  app.get("/powerbase/:id", [PowerbaseController.findByID]);

  app.get("/powerbase/searchid/:nationalId", [
    PowerbaseController.findPowerbaseByNationalId,
  ]);

  app.get("/powerbase/search/:id", [
    PowerbaseController.findPowerbaseByPowerbaseID,
  ]);

  app.get("/powerbase/searchname/:ownerName", [
    PowerbaseController.findPowerbaseByOwnerName,
  ]);

  app.get("/powerbase/searchparcel/:parcelNumber", [
    PowerbaseController.findPowerbaseByParcelNumber,
  ]);

  app.get("/powerbase/searchphone/:phoneNumber", [
    PowerbaseController.findPowerbaseByPhoneNumber,
  ]);

  app.post("/powerbase/create", [PowerbaseController.create]);

  app.put("/powerbase/update/:id", [PowerbaseController.updateByID]);

  app.get("/powerbase/search/:query/:offset", [
    PowerbaseController.findByKeyword,
  ]);

  app.get("/powerbase/lrnumber/:lrnumber/:offset", [
    PowerbaseController.findLRnumber,
  ]);

  app.get("/powerbase/paginated/:lrnumber/:offset", [
    PowerbaseController.findPaginated,
  ]);

  app.delete("/powerbase/delete/:id", [PowerbaseController.deleteById]);
};
