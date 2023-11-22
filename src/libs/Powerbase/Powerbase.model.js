const { Sequelize } = require("sequelize");
const sequelize = require("../../configs/connection");
const Powerbase = require("../../models/Powerbase")(sequelize, Sequelize);
const { Op } = require("sequelize");

Powerbase.sync({ force: false });

exports.createPowerbase = (PowerbaseData) => {
  return new Promise(async (resolve, reject) => {
    Powerbase.create(PowerbaseData).then(
      (result) => {
        resolve({
          success: "Created successfully",
        });
      },
      (err) => {
        console.log(err);
        reject({ error: "Powerbase creation failed" });
      }
    );
  });
};

exports.findAll = () => {
  return new Promise((resolve, reject) => {
    Powerbase.findAll({}).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        console.log(err);
        reject({ error: err });
      }
    );
  });
};

exports.findPowerbasePagnited = (offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, meta] = await sequelize.query(
        `SELECT * FROM "Powerbases" ORDER BY "createdAt" ASC LIMIT 12 OFFSET ${offset}  `
      );
      const [count, mdata] = await sequelize.query(
        `SELECT COUNT(*) FROM "Powerbases"`
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

exports.filterPowerbase = (column, operator, value, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, metadata] = await sequelize.query(
        `SELECT * FROM "Powerbases" WHERE "${column}" ${operator} '${value}' LIMIT 12 OFFSET ${offset}`
      );

      const [count, cmetadata] = await sequelize.query(
        `SELECT Count(*)::int AS total FROM "Powerbases" WHERE "${column}" ${operator} '${value}'`
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

exports.paginatedSearch = (column, value, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, metadata] = await sequelize.query(
        `SELECT * FROM "Powerbases" WHERE "${column}" ILIKE '${value}%' LIMIT 12 OFFSET ${offset}`
      );
      const [count, mdata] = await sequelize.query(
        `SELECT COUNT(*) FROM "Powerbases" WHERE "${column}" ILIKE '${value}%'`
      );
      resolve({
        data: result,
        total: count[0].count,
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
        `SELECT * FROM "Powerbases" ${
          lrnumber === "all" ? "" : `WHERE "LR_Number"= '${lrnumber}'`
        } LIMIT 10 OFFSET '${offset}'`
      );

      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*) FROM "Powerbases"`
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
    Powerbase.findAll({ where: { NewPlotNumber: id } }).then(
      (result) => {
        if (result == null) {
          reject({ status: 404, message: "Data not found" });
        }
        resolve(result);
      },
      (error) => {
        reject({ error: error });
      }
    );
  });
};

exports.findPowerbaseByNationalId = (id) => {
  return new Promise((resolve, reject) => {
    Powerbase.findAll({
      where: {
        NationalID: {
          [Op.iLike]: `%${id}%`,
        },
      },
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Powerbase Data not found" });
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

exports.findPowerbaseByPowerbaseID = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data] = await sequelize.query(
        `SELECT * FROM "Powerbase" WHERE "PowerbaseID" = '${id}'`
      );
      resolve(data);
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};

exports.findPowerbaseByOwnerName = (name, limit = 10) => {
  return new Promise((resolve, reject) => {
    Powerbase.findAll({
      where: {
        OwnerName: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit: limit,
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Powerbase Data not found" });
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

exports.findPowerbaseByParcelNumber = (pno, limit = 10) => {
  return new Promise((resolve, reject) => {
    Powerbase.findAll({
      where: {
        ParcelNo: {
          [Op.iLike]: `%${pno}%`,
        },
      },
      limit: limit,
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Powerbase Data not found" });
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

exports.findPowerbaseByPhoneNumber = (phone, limit) => {
  return new Promise((resolve, reject) => {
    Powerbase.findAll({
      where: {
        Phone: {
          [Op.iLike]: `%${phone}%`,
        },
      },
      limit: limit,
    }).then(
      (result) => {
        if (result == null) {
          reject({ error: "Powerbase Data not found" });
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

exports.updateByID = (PowerbaseDataData, id) => {
  return new Promise((resolve, reject) => {
    Powerbase.update(PowerbaseDataData, {
      where: {
        PowerbaseID: id,
      },
    }).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        console.log(err);
        reject(err);
      }
    );
  });
};

exports.findByKeyWord = (query, offset) => {
  return new Promise((resolve, reject) => {
    Powerbase.findAll({
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
          reject({ status: 404, message: "Not found!!" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: err });
      }
    );
  });
};

exports.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    Powerbase.destroy({
      where: {
        PowerbaseID: id,
      },
    }).then(
      (result) => {
        if (result != 0) resolve({ message: "Deleted Successfully" });
        else reject({ message: "Entry does not exist" });
      },
      (error) => {
        reject({ error: error });
      }
    );
  });
};

exports.findLRnumber = () => {
  return new Promise((resolve, reject) => {
    Powerbase.findAll({
      attributes: [
        Sequelize.fn("DISTINCT", Sequelize.col("LR_Number")),
        "LR_Number",
      ],
    }).then(
      async (result) => {
        const total = await Powerbase.count();

        resolve({
          result: result,
          total: total,
        });
      },
      (err) => {
        reject({ error: err });
      }
    );
  });
};

exports.findTopStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [sub] = await sequelize.query(
        `SELECT COUNT(DISTINCT "SubCounty") AS count FROM public."Powerbases"`
      );

      const [war] = await sequelize.query(
        `SELECT COUNT(DISTINCT "Ward") AS count FROM public."Powerbases"`
      );

      const [tpl] = await sequelize.query(
        `SELECT COUNT(DISTINCT "NewPlotNumber") AS count FROM public."Powerbases"`
      );

      const [mkts] = await sequelize.query(
        `SELECT COUNT(DISTINCT "Market") AS count FROM public."Powerbases"`
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

exports.findStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [sub] = await sequelize.query(
        `SELECT "Powerbase"."SubCounty", COUNT(*) AS count FROM public."Powerbase" GROUP BY "Powerbases"."SubCounty"`
      );

      const [war] = await sequelize.query(
        `SELECT "Powerbase"."Ward", COUNT(*) AS count FROM public."Powerbase" GROUP BY "Powerbases"."Ward"`
      );

      resolve({
        subcounties: sub,
        wards: war,
      });
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};
