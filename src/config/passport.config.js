import passport from "passport";
import jwt from "passport-jwt";

//OJO ESTA PENDIENTE HACER UNOS CAMBIOS

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
  const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
      token = req.cookies["coderCookieToken"]; //OJO: si cambio esta llave, cambiarla también en session.router.js
    }
    return token;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse", //OJO: si cambio esta llave, cambiarla también en session.router.js
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
