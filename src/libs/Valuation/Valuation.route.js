const ValuationController = require("./Valuation.controller");
const ValuationModel = require("./Valuation.model");

exports.ValuationRoutes = function (app) {
  app.get("/valuation", [ValuationController.findAll]);

  app.get("/valuation/quicksearch/:approval/:column/:value", [
    ValuationController.paginatedSearch,
  ]);

  app.get("/valuation/paginated/:approval/:offset", [
    ValuationController.findValuationPagnited,
  ]);

  app.get("/valuation/filter/:approval/:column/:operator/:value/:offset", [
    ValuationController.filterValuations,
  ]);

  app.get("/valuation/lrnumber", [ValuationController.findLRnumber]);

  app.get("/valuation/topstats/:name", ValuationController.findTopStats);

  app.get("/valuation/stats/:name", ValuationController.findStats);

  app.get("/valuation/:id", [ValuationController.findByID]);

  app.get("/valuation/searchid/:nationalId", [
    ValuationController.findValuationByNationalId,
  ]);

  app.get("/valuation/search/:id", [
    ValuationController.findValuationByValuationID,
  ]);

  app.get("/valuation/searchname/:ownerName", [
    ValuationController.findValuationByOwnerName,
  ]);

  app.get("/valuation/searchparcel/:parcelNumber", [
    ValuationController.findValuationByParcelNumber,
  ]);

  app.get("/valuation/searchphone/:phoneNumber", [
    ValuationController.findValuationByPhoneNumber,
  ]);

  app.post("/valuation/create", [ValuationController.create]);

  app.put("/valuation/update/:id", [ValuationController.updateByID]);

  app.get("/valuation/search/:query/:offset", [
    ValuationController.findByKeyword,
  ]);

  app.get("/valuation/paginated/:lrnumber/:offset", [
    ValuationController.findPaginated,
  ]);

  app.delete("/valuation/:id", [ValuationController.deleteById]);
};
