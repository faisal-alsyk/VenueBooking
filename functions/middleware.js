let jwt = require('jsonwebtoken');
require('dotenv').config;

let authenticateToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env['SECRET'], (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let authorizeToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  let user_id = req.params.id;
  if (token) {
    jwt.verify(token, process.env['SECRET'], (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else if(decoded._id == user_id) {
        req.decoded = decoded;
        next();
      }else{
        return res.json({
          success: false,
          message: 'Token is not Valid for your ID'
        });
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let publicRoutes = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, process.env['SECRET'], (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else if(decoded._id) {
        req.decoded = decoded;
        next();
      }else{
        return res.json({
          success: false,
          message: 'Token is not Valid for your ID'
        });
      }
    });
  } else {
    let { email } = req.body;
    if ( email ) {
      next();
    }
    else {
      return res.json({
        success: false,
        message: 'Authentication Token not supplied.'
      });
    }
  }
};

module.exports = {
  authenticateToken: authenticateToken,
  authorizeToken: authorizeToken,
  publicRoutes: publicRoutes
}
