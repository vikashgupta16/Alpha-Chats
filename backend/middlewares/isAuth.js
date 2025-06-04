import jwt from 'jsonwebtoken'
const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verifToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifToken);
    req.userId = verifToken.userId
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
export default isAuth