import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
  try {
    // Try to get token from cookies first
    let token = req.cookies.token;
    
    // If no cookie token, try Authorization header (fallback for Simple Browser)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('🔑 [isAuth] Using Authorization header token for', req.method, req.path);
      }
    } else {
      console.log('🍪 [isAuth] Using cookie token for', req.method, req.path);
    }
    
    if (!token) {
      console.log('❌ [isAuth] No token found in cookies or headers for', req.method, req.path);
      console.log('🍪 [isAuth] Available cookies:', Object.keys(req.cookies));
      console.log('📋 [isAuth] Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const verifToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [isAuth] Token verified for user:', verifToken.userId, 'accessing', req.method, req.path);
    req.userId = verifToken.userId;
    next();  } catch (error) {    console.error('❌ [isAuth] Token verification failed:', error.message, 'for', req.method, req.path);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default isAuth