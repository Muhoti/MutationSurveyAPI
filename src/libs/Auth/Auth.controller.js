const AuthModel = require("./Auth.model");

exports.insert = (req, res) => {
  AuthModel.createAuth(req.body).then(
    (result) => {
      res.status(200).send({success:"User Created successfully"});
    },
    (err) => {
      console.log(err);
      res.status(203).send(err);
    }
  );
};

exports.login = (req, res) => {
  AuthModel.loginAuth(res,req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      console.log(err);
      res.status(203).send(err);
    }
  );
};

exports.findAuthById = (req, res) => {
  AuthModel.findAuthById(req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err.success);
    }
  );
};

// exports.findAuthByNationalId = (req, res) => {
//   AuthModel.findAuthByNationalId(req.params.nationalId).then(
//     (result) => {
//       res.status(200).send(result);
//     },
//     (err) => {
//       res.status(203).send(err.success);
//     }
//   );
// };

exports.updateAuthById = (req, res) => {
  AuthModel.updateAuthById(req.body, req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.deleteAuthById = (req, res) => {
  AuthModel.deleteAuthById(req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.forgotPassword = (req, res) => {
  AuthModel.forgotPassword(req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.findAllAuth = (req, res) => {
  AuthModel.findAllAuth().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findAuthPaginated = (req, res) => {
  AuthModel.findAuthPaginated(req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.logout = (req, res) => {
  res.cookie("nimda_ksa", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).send({success:"Logout successful"});
};