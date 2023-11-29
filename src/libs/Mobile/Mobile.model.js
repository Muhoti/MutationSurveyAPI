const { Sequelize, Op } = require("sequelize");
const sequelize = require("../../configs/connection");
const Mobile = require("../../models/Mobile")(sequelize, Sequelize);
const jwt = require("jsonwebtoken");
const forgotPassword = require("../Utils/ForgotPassword");
const Mailer = require("../Utils/Mailer");
const bcrypt = require("bcrypt");
const getContent = require("../Utils/NewUserEmailContent");

Mobile.sync({ force: false });
exports.createAuth = (MobileData) => {
  return new Promise(async (resolve, reject) => {
    if (MobileData.Password === undefined) {
      return reject({ error: "Body is required!!!" });
    }

    //Encrypt us\er password
    MobileData.Password = await bcrypt.hash(MobileData.Password, 10);

    //check email
    Mobile.findAll({
      where: {
        Email: MobileData.Email,
      },
    }).then(
      (result) => {
        if (result.length == 0) {
          Mobile.create(MobileData).then(
            async (result) => {
              let content = await getContent.getContent(
                result?.dataValues.Name
              );
              Mailer.sendMail(
                "User Created Successfully",
                result?.dataValues?.Email,
                content
              );
              resolve({ success: "User created successfully" });
            },
            (err) => {
              console.log(err);
              reject({ error: "User creation failed" });
            }
          );
        } else {
          reject({ error: "This user exists!!!" });
        }
      },
      (err) => {
        reject({ error: "Something went wrong" });
      }
    );
  });
};

exports.MobileLogin = (res, MobileData) => {
  return new Promise(async (resolve, reject) => {
    //check email
    if (MobileData?.Email == undefined)
      reject({ error: "Email address is required!" });
    Mobile.findAll({
      where: {
        Email: MobileData.Email,
      },
      raw: true,
    }).then(
      async (result) => {
        if (
          result.length != 0 &&
          (await bcrypt.compare(MobileData.Password, result[0].Password))
        ) {
          const token = jwt.sign(
            {
              UserID: result[0].UserID,
              Name: result[0].Name,
              Email: result[0].Email,
              Phone: result[0].Phone,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );

          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          resolve({ token: token, success: "Login successful" });
        } else {
          console.log(error);
          reject({ error: "Authentication failed" });
        }
      },
      (err) => {
        reject({ error: "Account does not exist" });
      }
    );
  });
};

exports.forgotPassword = async (MobileData) => {
  if (MobileData.Email) {
    return new Promise((resolve, reject) => {
      Mobile.findAll({
        where: {
          Email: MobileData.Email,
        },
        raw: true,
      }).then(
        async (result) => {
          if (result.length === 0) {
            reject({ error: "This user does not exist!" });
          }
          if (result.length != 0) {
            const pass = Math.random().toString(36).slice(-8);
            const name = result[0].Name;
            const email = result[0].Email;
            MobileData.Password = await bcrypt.hash(pass, 10);
            Mobile.update(MobileData, {
              where: {
                Email: MobileData.Email,
              },
            }).then(
              async (result) => {
                const content = await forgotPassword.getContent(
                  "Admin",
                  name,
                  pass
                );
                Mailer.sendMail("Password reset successful!", email, content);
                resolve({ success: "Password reset link sent to your email!" });
              },
              (err) => {
                reject({ error: "Email not sent!" });
              }
            );
          }
        },
        (err) => {
          reject({ error: "Retrieve failed" });
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      reject({ error: "Email is required!" });
    });
  }
};

exports.findAuthById = (id) => {
  return new Promise((resolve, reject) => {
    Mobile.findByPk(id).then(
      (result) => {
        if (result == null) {
          reject({ error: "User not found" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.updateAuthById = async (MobileData, AuthID) => {
  if (MobileData.Password) {
    return new Promise((resolve, reject) => {
      Mobile.findAll({
        where: {
          UserID: AuthID,
        },
        raw: true,
      }).then(
        async (result) => {
          if (result.length === 0) {
            reject({ error: "This user does not exist!" });
          }
          if (
            result.length != 0 &&
            (await bcrypt.compare(MobileData.Password, result[0].Password))
          ) {
            MobileData.Password = await bcrypt.hash(MobileData.NewPassword, 10);

            Mobile.update(MobileData, {
              where: {
                UserID: AuthID,
              },
            }).then(
              (result) => {
                resolve({ success: "New password Updated Successfully!" });
              },
              (err) => {
                reject({ error: "Retrieve failed" });
              }
            );
          } else {
            reject({ error: "Old Password Incorrect" });
          }
        },
        (err) => {
          reject({ error: "Retrieve failed" });
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      Mobile.update(MobileData, {
        where: {
          UserID: AuthID,
        },
      }).then(
        (result) => {
          resolve({ success: "Updated Successfully" });
        },
        (err) => {
          reject({ error: "Retrieve failed" });
        }
      );
    });
  }
};

exports.deleteAuthById = (AuthID) => {
  return new Promise((resolve, reject) => {
    Mobile.destroy({
      where: {
        UserID: AuthID,
      },
    }).then(
      (result) => {
        if (result != 0) resolve({ success: "Deleted successfully!!!" });
        else reject({ error: "User does not exist!!!" });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findAllAuth = () => {
  return new Promise((resolve, reject) => {
    Mobile.findAll({}).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findAuthPaginated = (offset) => {
  return new Promise((resolve, reject) => {
    Mobile.findAll({
      offset: offset,
      limit: 12,
    }).then(
      async (result) => {
        const count = await Mobile.count();
        const active = await Mobile.count({ where: { Status: true } });
        const inactive = await Mobile.count({ where: { Status: false } });
        resolve({
          result: result,
          total: count,
          active: active,
          inactive: inactive,
        });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.logout = (res) => {
  return new Promise((resolve, reject) => {
    try {
      res.cookie("nimda_ksa", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      resolve({ success: "Logout successful" });
    } catch (error) {
      reject({ error: "logout failed!" });
    }
  });
};
