const { Sequelize } = require("sequelize");
const sequelize = require("../../configs/connection");
const Valuation = require("../../models/Valuation")(sequelize, Sequelize);
const { Op } = require("sequelize");

Valuation.sync({ force: false });

exports.createValuation = (ValuationData) => {
  return new Promise(async (resolve, reject) => {
    Valuation.create(ValuationData).then(
      (result) => {
        resolve({
          success: "Created successfully",
        });
      },
      (err) => {
        console.log(err);
        reject({ error: "Valuation creation failed" });
      }
    );
  });
};

exports.findAll = () => {
  return new Promise((resolve, reject) => {
    Valuation.findAll({}).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject({ error: "Failed!" });
      }
    );
  });
};

exports.findValuationPagnited = (approval, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, meta] = await sequelize.query(
        `SELECT * FROM "Valuations" WHERE "FirstApprover" ${
          approval == "firstapproval" ? "IS NULL" : "IS NOT NULL"
        } ORDER BY "createdAt" ASC LIMIT 12 OFFSET ${offset}  `
      );
      const [count, mdata] = await sequelize.query(
        `SELECT COUNT(*) FROM "Valuations" WHERE "FirstApprover" ${
          approval == "firstapproval" ? "IS NULL" : "IS NOT NULL"
        }`
      );
      resolve({
        data: result,
        total: count[0].count,
      });
    } catch (error) {
      console.log(error);
      reject({ error: "Retrieve Failed!" });
    }
  });
};

exports.filterValuations = (approval, column, operator, value, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, metadata] = await sequelize.query(
        `SELECT * FROM "Valuations" WHERE "${column}" ${operator} '${value}' AND "FirstApprover" ${
          approval == "firstapproval" ? "IS NULL" : "IS NOT NULL"
        } LIMIT 12 OFFSET ${offset}`
      );

      const [count, cmetadata] = await sequelize.query(
        `SELECT Count(*)::int AS total FROM "Valuations" WHERE "${column}" ${operator} '${value}' AND "FirstApprover" ${
          approval == "firstapproval" ? "IS NULL" : "IS NOT NULL"
        }`
      );

      resolve({
        data: result,
        total: count[0].total,
      });
    } catch (error) {
      console.log(error);
      reject({ error: "Retrieve failed!" });
    }
  });
};

exports.paginatedSearch = (approval, column, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, metadata] = await sequelize.query(
        `SELECT * FROM "Valuations" WHERE "${column}" ILIKE '%${value}%' AND "FirstApprover" ${
          approval == "firstapproval" ? "IS NULL" : "IS NOT NULL"
        }`
      );

      resolve({
        data: result,
        total: 12,
      });
    } catch (error) {
      reject({ error: "Retrieve failed!" });
    }
  });
};

exports.findPaginated = (lrnumber, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT * FROM "Valuations" ${
          lrnumber === "all" ? "" : `WHERE "LR_Number"= '${lrnumber}'`
        } LIMIT 10 OFFSET '${offset}'`
      );

      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*) FROM "Valuations"`
      );

      resolve({ data: data, total: count[0].count });
    } catch (error) {
      console.log(error);
      reject({ error: "failed" });
    }
  });
};

exports.findByID = (id) => {
  return new Promise(async (resolve, reject) => {
    Valuation.findAll({
      where: {
        NewPlotNumber: id,
      },
    }).then(
      (result) => {
        if (result == null) {
          reject({ status: 404, success: "Data not found" });
        }
        resolve(result);
      },
      (error) => {
        reject({ error: "Not found" });
      }
    );
  });
};

exports.findValuationByNationalId = (id) => {
  return new Promise((resolve, reject) => {
    Valuation.findAll({
      where: {
        NationalID: {
          [Op.iLike]: `%${id}%`,
        },
      },
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Valuation Data not found" });
        }
        resolve(result);
      },
      (err) => {
        console.log(err);
        reject({ error: "failed" });
      }
    );
  });
};

exports.findValuationByValuationID = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data] = await sequelize.query(
        `SELECT * FROM "Valuations" WHERE "ValuationID" = '${id}'`
      );
      resolve(data);
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};

exports.findValuationByOwnerName = (name, limit = 10) => {
  return new Promise((resolve, reject) => {
    Valuation.findAll({
      where: {
        OwnerName: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit: limit,
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Valuation Data not found" });
        }
        resolve(result);
      },
      (err) => {
        console.log(err);
        reject({ error: "failed" });
      }
    );
  });
};

exports.findValuationByParcelNumber = (pno, limit = 10) => {
  return new Promise((resolve, reject) => {
    Valuation.findAll({
      where: {
        ParcelNo: {
          [Op.iLike]: `%${pno}%`,
        },
      },
      limit: limit,
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Valuation Data not found" });
        }
        resolve(result);
      },
      (err) => {
        console.log(err);
        reject({ error: "failed" });
      }
    );
  });
};

exports.findValuationByPhoneNumber = (phone, limit) => {
  return new Promise((resolve, reject) => {
    Valuation.findAll({
      where: {
        Phone: {
          [Op.iLike]: `%${phone}%`,
        },
      },
      limit: limit,
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Valuation Data not found" });
        }
        resolve(result);
      },
      (err) => {
        console.log(err);
        reject({ error: "failed" });
      }
    );
  });
};

exports.updateByID = (ValuationDataData, id) => {
  return new Promise((resolve, reject) => {
    Valuation.update(ValuationDataData, {
      where: {
        NewPlotNumber: id,
      },
    }).then(
      (result) => {
        console.log(result);
        resolve({ success: "Parcel Details Updated Successfully" });
      },
      (err) => {
        console.log(err);
        reject({ error: "Update failed!" });
      }
    );
  });
};

exports.findByKeyWord = (query, offset) => {
  return new Promise((resolve, reject) => {
    Valuation.findAll({
      where: {
        NationalID: {
          [Sequelize.Op.iLike]: `%${query}%`,
        },
      },
      offset: offset,
      limit: 5,
    }).then(
      (result) => {
        if (result == null) {
          reject({ status: 404, success: "Not found!!" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: "Failed!" });
      }
    );
  });
};

exports.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    Valuation.destroy({
      where: {
        ValuationID: id,
      },
    }).then(
      (result) => {
        if (result != 0) resolve({ success: "Deleted Successfully" });
        else reject({ error: "Entry does not exist" });
      },
      (error) => {
        reject({ error: "Delete failed!" });
      }
    );
  });
};

exports.findLRnumber = () => {
  return new Promise((resolve, reject) => {
    Valuation.findAll({
      attributes: [
        Sequelize.fn("DISTINCT", Sequelize.col("LR_Number")),
        "LR_Number",
      ],
    }).then(
      async (result) => {
        const total = await Valuation.count();

        resolve({
          result: result,
          total: total,
        });
      },
      (err) => {
        reject({ error: "Failed!" });
      }
    );
  });
};

exports.findTopStats = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [sub] = await sequelize.query(
        `SELECT COUNT(DISTINCT "SubCounty") AS count FROM "Valuations" WHERE "FieldOfficer" = '${name}'`
      );

      const [war] = await sequelize.query(
        `SELECT COUNT(DISTINCT "Ward") AS count FROM "Valuations" WHERE "FieldOfficer" = '${name}'`
      );

      const [tpl] = await sequelize.query(
        `SELECT COUNT(DISTINCT "NewPlotNumber") AS count FROM "Valuations" WHERE "FieldOfficer" = '${name}'`
      );

      const [mkts] = await sequelize.query(
        `SELECT COUNT(DISTINCT "Market") AS count FROM "Valuations" WHERE "FieldOfficer" = '${name}'`
      );

      resolve({
        Subcounties: sub[0].count,
        Wards: war[0].count,
        Allplots: tpl[0].count,
        Markets: mkts[0].count,
      });
    } catch (error) {
      console.log(error);
      reject({ error: "Retrieve failed" });
    }
  });
};

exports.findStats = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [sub] = await sequelize.query(
        `SELECT "Valuations"."SubCounty", COUNT(*) AS count FROM "Valuations" WHERE "FieldOfficer" = '${name}' GROUP BY "Valuations"."SubCounty"`
      );

      const [war] = await sequelize.query(
        `SELECT "Valuations"."Ward", COUNT(*) AS count FROM "Valuations" WHERE "FieldOfficer" = '${name}' GROUP BY "Valuations"."Ward" `
      );

      resolve({
        subcounties: sub,
        wards: war,
      });
    } catch (error) {
      console.log(error);
      reject({ error: "Retrieve failed" });
    }
  });
};
