const { Sequelize, Op } = require("sequelize");
const sequelize = require("../../configs/connection");
const Auth = require("../../models/Auth")(sequelize, Sequelize);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mailer = require("../Utils/Mailer");
const getContent = require("../Utils/NewUserEmailContent");
const forgotPassword = require("../Utils/ForgotPassword");

Auth.sync({ force: false });
exports.createAuth = (AuthData) => {
  return new Promise(async (resolve, reject) => {
    if (AuthData.Password === undefined) {
      return reject({ error: "Body is required!!!" });
    }

    //Encrypt user password
    AuthData.Password = await bcrypt.hash(AuthData.Password, 10);

    //check email
    Auth.findAll({
      where: {
        Email: AuthData.Email,
      },
    }).then(
      (result) => {
        if (result.length == 0) {
          Auth.create(AuthData).then(
            async (result1) => {
              let content = await getContent.getContent(
                "Admin",
                result1.dataValues
              );
              Mailer.sendMail(
                "User Created Successfully",
                result1.dataValues.Email,
                content
              );
              resolve({ success: "User created successfully" });
            },
            (err) => {
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

exports.loginAuth = (res, AuthData) => {
  let firstTimeLogin = false;
  return new Promise(async (resolve, reject) => {
    //check email
    Auth.findAll({
      where: {
        Email: AuthData.Email,
      },
      raw: true,
    }).then(
      async (result) => {
        if (result.length === 0) reject({ error: "This user does not exist!" });
        if (
          result.length != 0 &&
          (await bcrypt.compare(AuthData.Password, result[0].Password))
        ) {
          if (await bcrypt.compare("123456", result[0].Password)) {
            firstTimeLogin = true;
          } else {
            firstTimeLogin = false;
          }
          const token = jwt.sign(
            {
              UserID: result[0].UserID,
              Name: result[0].Name,
              Email: result[0].Email,
              Position: result[0].Position,
              Department: result[0].Department,
              Status: result[0].Status,
              Role: result[0].Role,
              Phone: result[0].Phone,
              FirstTimeLogin: firstTimeLogin,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );

          res.cookie("nimda_ksa", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          resolve({ token: token, success: "Login successful" });
        } else {
          reject({ error: "Authentication failed" });
        }
      },
      (err) => {
        reject({ error: err });
      }
    );
  });
};

exports.findAuthById = (id) => {
  return new Promise((resolve, reject) => {
    Auth.findByPk(id).then(
      (result) => {
        if (result == null) {
          reject({ error: "User not found" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: err });
      }
    );
  });
};

// exports.findAuthByNationalId = (id) => {
//   return new Promise((resolve, reject) => {
//     Auth.findAll({ where: { NationalID: id } }).then(
//       (result) => {
//         if (result == null) {
//           reject({ error: "User not found" });
//         }
//         resolve(result);
//       },
//       (err) => {
//         console.log(err);
//         reject({ error: "failed" });
//       }
//     );
//   });
// };

exports.updateAuthById = async (AuthData, AuthID) => {
  if (AuthData.Password) {
    return new Promise((resolve, reject) => {
      Auth.findAll({
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
            (await bcrypt.compare(AuthData.Password, result[0].Password))
          ) {
            AuthData.Password = await bcrypt.hash(AuthData.NewPassword, 10);

            Auth.update(AuthData, {
              where: {
                UserID: AuthID,
              },
            }).then(
              (result) => {
                resolve({ success: "New password Updated Successfully!" });
              },
              (err) => {
                reject({ error: err });
              }
            );
          } else {
            reject({ error: "Old Password Incorrect" });
          }
        },
        (err) => {
          reject({ error: err });
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      Auth.update(AuthData, {
        where: {
          UserID: AuthID,
        },
      }).then(
        (result) => {
          resolve({ success: "Updated Successfully" });
        },
        (err) => {
          reject({ error: err });
        }
      );
    });
  }
};

exports.forgotPassword = async (AuthData) => {
  if (AuthData.Email) {
    return new Promise((resolve, reject) => {
      Auth.findAll({
        where: {
          Email: AuthData.Email,
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
            AuthData.Password = await bcrypt.hash(pass, 10);
            Auth.update(AuthData, {
              where: {
                Email: AuthData.Email,
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
                console.log(err);
                reject({ error: "Email not sent!" });
              }
            );
          }
        },
        (err) => {
          reject({ error: err });
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      reject({ error: "Email is required!" });
    });
  }
};

exports.deleteAuthById = (AuthID) => {
  return new Promise((resolve, reject) => {
    Auth.destroy({
      where: {
        UserID: AuthID,
      },
    }).then(
      (result) => {
        if (result != 0) resolve({ success: "Deleted successfully!!!" });
        else reject({ error: "User does not exist!!!" });
      },
      (err) => {
        reject({ error: err });
      }
    );
  });
};

exports.findAllAuth = () => {
  return new Promise((resolve, reject) => {
    Auth.findAll({}).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject({ error: err });
      }
    );
  });
};

exports.findAuthPaginated = (offset) => {
  return new Promise((resolve, reject) => {
    Auth.findAll({
      offset: offset,
      limit: 12,
    }).then(
      async (result) => {
        const count = await Auth.count();
        const active = await Auth.count({ where: { Status: true } });
        const inactive = await Auth.count({ where: { Status: false } });
        resolve({
          result: result,
          total: count,
          active: active,
          inactive: inactive,
        });
      },
      (err) => {
        reject({ error: err });
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
