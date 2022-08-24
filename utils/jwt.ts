import jwt from "jsonwebtoken";

export const jwtOptions: any = {
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
};

export function signJwt(user: any) {
  return jwt.sign(user, jwtOptions.secret, {
    // expiresIn: "10s",
  });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, jwtOptions.secret) as {
    stripe_user_id: string;
  } | null;
}
