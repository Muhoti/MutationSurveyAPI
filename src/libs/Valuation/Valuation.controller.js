const ValuationModel = require("./Valuation.model");

exports.create = (req, res) => {
  ValuationModel.createValuation(req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findAll = (req, res) => {
  ValuationModel.findAll().then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findValuationPagnited = (req, res) => {
  ValuationModel.findValuationPagnited(req.params.approval,req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.filterValuations = (req, res) => {
  ValuationModel.filterValuations(
    req.params.approval,
    req.params.column,
    req.params.operator,
    req.params.value,
    req.params.offset
  ).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.paginatedSearch = (req, res) => {
  ValuationModel.paginatedSearch(
    req.params.approval,
    req.params.column,
    req.params.value
  ).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findPaginated = (req, res) => {
  ValuationModel.findPaginated(req.params.lrnumber, req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findByID = (req, res) => {
  ValuationModel.findByID(req.params.id).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findValuationByNationalId = (req, res) => {
  ValuationModel.findValuationByNationalId(req.params.nationalId).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findValuationByValuationID = (req, res) => {
  ValuationModel.findValuationByValuationID(req.params.id).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findValuationByOwnerName = (req, res) => {
  ValuationModel.findValuationByOwnerName(req.params.ownerName).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findValuationByParcelNumber = (req, res) => {
  ValuationModel.findValuationByParcelNumber(req.params.parcelNumber).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findValuationByPhoneNumber = (req, res) => {
  ValuationModel.findValuationByPhoneNumber(req.params.phoneNumber).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.updateByID = (req, res) => {
  ValuationModel.updateByID(req.body, req.params.id).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findByKeyword = (req, res) => {
  ValuationModel.findByKeyWord(req.params.query, req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.deleteById = (req, res) => {
  ValuationModel.deleteById(req.params.id).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findLRnumber = (req, res) => {
  ValuationModel.findLRnumber().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};


exports.findTopStats = (req, res) => {
  ValuationModel.findTopStats(req.params.name).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
      console.log(err);
    }
  );
};

exports.findStats = (req, res) => {
  ValuationModel.findStats(req.params.name).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
