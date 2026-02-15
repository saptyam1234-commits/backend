module.exports = function(req, res, next) {
    const userPlan = req.headers['user-plan'] || 'free';
    if(userPlan === 'expired'){
        return res.status(403).json({ message: 'Plan expired' });
    }
    next();
};
